/**
 * SEO Internal Linking Agent
 * Analyzes and improves internal linking across the Zura site.
 *
 * Usage: npx tsx scripts/seo/internal-linker.ts
 */

import * as fs from "fs";
import * as path from "path";

// ── Types ──────────────────────────────────────────────────────────────────

export interface LinkSuggestion {
  sourcePage: string;
  targetPage: string;
  anchorText: string;
  reason: string;
  priority: "high" | "medium" | "low";
}

interface LinkEdge {
  source: string;
  target: string;
  anchorText: string;
}

interface PageNode {
  route: string;
  filePath: string;
  inbound: number;
  outbound: number;
  category: string;
  type: "static" | "dynamic";
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

function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

function categorizeRoute(route: string): string {
  if (route.startsWith("/compare/health") || route.includes("health")) return "health";
  if (route.startsWith("/compare/term-life") || route.includes("term-life")) return "term-life";
  if (route.startsWith("/compare/motor") || route.includes("motor")) return "motor";
  if (route.startsWith("/compare/travel") || route.includes("travel")) return "travel";
  if (route.startsWith("/insurer") || route.startsWith("/insurers")) return "insurers";
  if (route.startsWith("/product/")) return "product";
  if (route.startsWith("/vs/")) return "comparison";
  if (route.startsWith("/learn")) return "learn";
  return "general";
}

// ── Link Graph Builder ─────────────────────────────────────────────────────

function buildLinkGraph(): { nodes: Map<string, PageNode>; edges: LinkEdge[] } {
  const pageFiles = walkFiles(APP, "page.tsx");
  const componentFiles = walkFiles(path.join(SRC, "components"), ".tsx");
  const allTsxFiles = [...pageFiles, ...componentFiles, ...walkFiles(APP, ".tsx")];

  // Deduplicate files
  const uniqueFiles = [...new Set(allTsxFiles)];

  // Build page nodes
  const nodes = new Map<string, PageNode>();
  for (const f of pageFiles) {
    const route = routeFromFile(f);
    nodes.set(route, {
      route,
      filePath: f,
      inbound: 0,
      outbound: 0,
      category: categorizeRoute(route),
      type: route.includes("[") ? "dynamic" : "static",
    });
  }

  // Scan for links
  const edges: LinkEdge[] = [];
  const fileRouteMap = new Map<string, string>();
  for (const f of pageFiles) {
    fileRouteMap.set(f, routeFromFile(f));
  }

  for (const f of uniqueFiles) {
    const content = readFile(f);
    const sourceRoute = fileRouteMap.get(f) || path.relative(SRC, f).replace(/\\/g, "/");

    // Match <Link href="..." and <Link href={`...`}
    // Pattern 1: href="/path"
    const staticLinks = content.matchAll(/href=["'](\/([\w\-\/]*?))["']/g);
    for (const m of staticLinks) {
      const target = m[1];
      if (target === "#" || target.startsWith("http")) continue;
      edges.push({
        source: sourceRoute,
        target,
        anchorText: extractAnchorText(content, m.index || 0),
      });

      // Update node counts
      const targetNode = nodes.get(target);
      if (targetNode) targetNode.inbound++;
      const sourceNode = nodes.get(sourceRoute);
      if (sourceNode) sourceNode.outbound++;
    }

    // Pattern 2: href={`/path/${var}`}
    const dynamicLinks = content.matchAll(/href=\{[`"](\/([\w\-\/\$\{\}]*?))[`"]\}/g);
    for (const m of dynamicLinks) {
      const target = m[1].replace(/\$\{[^}]+\}/g, "*");
      edges.push({
        source: sourceRoute,
        target,
        anchorText: "[dynamic]",
      });
    }
  }

  return { nodes, edges };
}

/** Try to extract anchor text near a link match */
function extractAnchorText(content: string, matchIndex: number): string {
  // Look for text content after the href attribute within the Link/a tag
  const after = content.slice(matchIndex, matchIndex + 300);

  // Try to find text between > and </
  const textMatch = after.match(/>([^<{]+)</);
  if (textMatch) return textMatch[1].trim().slice(0, 60);

  // Try to find string literal inside the link
  const stringMatch = after.match(/>.*?["']([^"']+)["']/s);
  if (stringMatch) return stringMatch[1].trim().slice(0, 60);

  return "[unknown]";
}

// ── Analysis Functions ─────────────────────────────────────────────────────

function findOrphanPages(nodes: Map<string, PageNode>, edges: LinkEdge[]): PageNode[] {
  // Pages with zero inbound links (excluding home and admin)
  const linkedTargets = new Set(edges.map((e) => e.target));

  // Also check partial matches for dynamic routes
  const orphans: PageNode[] = [];
  for (const [route, node] of nodes) {
    if (route === "/" || route === "/admin") continue;
    if (node.type === "dynamic") continue; // Dynamic routes are linked via params

    const isLinked =
      linkedTargets.has(route) ||
      [...linkedTargets].some(
        (t) =>
          t.includes("*") &&
          route.startsWith(t.replace("*", "").replace(/\/$/, ""))
      );

    if (!isLinked) {
      orphans.push(node);
    }
  }

  return orphans;
}

function findHubPages(nodes: Map<string, PageNode>): PageNode[] {
  return [...nodes.values()]
    .filter((n) => n.outbound >= 5)
    .sort((a, b) => b.outbound - a.outbound);
}

function findIslandPages(nodes: Map<string, PageNode>): PageNode[] {
  // Pages with neither inbound nor outbound links
  return [...nodes.values()].filter(
    (n) => n.inbound === 0 && n.outbound === 0 && n.route !== "/" && n.type === "static"
  );
}

// ── Link Suggestion Generators ─────────────────────────────────────────────

function suggestCrossLinks(products: any[], articles: any[]): LinkSuggestion[] {
  const suggestions: LinkSuggestion[] = [];

  // Map article categories to product categories
  const categoryMap: Record<string, string> = {
    Health: "health",
    "Term Life": "term-life",
    Motor: "motor",
    Travel: "travel",
  };

  for (const article of articles) {
    const productCategory = categoryMap[article.category] || null;
    if (!productCategory) continue;

    // Find related products
    const relatedProducts = products.filter(
      (p: any) => p.category === productCategory
    );

    if (relatedProducts.length > 0) {
      // Suggest linking from learn article to top related product
      const topProduct = relatedProducts[0];
      suggestions.push({
        sourcePage: `/learn/${article.slug}`,
        targetPage: `/product/${topProduct.id}`,
        anchorText: topProduct.productName,
        reason: `Article about ${article.category} should link to related product for user navigation.`,
        priority: "high",
      });

      // Suggest linking from learn article to category comparison page
      suggestions.push({
        sourcePage: `/learn/${article.slug}`,
        targetPage: `/compare/${productCategory}`,
        anchorText: `Compare ${article.category} insurance plans`,
        reason: `Article readers may want to compare plans in the same category.`,
        priority: "high",
      });
    }
  }

  return suggestions;
}

function suggestCityToInsurerLinks(
  cities: any[],
  insurers: any[]
): LinkSuggestion[] {
  const suggestions: LinkSuggestion[] = [];
  const categories = ["health", "term-life", "motor", "travel"];
  const tier1Cities = cities.filter((c: any) => c.tier === 1);

  for (const city of tier1Cities) {
    for (const category of categories) {
      // Find insurers headquartered in this city
      const localInsurers = insurers.filter(
        (i: any) => i.headquarters === city.name
      );

      for (const insurer of localInsurers.slice(0, 3)) {
        suggestions.push({
          sourcePage: `/compare/${category}/in/${city.slug}`,
          targetPage: `/insurer/${insurer.slug}`,
          anchorText: `${insurer.shortName} insurance plans`,
          reason: `${insurer.shortName} is headquartered in ${city.name}. Local insurer connection improves relevance.`,
          priority: "medium",
        });
      }
    }
  }

  return suggestions;
}

function suggestVSToProductLinks(products: any[]): LinkSuggestion[] {
  const suggestions: LinkSuggestion[] = [];

  // Group products by category
  const byCategory = new Map<string, any[]>();
  for (const p of products) {
    const list = byCategory.get(p.category) || [];
    list.push(p);
    byCategory.set(p.category, list);
  }

  for (const [category, catProducts] of byCategory) {
    const limit = Math.min(catProducts.length, 6);
    for (let i = 0; i < limit; i++) {
      for (let j = i + 1; j < limit; j++) {
        const a = catProducts[i];
        const b = catProducts[j];
        const vsSlug = `${a.id}-vs-${b.id}`;

        // VS page should link to both product pages
        suggestions.push({
          sourcePage: `/vs/${vsSlug}`,
          targetPage: `/product/${a.id}`,
          anchorText: `${a.productName} details`,
          reason: `VS comparison page should link to detailed product page for ${a.productName}.`,
          priority: "high",
        });

        suggestions.push({
          sourcePage: `/vs/${vsSlug}`,
          targetPage: `/product/${b.id}`,
          anchorText: `${b.productName} details`,
          reason: `VS comparison page should link to detailed product page for ${b.productName}.`,
          priority: "high",
        });

        // Also link VS page to the category page
        suggestions.push({
          sourcePage: `/vs/${vsSlug}`,
          targetPage: `/compare/${category}`,
          anchorText: `See all ${category} insurance plans`,
          reason: `VS page should link back to category overview for broader context.`,
          priority: "medium",
        });
      }
    }
  }

  return suggestions;
}

function suggestInsurerToProductLinks(
  insurers: any[],
  products: any[]
): LinkSuggestion[] {
  const suggestions: LinkSuggestion[] = [];

  for (const insurer of insurers) {
    const insurerProducts = products.filter(
      (p: any) => p.insurerSlug === insurer.slug
    );

    for (const product of insurerProducts) {
      suggestions.push({
        sourcePage: `/insurer/${insurer.slug}`,
        targetPage: `/product/${product.id}`,
        anchorText: product.productName,
        reason: `Insurer page should link to each of its product detail pages.`,
        priority: "high",
      });
    }

    // Insurer page should link to relevant VS pages
    if (insurerProducts.length >= 2) {
      suggestions.push({
        sourcePage: `/insurer/${insurer.slug}`,
        targetPage: `/compare/${insurerProducts[0].category}`,
        anchorText: `Compare ${insurer.shortName} plans with competitors`,
        reason: `Insurer pages should link to comparison pages for user flow.`,
        priority: "medium",
      });
    }
  }

  return suggestions;
}

function suggestOrphanFixes(orphans: PageNode[]): LinkSuggestion[] {
  const suggestions: LinkSuggestion[] = [];

  for (const orphan of orphans) {
    // Suggest adding link from most relevant hub page
    let suggestedSource = "/";
    let anchorText = orphan.route.split("/").pop() || "Link";

    if (orphan.category === "learn") {
      suggestedSource = "/learn";
      anchorText = "Read this article";
    } else if (orphan.category === "insurers") {
      suggestedSource = "/insurers";
      anchorText = "View insurer details";
    }

    suggestions.push({
      sourcePage: suggestedSource,
      targetPage: orphan.route,
      anchorText,
      reason: `Orphan page with no inbound links. Needs at least one link from a relevant hub page.`,
      priority: "high",
    });
  }

  return suggestions;
}

// ── Link Equity Report ─────────────────────────────────────────────────────

interface LinkEquityReport {
  totalPages: number;
  totalLinks: number;
  orphanPages: string[];
  hubPages: { route: string; outbound: number }[];
  islandPages: string[];
  avgInboundLinks: number;
  avgOutboundLinks: number;
  linkDistribution: {
    zeroInbound: number;
    lowInbound: number; // 1-2
    mediumInbound: number; // 3-5
    highInbound: number; // 6+
  };
}

function generateLinkEquityReport(
  nodes: Map<string, PageNode>,
  edges: LinkEdge[]
): LinkEquityReport {
  const nodeList = [...nodes.values()];
  const staticNodes = nodeList.filter((n) => n.type === "static");

  const totalInbound = staticNodes.reduce((sum, n) => sum + n.inbound, 0);
  const totalOutbound = staticNodes.reduce((sum, n) => sum + n.outbound, 0);

  return {
    totalPages: nodeList.length,
    totalLinks: edges.length,
    orphanPages: staticNodes
      .filter((n) => n.inbound === 0 && n.route !== "/")
      .map((n) => n.route),
    hubPages: nodeList
      .filter((n) => n.outbound >= 5)
      .sort((a, b) => b.outbound - a.outbound)
      .map((n) => ({ route: n.route, outbound: n.outbound })),
    islandPages: staticNodes
      .filter((n) => n.inbound === 0 && n.outbound === 0 && n.route !== "/")
      .map((n) => n.route),
    avgInboundLinks:
      staticNodes.length > 0
        ? Math.round((totalInbound / staticNodes.length) * 10) / 10
        : 0,
    avgOutboundLinks:
      staticNodes.length > 0
        ? Math.round((totalOutbound / staticNodes.length) * 10) / 10
        : 0,
    linkDistribution: {
      zeroInbound: staticNodes.filter((n) => n.inbound === 0).length,
      lowInbound: staticNodes.filter((n) => n.inbound >= 1 && n.inbound <= 2).length,
      mediumInbound: staticNodes.filter((n) => n.inbound >= 3 && n.inbound <= 5).length,
      highInbound: staticNodes.filter((n) => n.inbound >= 6).length,
    },
  };
}

// ── Main ───────────────────────────────────────────────────────────────────

export async function analyzeInternalLinks(): Promise<{
  suggestions: LinkSuggestion[];
  equityReport: LinkEquityReport;
}> {
  console.log("\n========================================");
  console.log("  ZURA INTERNAL LINK ANALYZER");
  console.log("========================================\n");

  // Build link graph
  console.log("  Building link graph...");
  const { nodes, edges } = buildLinkGraph();
  console.log(`  Pages: ${nodes.size}`);
  console.log(`  Links found: ${edges.length}\n`);

  // Load data for suggestions
  const products = loadJson(path.join(SRC, "data", "health-insurance.json")).products
    .concat(loadJson(path.join(SRC, "data", "term-life-insurance.json")).products)
    .concat(loadJson(path.join(SRC, "data", "motor-insurance.json")).products)
    .concat(loadJson(path.join(SRC, "data", "travel-insurance.json")).products);
  const insurers = loadJson(path.join(SRC, "data", "insurers.json")).insurers;
  const cities = loadJson(path.join(SRC, "data", "indian-cities.json")).cities;

  // Extract articles from generators.ts
  const generatorsContent = readFile(path.join(SRC, "lib", "generators.ts"));
  const articleSlugs = [...generatorsContent.matchAll(/slug:\s*["']([^"']+)["']/g)].map((m) => m[1]);
  const articleTitles = [...generatorsContent.matchAll(/title:\s*["']([^"']+)["']/g)].map((m) => m[1]);
  const articleCategories = [...generatorsContent.matchAll(/category:\s*["']([^"']+)["']/g)].map((m) => m[1]);
  const articles = articleSlugs.map((slug, i) => ({
    slug,
    title: articleTitles[i] || "",
    category: articleCategories[i] || "",
  }));

  // Analyze
  console.log("  Analyzing link structure...\n");

  const orphans = findOrphanPages(nodes, edges);
  const hubs = findHubPages(nodes);
  const islands = findIslandPages(nodes);

  console.log(`  Orphan pages (no inbound links): ${orphans.length}`);
  console.log(`  Hub pages (5+ outbound links): ${hubs.length}`);
  console.log(`  Island pages (no links at all): ${islands.length}\n`);

  // Generate suggestions
  console.log("  Generating link suggestions...\n");

  const allSuggestions: LinkSuggestion[] = [];

  const crossLinks = suggestCrossLinks(products, articles);
  console.log(`    Cross-links (learn <-> products): ${crossLinks.length}`);
  allSuggestions.push(...crossLinks);

  const cityLinks = suggestCityToInsurerLinks(cities, insurers);
  console.log(`    City -> insurer links: ${cityLinks.length}`);
  allSuggestions.push(...cityLinks);

  const vsLinks = suggestVSToProductLinks(products);
  console.log(`    VS -> product links: ${vsLinks.length}`);
  allSuggestions.push(...vsLinks);

  const insurerLinks = suggestInsurerToProductLinks(insurers, products);
  console.log(`    Insurer -> product links: ${insurerLinks.length}`);
  allSuggestions.push(...insurerLinks);

  const orphanFixes = suggestOrphanFixes(orphans);
  console.log(`    Orphan page fixes: ${orphanFixes.length}`);
  allSuggestions.push(...orphanFixes);

  // Deduplicate suggestions
  const seen = new Set<string>();
  const unique = allSuggestions.filter((s) => {
    const key = `${s.sourcePage}|${s.targetPage}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort by priority
  const priorityOrder = { high: 0, medium: 1, low: 2 };
  unique.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  console.log(`\n  Total unique suggestions: ${unique.length}`);

  // Generate equity report
  const equityReport = generateLinkEquityReport(nodes, edges);

  // Save results
  ensureDir(SEO_DIR);
  const outputPath = path.join(SEO_DIR, "link-suggestions.json");
  fs.writeFileSync(
    outputPath,
    JSON.stringify({ suggestions: unique, equityReport }, null, 2)
  );
  console.log(`\n  Saved to: ${path.relative(ROOT, outputPath)}`);

  // Print top suggestions
  console.log("\n========================================");
  console.log("  TOP LINK SUGGESTIONS");
  console.log("========================================\n");

  const topSuggestions = unique.slice(0, 25);
  for (let i = 0; i < topSuggestions.length; i++) {
    const s = topSuggestions[i];
    console.log(
      `  ${(i + 1).toString().padStart(2)}. [${s.priority.toUpperCase()}] ${s.sourcePage} -> ${s.targetPage}`
    );
    console.log(`      Anchor: "${s.anchorText}"`);
    console.log(`      Reason: ${s.reason}`);
    console.log("");
  }

  // Print equity report
  console.log("========================================");
  console.log("  LINK EQUITY REPORT");
  console.log("========================================\n");

  console.log(`  Total Pages: ${equityReport.totalPages}`);
  console.log(`  Total Links: ${equityReport.totalLinks}`);
  console.log(`  Avg Inbound Links: ${equityReport.avgInboundLinks}`);
  console.log(`  Avg Outbound Links: ${equityReport.avgOutboundLinks}`);
  console.log("");
  console.log("  Inbound Link Distribution:");
  console.log(`    0 links:   ${equityReport.linkDistribution.zeroInbound} pages`);
  console.log(`    1-2 links: ${equityReport.linkDistribution.lowInbound} pages`);
  console.log(`    3-5 links: ${equityReport.linkDistribution.mediumInbound} pages`);
  console.log(`    6+ links:  ${equityReport.linkDistribution.highInbound} pages`);

  if (equityReport.orphanPages.length > 0) {
    console.log("\n  Orphan Pages:");
    for (const p of equityReport.orphanPages) {
      console.log(`    - ${p}`);
    }
  }

  if (equityReport.hubPages.length > 0) {
    console.log("\n  Hub Pages:");
    for (const h of equityReport.hubPages.slice(0, 10)) {
      console.log(`    - ${h.route} (${h.outbound} outbound links)`);
    }
  }

  console.log("\n========================================\n");

  return { suggestions: unique, equityReport };
}

// CLI entry
if (require.main === module) {
  analyzeInternalLinks().catch((err) => {
    console.error("Internal link analysis failed:", err);
    process.exit(1);
  });
}
