/**
 * SEO Content Generator Agent
 * Analyzes existing data and generates SEO-optimized content ideas and drafts.
 *
 * Usage: npx tsx scripts/seo/content-generator.ts
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ──────────────────────────────────────────────────────────────────

export interface ContentIdea {
  slug: string;
  title: string;
  category: string;
  targetKeywords: string[];
  estimatedSearchVolume: "high" | "medium" | "low";
  contentType: "guide" | "comparison" | "faq" | "glossary" | "news";
  outline: string[];
  priority: number; // 1-100
}

// ── Helpers ────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "../../");
const SRC = path.join(ROOT, "src");
const DATA_DIR = path.join(ROOT, "data");
const SEO_DIR = path.join(DATA_DIR, "seo");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function loadJson(filePath: string): any {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

interface Product {
  id: string;
  insurerName: string;
  insurerSlug: string;
  productName: string;
  category: string;
  subCategory: string;
  keyInclusions: string[];
  keyExclusions: string[];
  specialFeatures: string[];
  riders: string[];
}

interface Insurer {
  slug: string;
  name: string;
  shortName: string;
  type: string;
  categories: string[];
  headquarters: string;
}

interface City {
  slug: string;
  name: string;
  state: string;
  tier: number;
}

interface Article {
  slug: string;
  title: string;
  category: string;
}

function loadProducts(): Product[] {
  const files = ["health-insurance.json", "term-life-insurance.json", "motor-insurance.json", "travel-insurance.json"];
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

function loadExistingArticles(): Article[] {
  // Parse articles from generators.ts
  const generatorsPath = path.join(SRC, "lib", "generators.ts");
  const content = fs.readFileSync(generatorsPath, "utf-8");

  const articles: Article[] = [];
  const slugMatches = content.matchAll(/slug:\s*["']([^"']+)["']/g);
  const titleMatches = content.matchAll(/title:\s*["']([^"']+)["']/g);

  const slugs: string[] = [];
  const titles: string[] = [];

  for (const m of slugMatches) slugs.push(m[1]);
  for (const m of titleMatches) titles.push(m[1]);

  for (let i = 0; i < slugs.length; i++) {
    articles.push({
      slug: slugs[i],
      title: titles[i] || "",
      category: "",
    });
  }

  return articles;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

// ── Content Generators ─────────────────────────────────────────────────────

const currentYear = new Date().getFullYear();

/** 1. Insurer-specific comparison articles */
function generateInsurerComparisons(insurers: Insurer[]): ContentIdea[] {
  const ideas: ContentIdea[] = [];

  // Group insurers by category overlap
  const healthInsurers = insurers.filter((i) => i.categories.includes("health" as any));
  const lifeInsurers = insurers.filter((i) => i.categories.includes("term-life" as any));
  const motorInsurers = insurers.filter((i) => i.categories.includes("motor" as any));

  const generatePairs = (group: Insurer[], category: string) => {
    // Pick top pairs (limit to avoid explosion)
    const limit = Math.min(group.length, 8);
    for (let i = 0; i < limit; i++) {
      for (let j = i + 1; j < limit; j++) {
        const a = group[i];
        const b = group[j];
        ideas.push({
          slug: slugify(`${a.shortName}-vs-${b.shortName}-${category}-insurance`),
          title: `${a.shortName} vs ${b.shortName}: Which ${category} Insurance Is Better in ${currentYear}?`,
          category,
          targetKeywords: [
            `${a.shortName.toLowerCase()} vs ${b.shortName.toLowerCase()}`,
            `${a.shortName.toLowerCase()} ${category} insurance`,
            `${b.shortName.toLowerCase()} ${category} insurance`,
            `best ${category} insurance india`,
          ],
          estimatedSearchVolume: "medium",
          contentType: "comparison",
          outline: [
            `Introduction: ${a.shortName} vs ${b.shortName} overview`,
            `Company backgrounds and financial strength`,
            `Product comparison: features, coverage, and premiums`,
            `Claim settlement ratio comparison`,
            `Network hospitals/garages comparison`,
            `Customer service and digital experience`,
            `Pros and cons of each insurer`,
            `Who should choose ${a.shortName}?`,
            `Who should choose ${b.shortName}?`,
            `Final verdict and recommendation`,
          ],
          priority: 70,
        });
      }
    }
  };

  generatePairs(healthInsurers, "health");
  generatePairs(lifeInsurers, "term-life");
  generatePairs(motorInsurers, "motor");

  return ideas;
}

