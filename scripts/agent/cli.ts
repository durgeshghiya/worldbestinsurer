#!/usr/bin/env npx tsx
/**
 * Zura Insurance Data Agent — Unified CLI
 *
 * Usage:
 *   tsx scripts/agent/cli.ts <command> [options]
 *
 * Commands:
 *   run          Run the full pipeline
 *   crawl        Crawl sources for changes
 *   extract      Extract data from crawled snapshots
 *   review       Manage the review queue
 *   merge        Merge approved changes into data files
 *   rebuild      Trigger a site rebuild
 *   report       Generate reports
 *   schedule     Start the cron scheduler
 *   status       Show current agent status
 */

import * as path from "path";
import * as fs from "fs";

// ---- Constants ----

const PROJECT_ROOT = path.resolve(__dirname, "../../");
const DATA_DIR = path.join(PROJECT_ROOT, "src", "data");
const QUEUE_DIR = path.join(PROJECT_ROOT, "data", "review-queue");
const BACKUP_DIR = path.join(PROJECT_ROOT, "data", "backups");
const REPORTS_DIR = path.join(PROJECT_ROOT, "data", "reports");

// ---- ANSI Colors ----

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

function color(c_: string, text: string): string {
  return `${c_}${text}${C.reset}`;
}

// ---- Argument Parsing ----

function parseArgs(argv: string[]): {
  command: string;
  subcommand: string;
  flags: Record<string, string | boolean>;
  positional: string[];
} {
  const args = argv.slice(2);
  const command = args[0] ?? "";
  const subcommand = args[1] && !args[1].startsWith("-") ? args[1] : "";
  const flags: Record<string, string | boolean> = {};
  const positional: string[] = [];

  let i = subcommand ? 2 : 1;
  while (i < args.length) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];
      if (nextArg && !nextArg.startsWith("-")) {
        flags[key] = nextArg;
        i += 2;
      } else {
        flags[key] = true;
        i++;
      }
    } else if (arg.startsWith("-")) {
      flags[arg.slice(1)] = true;
      i++;
    } else {
      positional.push(arg);
      i++;
    }
  }

  return { command, subcommand, flags, positional };
}

// ---- Help ----

function printHelp(): void {
  console.log(`
${color(C.cyan, "Zura Insurance Data Agent")}

${color(C.bold, "Usage:")}
  tsx scripts/agent/cli.ts ${color(C.green, "<command>")} [options]

${color(C.bold, "Commands:")}
  ${color(C.green, "run")}        Run the full pipeline
               --mode daily|weekly|full  ${color(C.dim, "(required)")}
               --dry-run                 ${color(C.dim, "Simulate without writing")}
               --skip-build              ${color(C.dim, "Skip Next.js rebuild")}
               --auto-approve            ${color(C.dim, "Auto-approve eligible changes")}

  ${color(C.green, "crawl")}      Crawl sources for changes
               --mode daily|weekly|full  ${color(C.dim, "(required)")}
               --source <id>             ${color(C.dim, "Crawl a specific source")}

  ${color(C.green, "extract")}    Extract data from crawled snapshots
               --source <id>             ${color(C.dim, "Extract from a specific source")}
               --all-changed             ${color(C.dim, "Extract from all changed sources")}

  ${color(C.green, "review")}     Manage the review queue
               list                      ${color(C.dim, "List pending review items")}
               approve <id>              ${color(C.dim, "Approve a review item")}
               reject <id>               ${color(C.dim, "Reject a review item")}
                 --reason "..."           ${color(C.dim, "Rejection reason")}
               auto-approve              ${color(C.dim, "Auto-approve eligible items")}

  ${color(C.green, "merge")}      Merge approved changes
               --approved                ${color(C.dim, "Merge all approved items")}

  ${color(C.green, "rebuild")}    Trigger a site rebuild

  ${color(C.green, "report")}     Generate reports
               staleness                 ${color(C.dim, "Show stale products")}
                 --max-days <n>           ${color(C.dim, "Staleness threshold (default: 90)")}
               last-run                  ${color(C.dim, "Show last run report")}

  ${color(C.green, "schedule")}   Start the cron scheduler
               start                     ${color(C.dim, "Start scheduler daemon")}

  ${color(C.green, "status")}     Show current agent status
`);
}

