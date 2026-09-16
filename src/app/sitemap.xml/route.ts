import { sitemapIndexXml, xmlResponse } from "@/lib/sitemap";

// /sitemap.xml is now an index over per-type sitemaps. Same URL as before,
// so the Search Console submission needs no change.
export const dynamic = "force-static";

export function GET() {
  return xmlResponse(sitemapIndexXml());
}