/** 2. City-specific content ideas */
function generateCityContent(cities: City[]): ContentIdea[] {
  const ideas: ContentIdea[] = [];

  const categories = [
    { slug: "health", name: "Health Insurance", volume: "high" as const },
    { slug: "term-life", name: "Term Life Insurance", volume: "medium" as const },
    { slug: "motor", name: "Car Insurance", volume: "medium" as const },
  ];

  // Only tier 1 cities for dedicated content
  const tier1Cities = cities.filter((c) => c.tier === 1);

  for (const city of tier1Cities) {
    for (const cat of categories) {
      ideas.push({
        slug: slugify(`best-${cat.slug}-insurance-in-${city.name}-${currentYear}`),
        title: `Best ${cat.name} in ${city.name} ${currentYear}: Plans, Premiums & Hospitals`,
        category: cat.slug,
        targetKeywords: [
          `best ${cat.slug} insurance in ${city.name.toLowerCase()}`,
          `${cat.slug} insurance ${city.name.toLowerCase()}`,
          `${cat.name.toLowerCase()} plans ${city.name.toLowerCase()}`,
          `cheapest ${cat.slug} insurance ${city.name.toLowerCase()}`,
        ],
        estimatedSearchVolume: cat.volume,
        contentType: "guide",
        outline: [
          `Why ${cat.name} matters in ${city.name}`,
          `Top ${cat.name} plans available in ${city.name}`,
          `Average premiums in ${city.name}`,
          `Network hospitals/garages in ${city.name}`,
          `City-specific considerations (cost of living, healthcare quality)`,
          `How to choose the right plan in ${city.name}`,
          `Claim settlement experience in ${city.name}`,
          `Frequently asked questions`,
        ],
        priority: 85,
      });
    }
  }

  return ideas;
}

/** 3. FAQ content from product features */
function generateFAQContent(products: Product[]): ContentIdea[] {
  const ideas: ContentIdea[] = [];

  // Collect unique features across products
  const featureTopics = new Map<string, { count: number; category: string }>();

  for (const product of products) {
    const allFeatures = [
      ...product.keyInclusions,
      ...product.specialFeatures,
      ...product.riders,
    ];
    for (const feature of allFeatures) {
      const normalized = feature.toLowerCase().trim();
      const existing = featureTopics.get(normalized);
      if (existing) {
        existing.count++;
      } else {
        featureTopics.set(normalized, { count: 1, category: product.category });
      }
    }
  }

  // Generate FAQ articles for common features
  const commonFeatures = [...featureTopics.entries()]
    .filter(([_, v]) => v.count >= 2)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 15);

  for (const [feature, info] of commonFeatures) {
    const cleanFeature = feature.replace(/\(.*?\)/g, "").trim();
    if (cleanFeature.length < 5) continue;

    ideas.push({
      slug: slugify(`what-is-${cleanFeature}-in-insurance`),
      title: `What Is ${cleanFeature.charAt(0).toUpperCase() + cleanFeature.slice(1)} in Insurance? Complete Guide`,
      category: info.category,
      targetKeywords: [
        `what is ${cleanFeature}`,
        `${cleanFeature} in insurance`,
        `${cleanFeature} meaning`,
        `${cleanFeature} explained`,
      ],
      estimatedSearchVolume: "medium",
      contentType: "faq",
      outline: [
        `What is ${cleanFeature}?`,
        `How does ${cleanFeature} work?`,
        `Which insurance plans offer ${cleanFeature}?`,
        `Benefits of ${cleanFeature}`,
        `Things to watch out for`,
        `How to claim ${cleanFeature}`,
        `Frequently asked questions`,
      ],
      priority: 55,
    });
  }

  return ideas;
}

