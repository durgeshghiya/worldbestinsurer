import { permanentRedirect } from "next/navigation";

/**
 * City comparison pages, kept only to redirect.
 *
 * 3,041 cities × 4 categories = 12,164 URLs, each a template over the same
 * country-wide plan list with the city name substituted in. They were already
 * noindex and nothing on the site links to them, yet they still answer 200, so
 * Google keeps re-crawling a tree bigger than the rest of the site combined —
 * Search Console on 2026-09-21 reported 12,028 pages "crawled, currently not
 * indexed" and 12,590 excluded by noindex.
 *
 * Redirecting to the category hub the page was derived from ends the crawl
 * without deleting anything: the URLs keep working for anyone who holds one,
 * and any residual signal lands on the page that actually compares plans.
 * If city pages ever carry local content — state rules, local offices — this
 * file is where they come back.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export default async function LegacyCityComparePage({
  params,
}: {
  params: Promise<{ country: string; category: string; city: string }>;
}) {
  const { country, category } = await params;
  permanentRedirect(`/${country}/compare/${category}/`);
}
