/**
 * Zura Insurance Data Agent — Pipeline Orchestrator
 *
 * The main pipeline runner that coordinates crawling, extraction,
 * validation, diffing, review, merging, rebuilding, and reporting.
 */

import * as path from "path";
import * as fs from "fs";
import { randomUUID } from "crypto";

import { SOURCES, getSourcesByFrequency, type SourceConfig } from "../crawler/config";
import { ReviewQueue, type ReviewItem } from "./review";
import { mergeApprovedChanges } from "../ingestion/merger";
import { triggerRebuild } from "./rebuild";
import {
  generateReport,
  printReport,
  saveReport,
  getStalenessReport,
  type RunReport,
} from "./reporter";

// ---- Constants ----

const PROJECT_ROOT = path.resolve(__dirname, "../../");
const DATA_DIR = path.join(PROJECT_ROOT, "src", "data");
const QUEUE_DIR = path.join(PROJECT_ROOT, "data", "review-queue");
const BACKUP_DIR = path.join(PROJECT_ROOT, "data", "backups");
const REPORTS_DIR = path.join(PROJECT_ROOT, "data", "reports");
const SNAPSHOT_DIR = path.join(PROJECT_ROOT, "data", "snapshots");
const STATE_DIR = path.join(PROJECT_ROOT, "data", "crawler-state");

// ---- Types ----

export interface PipelineOptions {
  mode: "daily" | "weekly" | "full";
  sourceId?: string;
  dryRun?: boolean;
  skipBuild?: boolean;
  autoApprove?: boolean;
}

interface CrawlResult {
  sourceId: string;
  url: string;
  timestamp: string;
  status: "success" | "error" | "blocked" | "unchanged" | "changed";
  httpStatus?: number;
  contentHash?: string;
  previousHash?: string;
  error?: string;
  durationMs: number;
}

// ---- Helpers ----

