import type { MetadataRoute } from "next";
import { getAllProducts, getAllInsurers, getCategories } from "@/lib/data";
import { VALID_COUNTRY_CODES } from "@/lib/countries";
import { generateVSPairs } from "@/lib/generators";
import { getArticles } from "@/lib/generators";

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

    // VS pages (limit to first 500 per country to avoid sitemap bloat)
    const vsPairs = generateVSPairs(cc).slice(0, 500);
    for (const pair of vsPairs) {
      entries.push({
        url: `${BASE}/${cc}/vs/${pair.slug}`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.4,
      });
    }

    // Insurer VS pages (pairwise, limit top 30 insurers per country)
    for (let i = 0; i < insurers.length && i < 30; i++) {
      for (let j = i + 1; j < insurers.length && j < 30; j++) {
        entries.push({
          url: `${BASE}/${cc}/vs/insurer/${insurers[i].slug}-vs-${insurers[j].slug}`,
          lastModified: now,
          changeFrequency: "monthly",
          priority: 0.4,
        });
      }
    }
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
