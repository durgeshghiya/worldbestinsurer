/**
 * Report Generation for Zura Insurance Data Agent
 *
 * Generates run reports, staleness reports, and prints formatted summaries.
 */

import * as fs from "fs";
import * as path from "path";

// ---- Types ----

export interface RunReport {
  runId: string;
  runAt: string;
  mode: string;
  durationMs: number;
  sources: {
    total: number;
    crawled: number;
    changed: number;
    failed: number;
  };
  extractions: {
    total: number;
    successful: number;
    failed: number;
  };
  dataChanges: {
    newProducts: number;
    updatedProducts: number;
    autoApproved: number;
    pendingReview: number;
  };
  staleProducts: {
    productId: string;
    productName: string;
    daysSinceVerified: number;
  }[];
  errors: string[];
}

export interface StaleProduct {
  productId: string;
  productName: string;
  daysSinceVerified: number;
}

// ---- Helpers ----

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// ANSI color helpers
const COLORS = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

function c(color: keyof typeof COLORS, text: string): string {
  return `${COLORS[color]}${text}${COLORS.reset}`;
}

// ---- Report Generation ----

/**
 * Generate a run report from pipeline execution data.
 */
export function generateReport(params: {
  runId: string;
  mode: string;
  durationMs: number;
  sourcesTotal: number;
  sourcesCrawled: number;
  sourcesChanged: number;
  sourcesFailed: number;
  extractionsTotal: number;
  extractionsSuccessful: number;
  extractionsFailed: number;
  newProducts: number;
  updatedProducts: number;
  autoApproved: number;
  pendingReview: number;
  staleProducts: StaleProduct[];
  errors: string[];
}): RunReport {
  return {
    runId: params.runId,
    runAt: new Date().toISOString(),
    mode: params.mode,
    durationMs: params.durationMs,
    sources: {
      total: params.sourcesTotal,
      crawled: params.sourcesCrawled,
      changed: params.sourcesChanged,
      failed: params.sourcesFailed,
    },
    extractions: {
      total: params.extractionsTotal,
      successful: params.extractionsSuccessful,
      failed: params.extractionsFailed,
    },
    dataChanges: {
      newProducts: params.newProducts,
      updatedProducts: params.updatedProducts,
      autoApproved: params.autoApproved,
      pendingReview: params.pendingReview,
    },
    staleProducts: params.staleProducts,
    errors: params.errors,
  };
}

/**
 * Pretty-print a run report to the console with color.
 */
export function printReport(report: RunReport): void {
  const divider = "=".repeat(60);

  console.log("");
  console.log(c("cyan", divider));
  console.log(c("bold", `  ZURA AGENT RUN REPORT`));
  console.log(c("cyan", divider));
  console.log("");

  console.log(`  ${c("dim", "Run ID:")}     ${report.runId}`);
  console.log(`  ${c("dim", "Mode:")}       ${report.mode}`);
  console.log(`  ${c("dim", "Ran at:")}     ${report.runAt}`);
  console.log(
    `  ${c("dim", "Duration:")}   ${(report.durationMs / 1000).toFixed(1)}s`
  );

  console.log("");
  console.log(c("bold", "  Sources"));
  console.log(`    Total:    ${report.sources.total}`);
  console.log(`    Crawled:  ${c("green", String(report.sources.crawled))}`);
  console.log(`    Changed:  ${c("yellow", String(report.sources.changed))}`);
  console.log(
    `    Failed:   ${report.sources.failed > 0 ? c("red", String(report.sources.failed)) : "0"}`
  );

  console.log("");
  console.log(c("bold", "  Extractions"));
  console.log(`    Total:      ${report.extractions.total}`);
  console.log(
    `    Successful: ${c("green", String(report.extractions.successful))}`
  );
  console.log(
    `    Failed:     ${report.extractions.failed > 0 ? c("red", String(report.extractions.failed)) : "0"}`
  );

  console.log("");
  console.log(c("bold", "  Data Changes"));
  console.log(
    `    New products:     ${c("green", String(report.dataChanges.newProducts))}`
  );
  console.log(
    `    Updated products: ${c("yellow", String(report.dataChanges.updatedProducts))}`
  );
  console.log(
    `    Auto-approved:    ${c("green", String(report.dataChanges.autoApproved))}`
  );
  console.log(
    `    Pending review:   ${report.dataChanges.pendingReview > 0 ? c("yellow", String(report.dataChanges.pendingReview)) : "0"}`
  );

  if (report.staleProducts.length > 0) {
    console.log("");
    console.log(c("bold", "  Stale Products"));
    for (const sp of report.staleProducts.slice(0, 10)) {
      const color = sp.daysSinceVerified > 90 ? "red" : "yellow";
      console.log(
        `    ${c(color, `[${sp.daysSinceVerified}d]`)} ${sp.productName} (${sp.productId})`
      );
    }
    if (report.staleProducts.length > 10) {
      console.log(
        c("dim", `    ... and ${report.staleProducts.length - 10} more`)
      );
    }
  }

  if (report.errors.length > 0) {
    console.log("");
    console.log(c("red", "  Errors"));
    for (const err of report.errors.slice(0, 20)) {
      console.log(`    ${c("red", "-")} ${err}`);
    }
    if (report.errors.length > 20) {
      console.log(
        c("dim", `    ... and ${report.errors.length - 20} more`)
      );
    }
  }

  console.log("");
  console.log(c("cyan", divider));
  console.log("");
}

/**
 * Save a report to disk as a JSON file.
 * Returns the absolute file path of the saved report.
 */
export function saveReport(report: RunReport, dir: string): string {
  ensureDir(dir);
  const fileName = `run-${report.runId}-${Date.now()}.json`;
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, JSON.stringify(report, null, 2) + "\n", "utf-8");
  return filePath;
}

/**
 * Compute staleness for all products across all src/data/ JSON files.
 *
 * Reads each *-insurance.json file, inspects the lastVerified field on
 * each product, and returns those older than maxDays (default 90).
 */
export function getStalenessReport(
  dataDir: string,
  maxDays: number = 90
): StaleProduct[] {
  const staleProducts: StaleProduct[] = [];
  const now = Date.now();

  if (!fs.existsSync(dataDir)) {
    return staleProducts;
  }

  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith("-insurance.json"));

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const data = JSON.parse(content) as {
        products?: { id?: string; productName?: string; lastVerified?: string }[];
      };

      if (!Array.isArray(data.products)) continue;

      for (const product of data.products) {
        if (!product.lastVerified || !product.id) continue;

        const verifiedDate = new Date(product.lastVerified).getTime();
        if (isNaN(verifiedDate)) continue;

        const daysSince = Math.floor((now - verifiedDate) / (1000 * 60 * 60 * 24));

        if (daysSince >= maxDays) {
          staleProducts.push({
            productId: product.id,
            productName: product.productName ?? product.id,
            daysSinceVerified: daysSince,
          });
        }
      }
    } catch {
      // Skip files we cannot parse
    }
  }

  // Sort by staleness descending
  staleProducts.sort((a, b) => b.daysSinceVerified - a.daysSinceVerified);

  return staleProducts;
}
