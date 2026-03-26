import { getAllProducts, getAllInsurers } from "@/lib/data";
import { getArticles } from "@/lib/generators";
import { VALID_COUNTRY_CODES } from "@/lib/countries";
import { buildSearchIndex } from "@/lib/search-index";
import SearchModal from "./SearchModal";

export default function GlobalSearch() {
  const allProducts: { id: string; productName: string; insurerName: string; category: string; countryCode?: string }[] = [];
  for (const cc of VALID_COUNTRY_CODES) {
    try {
      const products = getAllProducts(cc);
      allProducts.push(...products.map((p) => ({
        id: p.id,
        productName: p.productName,
        insurerName: p.insurerName,
        category: p.category,
        countryCode: p.countryCode,
      })));
    } catch { /* skip */ }
  }

  const allInsurers: { slug: string; shortName: string; name: string }[] = [];
  for (const cc of VALID_COUNTRY_CODES) {
    try {
      const insurers = getAllInsurers(cc);
      for (const ins of insurers) {
        if (!allInsurers.find((i) => i.slug === ins.slug)) {
          allInsurers.push({ slug: ins.slug, shortName: ins.shortName, name: ins.name });
        }
      }
    } catch { /* skip */ }
  }

  const articles = getArticles().map((a) => ({
    slug: a.slug, title: a.title, category: a.category, excerpt: a.excerpt,
  }));

  const items = buildSearchIndex(allProducts, allInsurers, articles);

  return <SearchModal items={items} />;
}
