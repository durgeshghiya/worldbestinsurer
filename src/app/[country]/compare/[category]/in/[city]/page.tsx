import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, AlertCircle, MapPin } from "lucide-react";
import { getProductsByCategory } from "@/lib/data";
import { generateCityParams, getCityBySlug } from "@/lib/generators";
import { getCountryByCode } from "@/lib/countries";
import { formatCompact } from "@/lib/utils";
import type { Category } from "@/lib/types";

const categoryNames: Record<string, string> = {
  health: "Health Insurance", "term-life": "Term Life Insurance",
  motor: "Motor Insurance", travel: "Travel Insurance",
};

export const dynamicParams = true;

export async function generateStaticParams() {
  // Only pre-build tier-1 cities to stay within Vercel limits. Rest rendered on-demand.
  const { getCities } = await import("@/lib/generators");
  const { VALID_COUNTRY_CODES } = await import("@/lib/countries");
  const cats = ["health", "term-life", "motor", "travel"];
  const params: { country: string; category: string; city: string }[] = [];
  for (const cc of VALID_COUNTRY_CODES) {
    const cities = getCities(cc).filter((c) => c.tier === 1).slice(0, 8);
    for (const cat of cats) {
      for (const city of cities) {
        params.push({ country: cc, category: cat, city: city.slug });
      }
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; category: string; city: string }> }): Promise<Metadata> {
  const { country, category, city: citySlug } = await params;
  const city = getCityBySlug(citySlug, country);
  const c = getCountryByCode(country);
  const catName = categoryNames[category];
  if (!city || !c || !catName) return {};
  return {
    title: `${catName} in ${city.name}, ${c.name} — Compare Plans`,
    description: `Compare ${catName.toLowerCase()} plans in ${city.name}, ${city.state}. ${c.name} insurance comparison.`,
  };
}

export default async function CountryCityPage({ params }: { params: Promise<{ country: string; category: string; city: string }> }) {
  const { country, category, city: citySlug } = await params;
  if (!categoryNames[category]) notFound();
  const city = getCityBySlug(citySlug, country);
  const c = getCountryByCode(country);
  if (!city || !c) notFound();

  const catName = categoryNames[category];
  const products = getProductsByCategory(category as Category, country);

  return (
    <div className="mx-auto max-w-[1280px] px-5 lg:px-8 py-10">
      <Link href={`/${country}/compare/${category}`} className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> {c.flag} All {catName} in {c.name}
      </Link>

      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-primary" />
          <span className="text-[12px] font-medium text-primary uppercase tracking-[0.06em]">{city.state}, {c.name}</span>
        </div>
        <h1 className="text-[28px] sm:text-[36px] font-bold text-text-primary tracking-[-0.02em]">
          {catName} in {city.name}
        </h1>
        <p className="text-[14px] text-text-secondary mt-2 max-w-2xl">
          Compare {products.length} {catName.toLowerCase()} plans available for {city.name} residents.
        </p>
      </div>

      <div className="mb-6 p-3.5 bg-warning-light rounded-xl flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
        <p className="text-[11.5px] text-warning leading-relaxed">
          Data for educational purposes only. Verify availability and details with insurers for {city.name}.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {products.map((p) => (
          <Link key={p.id} href={`/${country}/product/${p.id}`}
            className="group bg-surface rounded-xl border border-border hover:border-primary/15 hover:shadow-md transition-all p-5">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-[11px] font-semibold text-primary uppercase tracking-[0.06em] mb-0.5">{p.insurerName.split(" ").slice(0, 2).join(" ")}</p>
                <h3 className="text-[14px] font-semibold text-text-primary group-hover:text-primary transition-colors leading-snug">{p.productName}</h3>
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-all" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-[12px]">
              <div><span className="text-text-tertiary">Cover:</span> <span className="font-medium text-text-primary">{formatCompact(p.sumInsured.min, country)}–{formatCompact(p.sumInsured.max, country)}</span></div>
              <div><span className="text-text-tertiary">From:</span> <span className="font-medium text-text-primary">{formatCompact(p.premiumRange.illustrativeMin, country)}/yr*</span></div>
            </div>
            <ul className="mt-3 space-y-1">
              {p.specialFeatures.slice(0, 2).map((f) => (
                <li key={f} className="flex items-start gap-1.5 text-[11.5px] text-text-secondary"><Check className="w-3 h-3 text-success mt-0.5 shrink-0" />{f}</li>
              ))}
            </ul>
          </Link>
        ))}
      </div>

      <div className="bg-surface-sunken rounded-2xl p-6 mb-8">
        <h2 className="text-[16px] font-semibold text-text-primary mb-3">{catName} for {city.name} Residents</h2>
        <p className="text-[13px] text-text-secondary leading-relaxed">
          {city.name} is located in {city.state}, {c.name}. All {products.length} {catName.toLowerCase()} plans listed on World Best Insurer are compared for residents of {city.name}.
        </p>
      </div>

      <div className="mb-8">
        <h3 className="text-[14px] font-semibold text-text-primary mb-3">Other categories in {city.name}</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(categoryNames).filter((cat) => cat !== category).map((cat) => (
            <Link key={cat} href={`/${country}/compare/${cat}/in/${citySlug}`}
              className="px-4 py-2 text-[12.5px] font-medium border border-border rounded-lg hover:border-primary/20 hover:text-primary transition-colors">
              {categoryNames[cat]} in {city.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="text-[11px] text-text-tertiary text-center">
        *Premiums are illustrative. World Best Insurer does not sell insurance. <Link href="/disclaimer" className="underline">Disclaimer</Link>
      </div>
    </div>
  );
}
