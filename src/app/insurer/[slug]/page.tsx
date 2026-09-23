import { notFound, permanentRedirect } from "next/navigation";
import { getAllInsurers, getInsurerBySlug } from "@/lib/data";

/**
 * Legacy insurer URL, kept only to redirect — see the note in
 * src/app/product/[id]/page.tsx. The country page is the canonical one.
 */
export async function generateStaticParams() {
  return getAllInsurers().map((i) => ({ slug: i.slug }));
}

export const dynamicParams = true;

export default async function LegacyInsurerPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const insurer = getInsurerBySlug(slug);
  if (!insurer) {
    permanentRedirect("/insurers/");
  }
  permanentRedirect(`/${insurer.countryCode}/insurer/${insurer.slug}/`);
}
