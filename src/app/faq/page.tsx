import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, Heart, Shield, Car, Plane, Globe, ChevronRight } from "lucide-react";
import { FAQSchema, BreadcrumbSchema } from "@/components/StructuredData";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — World Best Insurer",
  description:
    "Answers to 40+ common questions about health insurance, term life, motor, and travel insurance. Compare plans, understand claim ratios, and make smarter insurance decisions.",
  openGraph: {
    title: "Insurance FAQ — World Best Insurer",
    description:
      "40+ answers on health, life, motor & travel insurance — from claim ratios to premium tips.",
  },
};

/* ── FAQ data by section ────────────────────────────────────── */

const sections: {
  id: string;
  title: string;
  icon: typeof Heart;
  color: string;
  faqs: { q: string; a: string }[];
}[] = [
  {
    id: "general",
    title: "About World Best Insurer",
    icon: Globe,
    color: "text-[#1e2b7a]",
    faqs: [
      { q: "What is World Best Insurer?", a: "World Best Insurer is a free, independent insurance comparison platform covering 12 countries and 390+ insurance products. We help you compare health, term life, motor, and travel insurance plans side-by-side. We do not sell insurance or collect premiums — we provide data-driven comparisons so you can make informed decisions." },
      { q: "Does World Best Insurer sell insurance?", a: "No. We are a comparison and educational platform only. We do not sell policies, collect premiums, or act as an intermediary. When you click through to an insurer website, you deal directly with the insurer." },
      { q: "How is the insurance data collected?", a: "We use a combination of AI-powered monitoring agents and manual verification to collect data from official insurer websites, regulatory filings (IRDAI, NAIC, FCA), and public policy documents. Every product listing shows a last-verified date and confidence score." },
      { q: "Which countries are covered?", a: "We cover 12 countries: India, United States, United Kingdom, Australia, Canada, Germany, Japan, South Korea, Hong Kong, Singapore, UAE, and Saudi Arabia. India has the deepest coverage with 96+ products from 20+ insurers." },
      { q: "Is World Best Insurer free to use?", a: "Yes, the comparison platform is completely free for consumers. We may earn a small commission if you click through to an insurer's website and purchase a policy, but this never affects our rankings or recommendations. All affiliate relationships are clearly disclosed." },
      { q: "How often is the data updated?", a: "Our AI agents monitor insurer websites continuously. Product data is typically refreshed weekly, and claim settlement ratios are updated annually when regulators publish new figures. Each product page shows its last-verified date." },
    ],
  },
  {
    id: "health",
    title: "Health Insurance",
    icon: Heart,
    color: "text-[#c44058]",
    faqs: [
      { q: "How do I compare health insurance plans?", a: "Compare plans based on five key factors: (1) claim settlement ratio — higher is better, aim for 90%+; (2) network hospital count — more hospitals means easier cashless claims; (3) premium vs coverage ratio — compare premiums for the same sum insured; (4) waiting periods for pre-existing diseases — shorter is better; (5) sub-limits and co-payments — check for room rent caps and deductibles." },
      { q: "What is Claim Settlement Ratio (CSR)?", a: "CSR is the percentage of claims an insurer pays out of total claims received in a year. A CSR of 95% means the insurer settled 95 out of every 100 claims. Higher is better — look for insurers with CSR above 90%. Data is published annually by regulators like IRDAI." },
      { q: "Family floater vs individual health insurance — which is better?", a: "Family floater plans cover your entire family under one shared sum insured and are usually 30-40% cheaper than buying separate individual policies. Choose family floater for young families with children. Switch to individual plans when any family member crosses age 45-50, as their health risk can consume the shared cover." },
      { q: "What are waiting periods in health insurance?", a: "There are three types: (1) Initial waiting period — usually 30 days from policy start during which no claims are allowed; (2) Pre-existing disease (PED) waiting period — typically 2-4 years before coverage kicks in for conditions you had before buying the policy; (3) Specific disease waiting period — usually 1-2 years for conditions like hernia, cataract, or joint replacement." },
      { q: "What is a restoration benefit in health insurance?", a: "Restoration benefit automatically restores your full sum insured if it gets exhausted during the policy year. For example, if you have Rs 10 lakh coverage and use it all for one hospitalization, the full Rs 10 lakh is restored for future claims. About 85% of modern plans include this feature." },
      { q: "Should I buy health insurance if my employer provides group cover?", a: "Yes. Employer group insurance typically provides Rs 3-5 lakh coverage with no portability — you lose it when you leave the job. Personal health insurance gives you higher coverage, lifetime renewability, and you earn waiting period credits. Buy personal cover early when premiums are low." },
    ],
  },
  {
    id: "term-life",
    title: "Term Life Insurance",
    icon: Shield,
    color: "text-[#2d3a8c]",
    faqs: [
      { q: "How much term insurance cover do I need?", a: "A common rule is 10-15 times your annual income. Factor in outstanding loans (home loan, car loan), children's education costs (plan for inflation), and your family's monthly expenses for 15-20 years. If you earn Rs 12 lakh/year, aim for Rs 1.2-1.8 crore coverage. Use an online calculator for a precise estimate." },
      { q: "Term insurance vs life insurance — what's the difference?", a: "Term insurance provides a pure death benefit for a fixed period at very low cost — no savings or maturity benefit. Traditional life insurance (endowment, ULIP) includes investment components but costs 5-10x more for the same death cover. Financial experts overwhelmingly recommend term insurance + separate investments over bundled products." },
      { q: "Which term insurance has the highest claim settlement ratio?", a: "Based on FY2024-25 data: LIC leads at 98%+. Among private insurers, Max Life (99.2%), HDFC Life (98.5%), Tata AIA (98.6%), and ICICI Prudential (98.1%) have consistently strong track records. Newer insurers may have high CSR but low claim volumes, so consider both metrics." },
      { q: "At what age should I buy term insurance?", a: "The earlier the better — premiums are locked in at the age of purchase. A 25-year-old pays roughly half the premium of a 35-year-old for the same coverage. You also avoid the risk of health conditions developing later that could increase premiums or lead to exclusions. Buy as soon as you have financial dependents." },
      { q: "What is the difference between level and increasing term cover?", a: "Level cover keeps the death benefit constant throughout the policy term. Increasing cover raises the death benefit by 5-10% annually to keep pace with inflation. Increasing cover costs 15-25% more in premiums but ensures your family's coverage isn't eroded by inflation over a 30-year policy." },
    ],
  },
  {
    id: "motor",
    title: "Motor Insurance",
    icon: Car,
    color: "text-[#2d8f6f]",
    faqs: [
      { q: "Comprehensive vs third-party motor insurance — what's the difference?", a: "Third-party insurance is legally mandatory and covers damage you cause to others (their vehicle, property, injury). Comprehensive insurance covers everything third-party does PLUS damage to your own vehicle from accidents, theft, natural disasters, and fire. Comprehensive costs 3-5x more but is strongly recommended." },
      { q: "What is No Claim Bonus (NCB)?", a: "NCB is a discount on your premium earned for each claim-free year. It starts at 20% after year one and increases to 25%, 35%, 45%, and 50% over five claim-free years. NCB is transferable when you switch insurers — always ask your new insurer to apply it. Making a claim resets your NCB to zero." },
      { q: "Is zero depreciation add-on worth it?", a: "Yes, especially for cars under 3 years old. Without it, the insurer deducts depreciation on plastic, rubber, and fiber parts during claims — you could pay 30-40% of repair costs out of pocket. Zero depreciation cover costs Rs 1,000-3,000 extra but ensures full parts reimbursement. Less valuable for cars over 5 years old." },
      { q: "What is IDV (Insured Declared Value)?", a: "IDV is the maximum amount your insurer will pay if your vehicle is stolen or totally wrecked. It's calculated as the manufacturer's listed selling price minus depreciation based on the vehicle's age. You can choose a higher IDV (up to 110% of calculated value) for better protection, but premiums increase proportionally." },
      { q: "Can I switch my motor insurance company at renewal?", a: "Yes. You can switch insurers at renewal without losing your No Claim Bonus — the new insurer transfers it. Compare quotes from multiple insurers 2-3 weeks before your renewal date. Ensure there's no gap in coverage, as even one day without insurance voids your NCB." },
    ],
  },
  {
    id: "travel",
    title: "Travel Insurance",
    icon: Plane,
    color: "text-[#c47d2e]",
    faqs: [
      { q: "Do I need travel insurance for a Schengen visa?", a: "Yes. Schengen visa applications require travel insurance with a minimum EUR 30,000 (approximately Rs 27 lakh) medical coverage. The policy must cover the entire trip duration plus a 15-day buffer, and include emergency medical evacuation and repatriation. Without valid travel insurance, your visa application will be rejected." },
      { q: "What does travel insurance typically cover?", a: "Standard coverage includes: medical emergencies and hospitalization abroad, emergency evacuation and repatriation, trip cancellation and interruption, lost or delayed baggage, flight delays, passport loss assistance, and personal liability. Premium plans may also cover adventure sports, pre-existing conditions (with higher premiums), and COVID-19 related issues." },
      { q: "How much does travel insurance cost?", a: "For a week-long trip: Asia destinations typically cost $10-25, Europe/US costs $25-60. Annual multi-trip plans range from $80-200. Costs vary by age (seniors pay 2-3x more), destination risk level, coverage amount, and included add-ons. Always compare plans rather than defaulting to your airline's offer." },
      { q: "Does travel insurance cover trip cancellation?", a: "Most plans cover trip cancellation for specified reasons: illness or death of the insured/family member, natural disasters at the destination, visa rejection, or airline bankruptcy. Cancellation for changed plans, work commitments, or fear of travel is generally NOT covered unless you buy a 'Cancel For Any Reason' (CFAR) add-on." },
      { q: "Should I buy travel insurance from my airline or a separate insurer?", a: "Separate insurers almost always offer better value. Airline travel insurance is convenient but typically costs 2-3x more for less coverage, has more exclusions, and harder claims processes. Use a comparison platform to find the best plan for your specific trip." },
    ],
  },
];

