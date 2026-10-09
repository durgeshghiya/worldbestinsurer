import { urlsetXml, xmlResponse, SITE } from "@/lib/sitemap";
import { getIndianCities } from "@/lib/cities";
import { getInsurerBySlug } from "@/lib/data";

// We can pre-render these sitemaps statically
export const dynamicParams = true;

export async function generateStaticParams() {
  const { getAllInsurers } = await import("@/lib/data");
  const insurers = getAllInsurers("in");
  return insurers.map(ins => ({ insurer: ins.slug }));
}

export async function GET(request: Request, context: any) {
  const params = await context.params;
  const insurer = params?.insurer;
  
  const insurerData = getInsurerBySlug(insurer, "in");
  if (!insurerData) return new Response("Not found", { status: 404 });
  
  const cities = getIndianCities();
  const entries = cities.map(city => ({
    url: `${SITE}/in/insurer/${insurer}/hospitals/${city.slug}/`
  }));
  
  return xmlResponse(urlsetXml(entries));
}
