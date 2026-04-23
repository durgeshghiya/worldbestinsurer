import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { Heart, Shield, Car, Plane, Globe, ArrowRight, ChevronRight, BarChart2 } from "lucide-react";
import { getProductsByCategory } from "@/lib/data";
import { countries } from "@/lib/countries";
import { BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";
import Breadcrumb from "@/components/Breadcrumb";

// Editorial market overview per category — adds original analysis for AdSense quality
const categoryOverview: Record<string, { headline: string; body: string; stats: { label: string; value: string }[] }> = {
  health: {
    headline: "Global Health Insurance: What the Data Shows",
    body: "Health insurance markets vary dramatically across the 12 countries covered on this platform. India's market is the most dynamic, with over 30 general and standalone health insurers competing on features like restoration benefit, PED waiting periods, and AYUSH coverage — all regulated by IRDAI. The United States operates primarily on employer-sponsored coverage and marketplace plans under the ACA, with premium variation tied to metal tiers and income-based subsidies. The United Kingdom offers a unique hybrid: the NHS provides free-at-point-of-use public healthcare, while private health insurance (from Bupa, AXA Health, Vitality) adds speed, specialist access, and choice. Singapore's Medishield Life universal public insurance is supplemented by Integrated Shield Plans (ISPs) from NTUC Income, Prudential, Great Eastern, and AIA — among the most structured private-public hybrid systems globally. UAE and Saudi Arabia mandate employer-provided health insurance in most emirates and cities, creating one of the highest coverage rates in emerging markets. Australia's Medicare universal system coexists with private health insurance that offers extras cover for dental, optical, and physio — regulated by APRA. Germany's dual system (statutory GKV and private PKV) means coverage options depend on employment type and income. When comparing across countries, watch for differences in: how pre-existing conditions are handled, what out-of-pocket maximums apply, whether outpatient and dental care are included, and how claims are processed.",
    stats: [
      { label: "Countries covered", value: "12" },
      { label: "Health plans tracked", value: "130+" },
      { label: "Avg claim settlement (IN)", value: "94%" },
      { label: "Data verified", value: "2026" },
    ],
  },
  "term-life": {
    headline: "Term Life Insurance: A Global Comparison",
    body: "Term life insurance — pure death benefit coverage for a fixed period — is structurally similar across markets but differs significantly in pricing, features, and underwriting philosophy. India's term insurance market has matured rapidly, with private insurers like Max Life (99.2% CSR), HDFC Life (98.5%), and Tata AIA (98.6%) competing on claim settlement ratios alongside LIC's government-backed dominance. Premiums for a Rs 1 crore cover for a 30-year-old non-smoker start at approximately Rs 6,000-10,000 annually — among the most affordable term insurance rates globally relative to coverage amount. The United States offers both level term and decreasing term products, with term premiums influenced by state regulations, health classifications (Preferred Plus to Substandard), and the insurer's actuarial tables. The UK's life assurance market is dominated by Legal & General, Aviva, and Royal London, with premiums quoted in GBP and products often bundled with critical illness cover. Canada's life insurance framework, regulated provincially, features participating (par) and non-participating products with a strong mutual insurer tradition. Across all markets, key comparison factors remain consistent: the insurer's financial strength rating, claim settlement speed and ratio, rider availability (critical illness, disability waiver), payout flexibility (lump sum vs income), and exclusions for specific causes of death. Online purchase has become the dominant channel in India and the UK, driving premium transparency and market competition.",
    stats: [
      { label: "Countries covered", value: "12" },
      { label: "Term plans tracked", value: "80+" },
      { label: "Best CSR (India)", value: "99.2%" },
      { label: "Data verified", value: "2026" },
    ],
  },
  motor: {
    headline: "Motor Insurance Markets: Global Overview",
    body: "Motor insurance is mandatory in virtually every country where private vehicle ownership is common, but the structure, pricing, and coverage requirements differ substantially across markets. In India, third-party motor insurance is legally mandatory under the Motor Vehicles Act, with IRDAI setting third-party premium rates annually. The own-damage (OD) market is competitive, with insurers like ICICI Lombard, Bajaj Allianz, HDFC ERGO, and Acko competing on premium, claims speed, and add-on options like zero depreciation and engine protect. The UK operates a fault-based third-party system with a highly competitive marketplace — comparison platforms like Compare the Market and MoneySuperMarket have made motor insurance one of the most price-transparent insurance products globally. Australia requires Compulsory Third Party (CTP or green slip) insurance in each state separately from comprehensive cover, creating a split-market structure unique among developed insurance markets. The UAE's mandatory third-party motor insurance is a base requirement with comprehensive cover widely purchased for newer vehicles, particularly given the higher accident rates and vehicle repair costs in the region. Singapore's car insurance market is tightly regulated by MAS, with Certificate of Entitlement (COE) pricing influencing the vehicle values that premiums are based on. Germany's KFZ-Haftpflichtversicherung (compulsory third-party) is supplemented by Teilkasko (partial coverage) and Vollkasko (comprehensive) for newer vehicles. Across all markets, the core decision framework is similar: third-party only vs comprehensive, add-on selection based on vehicle age and value, and insurer selection based on claim settlement speed and network coverage.",
    stats: [
      { label: "Countries covered", value: "12" },
      { label: "Motor plans tracked", value: "90+" },
      { label: "Third-party mandatory in", value: "12/12 markets" },
      { label: "Data verified", value: "2026" },
    ],
  },
  travel: {
    headline: "Travel Insurance: What Every Traveller Should Know",
    body: "Travel insurance is one of the most variable insurance products globally — coverage, pricing, and claim processes differ enormously between insurers, destinations, and trip types. For Indian travellers, the most critical driver is destination: Schengen visa applications mandate a minimum EUR 30,000 medical cover, while US and Canada require higher limits (USD 100,000+ recommended) due to the extraordinarily high cost of healthcare in North America. Annual multi-trip policies have grown significantly among frequent flyers, offering unlimited trips up to a per-trip duration (usually 30-45 days) for a single annual premium — often less than two standalone trip premiums. The COVID-19 pandemic transformed travel insurance permanently: most plans now include COVID-related medical cover, trip cancellation for pandemic-related reasons, and quarantine hotel expenses. Pre-existing condition coverage remains the most contentious travel insurance issue — standard policies exclude it, while specialist plans from providers like Star Health (Global Mediclaim), TATA AIG, and Bajaj Allianz offer PED cover with waiting periods. For adventure sports enthusiasts — skiers, scuba divers, trekkers — standard travel insurance excludes high-risk activities, requiring specific adventure cover endorsements. Business travellers benefit from plans with higher baggage and electronics cover, plus business equipment coverage. When comparing travel insurance across the 12 markets covered on this platform, primary differentiation factors include: medical evacuation limit, trip cancellation coverage amount, baggage delay compensation speed, 24/7 assistance network quality, and the ease of the claims process — particularly for emergency medical claims abroad.",
    stats: [
      { label: "Countries covered", value: "12" },
      { label: "Travel plans tracked", value: "60+" },
      { label: "Schengen min cover", value: "EUR 30,000" },
      { label: "Data verified", value: "2026" },
    ],
  },
};

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

      {/* Market Overview — editorial content for AdSense quality */}
      {categoryOverview[category] && (
        <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-12 sm:py-14 border-b border-border">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 className="w-5 h-5 text-text-tertiary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-text-tertiary">
              Market Analysis
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-4 max-w-2xl">
            {categoryOverview[category].headline}
          </h2>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {categoryOverview[category].stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-surface rounded-xl border border-border p-4 text-center"
              >
                <p className="text-xl font-bold text-text-primary">{stat.value}</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Body text */}
          <div className="prose prose-sm max-w-none text-text-secondary leading-[1.8] text-[14px]">
            {categoryOverview[category].body
              .split(". ")
              .reduce((acc: string[][], sentence, i) => {
                const pi = Math.floor(i / 4);
                if (!acc[pi]) acc[pi] = [];
                acc[pi].push(sentence);
                return acc;
              }, [])
              .map((sentences, i) => (
                <p key={i} className="mb-4">
                  {sentences.join(". ")}
                  {sentences[sentences.length - 1]?.endsWith(".") ? "" : "."}
                </p>
              ))}
          </div>
        </section>
      )}

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
