#!/usr/bin/env tsx
/**
 * IndexNow submitter — announces URLs whose content actually changed.
 *
 * IndexNow (Bing, Yandex, Seznam, Naver — Google does not participate) exists
 * to tell search engines that a URL was added, updated or removed. Resubmitting
 * unchanged URLs on a quota is what the protocol asks publishers not to do, and
 * engines throttle or ignore keys that do it. So this script decides what to
 * submit by comparing the live page against a fingerprint recorded last run:
 *
 *   sitemap index → child sitemaps → fetch each page → fingerprint
 *   (title + description + H1 + main text) → diff against state → submit
 *
 * A URL is submitted only when it is in the sitemap, returns 200, is not
 * noindex, is self-canonical, and its fingerprint is new or different.
 *
 * Usage:
 *   npm run indexnow                        submit what changed
 *   npm run indexnow -- --dry-run           report, submit nothing
 *   npm run indexnow -- --all               submit every eligible URL (one-off;
 *                                           use after a launch, never on a schedule)
 *   npm run indexnow -- --base http://localhost:3000 --dry-run
 *
 * State: scripts/seo/state/indexnow.json (committed, so the next run knows
 * what the site looked like). Log: data/registry-logs/indexnow-<ts>.jsonl.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import * as cheerio from "cheerio";

const ORIGIN = "https://worldbestinsurer.com";
// Hex key per the IndexNow spec (8-128 hex chars); the file below must serve
// exactly this string. The older non-hex key file stays in place, unused.
const KEY = "c5642cdb686bb4fd27d5304f96e8a0ea";
const KEY_LOCATION = `${ORIGIN}/${KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const STATE_FILE = path.join(process.cwd(), "scripts/seo/state/indexnow.json");
const LOG_DIR = path.join(process.cwd(), "data/registry-logs");
const CONCURRENCY = 6;
const MAX_PER_REQUEST = 10_000; // IndexNow limit
const UA = "WBIBot/1.0 (IndexNow change detection; +https://worldbestinsurer.com/methodology/; contact@worldbestinsurer.com)";

interface State {
  updatedAt: string;
  base: string;
  pages: Record<string, { hash: string; lastSubmittedAt?: string }>;
}

interface PageFacts {
  url: string;
  status: number;
  hash?: string;
  skip?: string;
}

const args = process.argv.slice(2);
const flag = (name: string) => args.includes(`--${name}`);
const value = (name: string, fallback: string) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

function loadState(): State {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8")) as State;
  } catch {
    return { updatedAt: "", base: "", pages: {} };
  }
}

function saveState(state: State) {
  fs.mkdirSync(path.dirname(STATE_FILE), { recursive: true });
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + "\n");
}

function logLine(file: string, entry: Record<string, unknown>) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
  fs.appendFileSync(file, JSON.stringify({ at: new Date().toISOString(), ...entry }) + "\n");
}

async function get(url: string, tries = 3): Promise<{ status: number; body: string }> {
  for (let attempt = 1; attempt <= tries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "user-agent": UA, accept: "text/html,application/xml" },
        signal: AbortSignal.timeout(30_000),
      });
      const body = await res.text();
      if (res.status >= 500 && attempt < tries) continue;
      return { status: res.status, body };
    } catch {
      if (attempt === tries) return { status: 0, body: "" };
    }
  }
  return { status: 0, body: "" };
}

/** Every URL the site offers to search engines, read from its own sitemaps. */
async function sitemapUrls(base: string): Promise<string[]> {
  const index = await get(`${base}/sitemap.xml`);
  if (index.status !== 200) throw new Error(`sitemap.xml returned ${index.status}`);
  const locs = (xml: string) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const children = /<sitemapindex/.test(index.body) ? locs(index.body) : [];
  if (children.length === 0) return locs(index.body);

  const urls = new Set<string>();
  for (const child of children) {
    const res = await get(child.replace(ORIGIN, base));
    if (res.status !== 200) throw new Error(`${child} returned ${res.status}`);
    for (const u of locs(res.body)) urls.add(u);
  }
  return [...urls];
}

/**
 * What the page says to a search engine, minus the parts that change without
 * the content changing (scripts, styles, nav, ads).
 */
function fingerprint(html: string): { hash?: string; skip?: string; canonical?: string } {
  const $ = cheerio.load(html);
  const robots = ($('meta[name="robots"]').attr("content") ?? "").toLowerCase();
  if (robots.includes("noindex")) return { skip: "noindex" };
  const canonical = $('link[rel="canonical"]').attr("href");

  const title = ($("title").first().text() ?? "").trim();
  const description = ($('meta[name="description"]').attr("content") ?? "").trim();
  const h1 = $("h1").first().text().trim();

  $("script, style, noscript, header, footer, nav, ins").remove();
  // Separate block elements so text() does not fuse adjacent words.
  $("p, div, li, td, th, tr, dt, dd, h1, h2, h3, h4, h5, h6, section, article, br").append(" ");
  const main = ($("main").length ? $("main").text() : $("body").text())
    .replace(/\s+/g, " ")
    .trim();

  const hash = crypto.createHash("sha256").update([title, description, h1, main].join("\n")).digest("hex");
  return { hash, canonical };
}

