import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Shield,
  TrendingUp,
  Eye,
  RefreshCw,
  Database,
  Lock,
  Zap,
  Heart,
  Car,
  Plane,
  ChevronRight,
  Star,
  Globe,
  Users,
  Clock,
  FileText,
  Search,
  Award,
} from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";
import {
  categories,
  getAllProducts,
  getAllInsurers,
  getProductsByCategory,
} from "@/lib/data";
import { countries as allCountries, getActiveCountries } from "@/lib/countries";
import {
  FAQSchema,
  BreadcrumbSchema,
  OrganizationSchema,
  WebsiteSchema,
} from "@/components/StructuredData";
import { getArticles } from "@/lib/generators";
import { generateVSPairs } from "@/lib/generators";

const categoryIcons: Record<string, typeof Heart> = {
  health: Heart,
  "term-life": Shield,
  motor: Car,
  travel: Plane,
};

const categoryGradients: Record<string, string> = {
  health: "from-rose-500 to-pink-600",
  "term-life": "from-indigo-500 to-violet-600",
  motor: "from-emerald-500 to-teal-600",
  travel: "from-amber-500 to-orange-600",
};

const categoryGlows: Record<string, string> = {
  health: "group-hover:shadow-[0_8px_40px_rgba(244,63,94,0.2)]",
  "term-life": "group-hover:shadow-[0_8px_40px_rgba(99,102,241,0.2)]",
  motor: "group-hover:shadow-[0_8px_40px_rgba(6,214,160,0.2)]",
  travel: "group-hover:shadow-[0_8px_40px_rgba(245,158,11,0.2)]",
};

const categoryColors: Record<string, string> = {
  health: "bg-rose-50 text-rose-600 border-rose-200",
  "term-life": "bg-indigo-50 text-indigo-600 border-indigo-200",
  motor: "bg-emerald-50 text-emerald-600 border-emerald-200",
  travel: "bg-amber-50 text-amber-600 border-amber-200",
  Health: "bg-rose-50 text-rose-600 border-rose-200",
  "Term Life": "bg-indigo-50 text-indigo-600 border-indigo-200",
  Motor: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Travel: "bg-amber-50 text-amber-600 border-amber-200",
  General: "bg-gray-50 text-gray-600 border-gray-200",
};

