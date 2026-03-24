#!/usr/bin/env npx ts-node
/**
 * Zura Insurance Data Crawler
 *
 * Monitors Indian insurer websites for product changes.
 * Compliant, rate-limited, robots.txt-respecting.
 *
 * Programmatic usage:
 *   import { crawlSource, runCrawl } from './scripts/crawler';
 *   const result = await crawlSource(sourceConfig);
 *   const results = await runCrawl({ mode: 'daily' });
 *
 * CLI usage:
 *   npx ts-node scripts/crawler/index.ts --mode daily
 *   npx ts-node scripts/crawler/index.ts --mode weekly
 *   npx ts-node scripts/crawler/index.ts --source star-health-plans
 *   npx ts-node scripts/crawler/index.ts --rescan-all
 */

import { createHash } from "crypto";
import * as fs from "fs";
import * as path from "path";
import { CRAWLER_CONFIG, SOURCES, getSourcesByFrequency, getSourceById } from "./config";
import type { SourceConfig } from "./config";
import { Logger } from "../utils/logger";
import { readJSON, writeJSON, ensureDir, fileExists, appendJSONL } from "../utils/file-utils";
import { checkRobots } from "../utils/robots-checker";

// ---- Types ----

export interface CrawlResult {
  sourceId: string;
  url: string;
  statusCode: number;
  contentHash: string;
  changed: boolean;
  snapshotPath: string | null;
  previousHash: string | null;
  timestamp: string;
  durationMs: number;
  error?: string;
}

interface SourceHealthRecord {
  sourceId: string;
  lastChecked: string;
  lastSuccess: string | null;
  consecutiveFailures: number;
  isHealthy: boolean;
  lastContentHash: string | null;
  lastHttpStatus: number | null;
}

interface ReviewQueueItem {
  id: string;
  sourceId: string;
  insurerSlug: string;
  url: string;
  changeType: "new" | "modified" | "removed" | "error";
  detectedAt: string;
  status: "pending" | "reviewed" | "approved" | "rejected";
  contentHash: string;
  previousHash?: string;
}

export interface RunCrawlOptions {
  mode: string;
  sourceId?: string;
}

// ---- Helpers ----

const log = new Logger("crawler");

/** Resolve a relative path against the project root (cwd). */
function projectPath(...segments: string[]): string {
  return path.resolve(process.cwd(), ...segments);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function hashContent(content: string): string {
  return createHash("sha256").update(content, "utf-8").digest("hex");
}

function getHealthFilePath(sourceId: string): string {
  return path.join(CRAWLER_CONFIG.crawlerStateDir, `${sourceId}.json`);
}

function loadHealthRecord(sourceId: string): SourceHealthRecord | null {
  const filePath = getHealthFilePath(sourceId);
  if (!fileExists(filePath)) return null;
  try {
    return readJSON<SourceHealthRecord>(filePath);
  } catch {
    return null;
  }
}

function saveHealthRecord(record: SourceHealthRecord): void {
  const filePath = getHealthFilePath(record.sourceId);
  writeJSON(filePath, record);
}

// Track per-domain last request times for rate limiting
const domainLastRequest = new Map<string, number>();

async function rateLimitWait(url: string): Promise<void> {
  const domain = new URL(url).hostname;
  const lastReq = domainLastRequest.get(domain) ?? 0;
  const elapsed = Date.now() - lastReq;
  if (elapsed < CRAWLER_CONFIG.requestDelayMs) {
    const waitMs = CRAWLER_CONFIG.requestDelayMs - elapsed;
    log.debug(`Rate limiting: waiting ${waitMs}ms for ${domain}`);
    await sleep(waitMs);
  }
  domainLastRequest.set(domain, Date.now());
}

/** Fetch a URL with timeout, user-agent, and retry logic. */
async function fetchWithRetry(
  url: string,
  retries: number = CRAWLER_CONFIG.maxRetries
): Promise<{ status: number; body: string; error?: string }> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), CRAWLER_CONFIG.timeoutMs);

    try {
      const response = await fetch(url, {
        headers: {
          "User-Agent": CRAWLER_CONFIG.userAgent,
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-IN,en;q=0.9",
        },
        signal: controller.signal,
        redirect: "follow",
      });

      clearTimeout(timeout);

      const body = await response.text();
      return { status: response.status, body };
    } catch (err) {
      clearTimeout(timeout);
      const message = err instanceof Error ? err.message : "Unknown error";

      if (attempt < retries) {
        log.warn(`Fetch attempt ${attempt + 1} failed for ${url}: ${message}, retrying...`);
        await sleep(CRAWLER_CONFIG.retryDelayMs);
        continue;
      }

      return { status: 0, body: "", error: message };
    }
  }

  // Should not reach here, but just in case
  return { status: 0, body: "", error: "Max retries exceeded" };
}