const allFaqs = sections.flatMap((s) => s.faqs);

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-background">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com" },
          { name: "FAQ", url: "https://worldbestinsurer.com/faq" },
        ]}
      />
      <FAQSchema questions={allFaqs} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#1e2b7a] via-[#2d3a8c] to-[#1a1a2e] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 text-[#c47d2e] text-sm font-semibold mb-4">
            <HelpCircle className="w-4 h-4" />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Insurance Questions,{" "}
            <span className="text-[#c47d2e]">Straight Answers</span>
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            {allFaqs.length} answers on health, life, motor, and travel
            insurance — written by our editorial team, backed by data from{" "}
            390+ products across 12 countries.
          </p>
        </div>
      </section>

      {/* Quick nav */}
      <section className="border-b border-border bg-surface sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto py-2 -mx-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium text-text-secondary hover:text-primary hover:bg-primary/5 rounded-lg whitespace-nowrap transition-colors"
              >
                <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                {s.title}
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* FAQ sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {sections.map((section) => (
          <section key={section.id} id={section.id}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl bg-surface-sunken flex items-center justify-center`}>
                <section.icon className={`w-5 h-5 ${section.color}`} />
              </div>
              <h2 className="text-[22px] font-bold text-text-primary">
                {section.title}
              </h2>
            </div>

            <div className="space-y-4">
              {section.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-surface border border-border rounded-xl overflow-hidden"
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-[14px] font-semibold text-text-primary hover:text-primary transition-colors">
                    <span>{faq.q}</span>
                    <ChevronRight className="w-4 h-4 text-text-tertiary group-open:rotate-90 transition-transform shrink-0" />
                  </summary>
                  <div className="px-5 pb-5 text-[13px] text-text-secondary leading-relaxed border-t border-border/50 pt-3">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="bg-surface-sunken rounded-2xl p-8 text-center">
          <h3 className="text-[18px] font-bold text-text-primary mb-2">
            Still have questions?
          </h3>
          <p className="text-[13px] text-text-tertiary mb-4">
            Our team is here to help. Reach out and we&apos;ll respond within 24 hours.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/contact/"
              className="px-5 py-2.5 text-[13px] font-semibold bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/compare/health/"
              className="px-5 py-2.5 text-[13px] font-semibold bg-surface border border-border text-text-primary rounded-xl hover:border-primary/30 transition-colors"
            >
              Start Comparing
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
