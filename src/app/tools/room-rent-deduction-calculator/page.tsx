import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema, JsonLd } from "@/components/StructuredData";
import RoomRentCalculator from "./RoomRentCalculator";
import { Calculator, ArrowRight, ShieldCheck, AlertCircle, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Health Insurance Room Rent Proportionate Deduction Calculator (IRDAI Rules) — World Best Insurer",
  description:
    "Calculate your exact hospital bill deduction if you choose a room exceeding your health insurance room rent limit. Features IRDAI-compliant non-scaling heads for medicines and implants.",
  keywords: [
    "room rent calculator health insurance",
    "proportionate deduction calculator",
    "room rent capping calculator",
    "room rent limit health insurance calculation",
    "IRDAI room rent rules",
    "health insurance deduction calculator",
  ],
  alternates: {
    canonical: "https://worldbestinsurer.com/tools/room-rent-deduction-calculator/",
  },
  openGraph: {
    title: "Health Insurance Room Rent Proportionate Deduction Calculator — World Best Insurer",
    description:
      "Calculate your exact hospital bill deduction if you exceed your room rent limit. Free, instant, and 100% compliant with IRDAI rules.",
    url: "https://worldbestinsurer.com/tools/room-rent-deduction-calculator/",
    type: "website",
  },
};

export default function RoomRentCalculatorPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is proportionate deduction in health insurance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Proportionate deduction is a clause where if you choose a hospital room with a rent higher than your policy's allowed limit, the insurer reduces not only the room rent difference, but also scales down all associated medical expenses (surgeon fees, operation theatre charges, nursing, and doctor consultations) in the exact ratio of allowed rent to actual rent.",
        },
      },
      {
        "@type": "Question",
        name: "Can an insurer apply proportionate deduction to medicines or medical implants?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Under the IRDAI Master Circular and standardization guidelines, proportionate deduction cannot be applied to the cost of pharmacy, medicines, medical consumables, diagnostic charges, or medical devices and implants (such as stents or pacemakers).",
        },
      },
      {
        "@type": "Question",
        name: "How is the proportionate deduction ratio calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The ratio is calculated as: (Allowed Room Rent per Day) divided by (Actual Room Rent per Day Charged by the Hospital). For example, if your policy allows ₹5,000 per day and you choose a room costing ₹10,000 per day, the ratio is 5,000 / 10,000 = 0.50 (50%). All associated surgical and medical charges are settled at 50% of the bill.",
        },
      },
      {
        "@type": "Question",
        name: "How can I avoid proportionate deduction?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can avoid proportionate deduction by: (1) staying in a room within your policy limit (e.g. twin-sharing), (2) purchasing a 'Room Rent Waiver' or 'No Room Rent Capping' rider, or (3) porting your policy to a comprehensive plan that offers a Single Private Room without room rent caps.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Room Rent Proportionate Deduction Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    browserRequirements: "Requires JavaScript",
    url: "https://worldbestinsurer.com/tools/room-rent-deduction-calculator/",
    description:
      "Interactive calculator to compute hospital bill deductions and insurer settlement ratios under health insurance room rent capping clauses.",
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
          { name: "Tools", url: "https://worldbestinsurer.com/tools/room-rent-deduction-calculator/" },
          { name: "Room Rent Deduction Calculator", url: "https://worldbestinsurer.com/tools/room-rent-deduction-calculator/" },
        ]}
      />
      <JsonLd data={faqSchema} />
      <JsonLd data={webAppSchema} />

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-light text-primary text-[11px] font-bold uppercase tracking-wider mb-3">
          <Calculator className="w-3.5 h-3.5" />
          Free Interactive Tool · IRDAI Standardized
        </div>
        <h1 className="text-[28px] sm:text-[40px] font-extrabold tracking-[-0.03em] text-text-primary">
          Room Rent Proportionate Deduction Calculator
        </h1>
        <p className="mt-3 max-w-[76ch] text-[15px] sm:text-[16px] leading-[1.7] text-text-secondary">
          Find out exactly how much your insurer will deduct from your surgeon fees, OT charges, and hospital bills
          if you occupy a room exceeding your health policy's daily limit. Tested against real IRDAI claim settlement rules.
        </p>
      </div>

      {/* Calculator Client Component */}
      <div className="mb-14">
        <RoomRentCalculator />
      </div>

      {/* Educational Deep Dive */}
      <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm space-y-8 max-w-[900px] mx-auto">
        <section className="space-y-4">
          <h2 className="text-[22px] font-bold text-text-primary tracking-tight">
            How the Proportionate Deduction Formula Actually Works
          </h2>
          <p className="text-[14.5px] leading-[1.8] text-text-secondary">
            Most policyholders assume that if their policy has a room rent limit of ₹5,000/day and they take a ₹10,000/day room
            for 4 days, they will only have to pay the ₹20,000 room excess out of pocket.
          </p>
          <p className="text-[14.5px] leading-[1.8] text-text-secondary">
            In reality, hospitals and insurers link doctor consultation fees, surgeon operation charges, anaesthetist fees, and
            operating theatre (OT) expenses directly to the room category chosen. Under the proportionate deduction clause,
            your insurer recalculates all associated charges using this exact ratio:
          </p>
          <div className="p-4 rounded-xl bg-surface-sunken border border-border-light font-mono text-[13.5px] text-primary">
            Proportionate Ratio = Allowed Room Rent per Day ÷ Actual Room Rent Charged per Day
          </div>
          <p className="text-[14.5px] leading-[1.8] text-text-secondary">
            If you were entitled to ₹5,000 and took a ₹10,000 room, the ratio is <strong>50%</strong>. A ₹2,00,000 surgeon fee
            will only be settled at ₹1,00,000, leaving you with an unexpected ₹1,00,000 out-of-pocket loss!
          </p>
        </section>

        <section className="space-y-4 pt-6 border-t border-border-light">
          <h2 className="text-[20px] font-bold text-text-primary tracking-tight">
            Which Hospital Charges CANNOT Be Cut (IRDAI Mandate)
          </h2>
          <p className="text-[14.5px] leading-[1.8] text-text-secondary">
            Under IRDAI standardization regulations, insurers are strictly prohibited from applying proportionate deduction to
            expenses that do not vary by room category.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04]">
              <span className="font-bold text-emerald-700 text-[13.5px] block mb-2">
                ✓ Protected Heads (Zero Proportionate Cut)
              </span>
              <ul className="text-[13px] text-text-secondary space-y-1.5 list-disc pl-4">
                <li>Medicines and pharmacy bills</li>
                <li>Implants (stents, valves, pacemakers, orthopaedic rods)</li>
                <li>Medical consumables (PPE, syringes, catheters)</li>
                <li>Standard diagnostic imaging (CT scans, MRI, blood tests)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.04]">
              <span className="font-bold text-amber-700 text-[13.5px] block mb-2">
                ✗ Scalable Heads (Subject to Deduction)
              </span>
              <ul className="text-[13px] text-text-secondary space-y-1.5 list-disc pl-4">
                <li>Operating Theatre (OT) charges</li>
                <li>Surgeon and assistant surgeon fees</li>
                <li>Anaesthetist fees</li>
                <li>Nursing and daily resident doctor visit charges</li>
              </ul>
            </div>
          </div>
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
            Want to understand the complete legal framework?
          </div>
          <Link
            href="/finance/room-rent-limit-proportionate-deduction-health-insurance/"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-primary hover:text-primary-hover"
          >
            Read the full Room Rent Master Guide
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
