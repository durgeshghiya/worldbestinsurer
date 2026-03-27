import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Shield, Car, Plane, Globe, ArrowRight, ChevronRight } from "lucide-react";
import { categories, getProductsByCategory } from "@/lib/data";
import { countries } from "@/lib/countries";
import { BreadcrumbSchema } from "@/components/StructuredData";

const validCategories = ["health", "term-life", "motor", "travel"];

const categoryMeta: Record<string, { icon: typeof Heart; gradient: string; label: string }> = {
  health: { icon: Heart, gradient: "from-[#c44058] to-[#e8607a]", label: "Health Insurance" },
  "term-life": { icon: Shield, gradient: "from-[#2d3a8c] to-[#4f5cbf]", label: "Term Life Insurance" },
  motor: { icon: Car, gradient: "from-[#2d8f6f] to-[#3bb88e]", label: "Motor Insurance" },
  travel: { icon: Plane, gradient: "from-[#c47d2e] to-[#e09a4a]", label: "Travel Insurance" },
};

export async function generateStaticParams() {
  return validCategories.map((category) => ({ category }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = categoryMeta[category];
  if (!meta) return {};
  return {
    title: `Compare ${meta.label} — Select Your Country`,
    description: `Compare ${meta.label.toLowerCase()} plans across 12 countries. Select your country to see available plans and insurers.`,
  };
}

export default async function CompareCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!validCategories.includes(category)) notFound();

  const meta = categoryMeta[category] ?? categoryMeta.health;
  const Icon = meta.icon;

  // Get product counts per country
  const countryData = countries.map((c) => {
    let count = 0;
    try {
      const products = getProductsByCategory(category as "health" | "term-life" | "motor" | "travel", c.code);
      count = products.length;
    } catch { /* no data */ }
    return { ...c, productCount: count };
  }).filter((c) => c.productCount > 0);

  return (
    <div>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com" },
          { name: `Compare ${meta.label}`, url: `https://worldbestinsurer.com/compare/${category}` },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--surface-dark)]">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-[var(--primary)] rounded-full blur-[150px] opacity-20" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[var(--accent)] rounded-full blur-[120px] opacity-15" />
        </div>
        <div className="relative mx-auto max-w-[1280px] px-5 lg:px-8 py-16 sm:py-24 text-center">
          <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg mb-6`}>
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Compare {meta.label}
          </h1>
          <p className="mt-4 text-white/50 max-w-lg mx-auto text-base">
            Select your country to view and compare {meta.label.toLowerCase()} plans from top insurers.
          </p>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-white/30">
            <Globe className="w-4 h-4" />
            <span>{countryData.length} countries available</span>
          </div>
        </div>
      </section>

      {/* Country Selection Grid */}
      <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-12 sm:py-16">
        <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 text-center">
          🌍 Select Your Country
        </h2>
        <p className="text-text-secondary text-sm text-center mb-10 max-w-md mx-auto">
          Choose a country to see available {meta.label.toLowerCase()} plans and compare them side by side.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {countryData.map((country) => (
            <Link
              key={country.code}
              href={`/${country.code}/compare/${category}/`}
              className="group relative bg-surface rounded-2xl border border-border hover:border-[var(--primary)]/30 hover:shadow-lg hover:shadow-[var(--primary)]/5 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient top accent */}
              <div className={`h-1 bg-gradient-to-r ${meta.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />

              <div className="p-5">
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{country.flag}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[15px] font-bold text-text-primary group-hover:text-[var(--primary)] transition-colors">
                      {country.name}
                    </h3>
                    <p className="text-[12px] text-text-tertiary mt-0.5">
                      {country.productCount} {meta.label.toLowerCase().replace("insurance", "").trim()} plans
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-tertiary group-hover:text-[var(--primary)] group-hover:translate-x-1 transition-all shrink-0" />
                </div>

                <div className="mt-4 flex items-center gap-3 text-[11px] text-text-tertiary">
                  <span className="px-2 py-0.5 rounded-md bg-surface-sunken">{country.currency.code}</span>
                  <span className="px-2 py-0.5 rounded-md bg-surface-sunken">{country.regulator}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty state if no countries */}
        {countryData.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-tertiary text-sm">No {meta.label.toLowerCase()} data available yet.</p>
          </div>
        )}
      </section>

      {/* Other categories */}
      <section className="mx-auto max-w-[1280px] px-5 lg:px-8 pb-16">
        <h3 className="text-lg font-bold text-text-primary mb-4 text-center">Explore Other Categories</h3>
        <div className="flex flex-wrap justify-center gap-3">
          {validCategories.filter((c) => c !== category).map((c) => {
            const m = categoryMeta[c];
            const CatIcon = m.icon;
            return (
              <Link
                key={c}
                href={`/compare/${c}/`}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border hover:border-[var(--primary)]/20 hover:shadow-sm transition-all bg-surface"
              >
                <CatIcon className="w-4 h-4 text-text-tertiary" />
                <span className="text-[13px] font-medium text-text-primary">{m.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-text-tertiary" />
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
