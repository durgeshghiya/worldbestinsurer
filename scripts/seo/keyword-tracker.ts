/**
 * SEO Keyword Tracker Agent
 * Generates a keyword map with target pages and search intent analysis.
 *
 * Usage: npx tsx scripts/seo/keyword-tracker.ts
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ──────────────────────────────────────────────────────────────────

export interface KeywordMap {
  keyword: string;
  searchIntent: "informational" | "commercial" | "navigational" | "transactional";
  targetPage: string;
  secondaryPages: string[];
  estimatedVolume: "high" | "medium" | "low";
  currentlyTargeted: boolean;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "../../");
const SRC = path.join(ROOT, "src");
const APP = path.join(SRC, "app");
const DATA_DIR = path.join(ROOT, "data");
const SEO_DIR = path.join(DATA_DIR, "seo");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadJson(filePath: string): any {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

function walkFiles(dir: string, ext: string): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full, ext));
    } else if (entry.name.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

function routeFromFile(filePath: string): string {
  let rel = path.relative(APP, filePath).replace(/\\/g, "/");
  rel = rel.replace(/\/page\.tsx$/, "").replace(/^page\.tsx$/, "");
  if (rel === "") return "/";
  return "/" + rel;
}

interface Product {
  id: string;
  insurerName: string;
  insurerSlug: string;
  productName: string;
  category: string;
  subCategory: string;
  keyInclusions: string[];
  specialFeatures: string[];
}

interface Insurer {
  slug: string;
  name: string;
  shortName: string;
  type: string;
  categories: string[];
}

interface City {
  slug: string;
  name: string;
  tier: number;
}

function loadProducts(): Product[] {
  const files = [
    "health-insurance.json",
    "term-life-insurance.json",
    "motor-insurance.json",
    "travel-insurance.json",
  ];
  const products: Product[] = [];
  for (const f of files) {
    const data = loadJson(path.join(SRC, "data", f));
    products.push(...data.products);
  }
  return products;
}

function loadInsurers(): Insurer[] {
  return loadJson(path.join(SRC, "data", "insurers.json")).insurers;
}

function loadCities(): City[] {
  return loadJson(path.join(SRC, "data", "indian-cities.json")).cities;
}

/** Check if a keyword appears on a page (in metadata or content) */
function isKeywordTargeted(keyword: string, pageFiles: Map<string, string>): boolean {
  const lower = keyword.toLowerCase();
  for (const [_, content] of pageFiles) {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes(lower)) return true;
  }
  return false;
}

/** Load all page files as a route->content map */
function loadPageContents(): Map<string, string> {
  const files = walkFiles(APP, "page.tsx");
  const map = new Map<string, string>();
  for (const f of files) {
    const route = routeFromFile(f);
    map.set(route, fs.readFileSync(f, "utf-8"));
  }
  // Also load layout for metadata
  const layoutPath = path.join(APP, "layout.tsx");
  if (fs.existsSync(layoutPath)) {
    map.set("/layout", fs.readFileSync(layoutPath, "utf-8"));
  }
  return map;
}

// ── Keyword Generators ─────────────────────────────────────────────────────

const currentYear = new Date().getFullYear();

const categoryNames: Record<string, string> = {
  health: "health insurance",
  "term-life": "term life insurance",
  motor: "motor insurance",
  travel: "travel insurance",
};

const categoryDisplayNames: Record<string, string> = {
  health: "Health Insurance",
  "term-life": "Term Life Insurance",
  motor: "Motor Insurance",
  travel: "Travel Insurance",
};

/** 1. Product-based keywords */
function generateProductKeywords(products: Product[]): KeywordMap[] {
  const keywords: KeywordMap[] = [];

  for (const product of products) {
    const productName = product.productName;
    const shortInsurer = product.insurerName.split(" ").slice(0, 2).join(" ");

    // Product name + review
    keywords.push({
      keyword: `${productName} review`,
      searchIntent: "commercial",
      targetPage: `/product/${product.id}`,
      secondaryPages: [`/insurer/${product.insurerSlug}`],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    });

    // Product name + features
    keywords.push({
      keyword: `${productName} features`,
      searchIntent: "informational",
      targetPage: `/product/${product.id}`,
      secondaryPages: [`/compare/${product.category}`],
      estimatedVolume: "low",
      currentlyTargeted: false,
    });

    // Product name + premium
    keywords.push({
      keyword: `${productName} premium`,
      searchIntent: "transactional",
      targetPage: `/product/${product.id}`,
      secondaryPages: [],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    });

    // Product name standalone
    keywords.push({
      keyword: productName,
      searchIntent: "navigational",
      targetPage: `/product/${product.id}`,
      secondaryPages: [`/insurer/${product.insurerSlug}`],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    });
  }

  return keywords;
}

