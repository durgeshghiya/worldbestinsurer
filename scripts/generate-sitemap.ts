/**
 * Static sitemap generator for Hostinger deployment.
 * Generates sitemap index + child sitemaps in public/
 */
import * as fs from "fs";
import * as path from "path";

const DOMAIN = "https://worldbestinsurer.com";
const PUBLIC = path.resolve(__dirname, "../public");

function xmlEscape(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function urlEntry(loc: string, priority: string, changefreq: string) {
  return `  <url>\n    <loc>${xmlEscape(DOMAIN + loc)}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

function writeSitemap(name: string, entries: string[]) {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join("\n")}\n</urlset>`;
  fs.writeFileSync(path.join(PUBLIC, `sitemap-${name}.xml`), xml);
  console.log(`  sitemap-${name}.xml — ${entries.length} URLs`);
}

// Load data
const dataRoot = path.resolve(__dirname, "../src/data");
const countryCodes = ["in", "us", "uk", "ae", "sg", "ca", "au", "de", "sa", "jp", "kr", "hk"];

function loadJSON(file: string) {
  try { return JSON.parse(fs.readFileSync(file, "utf-8")); } catch { return null; }
}

function getProducts(cc: string) {
  const cats = ["health-insurance", "term-life-insurance", "motor-insurance", "travel-insurance"];
  const products: { id: string; category: string }[] = [];
  for (const cat of cats) {
    const d = loadJSON(path.join(dataRoot, cc, `${cat}.json`)) || loadJSON(path.join(dataRoot, `${cat}.json`));
    if (d?.products) {
      for (const p of d.products) products.push({ id: p.id, category: p.category });
    }
  }
  return products;
}

function getInsurers(cc: string) {
  const d = loadJSON(path.join(dataRoot, cc, "insurers.json")) || loadJSON(path.join(dataRoot, "insurers.json"));
  return d?.insurers?.map((i: { slug: string }) => i.slug) ?? [];
}

function getCities(cc: string) {
  const d = loadJSON(path.join(dataRoot, cc, "cities.json")) || (cc === "in" ? loadJSON(path.join(dataRoot, "indian-cities.json")) : null);
  return d?.cities?.map((c: { slug: string }) => c.slug) ?? [];
}

console.log("Generating sitemaps...\n");

// 1. Core pages
const coreEntries = [
  urlEntry("/", "1.0", "daily"),
  urlEntry("/compare/health/", "0.9", "weekly"),
  urlEntry("/compare/term-life/", "0.9", "weekly"),
  urlEntry("/compare/motor/", "0.9", "weekly"),
  urlEntry("/compare/travel/", "0.9", "weekly"),
  urlEntry("/insurers/", "0.7", "weekly"),
  urlEntry("/learn/", "0.7", "weekly"),
  urlEntry("/about/", "0.5", "monthly"),
  urlEntry("/contact/", "0.5", "monthly"),
  urlEntry("/disclaimer/", "0.4", "monthly"),
  urlEntry("/methodology/", "0.5", "monthly"),
  urlEntry("/waitlist/", "0.5", "monthly"),
  urlEntry("/insights/", "0.8", "weekly"),
];
// Country pages
for (const cc of countryCodes) {
  coreEntries.push(urlEntry(`/${cc}/`, "0.8", "weekly"));
  for (const cat of ["health", "term-life", "motor", "travel"]) {
    coreEntries.push(urlEntry(`/${cc}/compare/${cat}/`, "0.8", "weekly"));
  }
}
writeSitemap("core", coreEntries);

// 2. Product pages
const productEntries: string[] = [];
for (const cc of countryCodes) {
  const products = getProducts(cc);
  for (const p of products) {
    productEntries.push(urlEntry(`/${cc}/product/${p.id}/`, "0.7", "monthly"));
    productEntries.push(urlEntry(`/product/${p.id}/`, "0.7", "monthly"));
  }
}
writeSitemap("products", productEntries);

// 3. Insurer pages
const insurerEntries: string[] = [];
for (const cc of countryCodes) {
  const slugs = getInsurers(cc);
  for (const s of slugs) {
    insurerEntries.push(urlEntry(`/${cc}/insurer/${s}/`, "0.6", "monthly"));
    insurerEntries.push(urlEntry(`/insurer/${s}/`, "0.6", "monthly"));
  }
}
writeSitemap("insurers", insurerEntries);

// 4. City pages (split into chunks of 40K)
const cityEntries: string[] = [];
for (const cc of countryCodes) {
  const cities = getCities(cc);
  for (const cat of ["health", "term-life", "motor", "travel"]) {
    for (const city of cities) {
      cityEntries.push(urlEntry(`/${cc}/compare/${cat}/in/${city}/`, "0.4", "monthly"));
    }
  }
}
// Also legacy India city pages
const inCities = getCities("in");
for (const cat of ["health", "term-life", "motor", "travel"]) {
  for (const city of inCities) {
    cityEntries.push(urlEntry(`/compare/${cat}/in/${city}/`, "0.4", "monthly"));
  }
}
// Split into chunks
const CHUNK = 40000;
for (let i = 0; i < cityEntries.length; i += CHUNK) {
  const chunk = cityEntries.slice(i, i + CHUNK);
  writeSitemap(`cities-${Math.floor(i / CHUNK)}`, chunk);
}

// 5. VS pages
const vsEntries: string[] = [];
for (const cc of countryCodes) {
  const products = getProducts(cc);
  const byCategory = new Map<string, string[]>();
  for (const p of products) {
    const list = byCategory.get(p.category) ?? [];
    list.push(p.id);
    byCategory.set(p.category, list);
  }
  for (const [, ids] of byCategory) {
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        vsEntries.push(urlEntry(`/${cc}/vs/${ids[i]}-vs-${ids[j]}/`, "0.5", "monthly"));
        vsEntries.push(urlEntry(`/vs/${ids[i]}-vs-${ids[j]}/`, "0.5", "monthly"));
      }
    }
  }
}
for (let i = 0; i < vsEntries.length; i += CHUNK) {
  const chunk = vsEntries.slice(i, i + CHUNK);
  writeSitemap(`vs-${Math.floor(i / CHUNK)}`, chunk);
}

// 6. Learn pages
const learnEntries: string[] = [];
// Read article slugs from generators
const genFile = fs.readFileSync(path.resolve(__dirname, "../src/lib/generators.ts"), "utf-8");
const slugMatches = genFile.matchAll(/slug:\s*"([^"]+)"/g);
for (const m of slugMatches) {
  learnEntries.push(urlEntry(`/learn/${m[1]}/`, "0.7", "monthly"));
}
writeSitemap("learn", learnEntries);

// Generate sitemap index
const sitemapFiles = fs.readdirSync(PUBLIC).filter((f) => f.startsWith("sitemap-") && f.endsWith(".xml")).sort();
const indexXml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapFiles.map((f) => `  <sitemap>\n    <loc>${DOMAIN}/${f}</loc>\n  </sitemap>`).join("\n")}\n</sitemapindex>`;
fs.writeFileSync(path.join(PUBLIC, "sitemap.xml"), indexXml);

console.log(`\nSitemap index: sitemap.xml — ${sitemapFiles.length} child sitemaps`);
const total = productEntries.length + insurerEntries.length + cityEntries.length + vsEntries.length + learnEntries.length + coreEntries.length;
console.log(`Total URLs: ${total.toLocaleString()}`);
