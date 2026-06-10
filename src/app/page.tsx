import type { Metadata } from "next";
import Link from "next/link";
import {
  Heart,
  Shield,
  Car,
  Plane,
  ArrowRight,
  ArrowUpRight,
  Database,
  Landmark,
  FileCheck,
  BarChart3,
  BookOpen,
  Building2,
  HelpCircle,
  Newspaper,
  CheckCircle2,
} from "lucide-react";
import { getAllProducts, getAllInsurers } from "@/lib/data";
import { getActiveCountries } from "@/lib/countries";
import { categories } from "@/lib/data";
import {
  BreadcrumbSchema,
  OrganizationSchema,
  WebsiteSchema,
} from "@/components/StructuredData";
import HomeSelector from "@/components/HomeSelector";

export const metadata: Metadata = {
  alternates: { canonical: "https://worldbestinsurer.com" },
};

const CATEGORY_CARDS = [
  {
    slug: "health",
    title: "Health insurance",
    icon: Heart,
    color: "var(--health)",
    light: "var(--health-light)",
    desc: "Hospitalization, day-care, and pre-existing conditions. Health is the deepest category we cover — sum insured, waiting periods, room rent caps, and PED limits are the four numbers that decide claim outcomes.",
  },
  {
    slug: "term-life",
    title: "Term life insurance",
    icon: Shield,
    color: "var(--term)",
    light: "var(--term-light)",
    desc: "Pure protection — a large sum assured for a fixed term at the lowest possible premium. We track claim settlement ratio per insurer and policy term flexibility per plan.",
  },
  {
    slug: "motor",
    title: "Motor insurance",
    icon: Car,
    color: "var(--motor)",
    light: "var(--motor-light)",
    desc: "Third-party and comprehensive cover for cars and two-wheelers. The clauses that matter most are the depreciation schedule, the cashless garage network, and the no-claim bonus structure.",
  },
  {
    slug: "travel",
    title: "Travel insurance",
    icon: Plane,
    color: "var(--travel)",
    light: "var(--travel-light)",
    desc: "Single-trip and multi-trip cover including medical evacuation, trip cancellation, lost baggage, and adventure-sport riders. The medical evacuation limit is the line item to scrutinise.",
  },
];

const PILLARS = [
  {
    href: "/learn",
    icon: BookOpen,
    title: "Learn",
    desc: "Long-form guides on buying, comparing, and claiming. Topics like “Section 80C term insurance tax benefit” and “how to compare health plans”.",
  },
  {
    href: "/reports",
    icon: BarChart3,
    title: "Reports",
    desc: "Annual deep-dives on market structure — currently published for India health, India motor, US health, and global travel.",
  },
  {
    href: "/finance",
    icon: Newspaper,
    title: "Finance",
    desc: "Weekly research on the finance side of insurance — tax deductions, investment-linked products, regulatory mechanics.",
  },
  {
    href: "/insurers",
    icon: Building2,
    title: "Insurers",
    desc: "Profiles of every insurer we track, with claim settlement ratios, contact directories, and headquarter locations.",
  },
  {
    href: "/faq",
    icon: HelpCircle,
    title: "FAQ",
    desc: "The questions we get asked most — about the data, about specific terms, about how to interpret comparison output.",
  },
];

