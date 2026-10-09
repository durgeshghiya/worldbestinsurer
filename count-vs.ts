import { generateVSPairs } from "./src/lib/generators";
import { generateInsurerVSPairs } from "./src/lib/generators";
import { VALID_COUNTRY_CODES } from "./src/lib/countries";

let totalProductVs = 0;
let totalInsurerVs = 0;

for (const cc of VALID_COUNTRY_CODES) {
  totalProductVs += generateVSPairs(cc).length;
  totalInsurerVs += generateInsurerVSPairs(cc).length;
}

console.log(`Total Product VS Pairs: ${totalProductVs}`);
console.log(`Total Insurer VS Pairs: ${totalInsurerVs}`);
