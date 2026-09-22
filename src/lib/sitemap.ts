/**
 * Sitemap entries, grouped by page type.
 *
 * /sitemap.xml is an index over these groups (plan §11). Every group reads
 * indexability from the same functions the pages use for their robots tag,
 * so a URL cannot be listed here while the page says noindex.
 *
 * lastmod is emitted only where a real date exists. A build timestamp on
 * every URL tells crawlers nothing and trains them to ignore the field.
 */

import { getAllInsurers, getAllProducts, getProductsByInsurer } from "@/lib/data";
import { VALID_COUNTRY_CODES } from "@/lib/countries";
import { getIndexableArticles } from "@/lib/generators";
import { getAllFinanceArticles } from "@/lib/finance";
import { getAllReports } from "@/lib/reports";
import {
  insurerVerdict,
  insurerView,
  latest,
  periodSlug,
  productDirectoryVerdict,
  productVerdict,
  siteProductVerdict,
  registry,
  siteFacts,
  statisticsHubVerdict,
  statisticsPeriodVerdict,
} from "@/lib/registry";

export const SITE = "https://worldbestinsurer.com";

export const SITEMAP_GROUPS = ["core", "insurers", "products", "categories", "editorial", "statistics"] as const;
export type SitemapGroup = (typeof SITEMAP_GROUPS)[number];

export interface SitemapEntry {
  path: string;
  lastmod?: string;
}

const CATEGORIES = ["health", "term-life", "motor", "travel"];

const day = (iso?: string) => (iso && /^\d{4}-\d{2}-\d{2}/.test(iso) ? iso.slice(0, 10) : undefined);

function core(): SitemapEntry[] {
  const pages = [
    "/", "/about", "/methodology", "/disclaimer", "/privacy-policy", "/contact",
    "/contact-directory", "/faq", "/insurers", "/waitlist", "/developers",
    "/author/editorial-team", "/author/durgesh-ghiya",
    "/tools/room-rent-deduction-calculator",
    "/tools/human-life-value-calculator",
    "/tools/section-80d-tax-calculator",
  ];
  return [
    ...pages.map((path) => ({ path })),
    ...VALID_COUNTRY_CODES.map((cc) => ({ path: `/${cc}` })),
  ];
}

function insurers(): SitemapEntry[] {
  const reg = registry();
  const site = siteFacts();
  const out: SitemapEntry[] = [];
  for (const cc of VALID_COUNTRY_CODES) {
    for (const ins of getAllInsurers(cc)) {
      if (cc === "in") {
        if (!insurerVerdict(ins.slug, reg, site).indexable) continue;
        const ri = reg.insurerBySlug.get(ins.slug);
        out.push({ path: `/in/insurer/${ins.slug}`, lastmod: ri ? day(insurerView(ri, reg).updated) : undefined });
      } else if (getProductsByInsurer(ins.slug, cc).length > 0) {
        out.push({ path: `/${cc}/insurer/${ins.slug}` });
      }
    }
  }
  // Registry insurers with no pre-existing site record.
  for (const ri of reg.insurers) {
    if (site.siteInsurerExists(ri.slug)) continue;
    if (!insurerVerdict(ri.slug, reg, site).indexable) continue;
    out.push({ path: `/in/insurer/${ri.slug}`, lastmod: day(insurerView(ri, reg).updated) });
  }
  return out;
}

function products(): SitemapEntry[] {
  const reg = registry();
  const site = siteFacts();
  const out: SitemapEntry[] = [];
  for (const cc of VALID_COUNTRY_CODES) {
    for (const p of getAllProducts(cc)) {
      const rp = reg.productBySiteId.get(p.id);
      const sourced = Boolean(rp && (rp.uin || reg.documentsByProduct.get(rp.slug)?.length));
      if (!siteProductVerdict(cc, sourced).indexable) continue;
      out.push({ path: `/${cc}/product/${p.id}`, lastmod: day(latest([rp?.updatedAt, p.lastVerified])) });
    }
  }
  for (const rp of reg.products) {
    if (rp.siteProductId || site.siteProductExists(rp.slug)) continue;
    if (!productVerdict(rp.slug, reg, site).indexable) continue;
    out.push({ path: `/in/product/${rp.slug}`, lastmod: day(rp.updatedAt) });
  }
  return out;
}