export default function HomePage() {
  const totalProducts = getAllProducts().length;
  const totalInsurers = getAllInsurers().length;
  const activeCountries = getActiveCountries();

  // Per-category counts for the catalog cards.
  const countByCat: Record<string, number> = {};
  for (const p of getAllProducts()) {
    countByCat[p.category] = (countByCat[p.category] ?? 0) + 1;
  }

  // Serialize for client component
  const countryData = activeCountries.map((c) => ({
    code: c.code,
    name: c.name,
    flag: c.flag,
  }));
  const categoryData = categories.map((c) => ({
    slug: c.slug,
    shortName: c.shortName,
  }));

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Structured Data */}
      <BreadcrumbSchema
        items={[{ name: "Home", url: "https://worldbestinsurer.com" }]}
      />
      <OrganizationSchema />
      <WebsiteSchema />

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-40" aria-hidden="true" />
        <div
          className="absolute top-[-25%] left-[8%] w-[560px] h-[560px] blob bg-primary/10"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-[-30%] right-[4%] w-[460px] h-[460px] blob blob-warm"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-[880px] px-5 pt-20 pb-14 sm:pt-28 sm:pb-16 text-center">
          {/* Eyebrow chip */}
          <div className="animate-fade-in inline-flex items-center gap-2 px-4 py-1.5 mb-7 rounded-full glass border border-border text-[11.5px] font-semibold text-text-secondary uppercase tracking-[0.12em]">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-slow" />
            Independent · {activeCountries.length} markets · Zero commissions
          </div>

          <h1 className="animate-slide-up text-[38px] sm:text-[54px] lg:text-[64px] font-extrabold tracking-[-0.035em] leading-[1.05] text-text-primary mb-5">
            Compare insurance plans{" "}
            <span className="text-gradient">worldwide</span>
          </h1>

          <p className="animate-slide-up text-[15px] sm:text-[17px] text-text-secondary mb-10 [animation-delay:0.1s]">
            {totalProducts.toLocaleString()}+ plans
            <span className="mx-2.5 text-border-strong">·</span>
            {totalInsurers}+ insurers
            <span className="mx-2.5 text-border-strong">·</span>
            {activeCountries.length} countries
            <span className="mx-2.5 text-border-strong">·</span>
            verified data
          </p>

          {/* Selector centerpiece */}
          <div className="animate-scale-in flex justify-center [animation-delay:0.15s]">
            <div className="relative">
              <div
                className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-primary/15 via-accent/15 to-primary/15 blur-lg"
                aria-hidden="true"
              />
              <div
                className="relative bg-surface rounded-2xl border border-border p-4 sm:p-5"
                style={{ boxShadow: "var(--shadow-xl)" }}
              >
                <HomeSelector countries={countryData} categories={categoryData} />
              </div>
            </div>
          </div>

          {/* Trust line */}
          <p className="mt-8 text-[12px] text-text-tertiary">
            We do not sell insurance. Data from official sources.{" "}
            <Link href="/methodology" className="underline underline-offset-2 hover:text-primary transition-colors">
              Methodology
            </Link>
          </p>
        </div>
      </section>

      {/* ═══════════ STAT BAND ═══════════ */}
      <section className="border-t border-border-light bg-surface/60">
        <div className="mx-auto max-w-[1080px] px-5 lg:px-8 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-border bg-border">
            {[
              { value: `${totalProducts.toLocaleString()}+`, label: "Plans indexed", Icon: Database },
              { value: `${totalInsurers}+`, label: "Insurers tracked", Icon: Building2 },
              { value: String(activeCountries.length), label: "Country markets", Icon: Landmark },
              { value: "0", label: "Affiliate links", Icon: CheckCircle2 },
            ].map(({ value, label, Icon }) => (
              <div key={label} className="bg-surface px-6 py-6 text-center">
                <Icon className="w-4 h-4 text-accent mx-auto mb-2.5" />
                <p className="text-[26px] sm:text-[30px] font-extrabold tracking-[-0.02em] text-text-primary leading-none">
                  {value}
                </p>
                <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.08em] text-text-tertiary">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 01 — NOT A BROKER ═══════════ */}
      <section className="mx-auto max-w-[1080px] px-5 lg:px-8 py-20 sm:py-24">
        <div className="grid lg:grid-cols-[300px_1fr] gap-10 lg:gap-16">
          <div>
            <p className="text-[11px] font-bold text-accent uppercase tracking-[0.16em] mb-3">
              01 — What this is
            </p>
            <h2 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.025em] text-text-primary leading-[1.15] mb-6">
              A comparison platform — not a broker
            </h2>
            <div className="space-y-2.5">
              {["No affiliate links", "No commissions", "No sales calls"].map((t) => (
                <div key={t} className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span className="text-[13.5px] font-medium text-text-secondary">{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="text-[15px] text-text-secondary leading-[1.8] space-y-5 lg:border-l lg:border-border-light lg:pl-12">
            <p>
              World Best Insurer is an independent insurance research and
              comparison site covering {totalProducts.toLocaleString()}+ plans
              from {totalInsurers}+ insurers across {activeCountries.length}{" "}
              markets — India, the US, UK, UAE, Singapore, Canada, Australia,
              Germany, Saudi Arabia, Japan, South Korea, and Hong Kong. We
              categorise every plan we track into health, term life, motor, and
              travel, and we publish the same comparable data points for each:
              sum insured range, illustrative premium, claim settlement ratio,
              waiting periods, inclusions, exclusions, and source URL.
            </p>
            <p>
              We do not sell insurance. We are not a broker, an agent, or an
              aggregator with a commercial pipe to insurers. There are no
              affiliate links on this site, no per-policy commissions, no
              per-lead payments. The &ldquo;Visit insurer website&rdquo; buttons
              on every product page go straight to the insurer&rsquo;s own
              domain — we are not in that transaction.
            </p>
            <p>
              What we do is read the policy wordings, regulator filings, and
              annual reports, then publish the comparable facts in one place so
              you can do the comparison yourself in under five minutes instead
              of fifty. Every record has a{" "}
              <Link href="/methodology" className="text-primary font-medium hover:underline underline-offset-2">
                confidence score and last-verified date
              </Link>
              ; nothing on this site is a guess.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ 02 — CATALOG ═══════════ */}
      <section className="border-t border-border-light bg-surface-sunken/50">
        <div className="mx-auto max-w-[1080px] px-5 lg:px-8 py-20 sm:py-24">
          <div className="max-w-[640px] mb-12">
            <p className="text-[11px] font-bold text-accent uppercase tracking-[0.16em] mb-3">
              02 — Coverage
            </p>
            <h2 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.025em] text-text-primary leading-[1.15] mb-4">
              What&rsquo;s in the catalog
            </h2>
            <p className="text-[15px] text-text-secondary leading-[1.75]">
              The four categories below cover the insurance lines an individual
              household actually buys. Click into one to see the live
              comparison table.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5 stagger-children">
            {CATEGORY_CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <Link
                  key={c.slug}
                  href={`/compare/${c.slug}`}
                  className="group card-premium relative bg-surface rounded-2xl border border-border p-7 transition-all"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{ background: c.light }}
                    >
                      <Icon className="w-6 h-6" style={{ color: c.color }} />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-surface-sunken text-text-tertiary">
                      {countByCat[c.slug] ?? 0} plans
                    </span>
                  </div>
                  <h3 className="text-[17px] font-bold text-text-primary tracking-[-0.01em] mb-2 group-hover:text-primary transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-[13.5px] text-text-secondary leading-[1.7] mb-5">
                    {c.desc}
                  </p>
                  <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary">
                    Compare plans
                    <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ 03 — DATA SOURCING (dark band) ═══════════ */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--surface-dark)" }}
      >
        <div className="absolute inset-0 bg-grid-dense opacity-[0.07]" aria-hidden="true" />
        <div
          className="absolute top-[-40%] right-[10%] w-[480px] h-[480px] blob blob-cool"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-[1080px] px-5 lg:px-8 py-20 sm:py-24">
          <div className="max-w-[640px] mb-12">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-3" style={{ color: "var(--accent-muted)" }}>
              03 — Trust
            </p>
            <h2 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.025em] text-white leading-[1.15] mb-4">
              How we source the data
            </h2>
          </div>

          {/* Source pipeline */}
          <div className="grid sm:grid-cols-3 gap-4 mb-12 stagger-children">
            {[
              {
                Icon: Landmark,
                title: "Regulator filings",
                desc: "IRDAI, NAIC, FCA, APRA, MAS, BaFin and equivalents — the highest-trust source for claim ratios and solvency.",
              },
              {
                Icon: FileCheck,
                title: "Policy wordings",
                desc: "The insurer's own published wordings, brochures, and rate cards — the contract language itself.",
              },
              {
                Icon: BarChart3,
                title: "Annual reports",
                desc: "Insurer financials for claim settlement ratios and financial-health metrics, cross-checked annually.",
              },
            ].map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6"
              >
                <Icon className="w-5 h-5 mb-4" style={{ color: "var(--accent-muted)" }} />
                <h3 className="text-[15px] font-bold text-white mb-2">{title}</h3>
                <p className="text-[13px] leading-[1.7] text-white/60">{desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-[760px] text-[14.5px] leading-[1.8] text-white/70 space-y-5">
            <p>
              Three primary sources, ranked by trust: regulator filings (IRDAI
              in India, NAIC in the US, APRA in Australia, MAS in Singapore,
              and the equivalents in our other markets); the insurer&rsquo;s
              own published policy wordings, brochures, and rate cards; and
              insurer annual reports for claim settlement ratios and financial
              health metrics. We do not source from third-party aggregators,
              secondary blogs, or sales material.
            </p>
            <p>
              Each data record carries a confidence score (high / medium /
              low) reflecting whether all relevant fields were verified
              against primary sources within the last ninety days. Records
              that age past that window get flagged for re-verification; you
              can see the &ldquo;Last verified&rdquo; date on every product
              page. We are not perfect — when we find an error we correct it
              and bump the verification timestamp, but we recommend you treat
              every illustrative premium as exactly that, illustrative, and
              confirm the rate that applies to your profile directly with the
              insurer.
            </p>
            <p>
              For a longer write-up of how we collect, verify, and publish
              data, read our{" "}
              <Link
                href="/methodology"
                className="font-medium underline underline-offset-2 hover:text-white transition-colors"
                style={{ color: "var(--accent-muted)" }}
              >
                methodology page
              </Link>
              . For the disclosures we are required to publish under each
              regulator, see the{" "}
              <Link
                href="/disclaimer"
                className="font-medium underline underline-offset-2 hover:text-white transition-colors"
                style={{ color: "var(--accent-muted)" }}
              >
                disclaimer
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ 04 — EDITORIAL PILLARS ═══════════ */}
      <section className="mx-auto max-w-[1080px] px-5 lg:px-8 py-20 sm:py-24">
        <div className="max-w-[640px] mb-12">
          <p className="text-[11px] font-bold text-accent uppercase tracking-[0.16em] mb-3">
            04 — Go deeper
          </p>
          <h2 className="text-[26px] sm:text-[32px] font-bold tracking-[-0.025em] text-text-primary leading-[1.15] mb-4">
            Beyond the comparison tables
          </h2>
          <p className="text-[15px] text-text-secondary leading-[1.75]">
            Comparison tables are the starting point. The harder questions —
            what tax deduction applies to which premium, whether a longer
            pre-existing waiting period is worth a smaller premium, which
            insurer&rsquo;s claim record is genuinely reliable — sit in our
            editorial sections.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {PILLARS.map(({ href, icon: Icon, title, desc }) => (
            <Link
              key={href}
              href={href}
              className="group relative bg-surface rounded-2xl border border-border p-6 hover:border-primary/25 transition-all duration-300 hover:-translate-y-0.5"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-[15px] font-bold text-text-primary mb-1.5 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-[13px] text-text-secondary leading-[1.65]">{desc}</p>
            </Link>
          ))}

          {/* CTA tile to round out the grid */}
          <Link
            href="/compare/health"
            className="group relative rounded-2xl p-6 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
            style={{ background: "var(--surface-dark)", boxShadow: "var(--shadow-lg)" }}
          >
            <div className="absolute inset-0 bg-grid-dense opacity-[0.08]" aria-hidden="true" />
            <div className="relative">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: "var(--accent-muted)" }}>
                Ready?
              </p>
              <h3 className="text-[17px] font-bold text-white leading-snug">
                Start comparing plans now
              </h3>
            </div>
            <span className="relative inline-flex items-center gap-1.5 text-[13px] font-semibold text-white mt-6">
              Open the comparison table
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* ═══════════ COMPLIANCE LINE ═══════════ */}
      <section className="border-t border-border-light">
        <div className="mx-auto max-w-[760px] px-5 py-10 text-center">
          <p className="text-[12px] text-text-tertiary leading-relaxed">
            World Best Insurer is an independent informational platform. We do
            not sell, distribute, or advise on insurance products.
          </p>
          <p className="text-[11.5px] text-text-tertiary mt-2">
            <Link href="/methodology" className="underline underline-offset-2 hover:text-primary transition-colors">
              Methodology
            </Link>
            {" "}&middot;{" "}
            <Link href="/disclaimer" className="underline underline-offset-2 hover:text-primary transition-colors">
              Disclaimer
            </Link>
            {" "}&middot;{" "}
            <Link href="/privacy-policy" className="underline underline-offset-2 hover:text-primary transition-colors">
              Privacy
            </Link>
            {" "}&middot;{" "}
            <Link href="/contact" className="underline underline-offset-2 hover:text-primary transition-colors">
              Contact
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}
