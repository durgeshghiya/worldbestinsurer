import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema, JsonLd } from "@/components/StructuredData";
import Section80DCalculator from "./Section80DCalculator";
import { Calculator, Shield, ArrowRight, CheckCircle2, TrendingUp, AlertCircle, FileText, AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Section 80D Tax Deduction Calculator 2026 — Health Insurance Tax Savings",
  description:
    "Calculate your exact income tax deduction under Section 80D of the Income Tax Act. Check limits for self, family, senior citizen parents, preventive health check-ups, and compare Old vs New Tax Regime.",
  keywords: [
    "section 80d calculator",
    "health insurance tax deduction calculator",
    "80d tax deduction limit",
    "80d senior citizen parents limit",
    "preventive health checkup 80d",
    "section 80d new tax regime vs old tax regime",
    "income tax rebate health insurance premium",
  ],
  alternates: {
    canonical: "https://worldbestinsurer.com/tools/section-80d-tax-calculator/",
  },
  openGraph: {
    title: "Section 80D Tax Deduction Calculator 2026 — Health Insurance Tax Savings",
    description:
      "Find out exactly how much tax you save on health insurance premiums for yourself and senior citizen parents under Section 80D. Free, instant, and phone-number-free.",
    url: "https://worldbestinsurer.com/tools/section-80d-tax-calculator/",
    type: "website",
  },
};