// ---- Command Handlers ----

async function handleRun(flags: Record<string, string | boolean>): Promise<void> {
  const mode = (flags.mode as string) ?? "daily";
  if (!["daily", "weekly", "full"].includes(mode)) {
    console.error(color(C.red, `Invalid mode: ${mode}. Use daily, weekly, or full.`));
    process.exit(1);
  }

  const { runPipeline } = await import("./orchestrator");
  await runPipeline({
    mode: mode as "daily" | "weekly" | "full",
    dryRun: Boolean(flags["dry-run"]),
    skipBuild: Boolean(flags["skip-build"]),
    autoApprove: Boolean(flags["auto-approve"]),
    sourceId: typeof flags.source === "string" ? flags.source : undefined,
  });
}

async function handleCrawl(flags: Record<string, string | boolean>): Promise<void> {
  const mode = (flags.mode as string) ?? "daily";
  const sourceId = typeof flags.source === "string" ? flags.source : undefined;

  // Use the crawler directly
  const { SOURCES, getSourcesByFrequency } = await import("../crawler/config");

  let sources;
  if (sourceId) {
    sources = SOURCES.filter((s) => s.id === sourceId);
    if (sources.length === 0) {
      console.error(color(C.red, `Source not found: ${sourceId}`));
      console.log("Available sources:", SOURCES.map((s) => s.id).join(", "));
      process.exit(1);
    }
  } else if (mode === "daily") {
    sources = getSourcesByFrequency("daily");
  } else if (mode === "weekly") {
    sources = [...getSourcesByFrequency("daily"), ...getSourcesByFrequency("weekly")];
  } else {
    sources = SOURCES;
  }

  console.log(color(C.cyan, `\nCrawling ${sources.length} sources (mode: ${mode})...\n`));

  // Import the pipeline's crawl logic indirectly by running with skip-build + no auto-approve
  // For a standalone crawl, we just run the pipeline in a constrained way
  const { runPipeline } = await import("./orchestrator");
  await runPipeline({
    mode: mode as "daily" | "weekly" | "full",
    sourceId,
    skipBuild: true,
    autoApprove: false,
    dryRun: true, // crawl-only: don't merge
  });
}

async function handleExtract(flags: Record<string, string | boolean>): Promise<void> {
  const sourceId = typeof flags.source === "string" ? flags.source : undefined;
  const allChanged = Boolean(flags["all-changed"]);

  if (!sourceId && !allChanged) {
    console.error(color(C.red, "Specify --source <id> or --all-changed"));
    process.exit(1);
  }

  console.log(
    color(
      C.cyan,
      sourceId
        ? `\nExtracting data from source: ${sourceId}\n`
        : "\nExtracting data from all changed sources\n"
    )
  );

  // Run pipeline focused on extraction
  const { runPipeline } = await import("./orchestrator");
  await runPipeline({
    mode: "daily",
    sourceId,
    skipBuild: true,
    autoApprove: false,
  });
}

