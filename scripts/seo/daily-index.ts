/**
 * Daily Auto-Index Agent — Submits URLs to search engines every day.
 * Tracks progress so it never double-submits.
 *
 * Usage:
 *   npx tsx scripts/seo/daily-index.ts              — Submit next 10 URLs
 *   npx tsx scripts/seo/daily-index.ts --count 20   — Submit 20 URLs
 *   npx tsx scripts/seo/daily-index.ts --status      — Show progress
 *   npx tsx scripts/seo/daily-index.ts --reset       — Start over
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "../../");
const STATE_FILE = path.join(ROOT, "data/seo/daily-index-state.json");
const DOMAIN = "https://worldbestinsurer.com";

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// ── Build prioritized URL list ──
function getAllURLs(): { url: string; priority: number; tier: string }[] {
  const urls: { url: string; priority: number; tier: string }[] = [];
  const dataDir = path.join(ROOT, "src/data");
  const countries = ["in", "us", "uk", "ae", "sg", "ca", "au", "de", "sa", "jp", "kr", "hk"];

  // Tier 1: Homepage + core (priority 100)
  ["/", "/compare/health/", "/compare/term-life/", "/compare/motor/", "/compare/travel/",
   "/insurers/", "/learn/", "/about/", "/contact/", "/methodology/", "/disclaimer/", "/waitlist/"
  ].forEach(u => urls.push({ url: `${DOMAIN}${u}`, priority: 100, tier: "core" }));

  // Tier 2: Country pages (priority 90)
  for (const cc of countries) {
    urls.push({ url: `${DOMAIN}/${cc}/`, priority: 90, tier: "country" });
    for (const cat of ["health", "term-life", "motor", "travel"]) {
      urls.push({ url: `${DOMAIN}/${cc}/compare/${cat}/`, priority: 85, tier: "country-cat" });
    }
  }

  // Tier 3: Articles (priority 80)
  try {
    const gen = fs.readFileSync(path.join(ROOT, "src/lib/generators.ts"), "utf-8");
    const slugs = [...gen.matchAll(/slug:\s*"([^"]+)"/g)].map(m => m[1]);
    for (const s of slugs) {
      urls.push({ url: `${DOMAIN}/learn/${s}/`, priority: 80, tier: "article" });
    }
  } catch {}

  // Tier 4: Insurer pages (priority 75)
  for (const cc of countries) {
    try {
      const d = JSON.parse(fs.readFileSync(path.join(dataDir, cc, "insurers.json"), "utf-8"));
      for (const ins of d.insurers || []) {
        urls.push({ url: `${DOMAIN}/${cc}/insurer/${ins.slug}/`, priority: 75, tier: "insurer" });
      }
    } catch {}
  }

  // Tier 5: Product pages (priority 70)
  for (const cc of countries) {
    for (const f of ["health-insurance", "term-life-insurance", "motor-insurance", "travel-insurance"]) {
      try {
        const d = JSON.parse(fs.readFileSync(path.join(dataDir, cc, `${f}.json`), "utf-8"));
        for (const p of d.products || []) {
          urls.push({ url: `${DOMAIN}/${cc}/product/${p.id}/`, priority: 70, tier: "product" });
        }
      } catch {}
    }
  }

  // Sort by priority, deduplicate
  urls.sort((a, b) => b.priority - a.priority);
  const seen = new Set<string>();
  return urls.filter(u => { if (seen.has(u.url)) return false; seen.add(u.url); return true; });
}

// ── State ──
interface State {
  submitted: Record<string, string>; // url -> date
  lastRun: string;
  history: { date: string; count: number }[];
}

function loadState(): State {
  try { return JSON.parse(fs.readFileSync(STATE_FILE, "utf-8")); }
  catch { return { submitted: {}, lastRun: "", history: [] }; }
}

function saveState(s: State) {
  ensureDir(path.dirname(STATE_FILE));
  fs.writeFileSync(STATE_FILE, JSON.stringify(s, null, 2));
}

// ── Ping search engines ──
async function pingGoogle(url: string): Promise<boolean> {
  try {
    const r = await fetch(`https://www.google.com/ping?sitemap=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(8000) });
    return r.ok;
  } catch { return false; }
}

async function pingBing(url: string): Promise<boolean> {
  try {
    const r = await fetch(`https://www.bing.com/ping?sitemap=${encodeURIComponent(url)}`, { signal: AbortSignal.timeout(8000) });
    return r.ok;
  } catch { return false; }
}

async function submitIndexNow(urls: string[]): Promise<boolean> {
  try {
    const r = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "worldbestinsurer.com",
        key: "wbi-indexnow-2026",
        urlList: urls.slice(0, 10000),
      }),
      signal: AbortSignal.timeout(15000),
    });
    return r.ok || r.status === 202;
  } catch { return false; }
}

// ── Main ──
async function run(count: number) {
  console.log("\n\x1b[36m🔍 Daily Auto-Index Agent — World Best Insurer\x1b[0m\n");

  const all = getAllURLs();
  const state = loadState();
  const pending = all.filter(u => !state.submitted[u.url]);
  const batch = pending.slice(0, count);

  console.log(`  Total URLs:     ${all.length}`);
  console.log(`  Submitted:      ${Object.keys(state.submitted).length}`);
  console.log(`  Remaining:      ${pending.length}`);
  console.log(`  This batch:     ${batch.length}\n`);

  if (batch.length === 0) {
    console.log("\x1b[32m✓ All URLs submitted! Nothing to do.\x1b[0m\n");
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  let ok = 0;

  for (let i = 0; i < batch.length; i++) {
    const { url, tier } = batch[i];
    const short = url.replace(DOMAIN, "");
    process.stdout.write(`  [${i + 1}/${batch.length}] ${tier.padEnd(14)} ${short} `);

    const success = await pingGoogle(url);
    state.submitted[url] = today;

    if (success) { ok++; console.log("\x1b[32m✓\x1b[0m"); }
    else { console.log("\x1b[33m⚠\x1b[0m"); }

    if (i < batch.length - 1) await new Promise(r => setTimeout(r, 1500));
  }

  // IndexNow for Bing/Yandex
  console.log("\n  → IndexNow (Bing/Yandex)...");
  const inOk = await submitIndexNow(batch.map(b => b.url));
  console.log(inOk ? "    \x1b[32m✓ Accepted\x1b[0m" : "    \x1b[33m⚠ Unavailable\x1b[0m");

  // Ping sitemaps
  console.log("  → Pinging sitemaps...");
  await pingGoogle(`${DOMAIN}/sitemap.xml`);
  await pingBing(`${DOMAIN}/sitemap.xml`);
  console.log("    \x1b[32m✓ Done\x1b[0m");

  // Save
  state.lastRun = new Date().toISOString();
  state.history.push({ date: today, count: batch.length });
  saveState(state);

  const total = Object.keys(state.submitted).length;
  console.log(`\n\x1b[36m── Result ──\x1b[0m`);
  console.log(`  Pinged:     ${ok}/${batch.length}`);
  console.log(`  Progress:   ${total}/${all.length} (${((total / all.length) * 100).toFixed(1)}%)`);
  console.log(`  Remaining:  ${all.length - total}\n`);
}

function showStatus() {
  const all = getAllURLs();
  const state = loadState();
  const total = Object.keys(state.submitted).length;

  console.log("\n\x1b[36m📊 Indexing Progress\x1b[0m\n");
  console.log(`  Total URLs:   ${all.length}`);
  console.log(`  Submitted:    ${total}`);
  console.log(`  Remaining:    ${all.length - total}`);
  console.log(`  Progress:     ${((total / all.length) * 100).toFixed(1)}%`);
  console.log(`  Last run:     ${state.lastRun || "never"}`);

  // Tier breakdown
  const tiers: Record<string, { total: number; done: number }> = {};
  for (const u of all) {
    if (!tiers[u.tier]) tiers[u.tier] = { total: 0, done: 0 };
    tiers[u.tier].total++;
    if (state.submitted[u.url]) tiers[u.tier].done++;
  }
  console.log("\n  Tier breakdown:");
  for (const [t, d] of Object.entries(tiers)) {
    const bar = "█".repeat(Math.round((d.done / d.total) * 20)).padEnd(20, "░");
    console.log(`    ${t.padEnd(16)} ${bar} ${d.done}/${d.total}`);
  }

  if (state.history.length > 0) {
    console.log("\n  Recent runs:");
    for (const h of state.history.slice(-7)) {
      console.log(`    ${h.date} — ${h.count} URLs`);
    }
  }
  console.log("");
}

// ── CLI ──
const args = process.argv.slice(2);
if (args.includes("--status")) { showStatus(); }
else if (args.includes("--reset")) {
  ensureDir(path.dirname(STATE_FILE));
  fs.writeFileSync(STATE_FILE, JSON.stringify({ submitted: {}, lastRun: "", history: [] }));
  console.log("\n\x1b[32m✓ Reset complete.\x1b[0m\n");
}
else {
  const ci = args.indexOf("--count");
  const count = ci >= 0 ? parseInt(args[ci + 1]) || 10 : 10;
  run(count).catch(console.error);
}
