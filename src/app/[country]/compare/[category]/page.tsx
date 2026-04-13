import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, Clock, Database, Heart, Shield, Car, Plane, ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ComparisonTable from "@/components/ComparisonTable";
import PremiumEstimator from "@/components/PremiumEstimator";
import { getProductsByCategory, getCategoryDisclaimer, getCategoryLastUpdated, getCategories } from "@/lib/data";
import { getCountryByCode, VALID_COUNTRY_CODES } from "@/lib/countries";
import type { Category } from "@/lib/types";

const validCategories = ["health", "term-life", "motor", "travel"];

const categoryMeta: Record<string, { icon: typeof Heart; gradient: string }> = {
  health: { icon: Heart, gradient: "from-rose-500 to-pink-600" },
  "term-life": { icon: Shield, gradient: "from-indigo-500 to-violet-600" },
  motor: { icon: Car, gradient: "from-emerald-500 to-teal-600" },
  travel: { icon: Plane, gradient: "from-amber-500 to-orange-600" },
};

export async function generateStaticParams() {
  const params: { country: string; category: string }[] = [];
  for (const cc of VALID_COUNTRY_CODES) {
    for (const cat of validCategories) {
      params.push({ country: cc, category: cat });
    }
  }
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ country: string; category: string }> }): Promise<Metadata> {
  const { country, category } = await params;
  const c = getCountryByCode(country);
  const cats = getCategories(country);
  const cat = cats.find((ct) => ct.slug === category);
  if (!c || !cat) return {};
  return {
    title: `Compare ${cat.name} in ${c.name}`,
    description: `Compare ${cat.name.toLowerCase()} plans from ${c.name}'s leading insurers. Side-by-side comparison with verified data.`,
  };
}

export default async function CountryComparePage({ params }: { params: Promise<{ country: string; category: string }> }) {
  const { country, category } = await params;
  if (!validCategories.includes(category)) notFound();
  const c = getCountryByCode(country);
  if (!c) notFound();

  const cats = getCategories(country);
  const cat = cats.find((ct) => ct.slug === category);
  const products = getProductsByCategory(category as Category, country);
  const disclaimer = getCategoryDisclaimer(category as Category, country);
  const lastUpdated = getCategoryLastUpdated(category as Category, country);
  const meta = categoryMeta[category] ?? categoryMeta.health;
  const Icon = meta.icon;
  const uniqueInsurers = new Set(products.map((p) => p.insurerSlug)).size;

  return (
    <div>
      <section className="relative overflow-hidden bg-surface-sunken/50">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-[1320px] px-5 lg:px-8 py-12 sm:py-16">
          <Link href={`/${country}`} className="text-[12px] text-text-tertiary hover:text-primary mb-4 inline-block">
            ← {c.flag} {c.name}
          </Link>
          <div className="flex items-start gap-5">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg shrink-0`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-[28px] sm:text-[40px] font-extrabold text-text-primary tracking-[-0.03em]">
                Compare {cat?.name ?? category} in {c.name}
              </h1>
              <p className="mt-2 text-[15px] text-text-secondary max-w-2xl">{cat?.description}</p>
              <div className="flex flex-wrap items-center gap-4 mt-5">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border text-[12px] font-medium text-text-secondary">
                  <Database className="w-3.5 h-3.5 text-primary" /> {products.length} plans
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border text-[12px] font-medium text-text-secondary">
                  <Sparkles className="w-3.5 h-3.5 text-primary" /> {uniqueInsurers} insurers
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border text-[12px] font-medium text-text-secondary">
                  <Clock className="w-3.5 h-3.5 text-primary" /> Updated: {lastUpdated || "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-5 lg:px-8 py-10">
        {disclaimer && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200/60 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-[13px] text-amber-800 font-semibold mb-0.5">Educational Information Only</p>
              <p className="text-[12px] text-amber-700/80 leading-relaxed">{disclaimer}</p>
            </div>
          </div>
        )}

        {products.length > 0 ? (
          <>
            {/* Find My Plan CTA */}
            <div className="mb-6 p-4 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-[13px] font-semibold text-text-primary">Not sure which plan is right for you?</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">Answer 4 quick questions for personalized recommendations.</p>
              </div>
              <Link
                href={`/${country}/find/${category}`}
                className="px-4 py-2 text-[12px] font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors shrink-0 flex items-center gap-1.5"
              >
                Find My Plan <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Premium Estimator */}
            <PremiumEstimator
              products={products}
              category={category as Category}
              countryCode={country}
              currencySymbol={c.currency.symbol}
            />

            <div className="mb-14">
              <h2 className="text-[20px] font-bold text-text-primary mb-5">Side-by-Side Comparison</h2>
              <div className="bg-surface rounded-2xl border border-border p-4 sm:p-6 shadow-sm">
                <ComparisonTable products={products} category={category as Category} />
              </div>
            </div>
            <div>
              <h2 className="text-[20px] font-bold text-text-primary mb-6">All {cat?.name} Plans in {c.name}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-surface-sunken rounded-2xl">
            <p className="text-[18px] font-bold text-text-primary mb-2">Data coming soon</p>
            <p className="text-[14px] text-text-secondary">We&apos;re collecting {cat?.name?.toLowerCase()} insurance data for {c.name}.</p>
          </div>
        )}
      </div>
    </div>
  );
}