function categories(): SitemapEntry[] {
  const reg = registry();
  const out: SitemapEntry[] = [
    ...CATEGORIES.map((c) => ({ path: `/compare/${c}` })),
    ...VALID_COUNTRY_CODES.flatMap((cc) => [
      { path: `/${cc}/insurers` },
      // ~1,100 words of country-specific contact details per page, and the
      // only place the site lists claim helplines by country.
      { path: `/${cc}/contact-directory` },
      ...CATEGORIES.map((c) => ({ path: `/${cc}/compare/${c}` })),
    ]),
  ];
  if (productDirectoryVerdict(reg).indexable) {
    out.push({ path: "/in/products", lastmod: day(latest(reg.products.map((p) => p.updatedAt))) });
  }
  return out;
}

function editorial(): SitemapEntry[] {
  return [
    { path: "/learn" },
    ...getIndexableArticles().map((a) => ({ path: `/learn/${a.slug}` })),
    { path: "/insights" },
    { path: "/finance" },
    ...getAllFinanceArticles().map((f) => ({ path: `/finance/${f.slug}`, lastmod: day(f.lastUpdated) })),
    { path: "/reports" },
    ...getAllReports().map((r) => ({ path: `/reports/${r.slug}`, lastmod: day(r.publishedAt) })),
  ];
}

function statistics(): SitemapEntry[] {
  const reg = registry();
  if (!statisticsHubVerdict(reg).indexable) return [];
  const out: SitemapEntry[] = [
    { path: "/in/insurance-statistics", lastmod: day(latest(reg.statistics.map((s) => s.recordedAt))) },
  ];
  for (const period of new Set(reg.statistics.map((s) => s.reportingPeriod))) {
    if (!statisticsPeriodVerdict(period, reg).indexable) continue;
    const rows = reg.statistics.filter((s) => s.reportingPeriod === period);
    out.push({
      path: `/in/insurance-statistics/${periodSlug(period)}`,
      lastmod: day(latest(rows.map((s) => s.recordedAt))),
    });
  }
  return out;
}

const BUILDERS: Record<SitemapGroup, () => SitemapEntry[]> = {
  core, insurers, products, categories, editorial, statistics,
};

/** Absolute, trailing-slashed, de-duplicated entries for one group. */
export function sitemapGroup(group: SitemapGroup): { url: string; lastmod?: string }[] {
  const seen = new Set<string>();
  const out: { url: string; lastmod?: string }[] = [];
  for (const e of BUILDERS[group]()) {
    // trailingSlash: true — the unslashed form would 308.
    const path = e.path === "/" ? "/" : `${e.path.replace(/\/$/, "")}/`;
    const url = `${SITE}${path}`;
    if (seen.has(url)) continue;
    seen.add(url);
    out.push({ url, lastmod: e.lastmod });
  }
  return out;
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export function urlsetXml(entries: { url: string; lastmod?: string }[]): string {
  const body = entries
    .map((e) => `  <url><loc>${esc(e.url)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}</url>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function sitemapIndexXml(): string {
  const body = SITEMAP_GROUPS.map((g) => ({ g, entries: sitemapGroup(g) }))
    // An empty child is still served (no 404), but not advertised.
    .filter(({ entries }) => entries.length > 0)
    .map(({ g, entries }) => {
    const lastmod = latest(entries.map((e) => e.lastmod));
    return `  <sitemap><loc>${SITE}/sitemap-${g}.xml</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ""}</sitemap>`;
  }).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

export function xmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
