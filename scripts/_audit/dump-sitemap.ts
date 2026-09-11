import sitemap from "@/app/sitemap";
const entries = sitemap();
console.log(JSON.stringify(entries.map((e) => e.url), null, 0));