export default function Section80DCalculatorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is the maximum deduction allowed under Section 80D?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The maximum deduction allowed under Section 80D is ₹1,00,000 per financial year. This occurs when both the taxpayer (and family) are senior citizens aged 60 or above (eligible for up to ₹50,000) and the taxpayer's parents are also senior citizens aged 60 or above (eligible for an additional ₹50,000). For an individual below 60 with senior citizen parents, the maximum deduction is ₹75,000 (₹25,000 + ₹50,000).",
        },
      },
      {
        "@type": "Question",
        name: "Is Section 80D available under the New Tax Regime (Section 115BAC)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Section 80D deduction is strictly unavailable under the New Tax Regime (Section 115BAC). If you choose the New Tax Regime, your deduction under Section 80D is ₹0. To claim tax deductions on health insurance premiums, you must opt for the Old Tax Regime when filing your Income Tax Return.",
        },
      },
      {
        "@type": "Question",
        name: "What is the limit for preventive health check-up under Section 80D?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "An aggregate deduction of up to ₹5,000 per financial year is permitted for preventive health check-ups for self, spouse, dependent children, and parents. This ₹5,000 limit is included within the overall ₹25,000 or ₹50,000 ceiling under Section 80D, not in addition to it. Notably, preventive health check-up is the only expense under Section 80D allowed to be paid in cash.",
        },
      },
      {
        "@type": "Question",
        name: "Can I pay health insurance premiums in cash and claim Section 80D?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Under Section 80D(2B) of the Income Tax Act, premium payments made by cash are explicitly disqualified from tax deductions. Payments must be made via electronic modes such as Net Banking, UPI, Credit Card, Debit Card, or Bank Cheque/Draft. Only preventive health check-ups up to ₹5,000 are eligible when paid in cash.",
        },
      },
      {
        "@type": "Question",
        name: "Can I claim medical expenses for senior citizen parents who have no health insurance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. Under Section 80D(2)(c), if your senior citizen parents (aged 60 or older) are not covered by any active health insurance policy, you can claim actual medical expenditures incurred on their treatment up to ₹50,000 per financial year. You must preserve diagnostic bills, doctor prescriptions, and pharmacy invoices for verification.",
        },
      },
      {
        "@type": "Question",
        name: "Can I claim GST paid on health insurance under Section 80D?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. The total health insurance premium inclusive of 18% Goods and Services Tax (GST) is eligible for tax deduction under Section 80D, subject to the applicable ₹25,000 or ₹50,000 sub-limits. Your insurer's Section 80D certificate reflects the total gross premium paid.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Section 80D Health Insurance Tax Deduction Calculator",
    url: "https://worldbestinsurer.com/tools/section-80d-tax-calculator/",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Interactive Section 80D calculator computing eligible health insurance tax deductions, senior citizen limits, preventive check-up allowances, and cash savings across tax slabs.",
  };

  return (
    <div className="mx-auto max-w-[1200px] px-5 lg:px-8 py-10">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com/" },
          { name: "Tools", url: "https://worldbestinsurer.com/finance/" },
          {
            name: "Section 80D Tax Calculator",
            url: "https://worldbestinsurer.com/tools/section-80d-tax-calculator/",
          },
        ]}
      />
      <JsonLd data={faqSchema} />
      <JsonLd data={webAppSchema} />

      {/* Header */}
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
          <Calculator className="w-3.5 h-3.5" />
          Interactive Tax Utility · Updated for AY 2025-26 & 2026-27
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
          Section 80D Health Insurance Tax Deduction Calculator
        </h1>
        <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
          Find out exactly how much tax you save on health insurance premiums paid for yourself, your spouse, dependent
          children, and senior citizen parents. Check sub-limits, preventive checkup allowances, and cash savings under
          the Old Tax Regime.
        </p>
      </div>

      {/* Calculator Interactive Widget */}
      <div className="mb-16">
        <Section80DCalculator />
      </div>

      {/* Reference Table & Editorial Analysis */}
      <div className="mt-16 pt-12 border-t border-border space-y-16">
        {/* Section 80D Matrix Table */}
        <section className="space-y-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              Section 80D Deduction Limits Reference Table
            </h2>
            <p className="mt-2 text-sm sm:text-base text-text-secondary leading-relaxed">
              Section 80D of the Indian Income Tax Act, 1961 provides deductions on premiums paid for medical insurance,
              contributions to the Central Government Health Scheme (CGHS), and preventive health check-up expenses.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border bg-surface-sunken/70 text-text-primary font-bold">
                  <th className="py-3.5 px-4 sm:px-6">Family Scenario</th>
                  <th className="py-3.5 px-4 sm:px-6">Self, Spouse & Children</th>
                  <th className="py-3.5 px-4 sm:px-6">Parents Limit</th>
                  <th className="py-3.5 px-4 sm:px-6">Max Total Deduction</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-text-secondary">
                <tr>
                  <td className="py-3 px-4 sm:px-6 font-medium text-text-primary">
                    Self & Parents both below 60 years
                  </td>
                  <td className="py-3 px-4 sm:px-6">₹25,000</td>
                  <td className="py-3 px-4 sm:px-6">₹25,000</td>
                  <td className="py-3 px-4 sm:px-6 font-semibold text-text-primary">₹50,000</td>
                </tr>
                <tr className="bg-surface-sunken/30">
                  <td className="py-3 px-4 sm:px-6 font-medium text-text-primary">
                    Self below 60, Parents Senior Citizens (60+)
                  </td>
                  <td className="py-3 px-4 sm:px-6">₹25,000</td>
                  <td className="py-3 px-4 sm:px-6 text-primary font-semibold">₹50,000</td>
                  <td className="py-3 px-4 sm:px-6 font-semibold text-primary">₹75,000</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 sm:px-6 font-medium text-text-primary">
                    Self & Parents both Senior Citizens (60+)
                  </td>
                  <td className="py-3 px-4 sm:px-6 text-primary font-semibold">₹50,000</td>
                  <td className="py-3 px-4 sm:px-6 text-primary font-semibold">₹50,000</td>
                  <td className="py-3 px-4 sm:px-6 font-bold text-primary">₹1,00,000</td>
                </tr>
                <tr className="bg-surface-sunken/30">
                  <td className="py-3 px-4 sm:px-6 font-medium text-text-primary">
                    Self (Single / Family) only, No Parents
                  </td>
                  <td className="py-3 px-4 sm:px-6">₹25,000</td>
                  <td className="py-3 px-4 sm:px-6">₹0</td>
                  <td className="py-3 px-4 sm:px-6 font-semibold text-text-primary">₹25,000</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4 Critical Rules Every Taxpayer Must Know */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            4 Critical Rules You Must Comply With to Claim 80D
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <div className="flex items-center gap-2.5 text-warning font-bold text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                1. Mode of Payment: Zero Cash Allowed for Premiums
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Under Section 80D(2B), health insurance premiums paid in cash are outright rejected by the Income Tax
                Department. You must pay via digital modes (UPI, credit/debit card, net banking) or account payee cheque.
                The <strong>only exception</strong> is preventive health checkups up to ₹5,000, where cash payment is
                valid under the law.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <div className="flex items-center gap-2.5 text-primary font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                2. Preventive Health Check-Up Cap (₹5,000 Shared)
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Section 80D allows up to ₹5,000 per financial year for routine health checkups (blood tests, lipid
                profiles, full body checkups). Note that this ₹5,000 is <strong>not over and above</strong> the ₹25,000 or
                ₹50,000 ceiling. It is an umbrella sub-limit included inside your primary caps.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <div className="flex items-center gap-2.5 text-primary font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                3. Medical Bills Deduction for Uninsured Senior Parents
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Many senior citizens in India cannot obtain fresh health insurance due to severe pre-existing diseases.
                Under Section 80D(2)(c), if your parents are aged 60+ and have <strong>no insurance policy</strong>, you
                can directly claim their doctor consultation fees, hospitalization costs, and medicines up to ₹50,000.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <div className="flex items-center gap-2.5 text-warning font-bold text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                4. New Tax Regime vs Old Tax Regime Choice
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                The New Tax Regime (Section 115BAC) offers lower baseline tax slabs but removes exemptions under Section
                80D, 80C, and 24(b). If your total deductions across 80C (₹1.5L), 80D (₹75k), and HRA exceed ₹3.75 Lakhs,
                sticking with the Old Tax Regime frequently results in significantly lower net tax.
              </p>
            </div>
          </div>
        </section>

        {/* Comprehensive FAQs Section */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Frequently Asked Questions on Section 80D
          </h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, index) => (
              <div key={index} className="p-5 sm:p-6 rounded-2xl bg-surface border border-border space-y-2">
                <h3 className="font-bold text-text-primary text-base sm:text-lg">{faq.name}</h3>
                <p className="text-text-secondary text-sm sm:text-[15px] leading-relaxed">
                  {faq.acceptedAnswer.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Internal Links to Editorial & Related Tools */}
        <section className="p-6 sm:p-8 rounded-2xl bg-surface border border-border space-y-4">
          <h3 className="text-lg font-bold text-text-primary">Related Insurance Financial Guides & Calculators</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs sm:text-sm">
            <Link
              href="/tools/room-rent-deduction-calculator"
              className="p-3.5 rounded-xl border border-border bg-surface-sunken hover:border-primary/40 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-text-primary">Room Rent Calculator</div>
                <div className="text-[11px] text-text-secondary mt-0.5">Calculate hospital room rent co-pay cuts</div>
              </div>
              <ArrowRight className="w-4 h-4 text-primary shrink-0 ml-2" />
            </Link>

            <Link
              href="/tools/human-life-value-calculator"
              className="p-3.5 rounded-xl border border-border bg-surface-sunken hover:border-primary/40 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-text-primary">HLV Term Calculator</div>
                <div className="text-[11px] text-text-secondary mt-0.5">Calculate pure term life cover needed</div>
              </div>
              <ArrowRight className="w-4 h-4 text-primary shrink-0 ml-2" />
            </Link>

            <Link
              href="/finance/moratorium-period-health-insurance-india-5-year-rule"
              className="p-3.5 rounded-xl border border-border bg-surface-sunken hover:border-primary/40 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-text-primary">Moratorium Period 5-Year Rule</div>
                <div className="text-[11px] text-text-secondary mt-0.5">When claims cannot be rejected</div>
              </div>
              <ArrowRight className="w-4 h-4 text-primary shrink-0 ml-2" />
            </Link>

            <Link
              href="/finance/super-top-up-vs-top-up-health-insurance-deductible-explained"
              className="p-3.5 rounded-xl border border-border bg-surface-sunken hover:border-primary/40 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-text-primary">Super Top-up vs Top-up</div>
                <div className="text-[11px] text-text-secondary mt-0.5">How aggregate deductibles work</div>
              </div>
              <ArrowRight className="w-4 h-4 text-primary shrink-0 ml-2" />
            </Link>

            <Link
              href="/finance/copay-in-health-insurance-meaning-calculation-zones"
              className="p-3.5 rounded-xl border border-border bg-surface-sunken hover:border-primary/40 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-text-primary">Co-pay & Zonal Pricing</div>
                <div className="text-[11px] text-text-secondary mt-0.5">Tier 1 vs Tier 2 deductions</div>
              </div>
              <ArrowRight className="w-4 h-4 text-primary shrink-0 ml-2" />
            </Link>

            <Link
              href="/learn/term-insurance-section-80c-tax-benefit"
              className="p-3.5 rounded-xl border border-border bg-surface-sunken hover:border-primary/40 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-text-primary">Section 80C Life Insurance</div>
                <div className="text-[11px] text-text-secondary mt-0.5">Term life premium tax deductions</div>
              </div>
              <ArrowRight className="w-4 h-4 text-primary shrink-0 ml-2" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
