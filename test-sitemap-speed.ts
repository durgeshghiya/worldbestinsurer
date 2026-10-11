import { getIndianCities } from "./src/lib/cities";
import { getAllInsurers } from "./src/lib/data";

const start = Date.now();
const cities = getIndianCities();
const insurers = getAllInsurers("in");

const allEntries: string[] = [];
for (const ins of insurers) {
  for (const c of cities) {
    allEntries.push(`https://worldbestinsurer.com/in/insurer/${ins.slug}/hospitals/${c.slug}/`);
  }
}
console.log(`Generated ${allEntries.length} entries in ${Date.now() - start}ms`);
