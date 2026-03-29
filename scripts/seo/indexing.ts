#!/usr/bin/env npx tsx
/**
 * Google Indexing Script for Zura Insurance
 *
 * Two modes:
 *  1. Sitemap ping  — notify Google of the sitemap (no credentials needed)
 *  2. Indexing API  — submit individual URLs for faster indexing
 *                     (requires Google service account JSON key)
 *
 * Usage:
 *   npx tsx scripts/seo/indexing.ts ping
 *   npx tsx scripts/seo/indexing.ts submit --key ./service-account.json
 *   npx tsx scripts/seo/indexing.ts submit --key ./service-account.json --limit 100
 */

import * as fs from "fs";
import * as https from "https";
import * as path from "path";

const BASE_URL = "https://worldbestinsurer.com";

// ---- Sitemap ping ----

/**
 * Google deprecated the /ping?sitemap= endpoint in 2023.
 * This function verifies the sitemap is accessible and prints
 * manual instructions for Google Search Console submission.
 */
async function pingSitemap(): Promise<void> {
  const sitemapUrl = `${BASE_URL}/sitemap.xml`;

  console.log("\n[indexing] Verifying sitemap is accessible...");
  console.log(`  Sitemap: ${sitemapUrl}`);

  const res = await fetch(sitemapUrl, { method: "GET" });
  if (res.ok) {
    console.log(`  ✓ Sitemap is live (HTTP ${res.status})`);
  } else {
    console.warn(`  ✗ Sitemap returned HTTP ${res.status} — fix this first!`);
    return;
  }

  // Bing still supports the ping endpoint
  const bingPingUrl = `https://www.bing.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`;
  try {
    const bingRes = await fetch(bingPingUrl, { method: "GET" });
    if (bingRes.ok || bingRes.status === 200) {
      console.log(`  ✓ Bing notified (HTTP ${bingRes.status})`);
    } else {
      console.log(`  ⚠ Bing returned HTTP ${bingRes.status}`);
    }
  } catch {
    console.log("  ⚠ Bing ping failed (non-critical)");
  }

  console.log(`
  ──────────────────────────────────────────────────────
  Google deprecated the /ping endpoint in 2023.
  Submit your sitemap manually in Search Console:

  1. Go to https://search.google.com/search-console
  2. Select property: ${BASE_URL}
  3. Click "Sitemaps" in the left menu
  4. Enter: sitemap.xml  →  click Submit

  For faster indexing of specific URLs, use:
    npx tsx scripts/seo/indexing.ts submit --key ./service-account.json
  ──────────────────────────────────────────────────────
`);
}

// ---- Google Indexing API ----

interface ServiceAccount {
  client_email: string;
  private_key: string;
  project_id: string;
}

/**
 * Create a signed JWT for Google OAuth2 service account.
 */
async function createJWT(serviceAccount: ServiceAccount): Promise<string> {
  const header = { alg: "RS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: serviceAccount.client_email,
    sub: serviceAccount.client_email,
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
    scope: "https://www.googleapis.com/auth/indexing",
  };

  const encode = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url");

  const unsignedToken = `${encode(header)}.${encode(payload)}`;

  // Use Node.js crypto to sign with RS256
  const { createSign } = await import("crypto");
  const sign = createSign("RSA-SHA256");
  sign.update(unsignedToken);
  const signature = sign
    .sign(serviceAccount.private_key)
    .toString("base64url");

  return `${unsignedToken}.${signature}`;
}

/**
 * Exchange JWT for an OAuth2 access token.
 */
