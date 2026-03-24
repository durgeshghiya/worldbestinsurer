#!/usr/bin/env tsx
/**
 * AI Agent CLI — Gemini-powered insurance data agent.
 *
 * Usage:
 *   npx tsx scripts/ai-agent/cli.ts update <country> [category]
 *   npx tsx scripts/ai-agent/cli.ts update-all
 *   npx tsx scripts/ai-agent/cli.ts research <insurer> <country> <category>
 *   npx tsx scripts/ai-agent/cli.ts report <country>
 *   npx tsx scripts/ai-agent/cli.ts verify <country> <category>
 *   npx tsx scripts/ai-agent/cli.ts push
 *   npx tsx scripts/ai-agent/cli.ts schedule
 */
import { updateCategory, updateCountry, pushToGitHub, generateMarketReport } from "./auto-updater";
import { researchInsurer } from "./product-researcher";
import { callGeminiText } from "./gemini";
import * as fs from "fs";
import * as path from "path";

const COUNTRIES = ["in", "us", "uk", "ae", "sg", "ca", "au", "de", "sa", "jp", "kr", "hk"];

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  console.log("\n\x1b[36m╔══════════════════════════════════════════╗\x1b[0m");
  console.log("\x1b[36m║  🤖 World Best Insurer — AI Agent        ║\x1b[0m");
  console.log("\x1b[36m║     Powered by Google Gemini              ║\x1b[0m");
  console.log("\x1b[36m╚══════════════════════════════════════════╝\x1b[0m\n");

  if (!process.env.GEMINI_API_KEY) {
    console.error("\x1b[31m✗ GEMINI_API_KEY not set!\x1b[0m");
    console.log("\n  Get a free key at: https://aistudio.google.com/apikey");
    console.log("  Then set it:");
    console.log("    Windows: set GEMINI_API_KEY=your_key_here");
    console.log("    Mac/Linux: export GEMINI_API_KEY=your_key_here\n");
    process.exit(1);
  }

  switch (command) {
    case "update": {
      const country = args[1];
      const category = args[2];

      if (!country) {
        console.error("Usage: update <country> [category]");
        console.log("Countries:", COUNTRIES.join(", "));
        process.exit(1);
      }

      if (category) {
        console.log(`\x1b[33mUpdating ${country}/${category}...\x1b[0m\n`);
        const result = await updateCategory(country, category);
        console.log(`\n\x1b[32m✓ Done: ${result.newProducts} new, ${result.updatedProducts} updates\x1b[0m`);
        if (result.errors.length) console.log(`\x1b[31m  Errors: ${result.errors.length}\x1b[0m`);
      } else {
        console.log(`\x1b[33mUpdating all categories for ${country}...\x1b[0m\n`);
        await updateCountry(country);
        console.log(`\n\x1b[32m✓ Country update complete\x1b[0m`);
      }
      break;
    }

    case "update-all": {
      console.log(`\x1b[33mUpdating ALL ${COUNTRIES.length} countries...\x1b[0m\n`);
      console.log("This will take 30-60 minutes due to API rate limits.\n");

      for (const country of COUNTRIES) {
        console.log(`\n\x1b[36m━━━ ${country.toUpperCase()} ━━━\x1b[0m`);
        await updateCountry(country);
      }

      console.log(`\n\x1b[32m✓ All countries updated!\x1b[0m`);
      break;
    }

    case "research": {
      const insurer = args[1];
      const country = args[2];
      const category = args[3];

      if (!insurer || !country || !category) {
        console.error('Usage: research "Insurer Name" <country> <category>');
        process.exit(1);
      }

      console.log(`\x1b[33mResearching ${insurer} in ${country}/${category}...\x1b[0m\n`);
      const result = await researchInsurer(insurer, country, category);
      console.log(`\nProducts found: ${result.productsFound}`);
      console.log(`New products: ${result.newProducts.join(", ") || "none"}`);
      console.log(`Updates detected: ${result.updatedProducts.length}`);
      if (result.errors.length) console.log(`Errors: ${result.errors.join(", ")}`);
      break;
    }

    case "report": {
      const country = args[1] ?? "in";
      console.log(`\x1b[33mGenerating market report for ${country}...\x1b[0m\n`);
      const report = await generateMarketReport(country);
      console.log(report);
      break;
    }

    case "verify": {
      const country = args[1];
      const category = args[2];

      if (!country || !category) {
        console.error("Usage: verify <country> <category>");
        process.exit(1);
      }

      console.log(`\x1b[33mVerifying ${country}/${category} data with Gemini...\x1b[0m\n`);

      const dataPath = path.join(path.resolve(__dirname, "../../src/data"), country, `${category}-insurance.json`);
      if (!fs.existsSync(dataPath)) {
        console.error(`File not found: ${dataPath}`);
        process.exit(1);
      }

      const data = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
      const products = data.products?.slice(0, 5) ?? [];
      const names = products.map((p: Record<string, unknown>) => `${p.insurerName}: ${p.productName}`);

      const result = await callGeminiText(
        `Verify if these ${category} insurance products are real and currently available in country "${country}":\n${names.join("\n")}\n\nFor each, say: ✓ if real, ✗ if not found, ? if uncertain. Add brief notes.`
      );

      if (result.success) {
        console.log(result.text);
      } else {
        console.error("Verification failed:", result.error);
      }
      break;
    }

    case "push": {
      console.log("\x1b[33mPushing changes to GitHub...\x1b[0m\n");
      const pushed = pushToGitHub();
      if (pushed) {
        console.log("\x1b[32m✓ Pushed to GitHub — Vercel will auto-deploy!\x1b[0m");
      } else {
        console.log("No changes to push.");
      }
      break;
    }

    case "schedule": {
      console.log("\x1b[33mStarting scheduled AI agent...\x1b[0m\n");
      console.log("Schedule:");
      console.log("  • Every 6 hours: Research India + US");
      console.log("  • Every 12 hours: Research UK, UAE, SG");
      console.log("  • Daily: Research all 12 countries");
      console.log("  • After each run: Push to GitHub\n");
      console.log("Press Ctrl+C to stop.\n");

      // Run immediately
      await runScheduledUpdate();

      // Then every 6 hours
      setInterval(runScheduledUpdate, 6 * 60 * 60 * 1000);
      break;
    }

    default: {
      console.log("Usage:");
      console.log("  update <country> [category]    Update a country's data");
      console.log("  update-all                     Update all 12 countries");
      console.log('  research "Insurer" cc cat      Research specific insurer');
      console.log("  report <country>               Generate market report");
      console.log("  verify <country> <category>    Verify data accuracy");
      console.log("  push                           Push changes to GitHub");
      console.log("  schedule                       Start scheduled updates");
      console.log("\nCountries:", COUNTRIES.join(", "));
      console.log("Categories: health, term-life, motor, travel");
    }
  }
}

async function runScheduledUpdate() {
  const timestamp = new Date().toISOString();
  console.log(`\n\x1b[36m[${timestamp}] Running scheduled update...\x1b[0m\n`);

  // Priority countries first
  for (const country of ["in", "us", "uk"]) {
    try {
      await updateCountry(country);
    } catch (err) {
      console.error(`Error updating ${country}:`, err);
    }
  }

  // Push to GitHub
  pushToGitHub(`AI Agent: Scheduled update ${timestamp.split("T")[0]}`);
}

main().catch(console.error);
