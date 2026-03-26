/**
 * Server-safe search index builder.
 * No "use client" — can be called from server components.
 */

export interface SearchItemData {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  type: "product" | "insurer" | "article" | "country" | "category";
  categorySlug?: string;
  meta?: string;
}

export function buildSearchIndex(
  products: { id: string; productName: string; insurerName: string; category: string; countryCode?: string }[],
  insurers: { slug: string; shortName: string; name: string }[],
  articles: { slug: string; title: string; category: string; excerpt: string }[],
): SearchItemData[] {
  const items: SearchItemData[] = [];

  // Products (limit to 200 for bundle size)
  for (const p of products.slice(0, 200)) {
    items.push({
      id: `p-${p.id}`,
      title: p.productName,
      subtitle: `${p.insurerName} · ${p.category.replace("-", " ")}`,
      href: `/product/${p.id}`,
      type: "product",
      categorySlug: p.category,
    });
  }

  // Insurers
  for (const ins of insurers.slice(0, 50)) {
    items.push({
      id: `i-${ins.slug}`,
      title: ins.shortName,
      subtitle: ins.name,
      href: `/insurer/${ins.slug}`,
      type: "insurer",
    });
  }

  // Articles
  for (const a of articles.slice(0, 100)) {
    items.push({
      id: `a-${a.slug}`,
      title: a.title,
      subtitle: a.category,
      href: `/learn/${a.slug}`,
      type: "article",
    });
  }

  // Countries
  const countryList = [
    { code: "in", name: "India", flag: "🇮🇳" },
    { code: "us", name: "United States", flag: "🇺🇸" },
    { code: "uk", name: "United Kingdom", flag: "🇬🇧" },
    { code: "ae", name: "UAE", flag: "🇦🇪" },
    { code: "sg", name: "Singapore", flag: "🇸🇬" },
    { code: "ca", name: "Canada", flag: "🇨🇦" },
    { code: "au", name: "Australia", flag: "🇦🇺" },
    { code: "de", name: "Germany", flag: "🇩🇪" },
    { code: "sa", name: "Saudi Arabia", flag: "🇸🇦" },
    { code: "jp", name: "Japan", flag: "🇯🇵" },
    { code: "kr", name: "South Korea", flag: "🇰🇷" },
    { code: "hk", name: "Hong Kong", flag: "🇭🇰" },
  ];
  for (const c of countryList) {
    items.push({
      id: `c-${c.code}`,
      title: `${c.flag} ${c.name}`,
      subtitle: "Insurance market",
      href: `/${c.code}`,
      type: "country",
    });
  }

  // Categories
  const cats = [
    { name: "Health Insurance", href: "/compare/health", slug: "health" },
    { name: "Term Life Insurance", href: "/compare/term-life", slug: "term-life" },
    { name: "Motor Insurance", href: "/compare/motor", slug: "motor" },
    { name: "Travel Insurance", href: "/compare/travel", slug: "travel" },
  ];
  for (const c of cats) {
    items.push({
      id: `cat-${c.slug}`,
      title: c.name,
      subtitle: "Compare plans",
      href: c.href,
      type: "category",
      categorySlug: c.slug,
    });
  }

  return items;
}
