import type { Metadata } from "next";
import Link from "next/link";
import {
  Calculator,
  Shield,
  Heart,
  Percent,
  Activity,
  Car,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Lock,
} from "lucide-react";
import { BreadcrumbSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Free Insurance Calculators & Actuarial Tools — World Best Insurer",
  description:
    "Actuarial-grade, independent insurance calculators. Calculate room rent proportionate deductions, Human Life Value (HLV), Section 80D tax savings, and compare IRDAI claim settlement ratios. 100% private, no phone number required.",
  alternates: {
    canonical: "https://worldbestinsurer.com/tools/",
  },
};

const tools = [
  {
    slug: "claim-settlement-ratio-tracker",
    title: "IRDAI Claim Settlement & Solvency Explorer",
    badge: "Official Regulatory Data",
    badgeColor: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    icon: Activity,
    iconColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
    desc: "Filter, search, and sort all 34 Life, Health, and General insurers in India by official IRDAI Claim Settlement Ratio (by count and amount), Solvency Ratio, and Cashless Hospital Networks.",
    stats: "34 Insurers · Verified FY 2023-24",
    highlight: "CSR by Amount & Number",
  },
  {
    slug: "room-rent-deduction-calculator",
    title: "Room Rent & Proportionate Deduction Calculator",
    badge: "Essential for Health Claims",
    badgeColor: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    icon: Heart,
    iconColor: "text-rose-400",
    iconBg: "bg-rose-500/10",
    desc: "Calculate the exact out-of-pocket deduction penalty when upgrading hospital rooms. Accurately splits surgeon fees, OT charges, and nursing costs under IRDAI guidelines while exempting medicines and diagnostics.",
    stats: "IRDAI Guidelines Compliant",
    highlight: "Avoid Surprise Hospital Bills",
  },
  {
    slug: "human-life-value-calculator",
    title: "Human Life Value (HLV) Term Insurance Calculator",
    badge: "Needs-Based PV Formula",
    badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: Shield,
    iconColor: "text-amber-400",
    iconBg: "bg-amber-500/10",
    desc: "Replace arbitrary '10x income' rules of thumb with an actuarial present-value calculation accounting for annual household expenses, outstanding liabilities (home/car loans), inflation-adjusted education goals, and liquid investments.",
    stats: "Inflation-Adjusted Actuarial Model",
    highlight: "Complete Family Financial Safety",
  },
  {
    slug: "section-80d-tax-calculator",
    title: "Section 80D Health Insurance Tax Calculator",
    badge: "Old vs New Tax Regime",
    badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    icon: Percent,
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/10",
    desc: "Calculate your exact tax cash savings across slabs (5.2%, 20.8%, 31.2%) for Self/Family, Senior Citizen Parents (up to ₹50,000), and Preventive Health Checkups (₹5,000 shared). Compares Old vs New Tax Regime.",
    stats: "FY 2025-26 & FY 2026-27 Slabs",
    highlight: "Save up to ₹31,200 in Tax",
  },
  {
    slug: "no-claim-bonus-calculator",
    title: "No-Claim Bonus (NCB) Retention vs Claim Payoff Calculator",
    badge: "Motor Insurance Decision Tool",
    badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    icon: Car,
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/10",
    desc: "Decide whether to file a motor insurance claim for minor damage or pay out-of-pocket to retain your 20%–50% NCB renewal discount. Accounts for own damage premium, compulsory deductible, and 3-year cumulative savings.",
    stats: "1-Year to 3-Year Projection",
    highlight: "Never Waste Your 50% NCB",
  },
];

export default function ToolsIndexPage() {
  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com/" },
          { name: "Tools", url: "https://worldbestinsurer.com/tools/" },
        ]}
      />

      {/* Hero */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-border/40 bg-surface-sunken/40">
        <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold uppercase tracking-[0.12em] mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Decision Intelligence
          </div>

          <h1 className="text-[32px] sm:text-[46px] font-extrabold text-text-primary tracking-[-0.03em] leading-[1.15] mb-4 max-w-3xl">
            Free Insurance Calculators &amp; Actuarial Tools
          </h1>

          <p className="text-[16px] text-text-secondary leading-relaxed max-w-2xl mb-8">
            Transparent, actuarial-grade calculators built to help policyholders make data-driven decisions.
            No telemarketing, no login wall, and zero personal phone numbers required.
          </p>

          {/* Value Props */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl">
            <div className="flex items-center gap-2 text-[13px] text-text-secondary">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>100% Free &amp; Ad-Safe</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-text-secondary">
              <Lock className="w-4 h-4 text-indigo-500 shrink-0" />
              <span>No Phone / Email Needed</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-text-secondary">
              <Shield className="w-4 h-4 text-amber-500 shrink-0" />
              <span>IRDAI Formula Compliant</span>
            </div>
            <div className="flex items-center gap-2 text-[13px] text-text-secondary">
              <Clock className="w-4 h-4 text-cyan-500 shrink-0" />
              <span>Instant Local Math</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[22px] font-bold text-text-primary tracking-tight">
                All Interactive Calculators
              </h2>
              <p className="text-[13px] text-text-tertiary mt-1">
                Select a tool to compute your custom figures in seconds.
              </p>
            </div>
            <span className="text-[12px] font-mono text-text-tertiary hidden sm:inline-block">
              {tools.length} Tools Available
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {tools.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}/`}
                className="group p-6 rounded-2xl bg-surface border border-border hover:border-primary/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${t.iconBg}`}>
                      <t.icon className={`w-6 h-6 ${t.iconColor}`} />
                    </div>
                    <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border ${t.badgeColor}`}>
                      {t.badge}
                    </span>
                  </div>

                  <h3 className="text-[18px] font-bold text-text-primary group-hover:text-primary transition-colors mb-2.5 leading-snug">
                    {t.title}
                  </h3>

                  <p className="text-[13px] text-text-secondary leading-relaxed mb-4">
                    {t.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-border-light flex items-center justify-between text-[12px]">
                  <span className="text-text-tertiary font-medium">{t.stats}</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                    Launch Calculator <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Actuarial Disclosure */}
      <section className="py-12 border-t border-border/40 bg-surface-sunken/30">
        <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
          <div className="p-6 rounded-2xl bg-surface border border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-[14px] font-bold text-text-primary mb-1">
                Transparency &amp; Actuarial Methodology
              </h4>
              <p className="text-[12px] text-text-tertiary max-w-2xl leading-relaxed">
                All formulas are strictly verified against the Insurance Regulatory and Development Authority of India (IRDAI) guidelines,
                the Income Tax Act 1961, and published underwriting practices. No sponsored prioritization or affiliate steering is ever applied.
              </p>
            </div>
            <Link
              href="/methodology/"
              className="shrink-0 px-4 py-2 text-[12px] font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
            >
              Read Methodology
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
