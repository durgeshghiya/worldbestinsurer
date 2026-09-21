import { permanentRedirect } from "next/navigation";

/**
 * Legacy (country-less) city comparison pages — see the note in
 * src/app/[country]/compare/[category]/in/[city]/page.tsx. 2,314 India cities
 * × 4 categories, redirected to the category hub.
 */
export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export default async function LegacyCityPage({
  params,
}: {
  params: Promise<{ category: string; city: string }>;
}) {
  const { category } = await params;
  permanentRedirect(`/compare/${category}/`);
}
