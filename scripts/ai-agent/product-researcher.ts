/**
 * AI-powered product researcher.
 * Uses Gemini to research, extract, and verify insurance product data.
 */
import * as fs from "fs";
import * as path from "path";
import { callGemini, parseGeminiJSON } from "./gemini";

const ROOT = path.resolve(__dirname, "../../");
const DATA_DIR = path.join(ROOT, "src/data");

interface ProductUpdate {
  id: string;
  insurerName: string;
  productName: string;
  category: string;
  countryCode: string;
  changes: Record<string, { old: unknown; new: unknown }>;
  confidence: "high" | "medium" | "low";
  source: string;
  timestamp: string;
}

interface ResearchResult {
  countryCode: string;
  category: string;
  productsFound: number;
  newProducts: string[];
  updatedProducts: ProductUpdate[];
  retiredProducts: string[];
  errors: string[];
  tokensUsed: number;
}

/**
 * Load existing products for a country and category.
 */
function loadExistingProducts(countryCode: string, category: string): Record<string, unknown>[] {
  const filename = `${category}-insurance.json`;
  const filePath = path.join(DATA_DIR, countryCode, filename);
  const fallbackPath = path.join(DATA_DIR, filename);

  try {
    const raw = fs.readFileSync(fs.existsSync(filePath) ? filePath : fallbackPath, "utf-8");
    const data = JSON.parse(raw);
    return data.products ?? [];
  } catch {
    return [];
  }
}

/**
 * Research a specific insurer's products using Gemini.
 */