async function pageFacts(base: string, url: string): Promise<PageFacts> {
  const res = await get(url.replace(ORIGIN, base));
  if (res.status !== 200) return { url, status: res.status, skip: `http ${res.status}` };
  const { hash, skip, canonical } = fingerprint(res.body);
  if (skip) return { url, status: res.status, skip };
  // Never announce a URL that points somewhere else as its canonical.
  const want = [url, url.replace(/\/$/, "")];
  if (canonical && !want.includes(canonical.replace(base, ORIGIN))) {
    return { url, status: res.status, skip: `canonical → ${canonical}` };
  }
  return { url, status: res.status, hash };
}

async function mapLimit<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    })
  );
  return out;
}

async function submit(urls: string[], host: string): Promise<{ ok: boolean; status: number; body: string }> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8", "user-agent": UA },
    body: JSON.stringify({ host, key: KEY, keyLocation: KEY_LOCATION, urlList: urls }),
    signal: AbortSignal.timeout(60_000),
  });
  const body = (await res.text()).slice(0, 500);
  // 200 accepted, 202 accepted pending key validation.
  return { ok: res.status === 200 || res.status === 202, status: res.status, body };
}

async function main() {
  const base = value("base", ORIGIN).replace(/\/$/, "");
  const dryRun = flag("dry-run");
  const all = flag("all");
  const limit = Number(value("limit", "0")) || 0;
  const host = new URL(ORIGIN).host;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const logFile = path.join(LOG_DIR, `indexnow-${stamp}.jsonl`);

  const state = loadState();
  const urls = await sitemapUrls(base);
  console.log(`${urls.length} URLs in sitemaps${base === ORIGIN ? "" : ` (base ${base})`}`);

  const facts = await mapLimit(urls, CONCURRENCY, (u) => pageFacts(base, u));
  const eligible = facts.filter((f) => f.hash);
  const skipped = facts.filter((f) => f.skip);

  const changed: string[] = [];
  const added: string[] = [];
  for (const f of eligible) {
    const before = state.pages[f.url];
    if (!before) added.push(f.url);
    else if (before.hash !== f.hash) changed.push(f.url);
  }
  const removed = Object.keys(state.pages).filter((u) => !eligible.some((f) => f.url === u));

  // First run has nothing to compare against: record the fingerprints and
  // submit nothing, so a fresh state file cannot turn into a mass submission.
  const seeding = Object.keys(state.pages).length === 0 && !all;
  if (seeding) console.log("first run — recording fingerprints, submitting nothing (use --all to announce every URL once)");

  // Unchanged URLs are deliberately not resubmitted: IndexNow is a change feed.
  let toSubmit = seeding ? [] : all ? eligible.map((f) => f.url) : [...added, ...changed];
  if (limit > 0 && toSubmit.length > limit) {
    console.log(`limiting to ${limit} of ${toSubmit.length} URLs`);
    toSubmit = toSubmit.slice(0, limit);
  }

  console.log(
    `eligible ${eligible.length} · new ${added.length} · changed ${changed.length} · ` +
      `gone from sitemap ${removed.length} · skipped ${skipped.length}`
  );
  for (const s of skipped.slice(0, 20)) console.log(`  skip ${s.url} — ${s.skip}`);
  if (skipped.length > 20) console.log(`  … ${skipped.length - 20} more skipped`);

  if (toSubmit.length === 0) {
    console.log("nothing to submit — no page content changed since the last run");
    logLine(logFile, { base, submitted: 0, eligible: eligible.length, skipped: skipped.length });
    if (!dryRun) saveState({ ...state, updatedAt: new Date().toISOString(), base: ORIGIN, pages: Object.fromEntries(eligible.map((f) => [f.url, { hash: f.hash!, lastSubmittedAt: state.pages[f.url]?.lastSubmittedAt }])) });
    return;
  }

  console.log(`${dryRun ? "would submit" : "submitting"} ${toSubmit.length} URL(s)`);
  const label = (u: string) => (added.includes(u) ? "new    " : changed.includes(u) ? "changed" : "all    ");
  for (const u of toSubmit.slice(0, 40)) console.log(`  ${label(u)} ${u}`);
  if (toSubmit.length > 40) console.log(`  … ${toSubmit.length - 40} more`);

  if (dryRun) {
    logLine(logFile, { base, dryRun: true, wouldSubmit: toSubmit.length, urls: toSubmit });
    return;
  }

  const now = new Date().toISOString();
  let failed = false;
  for (let i = 0; i < toSubmit.length; i += MAX_PER_REQUEST) {
    const batch = toSubmit.slice(i, i + MAX_PER_REQUEST);
    const res = await submit(batch, host);
    console.log(`  → ${ENDPOINT} ${res.status} ${res.ok ? "accepted" : "REJECTED"} ${res.ok ? "" : res.body}`);
    logLine(logFile, { base, batch: batch.length, status: res.status, ok: res.ok, body: res.ok ? undefined : res.body });
    if (!res.ok) failed = true;
  }

  const pages: State["pages"] = {};
  for (const f of eligible) {
    pages[f.url] = {
      hash: f.hash!,
      lastSubmittedAt: !failed && toSubmit.includes(f.url) ? now : state.pages[f.url]?.lastSubmittedAt,
    };
  }
  saveState({ updatedAt: now, base: ORIGIN, pages });
  console.log(`state: ${Object.keys(pages).length} URLs · ${STATE_FILE.replace(process.cwd() + "/", "")}`);
  if (failed) process.exit(1);
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
