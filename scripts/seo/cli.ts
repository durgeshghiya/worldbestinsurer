/**
 * Unified SEO CLI
 *
 * Usage:
 *   npx tsx scripts/seo/cli.ts audit       — Run SEO audit
 *   npx tsx scripts/seo/cli.ts content     — Generate content ideas
 *   npx tsx scripts/seo/cli.ts links       — Analyze internal linking
 *   npx tsx scripts/seo/cli.ts keywords    — Generate keyword map
 *   npx tsx scripts/seo/cli.ts full        — Run all SEO checks
 */

import { runAudit } from "./audit";
import { generateContentIdeas } from "./content-generator";
import { analyzeInternalLinks } from "./internal-linker";
import { generateKeywordMap } from "./keyword-tracker";

const COMMANDS: Record<string, { description: string; fn: () => Promise<unknown> }> = {
  audit: {
    description: "Run SEO audit and generate health report",
    fn: runAudit,
  },
  content: {
    description: "Generate SEO content ideas and drafts",
    fn: generateContentIdeas,
  },
  links: {
    description: "Analyze internal linking structure",
    fn: analyzeInternalLinks,
  },
  keywords: {
    description: "Generate keyword map with target pages",
    fn: generateKeywordMap,
  },
  full: {
    description: "Run all SEO checks sequentially",
    fn: async () => {
      const startTime = Date.now();
      console.log("\n################################################################");
      console.log("  ZURA FULL SEO SUITE");
      console.log("################################################################\n");

      console.log("Running all SEO checks...\n");

      console.log("[1/4] SEO Audit");
      console.log("─".repeat(40));
      const auditResult = await runAudit();

      console.log("[2/4] Content Generator");
      console.log("─".repeat(40));
      const contentIdeas = await generateContentIdeas();

      console.log("[3/4] Internal Linker");
      console.log("─".repeat(40));
      const linkResult = await analyzeInternalLinks();

      console.log("[4/4] Keyword Tracker");
      console.log("─".repeat(40));
      const keywordMap = await generateKeywordMap();

      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

      console.log("\n################################################################");
      console.log("  FULL SEO SUITE — SUMMARY");
      console.log("################################################################\n");

      console.log(`  SEO Audit Score:        ${auditResult.score}/100`);
      console.log(`    Critical Issues:      ${auditResult.summary.critical}`);
      console.log(`    Warnings:             ${auditResult.summary.warning}`);
      console.log(`    Info:                 ${auditResult.summary.info}`);
      console.log(`    Passed:               ${auditResult.summary.passed}`);
      console.log("");
      console.log(`  Content Ideas:          ${contentIdeas.length}`);
      console.log(`    High Priority:        ${contentIdeas.filter((i) => i.priority >= 80).length}`);
      console.log("");
      console.log(`  Link Suggestions:       ${linkResult.suggestions.length}`);
      console.log(`    High Priority:        ${linkResult.suggestions.filter((s) => s.priority === "high").length}`);
      console.log(`    Orphan Pages:         ${linkResult.equityReport.orphanPages.length}`);
      console.log("");
      console.log(`  Keywords Mapped:        ${keywordMap.length}`);
      console.log(`    Currently Targeted:   ${keywordMap.filter((k) => k.currentlyTargeted).length}`);
      console.log(`    Untargeted:           ${keywordMap.filter((k) => !k.currentlyTargeted).length}`);
      console.log("");
      console.log(`  Time elapsed: ${elapsed}s`);
      console.log("\n################################################################\n");

      return { auditResult, contentIdeas, linkResult, keywordMap };
    },
  },
};

function printUsage() {
  console.log("\nUsage: npx tsx scripts/seo/cli.ts <command>\n");
  console.log("Commands:");
  for (const [cmd, info] of Object.entries(COMMANDS)) {
    console.log(`  ${cmd.padEnd(12)} ${info.description}`);
  }
  console.log("");
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0]?.toLowerCase();

  if (!command || !COMMANDS[command]) {
    if (command) {
      console.error(`\nUnknown command: "${command}"`);
    }
    printUsage();
    process.exit(command ? 1 : 0);
  }

  try {
    await COMMANDS[command].fn();
  } catch (error) {
    console.error(`\nCommand "${command}" failed:`, error);
    process.exit(1);
  }
}

main();
