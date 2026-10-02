import { buildHreflang } from "./src/lib/seo";

const h = buildHreflang((code) => `/${code}/compare/health/`, "/compare/health/");
console.log(h);
