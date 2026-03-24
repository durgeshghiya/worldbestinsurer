import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle, Clock, Database, Heart, Shield, Car, Plane, ArrowRight, Sparkles } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import ComparisonTable from "@/components/ComparisonTable";
import {
  getProductsByCategory,
  categories,
  getCategoryDisclaimer,
  getCategoryLastUpdated,
} from "@/lib/data";
import type { Category } from "@/lib/types";
import { ComparisonSchema, BreadcrumbSchema, FAQSchema } from "@/components/StructuredData";

const validCategories = ["health", "term-life", "motor", "travel"];

const categoryMeta: Record<string, { icon: typeof Heart; gradient: string; accent: string }> = {
  health: { icon: Heart, gradient: "from-rose-500 to-pink-600", accent: "text-rose-500" },
  "term-life": { icon: Shield, gradient: "from-indigo-500 to-violet-600", accent: "text-indigo-500" },
  motor: { icon: Car, gradient: "from-emerald-500 to-teal-600", accent: "text-emerald-500" },
  travel: { icon: Plane, gradient: "from-amber-500 to-orange-600", accent: "text-amber-500" },
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
  const cat = categories.find((c) => c.slug === category);
  if (!cat) return {};
  return {
    title: `Compare ${cat.name} Plans in India`,
    description: cat.description,
  };
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!validCategories.includes(category)) notFound();

  const cat = categories.find((c) => c.slug === category)!;
  const products = getProductsByCategory(category as Category);
  const disclaimer = getCategoryDisclaimer(category as Category);
  const lastUpdated = getCategoryLastUpdated(category as Category);
  const meta = categoryMeta[category] ?? categoryMeta.health;
  const Icon = meta.icon;
  const uniqueInsurers = new Set(products.map((p) => p.insurerSlug)).size;

  const categoryFAQs: Record<string, { q: string; a: string }[]> = {
    health: [
      { q: "How do I choose the best health insurance plan in India?", a: "Compare plans based on sum insured, waiting periods for pre-existing diseases, room rent limits, co-payment clauses, network hospital coverage, claim settlement ratio, and premium affordability. World Best Insurer lets you compare all these factors side-by-side." },
      { q: "What is a claim settlement ratio in health insurance?", a: "Claim settlement ratio (CSR) is the percentage of claims an insurer settles out of total claims received in a financial year. A higher CSR generally indicates better claim servicing. IRDAI publishes these figures annually." },
      { q: "What are waiting periods in health insurance?", a: "Waiting periods are time-based restrictions during which certain claims cannot be made. There are three types: initial waiting period (30 days), pre-existing disease waiting (24-48 months), and specific disease waiting (usually 24 months)." },
    ],
    "term-life": [
      { q: "How much term insurance cover do I need?", a: "A common guideline is 10-15 times your annual income. Consider your outstanding loans, family expenses, children's education costs, and inflation when calculating the ideal cover amount." },
      { q: "What factors affect term insurance premiums?", a: "Key factors include your age, health condition, smoking status, coverage amount, policy term, and chosen riders. Buying early (in your 20s or 30s) locks in significantly lower premiums." },
      { q: "What is the difference between term insurance and whole life insurance?", a: "Term insurance provides coverage for a specific period at lower premiums with no maturity benefit. Whole life insurance covers your entire lifetime and includes a savings component, but costs significantly more." },
    ],
    motor: [
      { q: "What is the difference between comprehensive and third-party motor insurance?", a: "Third-party insurance is mandatory and covers legal liability for injury or damage to others. Comprehensive insurance includes third-party coverage plus own-damage cover for your vehicle against theft, fire, natural disasters, and accidents." },
      { q: "What is IDV in motor insurance?", a: "Insured Declared Value (IDV) is the maximum amount your insurer will pay if your vehicle is stolen or totally damaged. It is calculated as the manufacturer's listed selling price minus depreciation based on vehicle age." },
      { q: "How does No Claim Bonus work in motor insurance?", a: "NCB is a discount on your own-damage premium for claim-free years. It starts at 20% after the first year and can go up to 50% after five claim-free years. Making a claim resets NCB to zero." },
    ],
    travel: [
      { q: "Do I need travel insurance for international trips from India?", a: "While not mandatory for all destinations, travel insurance is highly recommended and is required for Schengen visa applications. It covers medical emergencies abroad, trip cancellations, baggage loss, and more." },
      { q: "What is the minimum travel insurance cover for a Schengen visa?", a: "For Schengen visa applications, travel insurance with a minimum medical coverage of EUR 30,000 (approximately Rs 27 lakh) is mandatory. The policy must be valid for all Schengen countries." },
      { q: "Does travel insurance cover COVID-related medical expenses?", a: "Coverage varies by insurer and plan. Many modern travel insurance plans now include COVID-related medical expenses. Always check the specific policy terms and confirm coverage before purchasing." },
    ],
  };

  const faqs = categoryFAQs[category] ?? [];

  return (
    <div>
      <ComparisonSchema products={products} category={category} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com" },
          { name: `Compare ${cat.name}`, url: `https://worldbestinsurer.com/compare/${category}` },
        ]}
      />
      {faqs.length > 0 && <FAQSchema questions={faqs} />}
      {/* Hero header */}
      <section className="relative overflow-hidden bg-surface-sunken/50">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto max-w-[1320px] px-5 lg:px-8 py-12 sm:py-16">
          <div className="flex items-start gap-5">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center shadow-lg shrink-0`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-[28px] sm:text-[40px] font-extrabold text-text-primary tracking-[-0.03em]">
                Compare {cat.name}
              </h1>
              <p className="mt-2 text-[15px] text-text-secondary max-w-2xl">{cat.description}</p>
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-5">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border text-[12px] font-medium text-text-secondary">
                  <Database className="w-3.5 h-3.5 text-primary" />
                  {products.length} plans
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border text-[12px] font-medium text-text-secondary">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  {uniqueInsurers} insurers
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border text-[12px] font-medium text-text-secondary">
                  <Clock className="w-3.5 h-3.5 text-primary" />
                  Updated: {lastUpdated}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1320px] px-5 lg:px-8 py-10">
        {/* Disclaimer */}
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200/60 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] text-amber-800 font-semibold mb-0.5">Educational Information Only</p>
            <p className="text-[12px] text-amber-700/80 leading-relaxed">{disclaimer}</p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-[20px] font-bold text-text-primary">
              Side-by-Side Comparison
            </h2>
            <span className="text-[11px] text-text-tertiary">Select up to 4 plans</span>
          </div>
          <div className="bg-surface rounded-2xl border border-border p-4 sm:p-6 shadow-sm">
            <ComparisonTable products={products} category={category as Category} />
          </div>
        </div>

        {/* All Products */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[20px] font-bold text-text-primary">
              All {cat.name} Plans
            </h2>
            <Link href="/methodology" className="text-[12px] font-medium text-primary hover:text-primary-hover flex items-center gap-1 transition-colors">
              How we verify <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