export async function researchInsurer(
  insurerName: string,
  countryCode: string,
  category: string
): Promise<ResearchResult> {
  const existing = loadExistingProducts(countryCode, category);
  const existingNames = existing.map((p: Record<string, unknown>) => p.productName);

  const today = new Date().toISOString().split("T")[0];
  const prompt = `List all current ${category} insurance products by ${insurerName} (country: ${countryCode}).
For each product return: id (slug), productName, subCategory, minAge, maxAge, sumInsuredMin, sumInsuredMax, currency, premiumMin, premiumMax, features (3 max), renewability.
Known products: ${existingNames.join(", ") || "none"}.
Return a JSON array like: [{"id":"x","productName":"X","subCategory":"individual","minAge":18,"maxAge":65,"sumInsuredMin":100000,"sumInsuredMax":10000000,"currency":"INR","premiumMin":5000,"premiumMax":25000,"features":["a","b"],"renewability":"lifelong"}]
ONLY real products. JSON array only, no explanation.`;

  const result = await callGemini(prompt, {
    systemInstruction: "You are an expert insurance market researcher. Return accurate, factual data only. Never invent products that don't exist. Use real product names from real insurers.",
    maxTokens: 8192,
  });

  console.log("  API response success:", result.success);
  console.log("  Response text (first 300):", result.text?.substring(0, 300));
  console.log("  Error:", result.error);

  if (!result.success) {
    return {
      countryCode,
      category,
      productsFound: 0,
      newProducts: [],
      updatedProducts: [],
      retiredProducts: [],
      errors: [result.error ?? "Unknown error"],
      tokensUsed: 0,
    };
  }

  try {
    let products: Record<string, unknown>[];

    // Try multiple JSON parsing strategies
    const tryParse = (text: string): Record<string, unknown>[] | null => {
      // Strategy 1: Direct parse
      try { return JSON.parse(text); } catch {}
      // Strategy 2: Extract JSON array
      const arrMatch = text.match(/\[[\s\S]*\]/);
      if (arrMatch) { try { return JSON.parse(arrMatch[0]); } catch {} }
      // Strategy 3: Fix common JSON issues and retry
      if (arrMatch) {
        let fixed = arrMatch[0]
          .replace(/,\s*\]/g, ']')           // trailing commas in arrays
          .replace(/,\s*\}/g, '}')           // trailing commas in objects
          .replace(/[\x00-\x1F]/g, ' ')       // control characters
          .replace(/"\s*\n\s*"/g, '", "');    // broken strings
        try { return JSON.parse(fixed); } catch {}
        // Strategy 4: Truncate to last complete object
        const lastBracket = fixed.lastIndexOf('}');
        if (lastBracket > 0) {
          fixed = fixed.substring(0, lastBracket + 1) + ']';
          try { return JSON.parse(fixed); } catch {}
        }
      }
      return null;
    };

    const parsed = tryParse(result.text);
    if (!parsed) {
      // Last resort: log and try lenient parse
      console.log("  Full response text length:", result.text.length);
      console.log("  Last 200 chars:", result.text.substring(result.text.length - 200));
      throw new Error("Could not parse JSON from response");
    }
    products = parsed;

    if (!Array.isArray(products)) products = [products];

    // Expand simplified format to full product objects
    products = products.map((p) => ({
      id: p.id ?? `${insurerName.toLowerCase().replace(/\s+/g, "-")}-${(p.productName as string ?? "").toLowerCase().replace(/\s+/g, "-")}`,
      insurerName,
      insurerSlug: insurerName.toLowerCase().replace(/\s+/g, "-"),
      productName: p.productName,
      category,
      subCategory: p.subCategory ?? "individual",
      countryCode,
      eligibility: { minAge: p.minAge ?? 18, maxAge: p.maxAge ?? 65 },
      sumInsured: { min: p.sumInsuredMin ?? 0, max: p.sumInsuredMax ?? 0, currency: p.currency ?? "INR" },
      premiumRange: { illustrativeMin: p.premiumMin ?? 0, illustrativeMax: p.premiumMax ?? 0, assumptions: "AI-researched", isVerified: false },
      keyInclusions: p.features ?? [],
      keyExclusions: [],
      specialFeatures: p.features ?? [],
      riders: [],
      renewability: p.renewability ?? "annual",
      policyTenure: { min: 1, max: 3 },
      sourceUrl: "",
      sourceType: "ai-researched",
      lastVerified: today,
      confidenceScore: "medium",
      notes: "AI-researched via Gemini. Verify with official sources.",
      ...p,
    }));

    const newProducts: string[] = [];
    const updatedProducts: ProductUpdate[] = [];

    for (const product of products) {
      const name = product.productName as string;
      const existingProduct = existing.find(
        (p: Record<string, unknown>) => p.productName === name || p.id === product.id
      );

      if (!existingProduct) {
        newProducts.push(name);
      } else {
        // Check for changes
        const changes: Record<string, { old: unknown; new: unknown }> = {};
        for (const key of Object.keys(product)) {
          if (key === "lastVerified" || key === "notes" || key === "sourceType") continue;
          const oldVal = (existingProduct as Record<string, unknown>)[key];
          const newVal = product[key];
          if (JSON.stringify(oldVal) !== JSON.stringify(newVal) && newVal != null) {
            changes[key] = { old: oldVal, new: newVal };
          }
        }
        if (Object.keys(changes).length > 0) {
          updatedProducts.push({
            id: (product.id as string) ?? "",
            insurerName,
            productName: name,
            category,
            countryCode,
            changes,
            confidence: "medium",
            source: "gemini-research",
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    return {
      countryCode,
      category,
      productsFound: products.length,
      newProducts,
      updatedProducts,
      retiredProducts: [],
      errors: [],
      tokensUsed: 0,
    };
  } catch (err) {
    return {
      countryCode,
      category,
      productsFound: 0,
      newProducts: [],
      updatedProducts: [],
      retiredProducts: [],
      errors: [`Parse error: ${err}`],
      tokensUsed: 0,
    };
  }
}

/**
 * Research all insurers for a country and category.
 */
export async function researchCategory(
  countryCode: string,
  category: string
): Promise<ResearchResult> {
  // First, ask Gemini for the list of major insurers
  const insurerPrompt = `List the top 15 ${category} insurance companies in country code "${countryCode}".
Return a JSON array of objects: [{"name": "Company Name", "slug": "company-slug"}]
Only include real, currently operating insurance companies. Return ONLY the JSON array.`;

  const insurerResult = await callGemini(insurerPrompt);

  if (!insurerResult.success) {
    return {
      countryCode,
      category,
      productsFound: 0,
      newProducts: [],
      updatedProducts: [],
      retiredProducts: [],
      errors: [insurerResult.error ?? "Failed to get insurers"],
      tokensUsed: 0,
    };
  }

  let insurers: { name: string; slug: string }[] = [];
  try {
    insurers = JSON.parse(insurerResult.text);
  } catch {
    const match = insurerResult.text.match(/\[[\s\S]*\]/);
    if (match) insurers = JSON.parse(match[0]);
  }

  console.log(`  Found ${insurers.length} insurers for ${countryCode}/${category}`);

  const allResults: ResearchResult = {
    countryCode,
    category,
    productsFound: 0,
    newProducts: [],
    updatedProducts: [],
    retiredProducts: [],
    errors: [],
    tokensUsed: 0,
  };

  // Research each insurer
  for (const insurer of insurers.slice(0, 10)) {
    console.log(`    Researching ${insurer.name}...`);
    const result = await researchInsurer(insurer.name, countryCode, category);
    allResults.productsFound += result.productsFound;
    allResults.newProducts.push(...result.newProducts);
    allResults.updatedProducts.push(...result.updatedProducts);
    allResults.errors.push(...result.errors);
    allResults.tokensUsed += 0;
  }

  return allResults;
}

/**
 * Full research run for a country.
 */
export async function researchCountry(countryCode: string): Promise<ResearchResult[]> {
  const categories = ["health", "term-life", "motor", "travel"];
  const results: ResearchResult[] = [];

  for (const category of categories) {
    console.log(`\n  Researching ${category} insurance in ${countryCode}...`);
    const result = await researchCategory(countryCode, category);
    results.push(result);
    console.log(`    Found: ${result.productsFound} products, ${result.newProducts.length} new, ${result.updatedProducts.length} updated`);
  }

  return results;
}
