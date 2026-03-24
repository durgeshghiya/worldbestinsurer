/**
 * AI-powered product researcher.
 * Uses Gemini to research, extract, and verify insurance product data.
 */
import * as fs from "fs";
import * as path from "path";
import { rateLimitedCall, callGeminiText } from "./gemini";

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

  const prompt = `You are an insurance product data researcher. Research the current ${category} insurance products offered by ${insurerName} in country code "${countryCode}".

Return a JSON array of products. For each product include:
{
  "id": "slug-format-id",
  "insurerName": "${insurerName}",
  "insurerSlug": "slug-format",
  "productName": "Official Product Name",
  "category": "${category}",
  "subCategory": "individual|family-floater|senior-citizen|comprehensive|third-party|etc",
  "countryCode": "${countryCode}",
  "eligibility": { "minAge": 18, "maxAge": 65 },
  "sumInsured": { "min": 0, "max": 0, "currency": "INR|USD|GBP|etc" },
  "premiumRange": { "illustrativeMin": 0, "illustrativeMax": 0, "assumptions": "description", "isVerified": false },
  "keyInclusions": ["feature1", "feature2"],
  "keyExclusions": ["exclusion1"],
  "specialFeatures": ["feature1"],
  "riders": ["rider1"],
  "renewability": "lifelong|annual|till-age-X",
  "policyTenure": { "min": 1, "max": 30 },
  "sourceUrl": "https://official-url",
  "sourceType": "ai-researched",
  "lastVerified": "${new Date().toISOString().split("T")[0]}",
  "confidenceScore": "medium",
  "notes": "AI-researched data. Verify with official sources."
}

IMPORTANT:
- Only include products you are confident actually exist
- Use realistic premium ranges in local currency
- Mark confidence as "medium" since this is AI-researched
- Include the official product page URL if known
- If unsure about a field, use null

Currently known products for this insurer: ${existingNames.join(", ") || "none"}

Return ONLY the JSON array, no explanation.`;

  const result = await rateLimitedCall(prompt, {
    systemInstruction: "You are an expert insurance market researcher. Return accurate, factual data only. Never invent products that don't exist. Use real product names from real insurers.",
    maxTokens: 8192,
  });

  if (!result.success) {
    return {
      countryCode,
      category,
      productsFound: 0,
      newProducts: [],
      updatedProducts: [],
      retiredProducts: [],
      errors: [result.error ?? "Unknown error"],
      tokensUsed: result.tokensUsed,
    };
  }

  try {
    let products: Record<string, unknown>[];
    try {
      products = JSON.parse(result.text);
    } catch {
      // Try to extract JSON array from response
      const match = result.text.match(/\[[\s\S]*\]/);
      if (match) {
        products = JSON.parse(match[0]);
      } else {
        throw new Error("Could not parse JSON from response");
      }
    }

    if (!Array.isArray(products)) products = [products];

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
      tokensUsed: result.tokensUsed,
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
      tokensUsed: result.tokensUsed,
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

  const insurerResult = await rateLimitedCall(insurerPrompt);

  if (!insurerResult.success) {
    return {
      countryCode,
      category,
      productsFound: 0,
      newProducts: [],
      updatedProducts: [],
      retiredProducts: [],
      errors: [insurerResult.error ?? "Failed to get insurers"],
      tokensUsed: insurerResult.tokensUsed,
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
    tokensUsed: insurerResult.tokensUsed,
  };

  // Research each insurer
  for (const insurer of insurers.slice(0, 10)) {
    console.log(`    Researching ${insurer.name}...`);
    const result = await researchInsurer(insurer.name, countryCode, category);
    allResults.productsFound += result.productsFound;
    allResults.newProducts.push(...result.newProducts);
    allResults.updatedProducts.push(...result.updatedProducts);
    allResults.errors.push(...result.errors);
    allResults.tokensUsed += result.tokensUsed;
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
