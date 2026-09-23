import type { Metadata } from "next";
import Link from "next/link";
import {
  Car,
  Shield,
  HelpCircle,
  FileText,
  AlertCircle,
  ChevronRight,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import NCBCalculator from "./NCBCalculator";
import { BreadcrumbSchema, FAQSchema, JsonLd } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "No Claim Bonus (NCB) Calculator — Should I Claim or Pay Out of Pocket?",
  description:
    "Free No Claim Bonus (NCB) Retention Calculator for car and bike insurance. Calculate whether to file an insurance claim or pay repair costs out of pocket to protect your 20%–50% NCB renewal discount.",
  alternates: {
    canonical: "https://worldbestinsurer.com/tools/no-claim-bonus-calculator/",
  },
};

const faqs = [
  {
    q: "How does the No Claim Bonus (NCB) slab structure work in India?",
    a: "Under the India Motor Tariff (General Regulation 27), NCB is a reward discount on your Own Damage (OD) premium for every claim-free year: 1 year = 20%, 2 years = 25%, 3 years = 35%, 4 years = 45%, and 5 consecutive claim-free years = 50% (maximum cap). If you file even a single claim during a policy year, your NCB resets to 0% at the next renewal unless you have an active NCB Protector add-on.",
  },
  {
    q: "Does NCB apply to the total car insurance premium?",
    a: "No. NCB applies ONLY to the Own Damage (OD) premium component of comprehensive car or bike insurance policies. It does NOT apply to the mandatory Third-Party (TP) liability premium or optional add-ons like roadside assistance or engine protect.",
  },
  {
    q: "What is the Compulsory Deductible in motor insurance claims?",
    a: "The compulsory deductible is a statutory fixed out-of-pocket amount mandated by IRDAI that the policyholder must pay toward any approved repair bill. For four-wheelers with engine capacity ≤ 1,500 cc, it is ₹1,000 per claim. For cars > 1,500 cc, it is ₹2,000 per claim. For two-wheelers, it is ₹100.",
  },
  {
    q: "Can I transfer my NCB when selling my car and buying a new one?",
    a: "Yes! NCB belongs to the vehicle owner (the individual), NOT the car itself. When you sell your old vehicle, ask your insurance company for an NCB Retention Certificate. You can transfer up to 50% NCB discount to your new vehicle's Own Damage premium, saving tens of thousands of rupees.",
  },
  {
    q: "What is an NCB Protector Add-on?",
    a: "An NCB Protector is an optional rider that allows you to make 1 or 2 claims during the policy year without resetting your accumulated No Claim Bonus to 0%. It typically costs around 5% to 10% of your Own Damage premium.",
  },
];