/** 4. How-to guides based on categories */
function generateHowToGuides(): ContentIdea[] {
  const guides: ContentIdea[] = [
    {
      slug: slugify(`how-to-compare-health-insurance-plans-india-${currentYear}`),
      title: `How to Compare Health Insurance Plans in India (${currentYear} Guide)`,
      category: "health",
      targetKeywords: [
        "how to compare health insurance",
        "compare health insurance plans india",
        "health insurance comparison guide",
        "best way to choose health insurance",
      ],
      estimatedSearchVolume: "high",
      contentType: "guide",
      outline: [
        "Why comparing health insurance is essential",
        "Step 1: Determine your coverage needs",
        "Step 2: Compare sum insured options",
        "Step 3: Check waiting periods",
        "Step 4: Evaluate network hospitals",
        "Step 5: Compare claim settlement ratios",
        "Step 6: Assess premiums vs benefits",
        "Step 7: Read the fine print (sub-limits, co-pay, exclusions)",
        "Common mistakes to avoid",
        "Comparison checklist template",
      ],
      priority: 90,
    },
    {
      slug: slugify(`how-to-choose-term-insurance-cover-amount`),
      title: `How to Calculate the Right Term Insurance Cover Amount`,
      category: "term-life",
      targetKeywords: [
        "how much term insurance do I need",
        "term insurance cover calculator",
        "term insurance sum assured",
        "right amount term insurance",
      ],
      estimatedSearchVolume: "high",
      contentType: "guide",
      outline: [
        "Why getting the cover amount right matters",
        "The income replacement method (10-15x annual income)",
        "The needs-based approach (loans + expenses + goals)",
        "Factoring in inflation",
        "Accounting for existing savings and assets",
        "Cover amount by age group and life stage",
        "Should you increase cover over time?",
        "Common calculator tools and their limitations",
      ],
      priority: 88,
    },
    {
      slug: slugify(`how-to-file-motor-insurance-claim-india`),
      title: `How to File a Motor Insurance Claim in India: Step-by-Step`,
      category: "motor",
      targetKeywords: [
        "how to file motor insurance claim",
        "car insurance claim process india",
        "motor insurance claim steps",
        "cashless car insurance claim",
      ],
      estimatedSearchVolume: "high",
      contentType: "guide",
      outline: [
        "Types of motor insurance claims (own damage, theft, third-party)",
        "Immediate steps after an accident",
        "Documents required for claim filing",
        "Cashless claim process step-by-step",
        "Reimbursement claim process",
        "Third-party claim process",
        "Dealing with the surveyor",
        "Common reasons for claim rejection",
        "Timeline for claim settlement",
        "Tips to speed up your claim",
      ],
      priority: 85,
    },
    {
      slug: slugify(`how-to-buy-travel-insurance-online-india`),
      title: `How to Buy Travel Insurance Online in India: Complete Guide`,
      category: "travel",
      targetKeywords: [
        "how to buy travel insurance india",
        "travel insurance online india",
        "best way buy travel insurance",
        "travel insurance guide india",
      ],
      estimatedSearchVolume: "medium",
      contentType: "guide",
      outline: [
        "When to buy travel insurance",
        "International vs domestic travel insurance",
        "Key coverage areas to check",
        "How to compare travel insurance plans online",
        "Schengen visa requirements",
        "Pre-existing condition coverage",
        "Adventure sports coverage",
        "How to file a travel insurance claim abroad",
        "Recommended plans for different trip types",
      ],
      priority: 75,
    },
    {
      slug: slugify(`how-to-save-money-on-health-insurance-premiums-india`),
      title: `How to Save Money on Health Insurance Premiums in India`,
      category: "health",
      targetKeywords: [
        "save money health insurance",
        "reduce health insurance premium",
        "cheap health insurance india",
        "health insurance discount tips",
      ],
      estimatedSearchVolume: "medium",
      contentType: "guide",
      outline: [
        "Buy early when you are young and healthy",
        "Choose a higher deductible or voluntary co-pay",
        "Opt for multi-year policies",
        "Use a base plan + super top-up strategy",
        "Compare premiums across insurers",
        "Take advantage of no-claim bonus",
        "Maintain a healthy lifestyle for wellness discounts",
        "Section 80D tax benefits",
        "Family floater vs individual cost comparison",
      ],
      priority: 78,
    },
    {
      slug: slugify(`how-to-port-health-insurance-to-another-company`),
      title: `How to Port Health Insurance to Another Company in India`,
      category: "health",
      targetKeywords: [
        "port health insurance india",
        "health insurance portability",
        "switch health insurance company",
        "change health insurance insurer",
      ],
      estimatedSearchVolume: "medium",
      contentType: "guide",
      outline: [
        "What is health insurance portability?",
        "IRDAI portability rules",
        "Step-by-step porting process",
        "Timeline and deadlines (45-day rule)",
        "What carries over (waiting periods, NCB)",
        "What may change after porting",
        "Common reasons to port",
        "When NOT to port",
        "Documents required for portability",
      ],
      priority: 72,
    },
  ];

  return guides;
}