/** Save an HTML snapshot and return its path. */
function saveSnapshot(sourceId: string, timestamp: string, body: string): string {
  const ts = timestamp.replace(/[:.]/g, "-");
  const snapshotDir = path.join(CRAWLER_CONFIG.snapshotDir, sourceId);
  ensureDir(snapshotDir);

  const snapshotFile = path.join(snapshotDir, `${ts}.html`);
  const fullPath = projectPath(snapshotFile);
  fs.writeFileSync(fullPath, body, "utf-8");

  return snapshotFile;
}

/** Add a changed source to the review queue. */
function enqueueForReview(
  source: SourceConfig,
  contentHash: string,
  previousHash: string | null,
  timestamp: string
): void {
  const queueItem: ReviewQueueItem = {
    id: `${source.id}_${Date.now()}`,
    sourceId: source.id,
    insurerSlug: source.insurerSlug,
    url: source.url,
    changeType: previousHash ? "modified" : "new",
    detectedAt: timestamp,
    status: "pending",
    contentHash,
    previousHash: previousHash ?? undefined,
  };

  const queueFile = path.join(CRAWLER_CONFIG.queueDir, "queue.json");
  let queue: ReviewQueueItem[] = [];
  if (fileExists(queueFile)) {
    try {
      queue = readJSON<ReviewQueueItem[]>(queueFile);
    } catch {
      queue = [];
    }
  }

  queue.push(queueItem);
  writeJSON(queueFile, queue);
}

// ---- Core Crawl Functions ----

/**
 * Crawl a single source: fetch, hash, detect changes, save snapshot, update health.
 */