async function handleReview(
  subcommand: string,
  flags: Record<string, string | boolean>,
  positional: string[]
): Promise<void> {
  const { ReviewQueue } = await import("./review");
  const queue = new ReviewQueue(QUEUE_DIR);

  switch (subcommand) {
    case "list": {
      const pending = queue.getPending();
      if (pending.length === 0) {
        console.log(color(C.green, "\nNo pending review items.\n"));
        return;
      }

      console.log(color(C.cyan, `\nPending Review Items (${pending.length}):\n`));
      console.log(
        `${"ID".padEnd(38)} ${"Product".padEnd(35)} ${"Type".padEnd(18)} ${"Confidence".padEnd(12)} Auto`
      );
      console.log("-".repeat(110));

      for (const item of pending) {
        const confColor =
          item.confidence === "high"
            ? C.green
            : item.confidence === "medium"
              ? C.yellow
              : C.red;
        const autoIcon = item.autoPublishEligible ? color(C.green, "Y") : color(C.dim, "N");

        console.log(
          `${color(C.dim, item.id.slice(0, 36)).padEnd(47)} ${item.productName.slice(0, 33).padEnd(35)} ${item.changeType.padEnd(18)} ${color(confColor, item.confidence).padEnd(21)} ${autoIcon}`
        );

        if (item.changes.length > 0) {
          for (const ch of item.changes.slice(0, 3)) {
            console.log(
              color(C.dim, `  ${ch.field}: ${JSON.stringify(ch.oldValue)} -> ${JSON.stringify(ch.newValue)}`)
            );
          }
          if (item.changes.length > 3) {
            console.log(color(C.dim, `  ... and ${item.changes.length - 3} more changes`));
          }
        }
      }
      console.log("");
      break;
    }

    case "approve": {
      const id = positional[0] ?? flags.id;
      if (!id || typeof id !== "string") {
        console.error(color(C.red, "Specify an item ID: review approve <id>"));
        process.exit(1);
      }
      const reviewer = typeof flags.reviewer === "string" ? flags.reviewer : "cli";
      const notes = typeof flags.notes === "string" ? flags.notes : undefined;
      const approved = queue.approve(id, reviewer, notes);
      if (approved) {
        console.log(color(C.green, `\nApproved: ${approved.productName} (${approved.id})\n`));
      } else {
        console.error(color(C.red, `\nItem not found in pending queue: ${id}\n`));
      }
      break;
    }

    case "reject": {
      const id = positional[0] ?? flags.id;
      if (!id || typeof id !== "string") {
        console.error(color(C.red, "Specify an item ID: review reject <id>"));
        process.exit(1);
      }
      const reviewer = typeof flags.reviewer === "string" ? flags.reviewer : "cli";
      const reason = typeof flags.reason === "string" ? flags.reason : undefined;
      const rejected = queue.reject(id, reviewer, reason);
      if (rejected) {
        console.log(color(C.yellow, `\nRejected: ${rejected.productName} (${rejected.id})\n`));
      } else {
        console.error(color(C.red, `\nItem not found in pending queue: ${id}\n`));
      }
      break;
    }

    case "auto-approve": {
      const autoApproved = queue.autoApproveEligible();
      if (autoApproved.length === 0) {
        console.log(color(C.dim, "\nNo items eligible for auto-approval.\n"));
      } else {
        console.log(
          color(C.green, `\nAuto-approved ${autoApproved.length} items:\n`)
        );
        for (const item of autoApproved) {
          console.log(`  ${color(C.green, "+")} ${item.productName} (${item.changeType})`);
        }
        console.log("");
      }
      break;
    }

    default:
      console.error(
        color(C.red, `Unknown review subcommand: ${subcommand || "(none)"}`)
      );
      console.log("Usage: review list | approve <id> | reject <id> | auto-approve");
      process.exit(1);
  }
}

async function handleMerge(flags: Record<string, string | boolean>): Promise<void> {
  if (!flags.approved) {
    console.error(color(C.red, "Use --approved to merge all approved items"));
    process.exit(1);
  }

  const { ReviewQueue } = await import("./review");
  const { mergeApprovedChanges } = await import("../ingestion/merger");

  const queue = new ReviewQueue(QUEUE_DIR);
  const allItems = queue.getAll();
  const approved = allItems.filter(
    (item) => item.status === "approved" || item.status === "auto_approved"
  );

  if (approved.length === 0) {
    console.log(color(C.dim, "\nNo approved items to merge.\n"));
    return;
  }

  console.log(color(C.cyan, `\nMerging ${approved.length} approved items...\n`));

  const results = await mergeApprovedChanges(approved, DATA_DIR, BACKUP_DIR);

  for (const result of results) {
    console.log(
      `  ${color(C.bold, result.category)}: +${color(C.green, String(result.added))} added, ~${color(C.yellow, String(result.updated))} updated, =${result.unchanged} unchanged`
    );
    if (result.backupPath) {
      console.log(color(C.dim, `    Backup: ${result.backupPath}`));
    }
  }
  console.log("");
}

