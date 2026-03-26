import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Shield,
  Heart,
  Car,
  Plane,
  ChevronDown,
  ChevronRight,
  Clock,
  Globe,
  Coins,
  Cpu,
  FileText,
  Database,
} from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";
import { categories, getAllProducts, getProductsByCategory } from "@/lib/data";
import { countries as allCountries, getActiveCountries } from "@/lib/countries";
import {
  FAQSchema,
  BreadcrumbSchema,
  OrganizationSchema,
  WebsiteSchema,
} from "@/components/StructuredData";
import { getArticles } from "@/lib/generators";

import HeroSearch from "@/components/HeroSearch";
import FloatingParticles from "@/components/immersive/FloatingParticles";
import InsuranceLands from "@/components/immersive/InsuranceLands";
import QuestJourney from "@/components/immersive/QuestJourney";
import RewardBadges from "@/components/immersive/RewardBadges";
import ScrollReveal from "@/components/immersive/ScrollReveal";
import CounterAnimation from "@/components/immersive/CounterAnimation";
import InsuranceMiniGames from "@/components/immersive/InsuranceMiniGames";

/* ─── category helpers ─── */
const categoryIcons: Record<string, typeof Heart> = {
  health: Heart,
  "term-life": Shield,
  motor: Car,
  travel: Plane,
};

const categoryGlowColors: Record<string, string> = {
  health: "#c44058",
  "term-life": "#2d3a8c",
  motor: "#2d8f6f",
  travel: "#c47d2e",
};

const categoryGradients: Record<string, string> = {
  health: "from-[#c44058] to-[#e8607a]",
  "term-life": "from-[#2d3a8c] to-[#4f5cbf]",
  motor: "from-[#2d8f6f] to-[#3bb88e]",
  travel: "from-[#c47d2e] to-[#e09a4a]",
};

const categoryColors: Record<string, string> = {
  Health: "bg-[#c44058]",
  "Term Life": "bg-[#2d3a8c]",
  Motor: "bg-[#2d8f6f]",
  Travel: "bg-[#c47d2e]",
  General: "bg-gray-500",
};

/* ─── FAQ data ─── */
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