export async function crawlSource(source: SourceConfig): Promise<CrawlResult> {
  const start = Date.now();
  const timestamp = new Date().toISOString();
  const sourceLog = log.child(source.id);

  sourceLog.info(`Fetching ${source.url}`);

  // Check robots.txt compliance
  const allowed = await checkRobots(source.url, CRAWLER_CONFIG.userAgent);
  if (!allowed) {
    sourceLog.warn(`Blocked by robots.txt: ${source.url}`);
    return {
      sourceId: source.id,
      url: source.url,
      statusCode: 0,
      contentHash: "",
      changed: false,
      snapshotPath: null,
      previousHash: null,
      timestamp,
      durationMs: Date.now() - start,
      error: "Blocked by robots.txt",
    };
  }

  // Rate limit
  await rateLimitWait(source.url);

  // Fetch
  const response = await fetchWithRetry(source.url);

  if (response.error || response.status === 0) {
    const errorMsg = response.error || `HTTP ${response.status}`;
    sourceLog.error(`Fetch failed: ${errorMsg}`);

    // Update health record on failure
    const prevHealth = loadHealthRecord(source.id);
    const newHealth: SourceHealthRecord = {
      sourceId: source.id,
      lastChecked: timestamp,
      lastSuccess: prevHealth?.lastSuccess ?? null,
      consecutiveFailures: (prevHealth?.consecutiveFailures ?? 0) + 1,
      isHealthy: false,
      lastContentHash: prevHealth?.lastContentHash ?? null,
      lastHttpStatus: response.status,
    };
    saveHealthRecord(newHealth);

    return {
      sourceId: source.id,
      url: source.url,
      statusCode: response.status,
      contentHash: "",
      changed: false,
      snapshotPath: null,
      previousHash: prevHealth?.lastContentHash ?? null,
      timestamp,
      durationMs: Date.now() - start,
      error: errorMsg,
    };
  }

  // Non-200 but not a network error (e.g., 403, 404, 500)
  if (response.status >= 400) {
    sourceLog.warn(`HTTP ${response.status} for ${source.url}`);

    const prevHealth = loadHealthRecord(source.id);
    const newHealth: SourceHealthRecord = {
      sourceId: source.id,
      lastChecked: timestamp,
      lastSuccess: prevHealth?.lastSuccess ?? null,
      consecutiveFailures: (prevHealth?.consecutiveFailures ?? 0) + 1,
      isHealthy: false,
      lastContentHash: prevHealth?.lastContentHash ?? null,
      lastHttpStatus: response.status,
    };
    saveHealthRecord(newHealth);

    return {
      sourceId: source.id,
      url: source.url,
      statusCode: response.status,
      contentHash: "",
      changed: false,
      snapshotPath: null,
      previousHash: prevHealth?.lastContentHash ?? null,
      timestamp,
      durationMs: Date.now() - start,
      error: `HTTP ${response.status}`,
    };
  }

  // Hash the content
  const contentHash = hashContent(response.body);

  // Load previous state for change detection
  const prevHealth = loadHealthRecord(source.id);
  const previousHash = prevHealth?.lastContentHash ?? null;
  const changed = previousHash !== contentHash;

  // Save snapshot
  const snapshotPath = saveSnapshot(source.id, timestamp, response.body);

  // Update health record
  const newHealth: SourceHealthRecord = {
    sourceId: source.id,
    lastChecked: timestamp,
    lastSuccess: timestamp,
    consecutiveFailures: 0,
    isHealthy: true,
    lastContentHash: contentHash,
    lastHttpStatus: response.status,
  };
  saveHealthRecord(newHealth);

  if (changed) {
    sourceLog.info(`Content CHANGED (prev: ${previousHash?.slice(0, 12) ?? "none"}, new: ${contentHash.slice(0, 12)})`);
    enqueueForReview(source, contentHash, previousHash, timestamp);
  } else {
    sourceLog.debug("No changes detected");
  }

  // Append to crawl log (JSONL)
  appendJSONL("data/reports/crawl-history.jsonl", {
    sourceId: source.id,
    url: source.url,
    statusCode: response.status,
    contentHash,
    changed,
    timestamp,
    durationMs: Date.now() - start,
  });

  return {
    sourceId: source.id,
    url: source.url,
    statusCode: response.status,
    contentHash,
    changed,
    snapshotPath,
    previousHash,
    timestamp,
    durationMs: Date.now() - start,
  };
}

/**
 * Run a crawl for a set of sources determined by mode or sourceId.
 *
 * @param options.mode - "daily" | "weekly" | "monthly" | "all"
 * @param options.sourceId - Optional: crawl a single source by ID
 * @returns Array of CrawlResult for each source crawled
 */
