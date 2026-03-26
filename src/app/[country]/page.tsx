import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Heart, Shield, Car, Plane, ChevronRight, Globe2, TrendingUp, Database, Users } from "lucide-react";
import { getCountryByCode, getActiveCountries, VALID_COUNTRY_CODES } from "@/lib/countries";
import { getAllProducts, getAllInsurers, getCategories } from "@/lib/data";
import WaitlistForm from "@/components/WaitlistForm";
import { FAQSchema, BreadcrumbSchema } from "@/components/StructuredData";

export async function generateStaticParams() {
  return VALID_COUNTRY_CODES.map((country) => ({ country }));
}

export async function generateMetadata({ params }: { params: Promise<{ country: string }> }): Promise<Metadata> {
  const { country } = await params;
  const c = getCountryByCode(country);
  if (!c) return {};
  return {
    title: `Compare Insurance in ${c.name} — World Best Insurer`,
    description: `Compare health, life, motor, and travel insurance plans in ${c.name}. Transparent data from ${c.name}'s leading insurers.`,
  };
}

const categoryIcons: Record<string, typeof Heart> = { health: Heart, "term-life": Shield, motor: Car, travel: Plane };
const categoryGradients: Record<string, string> = {
  health: "from-rose-500 to-pink-600", "term-life": "from-indigo-500 to-violet-600",
  motor: "from-emerald-500 to-teal-600", travel: "from-amber-500 to-orange-600",
};

export default async function CountryPage({ params }: { params: Promise<{ country: string }> }) {
  const { country } = await params;
  const c = getCountryByCode(country);
  if (!c) notFound();

  const products = getAllProducts(country);
  const insurers = getAllInsurers(country);
  const cats = getCategories(country);
  const hasData = products.length > 0;

  const faqs = [
    { q: `What types of insurance can I compare in ${c.name}?`, a: `World Best Insurer lets you compare health insurance, term life insurance, motor insurance, and travel insurance plans from leading insurers in ${c.name}.` },
    { q: `Is the insurance data for ${c.name} verified?`, a: `Our data is sourced from official insurer websites and public documents. All data carries a confidence score and last-verified date. We recommend verifying with insurers directly before purchasing.` },
    { q: `Does World Best Insurer sell insurance in ${c.name}?`, a: `No. World Best Insurer is an educational comparison platform. We do not sell insurance, collect premiums, or act as an intermediary. We help you compare and make informed decisions.` },
    { q: `How often is the ${c.name} insurance data updated?`, a: `We use AI-powered agents to monitor insurer websites and update product data regularly. Each product listing shows when it was last verified.` },
    { q: `Which insurers are covered for ${c.name}?`, a: `We cover ${insurers.length}+ major insurers in ${c.name} across health, life, motor, and travel insurance categories.` },
  ];

  return (
    <div>
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://worldbestinsurer.com" },
        { name: c.name, url: `https://worldbestinsurer.com/${country}` },
      ]} />
      <FAQSchema questions={faqs} />
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] blob bg-primary/10" />
        <div className="absolute bottom-[-10%] right-[5%] w-[400px] h-[400px] blob bg-accent/10" />

        <div className="relative mx-auto max-w-[1320px] px-5 lg:px-8 pt-16 pb-20">
          <div className="max-w-[700px]">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-[48px] leading-none">{c.flag}</span>
              <div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-[0.15em]">Insurance Market</span>
                <h1 className="text-[36px] sm:text-[48px] font-extrabold text-text-primary tracking-[-0.03em] leading-[1.1]">
                  {c.name}
                </h1>
              </div>
            </div>

            <p className="text-[16px] text-text-secondary leading-relaxed mb-6">{c.description}</p>

            <div className="flex flex-wrap gap-3 mb-10">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border text-[12px] font-medium text-text-secondary">
                <Database className="w-3.5 h-3.5 text-primary" /> {products.length} Plans
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border text-[12px] font-medium text-text-secondary">
                <Users className="w-3.5 h-3.5 text-primary" /> {insurers.length} Insurers
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border text-[12px] font-medium text-text-secondary">
                <Globe2 className="w-3.5 h-3.5 text-primary" /> {c.currency.code} ({c.currency.symbol})
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-surface border border-border text-[12px] font-medium text-text-secondary">
                <TrendingUp className="w-3.5 h-3.5 text-primary" /> Regulator: {c.regulator}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-[1320px] px-5 lg:px-8 py-16">
        <h2 className="text-[24px] font-bold text-text-primary mb-8">
          Insurance Categories in {c.name}
        </h2>
        {hasData ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
            {cats.map((cat) => {
              const Icon = categoryIcons[cat.slug] ?? Shield;
              return (
                <Link key={cat.slug} href={`/${country}/compare/${cat.slug}`}
                  className="group card-premium bg-surface rounded-2xl border border-border p-6 text-center">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${categoryGradients[cat.slug] ?? "from-gray-500 to-gray-600"} flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-[15px] font-bold text-text-primary mb-1">{cat.name}</h3>
                  <p className="text-[12px] text-text-tertiary mb-4">{cat.productCount} plans compared</p>
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary">
                    Compare now <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface-sunken rounded-2xl">
            <Globe2 className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
            <h3 className="text-[18px] font-bold text-text-primary mb-2">Coming Soon</h3>
            <p className="text-[14px] text-text-secondary max-w-md mx-auto mb-6">
              We&apos;re collecting and verifying insurance data for {c.name}. Join our waitlist to get notified when it launches.
            </p>
            <WaitlistForm variant="default" />
          </div>
        )}
      </section>

      {/* Other countries */}
      <section className="mx-auto max-w-[1320px] px-5 lg:px-8 pb-16">
        <h3 className="text-[16px] font-bold text-text-primary mb-4">Explore other markets</h3>
        <div className="flex flex-wrap gap-2">
          {getActiveCountries().filter((ac) => ac.code !== country).slice(0, 8).map((ac) => (
            <Link key={ac.code} href={`/${ac.code}`}
              className="px-4 py-2 text-[13px] font-medium border border-border rounded-xl hover:border-primary/20 hover:text-primary transition-colors">
              {ac.flag} {ac.name}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
