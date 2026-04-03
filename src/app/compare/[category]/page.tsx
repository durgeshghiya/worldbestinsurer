import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Shield, Car, Plane, Globe, ArrowRight, ChevronRight } from "lucide-react";
import { categories, getProductsByCategory } from "@/lib/data";
import { countries } from "@/lib/countries";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import Breadcrumb from "@/components/Breadcrumb";

const categoryFAQs: Record<string, { q: string; a: string }[]> = {
  health: [
    { q: "How do I compare health insurance plans in India?", a: "Compare plans based on coverage amount, premium, claim settlement ratio, network hospitals, waiting periods, and exclusions. Use a comparison platform to view plans side-by-side from multiple insurers." },
    { q: "What is the best health insurance plan in India?", a: "The best plan depends on your needs. Look for plans with high claim settlement ratios (above 90%), wide hospital networks, low waiting periods for pre-existing diseases, and comprehensive coverage including daycare procedures." },
    { q: "What is Claim Settlement Ratio (CSR) in health insurance?", a: "CSR is the percentage of claims an insurer settles out of total claims received. A higher CSR (above 90%) indicates the insurer is more likely to pay your claims. IRDAI publishes CSR data annually." },
    { q: "Should I buy family floater or individual health insurance?", a: "Family floater plans cover the entire family under one sum insured and are usually cheaper. Individual plans give dedicated cover to each member. Choose family floater for young families; individual for members above 45." },
  ],
  "term-life": [
    { q: "How much term insurance cover do I need?", a: "A common rule is 10-15 times your annual income. Factor in outstanding loans, children's education costs, and your family's monthly expenses for 15-20 years. Use an online calculator for a precise estimate." },
    { q: "What is the difference between term insurance and life insurance?", a: "Term insurance provides pure death benefit for a fixed period at low cost. Traditional life insurance includes savings/investment components but costs 5-10x more for the same cover. Term insurance is recommended for most people." },
    { q: "Which term insurance has the highest claim settlement ratio?", a: "LIC consistently has one of the highest CSRs (98%+). Among private insurers, Max Life (99.2%), HDFC Life (98.5%), and Tata AIA (98.6%) have strong track records as per FY2023-24 data." },
  ],
  motor: [
    { q: "What is the difference between comprehensive and third-party motor insurance?", a: "Third-party insurance covers damage to others and is legally mandatory. Comprehensive insurance covers both third-party liability AND damage to your own vehicle, including theft, natural disasters, and accidents." },
    { q: "What is No Claim Bonus (NCB) in motor insurance?", a: "NCB is a discount on your premium for each claim-free year. It starts at 20% after the first year and can go up to 50% after 5 claim-free years. NCB is transferable when you switch insurers." },
    { q: "Is zero depreciation add-on worth it?", a: "Yes, especially for new cars (under 3 years). Without it, the insurer deducts depreciation on parts during claims — you could pay 30-40% of repair costs. Zero depreciation cover ensures full claim settlement." },
  ],
  travel: [
    { q: "Do I need travel insurance for a Schengen visa?", a: "Yes, travel insurance with minimum EUR 30,000 medical coverage is mandatory for Schengen visa applications. The policy must cover the entire trip duration and include emergency medical evacuation and repatriation." },
    { q: "What does travel insurance typically cover?", a: "Travel insurance covers medical emergencies, trip cancellation, lost baggage, flight delays, passport loss, and personal liability. Some plans also cover adventure sports, pre-existing conditions, and COVID-19 related issues." },
    { q: "How much does travel insurance cost for Indians?", a: "Travel insurance for Indians typically costs INR 500-2,000 for a week-long trip to Asia, and INR 1,500-5,000 for Europe/US. Costs vary based on destination, age, duration, and coverage amount." },
  ],
};

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
        <Breadcrumb items={[{ label: "Compare", href: "/compare/health/" }, { label: meta.label }]} />
      </div>
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

      {/* FAQ Section */}
      {categoryFAQs[category] && (
        <>
          <FAQSchema questions={categoryFAQs[category]} />
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {categoryFAQs[category].map((faq, i) => (
                <details key={i} className="group bg-surface rounded-xl border border-border">
                  <summary className="flex items-center justify-between cursor-pointer p-5 text-sm font-medium text-text-primary hover:text-primary transition-colors">
                    {faq.q}
                    <ChevronRight className="w-4 h-4 text-text-tertiary group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