function ensureDir(dirPath: string): void {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Determine which sources to crawl based on mode.
 * - daily: high-priority daily sources (top ~10)
 * - weekly: all daily + weekly sources
 * - full: all sources
 */
function getSourcesForMode(mode: string, sourceId?: string): SourceConfig[] {
  if (sourceId) {
    const found = SOURCES.filter((s) => s.id === sourceId);
    if (found.length === 0) {
      throw new Error(`Source not found: ${sourceId}. Available: ${SOURCES.map((s) => s.id).join(", ")}`);
    }
    return found;
  }

  switch (mode) {
    case "daily":
      return getSourcesByFrequency("daily").slice(0, 10);
    case "weekly":
      return [...getSourcesByFrequency("daily"), ...getSourcesByFrequency("weekly")];
    case "full":
      return SOURCES;
    default:
      return getSourcesByFrequency("daily").slice(0, 10);
  }
}

/**
 * Crawl a single source by fetching its URL and checking for content changes.
 * Self-contained implementation to avoid coupling to the crawler CLI's main().
 */
async function crawlSource(source: SourceConfig): Promise<CrawlResult> {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  console.log(`  [crawl] ${source.id} -> ${source.url}`);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const response = await fetch(source.url, {
      headers: {
        "User-Agent":
          "WBIBot/1.0 (Insurance comparison research; educational purposes; contact@worldbestinsurer.com)",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "en-IN,en;q=0.9",
      },
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return {
        sourceId: source.id,
        url: source.url,
        timestamp,
        status: response.status === 403 || response.status === 429 ? "blocked" : "error",
        httpStatus: response.status,
        error: `HTTP ${response.status}`,
        durationMs: Date.now() - start,
      };
    }

    const body = await response.text();
    const { createHash } = await import("crypto");
    const contentHash = createHash("sha256").update(body).digest("hex").slice(0, 16);

    // Check previous content hash
    const stateFile = path.join(STATE_DIR, `${source.id}.json`);
    let previousHash: string | undefined;
    try {
      if (fs.existsSync(stateFile)) {
        const state = JSON.parse(fs.readFileSync(stateFile, "utf-8"));
        previousHash = state.lastContentHash ?? undefined;
      }
    } catch { /* ignore */ }

    const hasChanged = previousHash !== contentHash;

    // Save snapshot
    const snapshotSubDir = path.join(SNAPSHOT_DIR, source.insurerSlug);
    ensureDir(snapshotSubDir);
    fs.writeFileSync(
      path.join(snapshotSubDir, `${source.id}_${Date.now()}.html`),
      body,
      "utf-8"
    );

    // Update state
    ensureDir(STATE_DIR);
    const stateData = {
      sourceId: source.id,
      lastChecked: timestamp,
      lastSuccess: timestamp,
      consecutiveFailures: 0,
      isHealthy: true,
      lastContentHash: contentHash,
      lastHttpStatus: response.status,
    };
    fs.writeFileSync(stateFile, JSON.stringify(stateData, null, 2), "utf-8");

    return {
      sourceId: source.id,
      url: source.url,
      timestamp,
      status: hasChanged ? "changed" : "unchanged",
      httpStatus: response.status,
      contentHash,
      previousHash,
      durationMs: Date.now() - start,
    };
  } catch (err: unknown) {
    clearTimeout(timeout);
    const message = err instanceof Error ? err.message : "Unknown error";
    return {
      sourceId: source.id,
      url: source.url,
      timestamp,
      status: "error",
      error: message,
      durationMs: Date.now() - start,
    };
  }
}

/**
 * Try to dynamically import an extractor for a given source.
 * Returns null if no extractor is registered for the source.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function tryGetExtractor(sourceId: string): Promise<any> {
  try {
    const registryPath = path.join(
      PROJECT_ROOT,
      "scripts",
      "ingestion",
      "extractors",
      "registry.ts"
    );
    if (!fs.existsSync(registryPath)) return null;
    const registry = await import("../ingestion/extractors/registry");
    if (typeof registry.getExtractor === "function") {
      return registry.getExtractor(sourceId) ?? null;
    }
  } catch {
    // No extractor available
  }
  return null;
}

/**
 * Try to normalize a product using the normalizer module.
 */
async function tryNormalize(
  product: Record<string, unknown>
): Promise<Record<string, unknown>> {
  try {
    const normalizerPath = path.join(
      PROJECT_ROOT,
      "scripts",
      "ingestion",
      "normalizer.ts"
    );
    if (!fs.existsSync(normalizerPath)) return product;
    const normalizer = await import("../ingestion/normalizer");
    if (typeof normalizer.normalizeProduct === "function") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return normalizer.normalizeProduct(product as any, String(product.insurerSlug ?? "") as any, String(product.category ?? "health") as any);
    }
  } catch { /* skip */ }
  return product;
}

/**
 * Try to validate a product using the validator module.
 */
async function tryValidate(
  product: Record<string, unknown>
): Promise<{ valid: boolean; errors: string[] }> {
  try {
    const validatorPath = path.join(
      PROJECT_ROOT,
      "scripts",
      "ingestion",
      "validator.ts"
    );
    if (!fs.existsSync(validatorPath)) return { valid: true, errors: [] };
    const validator = await import("../ingestion/validator");
    if (typeof validator.validateProduct === "function") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = validator.validateProduct(product as any);
      return { valid: result.isValid ?? true, errors: (result.errors ?? []).map((e: { message?: string }) => e.message ?? String(e)) };
    }
  } catch { /* skip */ }
  return { valid: true, errors: [] };
}

/**
 * Try to compute confidence for a product.
 */
