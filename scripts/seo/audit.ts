/**
 * SEO Audit Agent
 * Scans the entire Zura site and generates a comprehensive SEO health report.
 *
 * Usage: npx tsx scripts/seo/audit.ts
 */

import * as fs from "fs";
import * as path from "path";
import * as glob from "path";

// ── Types ──────────────────────────────────────────────────────────────────

export interface SEOAuditResult {
  runAt: string;
  totalPages: number;
  issues: SEOIssue[];
  score: number; // 0-100
  summary: {
    critical: number;
    warning: number;
    info: number;
    passed: number;
  };
}

export interface SEOIssue {
  severity: "critical" | "warning" | "info";
  category: string;
  page: string;
  message: string;
  suggestion: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "../../");
const SRC = path.join(ROOT, "src");
const APP = path.join(SRC, "app");
const DATA_DIR = path.join(ROOT, "data");
const REPORTS_DIR = path.join(DATA_DIR, "reports");

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/** Recursively collect files matching a pattern */
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

/** Get the route path from a file path (relative to app dir) */
function routeFromFile(filePath: string): string {
  let rel = path.relative(APP, filePath).replace(/\\/g, "/");
  rel = rel.replace(/\/page\.tsx$/, "").replace(/^page\.tsx$/, "");
  if (rel === "") return "/";
  return "/" + rel;
}

/** Read a file's content as a string */
function readFile(filePath: string): string {
  return fs.readFileSync(filePath, "utf-8");
}

// ── Checkers ───────────────────────────────────────────────────────────────

interface PageInfo {
  filePath: string;
  route: string;
  content: string;
}

function findPageFiles(): PageInfo[] {
  const pageFiles = walkFiles(APP, "page.tsx");
  return pageFiles.map((f) => ({
    filePath: f,
    route: routeFromFile(f),
    content: readFile(f),
  }));
}

function findAllTsxFiles(): string[] {
  return [
    ...walkFiles(APP, ".tsx"),
    ...walkFiles(path.join(SRC, "components"), ".tsx"),
  ];
}

