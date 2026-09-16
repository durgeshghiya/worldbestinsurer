/**
 * SEO page audit — runs against a live or local server, the way a crawler
 * sees the site. Writes docs/seo-audit-report.md.
 *
 *   npm run build && npm run start &
 *   npm run registry -- seo-audit --base http://localhost:3000
 *
 * Checks
 *   baseline    every URL that worked before the registry still resolves
 *   robots      sitemap declared, protected paths disallowed, assets not blocked
 *   sitemap     index resolves; every child URL is 200, canonical, indexable
 *   per page    title, description, canonical, one H1, valid JSON-LD, no rating
 *               schema, no noindex, not thin; registry pages show a source and
 *               a last-updated date
 *   site-wide   duplicate titles/descriptions, orphan pages, broken internal links
 */

import fs from "fs";
import path from "path";
import * as cheerio from "cheerio";

interface PageFacts {
  url: string;
  status: number;
  location?: string;
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  h1Count?: number;
  words?: number;
  jsonLdTypes?: string[];
  jsonLdErrors?: string[];
  hasRatingSchema?: boolean;
  hasSourceLine?: boolean;
  hasLastUpdated?: boolean;
  links?: string[];
}

interface Finding {
  severity: "error" | "warning";
  check: string;
  url: string;
  detail: string;
}

const ORIGIN = "https://worldbestinsurer.com";
const THIN_WORDS = 150;
const CONCURRENCY = 8;

async function pool<T, R>(items: T[], n: number, fn: (t: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  await Promise.all(
    Array.from({ length: n }, async () => {
      while (i < items.length) {
        const k = i++;
        out[k] = await fn(items[k]);
      }
    })
  );
  return out;
}

function toLocal(u: string, base: string): string {
  return u.startsWith(ORIGIN) ? base + u.slice(ORIGIN.length) : u;
}
function toPath(u: string): string {
  try {
    return new URL(u).pathname;
  } catch {
    return u;
  }
}

async function get(url: string): Promise<{ status: number; location?: string; body: string; type: string }> {
  const res = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(60_000) });
  const type = res.headers.get("content-type") ?? "";
  const body = type.includes("html") || type.includes("xml") || type.includes("text") ? await res.text() : "";
  return { status: res.status, location: res.headers.get("location") ?? undefined, body, type };
}

async function inspectPage(pathname: string, base: string): Promise<PageFacts> {
  const r = await get(base + pathname);
  const f: PageFacts = { url: pathname, status: r.status, location: r.location };
  if (r.status !== 200 || !r.type.includes("html")) return f;
  const $ = cheerio.load(r.body);
  f.title = $("title").first().text().trim();
  f.description = $('meta[name="description"]').attr("content")?.trim();
  f.canonical = $('link[rel="canonical"]').attr("href");
  f.robots = $('meta[name="robots"]').attr("content");
  f.h1Count = $("h1").length;
  f.jsonLdTypes = [];
  f.jsonLdErrors = [];
  $('script[type="application/ld+json"]').each((_, el) => {
    const raw = $(el).text();
    try {
      const data = JSON.parse(raw);
      for (const node of Array.isArray(data) ? data : [data]) {
        if (!node["@context"] || !node["@type"]) f.jsonLdErrors!.push("block missing @context or @type");
        else f.jsonLdTypes!.push(String(node["@type"]));
      }
      if (/"@type"\s*:\s*"(AggregateRating|Review)"/.test(raw)) f.hasRatingSchema = true;
    } catch (e) {
      f.jsonLdErrors!.push(`invalid JSON: ${String(e).slice(0, 80)}`);
    }
  });
  const links = new Set<string>();
  $("a[href]").each((_, el) => {
    const h = $(el).attr("href") ?? "";
    if (h.startsWith("/") && !h.startsWith("//")) links.add(h.split("#")[0].split("?")[0]);
    else if (h.startsWith(ORIGIN)) links.add(toPath(h));
  });
  f.links = [...links];
  $("script, style, noscript, header, footer, nav").remove();
  // .text() joins adjacent blocks with no whitespace ("…2026Source:"), which
  // hides labels from \b and merges words. Separate block-level elements.
  $("p, div, li, td, th, tr, dt, dd, h1, h2, h3, h4, h5, h6, section, article, br").append(" ");
  const text = $("main").length ? $("main").text() : $("body").text();
  f.words = text.split(/\s+/).filter(Boolean).length;
  f.hasSourceLine = /\bSource:/.test(text);
  f.hasLastUpdated = /\bLast updated:/i.test(text);
  return f;
}