async function tryComputeConfidence(
  product: Record<string, unknown>
): Promise<"high" | "medium" | "low"> {
  try {
    const confPath = path.join(
      PROJECT_ROOT,
      "scripts",
      "ingestion",
      "confidence.ts"
    );
    if (!fs.existsSync(confPath)) return "medium";
    const confidence = await import("../ingestion/confidence");
    if (typeof confidence.computeConfidence === "function") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = confidence.computeConfidence(product as any, "scrape", { isValid: true, errors: [], warnings: [] } as any);
      return result.overall ?? "medium";
    }
  } catch { /* skip */ }
  return "medium";
}

/**
 * Try to diff extracted products against existing data.
 */
async function tryDiffProducts(
  existingProducts: Record<string, unknown>[],
  extractedProducts: Record<string, unknown>[]
): Promise<
  {
    productId: string;
    productName: string;
    changeType: "new_product" | "updated_product" | "retired_product" | "field_update";
    changes: { field: string; oldValue: unknown; newValue: unknown }[];
    isLowRisk: boolean;
  }[]
> {
  try {
    const differPath = path.join(
      PROJECT_ROOT,
      "scripts",
      "ingestion",
      "differ.ts"
    );
    if (!fs.existsSync(differPath)) return [];
    const differ = await import("../ingestion/differ");
    if (typeof differ.diffProducts === "function") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const diffs: any[] = differ.diffProducts(existingProducts as any, extractedProducts as any);
      // Annotate with low-risk flag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return diffs.map((d: any) => ({
        productId: d.productId ?? d.field ?? "",
        productName: d.productName ?? "",
        changeType: d.changeType ?? "field_update",
        changes: d.changes ?? [d],
        isLowRisk: typeof differ.isLowRiskChange === "function"
          ? differ.isLowRiskChange(d.changes ?? [d])
          : false,
      }));
    }
  } catch { /* skip */ }
  return [];
}

/**
 * Load existing products for a given category from src/data/.
 */
function loadExistingProducts(category: string): Record<string, unknown>[] {
  const mapping: Record<string, string> = {
    health: "health-insurance.json",
    "term-life": "term-life-insurance.json",
    motor: "motor-insurance.json",
    travel: "travel-insurance.json",
  };
  const fileName = mapping[category];
  if (!fileName) return [];

  const filePath = path.join(DATA_DIR, fileName);
  if (!fs.existsSync(filePath)) return [];

  try {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    return Array.isArray(data.products) ? data.products : [];
  } catch {
    return [];
  }
}

// ---- Main Pipeline ----

/**
 * Run the full agent pipeline.
 *
 * Steps:
 * 1.  Determine sources based on mode
 * 2.  Crawl each source (rate-limited)
 * 3.  For changed sources, extract data if extractor available
 * 4.  Normalize extracted products
 * 5.  Validate extracted products
 * 6.  Compute confidence scores
 * 7.  Diff against existing data
 * 8.  Add diffs to review queue
 * 9.  Auto-approve eligible items if autoApprove is true
 * 10. Merge approved items into src/data/
 * 11. Trigger rebuild if not skipBuild and data changed
 * 12. Generate and save report
 */
