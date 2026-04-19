/**
 * Auto-Indexing Agent for World Best Insurer
 * Submits URLs to Google Indexing API + IndexNow (Bing/Yandex)
 *
 * Google Indexing API: 200 URLs/day
 * IndexNow: Unlimited (Bing, Yandex, Seznam, Naver)
 *
 * Usage:
 *   npx tsx scripts/seo/auto-index.ts              — Submit top priority pages
 *   npx tsx scripts/seo/auto-index.ts --all         — Submit all pages (batched over days)
 *   npx tsx scripts/seo/auto-index.ts --new         — Submit only new/changed pages
 *   npx tsx scripts/seo/auto-index.ts --status      — Check indexing status
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "../../");
const DOMAIN = "https://worldbestinsurer.com";
const STATE_FILE = path.join(ROOT, "data/seo/indexing-state.json");
const LOG_FILE = path.join(ROOT, "data/seo/indexing-log.jsonl");

// ---- IndexNow (Bing, Yandex, Seznam, Naver) ----
// Static key — matches the deployed file at /public/wbi-indexnow-2026.txt
const INDEXNOW_KEY = "wbi-indexnow-2026";
const INDEXNOW_KEY_FILE = path.join(ROOT, "public", `${INDEXNOW_KEY}.txt`);

interface IndexingState {
  lastRun: string;
  totalSubmitted: number;
  googleSubmitted: string[];
  indexNowSubmitted: string[];
  dailyCount: number;
  dailyDate: string;
}

function loadState(): IndexingState {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8"));
  } catch {
    return {
      lastRun: "",
      totalSubmitted: 0,
      googleSubmitted: [],
      indexNowSubmitted: [],
      dailyCount: 0,
      dailyDate: "",
    };
  }
}

function saveState(state: IndexingState) {
  const dir = path.dirname(STATE_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function log(entry: Record<string, unknown>) {
  const dir = path.dirname(LOG_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(LOG_FILE, JSON.stringify({ timestamp: new Date().toISOString(), ...entry }) + "\n");
}

// ---- Collect all URLs from data ----
function getAllURLs(): string[] {
  const urls: string[] = [];
  const dataDir = path.join(ROOT, "src/data");
  const countryCodes = ["in", "us", "uk", "ae", "sg", "ca", "au", "de", "sa", "jp", "kr", "hk"];
  const categories = ["health", "term-life", "motor", "travel"];

  // Static pages
  urls.push("/");
  urls.push("/about/", "/contact/", "/disclaimer/", "/methodology/", "/waitlist/", "/insurers/", "/learn/", "/insights/", "/contact-directory/");

  // Country pages
  for (const cc of countryCodes) {
    urls.push(`/${cc}/`);
    for (const cat of categories) {
      urls.push(`/${cc}/compare/${cat}/`);
    }
  }

  // Legacy India category pages
  for (const cat of categories) {
    urls.push(`/compare/${cat}/`);
  }

  // Product pages
  for (const cc of countryCodes) {
    for (const cat of ["health-insurance", "term-life-insurance", "motor-insurance", "travel-insurance"]) {
      try {
        const filePath = path.join(dataDir, cc, `${cat}.json`);
        if (!fs.existsSync(filePath)) continue;
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        for (const p of data.products ?? []) {
          urls.push(`/${cc}/product/${p.id}/`);
          urls.push(`/product/${p.id}/`);
        }
      } catch {}
    }
  }

  // Insurer pages
  for (const cc of countryCodes) {
    try {
      const filePath = path.join(dataDir, cc, "insurers.json");
      if (!fs.existsSync(filePath)) continue;
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      for (const i of data.insurers ?? []) {
        urls.push(`/${cc}/insurer/${i.slug}/`);
        urls.push(`/insurer/${i.slug}/`);
      }
    } catch {}
  }

  // Learn articles
  try {
    const genFile = fs.readFileSync(path.join(ROOT, "src/lib/generators.ts"), "utf-8");
    const slugMatches = genFile.matchAll(/slug:\s*"([^"]+)"/g);
    for (const m of slugMatches) {
      urls.push(`/learn/${m[1]}/`);
    }
  } catch {}

  // City pages (top 50 per country for priority)
  for (const cc of countryCodes) {
    try {
      const filePath = path.join(dataDir, cc, "cities.json");
      if (!fs.existsSync(filePath)) continue;
      const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const cities = (data.cities ?? []).slice(0, 50);
      for (const city of cities) {
        for (const cat of categories) {
          urls.push(`/${cc}/compare/${cat}/in/${city.slug}/`);
        }
      }
    } catch {}
  }

  // Deduplicate
  return [...new Set(urls)];
}

// ---- IndexNow submission (Bing, Yandex, Seznam, Naver) ----
async function submitIndexNow(urls: string[]): Promise<{ success: number; failed: number }> {
  // Ensure key file exists
  if (!fs.existsSync(INDEXNOW_KEY_FILE)) {
    fs.writeFileSync(INDEXNOW_KEY_FILE, INDEXNOW_KEY);
    console.log(`  Created IndexNow key file: public/${INDEXNOW_KEY}.txt`);
    console.log(`  ⚠️  Push this file to GitHub for IndexNow to work\n`);
  }

  // Use static key (wbi-indexnow-2026) — already deployed to production
  const key = INDEXNOW_KEY;

  const fullUrls = urls.map(u => `${DOMAIN}${u}`);

  // Submit in batches of 100
  let success = 0;
  let failed = 0;

  for (let i = 0; i < fullUrls.length; i += 100) {
    const batch = fullUrls.slice(i, i + 100);
    try {
      const resp = await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: "worldbestinsurer.com",
          key,
          keyLocation: `${DOMAIN}/${key}.txt`,
          urlList: batch,
        }),
      });

      if (resp.ok || resp.status === 200 || resp.status === 202) {
        success += batch.length;
        console.log(`  ✅ IndexNow: Submitted batch ${Math.floor(i/100) + 1} (${batch.length} URLs)`);
      } else {
        failed += batch.length;
        console.log(`  ❌ IndexNow: Batch ${Math.floor(i/100) + 1} failed (${resp.status})`);
      }
    } catch (err) {
      failed += batch.length;
      console.log(`  ❌ IndexNow: Error — ${err}`);
    }

    // Small delay between batches
    if (i + 100 < fullUrls.length) await new Promise(r => setTimeout(r, 1000));
  }

  return { success, failed };
}

// Google's /ping?sitemap= endpoint was retired in June 2023; Bing's in 2022.
// They now return 404/410 respectively. Sitemap re-reads on Google happen via
// Search Console submission (manual) or the Indexing API (not applicable to
// this site's content types). No code-level alternative exists.

// ---- Priority-based URL selection ----
function prioritizeURLs(urls: string[]): string[] {
  const priority: { pattern: RegExp; score: number }[] = [
    { pattern: /^\/$/, score: 100 },
    { pattern: /^\/[a-z]{2}\/$/, score: 90 },
    { pattern: /^\/[a-z]{2}\/compare\//, score: 80 },
    { pattern: /^\/compare\//, score: 75 },
    { pattern: /^\/learn\//, score: 70 },
    { pattern: /^\/insurers\//, score: 65 },
    { pattern: /^\/[a-z]{2}\/insurer\//, score: 60 },
    { pattern: /^\/insurer\//, score: 55 },
    { pattern: /^\/[a-z]{2}\/product\//, score: 50 },
    { pattern: /^\/product\//, score: 45 },
    { pattern: /^\/about|contact|disclaimer|methodology/, score: 40 },
    { pattern: /\/in\//, score: 30 }, // city pages
    { pattern: /\/vs\//, score: 20 },
  ];

  return urls.sort((a, b) => {
    const scoreA = priority.find(p => p.pattern.test(a))?.score ?? 10;
    const scoreB = priority.find(p => p.pattern.test(b))?.score ?? 10;
    return scoreB - scoreA;
  });
}

// ---- Main ----
async function main() {
  const args = process.argv.slice(2);
  const isAll = args.includes("--all");
  const isNew = args.includes("--new");
  const isStatus = args.includes("--status");

  console.log("\n\x1b[36m╔══════════════════════════════════════════╗\x1b[0m");
  console.log("\x1b[36m║  🔍 World Best Insurer — Auto Indexer    ║\x1b[0m");
  console.log("\x1b[36m╚══════════════════════════════════════════╝\x1b[0m\n");

  const state = loadState();
  const today = new Date().toISOString().split("T")[0];

  // Reset daily count if new day
  if (state.dailyDate !== today) {
    state.dailyCount = 0;
    state.dailyDate = today;
  }

  if (isStatus) {
    console.log(`Last run: ${state.lastRun || "never"}`);
    console.log(`Total submitted: ${state.totalSubmitted}`);
    console.log(`Today's submissions: ${state.dailyCount}`);
    console.log(`Google submitted: ${state.googleSubmitted.length} URLs`);
    console.log(`IndexNow submitted: ${state.indexNowSubmitted.length} URLs`);
    return;
  }

  // Collect URLs
  let allUrls = getAllURLs();
  console.log(`📊 Total URLs found: ${allUrls.length}\n`);

  // Filter based on mode
  if (isNew) {
    allUrls = allUrls.filter(u => !state.indexNowSubmitted.includes(u));
    console.log(`📌 New URLs (not yet submitted): ${allUrls.length}\n`);
  }

  // Prioritize
  allUrls = prioritizeURLs(allUrls);

  // Limit for non-all mode
  if (!isAll) {
    allUrls = allUrls.slice(0, 500);
    console.log(`📌 Submitting top ${allUrls.length} priority URLs\n`);
  }

  // Submit via IndexNow (Bing, Yandex, Seznam, Naver). Google's and Bing's
  // /ping?sitemap= endpoints are retired — only IndexNow still accepts URL
  // submissions, and only non-Google engines consume it.
  console.log("📤 Submitting to IndexNow (Bing, Yandex, Seznam, Naver)...\n");
  const indexNowResult = await submitIndexNow(allUrls);

  // 3. Update state
  state.lastRun = new Date().toISOString();
  state.totalSubmitted += indexNowResult.success;
  state.dailyCount += indexNowResult.success;
  for (const url of allUrls) {
    if (!state.indexNowSubmitted.includes(url)) {
      state.indexNowSubmitted.push(url);
    }
  }

  // Keep state file manageable
  if (state.indexNowSubmitted.length > 50000) {
    state.indexNowSubmitted = state.indexNowSubmitted.slice(-30000);
  }

  saveState(state);
  log({
    action: "auto-index",
    urlsSubmitted: allUrls.length,
    indexNowSuccess: indexNowResult.success,
    indexNowFailed: indexNowResult.failed,
  });

  // Summary
  console.log("\n\x1b[32m══════════════════════════════════════════\x1b[0m");
  console.log(`\x1b[32m✅ Indexing complete!\x1b[0m`);
  console.log(`   IndexNow: ${indexNowResult.success} submitted, ${indexNowResult.failed} failed`);
  console.log(`   Google: submit sitemap in Search Console (no API path for this site)`);
  console.log(`   Total submitted today: ${state.dailyCount}`);
  console.log(`   Total all-time: ${state.totalSubmitted}`);
  console.log("\x1b[32m══════════════════════════════════════════\x1b[0m\n");

  console.log("💡 Tips:");
  console.log("   - Run daily: npm run index");
  console.log("   - Submit all: npm run index:all");
  console.log("   - Check status: npm run index:status");
  console.log("   - For Google Indexing API, set up a service account at console.cloud.google.com\n");
}

main().catch(console.error);
