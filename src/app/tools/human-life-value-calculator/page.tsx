import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema, JsonLd } from "@/components/StructuredData";
import HumanLifeValueCalculator from "./HumanLifeValueCalculator";
import { Calculator, Shield, ArrowRight, CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Human Life Value (HLV) & Term Insurance Calculator — World Best Insurer",
  description:
    "Calculate the exact term life insurance cover your family needs. Uses the Needs-Based and Income Replacement methods to account for inflation, loans, and education goals.",
  keywords: [
    "human life value calculator",
    "term insurance calculator",
    "how much term insurance do I need",
    "HLV calculation life insurance",
    "term life sum assured calculator India",
    "life insurance coverage calculator",
  ],
  alternates: {
    canonical: "https://worldbestinsurer.com/tools/human-life-value-calculator/",
  },
  openGraph: {
    title: "Human Life Value (HLV) & Term Insurance Calculator — World Best Insurer",
    description:
      "Find out the exact term insurance sum assured your family needs to clear debts and maintain their lifestyle. Free, instant, and phone-number-free.",
    url: "https://worldbestinsurer.com/tools/human-life-value-calculator/",
    type: "website",
  },
};

export default function HumanLifeValueCalculatorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Human Life Value (HLV) in term insurance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Human Life Value (HLV) is a financial concept created by Dr. Solomon S. Huebner that measures the present monetary value of the future earnings and economic support an individual provides to their dependents. It determines the minimum amount of term life insurance required to ensure the family's standard of living is unaffected in the event of premature death.",
        },
      },
      {
        "@type": "Question",
        name: "Why does the '10 times annual income' rule of thumb fail?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The '10x income' rule is an arbitrary shortcut that ignores outstanding liabilities and future milestones. For instance, if an individual earning ₹15 lakh per year buys a ₹1.5 crore policy (10x), but holds a ₹1 crore home loan and has two young children needing ₹50 lakh for college, the entire insurance payout is wiped out by debt and tuition, leaving zero funds for daily living expenses.",
        },
      },
      {
        "@type": "Question",
        name: "How much term insurance cover should I buy?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A safe term insurance cover should equal: (Present Value of 20 to 25 years of family living expenses) + (Total outstanding loans and liabilities) + (Future children's college and wedding goals) - (Existing liquid investments). In practice, most Indian middle-class earning professionals require between ₹1.5 Crore to ₹3 Crore of pure term cover.",
        },
      },
      {
        "@type": "Question",
        name: "Should I buy term insurance up to age 85 or 100?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Term insurance is meant for income replacement and debt protection during your working years. By age 60 or 65, your children are financially independent, mortgages are paid off, and you have accumulated retirement savings. Extending term cover to age 85 or 100 costs 2x to 3x more premium for coverage you no longer need.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Human Life Value (HLV) & Term Insurance Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    url: "https://worldbestinsurer.com/tools/human-life-value-calculator/",
    description:
      "Interactive actuarial calculator to compute Human Life Value and recommended term life insurance coverage based on debts, inflation, and family expenses.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    creator: {
      "@type": "Organization",
      name: "World Best Insurer",
      url: "https://worldbestinsurer.com",
    },
  };

  return (
    <div className="mx-auto max-w-[1240px] px-5 lg:px-8 py-10">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com/" },
          { name: "Tools", url: "https://worldbestinsurer.com/tools/human-life-value-calculator/" },
          { name: "Human Life Value Calculator", url: "https://worldbestinsurer.com/tools/human-life-value-calculator/" },
        ]}
      />
      <JsonLd data={faqSchema} />
      <JsonLd data={webAppSchema} />

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
          <Calculator className="w-3.5 h-3.5" />
          Actuarial Needs Analysis · Zero Phone Numbers Required
        </div>
        <h1 className="text-[28px] sm:text-[40px] font-extrabold tracking-[-0.03em] text-text-primary">
          Human Life Value (HLV) & Term Insurance Calculator
        </h1>
        <p className="mt-3 max-w-[76ch] text-[15px] sm:text-[16px] leading-[1.7] text-text-secondary">
          Find out the exact term life insurance sum assured your family needs to clear outstanding home loans,
          guarantee children's education, and replace living expenses until retirement.
        </p>
      </div>

      {/* Calculator Interactive Client Component */}
      <div className="mb-14">
        <HumanLifeValueCalculator />
      </div>

      {/* Educational Deep Dive */}
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm space-y-8 max-w-[900px] mx-auto">
        <section className="space-y-4">
          <h2 className="text-[22px] font-bold text-text-primary tracking-tight">
            The Two Actuarial Methods to Calculate Life Insurance Needs
          </h2>
          <p className="text-[14.5px] leading-[1.8] text-text-secondary">
            Financial planners use two primary mathematical frameworks to evaluate how much insurance a breadwinner requires:
          </p>

          <div className="grid gap-4 sm:grid-cols-2 pt-2">
            <div className="p-5 rounded-xl border border-border bg-surface-sunken">
              <h3 className="font-bold text-[15px] text-text-primary mb-2">
                1. Needs-Based Method (Recommended)
              </h3>
              <p className="text-[13px] leading-[1.7] text-text-secondary">
                Calculates the actual financial deficit your family would face. It adds the present value of future household living expenses
                plus all outstanding debts (mortgages, car loans) plus long-term milestone goals (college tuition), and subtracts your
                existing liquid savings and active policies.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-border bg-surface-sunken">
              <h3 className="font-bold text-[15px] text-text-primary mb-2">
                2. Income Replacement Method
              </h3>
              <p className="text-[13px] leading-[1.7] text-text-secondary">
                Measures the capital sum required such that, when invested in low-risk fixed income assets (yielding inflation-adjusted returns),
                the annual interest generated replaces your net take-home salary every year until your planned retirement age.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 pt-6 border-t border-border-light">
          <h2 className="text-[20px] font-bold text-text-primary tracking-tight">
            Why the "10x Income" Rule Leaves Families Underinsured
          </h2>
          <p className="text-[14.5px] leading-[1.8] text-text-secondary">
            Aggregators and agents often tell buyers: <em>"Just take 10 times your annual salary."</em>
            This shortcut fails because debt does not scale with salary. A 30-year-old earning ₹12 lakh with an ₹80 lakh home loan
            who takes a ₹1.2 crore policy (10x) leaves their family with only ₹40 lakh after the bank repossesses the loan balance.
            ₹40 lakh cannot generate enough interest to feed a family and pay school fees for 25 years.
          </p>
        </section>

        <section className="space-y-4 pt-6 border-t border-border-light">
          <h2 className="text-[20px] font-bold text-text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqSchema.mainEntity.map((faq, i) => (
              <div key={i} className="p-4 rounded-xl bg-surface-sunken border border-border-light">
                <h3 className="text-[14px] font-bold text-text-primary mb-1.5">{faq.name}</h3>
                <p className="text-[13px] leading-[1.7] text-text-secondary">{faq.acceptedAnswer.text}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="pt-4 border-t border-border-light flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-[13px] text-text-tertiary">
            Ready to find pure term insurance plans?
          </div>
          <Link
            href="/compare/term-life/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-primary-hover"
          >
            Compare Plans on Claim Settlement Ratio & Features
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