export default function NCBPage() {
  return (
    <div className="min-h-screen bg-background">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com/" },
          { name: "Tools", url: "https://worldbestinsurer.com/tools/" },
          { name: "NCB Calculator", url: "https://worldbestinsurer.com/tools/no-claim-bonus-calculator/" },
        ]}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: "No Claim Bonus (NCB) Retention vs Claim Calculator",
          applicationCategory: "FinanceApplication",
          operatingSystem: "All",
          url: "https://worldbestinsurer.com/tools/no-claim-bonus-calculator/",
          description:
            "Calculate whether making a car or two-wheeler insurance claim is financially beneficial or if paying out of pocket saves more money by protecting your 20%-50% NCB renewal discount.",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "INR",
          },
        }}
      />

      <FAQSchema questions={faqs} />

      {/* Hero Header */}
      <section className="pt-10 pb-8 border-b border-border/40 bg-surface-sunken/30">
        <div className="mx-auto max-w-[1000px] px-5 lg:px-8">
          <nav className="flex items-center gap-1.5 text-[12px] text-text-tertiary mb-6" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/tools/" className="hover:text-primary transition-colors">Tools</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-text-secondary">NCB Calculator</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-[11px] font-bold uppercase tracking-[0.12em] mb-4">
            <Car className="w-3.5 h-3.5" />
            Motor Insurance Actuarial Decision Tool
          </div>

          <h1 className="text-[28px] sm:text-[40px] font-extrabold text-text-primary tracking-[-0.03em] leading-tight mb-3">
            No Claim Bonus (NCB) Calculator
          </h1>

          <p className="text-[15px] sm:text-[16px] text-text-secondary leading-relaxed max-w-2xl">
            Had a minor dent or bumper scratch? Enter your estimated repair cost and policy details below to
            see if making an insurance claim actually costs you more in lost renewal discounts.
          </p>
        </div>
      </section>

      {/* Interactive Tool Container */}
      <section className="py-10">
        <div className="mx-auto max-w-[1000px] px-5 lg:px-8">
          <NCBCalculator />
        </div>
      </section>

      {/* Educational Guide */}
      <section className="py-12 border-t border-border/40 bg-surface-sunken/20">
        <div className="mx-auto max-w-[1000px] px-5 lg:px-8 space-y-12">
          {/* Statutory NCB Ladder */}
          <div>
            <h2 className="text-[22px] font-bold text-text-primary tracking-tight mb-4">
              India Motor Tariff (GR.27) Statutory NCB Slab Progression
            </h2>
            <p className="text-[14px] text-text-secondary leading-relaxed mb-6">
              In India, the No Claim Bonus scale is governed by General Regulation 27 of the India Motor Tariff.
              It applies uniformly across all general insurance companies (HDFC ERGO, ICICI Lombard, Digit, Acko, Bajaj Allianz, New India Assurance, etc.).
            </p>

            <div className="overflow-x-auto rounded-xl border border-border bg-surface">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-surface-sunken border-b border-border text-[11px] font-bold uppercase tracking-wider text-text-tertiary">
                  <tr>
                    <th className="py-3 px-4">Consecutive Claim-Free Period</th>
                    <th className="py-3 px-4">NCB Discount Percentage</th>
                    <th className="py-3 px-4">Status If Claim is Filed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr>
                    <td className="py-3 px-4 font-medium text-text-primary">1 Full Year (Renewal 1)</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">20% discount on OD</td>
                    <td className="py-3 px-4 text-rose-500 font-medium">Resets to 0%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-text-primary">2 Consecutive Years (Renewal 2)</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">25% discount on OD</td>
                    <td className="py-3 px-4 text-rose-500 font-medium">Resets to 0%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-text-primary">3 Consecutive Years (Renewal 3)</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">35% discount on OD</td>
                    <td className="py-3 px-4 text-rose-500 font-medium">Resets to 0%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-text-primary">4 Consecutive Years (Renewal 4)</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">45% discount on OD</td>
                    <td className="py-3 px-4 text-rose-500 font-medium">Resets to 0%</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-text-primary">5+ Consecutive Years (Renewal 5+)</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600 dark:text-emerald-400">50% discount on OD (Maximum Cap)</td>
                    <td className="py-3 px-4 text-rose-500 font-medium">Resets to 0%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Golden Rules */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-surface border border-border">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-bold text-text-primary mb-2">The 50% Trap</h3>
              <p className="text-[12.5px] text-text-secondary leading-relaxed">
                If you have reached the 50% maximum NCB, filing a ₹5,000 claim destroys a discount you took 5 whole years to build. You must wait another 5 claim-free years to reach 50% again.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-3">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-bold text-text-primary mb-2">Compulsory Deductible</h3>
              <p className="text-[12.5px] text-text-secondary leading-relaxed">
                Every claim automatically deducts ₹1,000 (≤1500cc) or ₹2,000 (&gt;1500cc) from your payout. For minor damages below ₹4,000, the insurance company pays almost nothing after deductions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-surface border border-border">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-3">
                <Car className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-bold text-text-primary mb-2">NCB Follows You</h3>
              <p className="text-[12.5px] text-text-secondary leading-relaxed">
                When purchasing a new car or switching to another insurance provider, obtain an NCB Retention Certificate from your existing insurer to transfer your discount to the new car.
              </p>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div>
            <h2 className="text-[22px] font-bold text-text-primary tracking-tight mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" />
              Frequently Asked Questions on No Claim Bonus
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="p-5 rounded-2xl bg-surface border border-border">
                  <h3 className="text-[15px] font-bold text-text-primary mb-2">{faq.q}</h3>
                  <p className="text-[13px] text-text-secondary leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
