import { getAllProducts } from "./src/lib/data";

const products = getAllProducts("in");
const counts: Record<string, number> = {};
for (const p of products) {
  counts[p.category] = (counts[p.category] || 0) + 1;
}
console.log(counts);