/** 5. Seasonal content ideas */
function generateSeasonalContent(): ContentIdea[] {
  return [
    {
      slug: slugify(`tax-saving-insurance-section-80c-80d-${currentYear}`),
      title: `Tax-Saving Insurance Options Under Section 80C and 80D (${currentYear})`,
      category: "general",
      targetKeywords: [
        "insurance tax saving 80c 80d",
        "tax benefit insurance india",
        "save tax with insurance",
        `insurance tax deduction ${currentYear}`,
      ],
      estimatedSearchVolume: "high",
      contentType: "guide",
      outline: [
        "Overview of Section 80C and 80D",
        "Health insurance premium deductions (80D)",
        "Life insurance premium deductions (80C)",
        "Deduction limits for different age groups",
        "Preventive health check-up benefit",
        "How to maximize tax savings through insurance",
        "Last-minute tax-saving insurance purchases",
        "Common mistakes when claiming insurance tax benefits",
      ],
      priority: 95,
    },
    {
      slug: slugify(`health-insurance-renewal-checklist-${currentYear}`),
      title: `Health Insurance Renewal Checklist ${currentYear}: What to Check Before Renewing`,
      category: "health",
      targetKeywords: [
        "health insurance renewal",
        "renew health insurance checklist",
        "health insurance renewal tips",
        "should I renew health insurance",
      ],
      estimatedSearchVolume: "medium",
      contentType: "guide",
      outline: [
        "When to start the renewal process",
        "Review your claim history",
        "Check for premium hikes",
        "Evaluate if your sum insured is still adequate",
        "Review no-claim bonus accumulation",
        "Check for better alternatives (portability)",
        "Update nominee and contact details",
        "Renewal vs fresh policy considerations",
      ],
      priority: 80,
    },
    {
      slug: slugify(`monsoon-health-risks-insurance-coverage-india`),
      title: `Monsoon Health Risks and How Insurance Covers Them in India`,
      category: "health",
      targetKeywords: [
        "monsoon health insurance",
        "dengue malaria insurance coverage",
        "monsoon diseases insurance",
        "health insurance monsoon season",
      ],
      estimatedSearchVolume: "medium",
      contentType: "guide",
      outline: [
        "Common monsoon-related health risks in India",
        "Dengue, malaria, typhoid: are they covered?",
        "Waiting periods for vector-borne diseases",
        "Day care treatment coverage for monsoon illnesses",
        "Importance of adequate sum insured during monsoon",
        "Preventive health tips for monsoon season",
      ],
      priority: 65,
    },
    {
      slug: slugify(`new-year-insurance-resolutions-${currentYear}`),
      title: `Insurance Resolutions for ${currentYear}: Protect Your Family This Year`,
      category: "general",
      targetKeywords: [
        `insurance ${currentYear}`,
        `best insurance plans ${currentYear}`,
        `new year insurance checklist`,
        `insurance planning ${currentYear}`,
      ],
      estimatedSearchVolume: "medium",
      contentType: "guide",
      outline: [
        "Review your existing insurance coverage",
        "Check if your health insurance sum insured is enough",
        "Evaluate term life cover against current income",
        "Consider adding a super top-up plan",
        "Review motor insurance add-ons",
        "Start an insurance file for easy access",
        "Teach family members about your policies",
        "Set renewal reminders",
      ],
      priority: 70,
    },
    {
      slug: slugify(`summer-travel-insurance-tips-india-${currentYear}`),
      title: `Summer Travel Insurance Tips for Indian Travellers (${currentYear})`,
      category: "travel",
      targetKeywords: [
        "summer travel insurance india",
        "travel insurance tips summer vacation",
        `travel insurance ${currentYear}`,
        "international travel insurance summer",
      ],
      estimatedSearchVolume: "medium",
      contentType: "guide",
      outline: [
        "Why travel insurance is a must for summer trips",
        "Coverage for popular summer destinations",
        "Adventure sports and trekking coverage",
        "Family travel insurance considerations",
        "Pre-trip cancellation coverage",
        "Medical emergency coverage abroad",
        "How to buy travel insurance last minute",
        "Claim process while travelling",
      ],
      priority: 68,
    },
  ];
}