async function handleRebuild(): Promise<void> {
  const { triggerRebuild } = await import("./rebuild");

  console.log(color(C.cyan, "\nTriggering site rebuild...\n"));
  const result = await triggerRebuild();

  if (result.success) {
    console.log(
      color(C.green, `Build succeeded in ${(result.durationMs / 1000).toFixed(1)}s\n`)
    );
  } else {
    console.error(color(C.red, `Build FAILED after ${(result.durationMs / 1000).toFixed(1)}s`));
    console.error(result.output.slice(0, 500));
    process.exit(1);
  }
}

async function handleReport(
  subcommand: string,
  flags: Record<string, string | boolean>
): Promise<void> {
  switch (subcommand) {
    case "staleness": {
      const { getStalenessReport } = await import("./reporter");
      const maxDays =
        typeof flags["max-days"] === "string" ? parseInt(flags["max-days"], 10) : 90;

      const stale = getStalenessReport(DATA_DIR, maxDays);

      if (stale.length === 0) {
        console.log(
          color(C.green, `\nNo products older than ${maxDays} days. All data is fresh.\n`)
        );
        return;
      }

      console.log(
        color(C.yellow, `\nStale Products (not verified in ${maxDays}+ days): ${stale.length}\n`)
      );
      console.log(
        `${"Days".padEnd(8)} ${"Product ID".padEnd(35)} Product Name`
      );
      console.log("-".repeat(90));

      for (const sp of stale) {
        const dColor = sp.daysSinceVerified > 180 ? C.red : C.yellow;
        console.log(
          `${color(dColor, String(sp.daysSinceVerified).padEnd(8))} ${sp.productId.padEnd(35)} ${sp.productName}`
        );
      }
      console.log("");
      break;
    }

    case "last-run": {
      if (!fs.existsSync(REPORTS_DIR)) {
        console.log(color(C.dim, "\nNo reports found.\n"));
        return;
      }

      const reportFiles = fs
        .readdirSync(REPORTS_DIR)
        .filter((f) => f.startsWith("run-") && f.endsWith(".json"))
        .sort()
        .reverse();

      if (reportFiles.length === 0) {
        console.log(color(C.dim, "\nNo run reports found.\n"));
        return;
      }

      const latestPath = path.join(REPORTS_DIR, reportFiles[0]);
      const report = JSON.parse(fs.readFileSync(latestPath, "utf-8"));

      const { printReport } = await import("./reporter");
      printReport(report);
      break;
    }

    default:
      console.error(
        color(C.red, `Unknown report subcommand: ${subcommand || "(none)"}`)
      );
      console.log("Usage: report staleness [--max-days <n>] | last-run");
      process.exit(1);
  }
}

async function handleSchedule(subcommand: string): Promise<void> {
  if (subcommand !== "start") {
    console.error(color(C.red, "Usage: schedule start"));
    process.exit(1);
  }

  const { startScheduler } = await import("./scheduler");
  startScheduler();
}