async function sitemapUrls(base: string, findings: Finding[]): Promise<{ urls: string[]; children: string[] }> {
  const root = await get(`${base}/sitemap.xml`);
  if (root.status !== 200) {
    findings.push({ severity: "error", check: "sitemap", url: "/sitemap.xml", detail: `HTTP ${root.status}` });
    return { urls: [], children: [] };
  }
  const $ = cheerio.load(root.body, { xml: true });
  const children = $("sitemapindex > sitemap > loc").map((_, el) => $(el).text().trim()).get();
  const urls: string[] = [];
  if (children.length === 0) {
    urls.push(...$("urlset > url > loc").map((_, el) => $(el).text().trim()).get());
  }
  for (const child of children) {
    const c = await get(toLocal(child, base));
    if (c.status !== 200) {
      findings.push({ severity: "error", check: "sitemap", url: toPath(child), detail: `child sitemap HTTP ${c.status}` });
      continue;
    }
    const $$ = cheerio.load(c.body, { xml: true });
    urls.push(...$$("urlset > url > loc").map((_, el) => $$(el).text().trim()).get());
  }
  return { urls, children: children.map(toPath) };
}

export async function runSeoAudit(opts: { base?: string } = {}): Promise<void> {
  const base = (opts.base ?? "http://localhost:3000").replace(/\/$/, "");
  const findings: Finding[] = [];
  const add = (severity: Finding["severity"], check: string, url: string, detail: string) =>
    findings.push({ severity, check, url, detail });

  // ── robots ──
  const robots = await get(`${base}/robots.txt`);
  if (robots.status !== 200) add("error", "robots", "/robots.txt", `HTTP ${robots.status}`);
  else {
    if (!/^sitemap:\s*\S+/im.test(robots.body)) add("error", "robots", "/robots.txt", "no Sitemap line");
    for (const p of ["/api/", "/admin/"]) {
      if (!new RegExp(`^disallow:\\s*${p.replace(/\//g, "\\/")}`, "im").test(robots.body))
        add("error", "robots", "/robots.txt", `${p} is not disallowed`);
    }
    for (const p of ["/_next/", ".css", ".js"]) {
      if (new RegExp(`^disallow:\\s*\\S*${p.replace(/[./]/g, (m) => "\\" + m)}`, "im").test(robots.body))
        add("error", "robots", "/robots.txt", `${p} is blocked — Google cannot render pages`);
    }
    if (/^disallow:\s*\/\s*$/im.test(robots.body)) add("error", "robots", "/robots.txt", "a group disallows the whole site");
  }

  // ── sitemap ──
  const { urls, children } = await sitemapUrls(base, findings);
  const sitemapPaths = [...new Set(urls.map(toPath))];
  const dupesInSitemap = urls.length - new Set(urls).size;
  if (dupesInSitemap) add("error", "sitemap", "/sitemap.xml", `${dupesInSitemap} duplicate URL(s)`);
  for (const u of urls) {
    if (!u.startsWith(ORIGIN)) add("error", "sitemap", u, "URL is not on the canonical origin");
    if (!u.endsWith("/")) add("error", "sitemap", u, "missing trailing slash (would 308)");
    if (/[?#]/.test(u)) add("error", "sitemap", u, "parameter or fragment URL in sitemap");
  }

  // ── baseline: nothing that worked before may break ──
  const baselineFile = path.join(process.cwd(), "scripts/registry/reports/baseline-urls.txt");
  const baseline = fs.existsSync(baselineFile)
    ? fs.readFileSync(baselineFile, "utf-8").split("\n").map((l) => l.trim()).filter(Boolean)
    : [];

  // ── crawl: sitemap URLs, then everything they link to (one hop) ──
  const toVisit = [...new Set([...sitemapPaths, ...baseline])];
  const facts = new Map<string, PageFacts>();
  for (const f of await pool(toVisit, CONCURRENCY, (p) => inspectPage(p, base))) facts.set(f.url, f);
  const discovered = new Set<string>();
  for (const f of facts.values()) for (const l of f.links ?? []) if (!facts.has(l)) discovered.add(l);
  const linkTargets = [...discovered].filter((l) => !/\.(xml|txt|png|jpg|svg|ico|pdf)$/.test(l));
  for (const f of await pool(linkTargets, CONCURRENCY, (p) => inspectPage(p, base))) facts.set(f.url, f);

  for (const p of baseline) {
    const f = facts.get(p)!;
    if (f.status !== 200) add("error", "baseline", p, `was 200 before the registry, now HTTP ${f.status}${f.location ? ` → ${f.location}` : ""}`);
  }

  // ── per sitemap page ──
  const inbound = new Map<string, number>();
  for (const f of facts.values()) for (const l of f.links ?? []) if (l !== f.url) inbound.set(l, (inbound.get(l) ?? 0) + 1);

  const titles = new Map<string, string[]>();
  const descs = new Map<string, string[]>();
  let registryPages = 0;
  for (const p of sitemapPaths) {
    const f = facts.get(p)!;
    if (f.status !== 200) {
      add("error", "status", p, `sitemap URL returns HTTP ${f.status}${f.location ? ` → ${f.location}` : ""}`);
      continue;
    }
    if (/noindex/i.test(f.robots ?? "")) add("error", "indexability", p, "noindex page is in the sitemap");
    if (!f.title) add("error", "title", p, "missing <title>");
    else (titles.get(f.title) ?? titles.set(f.title, []).get(f.title)!).push(p);
    if (!f.description) add("warning", "description", p, "missing meta description");
    else (descs.get(f.description) ?? descs.set(f.description, []).get(f.description)!).push(p);
    const expected = `${ORIGIN}${p}`;
    if (!f.canonical) add("error", "canonical", p, "missing canonical");
    else if (f.canonical !== expected && f.canonical !== expected.replace(/\/$/, ""))
      add("error", "canonical", p, `canonical points elsewhere: ${f.canonical}`);
    if (f.h1Count === 0) add("error", "h1", p, "no H1");
    if ((f.h1Count ?? 0) > 1) add("warning", "h1", p, `${f.h1Count} H1 elements`);
    for (const e of f.jsonLdErrors ?? []) add("error", "json-ld", p, e);
    if (f.hasRatingSchema) add("error", "json-ld", p, "rating or review schema present");
    if ((f.words ?? 0) < THIN_WORDS) add("warning", "thin", p, `${f.words} words of main content`);
    if (p !== "/" && !inbound.get(p)) add("error", "orphan", p, "no internal link points here");
    const isRegistry = /^\/in\/(insurer|product)\//.test(p) || p.startsWith("/in/products/") || p.startsWith("/in/insurance-statistics/");
    if (isRegistry && f.hasSourceLine === false && /^\/in\/(products|insurance-statistics)\//.test(p))
      add("warning", "provenance", p, "registry page shows no “Source:” line");
    if (isRegistry && f.hasSourceLine) {
      registryPages++;
      if (!f.hasLastUpdated) add("error", "freshness", p, "registry page has a source but no “Last updated”");
    }
  }
  for (const [t, ps] of titles) if (ps.length > 1) add("error", "duplicate-title", ps[0], `"${t}" also on ${ps.slice(1).join(", ")}`);
  for (const [d, ps] of descs) if (ps.length > 1) add("warning", "duplicate-description", ps[0], `shared by ${ps.length} pages: ${d.slice(0, 60)}…`);

  // ── broken internal links ──
  for (const f of facts.values()) {
    if (f.status === 404) {
      const from = [...facts.values()].filter((x) => x.links?.includes(f.url)).map((x) => x.url).slice(0, 3);
      if (from.length) add("error", "broken-link", f.url, `404, linked from ${from.join(", ")}`);
    }
  }

  // ── report ──
  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "warning");
  const byCheck = new Map<string, Finding[]>();
  for (const f of findings) (byCheck.get(f.check) ?? byCheck.set(f.check, []).get(f.check)!).push(f);
  const at = new Date().toISOString().slice(0, 16).replace("T", " ");

  const lines: string[] = [
    "# SEO audit report",
    "",
    `Generated ${at} UTC against \`${base}\` by \`npm run registry -- seo-audit\`.`,
    "",
    `**${errors.length === 0 ? "PASS" : "FAIL"}** — ${errors.length} error(s), ${warnings.length} warning(s).`,
    "",
    "| Measure | Value |",
    "| --- | ---: |",
    `| Sitemap files | ${children.length || 1} |`,
    `| URLs in sitemaps | ${urls.length} |`,
    `| Baseline URLs re-checked | ${baseline.length} |`,
    `| Pages fetched | ${facts.size} |`,
    `| Registry pages with a source line | ${registryPages} |`,
    "",
  ];
  if (children.length) {
    lines.push("Child sitemaps:", "", ...children.map((c) => `- \`${c}\``), "");
  }
  if (!findings.length) lines.push("No findings.");
  for (const [check, fs_] of [...byCheck].sort()) {
    lines.push(`## ${check} (${fs_.length})`, "", "| Severity | URL | Detail |", "| --- | --- | --- |");
    for (const f of fs_.slice(0, 100)) lines.push(`| ${f.severity} | \`${f.url}\` | ${f.detail.replace(/\|/g, "\\|")} |`);
    if (fs_.length > 100) lines.push(`| … | | ${fs_.length - 100} more |`);
    lines.push("");
  }
  const out = path.join(process.cwd(), "docs/seo-audit-report.md");
  fs.writeFileSync(out, lines.join("\n") + "\n");
  console.log(`${errors.length} error(s), ${warnings.length} warning(s) → ${path.relative(process.cwd(), out)}`);
  if (errors.length) process.exitCode = 1;
}