/** 2. Category-based keywords */
function generateCategoryKeywords(): KeywordMap[] {
  const keywords: KeywordMap[] = [];
  const cats = ["health", "term-life", "motor", "travel"];

  for (const cat of cats) {
    const name = categoryNames[cat];
    const displayName = categoryDisplayNames[cat];

    // Category + "in India"
    keywords.push({
      keyword: `${name} in India`,
      searchIntent: "commercial",
      targetPage: `/compare/${cat}`,
      secondaryPages: ["/"],
      estimatedVolume: "high",
      currentlyTargeted: false,
    });

    // Category + "comparison"
    keywords.push({
      keyword: `${name} comparison`,
      searchIntent: "commercial",
      targetPage: `/compare/${cat}`,
      secondaryPages: ["/"],
      estimatedVolume: "high",
      currentlyTargeted: false,
    });

    // "best" + category
    keywords.push({
      keyword: `best ${name} plans`,
      searchIntent: "commercial",
      targetPage: `/compare/${cat}`,
      secondaryPages: ["/"],
      estimatedVolume: "high",
      currentlyTargeted: false,
    });

    // "best" + category + year
    keywords.push({
      keyword: `best ${name} ${currentYear}`,
      searchIntent: "commercial",
      targetPage: `/compare/${cat}`,
      secondaryPages: ["/"],
      estimatedVolume: "high",
      currentlyTargeted: false,
    });

    // "compare" + category + "plans"
    keywords.push({
      keyword: `compare ${name} plans`,
      searchIntent: "commercial",
      targetPage: `/compare/${cat}`,
      secondaryPages: ["/"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    });

    // "top" + category + "companies in India"
    keywords.push({
      keyword: `top ${name} companies in India`,
      searchIntent: "commercial",
      targetPage: `/compare/${cat}`,
      secondaryPages: ["/insurers"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    });

    // "cheapest" + category
    keywords.push({
      keyword: `cheapest ${name} in India`,
      searchIntent: "transactional",
      targetPage: `/compare/${cat}`,
      secondaryPages: [],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    });
  }

  return keywords;
}

/** 3. Insurer-based keywords */
function generateInsurerKeywords(insurers: Insurer[]): KeywordMap[] {
  const keywords: KeywordMap[] = [];

  for (const insurer of insurers) {
    const short = insurer.shortName;

    // Insurer + "insurance plans"
    keywords.push({
      keyword: `${short} insurance plans`,
      searchIntent: "navigational",
      targetPage: `/insurer/${insurer.slug}`,
      secondaryPages: [],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    });

    // Insurer + "claim settlement ratio"
    keywords.push({
      keyword: `${short} claim settlement ratio`,
      searchIntent: "informational",
      targetPage: `/insurer/${insurer.slug}`,
      secondaryPages: ["/learn/claim-settlement-ratio-explained"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    });

    // Insurer + "review"
    keywords.push({
      keyword: `${short} insurance review`,
      searchIntent: "commercial",
      targetPage: `/insurer/${insurer.slug}`,
      secondaryPages: [],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    });

    // For each category the insurer operates in
    for (const cat of insurer.categories) {
      const catName = categoryNames[cat] || cat;
      keywords.push({
        keyword: `${short} ${catName}`,
        searchIntent: "navigational",
        targetPage: `/insurer/${insurer.slug}`,
        secondaryPages: [`/compare/${cat}`],
        estimatedVolume: "low",
        currentlyTargeted: false,
      });
    }
  }

  return keywords;
}

/** 4. City + category combinations */
function generateCityKeywords(cities: City[]): KeywordMap[] {
  const keywords: KeywordMap[] = [];
  const cats = ["health", "term-life", "motor", "travel"];
  const tier1 = cities.filter((c) => c.tier === 1);

  for (const city of tier1) {
    for (const cat of cats) {
      const name = categoryNames[cat];

      // City + category
      keywords.push({
        keyword: `${name} in ${city.name}`,
        searchIntent: "commercial",
        targetPage: `/compare/${cat}/in/${city.slug}`,
        secondaryPages: [`/compare/${cat}`],
        estimatedVolume: "medium",
        currentlyTargeted: false,
      });

      // "best" + category + "in" + city
      keywords.push({
        keyword: `best ${name} in ${city.name}`,
        searchIntent: "commercial",
        targetPage: `/compare/${cat}/in/${city.slug}`,
        secondaryPages: [`/compare/${cat}`],
        estimatedVolume: "medium",
        currentlyTargeted: false,
      });

      // "best" + category + city + year
      keywords.push({
        keyword: `best ${name} in ${city.name} ${currentYear}`,
        searchIntent: "commercial",
        targetPage: `/compare/${cat}/in/${city.slug}`,
        secondaryPages: [],
        estimatedVolume: "medium",
        currentlyTargeted: false,
      });
    }

    // City + "hospitals" (relevant for health)
    keywords.push({
      keyword: `network hospitals in ${city.name}`,
      searchIntent: "informational",
      targetPage: `/compare/health/in/${city.slug}`,
      secondaryPages: [],
      estimatedVolume: "low",
      currentlyTargeted: false,
    });
  }

  return keywords;
}

/** 5. Long-tail informational keywords */
function generateLongTailKeywords(): KeywordMap[] {
  return [
    // "how to compare" queries
    {
      keyword: "how to compare health insurance plans in India",
      searchIntent: "informational",
      targetPage: "/learn/how-to-compare-health-insurance-india",
      secondaryPages: ["/compare/health"],
      estimatedVolume: "high",
      currentlyTargeted: false,
    },
    {
      keyword: "how to compare term insurance plans",
      searchIntent: "informational",
      targetPage: "/learn/what-to-check-before-buying-term-insurance",
      secondaryPages: ["/compare/term-life"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    // "what is" queries
    {
      keyword: "what is claim settlement ratio",
      searchIntent: "informational",
      targetPage: "/learn/claim-settlement-ratio-explained",
      secondaryPages: ["/methodology"],
      estimatedVolume: "high",
      currentlyTargeted: false,
    },
    {
      keyword: "what is waiting period in health insurance",
      searchIntent: "informational",
      targetPage: "/learn/how-waiting-periods-work",
      secondaryPages: ["/compare/health"],
      estimatedVolume: "high",
      currentlyTargeted: false,
    },
    {
      keyword: "what is no claim bonus in health insurance",
      searchIntent: "informational",
      targetPage: "/learn/no-claim-bonus-health-insurance",
      secondaryPages: [],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    {
      keyword: "what is IDV in motor insurance",
      searchIntent: "informational",
      targetPage: "/learn/idv-insured-declared-value-explained",
      secondaryPages: ["/compare/motor"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    {
      keyword: "what is co-payment in health insurance",
      searchIntent: "informational",
      targetPage: "/learn/what-is-copay-health-insurance",
      secondaryPages: [],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    {
      keyword: "what is super top up health insurance",
      searchIntent: "informational",
      targetPage: "/learn/super-top-up-health-insurance-explained",
      secondaryPages: ["/learn/top-up-vs-super-top-up-difference"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    // "best for" queries
    {
      keyword: "best health insurance for parents in India",
      searchIntent: "commercial",
      targetPage: "/learn/health-insurance-for-parents",
      secondaryPages: ["/compare/health"],
      estimatedVolume: "high",
      currentlyTargeted: false,
    },
    {
      keyword: "best term insurance for women in India",
      searchIntent: "commercial",
      targetPage: "/learn/term-insurance-for-women",
      secondaryPages: ["/compare/term-life"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    {
      keyword: "best health insurance for freelancers",
      searchIntent: "commercial",
      targetPage: "/learn/insurance-for-freelancers-gig-workers",
      secondaryPages: ["/compare/health"],
      estimatedVolume: "low",
      currentlyTargeted: false,
    },
    // Tax-related
    {
      keyword: "section 80D health insurance tax benefit",
      searchIntent: "informational",
      targetPage: "/learn/health-insurance-tax-benefits-80d",
      secondaryPages: [],
      estimatedVolume: "high",
      currentlyTargeted: false,
    },
    {
      keyword: "health insurance tax deduction",
      searchIntent: "informational",
      targetPage: "/learn/health-insurance-tax-benefits-80d",
      secondaryPages: [],
      estimatedVolume: "high",
      currentlyTargeted: false,
    },
    // Process queries
    {
      keyword: "how to file health insurance claim",
      searchIntent: "informational",
      targetPage: "/learn/how-to-file-health-insurance-claim",
      secondaryPages: ["/learn/how-claim-processes-differ"],
      estimatedVolume: "high",
      currentlyTargeted: false,
    },
    {
      keyword: "how to port health insurance",
      searchIntent: "informational",
      targetPage: "/learn/how-to-port-health-insurance",
      secondaryPages: [],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    // Comparison-intent queries
    {
      keyword: "family floater vs individual health insurance",
      searchIntent: "commercial",
      targetPage: "/learn/family-floater-vs-individual-health-plan",
      secondaryPages: ["/compare/health"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    {
      keyword: "comprehensive vs third party motor insurance",
      searchIntent: "commercial",
      targetPage: "/learn/comprehensive-vs-third-party-motor",
      secondaryPages: ["/compare/motor"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    {
      keyword: "top up vs super top up health insurance",
      searchIntent: "informational",
      targetPage: "/learn/top-up-vs-super-top-up-difference",
      secondaryPages: ["/learn/super-top-up-health-insurance-explained"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    {
      keyword: "group health vs individual health insurance",
      searchIntent: "informational",
      targetPage: "/learn/group-health-vs-individual-health",
      secondaryPages: [],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    // Brand awareness
    {
      keyword: "Zura insurance comparison",
      searchIntent: "navigational",
      targetPage: "/",
      secondaryPages: ["/about"],
      estimatedVolume: "low",
      currentlyTargeted: false,
    },
    {
      keyword: "insurance comparison platform India",
      searchIntent: "commercial",
      targetPage: "/",
      secondaryPages: ["/about"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    // Schengen / travel-specific
    {
      keyword: "Schengen visa travel insurance India",
      searchIntent: "transactional",
      targetPage: "/learn/schengen-travel-insurance-requirements",
      secondaryPages: ["/compare/travel"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    // Zero depreciation
    {
      keyword: "zero depreciation car insurance",
      searchIntent: "informational",
      targetPage: "/learn/zero-depreciation-motor-insurance",
      secondaryPages: ["/compare/motor"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    // Arogya Sanjeevani
    {
      keyword: "Arogya Sanjeevani policy",
      searchIntent: "informational",
      targetPage: "/learn/arogya-sanjeevani-policy-explained",
      secondaryPages: ["/compare/health"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    // Critical illness
    {
      keyword: "critical illness insurance India",
      searchIntent: "commercial",
      targetPage: "/learn/critical-illness-insurance-guide",
      secondaryPages: ["/compare/health"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    // Maternity
    {
      keyword: "maternity health insurance India",
      searchIntent: "commercial",
      targetPage: "/learn/maternity-health-insurance-india",
      secondaryPages: ["/compare/health"],
      estimatedVolume: "medium",
      currentlyTargeted: false,
    },
    // IRDAI
    {
      keyword: "IRDAI insurance regulator India",
      searchIntent: "informational",
      targetPage: "/learn/irdai-role-insurance-regulation-india",
      secondaryPages: ["/about"],
      estimatedVolume: "low",
      currentlyTargeted: false,
    },
    // Insurance glossary
    {
      keyword: "insurance terms glossary India",
      searchIntent: "informational",
      targetPage: "/learn/insurance-jargon-glossary-india",
      secondaryPages: [],
      estimatedVolume: "low",
      currentlyTargeted: false,
    },
  ];
}

// ── Targeting Check ────────────────────────────────────────────────────────

function checkTargeting(keywords: KeywordMap[], pageContents: Map<string, string>): void {
  for (const kw of keywords) {
    const lower = kw.keyword.toLowerCase();

    // Check if any page content contains this keyword
    for (const [route, content] of pageContents) {
      const lowerContent = content.toLowerCase();
      if (lowerContent.includes(lower)) {
        kw.currentlyTargeted = true;
        break;
      }
    }

    // Also check partial matches for compound keywords
    if (!kw.currentlyTargeted) {
      const words = lower.split(/\s+/).filter((w) => w.length > 3);
      if (words.length >= 3) {
        for (const [_, content] of pageContents) {
          const lowerContent = content.toLowerCase();
          const matchedWords = words.filter((w) => lowerContent.includes(w));
          if (matchedWords.length >= Math.ceil(words.length * 0.7)) {
            kw.currentlyTargeted = true;
            break;
          }
        }
      }
    }
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

export async function generateKeywordMap(): Promise<KeywordMap[]> {
  console.log("\n========================================");
  console.log("  ZURA SEO KEYWORD TRACKER");
  console.log("========================================\n");

  // Load data
  console.log("  Loading data...");
  const products = loadProducts();
  const insurers = loadInsurers();
  const cities = loadCities();
  const pageContents = loadPageContents();

  console.log(`  Products: ${products.length}`);
  console.log(`  Insurers: ${insurers.length}`);
  console.log(`  Cities: ${cities.length}`);
  console.log(`  Pages loaded: ${pageContents.size}\n`);

  // Generate keywords from all sources
  console.log("  Generating keyword map...\n");

  const allKeywords: KeywordMap[] = [];

  process.stdout.write("    Product keywords...");
  const productKWs = generateProductKeywords(products);
  console.log(` ${productKWs.length}`);
  allKeywords.push(...productKWs);

  process.stdout.write("    Category keywords...");
  const categoryKWs = generateCategoryKeywords();
  console.log(` ${categoryKWs.length}`);
  allKeywords.push(...categoryKWs);

  process.stdout.write("    Insurer keywords...");
  const insurerKWs = generateInsurerKeywords(insurers);
  console.log(` ${insurerKWs.length}`);
  allKeywords.push(...insurerKWs);

  process.stdout.write("    City keywords...");
  const cityKWs = generateCityKeywords(cities);
  console.log(` ${cityKWs.length}`);
  allKeywords.push(...cityKWs);

  process.stdout.write("    Long-tail keywords...");
  const longTailKWs = generateLongTailKeywords();
  console.log(` ${longTailKWs.length}`);
  allKeywords.push(...longTailKWs);

  console.log(`\n  Total keywords: ${allKeywords.length}`);

  // Deduplicate by keyword string
  const seen = new Set<string>();
  const unique = allKeywords.filter((kw) => {
    const lower = kw.keyword.toLowerCase();
    if (seen.has(lower)) return false;
    seen.add(lower);
    return true;
  });
  console.log(`  After deduplication: ${unique.length}`);

  // Check targeting
  console.log("  Checking current targeting...");
  checkTargeting(unique, pageContents);

  const targeted = unique.filter((kw) => kw.currentlyTargeted).length;
  const untargeted = unique.length - targeted;
  console.log(`  Currently targeted: ${targeted}`);
  console.log(`  Not yet targeted: ${untargeted}`);

  // Save to file
  ensureDir(SEO_DIR);
  const outputPath = path.join(SEO_DIR, "keyword-map.json");
  fs.writeFileSync(outputPath, JSON.stringify(unique, null, 2));
  console.log(`\n  Saved to: ${path.relative(ROOT, outputPath)}`);

  // Print summary
  console.log("\n========================================");
  console.log("  KEYWORD MAP SUMMARY");
  console.log("========================================\n");

  // By intent
  const byIntent = new Map<string, number>();
  for (const kw of unique) {
    byIntent.set(kw.searchIntent, (byIntent.get(kw.searchIntent) || 0) + 1);
  }
  console.log("  By Search Intent:");
  for (const [intent, count] of byIntent) {
    console.log(`    ${intent.padEnd(16)} ${count} keywords`);
  }

  // By volume
  const byVolume = new Map<string, number>();
  for (const kw of unique) {
    byVolume.set(kw.estimatedVolume, (byVolume.get(kw.estimatedVolume) || 0) + 1);
  }
  console.log("\n  By Estimated Volume:");
  for (const [volume, count] of byVolume) {
    console.log(`    ${volume.padEnd(16)} ${count} keywords`);
  }

  // Top untargeted high-volume keywords
  console.log("\n  Top Untargeted High-Volume Keywords:");
  const highVolumeUntargeted = unique
    .filter((kw) => !kw.currentlyTargeted && kw.estimatedVolume === "high")
    .slice(0, 15);

  if (highVolumeUntargeted.length === 0) {
    console.log("    All high-volume keywords are targeted!");
  } else {
    for (const kw of highVolumeUntargeted) {
      console.log(`    - "${kw.keyword}"`);
      console.log(`      Target: ${kw.targetPage} | Intent: ${kw.searchIntent}`);
    }
  }

  // Top untargeted medium-volume keywords
  console.log("\n  Top Untargeted Medium-Volume Keywords:");
  const medVolumeUntargeted = unique
    .filter((kw) => !kw.currentlyTargeted && kw.estimatedVolume === "medium")
    .slice(0, 10);

  if (medVolumeUntargeted.length === 0) {
    console.log("    All medium-volume keywords are targeted!");
  } else {
    for (const kw of medVolumeUntargeted) {
      console.log(`    - "${kw.keyword}"`);
      console.log(`      Target: ${kw.targetPage} | Intent: ${kw.searchIntent}`);
    }
  }

  console.log(`\n  Total: ${unique.length} keywords mapped`);
  console.log("========================================\n");

  return unique;
}

// CLI entry
if (require.main === module) {
  generateKeywordMap().catch((err) => {
    console.error("Keyword tracking failed:", err);
    process.exit(1);
  });
}