/* ─── page component ─── */
export default function HomePage() {
  const totalProducts = getAllProducts().length;
  const activeCountries = getActiveCountries();
  const articles = getArticles().slice(0, 6);

  return (
    <div className="overflow-hidden">
      {/* Structured Data */}
      <BreadcrumbSchema
        items={[{ name: "Home", url: "https://worldbestinsurer.com" }]}
      />
      <FAQSchema questions={homeFAQs} />
      <OrganizationSchema />
      <WebsiteSchema />

      {/* ================================================================= */}
      {/*  SECTION 1: HERO — "Welcome to Insurance Wonderland"              */}
      {/* ================================================================= */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Dark gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--surface-dark,#0f1129)] via-[#141836] to-[var(--primary,#2d3a8c)]" />

        {/* Radial glow accents */}
        <div className="absolute top-[15%] left-[20%] w-[500px] h-[500px] rounded-full bg-[#2d3a8c]/20 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full bg-[#c47d2e]/15 blur-[100px]" />
        <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#7c3aed]/10 blur-[140px]" />

        {/* Floating particles background */}
        <FloatingParticles className="absolute inset-0 z-0" />

        <div className="relative z-10 mx-auto max-w-[1320px] px-5 lg:px-8 text-center py-20">
          {/* Sparkle badge */}
          <div className="mb-8 animate-fade-in">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.06] border border-white/[0.1] text-[12px] font-medium text-white/70 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c47d2e] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c47d2e]" />
              </span>
              Welcome to Insurance Wonderland
            </span>
          </div>

          {/* Massive headline with text-gradient animation */}
          <h1 className="text-[48px] sm:text-[64px] lg:text-[84px] font-extrabold tracking-[-0.04em] leading-[1.0] mb-6 animate-slide-up">
            <span
              className="inline-block bg-clip-text text-transparent animate-gradient-shift"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #ffffff 0%, #c47d2e 25%, #ffffff 50%, #2d8f6f 75%, #ffffff 100%)",
                backgroundSize: "300% 300%",
              }}
            >
              Insurance, Reimagined.
            </span>
          </h1>

          {/* Subline */}
          <p
            className="text-[17px] sm:text-[20px] text-white/60 leading-relaxed max-w-[640px] mx-auto mb-12 animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            Explore, compare, and discover the perfect coverage across 12
            countries.
          </p>

          {/* ── Hero Search Bar ── */}
          <div className="animate-slide-up mb-14" style={{ animationDelay: "0.15s" }}>
            <HeroSearch />
          </div>

          {/* 4 glowing category buttons */}
          <div
            className="flex items-center justify-center gap-4 flex-wrap mb-16 animate-slide-up"
            style={{ animationDelay: "0.25s" }}
          >
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.slug] ?? Shield;
              const glowColor = categoryGlowColors[cat.slug] ?? "#2d3a8c";
              return (
                <Link
                  key={cat.slug}
                  href={`/compare/${cat.slug}`}
                  className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-2xl bg-white/[0.06] border border-white/[0.1] backdrop-blur-sm hover:bg-white/[0.12] transition-all duration-300"
                  style={{
                    boxShadow: `0 0 0px ${glowColor}00`,
                  }}
                >
                  {/* Animated glow ring */}
                  <span
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-slow"
                    style={{
                      boxShadow: `0 0 30px ${glowColor}40, inset 0 0 30px ${glowColor}10`,
                    }}
                  />
                  <span
                    className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br shadow-lg"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${glowColor}, ${glowColor}cc)`,
                    }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </span>
                  <span className="relative text-[14px] sm:text-[15px] font-bold text-white group-hover:text-white transition-colors">
                    {cat.shortName}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Trust stat row */}
          <div
            className="flex items-center justify-center gap-8 sm:gap-12 animate-fade-in"
            style={{ animationDelay: "0.35s" }}
          >
            {[
              { value: `${totalProducts}+`, label: "Plans" },
              { value: "200+", label: "Insurers" },
              { value: "12", label: "Countries" },
              { value: "24/7", label: "AI Updates" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[22px] sm:text-[28px] font-extrabold text-white tracking-tight leading-none">
                  {s.value}
                </p>
                <p className="text-[10px] sm:text-[11px] text-white/40 font-semibold tracking-widest uppercase mt-1">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Animated scroll indicator — bouncing chevron */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
          <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] text-white/30 font-medium uppercase tracking-widest">
              Scroll
            </span>
            <ChevronDown className="w-5 h-5 text-white/40" />
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--background,#ffffff)] to-transparent z-10" />
      </section>

      {/* ================================================================= */}
      {/*  SECTION 2: INSURANCE LANDS — "Explore Our Worlds"                */}
      {/* ================================================================= */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-block text-[11px] font-bold text-[var(--primary,#2d3a8c)] uppercase tracking-[0.15em] mb-3">
                Explore Our Worlds
              </span>
              <h2 className="text-[32px] sm:text-[44px] font-extrabold text-text-primary tracking-[-0.03em]">
                Choose Your Adventure{" "}
                <span className="inline-block animate-pulse-slow">&#10024;</span>
              </h2>
              <p className="mt-3 text-[15px] text-text-secondary max-w-lg mx-auto">
                Four realms of protection await. Each land offers a unique
                world of coverage options to explore.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <InsuranceLands />
          </ScrollReveal>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  SECTION 3: LIVE STATS — "The Numbers Speak"                      */}
      {/* ================================================================= */}
      <section className="relative py-20 sm:py-28 bg-[var(--surface-dark,#0f1129)] overflow-hidden">
        {/* Floating particles */}
        <FloatingParticles className="absolute inset-0 z-0 opacity-40" />

        <div className="relative z-10 mx-auto max-w-[1320px] px-5 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[11px] font-bold text-[var(--accent,#c47d2e)] uppercase tracking-[0.15em] mb-3">
                Live Stats
              </span>
              <h2 className="text-[32px] sm:text-[44px] font-extrabold text-white tracking-[-0.03em]">
                The Numbers Speak
              </h2>
              <p className="mt-3 text-[15px] text-white/50 max-w-md mx-auto">
                Real-time data powering the world&apos;s most comprehensive
                insurance comparison engine
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {[
                { value: 500, suffix: "+", label: "Plans Compared", delay: 0 },
                {
                  value: 200,
                  suffix: "+",
                  label: "Insurers Tracked",
                  delay: 0.1,
                },
                { value: 12, suffix: "", label: "Countries Covered", delay: 0.2 },
                {
                  value: 24,
                  suffix: "/7",
                  label: "AI-Powered Updates",
                  delay: 0.3,
                },
              ].map((stat) => (
                <div key={stat.label} className="text-center group">
                  <div className="mb-3">
                    <CounterAnimation
                      target={stat.value}
                      suffix={stat.suffix}
                      className="text-[42px] sm:text-[56px] font-extrabold text-white tracking-tight leading-none"
                    />
                  </div>
                  {/* Glowing underline */}
                  <div className="w-12 h-1 rounded-full bg-gradient-to-r from-[var(--accent,#c47d2e)] to-[#e09a4a] mx-auto mb-3 group-hover:w-20 transition-all duration-500" />
                  <p className="text-[12px] sm:text-[13px] text-white/50 font-semibold uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  SECTION 4: QUEST — "Begin Your Quest"                            */}
      {/* ================================================================= */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Background gradient with subtle pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--background,#ffffff)] via-[#f8f6f3] to-[var(--background,#ffffff)]" />
        <div className="absolute inset-0 bg-grid opacity-[0.03]" />

        <div className="relative z-10 mx-auto max-w-[1320px] px-5 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-block text-[11px] font-bold text-[var(--primary,#2d3a8c)] uppercase tracking-[0.15em] mb-3">
                Begin Your Quest
              </span>
              <h2 className="text-[32px] sm:text-[44px] font-extrabold text-text-primary tracking-[-0.03em]">
                Find Your Perfect Shield{" "}
                <span className="inline-block">&#128737;&#65039;</span>
              </h2>
              <p className="mt-3 text-[15px] text-text-secondary max-w-lg mx-auto">
                Answer a few questions and we&apos;ll guide you to the ideal
                coverage for your journey ahead.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <QuestJourney />
          </ScrollReveal>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  SECTION 5: COUNTRY CAROUSEL — "Travel the Globe"                 */}
      {/* ================================================================= */}
      <section className="py-20 sm:py-28 overflow-hidden">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-block text-[11px] font-bold text-[var(--primary,#2d3a8c)] uppercase tracking-[0.15em] mb-3">
                Global Coverage
              </span>
              <h2 className="text-[32px] sm:text-[44px] font-extrabold text-text-primary tracking-[-0.03em]">
                Travel the Globe{" "}
                <span className="inline-block">&#127758;</span>
              </h2>
              <p className="mt-3 text-[15px] text-text-secondary max-w-md mx-auto">
                Insurance insights from 12 major markets around the world
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* Marquee container — full width */}
        <ScrollReveal>
          <div className="relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-r from-[var(--background,#ffffff)] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-32 bg-gradient-to-l from-[var(--background,#ffffff)] to-transparent z-10 pointer-events-none" />

            {/* Auto-scrolling marquee */}
            <div className="flex animate-marquee whitespace-nowrap">
              {[...allCountries, ...allCountries].map((c, i) => {
                const countryProducts = getAllProducts(c.code).length;
                return (
                  <Link
                    key={`${c.code}-${i}`}
                    href={`/${c.code}/compare/health/`}
                    className="group inline-flex flex-col items-center gap-3 mx-3 sm:mx-4 px-6 sm:px-8 py-6 sm:py-8 rounded-2xl bg-surface border border-border hover:border-[var(--primary,#2d3a8c)]/30 hover:shadow-xl transition-all duration-300 min-w-[160px] sm:min-w-[200px] whitespace-normal"
                    style={{
                      transform: "perspective(800px) rotateY(0deg)",
                    }}
                  >
                    <span className="text-[48px] sm:text-[56px] group-hover:scale-110 transition-transform duration-300">
                      {c.flag}
                    </span>
                    <h3 className="text-[14px] sm:text-[15px] font-bold text-text-primary group-hover:text-[var(--primary,#2d3a8c)] transition-colors text-center">
                      {c.name}
                    </h3>
                    <p className="text-[11px] text-text-tertiary">
                      {countryProducts > 0
                        ? `${countryProducts} plans`
                        : "Coming soon"}
                    </p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--primary,#2d3a8c)] opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ================================================================= */}
      {/*  SECTION 6: FEATURED ARTICLES — "Knowledge is Power"              */}
      {/* ================================================================= */}
      {articles.length > 0 && (
        <section className="py-20 sm:py-28 bg-surface-sunken/30">
          <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
            <ScrollReveal>
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-14 gap-4">
                <div>
                  <span className="inline-block text-[11px] font-bold text-[var(--primary,#2d3a8c)] uppercase tracking-[0.15em] mb-3">
                    Learn
                  </span>
                  <h2 className="text-[32px] sm:text-[44px] font-extrabold text-text-primary tracking-[-0.03em]">
                    Knowledge is Power{" "}
                    <span className="inline-block">&#128218;</span>
                  </h2>
                  <p className="mt-3 text-[15px] text-text-secondary max-w-md">
                    Expert guides to help you navigate the insurance landscape
                  </p>
                </div>
                <Link
                  href="/learn"
                  className="hidden sm:inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--primary,#2d3a8c)] hover:gap-2.5 transition-all"
                >
                  View all guides <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {articles.map((article, idx) => (
                <ScrollReveal key={article.slug}>
                  <Link
                    href={`/learn/${article.slug}`}
                    className="group block bg-surface rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    {/* Gradient border on hover */}
                    <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: "linear-gradient(135deg, var(--primary,#2d3a8c), var(--accent,#c47d2e)) padding-box, linear-gradient(135deg, var(--primary,#2d3a8c), var(--accent,#c47d2e)) border-box",
                        mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                        padding: "2px",
                      }}
                    />

                    {/* Category color stripe */}
                    <div
                      className={`h-1 ${
                        categoryColors[article.category] ?? "bg-gray-500"
                      }`}
                    />
                    <div className="p-5 sm:p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span
                          className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full text-white"
                          style={{
                            backgroundColor:
                              article.category === "Health"
                                ? "#c44058"
                                : article.category === "Term Life"
                                ? "#2d3a8c"
                                : article.category === "Motor"
                                ? "#2d8f6f"
                                : article.category === "Travel"
                                ? "#c47d2e"
                                : "#6b7280",
                          }}
                        >
                          {article.category}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
                          <Clock className="w-3 h-3" />
                          {article.readTime}
                        </span>
                      </div>
                      <h3 className="text-[15px] font-bold text-text-primary group-hover:text-[var(--primary,#2d3a8c)] transition-colors leading-snug mb-2 line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-[12.5px] text-text-tertiary leading-relaxed line-clamp-2 mb-4">
                        {article.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[var(--primary,#2d3a8c)] group-hover:gap-2 transition-all">
                        Read Guide <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            <div className="sm:hidden mt-8 text-center">
              <Link
                href="/learn"
                className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[var(--primary,#2d3a8c)]"
              >
                View all guides <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ================================================================= */}
      {/*  SECTION 7: WHY US — "Why Adventurers Choose Us"                  */}
      {/* ================================================================= */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-[11px] font-bold text-[var(--primary,#2d3a8c)] uppercase tracking-[0.15em] mb-3">
                Why Us
              </span>
              <h2 className="text-[32px] sm:text-[44px] font-extrabold text-text-primary tracking-[-0.03em]">
                Why Adventurers Choose Us{" "}
                <span className="inline-block">&#9889;</span>
              </h2>
              <p className="mt-3 text-[15px] text-text-secondary max-w-md mx-auto">
                Every design choice is guided by transparency, trust, and
                putting you first
              </p>
            </div>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                title: "100% Transparent",
                desc: "Every data point links to its official source. See exactly where information comes from with confidence scores.",
                color: "#2d3a8c",
                delay: 0,
              },
              {
                icon: Coins,
                title: "Zero Commissions",
                desc: "No commissions influencing rankings. No pay-to-play listings. Just structured, unbiased comparison data.",
                color: "#c47d2e",
                delay: 0.05,
              },
              {
                icon: Cpu,
                title: "AI-Powered",
                desc: "Automated monitoring detects policy changes across insurers in 12 countries. Stale records are flagged instantly.",
                color: "#7c3aed",
                delay: 0.1,
              },
              {
                icon: Globe,
                title: "12 Countries",
                desc: "From India to the US, UK to UAE. Localized insurance data, regulation info, and currency-specific comparisons.",
                color: "#2d8f6f",
                delay: 0.15,
              },
              {
                icon: BookOpen,
                title: "Expert Content",
                desc: "In-depth guides help you understand insurance before comparing. A knowledge-first approach to protection.",
                color: "#c44058",
                delay: 0.2,
              },
              {
                icon: BarChart3,
                title: "Data-Backed",
                desc: "Side-by-side comparisons with verified data. Every field shows confidence scores and links to official sources.",
                color: "#0891b2",
                delay: 0.25,
              },
            ].map((item) => (
              <ScrollReveal key={item.title}>
                <div className="group p-6 rounded-2xl bg-surface border border-border hover:border-[var(--primary,#2d3a8c)]/20 hover:shadow-lg transition-all duration-300 h-full">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                    style={{
                      backgroundColor: `${item.color}15`,
                    }}
                  >
                    <item.icon
                      className="w-6 h-6"
                      style={{ color: item.color }}
                    />
                  </div>
                  <h3 className="text-[15px] font-bold text-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13px] text-text-tertiary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  SECTION 7.5: MINI GAMES — "Learn While You Play"                 */}
      {/* ================================================================= */}
      <section className="relative py-20 sm:py-28 bg-[var(--surface-dark)] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-1/4 w-64 h-64 bg-[var(--accent)] rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-[var(--health)] rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1280px] px-5 lg:px-8">
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/60 mb-4">
                🎮 Interactive Games
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Learn While You <span className="text-[var(--accent)]">Play</span>
              </h2>
              <p className="mt-3 text-white/40 max-w-lg mx-auto text-sm">
                Test your insurance knowledge, calculate your ideal coverage, or solve premium math challenges.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal direction="up" delay={0.2}>
            <InsuranceMiniGames />
          </ScrollReveal>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  SECTION 8: CTA — "Join the Adventure"                            */}
      {/* ================================================================= */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Full-width dark background with animated gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary,#2d3a8c)] via-[#3d2a7c] to-[#1a1145]" />
        <div className="absolute inset-0 bg-grid opacity-[0.04]" />

        {/* Animated gradient blobs */}
        <div className="absolute top-0 right-[10%] w-[500px] h-[500px] rounded-full bg-[#c47d2e]/15 blur-[120px] animate-pulse-slow" />
        <div className="absolute bottom-0 left-[10%] w-[400px] h-[400px] rounded-full bg-[#2d8f6f]/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 mx-auto max-w-[1320px] px-5 lg:px-8">
          <ScrollReveal>
            <div className="text-center max-w-xl mx-auto">
              <h2 className="text-[32px] sm:text-[44px] font-extrabold text-white tracking-[-0.03em] mb-4">
                Ready to find your perfect coverage?
              </h2>
              <p className="text-[16px] text-white/50 mb-10 leading-relaxed">
                Join thousands of smart explorers who compare before they
                commit. Start your quest today.
              </p>

              {/* Waitlist form with glow */}
              <div className="relative max-w-md mx-auto">
                {/* Glow behind form */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[#c47d2e] to-[#2d8f6f] opacity-30 blur-lg" />
                <div className="relative">
                  <WaitlistForm variant="dark" />
                </div>
              </div>

              {/* Trust note */}
              <p className="mt-6 text-[12px] text-white/30 flex items-center justify-center gap-2">
                <Shield className="w-3 h-3" />
                Join 10,000+ explorers. No spam, ever.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ================================================================= */}
      {/*  SECTION 9: FOOTER TRUST BAR                                      */}
      {/* ================================================================= */}
      <section className="py-8 border-t border-border">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
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
                href="/privacy"
                className="underline hover:text-text-secondary transition-colors"
              >
                Privacy
              </Link>
            </div>
            <p className="text-[11px] text-text-tertiary leading-[1.8] max-w-3xl mx-auto pt-2">
              World Best Insurer is an informational platform. We do not sell or
              distribute insurance. All data is from public sources for
              educational comparison.{" "}
              <Link
                href="/disclaimer"
                className="underline hover:text-text-secondary transition-colors"
              >
                Disclaimer
              </Link>
              {" "}&middot;{" "}
              <Link
                href="/methodology"
                className="underline hover:text-text-secondary transition-colors"
              >
                Methodology
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
