import type { MetadataRoute } from "next";
import { getAllProducts, getAllInsurers } from "@/lib/data";
import { VALID_COUNTRY_CODES } from "@/lib/countries";
import { getArticles } from "@/lib/generators";
import { getAllFinanceArticles } from "@/lib/finance";

const BASE = "https://worldbestinsurer.com";

/**
 * Dynamic sitemap generated from live product and article data.
 * Next.js automatically serves this at /sitemap.xml.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  const now = new Date().toISOString();

  // ── Core pages ──
  const corePages = [
    "/",
    "/about",
    "/methodology",
    "/disclaimer",
    "/privacy-policy",
    "/contact",
    "/contact-directory",
    "/faq",
    "/insurers",
    "/learn",
    "/insights",
    "/waitlist",
    "/compare/health",
    "/compare/term-life",
    "/compare/motor",
    "/compare/travel",
  ];

  for (const page of corePages) {
    entries.push({
      url: `${BASE}${page}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: page === "/" ? 1.0 : 0.8,
    });
  }

  // ── Country pages ──
  for (const cc of VALID_COUNTRY_CODES) {
    entries.push({
      url: `${BASE}/${cc}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    });

    // Country compare pages
    for (const cat of ["health", "term-life", "motor", "travel"]) {
      entries.push({
        url: `${BASE}/${cc}/compare/${cat}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    // Product pages
    const products = getAllProducts(cc);
    for (const p of products) {
      entries.push({
        url: `${BASE}/${cc}/product/${p.id}`,
        lastModified: p.lastVerified || now,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }

    // Insurer pages
    const insurers = getAllInsurers(cc);
    for (const ins of insurers) {
      entries.push({
        url: `${BASE}/${cc}/insurer/${ins.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }

    // VS pages, insurer-VS pages and city × category pages are deliberately
    // ABSENT from the sitemap — those routes now emit `noindex`. Advertising
    // a noindexed URL is a contradictory signal and wastes crawl budget.
    // See docs/index-strategy.md for why they were withdrawn.
  }

  // ── Learn articles ──
  const articles = getArticles();
  for (const article of articles) {
    entries.push({
      url: `${BASE}/learn/${article.slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // ── Finance section ──
  entries.push({
    url: `${BASE}/finance`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  });
  for (const fa of getAllFinanceArticles()) {
    entries.push({
      url: `${BASE}/finance/${fa.slug}`,
      // Use the article's own lastUpdated so Google sees real freshness on
      // re-crawl, not a build timestamp that bumps every deploy.
      lastModified: new Date(fa.lastUpdated).toISOString(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  // ── Developer docs ──
  entries.push({
    url: `${BASE}/developers`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  });

  // ── Reports ──
  entries.push({
    url: `${BASE}/reports`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  });
  entries.push({
    url: `${BASE}/reports/health-insurance-india-2026`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  });

  // ── Author pages ──
  entries.push({
    url: `${BASE}/author/editorial-team`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  });
  entries.push({
    url: `${BASE}/author/durgesh-ghiya`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.5,
  });

  return entries;
}
