/**
 * Market reports.
 *
 * Reports live as individual JSON files under `src/data/reports/`. This module
 * reads that directory so the listing page, the per-report route, and the
 * sitemap all derive from the same source.
 *
 * It exists because they previously did not: the routes carried four hard-coded
 * imports while `sitemap.ts` hard-coded a single URL, so three of the four
 * reports were live but advertised nowhere. Adding a file here is now the only
 * step needed to publish a report.
 */

import fs from "fs";
import path from "path";

export interface ReportSection {
  heading: string;
  body: string;
}

export interface Report {
  slug: string;
  title: string;
  subtitle: string;
  publishedAt: string;
  author: string;
  category: string;
  country: string;
  readTime: string;
  sections: ReportSection[];
}

const REPORTS_DIR = path.join(process.cwd(), "src/data/reports");

let _cache: Report[] | null = null;

function loadReports(): Report[] {
  if (_cache) return _cache;
  if (!fs.existsSync(REPORTS_DIR)) {
    _cache = [];
    return _cache;
  }
  const reports = fs
    .readdirSync(REPORTS_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => {
      const raw = fs.readFileSync(path.join(REPORTS_DIR, f), "utf-8");
      return JSON.parse(raw) as Report;
    })
    // Newest first for listing page ordering.
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  _cache = reports;
  return reports;
}

export function getAllReports(): Report[] {
  return loadReports();
}

export function getReportBySlug(slug: string): Report | undefined {
  return loadReports().find((r) => r.slug === slug);
}