// 1. Title Tag checks
function checkTitles(pages: PageInfo[]): { issues: SEOIssue[]; passed: number } {
  const issues: SEOIssue[] = [];
  let passed = 0;

  // Collect titles from metadata exports
  const titleMap = new Map<string, string[]>();

  for (const page of pages) {
    const { content, route } = page;

    // Check for generateMetadata or export const metadata
    const hasGenerateMetadata = /export\s+(async\s+)?function\s+generateMetadata/.test(content);
    const hasStaticMetadata = /export\s+const\s+metadata\s*[:=]/.test(content);

    if (!hasGenerateMetadata && !hasStaticMetadata) {
      // Check if it's a layout that might provide metadata
      const layoutPath = path.join(path.dirname(page.filePath), "layout.tsx");
      const parentLayoutPath = path.join(APP, "layout.tsx");
      const hasLayout = fs.existsSync(layoutPath);

      if (!hasLayout && route !== "/") {
        issues.push({
          severity: "warning",
          category: "Title Tags",
          page: route,
          message: "Page has no metadata export (title/description).",
          suggestion:
            "Add `export const metadata` or `generateMetadata` to set page-specific title and description. The root layout provides a default but page-specific titles improve SEO.",
        });
      } else {
        passed++;
      }
      continue;
    }

    // Extract static title if present
    const staticTitleMatch = content.match(
      /title:\s*["'`]([^"'`]+)["'`]/
    );
    if (staticTitleMatch) {
      const title = staticTitleMatch[1];
      if (title.length < 30) {
        issues.push({
          severity: "warning",
          category: "Title Tags",
          page: route,
          message: `Title "${title}" is too short (${title.length} chars).`,
          suggestion: "Titles should be 30-60 characters for optimal search display.",
        });
      } else if (title.length > 60) {
        issues.push({
          severity: "warning",
          category: "Title Tags",
          page: route,
          message: `Title "${title}" is too long (${title.length} chars).`,
          suggestion: "Titles over 60 characters get truncated in search results. Shorten it.",
        });
      } else {
        passed++;
      }

      // Track for duplicate detection
      const existing = titleMap.get(title) || [];
      existing.push(route);
      titleMap.set(title, existing);
    } else if (hasGenerateMetadata) {
      // Dynamic metadata - can't easily check length but it exists
      passed++;
    } else {
      passed++;
    }
  }

  // Check for duplicate titles
  for (const [title, routes] of titleMap) {
    if (routes.length > 1) {
      issues.push({
        severity: "critical",
        category: "Title Tags",
        page: routes.join(", "),
        message: `Duplicate title "${title}" found on ${routes.length} pages.`,
        suggestion: "Each page must have a unique title. Differentiate with specifics like product name or category.",
      });
    }
  }

  return { issues, passed };
}

// 2. Meta Description checks
function checkMetaDescriptions(pages: PageInfo[]): { issues: SEOIssue[]; passed: number } {
  const issues: SEOIssue[] = [];
  let passed = 0;
  const descMap = new Map<string, string[]>();

  for (const page of pages) {
    const { content, route } = page;

    const hasGenerateMetadata = /export\s+(async\s+)?function\s+generateMetadata/.test(content);
    const hasStaticMetadata = /export\s+const\s+metadata/.test(content);

    if (!hasGenerateMetadata && !hasStaticMetadata) {
      // Root layout provides default description
      if (route !== "/") {
        issues.push({
          severity: "warning",
          category: "Meta Descriptions",
          page: route,
          message: "No meta description set for this page.",
          suggestion: "Add a unique description via metadata export. Root layout default may be too generic.",
        });
      }
      continue;
    }

    // Extract description
    const descMatch = content.match(
      /description:\s*["'`]([^"'`]+)["'`]/
    );
    const descTemplateMatch = content.match(
      /description:\s*`([^`]+)`/
    );
    const desc = descMatch?.[1] || descTemplateMatch?.[1];

    if (desc && !desc.includes("${")) {
      if (desc.length < 120) {
        issues.push({
          severity: "info",
          category: "Meta Descriptions",
          page: route,
          message: `Description is short (${desc.length} chars).`,
          suggestion: "Meta descriptions between 120-160 characters perform best in search results.",
        });
      } else if (desc.length > 160) {
        issues.push({
          severity: "warning",
          category: "Meta Descriptions",
          page: route,
          message: `Description is too long (${desc.length} chars).`,
          suggestion: "Meta descriptions over 160 characters get truncated. Keep between 120-160 chars.",
        });
      } else {
        passed++;
      }

      const existing = descMap.get(desc) || [];
      existing.push(route);
      descMap.set(desc, existing);
    } else if (hasGenerateMetadata) {
      // Dynamic - assume OK
      passed++;
    } else {
      passed++;
    }
  }

  // Duplicate descriptions
  for (const [desc, routes] of descMap) {
    if (routes.length > 1) {
      issues.push({
        severity: "critical",
        category: "Meta Descriptions",
        page: routes.join(", "),
        message: `Duplicate meta description found on ${routes.length} pages.`,
        suggestion: "Each page needs a unique description. Customize per product/category/city.",
      });
    }
  }

  return { issues, passed };
}

// 3. H1 Tag checks
function checkH1Tags(pages: PageInfo[]): { issues: SEOIssue[]; passed: number } {
  const issues: SEOIssue[] = [];
  let passed = 0;

  for (const page of pages) {
    const { content, route } = page;

    // Count <h1 or variants in JSX
    const h1Matches = content.match(/<h1[\s>]/g);
    const h1Count = h1Matches ? h1Matches.length : 0;

    if (h1Count === 0) {
      issues.push({
        severity: "critical",
        category: "H1 Tags",
        page: route,
        message: "Page has no H1 tag.",
        suggestion: "Every page should have exactly one H1 tag containing the primary keyword.",
      });
    } else if (h1Count > 1) {
      issues.push({
        severity: "warning",
        category: "H1 Tags",
        page: route,
        message: `Page has ${h1Count} H1 tags (should be exactly 1).`,
        suggestion: "Use a single H1 for the main heading. Use H2-H6 for subheadings.",
      });
    } else {
      passed++;
    }
  }

  return { issues, passed };
}

// 4. Internal linking / orphan pages
function checkInternalLinks(pages: PageInfo[]): { issues: SEOIssue[]; passed: number } {
  const issues: SEOIssue[] = [];
  let passed = 0;

  // Collect all Link hrefs from all TSX files
  const allTsxFiles = findAllTsxFiles();
  const linkedRoutes = new Set<string>();

  for (const f of allTsxFiles) {
    const content = readFile(f);
    // Match Link href="/..." and <a href="/..."
    const linkMatches = content.matchAll(/href=["'`]\/([^"'`{]*?)["'`]/g);
    for (const m of linkMatches) {
      linkedRoutes.add("/" + m[1]);
    }
    // Match template literal hrefs like href={`/compare/${...}`}
    const templateLinks = content.matchAll(/href=\{[`']\/([^`']*?)[`']\}/g);
    for (const m of templateLinks) {
      // Normalize dynamic segments
      const route = "/" + m[1].replace(/\$\{[^}]+\}/g, "[dynamic]");
      linkedRoutes.add(route);
    }
  }

  // Static routes from pages
  const staticRoutes = pages.map((p) => p.route);

  for (const route of staticRoutes) {
    // Skip admin and dynamic routes for orphan detection
    if (route.includes("[") || route === "/" || route === "/admin") {
      passed++;
      continue;
    }

    const isLinked = linkedRoutes.has(route) ||
      [...linkedRoutes].some((lr) => lr.startsWith(route) || route.startsWith(lr));

    if (!isLinked) {
      issues.push({
        severity: "warning",
        category: "Internal Linking",
        page: route,
        message: "Orphan page — no internal links pointing to it.",
        suggestion: "Add internal links from related pages (e.g., navigation, footer, or contextual links).",
      });
    } else {
      passed++;
    }
  }

  return { issues, passed };
}

// 5. Sitemap check
function checkSitemap(): { issues: SEOIssue[]; passed: number } {
  const issues: SEOIssue[] = [];
  let passed = 0;

  const sitemapPath = path.join(APP, "sitemap.ts");
  const sitemapXml = path.join(ROOT, "public", "sitemap.xml");

  if (fs.existsSync(sitemapPath)) {
    passed++;
  } else if (fs.existsSync(sitemapXml)) {
    passed++;
  } else {
    issues.push({
      severity: "critical",
      category: "Sitemap",
      page: "/sitemap.xml",
      message: "No sitemap.ts found in src/app/.",
      suggestion:
        "Create src/app/sitemap.ts to auto-generate a sitemap. Next.js supports this natively via the App Router.",
    });
  }

  return { issues, passed };
}

// 6. Robots.txt check
function checkRobots(): { issues: SEOIssue[]; passed: number } {
  const issues: SEOIssue[] = [];
  let passed = 0;

  const robotsTs = path.join(APP, "robots.ts");
  const robotsTxt = path.join(ROOT, "public", "robots.txt");

  if (fs.existsSync(robotsTs)) {
    passed++;
  } else if (fs.existsSync(robotsTxt)) {
    passed++;
  } else {
    issues.push({
      severity: "critical",
      category: "Robots.txt",
      page: "/robots.txt",
      message: "No robots.ts or robots.txt found.",
      suggestion:
        "Create src/app/robots.ts to control crawler access. Include sitemap URL reference.",
    });
  }

  return { issues, passed };
}

// 7. Image alt tag checks
function checkImageAltTags(): { issues: SEOIssue[]; passed: number } {
  const issues: SEOIssue[] = [];
  let passed = 0;

  const tsxFiles = findAllTsxFiles();

  for (const f of tsxFiles) {
    const content = readFile(f);
    const relativePath = path.relative(SRC, f).replace(/\\/g, "/");

    // Match <img and <Image tags without alt or with empty alt
    // Pattern: <img ... > or <Image ... > without alt prop
    const imgTags = content.matchAll(/<(?:img|Image)\s[^>]*?(?:\/>|>)/gs);

    for (const match of imgTags) {
      const tag = match[0];
      const hasAlt = /\balt=/.test(tag);
      const emptyAlt = /\balt=["']\s*["']/.test(tag);

      if (!hasAlt) {
        issues.push({
          severity: "warning",
          category: "Image Alt Tags",
          page: relativePath,
          message: "Image found without alt attribute.",
          suggestion: "Add descriptive alt text to all images for accessibility and SEO.",
        });
      } else if (emptyAlt) {
        issues.push({
          severity: "info",
          category: "Image Alt Tags",
          page: relativePath,
          message: "Image has empty alt attribute.",
          suggestion:
            "Empty alt is valid for decorative images, but informative images need descriptive alt text.",
        });
      } else {
        passed++;
      }
    }
  }

  // If no images found, that's a pass
  if (issues.length === 0 && passed === 0) passed = 1;

  return { issues, passed };
}

// 8. Canonical URL checks
function checkCanonicals(pages: PageInfo[]): { issues: SEOIssue[]; passed: number } {
  const issues: SEOIssue[] = [];
  let passed = 0;

  // Check root layout for global canonical handling
  const layoutContent = readFile(path.join(APP, "layout.tsx"));
  const hasMetadataBase = /metadataBase/.test(layoutContent);
  const hasAlternates = /alternates/.test(layoutContent);

  if (!hasMetadataBase) {
    issues.push({
      severity: "warning",
      category: "Canonical URLs",
      page: "/layout.tsx",
      message: "No metadataBase set in root layout.",
      suggestion:
        "Add `metadataBase: new URL('https://zurahq.com')` to the root layout metadata for proper canonical URL resolution.",
    });
  } else {
    passed++;
  }

  // Check for explicit canonical in pages with dynamic routes
  const dynamicPages = pages.filter((p) => p.route.includes("["));
  for (const page of dynamicPages) {
    const hasCanonical =
      /alternates/.test(page.content) || /canonical/.test(page.content);
    if (!hasCanonical && !hasMetadataBase) {
      issues.push({
        severity: "info",
        category: "Canonical URLs",
        page: page.route,
        message: "Dynamic page without explicit canonical URL handling.",
        suggestion:
          "Consider adding `alternates: { canonical: '...' }` in generateMetadata for dynamic routes.",
      });
    } else {
      passed++;
    }
  }

  return { issues, passed };
}

// 9. Structured Data (JSON-LD)
function checkStructuredData(pages: PageInfo[]): { issues: SEOIssue[]; passed: number } {
  const issues: SEOIssue[] = [];
  let passed = 0;

  // Key pages that should have structured data
  const keyPages = ["/", "/about", "/contact", "/insurers"];

  for (const page of pages) {
    const isKey = keyPages.includes(page.route) ||
      page.route.startsWith("/product/") ||
      page.route.startsWith("/vs/") ||
      page.route.startsWith("/compare/") ||
      page.route.startsWith("/learn/");

    if (!isKey) continue;

    const hasJsonLd =
      /application\/ld\+json/.test(page.content) ||
      /jsonLd/.test(page.content) ||
      /JSON-LD/.test(page.content) ||
      /structuredData/.test(page.content) ||
      /script.*type.*application/.test(page.content);

    if (!hasJsonLd) {
      const severity = page.route === "/" || page.route.startsWith("/product/") ? "warning" : "info";
      issues.push({
        severity,
        category: "Structured Data",
        page: page.route,
        message: "No JSON-LD structured data found.",
        suggestion:
          "Add schema.org structured data (Product, Article, Organization, BreadcrumbList) for rich search results.",
      });
    } else {
      passed++;
    }
  }

  return { issues, passed };
}

// 10. URL Structure checks
function checkURLStructure(pages: PageInfo[]): { issues: SEOIssue[]; passed: number } {
  const issues: SEOIssue[] = [];
  let passed = 0;

  for (const page of pages) {
    const route = page.route;
    if (route.includes("[")) {
      passed++;
      continue; // dynamic segments are fine
    }

    // Check length
    if (route.length > 75) {
      issues.push({
        severity: "warning",
        category: "URL Structure",
        page: route,
        message: `URL is too long (${route.length} chars).`,
        suggestion: "Keep URLs under 75 characters. Use concise, keyword-rich slugs.",
      });
    } else {
      passed++;
    }

    // Check for special characters
    if (/[A-Z]/.test(route)) {
      issues.push({
        severity: "info",
        category: "URL Structure",
        page: route,
        message: "URL contains uppercase characters.",
        suggestion: "Use lowercase URLs for consistency. Uppercase can cause duplicate content issues.",
      });
    }

    // Check for underscores
    if (/_/.test(route.replace(/\[.*?\]/g, ""))) {
      issues.push({
        severity: "info",
        category: "URL Structure",
        page: route,
        message: "URL contains underscores.",
        suggestion: "Use hyphens instead of underscores in URLs. Google treats hyphens as word separators.",
      });
    }
  }

  return { issues, passed };
}

// 11. Content length checks
function checkContentLength(pages: PageInfo[]): { issues: SEOIssue[]; passed: number } {
  const issues: SEOIssue[] = [];
  let passed = 0;

  for (const page of pages) {
    const { content, route } = page;

    // Strip JSX tags and imports to estimate content length
    const textContent = content
      .replace(/import\s.*?from\s.*?;/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\{[^}]*\}/g, " ")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/.*/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Estimate word count from string literals
    const stringLiterals = content.match(/["'`][^"'`]{20,}["'`]/g) || [];
    const totalTextLength = stringLiterals.join(" ").length;

    // Pages that are purely functional (admin, waitlist) can be thin
    if (route === "/admin" || route === "/waitlist") {
      passed++;
      continue;
    }

    // Very thin content
    if (totalTextLength < 200 && !route.includes("[")) {
      issues.push({
        severity: "info",
        category: "Content Length",
        page: route,
        message: "Page appears to have thin content.",
        suggestion:
          "Consider adding more descriptive text, FAQs, or educational content. Search engines prefer substantial content (300+ words).",
      });
    } else {
      passed++;
    }
  }

  return { issues, passed };
}

// 12. Keyword density for category pages
function checkKeywordDensity(pages: PageInfo[]): { issues: SEOIssue[]; passed: number } {
  const issues: SEOIssue[] = [];
  let passed = 0;

  const categoryKeywords: Record<string, string[]> = {
    health: ["health insurance", "health plan", "medical insurance", "health cover"],
    "term-life": ["term insurance", "term life", "life insurance", "life cover"],
    motor: ["motor insurance", "car insurance", "vehicle insurance", "motor cover"],
    travel: ["travel insurance", "travel plan", "trip insurance", "travel cover"],
  };

  for (const page of pages) {
    const route = page.route;

    // Check category comparison pages
    const categoryMatch = route.match(/^\/compare\/([a-z-]+)$/);
    if (categoryMatch) {
      const cat = categoryMatch[1];
      const keywords = categoryKeywords[cat];
      if (keywords) {
        const lowerContent = page.content.toLowerCase();
        const found = keywords.some((kw) => lowerContent.includes(kw));
        if (!found) {
          issues.push({
            severity: "warning",
            category: "Keyword Density",
            page: route,
            message: `Category page doesn't mention primary keywords (${keywords.slice(0, 2).join(", ")}).`,
            suggestion:
              "Include the primary category keyword naturally in headings and body text.",
          });
        } else {
          passed++;
        }
      }
    }
  }

  // If no category pages found, still count as pass
  if (issues.length === 0 && passed === 0) passed = 1;

  return { issues, passed };
}

