/**
 * AI Auto-Updater — Uses Gemini to update product data and push to GitHub.
 * Runs as a scheduled agent for real-time data updates.
 */
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";
import { researchInsurer, researchCategory, researchCountry } from "./product-researcher";
import { callGemini } from "./gemini";

const ROOT = path.resolve(__dirname, "../../");
const DATA_DIR = path.join(ROOT, "src/data");
const REPORTS_DIR = path.join(ROOT, "data/reports");
const LOG_FILE = path.join(REPORTS_DIR, "ai-agent.log");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function log(msg: string) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  ensureDir(REPORTS_DIR);
  fs.appendFileSync(LOG_FILE, line + "\n");
}

/**
 * Merge new products into existing data file.
 */
async function mergeProducts(
  countryCode: string,
  category: string,
  newProducts: Record<string, unknown>[]
): Promise<number> {
  const filename = `${category}-insurance.json`;
  const filePath = path.join(DATA_DIR, countryCode, filename);
  const fallbackPath = path.join(DATA_DIR, filename);
  const actualPath = fs.existsSync(filePath) ? filePath : fallbackPath;

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(fs.readFileSync(actualPath, "utf-8"));
  } catch {
    data = { category, lastUpdated: "", disclaimer: "AI-researched data. Verify with official sources.", products: [] };
  }

  const products = (data.products as Record<string, unknown>[]) ?? [];
  let added = 0;

  for (const newProd of newProducts) {
    const exists = products.some(
      (p) => p.id === newProd.id || p.productName === newProd.productName
    );
    if (!exists) {
      products.push({
        ...newProd,
        sourceType: "ai-researched",
        confidenceScore: "medium",
        notes: `AI-researched on ${new Date().toISOString().split("T")[0]}. Verify with official sources.`,
      });
      added++;
    }
  }

  if (added > 0) {
    data.products = products;
    data.lastUpdated = new Date().toISOString().split("T")[0];
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    log(`  Merged ${added} new products into ${filePath}`);
  }

  return added;
}

/**
 * Research and update a specific country + category.
 */
export async function updateCategory(countryCode: string, category: string): Promise<{
  newProducts: number;
  updatedProducts: number;
  errors: string[];
}> {
  log(`Updating ${countryCode}/${category}...`);
  const result = await researchCategory(countryCode, category);

  if (result.errors.length > 0) {
    log(`  Errors: ${result.errors.join(", ")}`);
  }

  // Get full product data for new products
  let newCount = 0;
  if (result.newProducts.length > 0) {
    log(`  Found ${result.newProducts.length} new products: ${result.newProducts.join(", ")}`);

    // Re-fetch full data for new products
    const prompt = `Return complete product data for these ${category} insurance products in ${countryCode}:
${result.newProducts.join("\n")}

Return a JSON array matching this exact schema for each:
{
  "id": "slug-id",
  "insurerName": "...",
  "insurerSlug": "...",
  "productName": "...",
  "category": "${category}",
  "subCategory": "...",
  "countryCode": "${countryCode}",
  "eligibility": { "minAge": 18, "maxAge": 65 },
  "sumInsured": { "min": 0, "max": 0, "currency": "..." },
  "premiumRange": { "illustrativeMin": 0, "illustrativeMax": 0, "assumptions": "...", "isVerified": false },
  "waitingPeriod": null,
  "keyInclusions": [],
  "keyExclusions": [],
  "claimSettlement": null,
  "networkHospitals": null,
  "riders": [],
  "policyTenure": { "min": 1, "max": 1 },
  "renewability": "annual",
  "specialFeatures": [],
  "sourceUrl": "...",
  "sourceType": "ai-researched",
  "lastVerified": "${new Date().toISOString().split("T")[0]}",
  "confidenceScore": "medium",
  "notes": "AI-researched. Verify with official sources."
}`;

    const fullData = await callGemini(prompt);
    if (fullData.success) {
      try {
        let products = JSON.parse(fullData.text);
        if (!Array.isArray(products)) {
          const match = fullData.text.match(/\[[\s\S]*\]/);
          products = match ? JSON.parse(match[0]) : [];
        }
        newCount = await mergeProducts(countryCode, category, products);
      } catch (err) {
        log(`  Failed to parse new product data: ${err}`);
      }
    }
  }

  return {
    newProducts: newCount,
    updatedProducts: result.updatedProducts.length,
    errors: result.errors,
  };
}

/**
 * Full update run for a country.
 */
export async function updateCountry(countryCode: string): Promise<void> {
  log(`\n${"=".repeat(60)}`);
  log(`Starting full update for country: ${countryCode}`);
  log(`${"=".repeat(60)}`);

  const categories = ["health", "term-life", "motor", "travel"];
  let totalNew = 0;
  let totalUpdated = 0;

  for (const category of categories) {
    const result = await updateCategory(countryCode, category);
    totalNew += result.newProducts;
    totalUpdated += result.updatedProducts;
  }

  log(`\nCountry ${countryCode} complete: ${totalNew} new, ${totalUpdated} updates detected`);
}

/**
 * Push changes to GitHub (triggers Vercel auto-deploy).
 */
export function pushToGitHub(message?: string): boolean {
  try {
    const commitMsg = message ?? `AI Agent: Update insurance data ${new Date().toISOString().split("T")[0]}`;

    execSync("git add -A", { cwd: ROOT, stdio: "pipe" });

    // Check if there are changes to commit
    const status = execSync("git status --porcelain", { cwd: ROOT, encoding: "utf-8" });
    if (!status.trim()) {
      log("No changes to commit");
      return false;
    }

    execSync(`git commit -m "${commitMsg}"`, { cwd: ROOT, stdio: "pipe" });
    execSync("git push origin master", { cwd: ROOT, stdio: "pipe" });
    log(`Pushed to GitHub: ${commitMsg}`);
    return true;
  } catch (err) {
    log(`Git push failed: ${err}`);
    return false;
  }
}

/**
 * Generate a market intelligence report using Gemini.
 */
export async function generateMarketReport(countryCode: string): Promise<string> {
  const prompt = `Generate a brief insurance market intelligence report for country code "${countryCode}".
Include:
1. Recent regulatory changes affecting insurance
2. New product launches in the last 6 months
3. Market trends (digital insurance, premium trends)
4. Notable mergers/acquisitions
5. Consumer behavior changes

Keep it concise — 200-300 words. Focus on factual, verifiable information.`;

  const result = await callGemini(prompt, {
    temperature: 0.3,
    maxTokens: 2048,
  });

  if (result.success) {
    let text: string;
    try {
      const parsed = JSON.parse(result.text);
      text = typeof parsed === "string" ? parsed : JSON.stringify(parsed);
    } catch {
      text = result.text;
    }
    const reportPath = path.join(REPORTS_DIR, `market-report-${countryCode}-${Date.now()}.md`);
    ensureDir(REPORTS_DIR);
    fs.writeFileSync(reportPath, `# Market Report: ${countryCode}\n\n${text}`);
    log(`Market report saved: ${reportPath}`);
    return text;
  }

  return "Failed to generate report";
}