async function getAccessToken(serviceAccount: ServiceAccount): Promise<string> {
  const jwt = await createJWT(serviceAccount);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Failed to get access token: ${res.status} ${body}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

/**
 * Submit a single URL to Google Indexing API.
 */
async function submitUrl(
  url: string,
  accessToken: string
): Promise<{ url: string; status: "ok" | "error"; message?: string }> {
  try {
    const res = await fetch(
      "https://indexing.googleapis.com/v3/urlNotifications:publish",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, type: "URL_UPDATED" }),
      }
    );

    if (res.ok) {
      return { url, status: "ok" };
    }

    const body = await res.text();
    return { url, status: "error", message: `HTTP ${res.status}: ${body}` };
  } catch (err) {
    return {
      url,
      status: "error",
      message: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Fetch all URLs from the sitemap index.
 */
async function fetchSitemapUrls(): Promise<string[]> {
  const urls: string[] = [];

  // Actual sitemap filenames in /public/
  const sitemapFiles = [
    "sitemap-pages.xml",
    "sitemap-products.xml",
    "sitemap-insurers.xml",
    "sitemap-vs-0.xml",
    "sitemap-cities-0.xml",
    "sitemap-learn.xml",
  ];

  for (const id of sitemapFiles) {
    try {
      const res = await fetch(`${BASE_URL}/${id}`);
      if (!res.ok) continue;
      const xml = await res.text();

      // Extract <loc> tags
      const matches = xml.matchAll(/<loc>([^<]+)<\/loc>/g);
      for (const m of matches) {
        urls.push(m[1].trim());
      }
    } catch {
      // skip failed sitemaps
    }
  }

  return urls;
}

/**
 * Submit URLs to Google Indexing API with rate limiting.
 * Google allows 200 requests/day on the free quota.
 */
async function submitToIndexingAPI(
  keyPath: string,
  limit: number
): Promise<void> {
  if (!fs.existsSync(keyPath)) {
    console.error(`\n[indexing] Service account key not found: ${keyPath}`);
    console.error("  Download it from Google Cloud Console > IAM > Service Accounts\n");
    process.exit(1);
  }

  const serviceAccount: ServiceAccount = JSON.parse(
    fs.readFileSync(keyPath, "utf-8")
  );

  console.log(`\n[indexing] Authenticating as ${serviceAccount.client_email}`);
  const accessToken = await getAccessToken(serviceAccount);
  console.log("  ✓ Access token obtained");

  // Fetch URLs from sitemap
  console.log("\n[indexing] Fetching URLs from sitemap...");
  let urls = await fetchSitemapUrls();

  if (urls.length === 0) {
    // Fallback: build priority URLs manually
    urls = [
      BASE_URL,
      `${BASE_URL}/compare/health`,
      `${BASE_URL}/compare/term-life`,
      `${BASE_URL}/compare/motor`,
      `${BASE_URL}/compare/travel`,
      `${BASE_URL}/insurers`,
      `${BASE_URL}/learn`,
      `${BASE_URL}/about`,
      `${BASE_URL}/methodology`,
    ];
    console.log(`  ⚠ Sitemap fetch failed — using ${urls.length} priority URLs`);
  } else {
    console.log(`  ✓ Found ${urls.length} URLs`);
  }

  // Apply limit (Google free quota: 200/day)
  const toSubmit = urls.slice(0, Math.min(limit, 200));
  console.log(`\n[indexing] Submitting ${toSubmit.length} URLs (limit: ${limit}, quota: 200/day)`);
  console.log("─".repeat(60));

  let ok = 0;
  let errors = 0;
  const errorLog: string[] = [];

  for (let i = 0; i < toSubmit.length; i++) {
    const url = toSubmit[i];
    const result = await submitUrl(url, accessToken);

    if (result.status === "ok") {
      ok++;
      process.stdout.write(`  [${i + 1}/${toSubmit.length}] ✓ ${url}\n`);
    } else {
      errors++;
      errorLog.push(`${url}: ${result.message}`);
      process.stdout.write(`  [${i + 1}/${toSubmit.length}] ✗ ${url} — ${result.message}\n`);
    }

    // Rate limit: ~1 req/sec to stay within quota
    if (i < toSubmit.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  console.log("\n" + "─".repeat(60));
  console.log(`[indexing] Done: ${ok} submitted, ${errors} errors`);

  if (errorLog.length > 0) {
    const logPath = path.join("data", "reports", `indexing-errors-${Date.now()}.txt`);
    fs.mkdirSync(path.dirname(logPath), { recursive: true });
    fs.writeFileSync(logPath, errorLog.join("\n"), "utf-8");
    console.log(`  Errors saved to ${logPath}`);
  }

  console.log(`\n  Monitor progress at: https://search.google.com/search-console\n`);
}

// ---- CLI ----

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === "help") {
    console.log(`
Google Indexing for Zura Insurance

Usage:
  npx tsx scripts/seo/indexing.ts ping
    Notify Google/Bing of the sitemap (no credentials needed)

  npx tsx scripts/seo/indexing.ts submit --key ./service-account.json
    Submit all URLs via Google Indexing API (requires service account)

  npx tsx scripts/seo/indexing.ts submit --key ./service-account.json --limit 50
    Submit first 50 URLs only (Google free quota: 200/day)

Setup for Indexing API:
  1. Go to https://console.cloud.google.com
  2. Enable "Web Search Indexing API"
  3. Create a Service Account and download the JSON key
  4. In Google Search Console, add the service account email as an Owner
`);
    return;
  }

  if (command === "ping") {
    await pingSitemap();
    return;
  }

  if (command === "submit") {
    const keyIdx = args.indexOf("--key");
    const limitIdx = args.indexOf("--limit");

    if (keyIdx === -1 || !args[keyIdx + 1]) {
      console.error("\n[indexing] --key <path> is required for submit\n");
      process.exit(1);
    }

    const keyPath = path.resolve(args[keyIdx + 1]);
    const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : 200;

    await submitToIndexingAPI(keyPath, limit);
    return;
  }

  console.error(`\nUnknown command: ${command}\nRun with 'help' for usage.\n`);
  process.exit(1);
}

main().catch((err) => {
  console.error("\n[indexing] Fatal error:", err.message ?? err);
  process.exit(1);
});