// 13. Mobile-first (viewport meta)
function checkMobileFirst(): { issues: SEOIssue[]; passed: number } {
  const issues: SEOIssue[] = [];
  let passed = 0;

  // Check layout.tsx for viewport
  const layoutPath = path.join(APP, "layout.tsx");
  const layoutContent = readFile(layoutPath);

  const hasViewport =
    /viewport/.test(layoutContent) ||
    /Viewport/.test(layoutContent);

  // Next.js App Router automatically adds viewport meta, but check for explicit config
  // Also check if there's a viewport export
  const hasViewportExport = /export\s+(const|function)\s+viewport/.test(layoutContent);

  if (hasViewport || hasViewportExport) {
    passed++;
  } else {
    // Next.js adds viewport by default in App Router, so this is just informational
    issues.push({
      severity: "info",
      category: "Mobile First",
      page: "/layout.tsx",
      message: "No explicit viewport configuration found.",
      suggestion:
        "Next.js App Router adds default viewport meta. Consider adding `export const viewport` for custom control.",
    });
    passed++; // Still a pass since Next.js handles it
  }

  return { issues, passed };
}

// 14. Loading performance checks
function checkPerformance(): { issues: SEOIssue[]; passed: number } {
  const issues: SEOIssue[] = [];
  let passed = 0;

  const tsxFiles = findAllTsxFiles();

  for (const f of tsxFiles) {
    const content = readFile(f);
    const relativePath = path.relative(SRC, f).replace(/\\/g, "/");

    // Check for large image files referenced directly
    const imgSrcMatches = content.matchAll(/src=["']([^"']+\.(png|jpg|jpeg|gif|bmp|svg))["']/gi);
    for (const match of imgSrcMatches) {
      const imgPath = match[1];
      // If it's a local path, check file size
      if (!imgPath.startsWith("http") && !imgPath.startsWith("//")) {
        const fullPath = path.join(ROOT, "public", imgPath);
        if (fs.existsSync(fullPath)) {
          const stats = fs.statSync(fullPath);
          const sizeKB = stats.size / 1024;
          if (sizeKB > 200) {
            issues.push({
              severity: "warning",
              category: "Performance",
              page: relativePath,
              message: `Large image: ${imgPath} (${Math.round(sizeKB)}KB).`,
              suggestion:
                "Optimize images to under 200KB. Use Next.js Image component with WebP format for automatic optimization.",
            });
          } else {
            passed++;
          }
        }
      }
    }

    // Check for non-dynamic imports of heavy libraries
    const heavyImports = content.matchAll(
      /import\s+.*?\s+from\s+["'](chart\.js|recharts|d3|moment|lodash)["']/g
    );
    for (const match of heavyImports) {
      issues.push({
        severity: "info",
        category: "Performance",
        page: relativePath,
        message: `Heavy library import: ${match[1]}.`,
        suggestion:
          "Use dynamic imports (`next/dynamic`) for heavy libraries to reduce initial bundle size.",
      });
    }

    // Check for next/image usage vs raw img
    const rawImgCount = (content.match(/<img\s/g) || []).length;
    const nextImageCount = (content.match(/<Image\s/g) || []).length;
    const importsNextImage = /from\s+["']next\/image["']/.test(content);

    if (rawImgCount > 0 && !importsNextImage) {
      issues.push({
        severity: "info",
        category: "Performance",
        page: relativePath,
        message: `Using raw <img> tags (${rawImgCount}) instead of Next.js Image component.`,
        suggestion:
          "Use `next/image` for automatic image optimization, lazy loading, and responsive sizing.",
      });
    } else if (rawImgCount === 0 && nextImageCount === 0) {
      passed++;
    } else {
      passed++;
    }
  }

  if (issues.length === 0 && passed === 0) passed = 1;

  return { issues, passed };
}

// ── Score Calculation ──────────────────────────────────────────────────────

function calculateScore(issues: SEOIssue[], totalPassed: number): number {
  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const warningCount = issues.filter((i) => i.severity === "warning").length;
  const infoCount = issues.filter((i) => i.severity === "info").length;

  const totalChecks = totalPassed + criticalCount + warningCount + infoCount;
  if (totalChecks === 0) return 100;

  // Weighted penalties
  const penalty =
    criticalCount * 10 + warningCount * 3 + infoCount * 1;

  const maxPenalty = totalChecks * 10;
  const score = Math.max(0, Math.round(100 - (penalty / maxPenalty) * 100));
  return Math.min(100, score);
}

// ── Main ───────────────────────────────────────────────────────────────────

export async function runAudit(): Promise<SEOAuditResult> {
  console.log("\n========================================");
  console.log("  ZURA SEO AUDIT");
  console.log("========================================\n");

  const pages = findPageFiles();
  console.log(`Found ${pages.length} page files in src/app/\n`);

  const allIssues: SEOIssue[] = [];
  let totalPassed = 0;

  const checks = [
    { name: "Title Tags", fn: () => checkTitles(pages) },
    { name: "Meta Descriptions", fn: () => checkMetaDescriptions(pages) },
    { name: "H1 Tags", fn: () => checkH1Tags(pages) },
    { name: "Internal Linking", fn: () => checkInternalLinks(pages) },
    { name: "Sitemap", fn: () => checkSitemap() },
    { name: "Robots.txt", fn: () => checkRobots() },
    { name: "Image Alt Tags", fn: () => checkImageAltTags() },
    { name: "Canonical URLs", fn: () => checkCanonicals(pages) },
    { name: "Structured Data", fn: () => checkStructuredData(pages) },
    { name: "URL Structure", fn: () => checkURLStructure(pages) },
    { name: "Content Length", fn: () => checkContentLength(pages) },
    { name: "Keyword Density", fn: () => checkKeywordDensity(pages) },
    { name: "Mobile First", fn: () => checkMobileFirst() },
    { name: "Performance", fn: () => checkPerformance() },
  ];

  for (const check of checks) {
    process.stdout.write(`  Checking ${check.name}...`);
    const result = check.fn();
    allIssues.push(...result.issues);
    totalPassed += result.passed;

    const critCount = result.issues.filter((i) => i.severity === "critical").length;
    const warnCount = result.issues.filter((i) => i.severity === "warning").length;
    const infoCount = result.issues.filter((i) => i.severity === "info").length;

    if (critCount + warnCount + infoCount === 0) {
      console.log(" PASS");
    } else {
      const parts: string[] = [];
      if (critCount > 0) parts.push(`${critCount} critical`);
      if (warnCount > 0) parts.push(`${warnCount} warnings`);
      if (infoCount > 0) parts.push(`${infoCount} info`);
      console.log(` ${parts.join(", ")}`);
    }
  }

  const score = calculateScore(allIssues, totalPassed);

  const result: SEOAuditResult = {
    runAt: new Date().toISOString(),
    totalPages: pages.length,
    issues: allIssues,
    score,
    summary: {
      critical: allIssues.filter((i) => i.severity === "critical").length,
      warning: allIssues.filter((i) => i.severity === "warning").length,
      info: allIssues.filter((i) => i.severity === "info").length,
      passed: totalPassed,
    },
  };

  // Print report
  console.log("\n========================================");
  console.log("  RESULTS");
  console.log("========================================\n");

  console.log(`  SEO Score: ${score}/100\n`);
  console.log(`  Total Pages Scanned: ${pages.length}`);
  console.log(`  Checks Passed: ${result.summary.passed}`);
  console.log(`  Critical Issues: ${result.summary.critical}`);
  console.log(`  Warnings: ${result.summary.warning}`);
  console.log(`  Info: ${result.summary.info}`);

  if (allIssues.length > 0) {
    console.log("\n----------------------------------------");
    console.log("  ISSUES BY SEVERITY");
    console.log("----------------------------------------\n");

    const criticals = allIssues.filter((i) => i.severity === "critical");
    const warnings = allIssues.filter((i) => i.severity === "warning");
    const infos = allIssues.filter((i) => i.severity === "info");

    if (criticals.length > 0) {
      console.log("  [CRITICAL]");
      for (const issue of criticals) {
        console.log(`    Page: ${issue.page}`);
        console.log(`    ${issue.message}`);
        console.log(`    Fix: ${issue.suggestion}\n`);
      }
    }

    if (warnings.length > 0) {
      console.log("  [WARNING]");
      for (const issue of warnings) {
        console.log(`    Page: ${issue.page}`);
        console.log(`    ${issue.message}`);
        console.log(`    Fix: ${issue.suggestion}\n`);
      }
    }

    if (infos.length > 0) {
      console.log("  [INFO]");
      for (const issue of infos) {
        console.log(`    Page: ${issue.page}`);
        console.log(`    ${issue.message}`);
        console.log(`    Tip: ${issue.suggestion}\n`);
      }
    }
  }

  // Save JSON report
  ensureDir(REPORTS_DIR);
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const reportPath = path.join(REPORTS_DIR, `seo-audit-${timestamp}.json`);
  fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
  console.log(`\n  Report saved to: ${path.relative(ROOT, reportPath)}`);
  console.log("========================================\n");

  return result;
}

// CLI entry
if (require.main === module) {
  runAudit().catch((err) => {
    console.error("Audit failed:", err);
    process.exit(1);
  });
}
