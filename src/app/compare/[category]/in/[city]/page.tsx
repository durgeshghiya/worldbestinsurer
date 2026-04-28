import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, AlertCircle, MapPin } from "lucide-react";
import { getProductsByCategory } from "@/lib/data";
import { getCityBySlug } from "@/lib/generators";
import { formatCompact} from "@/lib/utils";
import type { Category } from "@/lib/types";

const validCategories = ["health", "term-life", "motor", "travel"];
const categoryNames: Record<string, string> = {
  health: "Health Insurance",
  "term-life": "Term Life Insurance",
  motor: "Motor Insurance",
  travel: "Travel Insurance",
};

export const dynamicParams = true;

export async function generateStaticParams() {
  // Only pre-build tier-1 Indian cities. Rest rendered on-demand.
  const { getCities } = await import("@/lib/generators");
  const cats = ["health", "term-life", "motor", "travel"];
  const tier1 = getCities("in").filter((c) => c.tier === 1).slice(0, 8);
  return tier1.flatMap((city) => cats.map((cat) => ({ category: cat, city: city.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; city: string }>;
}): Promise<Metadata> {
  const { category, city: citySlug } = await params;
  const city = getCityBySlug(citySlug);
  const catName = categoryNames[category];
  if (!city || !catName) return {};
  // Tier-3 cities are too thin to deserve an indexable per-page entry —
  // the catalog data is identical except for the city name. Tell Google
  // not to index them so the indexable surface stays dense and editorial.
  // Tier-1 and tier-2 cities still index, since those have meaningful
  // search demand.
  const indexable = (city.tier ?? 3) <= 2;
  return {
    title: `${catName} in ${city.name} — Compare Plans`,
    description: `Compare ${catName.toLowerCase()} plans available in ${city.name}, ${city.state}. Side-by-side comparison of top insurers for ${city.name} residents.`,
    robots: indexable ? undefined : { index: false, follow: true },
  };
}

export default async function CityComparePage({
  params,
}: {
  params: Promise<{ category: string; city: string }>;
}) {
  const { category, city: citySlug } = await params;

  if (!validCategories.includes(category)) notFound();
  const city = getCityBySlug(citySlug);
  if (!city) notFound();

  const catName = categoryNames[category] ?? category;
  const products = getProductsByCategory(category as Category);

  return (
    <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-10">
      <Link
        href={`/compare/${category}`}
        className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> All {catName} plans
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="text-[12px] font-medium text-primary uppercase tracking-[0.06em]">
            {city.state}
          </span>
        </div>
        <h1 className="text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em]">
          {catName} in {city.name}
        </h1>
        <p className="text-[14px] text-text-secondary mt-2 max-w-2xl">
          Compare {products.length} {catName.toLowerCase()} plans available for {city.name} residents.
          All plans listed are available across India including {city.name}, {city.state}.
        </p>
      </div>

      {/* Disclaimer */}
      <div className="mb-6 p-3.5 bg-warning-light rounded-xl flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
        <p className="text-[11.5px] text-warning leading-relaxed">
          All plans listed are available pan-India. City-specific factors like local network hospitals and premium
          variations by zone may apply. Verify with insurers for {city.name}-specific details. Data is for educational purposes only.
        </p>
      </div>

      {/* Products grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {products.map((p) => (
          <Link
            key={p.id}
            href={`/product/${p.id}`}
            className="group bg-surface rounded-xl border border-border hover:border-primary/15 hover:shadow-md transition-all p-5"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.06em] mb-0.5">
                  {p.insurerName.split(" ").slice(0, 2).join(" ")}
                </p>
                <h3 className="text-[14px] font-semibold text-text-primary group-hover:text-primary transition-colors leading-snug">
                  {p.productName}
                </h3>
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-[12px]">
              <div>
                <span className="text-text-tertiary">Cover:</span>{" "}
                <span className="font-medium text-text-primary">{formatCompact(p.sumInsured.min)}–{formatCompact(p.sumInsured.max)}</span>
              </div>
              <div>
                <span className="text-text-tertiary">From:</span>{" "}
                <span className="font-medium text-text-primary">{formatCompact(p.premiumRange.illustrativeMin)}/yr*</span>
              </div>
            </div>
            <ul className="mt-3 space-y-1">
              {p.specialFeatures.slice(0, 2).map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-[11.5px] text-text-secondary">
                  <Check className="w-3 h-3 text-success mt-0.5 shrink-0" />{f}
                </li>
              ))}
            </ul>
          </Link>
        ))}
      </div>

      {/* City info section */}
      <div className="bg-surface-sunken rounded-2xl p-6 mb-8">
        <h2 className="text-[16px] font-semibold text-text-primary mb-3">
          {catName} for {city.name} Residents
        </h2>
        <p className="text-[13px] text-text-secondary leading-relaxed">
          {city.name} is a {city.tier === 1 ? "metro city" : city.tier === 2 ? "major city" : "growing city"} in {city.state}.
          All {products.length} {catName.toLowerCase()} plans listed on World Best Insurer are available for {city.name} residents.
          {category === "health" && ` When choosing health insurance in ${city.name}, consider factors like the insurer's network hospital coverage in ${city.state}, cashless facility availability at major hospitals in ${city.name}, and premium zone applicable to your city.`}
          {category === "motor" && ` Motor insurance premiums in ${city.name} depend on your vehicle's registration (RTO zone), traffic conditions, and theft risk in the area. Compare comprehensive and third-party options for vehicles registered in ${city.name}.`}
          {category === "term-life" && ` Term insurance premiums are generally uniform across India and do not vary by city. ${city.name} residents should focus on comparing claim settlement ratios, rider options, and sum insured adequacy.`}
          {category === "travel" && ` ${city.name} residents planning international or domestic travel can compare travel insurance plans covering medical emergencies, trip cancellation, and baggage loss.`}
        </p>
      </div>

      {/* Other categories */}
      <div className="mb-8">
        <h3 className="text-[14px] font-semibold text-text-primary mb-3">Other insurance categories in {city.name}</h3>
        <div className="flex flex-wrap gap-2">
          {validCategories.filter((c) => c !== category).map((c) => (
            <Link
              key={c}
              href={`/compare/${c}/in/${citySlug}`}
              className="px-4 py-2 text-[12.5px] font-medium border border-border rounded-lg hover:border-primary/20 hover:text-primary transition-colors"
            >
              {categoryNames[c]} in {city.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="text-[11px] text-text-tertiary text-center">
        *Premiums are illustrative. World Best Insurer does not sell insurance.{" "}
        <Link href="/disclaimer" className="underline">Disclaimer</Link>
      </div>
    </div>
  );
}
