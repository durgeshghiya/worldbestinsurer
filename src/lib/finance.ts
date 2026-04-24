/**
 * Finance content section.
 *
 * Articles live as individual JSON files under `src/data/finance/`. Drop a
 * new file in that directory, push, and Vercel rebuilds the sitemap + both
 * the listing page and the per-article static page automatically. No code
 * edit needed per article.
 *
 * Schema is captured by the `FinanceArticle` interface below. Every article
 * must include all top-level fields; `sections` is the body, `sources` is
 * the citation list rendered at the bottom of the page.
 */

import fs from "fs";
import path from "path";

export interface FinanceSection {
  heading: string;
  body: string;
}

export interface FinanceSource {
  title: string;
  url: string;
}

export interface FinanceArticle {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  lastUpdated: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
  sections: FinanceSection[];
  sources: FinanceSource[];
}

const FINANCE_DIR = path.join(process.cwd(), "src/data/finance");

let _cache: FinanceArticle[] | null = null;

function loadArticles(): FinanceArticle[] {
  if (_cache) return _cache;
  if (!fs.existsSync(FINANCE_DIR)) {
    _cache = [];
    return _cache;
  }
  const files = fs.readdirSync(FINANCE_DIR).filter((f) => f.endsWith(".json"));
  const articles = files
    .map((f) => {
      const raw = fs.readFileSync(path.join(FINANCE_DIR, f), "utf-8");
      return JSON.parse(raw) as FinanceArticle;
    })
    // Newest first for listing page ordering.
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  _cache = articles;
  return articles;
}

export function getAllFinanceArticles(): FinanceArticle[] {
  return loadArticles();
}

export function getFinanceArticleBySlug(slug: string): FinanceArticle | undefined {
  return loadArticles().find((a) => a.slug === slug);
}