/** 6. Product-based content gaps */
function generateProductContentGaps(products: Product[]): ContentIdea[] {
  const ideas: ContentIdea[] = [];

  // Group products by category
  const byCategory = new Map<string, Product[]>();
  for (const p of products) {
    const list = byCategory.get(p.category) || [];
    list.push(p);
    byCategory.set(p.category, list);
  }

  const categoryNames: Record<string, string> = {
    health: "Health Insurance",
    "term-life": "Term Life Insurance",
    motor: "Motor Insurance",
    travel: "Travel Insurance",
  };

  for (const [category, catProducts] of byCategory) {
    const catName = categoryNames[category] || category;

    // "Best X insurance plans in India" roundup
    ideas.push({
      slug: slugify(`best-${category}-insurance-plans-india-${currentYear}`),
      title: `Best ${catName} Plans in India ${currentYear}: Top ${catProducts.length} Plans Compared`,
      category,
      targetKeywords: [
        `best ${category} insurance india`,
        `top ${category} insurance plans ${currentYear}`,
        `${category} insurance comparison india`,
        `best ${category} insurance plans`,
      ],
      estimatedSearchVolume: "high",
      contentType: "comparison",
      outline: [
        `How we selected the best ${catName.toLowerCase()} plans`,
        ...catProducts.slice(0, 8).map((p) => `${p.productName}: features, pros, and cons`),
        `Side-by-side comparison table`,
        `How to choose the best plan for your needs`,
        `FAQs about ${catName.toLowerCase()} in India`,
      ],
      priority: 92,
    });

    // "Cheapest/Most Affordable" angle
    ideas.push({
      slug: slugify(`cheapest-${category}-insurance-plans-india-${currentYear}`),
      title: `Most Affordable ${catName} Plans in India (${currentYear})`,
      category,
      targetKeywords: [
        `cheapest ${category} insurance india`,
        `affordable ${category} insurance`,
        `low premium ${category} insurance`,
        `budget ${category} insurance india`,
      ],
      estimatedSearchVolume: "medium",
      contentType: "comparison",
      outline: [
        "Why affordable does not mean low quality",
        "Top affordable plans with premium ranges",
        "Feature comparison at different price points",
        "What you sacrifice with cheaper plans",
        "Best value-for-money options",
        "How to reduce premiums without cutting coverage",
      ],
      priority: 80,
    });

    // Sub-category specific content
    const subCategories = [...new Set(catProducts.map((p) => p.subCategory))];
    for (const sub of subCategories) {
      if (sub === category) continue; // Skip if same as parent
      const cleanSub = sub.replace(/-/g, " ");
      ideas.push({
        slug: slugify(`best-${sub}-insurance-plans-india-${currentYear}`),
        title: `Best ${cleanSub.charAt(0).toUpperCase() + cleanSub.slice(1)} Insurance Plans in India ${currentYear}`,
        category,
        targetKeywords: [
          `best ${cleanSub} insurance india`,
          `${cleanSub} insurance plans`,
          `${cleanSub} insurance comparison`,
        ],
        estimatedSearchVolume: "low",
        contentType: "comparison",
        outline: [
          `What is ${cleanSub} insurance?`,
          `Top ${cleanSub} insurance plans`,
          `Key features to compare`,
          `Who needs ${cleanSub} insurance?`,
          `How to choose the right plan`,
        ],
        priority: 60,
      });
    }
  }

  return ideas;
}

// ── Deduplication & Scoring ────────────────────────────────────────────────

function deduplicateIdeas(ideas: ContentIdea[], existingArticles: Article[]): ContentIdea[] {
  const existingSlugs = new Set(existingArticles.map((a) => a.slug));
  const existingTitlesLower = new Set(existingArticles.map((a) => a.title.toLowerCase()));

  const seen = new Set<string>();
  const unique: ContentIdea[] = [];

  for (const idea of ideas) {
    // Skip if slug matches existing article
    if (existingSlugs.has(idea.slug)) continue;

    // Skip if title is too similar to existing
    const titleLower = idea.title.toLowerCase();
    const isSimilar = [...existingTitlesLower].some((existing) => {
      // Simple similarity: check if 60% of words overlap
      const ideaWords = new Set(titleLower.split(/\s+/));
      const existingWords = existing.split(/\s+/);
      const overlap = existingWords.filter((w) => ideaWords.has(w)).length;
      return overlap / existingWords.length > 0.6;
    });
    if (isSimilar) continue;

    // Skip duplicates within generated ideas
    if (seen.has(idea.slug)) continue;
    seen.add(idea.slug);

    unique.push(idea);
  }

  return unique;
}

