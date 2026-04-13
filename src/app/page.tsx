import Link from "next/link";
import {
  ArrowRight,
  Heart,
  Shield,
  Car,
  Plane,
  ChevronRight,
  Globe,
  FileText,
  Database,
} from "lucide-react";
import { categories, getAllProducts } from "@/lib/data";
import { getActiveCountries } from "@/lib/countries";
import {
  FAQSchema,
  BreadcrumbSchema,
  OrganizationSchema,
  WebsiteSchema,
} from "@/components/StructuredData";

import HeroSearch from "@/components/HeroSearch";

/* ─── category config ─── */
const categoryIcons: Record<string, typeof Heart> = {
  health: Heart,
  "term-life": Shield,
  motor: Car,
  travel: Plane,
};

const categoryGradients: Record<string, string> = {
  health: "from-[#c44058] to-[#e8607a]",
  "term-life": "from-[#2d3a8c] to-[#4f5cbf]",
  motor: "from-[#2d8f6f] to-[#3bb88e]",
  travel: "from-[#c47d2e] to-[#e09a4a]",
};

/* ─── FAQ data (SEO) ─── */
const homeFAQs = [
  {
    q: "What is World Best Insurer?",
    a: "World Best Insurer is a free, independent insurance comparison platform covering 12 countries. Compare health, life, motor, and travel insurance plans side-by-side using verified data from official insurer sources. We do not sell insurance.",
  },
  {
    q: "How does the comparison data stay accurate?",
    a: "We source data from official insurer websites, policy brochures, and regulatory publications. Each data point receives a confidence score (high, medium, or low) and is re-verified regularly. All sources are transparently linked.",
  },
  {
    q: "Which countries and insurance types are covered?",
    a: "We cover Health, Term Life, Motor, and Travel insurance across India, US, UK, UAE, Singapore, Canada, Australia, Germany, Saudi Arabia, Japan, South Korea, and Hong Kong — with more markets being added.",
  },
];