async function handleStatus(): Promise<void> {
  console.log(color(C.cyan, "\n=== Zura Insurance Data Agent Status ===\n"));

  // Review queue status
  const { ReviewQueue } = await import("./review");
  const queue = new ReviewQueue(QUEUE_DIR);
  const all = queue.getAll();
  const pending = all.filter((i) => i.status === "pending");
  const approved = all.filter(
    (i) => i.status === "approved" || i.status === "auto_approved"
  );
  const rejected = all.filter((i) => i.status === "rejected");

  console.log(color(C.bold, "  Review Queue"));
  console.log(`    Pending:   ${pending.length > 0 ? color(C.yellow, String(pending.length)) : "0"}`);
  console.log(`    Approved:  ${color(C.green, String(approved.length))}`);
  console.log(`    Rejected:  ${rejected.length > 0 ? color(C.red, String(rejected.length)) : "0"}`);

  // Data files
  console.log("");
  console.log(color(C.bold, "  Data Files"));
  if (fs.existsSync(DATA_DIR)) {
    const dataFiles = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
    for (const file of dataFiles) {
      try {
        const filePath = path.join(DATA_DIR, file);
        const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        const productCount = Array.isArray(data.products) ? data.products.length : 0;
        const lastUpdated = data.lastUpdated ?? "unknown";
        console.log(
          `    ${file.padEnd(30)} ${color(C.green, String(productCount).padStart(3))} products  ${color(C.dim, `(updated: ${lastUpdated})`)}`
        );
      } catch {
        console.log(`    ${file.padEnd(30)} ${color(C.red, "error reading")}`);
      }
    }
  } else {
    console.log(color(C.dim, "    No data directory found"));
  }

  // Staleness
  const { getStalenessReport } = await import("./reporter");
  const stale = getStalenessReport(DATA_DIR, 90);
  console.log("");
  console.log(color(C.bold, "  Staleness"));
  if (stale.length === 0) {
    console.log(color(C.green, "    All products verified within 90 days"));
  } else {
    console.log(
      `    ${color(C.yellow, String(stale.length))} products not verified in 90+ days`
    );
    for (const sp of stale.slice(0, 5)) {
      console.log(
        color(C.dim, `    - ${sp.productName} (${sp.daysSinceVerified} days)`)
      );
    }
    if (stale.length > 5) {
      console.log(color(C.dim, `    ... and ${stale.length - 5} more`));
    }
  }

  // Last run
  console.log("");
  console.log(color(C.bold, "  Last Run"));
  if (fs.existsSync(REPORTS_DIR)) {
    const reportFiles = fs
      .readdirSync(REPORTS_DIR)
      .filter((f) => f.startsWith("run-") && f.endsWith(".json"))
      .sort()
      .reverse();

    if (reportFiles.length > 0) {
      try {
        const report = JSON.parse(
          fs.readFileSync(path.join(REPORTS_DIR, reportFiles[0]), "utf-8")
        );
        console.log(`    Run ID:  ${report.runId}`);
        console.log(`    Mode:    ${report.mode}`);
        console.log(`    Ran at:  ${report.runAt}`);
        console.log(
          `    Result:  ${report.errors?.length > 0 ? color(C.yellow, `${report.errors.length} errors`) : color(C.green, "clean")}`
        );
      } catch {
        console.log(color(C.dim, "    Could not read last report"));
      }
    } else {
      console.log(color(C.dim, "    No previous runs"));
    }
  } else {
    console.log(color(C.dim, "    No previous runs"));
  }

  console.log("");
}

// ---- Main ----

async function main(): Promise<void> {
  const { command, subcommand, flags, positional } = parseArgs(process.argv);

  if (!command || command === "help" || flags.help) {
    printHelp();
    return;
  }

  try {
    switch (command) {
      case "run":
        await handleRun(flags);
        break;
      case "crawl":
        await handleCrawl(flags);
        break;
      case "extract":
        await handleExtract(flags);
        break;
      case "review":
        await handleReview(subcommand, flags, positional);
        break;
      case "merge":
        await handleMerge(flags);
        break;
      case "rebuild":
        await handleRebuild();
        break;
      case "report":
        await handleReport(subcommand, flags);
        break;
      case "schedule":
        await handleSchedule(subcommand);
        break;
      case "status":
        await handleStatus();
        break;
      default:
        console.error(color(C.red, `Unknown command: ${command}`));
        printHelp();
        process.exit(1);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(color(C.red, `\nError: ${message}\n`));
    if (err instanceof Error && err.stack) {
      console.error(color(C.dim, err.stack));
    }
    process.exit(1);
  }
}

main();