function scoreAndSort(ideas: ContentIdea[]): ContentIdea[] {
  // Adjust priority based on search volume and content type
  for (const idea of ideas) {
    let bonus = 0;

    // Volume bonus
    if (idea.estimatedSearchVolume === "high") bonus += 15;
    else if (idea.estimatedSearchVolume === "medium") bonus += 8;

    // Content type bonus (guides and comparisons are high value)
    if (idea.contentType === "guide") bonus += 10;
    if (idea.contentType === "comparison") bonus += 12;
    if (idea.contentType === "faq") bonus += 5;

    // Keyword count bonus
    if (idea.targetKeywords.length >= 4) bonus += 5;

    idea.priority = Math.min(100, idea.priority + bonus);
  }

  return ideas.sort((a, b) => b.priority - a.priority);
}

// ── Main ───────────────────────────────────────────────────────────────────

export async function generateContentIdeas(): Promise<ContentIdea[]> {
  console.log("\n========================================");
  console.log("  ZURA SEO CONTENT GENERATOR");
  console.log("========================================\n");

  // Load data
  console.log("  Loading data...");
  const products = loadProducts();
  const insurers = loadInsurers();
  const cities = loadCities();
  const existingArticles = loadExistingArticles();

  console.log(`  Products: ${products.length}`);
  console.log(`  Insurers: ${insurers.length}`);
  console.log(`  Cities: ${cities.length}`);
  console.log(`  Existing articles: ${existingArticles.length}\n`);

  // Generate ideas from all sources
  console.log("  Generating content ideas...\n");

  const allIdeas: ContentIdea[] = [];

  process.stdout.write("    Insurer comparisons...");
  const comparisons = generateInsurerComparisons(insurers);
  console.log(` ${comparisons.length} ideas`);
  allIdeas.push(...comparisons);

  process.stdout.write("    City-specific content...");
  const cityContent = generateCityContent(cities);
  console.log(` ${cityContent.length} ideas`);
  allIdeas.push(...cityContent);

  process.stdout.write("    FAQ content from features...");
  const faqContent = generateFAQContent(products);
  console.log(` ${faqContent.length} ideas`);
  allIdeas.push(...faqContent);

  process.stdout.write("    How-to guides...");
  const guides = generateHowToGuides();
  console.log(` ${guides.length} ideas`);
  allIdeas.push(...guides);

  process.stdout.write("    Seasonal content...");
  const seasonal = generateSeasonalContent();
  console.log(` ${seasonal.length} ideas`);
  allIdeas.push(...seasonal);

  process.stdout.write("    Product content gaps...");
  const productGaps = generateProductContentGaps(products);
  console.log(` ${productGaps.length} ideas`);
  allIdeas.push(...productGaps);

  console.log(`\n  Total raw ideas: ${allIdeas.length}`);

  // Deduplicate
  const unique = deduplicateIdeas(allIdeas, existingArticles);
  console.log(`  After deduplication: ${unique.length}`);

  // Score and sort
  const sorted = scoreAndSort(unique);

  // Save to file
  ensureDir(SEO_DIR);
  const outputPath = path.join(SEO_DIR, "content-ideas.json");
  fs.writeFileSync(outputPath, JSON.stringify(sorted, null, 2));
  console.log(`\n  Saved ${sorted.length} ideas to: ${path.relative(ROOT, outputPath)}`);

  // Print top 20
  console.log("\n========================================");
  console.log("  TOP 20 CONTENT IDEAS");
  console.log("========================================\n");

  const top20 = sorted.slice(0, 20);
  for (let i = 0; i < top20.length; i++) {
    const idea = top20[i];
    console.log(`  ${(i + 1).toString().padStart(2)}. [Priority: ${idea.priority}] [${idea.estimatedSearchVolume.toUpperCase()}]`);
    console.log(`      ${idea.title}`);
    console.log(`      Type: ${idea.contentType} | Category: ${idea.category}`);
    console.log(`      Keywords: ${idea.targetKeywords.slice(0, 3).join(", ")}`);
    console.log(`      Slug: ${idea.slug}`);
    console.log("");
  }

  // Summary by type
  console.log("========================================");
  console.log("  SUMMARY BY CONTENT TYPE");
  console.log("========================================\n");

  const byType = new Map<string, number>();
  for (const idea of sorted) {
    byType.set(idea.contentType, (byType.get(idea.contentType) || 0) + 1);
  }
  for (const [type, count] of byType) {
    console.log(`  ${type.padEnd(12)} ${count} ideas`);
  }

  console.log(`\n  Total: ${sorted.length} content ideas generated`);
  console.log("========================================\n");

  return sorted;
}

// CLI entry
if (require.main === module) {
  generateContentIdeas().catch((err) => {
    console.error("Content generation failed:", err);
    process.exit(1);
  });
}