export async function runPipeline(options: PipelineOptions): Promise<RunReport> {
  const runId = randomUUID().slice(0, 8);
  const pipelineStart = Date.now();
  const errors: string[] = [];

  console.log(`\n[pipeline] Starting run ${runId} (mode: ${options.mode})`);
  if (options.dryRun) console.log("[pipeline] DRY RUN — no writes will be performed");

  // Ensure directories
  ensureDir(QUEUE_DIR);
  ensureDir(BACKUP_DIR);
  ensureDir(REPORTS_DIR);
  ensureDir(STATE_DIR);

  // Step 1: Determine sources
  let sources: SourceConfig[];
  try {
    sources = getSourcesForMode(options.mode, options.sourceId);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    errors.push(msg);
    console.error(`[pipeline] ${msg}`);
    sources = [];
  }

  console.log(`[pipeline] ${sources.length} sources to crawl`);

  // Step 2: Crawl each source
  const crawlResults: CrawlResult[] = [];
  const domainLastRequest = new Map<string, number>();

  for (const source of sources) {
    // Rate limit per domain: 2 seconds between requests
    try {
      const domain = new URL(source.url).hostname;
      const lastReq = domainLastRequest.get(domain) ?? 0;
      const elapsed = Date.now() - lastReq;
      if (elapsed < 2000) {
        await new Promise((r) => setTimeout(r, 2000 - elapsed));
      }

      const result = await crawlSource(source);
      crawlResults.push(result);
      domainLastRequest.set(domain, Date.now());

      if (result.error) {
        errors.push(`Crawl error [${source.id}]: ${result.error}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Crawl exception [${source.id}]: ${msg}`);
      crawlResults.push({
        sourceId: source.id,
        url: source.url,
        timestamp: new Date().toISOString(),
        status: "error",
        error: msg,
        durationMs: 0,
      });
    }
  }

  const changedSources = crawlResults.filter((r) => r.status === "changed");
  const failedSources = crawlResults.filter(
    (r) => r.status === "error" || r.status === "blocked"
  );

  console.log(
    `[pipeline] Crawl complete: ${crawlResults.length} crawled, ${changedSources.length} changed, ${failedSources.length} failed`
  );

  // Steps 3-7: Extract, normalize, validate, compute confidence, diff
  const reviewQueue = new ReviewQueue(QUEUE_DIR);
  let extractionsTotal = 0;
  let extractionsSuccessful = 0;
  let extractionsFailed = 0;
  let newProducts = 0;
  let updatedProducts = 0;

  for (const crawlResult of changedSources) {
    const source = SOURCES.find((s) => s.id === crawlResult.sourceId);
    if (!source) continue;

    // Step 3: Try to get an extractor
    const extractor = await tryGetExtractor(source.id);
    if (!extractor) {
      console.log(`  [extract] No extractor registered for ${source.id} — skipping`);
      continue;
    }

    extractionsTotal++;

    try {
      // Read the latest snapshot
      const snapshotDir = path.join(SNAPSHOT_DIR, source.insurerSlug);
      const snapshots = fs.existsSync(snapshotDir)
        ? fs.readdirSync(snapshotDir)
            .filter((f) => f.startsWith(source.id) && f.endsWith(".html"))
            .sort()
            .reverse()
        : [];

      if (snapshots.length === 0) {
        errors.push(`No snapshot found for ${source.id}`);
        extractionsFailed++;
        continue;
      }

      const html = fs.readFileSync(
        path.join(snapshotDir, snapshots[0]),
        "utf-8"
      );

      // Extract products
      const rawProducts = extractor(html);
      if (!Array.isArray(rawProducts) || rawProducts.length === 0) {
        console.log(`  [extract] ${source.id} — no products extracted`);
        extractionsFailed++;
        continue;
      }

      console.log(`  [extract] ${source.id} — ${rawProducts.length} products extracted`);

      // Step 4-6: Normalize, validate, compute confidence for each product
      const processedProducts: Record<string, unknown>[] = [];
      for (const raw of rawProducts) {
        const normalized = await tryNormalize(raw);
        const validation = await tryValidate(normalized);
        if (!validation.valid) {
          errors.push(
            `Validation failed for product in ${source.id}: ${validation.errors.join(", ")}`
          );
          continue;
        }
        processedProducts.push(normalized);
      }

      // Step 7: Diff against existing data
      const existingProducts = loadExistingProducts(source.category);
      const diffs = await tryDiffProducts(existingProducts, processedProducts);

      if (diffs.length === 0) {
        console.log(`  [diff] ${source.id} — no product-level changes`);
        extractionsSuccessful++;
        continue;
      }

      console.log(`  [diff] ${source.id} — ${diffs.length} product changes detected`);

      // Step 8: Add diffs to review queue
      for (const diff of diffs) {
        if (options.dryRun) {
          console.log(
            `  [review] DRY RUN: Would add ${diff.changeType} for ${diff.productId}`
          );
          continue;
        }

        const confidence = await tryComputeConfidence(
          processedProducts.find(
            (p) => (p as Record<string, unknown>).id === diff.productId
          ) ?? {}
        );

        const isAutoEligible =
          confidence === "high" && diff.isLowRisk;

        reviewQueue.addItem({
          sourceId: source.id,
          insurerSlug: source.insurerSlug,
          category: source.category,
          changeType: diff.changeType,
          productId: diff.productId,
          productName: diff.productName,
          changes: diff.changes,
          confidence,
          autoPublishEligible: isAutoEligible,
        });

        if (diff.changeType === "new_product") newProducts++;
        else updatedProducts++;
      }

      extractionsSuccessful++;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Extraction error [${source.id}]: ${msg}`);
      extractionsFailed++;
    }
  }

  // Step 9: Auto-approve eligible items
  let autoApproved = 0;
  if (options.autoApprove && !options.dryRun) {
    const approved = reviewQueue.autoApproveEligible();
    autoApproved = approved.length;
    console.log(`[pipeline] Auto-approved ${autoApproved} items`);
  }

  const pendingReview = reviewQueue.getPending().length;

  // Step 10: Merge approved items into src/data/
  let dataChanged = false;
  if (!options.dryRun) {
    const approvedItems = reviewQueue
      .getAll()
      .filter(
        (item) =>
          item.status === "approved" || item.status === "auto_approved"
      );

    // Only merge items that were approved in this run (have reviewedAt set)
    const recentApproved = approvedItems.filter((item) => {
      if (!item.reviewedAt) return false;
      const reviewedTime = new Date(item.reviewedAt).getTime();
      return reviewedTime >= pipelineStart;
    });

    if (recentApproved.length > 0) {
      console.log(`[pipeline] Merging ${recentApproved.length} approved items`);
      try {
        const mergeResults = await mergeApprovedChanges(
          recentApproved,
          DATA_DIR,
          BACKUP_DIR
        );
        for (const mr of mergeResults) {
          console.log(
            `  [merge] ${mr.category}: +${mr.added} added, ~${mr.updated} updated, =${mr.unchanged} unchanged`
          );
          if (mr.added > 0 || mr.updated > 0) dataChanged = true;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`Merge error: ${msg}`);
        console.error(`[pipeline] Merge error: ${msg}`);
      }
    }
  }

  // Step 11: Trigger rebuild
  if (!options.skipBuild && !options.dryRun && dataChanged) {
    console.log("[pipeline] Data changed — triggering rebuild");
    try {
      const buildResult = await triggerRebuild({ dryRun: options.dryRun });
      if (!buildResult.success) {
        errors.push(`Build failed: ${buildResult.output.slice(0, 200)}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`Build error: ${msg}`);
    }
  } else if (options.skipBuild) {
    console.log("[pipeline] Build skipped (--skip-build)");
  } else if (!dataChanged) {
    console.log("[pipeline] No data changes — build not needed");
  }

  // Step 12: Generate and save report
  const staleProducts = getStalenessReport(DATA_DIR, 90);
  const durationMs = Date.now() - pipelineStart;

  const report = generateReport({
    runId,
    mode: options.mode,
    durationMs,
    sourcesTotal: sources.length,
    sourcesCrawled: crawlResults.length,
    sourcesChanged: changedSources.length,
    sourcesFailed: failedSources.length,
    extractionsTotal,
    extractionsSuccessful,
    extractionsFailed,
    newProducts,
    updatedProducts,
    autoApproved,
    pendingReview,
    staleProducts,
    errors,
  });

  if (!options.dryRun) {
    const reportPath = saveReport(report, REPORTS_DIR);
    console.log(`[pipeline] Report saved to ${reportPath}`);
  }

  printReport(report);

  return report;
}
