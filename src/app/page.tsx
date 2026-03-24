import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Shield,
  TrendingUp,
  Eye,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  Database,
  Lock,
  Zap,
  Heart,
  Car,
  Plane,
  ChevronRight,
  Star,
  Globe,
  MapPin,
} from "lucide-react";
import WaitlistForm from "@/components/WaitlistForm";
import { categories, getAllProducts, getAllInsurers } from "@/lib/data";
import { countries as allCountries } from "@/lib/countries";
import { FAQSchema, BreadcrumbSchema } from "@/components/StructuredData";

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

export default function HomePage() {
  const totalProducts = getAllProducts().length;
  const totalInsurers = getAllInsurers().length;

  const homeFAQs = [
    {
      q: "What is World Best Insurer and how does it help compare insurance?",
      a: "World Best Insurer is a global insurance comparison platform covering 12 countries. It allows you to compare health, life, motor, and travel insurance plans side-by-side using verified data from official insurer sources. World Best Insurer does not sell insurance — it provides transparent, educational comparison data.",
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
      a: "World Best Insurer supports four insurance categories: Health Insurance, Term Life Insurance, Motor Insurance, and Travel Insurance — across 12 countries including India, US, UK, UAE, Singapore, Canada, Australia, Germany, Saudi Arabia, Japan, South Korea, and Hong Kong.",
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

      {/* ═══════════════ HERO — COUNTRY FIRST ═══════════════ */}
      <section className="relative min-h-[95vh] flex items-center">
        {/* Background */}
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
          <div className="text-center max-w-3xl mx-auto animate-slide-up">
            <h1 className="text-[40px] sm:text-[52px] lg:text-[64px] font-extrabold text-text-primary tracking-[-0.04em] leading-[1.05]">
              Compare insurance
              <br />
              <span className="text-gradient">anywhere in the world.</span>
            </h1>
            <p className="mt-5 text-[16px] sm:text-[18px] text-text-secondary leading-[1.6] max-w-[560px] mx-auto animate-slide-up" style={{animationDelay: "0.1s"}}>
              Select your country to explore and compare insurance plans with
              verified data, transparent methodology, and zero sales pressure.
            </p>
          </div>

          {/* ═══ PRIMARY: COUNTRY GRID ═══ */}
          <div className="mt-12 max-w-5xl mx-auto animate-slide-up" style={{animationDelay: "0.15s"}}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Globe className="w-4 h-4 text-primary" />
              <p className="text-[13px] font-semibold text-text-primary">Choose your country to get started</p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {allCountries.map((c, i) => (
                <Link
                  key={c.code}
                  href={`/${c.code}`}
                  className="group card-premium bg-surface rounded-2xl border border-border p-4 text-center hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                  style={{ animationDelay: `${0.2 + i * 0.03}s` }}
                >
                  <span className="text-[32px] sm:text-[36px] block mb-2 group-hover:scale-110 transition-transform duration-300">
                    {c.flag}
                  </span>
                  <h3 className="text-[12px] sm:text-[13px] font-bold text-text-primary group-hover:text-primary transition-colors leading-tight">
                    {c.name}
                  </h3>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{c.currency.code}</p>
                  <span className="inline-flex items-center gap-0.5 mt-2 text-[10px] font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all">
                    Explore <ChevronRight className="w-2.5 h-2.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-14 flex items-center justify-center gap-8 sm:gap-12 animate-fade-in" style={{animationDelay: "0.35s"}}>
            {[
              { value: "12", label: "Countries" },
              { value: `${totalProducts}+`, label: "Plans tracked" },
              { value: `${totalInsurers}`, label: "Insurers" },
              { value: "Daily", label: "Data checks" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-[24px] sm:text-[28px] font-extrabold text-text-primary tracking-tight leading-none">
                  {s.value}
                </p>
                <p className="text-[10px] sm:text-[11px] text-text-tertiary font-medium mt-1 tracking-wide uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* ═══════════════ QUICK COMPARE BY CATEGORY ═══════════════ */}
      <section className="py-20 sm:py-28">
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
              return (
                <Link
                  key={cat.slug}
                  href={`/compare/${cat.slug}`}
                  className={`group card-premium bg-surface rounded-2xl border border-border p-6 text-center ${categoryGlows[cat.slug]}`}
                >
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${categoryGradients[cat.slug]} flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-[15px] font-bold text-text-primary mb-1">{cat.name}</h3>
                  <p className="text-[12px] text-text-tertiary mb-4">{cat.productCount} plans compared</p>
                  <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary group-hover:gap-2 transition-all">
                    Compare now <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════ INSURER MARQUEE ═══════════════ */}
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

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
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

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto stagger-children">
            {[
              {
                step: "01",
                icon: Database,
                gradient: "from-indigo-500 to-violet-600",
                title: "We collect data",
                desc: "Product features, coverage details, and terms sourced from official insurer pages, brochures, and public policy documents across 12 countries.",
              },
              {
                step: "02",
                icon: CheckCircle2,
                gradient: "from-emerald-500 to-teal-600",
                title: "We verify & score",
                desc: "Every data point gets a confidence score. Verified fields are marked. Unverified data is flagged transparently.",
              },
              {
                step: "03",
                icon: Sparkles,
                gradient: "from-amber-500 to-orange-600",
                title: "You compare clearly",
                desc: "Side-by-side comparisons with transparent methodology. No hidden rankings, no sales pressure, no commission influence.",
              },
            ].map((item) => (
              <div key={item.step} className="card-premium bg-surface rounded-2xl border border-border p-7 relative overflow-hidden">
                <span className="absolute -top-4 -right-2 text-[80px] font-black text-surface-sunken leading-none select-none pointer-events-none">
                  {item.step}
                </span>
                <div className="relative">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-md mb-5`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-[17px] font-bold text-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[13.5px] text-text-tertiary leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TRUST PILLARS ═══════════════ */}
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
              { icon: TrendingUp, title: "Confidence scores", desc: "Each product has a confidence score based on verification level. High, medium, and low — clearly marked.", accent: "text-violet-400" },
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

      {/* ═══════════════ CTA / WAITLIST ═══════════════ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[1320px] px-5 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[#7c3aed] to-[#6d28d9] p-10 sm:p-16">
            <div className="absolute inset-0 bg-grid opacity-[0.06]" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] blob bg-accent/15" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] blob bg-white/5" />

            <div className="relative text-center max-w-lg mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10 text-[11px] font-medium text-white/70 mb-6">
                <Star className="w-3 h-3 text-amber-300" /> Early access
              </div>
              <h2 className="text-[28px] sm:text-[36px] font-extrabold text-white tracking-[-0.03em] mb-4">
                Stay ahead of the curve
              </h2>
              <p className="text-[15px] text-white/55 mb-10 leading-relaxed">
                Get notified when we launch new comparison tools, add insurers,
                or open advisory services.
              </p>
              <WaitlistForm variant="dark" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ BOTTOM DISCLAIMER ═══════════════ */}
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
