import { sitemapGroup, urlsetXml, xmlResponse } from "@/lib/sitemap";

export const dynamic = "force-static";

export function GET() {
  return xmlResponse(urlsetXml(sitemapGroup("categories")));
}