export async function runCrawl(options: RunCrawlOptions): Promise<CrawlResult[]> {
  const { mode, sourceId } = options;

  // Determine which sources to crawl
  let sources: SourceConfig[];

  if (sourceId) {
    const source = getSourceById(sourceId);
    if (!source) {
      log.error(`Source not found: ${sourceId}`);
      return [];
    }
    sources = [source];
  } else if (mode === "daily") {
    sources = getSourcesByFrequency("daily");
  } else if (mode === "weekly") {
    sources = [...getSourcesByFrequency("daily"), ...getSourcesByFrequency("weekly")];
  } else if (mode === "monthly" || mode === "all") {
    sources = SOURCES;
  } else {
    log.warn(`Unknown mode "${mode}", defaulting to daily`);
    sources = getSourcesByFrequency("daily");
  }

  log.info(`Starting crawl: mode=${mode}, sources=${sources.length}`);

  // Ensure required directories exist
  ensureDir(CRAWLER_CONFIG.snapshotDir);
  ensureDir(CRAWLER_CONFIG.diffDir);
  ensureDir(CRAWLER_CONFIG.queueDir);
  ensureDir(CRAWLER_CONFIG.crawlerStateDir);
  ensureDir("data/reports");

  const results: CrawlResult[] = [];

  for (const source of sources) {
    try {
      const result = await crawlSource(source);
      results.push(result);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      log.error(`Uncaught error crawling ${source.id}: ${errorMsg}`);
      results.push({
        sourceId: source.id,
        url: source.url,
        statusCode: 0,
        contentHash: "",
        changed: false,
        snapshotPath: null,
        previousHash: null,
        timestamp: new Date().toISOString(),
        durationMs: 0,
        error: errorMsg,
      });
    }
  }

  // Log summary
  const changed = results.filter((r) => r.changed).length;
  const errors = results.filter((r) => r.error).length;
  const successful = results.filter((r) => !r.error).length;

  log.info("Crawl complete", {
    total: results.length,
    successful,
    changed,
    errors,
  });

  // Save run summary
  const runSummary = {
    runAt: new Date().toISOString(),
    mode,
    sourceId: sourceId ?? null,
    totalSources: sources.length,
    results: { successful, changed, errors },
    details: results,
  };

  ensureDir("data/crawler-runs");
  writeJSON(`data/crawler-runs/${Date.now()}.json`, runSummary);

  // Check for stale or failing sources
  reportSourceHealth();

  return results;
}

/** Log warnings about unhealthy sources. */
function reportSourceHealth(): void {
  const stateDir = projectPath(CRAWLER_CONFIG.crawlerStateDir);
  if (!fs.existsSync(stateDir)) return;

  const stateFiles = fs.readdirSync(stateDir).filter((f) => f.endsWith(".json"));
  const staleThresholdMs = 7 * 24 * 60 * 60 * 1000; // 7 days

  for (const file of stateFiles) {
    try {
      const health = readJSON<SourceHealthRecord>(path.join(CRAWLER_CONFIG.crawlerStateDir, file));

      const lastSuccess = health.lastSuccess ? new Date(health.lastSuccess).getTime() : 0;
      if (lastSuccess > 0 && Date.now() - lastSuccess > staleThresholdMs) {
        log.warn(`STALE source: ${health.sourceId} -- last success: ${health.lastSuccess}`);
      }
      if (health.consecutiveFailures >= 3) {
        log.warn(`FAILING source: ${health.sourceId} -- ${health.consecutiveFailures} consecutive failures`);
      }
    } catch {
      // Skip corrupt state files
    }
  }
}

// ---- CLI ----

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  const modeArg =
    args.find((a) => a.startsWith("--mode="))?.split("=")[1] ??
    (args.includes("--mode") ? args[args.indexOf("--mode") + 1] : null);

  const sourceArg =
    args.find((a) => a.startsWith("--source="))?.split("=")[1] ??
    (args.includes("--source") ? args[args.indexOf("--source") + 1] : null);

  const rescanAll = args.includes("--rescan-all");

  if (sourceArg) {
    const results = await runCrawl({ mode: "single", sourceId: sourceArg });
    if (results.length === 0) {
      console.log("Available sources:", SOURCES.map((s) => s.id).join(", "));
      process.exit(1);
    }
  } else if (rescanAll) {
    await runCrawl({ mode: "all" });
  } else if (modeArg) {
    await runCrawl({ mode: modeArg });
  } else {
    console.log("Usage:");
    console.log("  --mode daily|weekly|monthly");
    console.log("  --source <source-id>");
    console.log("  --rescan-all");
    console.log("\nRunning daily scan by default...\n");
    await runCrawl({ mode: "daily" });
  }
}

// Run CLI if executed directly
const isDirectRun =
  typeof require !== "undefined" && require.main === module;

if (isDirectRun) {
  main().catch((err) => {
    log.error("Fatal error", err);
    process.exit(1);
  });
}
