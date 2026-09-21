import { notFound, permanentRedirect } from "next/navigation";
import { getAllProducts, getProductById } from "@/lib/data";

/**
 * Legacy product URL, kept only to redirect.
 *
 * Every product also lives at /{country}/product/{id}/, which this page used to
 * name as its canonical while still serving a full duplicate. Google indexed
 * both forms and split their signals — /product/desjardins-auto-ca/ collected
 * impressions of its own. A permanent redirect consolidates the pair instead of
 * asking Google to pick, and keeps the old URL working for anyone who has it.
 */
export async function generateStaticParams() {
  return getAllProducts().map((p) => ({ id: p.id }));
}

export default async function LegacyProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();
  permanentRedirect(`/${product.countryCode}/product/${product.id}/`);
}