export default function HomePage() {
  const totalProducts = getAllProducts().length;
  const totalInsurers = getAllInsurers().length;
  const activeCountries = getActiveCountries();
  const articles = getArticles().slice(0, 6);

  // Build popular VS comparisons from actual data
  const allVSPairs: { nameA: string; nameB: string; category: string; countryCode: string; slug: string }[] = [];
  for (const c of allCountries) {
    const pairs = generateVSPairs(c.code);
    for (const pair of pairs.slice(0, 2)) {
      allVSPairs.push({
        nameA: pair.productA.productName,
        nameB: pair.productB.productName,
        category: pair.category,
        countryCode: pair.countryCode,
        slug: pair.slug,
      });
    }
  }
  const popularComparisons = allVSPairs.slice(0, 8);

  const homeFAQs = [
    {
      q: "What is World Best Insurer and how does it help compare insurance?",
      a: "World Best Insurer is a global insurance comparison platform covering 12 countries. It allows you to compare health, life, motor, and travel insurance plans side-by-side using verified data from official insurer sources. World Best Insurer does not sell insurance \u2014 it provides transparent, educational comparison data.",
    },
    {
      q: "Is World Best Insurer free to use for comparing insurance plans?",
      a: "Yes, World Best Insurer is completely free to use. You can compare insurance plans, read detailed product information, and access educational guides without any cost or registration required.",
    },
    {
      q: "How does World Best Insurer verify insurance plan data?",
      a: "World Best Insurer sources data from official insurer websites, policy brochures, and public regulatory documents. Each data point receives a confidence score (high, medium, or low) based on the verification level. All sources are transparently linked.",
    },
    {
      q: "Which types of insurance can I compare on World Best Insurer?",
      a: "World Best Insurer supports four insurance categories: Health Insurance, Term Life Insurance, Motor Insurance, and Travel Insurance \u2014 across 12 countries including India, US, UK, UAE, Singapore, Canada, Australia, Germany, Saudi Arabia, Japan, South Korea, and Hong Kong.",
    },
    {
      q: "Does World Best Insurer sell insurance policies or earn commissions?",
      a: "No. World Best Insurer is purely an informational and educational platform. It does not sell insurance, distribute policies, or earn commissions from insurers. There are no hidden rankings or pay-to-play listings.",
    },
  ];

  return (
    <div className="overflow-hidden">
      <BreadcrumbSchema
        items={[{ name: "Home", url: "https://worldbestinsurer.com" }]}
      />
      <FAQSchema questions={homeFAQs} />
      <OrganizationSchema />
      <WebsiteSchema />

      {/* ================================================================= */}
      {/*  HERO SECTION                                                     */}
      {/* ================================================================= */}
      <section className="relative min-h-[95vh] flex items-center">
        {/* Background mesh */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="absolute top-[-20%] left-[10%] w-[600px] h-[600px] blob bg-primary/10" />
        <div className="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] blob bg-accent/10" />
        <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] blob bg-[#7c3aed]/8" />

        <div className="relative mx-auto max-w-[1320px] px-5 lg:px-8 pt-16 sm:pt-20 pb-20 w-full">
          {/* Top badge */}
          <div className="text-center mb-6 animate-fade-in">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full badge-premium text-[12px] font-medium text-text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                </span>
                Tracking {totalProducts}+ plans across 12 countries
              </span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center max-w-4xl mx-auto animate-slide-up">
            <h1 className="text-[40px] sm:text-[52px] lg:text-[64px] font-extrabold text-text-primary tracking-[-0.04em] leading-[1.05]">
              Compare Insurance Plans
              <br />
              <span className="text-gradient">Worldwide</span>
            </h1>
            <p className="mt-5 text-[16px] sm:text-[18px] text-text-secondary leading-[1.6] max-w-[640px] mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Find the best insurance plans across 12 countries. Transparent, unbiased, AI-powered.
            </p>
          </div>

          {/* Quick Category Tabs */}
          <div className="mt-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.15s" }}>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {categories.map((cat) => {
                const Icon = categoryIcons[cat.slug] ?? Shield;
                return (
                  <Link
                    key={cat.slug}
                    href={`/compare/${cat.slug}`}
                    className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-surface border border-border hover:border-primary/30 hover:shadow-md transition-all duration-200"
                  >
                    <Icon className="w-4 h-4 text-text-tertiary group-hover:text-primary transition-colors" />
                    <span className="text-[13px] font-semibold text-text-primary group-hover:text-primary transition-colors">
                      {cat.shortName}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mini Inline Form */}
          <div className="mt-8 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-surface border border-border shadow-sm">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Users className="w-4 h-4 text-text-tertiary shrink-0" />
                <input
                  type="number"
                  placeholder="Age"
                  className="w-16 py-2.5 text-[14px] bg-transparent outline-none text-text-primary placeholder:text-text-tertiary"
                  min={0}
                  max={100}
                />
              </div>
              <div className="w-px h-8 bg-border" />
              <div className="flex items-center gap-2 flex-1 px-3">
                <Shield className="w-4 h-4 text-text-tertiary shrink-0" />
                <input
                  type="text"
                  placeholder="Cover amount"
                  className="w-full py-2.5 text-[14px] bg-transparent outline-none text-text-primary placeholder:text-text-tertiary"
                />
              </div>
              <Link
                href="/compare/health"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-semibold rounded-xl bg-gradient-to-r from-primary to-[#7c3aed] text-white hover:shadow-md hover:scale-[1.02] transition-all duration-200"
              >
                <Search className="w-3.5 h-3.5" />
                Compare Now
              </Link>
            </div>
          </div>

          {/* Trust Stats Row */}
          <div className="mt-12 flex items-center justify-center gap-6 sm:gap-10 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            {[
              { value: `${totalProducts}+`, label: "Plans" },
              { value: `${totalInsurers}+`, label: "Insurers" },
              { value: "12", label: "Countries" },
              { value: "Daily", label: "Updated" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2">
                <p className="text-[18px] sm:text-[22px] font-extrabold text-text-primary tracking-tight leading-none">
                  {s.value}
                </p>
                <p className="text-[11px] sm:text-[12px] text-text-tertiary font-medium tracking-wide uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ================================================================= */}
      {/*  COUNTRY SELECTOR SECTION                                         */}
      {/* ================================================================= */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-[11px] font-bold text-primary uppercase tracking-[0.15em] mb-3">
              Global Coverage
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-extrabold text-text-primary tracking-[-0.03em]">
              Choose Your Country
            </h2>
            <p className="mt-3 text-[15px] text-text-secondary max-w-md mx-auto">
              Explore insurance plans from 12 major markets around the world
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto stagger-children">
            {allCountries.map((c, i) => {
              const countryProducts = getAllProducts(c.code).length;
              return (
                <Link
                  key={c.code}
                  href={`/${c.code}/compare/health/`}
                  className="group card-premium bg-surface rounded-2xl border border-border p-5 hover:border-primary/20 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                  style={{ animationDelay: `${0.05 + i * 0.03}s` }}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-[36px] sm:text-[40px] group-hover:scale-110 transition-transform duration-300">
                      {c.flag}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-[14px] sm:text-[15px] font-bold text-text-primary group-hover:text-primary transition-colors leading-tight truncate">
                        {c.name}
                      </h3>
                      <p className="text-[11px] text-text-tertiary mt-0.5">
                        {countryProducts > 0 ? `${countryProducts} plans` : c.currency.code}
                      </p>
                      <p className="text-[10px] text-text-tertiary mt-0.5">
                        Regulator: {c.regulator}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-light">
                    <span className="text-[10px] text-text-tertiary font-medium">
                      {c.insuranceCategories.length} categories
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all">
                      Explore <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                  {c.isActive && countryProducts > 0 && (
                    <div className="absolute top-2 right-2">
                      <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  POPULAR COMPARISONS SECTION                                      */}
      {/* ================================================================= */}
      {popularComparisons.length > 0 && (
        <section className="py-20 sm:py-28 bg-surface-sunken/30">
          <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block text-[11px] font-bold text-primary uppercase tracking-[0.15em] mb-3">
                Head to Head
              </span>
              <h2 className="text-[32px] sm:text-[40px] font-extrabold text-text-primary tracking-[-0.03em]">
                Popular Comparisons
              </h2>
              <p className="mt-3 text-[15px] text-text-secondary max-w-md mx-auto">
                See how top insurance plans stack up against each other
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto stagger-children">
              {popularComparisons.map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/${comp.countryCode}/vs/${comp.slug}`}
                  className="group card-premium bg-surface rounded-2xl border border-border p-5 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full uppercase ${categoryColors[comp.category] ?? "bg-gray-50 text-gray-600"}`}>
                      {comp.category.replace("-", " ")}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[13px] font-semibold text-text-primary leading-tight truncate">{comp.nameA}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-border" />
                      <span className="text-[10px] font-bold text-primary bg-primary-light px-2 py-0.5 rounded-full">VS</span>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <p className="text-[13px] font-semibold text-text-primary leading-tight truncate">{comp.nameB}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-end">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary group-hover:gap-2 transition-all">
                      Compare <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/*  HOW IT WORKS                                                     */}
      {/* ================================================================= */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-[11px] font-bold text-primary uppercase tracking-[0.15em] mb-3">
              How it works
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-extrabold text-text-primary tracking-[-0.03em]">
              Three steps to clarity
            </h2>
            <p className="mt-3 text-[15px] text-text-secondary max-w-md mx-auto">
              A transparent, methodology-led approach to understanding insurance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-0 max-w-5xl mx-auto relative">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-[56px] left-[16%] right-[16%] h-px bg-gradient-to-r from-indigo-300 via-emerald-300 to-amber-300" />

            {[
              {
                step: "01",
                icon: Globe,
                gradient: "from-indigo-500 to-violet-600",
                title: "Select Country",
                desc: "Choose from 12 countries. Each market has localized insurance data, regulation info, and currency-specific comparisons.",
              },
              {
                step: "02",
                icon: BarChart3,
                gradient: "from-emerald-500 to-teal-600",
                title: "Compare Plans",
                desc: "Side-by-side comparisons with verified data. Every field shows confidence scores and links to official sources.",
              },
              {
                step: "03",
                icon: Award,
                gradient: "from-amber-500 to-orange-600",
                title: "Get Expert Advice",
                desc: "Read our in-depth guides, understand exclusions and waiting periods, and make an informed decision.",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center px-6 py-8">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg mx-auto mb-5 relative z-10`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-surface border-2 border-primary text-[11px] font-bold text-primary mb-3">
                  {item.step.replace("0", "")}
                </span>
                <h3 className="text-[17px] font-bold text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-[13.5px] text-text-tertiary leading-relaxed max-w-[280px] mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  FEATURED CATEGORIES                                              */}
      {/* ================================================================= */}
      <section className="py-20 sm:py-28 bg-surface-sunken/30">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-[11px] font-bold text-primary uppercase tracking-[0.15em] mb-3">
              Browse by category
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-extrabold text-text-primary tracking-[-0.03em]">
              What would you like to compare?
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto stagger-children">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.slug] ?? Shield;
              // Count products across all countries for this category
              const globalCount = getProductsByCategory(cat.slug).length;
              const countriesWithData = allCountries.filter(
                (c) => getProductsByCategory(cat.slug, c.code).length > 0
              ).length;

              return (
                <Link
                  key={cat.slug}
                  href={`/compare/${cat.slug}`}
                  className={`group card-premium bg-surface rounded-2xl border border-border p-6 text-center relative overflow-hidden ${categoryGlows[cat.slug]}`}
                >
                  {/* Gradient border top */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${categoryGradients[cat.slug]}`} />

                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${categoryGradients[cat.slug]} flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-[15px] font-bold text-text-primary mb-1">{cat.name}</h3>
                  <p className="text-[12px] text-text-tertiary mb-1">{globalCount} plans compared</p>
                  {countriesWithData > 0 && (
                    <p className="text-[10px] text-text-tertiary mb-4">across {countriesWithData} {countriesWithData === 1 ? "country" : "countries"}</p>
                  )}
                  {countriesWithData === 0 && <p className="text-[10px] text-text-tertiary mb-4">across 12 countries</p>}
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary group-hover:gap-2 transition-all">
                    Compare now <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  LATEST ARTICLES / INSURANCE GUIDES                               */}
      {/* ================================================================= */}
      {articles.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <span className="inline-block text-[11px] font-bold text-primary uppercase tracking-[0.15em] mb-3">
                  Learn
                </span>
                <h2 className="text-[32px] sm:text-[40px] font-extrabold text-text-primary tracking-[-0.03em]">
                  Insurance Guides
                </h2>
                <p className="mt-3 text-[15px] text-text-secondary max-w-md">
                  Expert articles to help you understand insurance before you compare
                </p>
              </div>
              <Link
                href="/learn"
                className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:gap-2.5 transition-all"
              >
                View all guides <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/learn/${article.slug}`}
                  className="group card-premium bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/10 transition-all duration-300"
                >
                  {/* Category color stripe */}
                  <div className={`h-1 ${
                    article.category === "Health" ? "bg-gradient-to-r from-rose-500 to-pink-500" :
                    article.category === "Term Life" ? "bg-gradient-to-r from-indigo-500 to-violet-500" :
                    article.category === "Motor" ? "bg-gradient-to-r from-emerald-500 to-teal-500" :
                    article.category === "Travel" ? "bg-gradient-to-r from-amber-500 to-orange-500" :
                    "bg-gradient-to-r from-gray-400 to-gray-500"
                  }`} />
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${categoryColors[article.category] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-text-primary group-hover:text-primary transition-colors leading-snug mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-[12.5px] text-text-tertiary leading-relaxed line-clamp-2 mb-4">
                      {article.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary group-hover:gap-2 transition-all">
                      Read guide <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <div className="sm:hidden mt-8 text-center">
              <Link
                href="/learn"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary"
              >
                View all guides <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/*  INSURER MARQUEE                                                  */}
      {/* ================================================================= */}
      <section className="py-12 border-y border-border-light bg-surface-sunken/50">
        <div className="text-center mb-6">
          <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-[0.15em]">
            Covering the world&apos;s leading insurers
          </p>
        </div>
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-surface-sunken/50 to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-surface-sunken/50 to-transparent z-10" />
          <div className="flex animate-marquee whitespace-nowrap">
            {[...getAllInsurers(), ...getAllInsurers()].map((ins, i) => (
              <span key={`${ins.slug}-${i}`} className="mx-6 text-[14px] font-semibold text-text-tertiary/60 hover:text-text-secondary transition-colors cursor-default">
                {ins.shortName}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  TRUST PILLARS                                                    */}
      {/* ================================================================= */}
      <section className="py-20 sm:py-28 bg-surface-dark relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] blob bg-primary/5" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] blob bg-accent/5" />

        <div className="relative mx-auto max-w-[1320px] px-5 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block text-[11px] font-bold text-accent uppercase tracking-[0.15em] mb-3">
              Why World Best Insurer
            </span>
            <h2 className="text-[32px] sm:text-[40px] font-extrabold text-white tracking-[-0.03em]">
              Built on trust
            </h2>
            <p className="mt-3 text-[15px] text-white/50 max-w-md mx-auto">
              Every design choice is guided by transparency and data integrity
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {[
              { icon: Eye, title: "Source transparency", desc: "Every data point links to its official source. See exactly where information comes from.", accent: "text-blue-400" },
              { icon: TrendingUp, title: "Confidence scores", desc: "Each product has a confidence score based on verification level. High, medium, and low \u2014 clearly marked.", accent: "text-violet-400" },
              { icon: RefreshCw, title: "Fresh data", desc: "Automated monitoring detects policy changes across insurers in 12 countries. Stale records are flagged.", accent: "text-emerald-400" },
              { icon: Lock, title: "Compliance first", desc: "Clear disclaimers. No false claims. No best policy guarantees. Built with regulatory compliance per market.", accent: "text-amber-400" },
              { icon: Zap, title: "No hidden agenda", desc: "No commissions influencing rankings. No pay-to-play listings. Just structured comparison data.", accent: "text-rose-400" },
              { icon: BookOpen, title: "Education led", desc: "Guides and articles help you understand insurance before comparing. Knowledge-first approach.", accent: "text-cyan-400" },
            ].map((item) => (
              <div
                key={item.title}
                className="group p-6 rounded-2xl bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.07] hover:border-white/[0.1] transition-all duration-300"
              >
                <item.icon className={`w-5 h-5 ${item.accent} mb-4`} />
                <h3 className="text-[15px] font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-[13px] text-white/40 leading-relaxed group-hover:text-white/55 transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  NEWSLETTER / WAITLIST                                            */}
      {/* ================================================================= */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#7c3aed] to-[#6d28d9] p-10 sm:p-16">
            <div className="absolute inset-0 bg-grid opacity-[0.06]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] blob bg-accent/15" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] blob bg-white/5" />

            <div className="relative text-center max-w-lg mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[11px] font-medium text-white/70 mb-6">
                <Star className="w-3 h-3 text-amber-300" /> Stay Updated
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white tracking-[-0.03em] mb-4">
                Stay Updated
              </h2>
              <p className="text-[15px] text-white/55 mb-3 leading-relaxed">
                Get weekly insurance insights and comparison updates delivered to your inbox.
              </p>
              <p className="text-[12px] text-white/35 mb-8">
                No spam. Unsubscribe anytime.
              </p>
              <WaitlistForm variant="dark" />
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  TRUST SECTION / PARTNER LOGOS                                    */}
      {/* ================================================================= */}
      <section className="py-12 border-t border-border">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-text-tertiary">
              <Database className="w-4 h-4" />
              <p className="text-[12px] font-medium">
                Data sourced from official insurer websites
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 text-[11px] text-text-tertiary">
              <Link href="/methodology" className="underline hover:text-text-secondary transition-colors flex items-center gap-1">
                <FileText className="w-3 h-3" /> Methodology
              </Link>
              <span>&middot;</span>
              <Link href="/disclaimer" className="underline hover:text-text-secondary transition-colors">
                Disclaimer
              </Link>
              <span>&middot;</span>
              <Link href="/privacy" className="underline hover:text-text-secondary transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  BOTTOM DISCLAIMER                                                */}
      {/* ================================================================= */}
      <section className="border-t border-border py-8">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
          <p className="text-[11px] text-center text-text-tertiary leading-[1.8] max-w-3xl mx-auto">
            World Best Insurer is an informational platform. We do not sell or distribute insurance.
            All data is from public sources for educational comparison.{" "}
            <Link href="/disclaimer" className="underline hover:text-text-secondary transition-colors">
              Disclaimer
            </Link>
            {" "}&middot;{" "}
            <Link href="/methodology" className="underline hover:text-text-secondary transition-colors">
              Methodology
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