/* ─── page ─── */
export default function HomePage() {
  const totalProducts = getAllProducts().length;
  const activeCountries = getActiveCountries();

  return (
    <div>
      {/* Structured Data */}
      <BreadcrumbSchema
        items={[{ name: "Home", url: "https://worldbestinsurer.com" }]}
      />
      <FAQSchema questions={homeFAQs} />
      <OrganizationSchema />
      <WebsiteSchema />

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  HERO                                                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[var(--surface-dark,#0f1129)]">
        {/* Subtle gradient accents */}
        <div className="absolute top-[20%] left-[25%] w-[500px] h-[500px] rounded-full bg-[#2d3a8c]/15 blur-[140px]" />
        <div className="absolute bottom-[10%] right-[20%] w-[400px] h-[400px] rounded-full bg-[#c47d2e]/10 blur-[120px]" />

        <div className="relative z-10 mx-auto max-w-[900px] px-5 lg:px-8 text-center py-28 sm:py-36">
          <h1 className="text-[40px] sm:text-[56px] lg:text-[68px] font-extrabold tracking-[-0.04em] leading-[1.05] text-white mb-5">
            Compare Insurance
            <br />
            <span className="text-white/50">Across the World</span>
          </h1>

          <p className="text-[16px] sm:text-[18px] text-white/45 max-w-[520px] mx-auto mb-10 leading-relaxed">
            {totalProducts}+ plans. 12 countries. Independent, verified data.
          </p>

          {/* Search bar */}
          <div className="max-w-[560px] mx-auto mb-12">
            <HeroSearch />
          </div>

          {/* Category pills */}
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.slug] ?? Shield;
              return (
                <Link
                  key={cat.slug}
                  href={`/compare/${cat.slug}`}
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-[13px] font-medium text-white/70 hover:bg-white/[0.12] hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                  {cat.shortName}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  COUNTRIES                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[1100px] px-5 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[22px] sm:text-[28px] font-bold text-text-primary tracking-tight">
                Select Your Country
              </h2>
              <p className="text-[13px] text-text-tertiary mt-1">
                {activeCountries.length} markets with verified insurance data
              </p>
            </div>
            <Globe className="w-6 h-6 text-text-tertiary hidden sm:block" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {activeCountries.map((country) => (
              <Link
                key={country.code}
                href={`/${country.code}`}
                className="group flex items-center gap-3 px-4 py-3.5 rounded-xl bg-surface border border-border hover:border-primary/20 hover:shadow-sm transition-all"
              >
                <span className="text-2xl">{country.flag}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-semibold text-text-primary group-hover:text-primary transition-colors truncate">
                    {country.name}
                  </p>
                  <p className="text-[10px] text-text-tertiary">
                    {country.regulator}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-text-tertiary group-hover:text-primary shrink-0 opacity-0 group-hover:opacity-100 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  CATEGORIES                                                       */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20 bg-surface-sunken/30">
        <div className="mx-auto max-w-[1100px] px-5 lg:px-8">
          <h2 className="text-[22px] sm:text-[28px] font-bold text-text-primary tracking-tight mb-8">
            Compare by Category
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.slug] ?? Shield;
              const gradient = categoryGradients[cat.slug] ?? "from-gray-600 to-gray-700";
              return (
                <Link
                  key={cat.slug}
                  href={`/compare/${cat.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-border bg-surface p-6 hover:shadow-md hover:border-primary/15 transition-all duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm shrink-0`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[16px] font-bold text-text-primary group-hover:text-primary transition-colors">
                        {cat.shortName} Insurance
                      </h3>
                      <p className="text-[12px] text-text-tertiary mt-1 leading-relaxed line-clamp-2">
                        {cat.slug === "health" &&
                          "Compare coverage, premiums, claim settlement ratios, and network hospitals across top insurers."}
                        {cat.slug === "term-life" &&
                          "Compare death benefit, CSR, riders, premium rates, and payout options from leading life insurers."}
                        {cat.slug === "motor" &&
                          "Compare comprehensive vs third-party, IDV, NCB, add-ons, and cashless garage networks."}
                        {cat.slug === "travel" &&
                          "Compare medical cover, trip cancellation, baggage protection, and Schengen-compliant plans."}
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-text-tertiary group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 mt-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  FAQ (SEO)                                                        */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-[700px] px-5 lg:px-8">
          <h2 className="text-[20px] font-bold text-text-primary mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {homeFAQs.map((faq, i) => (
              <details
                key={i}
                className="group bg-surface rounded-xl border border-border"
              >
                <summary className="flex items-center justify-between cursor-pointer p-5 text-[13px] font-medium text-text-primary hover:text-primary transition-colors">
                  {faq.q}
                  <ChevronRight className="w-4 h-4 text-text-tertiary group-open:rotate-90 transition-transform shrink-0" />
                </summary>
                <div className="px-5 pb-5 text-[13px] text-text-secondary leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/*  TRUST FOOTER                                                     */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className="py-8 border-t border-border">
        <div className="mx-auto max-w-[1100px] px-5 lg:px-8">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-text-tertiary">
              <Database className="w-4 h-4" />
              <p className="text-[12px] font-medium">
                Data sourced from official insurer websites
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 text-[11px] text-text-tertiary">
              <Link
                href="/methodology"
                className="underline hover:text-text-secondary transition-colors flex items-center gap-1"
              >
                <FileText className="w-3 h-3" /> Methodology
              </Link>
              <span>&middot;</span>
              <Link
                href="/disclaimer"
                className="underline hover:text-text-secondary transition-colors"
              >
                Disclaimer
              </Link>
              <span>&middot;</span>
              <Link
                href="/privacy-policy"
                className="underline hover:text-text-secondary transition-colors"
              >
                Privacy
              </Link>
            </div>
            <p className="text-[11px] text-text-tertiary leading-[1.8] max-w-2xl mx-auto">
              World Best Insurer is an informational platform. We do not sell or
              distribute insurance. All data is from public sources for
              educational comparison.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
