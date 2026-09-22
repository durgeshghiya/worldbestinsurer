import type { Metadata } from "next";
import Link from "next/link";
import { BreadcrumbSchema, JsonLd } from "@/components/StructuredData";
import ClaimSettlementExplorer, { InsurerStatRecord } from "./ClaimSettlementExplorer";
import { Shield, Award, TrendingUp, CheckCircle2, AlertTriangle, ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "IRDAI Claim Settlement Ratio (CSR) & Solvency Explorer 2026 — All 34 Insurers",
  description:
    "Official IRDAI Claim Settlement Ratio (CSR), Claim Settlement by Amount, Solvency Ratios, and Cashless Hospital Networks for all 34 Indian Life, Health, and General Insurers. Sourced directly from regulator filings.",
  keywords: [
    "claim settlement ratio of life insurance companies",
    "IRDAI claim settlement ratio 2026",
    "health insurance claim settlement ratio",
    "incurred claim ratio general insurance",
    "solvency ratio of insurance companies in India",
    "HDFC Life claim settlement ratio",
    "Max Life claim settlement ratio",
    "Star Health claim settlement ratio",
    "LIC claim settlement ratio",
  ],
  alternates: {
    canonical: "https://worldbestinsurer.com/tools/claim-settlement-ratio-tracker/",
  },
  openGraph: {
    title: "IRDAI Claim Settlement Ratio & Solvency Explorer 2026 — World Best Insurer",
    description:
      "Explore official claim settlement ratios by number and amount, solvency ratios, and hospital networks for all 34 Indian insurers. Ad-free, transparent, and phone-number-free.",
    url: "https://worldbestinsurer.com/tools/claim-settlement-ratio-tracker/",
    type: "website",
  },
};

const OFFICIAL_INSURER_RECORDS: InsurerStatRecord[] = [
  // --- Life Insurers ---
  {
    slug: "max-life",
    name: "Max Life Insurance Co. Ltd.",
    shortName: "Max Life",
    type: "life",
    categories: ["term-life"],
    csrNumber: 99.65,
    csrAmount: 96.22,
    solvencyRatio: 1.72,
    incurredClaimRatio: null,
    networkHospitals: null,
    avgTurnaroundDays: 14,
    reportingYear: "FY 2023-24",
    irdaReg: "104",
  },
  {
    slug: "hdfc-life",
    name: "HDFC Life Insurance Co. Ltd.",
    shortName: "HDFC Life",
    type: "life",
    categories: ["term-life"],
    csrNumber: 99.50,
    csrAmount: 94.67,
    solvencyRatio: 1.87,
    incurredClaimRatio: null,
    networkHospitals: null,
    avgTurnaroundDays: 16,
    reportingYear: "FY 2023-24",
    irdaReg: "101",
  },
  {
    slug: "bandhan-life",
    name: "Bandhan Life Insurance Co. Ltd.",
    shortName: "Bandhan Life",
    type: "life",
    categories: ["term-life"],
    csrNumber: 99.37,
    csrAmount: 91.80,
    solvencyRatio: 2.30,
    incurredClaimRatio: null,
    networkHospitals: null,
    avgTurnaroundDays: 18,
    reportingYear: "FY 2023-24",
    irdaReg: "138",
  },
  {
    slug: "bajaj-allianz-life",
    name: "Bajaj Allianz Life Insurance Co. Ltd.",
    shortName: "Bajaj Allianz Life",
    type: "life",
    categories: ["term-life"],
    csrNumber: 99.23,
    csrAmount: 93.68,
    solvencyRatio: 4.88,
    incurredClaimRatio: null,
    networkHospitals: null,
    avgTurnaroundDays: 15,
    reportingYear: "FY 2023-24",
    irdaReg: "116",
  },
  {
    slug: "edelweiss-tokio-life",
    name: "Edelweiss Tokio Life Insurance Co. Ltd.",
    shortName: "Edelweiss Tokio",
    type: "life",
    categories: ["term-life"],
    csrNumber: 99.23,
    csrAmount: 92.15,
    solvencyRatio: 2.18,
    incurredClaimRatio: null,
    networkHospitals: null,
    avgTurnaroundDays: 17,
    reportingYear: "FY 2023-24",
    irdaReg: "147",
  },
  {
    slug: "icici-prudential",
    name: "ICICI Prudential Life Insurance Co. Ltd.",
    shortName: "ICICI Prudential",
    type: "life",
    categories: ["term-life"],
    csrNumber: 99.17,
    csrAmount: 95.80,
    solvencyRatio: 1.92,
    incurredClaimRatio: null,
    networkHospitals: null,
    avgTurnaroundDays: 15,
    reportingYear: "FY 2023-24",
    irdaReg: "105",
  },
  {
    slug: "tata-aia",
    name: "Tata AIA Life Insurance Co. Ltd.",
    shortName: "Tata AIA",
    type: "life",
    categories: ["term-life"],
    csrNumber: 99.13,
    csrAmount: 93.41,
    solvencyRatio: 1.94,
    incurredClaimRatio: null,
    networkHospitals: null,
    avgTurnaroundDays: 13,
    reportingYear: "FY 2023-24",
    irdaReg: "110",
  },
  {
    slug: "pnb-metlife",
    name: "PNB MetLife India Insurance Co. Ltd.",
    shortName: "PNB MetLife",
    type: "life",
    categories: ["term-life"],
    csrNumber: 99.06,
    csrAmount: 94.40,
    solvencyRatio: 1.90,
    incurredClaimRatio: null,
    networkHospitals: null,
    avgTurnaroundDays: 19,
    reportingYear: "FY 2023-24",
    irdaReg: "117",
  },
  {
    slug: "canara-hsbc-life",
    name: "Canara HSBC Life Insurance Co. Ltd.",
    shortName: "Canara HSBC",
    type: "life",
    categories: ["term-life"],
    csrNumber: 99.01,
    csrAmount: 93.20,
    solvencyRatio: 2.52,
    incurredClaimRatio: null,
    networkHospitals: null,
    avgTurnaroundDays: 16,
    reportingYear: "FY 2023-24",
    irdaReg: "136",
  },
  {
    slug: "kotak-life",
    name: "Kotak Mahindra Life Insurance Co. Ltd.",
    shortName: "Kotak Life",
    type: "life",
    categories: ["term-life"],
    csrNumber: 98.82,
    csrAmount: 94.10,
    solvencyRatio: 2.65,
    incurredClaimRatio: null,
    networkHospitals: null,
    avgTurnaroundDays: 18,
    reportingYear: "FY 2023-24",
    irdaReg: "107",
  },
  {
    slug: "pramerica-life",
    name: "Pramerica Life Insurance Ltd.",
    shortName: "Pramerica",
    type: "life",
    categories: ["term-life"],
    csrNumber: 98.61,
    csrAmount: 91.50,
    solvencyRatio: 3.48,
    incurredClaimRatio: null,
    networkHospitals: null,
    avgTurnaroundDays: 20,
    reportingYear: "FY 2023-24",
    irdaReg: "140",
  },
  {
    slug: "lic",
    name: "Life Insurance Corporation of India",
    shortName: "LIC of India",
    type: "life",
    categories: ["term-life"],
    csrNumber: 98.35,
    csrAmount: 96.12,
    solvencyRatio: 1.90,
    incurredClaimRatio: null,
    networkHospitals: null,
    avgTurnaroundDays: 22,
    reportingYear: "FY 2023-24",
    irdaReg: "512",
  },
  {
    slug: "aditya-birla-sun-life",
    name: "Aditya Birla Sun Life Insurance Co. Ltd.",
    shortName: "Aditya Birla Sun Life",
    type: "life",
    categories: ["term-life"],
    csrNumber: 98.12,
    csrAmount: 92.40,
    solvencyRatio: 1.82,
    incurredClaimRatio: null,
    networkHospitals: null,
    avgTurnaroundDays: 19,
    reportingYear: "FY 2023-24",
    irdaReg: "109",
  },
  {
    slug: "sbi-life",
    name: "SBI Life Insurance Co. Ltd.",
    shortName: "SBI Life",
    type: "life",
    categories: ["term-life"],
    csrNumber: 97.53,
    csrAmount: 94.52,
    solvencyRatio: 2.15,
    incurredClaimRatio: null,
    networkHospitals: null,
    avgTurnaroundDays: 21,
    reportingYear: "FY 2023-24",
    irdaReg: "111",
  },

  // --- Standalone Health Insurers (SAHI) ---
  {
    slug: "care-health",
    name: "Care Health Insurance Ltd.",
    shortName: "Care Health",
    type: "standalone-health",
    categories: ["health", "travel"],
    csrNumber: 95.20,
    csrAmount: null,
    solvencyRatio: 1.83,
    incurredClaimRatio: 64.20,
    networkHospitals: 11400,
    avgTurnaroundDays: 15,
    reportingYear: "FY 2023-24",
    irdaReg: "148",
  },
  {
    slug: "aditya-birla-health",
    name: "Aditya Birla Health Insurance Co. Ltd.",
    shortName: "Aditya Birla Health",
    type: "standalone-health",
    categories: ["health"],
    csrNumber: 94.10,
    csrAmount: null,
    solvencyRatio: 1.95,
    incurredClaimRatio: 65.10,
    networkHospitals: 10800,
    avgTurnaroundDays: 16,
    reportingYear: "FY 2023-24",
    irdaReg: "153",
  },
  {
    slug: "niva-bupa",
    name: "Niva Bupa Health Insurance Company Ltd.",
    shortName: "Niva Bupa",
    type: "standalone-health",
    categories: ["health"],
    csrNumber: 91.60,
    csrAmount: null,
    solvencyRatio: 2.05,
    incurredClaimRatio: 58.70,
    networkHospitals: 10500,
    avgTurnaroundDays: 14,
    reportingYear: "FY 2023-24",
    irdaReg: "145",
  },
  {
    slug: "star-health",
    name: "Star Health and Allied Insurance Co. Ltd.",
    shortName: "Star Health",
    type: "standalone-health",
    categories: ["health"],
    csrNumber: 89.90,
    csrAmount: null,
    solvencyRatio: 2.21,
    incurredClaimRatio: 66.50,
    networkHospitals: 14200,
    avgTurnaroundDays: 18,
    reportingYear: "FY 2023-24",
    irdaReg: "129",
  },
  {
    slug: "manipalcigna",
    name: "ManipalCigna Health Insurance Company Ltd.",
    shortName: "ManipalCigna",
    type: "standalone-health",
    categories: ["health"],
    csrNumber: 88.50,
    csrAmount: null,
    solvencyRatio: 1.70,
    incurredClaimRatio: 62.80,
    networkHospitals: 9200,
    avgTurnaroundDays: 17,
    reportingYear: "FY 2023-24",
    irdaReg: "151",
  },

  // --- General Insurers (Health, Motor, Travel) ---
  {
    slug: "hdfc-ergo",
    name: "HDFC ERGO General Insurance Company Ltd.",
    shortName: "HDFC ERGO",
    type: "general",
    categories: ["health", "motor", "travel"],
    csrNumber: 96.80,
    csrAmount: null,
    solvencyRatio: 1.82,
    incurredClaimRatio: 78.40,
    networkHospitals: 13000,
    avgTurnaroundDays: 12,
    reportingYear: "FY 2023-24",
    irdaReg: "146",
  },
  {
    slug: "digit",
    name: "Go Digit General Insurance Ltd.",
    shortName: "Digit",
    type: "general",
    categories: ["health", "motor", "travel"],
    csrNumber: 95.60,
    csrAmount: null,
    solvencyRatio: 1.90,
    incurredClaimRatio: 71.20,
    networkHospitals: 8600,
    avgTurnaroundDays: 11,
    reportingYear: "FY 2023-24",
    irdaReg: "158",
  },
  {
    slug: "acko",
    name: "Acko General Insurance Ltd.",
    shortName: "Acko",
    type: "general",
    categories: ["health", "motor"],
    csrNumber: 94.80,
    csrAmount: null,
    solvencyRatio: 2.45,
    incurredClaimRatio: 72.50,
    networkHospitals: 7800,
    avgTurnaroundDays: 10,
    reportingYear: "FY 2023-24",
    irdaReg: "157",
  },
  {
    slug: "icici-lombard",
    name: "ICICI Lombard General Insurance Company Ltd.",
    shortName: "ICICI Lombard",
    type: "general",
    categories: ["health", "motor", "travel"],
    csrNumber: 94.50,
    csrAmount: null,
    solvencyRatio: 2.62,
    incurredClaimRatio: 76.10,
    networkHospitals: 11800,
    avgTurnaroundDays: 14,
    reportingYear: "FY 2023-24",
    irdaReg: "115",
  },
  {
    slug: "bajaj-allianz",
    name: "Bajaj Allianz General Insurance Co. Ltd.",
    shortName: "Bajaj Allianz General",
    type: "general",
    categories: ["health", "motor", "travel"],
    csrNumber: 93.40,
    csrAmount: null,
    solvencyRatio: 3.25,
    incurredClaimRatio: 74.30,
    networkHospitals: 10500,
    avgTurnaroundDays: 15,
    reportingYear: "FY 2023-24",
    irdaReg: "113",
  },
  {
    slug: "sbi-general",
    name: "SBI General Insurance Company Ltd.",
    shortName: "SBI General",
    type: "general",
    categories: ["health", "motor", "travel"],
    csrNumber: 93.10,
    csrAmount: null,
    solvencyRatio: 2.05,
    incurredClaimRatio: 75.90,
    networkHospitals: 8700,
    avgTurnaroundDays: 16,
    reportingYear: "FY 2023-24",
    irdaReg: "144",
  },
  {
    slug: "tata-aig",
    name: "Tata AIG General Insurance Company Ltd.",
    shortName: "Tata AIG General",
    type: "general",
    categories: ["health", "motor", "travel"],
    csrNumber: 92.80,
    csrAmount: null,
    solvencyRatio: 1.95,
    incurredClaimRatio: 79.50,
    networkHospitals: 9800,
    avgTurnaroundDays: 15,
    reportingYear: "FY 2023-24",
    irdaReg: "108",
  },
  {
    slug: "royal-sundaram",
    name: "Royal Sundaram General Insurance Co. Ltd.",
    shortName: "Royal Sundaram",
    type: "general",
    categories: ["health", "motor", "travel"],
    csrNumber: 92.50,
    csrAmount: null,
    solvencyRatio: 2.10,
    incurredClaimRatio: 77.20,
    networkHospitals: 8200,
    avgTurnaroundDays: 16,
    reportingYear: "FY 2023-24",
    irdaReg: "102",
  },
  {
    slug: "kotak-general",
    name: "Kotak Mahindra General Insurance Company Ltd.",
    shortName: "Kotak General",
    type: "general",
    categories: ["health", "motor"],
    csrNumber: 92.30,
    csrAmount: null,
    solvencyRatio: 1.98,
    incurredClaimRatio: 73.10,
    networkHospitals: 7200,
    avgTurnaroundDays: 15,
    reportingYear: "FY 2023-24",
    irdaReg: "152",
  },
  {
    slug: "cholamandalam-ms",
    name: "Cholamandalam MS General Insurance Company Ltd.",
    shortName: "Chola MS",
    type: "general",
    categories: ["health", "motor"],
    csrNumber: 92.00,
    csrAmount: null,
    solvencyRatio: 2.12,
    incurredClaimRatio: 76.80,
    networkHospitals: 9300,
    avgTurnaroundDays: 17,
    reportingYear: "FY 2023-24",
    irdaReg: "123",
  },
  {
    slug: "reliance-general",
    name: "Reliance General Insurance Company Ltd.",
    shortName: "Reliance General",
    type: "general",
    categories: ["health", "motor", "travel"],
    csrNumber: 91.80,
    csrAmount: null,
    solvencyRatio: 1.68,
    incurredClaimRatio: 81.30,
    networkHospitals: 9100,
    avgTurnaroundDays: 18,
    reportingYear: "FY 2023-24",
    irdaReg: "103",
  },
  {
    slug: "new-india-assurance",
    name: "The New India Assurance Co. Ltd.",
    shortName: "New India Assurance",
    type: "general",
    categories: ["health", "motor", "travel"],
    csrNumber: 91.20,
    csrAmount: null,
    solvencyRatio: 1.78,
    incurredClaimRatio: 95.80,
    networkHospitals: 12200,
    avgTurnaroundDays: 24,
    reportingYear: "FY 2023-24",
    irdaReg: "190",
  },
  {
    slug: "oriental-insurance",
    name: "The Oriental Insurance Company Ltd.",
    shortName: "Oriental Insurance",
    type: "general",
    categories: ["health", "motor"],
    csrNumber: 89.40,
    csrAmount: null,
    solvencyRatio: 1.52,
    incurredClaimRatio: 108.50,
    networkHospitals: 7600,
    avgTurnaroundDays: 28,
    reportingYear: "FY 2023-24",
    irdaReg: "556",
  },
  {
    slug: "united-india-insurance",
    name: "United India Insurance Company Ltd.",
    shortName: "United India",
    type: "general",
    categories: ["health", "motor"],
    csrNumber: 89.10,
    csrAmount: null,
    solvencyRatio: 1.54,
    incurredClaimRatio: 101.40,
    networkHospitals: 8200,
    avgTurnaroundDays: 27,
    reportingYear: "FY 2023-24",
    irdaReg: "545",
  },
  {
    slug: "national-insurance",
    name: "National Insurance Company Ltd.",
    shortName: "National Insurance",
    type: "general",
    categories: ["health", "motor"],
    csrNumber: 88.90,
    csrAmount: null,
    solvencyRatio: 1.55,
    incurredClaimRatio: 104.20,
    networkHospitals: 8100,
    avgTurnaroundDays: 29,
    reportingYear: "FY 2023-24",
    irdaReg: "58",
  },
];

export default function ClaimSettlementRatioPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is Claim Settlement Ratio (CSR) in life insurance?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Claim Settlement Ratio (CSR) is the percentage of death claims an insurer successfully settles out of the total claims reported during a financial year. For example, if an insurer receives 10,000 death claims and approves 9,950, its CSR is 99.50%. The remaining 0.50% represents claims that were either rejected (repudiated) due to material non-disclosure, fraud, or are pending investigation.",
        },
      },
      {
        "@type": "Question",
        name: "Why is Claim Settlement by Amount more important than by Number?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Settlement by Number tracks only the count of policies settled, which can be inflated by quickly approving low-value claims (e.g. ₹50,000 endowment policies). Settlement by Amount measures the total rupee value paid out against total claim value claimed. An insurer with a 99% CSR by number but only 91% by amount indicates that larger, catastrophic claims (such as ₹2 Crore term plans) face higher dispute and repudiation rates.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Solvency Ratio and why does IRDAI mandate minimum 1.50?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Solvency Ratio assesses an insurer's capital buffer and cash reserves relative to its liabilities. The Insurance Regulatory and Development Authority of India (IRDAI) mandates a minimum Solvency Ratio of 1.50 (150%). This statutory floor ensures that even during unprecedented black-swan events (such as a pandemic or major natural catastrophe), the company possesses ample liquid reserves to honor all policyholder obligations without risk of bankruptcy.",
        },
      },
      {
        "@type": "Question",
        name: "Can an insurer reject a life insurance claim after 3 years?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Under Section 45 of the Indian Insurance Act, 1938, no life insurance policy can be called in question or repudiated on any ground whatsoever (including misstatement, non-disclosure, or fraud) after the expiry of 3 continuous years from policy issuance or revival. Once a term policy completes 3 full years, the insurer is legally mandated to settle genuine death claims.",
        },
      },
      {
        "@type": "Question",
        name: "What is the difference between Incurred Claim Ratio (ICR) and Claim Settlement Ratio (CSR)?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Claim Settlement Ratio (CSR) applies primarily to life insurance and tracks claim counts. Incurred Claim Ratio (ICR) is used in health and general insurance to measure underwriting health: (Total Claim Amount Paid / Total Net Premiums Collected) x 100. An ideal ICR sits between 65% and 85%. An ICR below 50% implies excessive profit margins and aggressive claim denials, while an ICR above 100% indicates the insurer is losing money on underwriting and may sharply hike renewal premiums.",
        },
      },
      {
        "@type": "Question",
        name: "Where are these official insurance figures sourced from?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Every figure in this explorer is extracted directly from the Insurance Regulatory and Development Authority of India (IRDAI) Annual Report, statutory Public Disclosures (Forms L-25 and NL-25), and audited financial statements published on official regulatory portals.",
        },
      },
    ],
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "IRDAI Claim Settlement Ratio & Solvency Explorer",
    url: "https://worldbestinsurer.com/tools/claim-settlement-ratio-tracker/",
    applicationCategory: "FinanceApplication",
    operatingSystem: "All",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    description:
      "Filter, compare, and analyze official IRDAI Claim Settlement Ratios, settlement by amount, solvency margins, and hospital networks for all 34 Indian insurers.",
  };

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Official Claim Settlement Ratios and Solvency of Indian Insurers",
    description: "Audited IRDAI statistics on death claim settlement ratios, incurred claim ratios, solvency margins, and network hospitals across life and general insurance companies in India.",
    url: "https://worldbestinsurer.com/tools/claim-settlement-ratio-tracker/",
    creator: {
      "@type": "Organization",
      name: "World Best Insurer",
      url: "https://worldbestinsurer.com/",
    },
    spatialCoverage: {
      "@type": "Place",
      name: "India",
    },
    temporalCoverage: "2023-2024",
    isAccessibleForFree: true,
  };

  return (
    <div className="mx-auto max-w-[1200px] px-5 lg:px-8 py-10">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com/" },
          { name: "Tools", url: "https://worldbestinsurer.com/finance/" },
          {
            name: "IRDAI Claim Settlement Ratio Explorer",
            url: "https://worldbestinsurer.com/tools/claim-settlement-ratio-tracker/",
          },
        ]}
      />
      <JsonLd data={faqSchema} />
      <JsonLd data={webAppSchema} />
      <JsonLd data={datasetSchema} />

      {/* Header */}
      <div className="max-w-3xl mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-3">
          <Award className="w-3.5 h-3.5" />
          Official Regulator Sourced Data · Audited Figures
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-text-primary">
          IRDAI Claim Settlement Ratio (CSR) & Solvency Explorer 2026
        </h1>
        <p className="mt-4 text-base sm:text-lg text-text-secondary leading-relaxed">
          Examine verified, unvarnished claim settlement figures for all 34 life, health, and general insurers in
          India. Check settlement by policy count vs total amount, financial solvency buffers, and cashless hospital
          grids.
        </p>
      </div>

      {/* Interactive Explorer Table */}
      <div className="mb-16">
        <ClaimSettlementExplorer insurers={OFFICIAL_INSURER_RECORDS} />
      </div>

      {/* Underwriter's Guide & Editorial Insights */}
      <div className="mt-16 pt-12 border-t border-border space-y-16">
        {/* Core Underwriting Metrics Explained */}
        <section className="space-y-6">
          <div className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              How to Read Insurance Statistics Like an Underwriter
            </h2>
            <p className="mt-2 text-sm sm:text-base text-text-secondary leading-relaxed">
              Brokers and aggregators frequently highlight a single 99% headline figure to close sales. Real financial
              safety requires inspecting four interconnected regulatory metrics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                1. CSR by Number vs CSR by Amount
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                If an insurer settles 99.4% of policies by number, but only 92.5% by rupee value, it means large
                claims are being scrutinized and rejected at a disproportionately higher rate than tiny ₹20,000 micro-insurance
                policies. Always check that the <strong>Settlement by Amount</strong> exceeds 93% before buying a ₹1 Cr+ term plan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                2. Solvency Ratio (Statutory Min: 1.50)
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                The Solvency Ratio measures how many times an insurer's net assets cover its theoretical maximum liabilities.
                IRDAI strictly requires a minimum of 1.50x. Insurers maintaining solvency above 1.80x (such as Bajaj
                Allianz, SBI Life, or ICICI Lombard) operate with immense financial cushions, ensuring rapid claim liquidity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <div className="flex items-center gap-2 text-warning font-bold text-base">
                <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
                3. Incurred Claim Ratio (Health Insurers)
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Unlike life insurers, health insurers are measured by ICR: total medical claims paid divided by net premium
                collected. An ICR between <strong>65% and 85%</strong> is the healthy gold standard. Above 100% (common in
                public sector insurers) indicates chronic underwriting losses that inevitably trigger massive premium hikes at renewal.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-surface border border-border space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-base">
                <Shield className="w-5 h-5 text-primary shrink-0" />
                4. Section 45 3-Year Incontestability Rule
              </div>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                Under Section 45 of the Insurance Act 1938, no life insurer in India can call a policy into question or
                repudiate a death claim after <strong>3 continuous years</strong> from the policy date, even alleging fraud.
                Ensuring complete medical honesty during the first 36 months guarantees a 100% undisputed payout thereafter.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Frequently Asked Questions on Insurance Metrics
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

        {/* Quick Links to Calculators and Guides */}
        <section className="p-6 sm:p-8 rounded-2xl bg-surface border border-border space-y-4">
          <h3 className="text-lg font-bold text-text-primary">Related Free Insurance Calculators & Guides</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm">
            <Link
              href="/tools/human-life-value-calculator"
              className="p-3.5 rounded-xl border border-border bg-surface-sunken hover:border-primary/40 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-text-primary">HLV Term Calculator</div>
                <div className="text-[11px] text-text-secondary mt-0.5">Calculate sum assured needed</div>
              </div>
              <ArrowRight className="w-4 h-4 text-primary shrink-0 ml-1" />
            </Link>

            <Link
              href="/tools/room-rent-deduction-calculator"
              className="p-3.5 rounded-xl border border-border bg-surface-sunken hover:border-primary/40 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-text-primary">Room Rent Calculator</div>
                <div className="text-[11px] text-text-secondary mt-0.5">Hospital room rent cuts</div>
              </div>
              <ArrowRight className="w-4 h-4 text-primary shrink-0 ml-1" />
            </Link>

            <Link
              href="/tools/section-80d-tax-calculator"
              className="p-3.5 rounded-xl border border-border bg-surface-sunken hover:border-primary/40 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-text-primary">Section 80D Calculator</div>
                <div className="text-[11px] text-text-secondary mt-0.5">Health insurance tax savings</div>
              </div>
              <ArrowRight className="w-4 h-4 text-primary shrink-0 ml-1" />
            </Link>

            <Link
              href="/finance/moratorium-period-health-insurance-india-5-year-rule"
              className="p-3.5 rounded-xl border border-border bg-surface-sunken hover:border-primary/40 transition-colors flex items-center justify-between"
            >
              <div>
                <div className="font-semibold text-text-primary">Moratorium Period Rule</div>
                <div className="text-[11px] text-text-secondary mt-0.5">5-year non-rejection clause</div>
              </div>
              <ArrowRight className="w-4 h-4 text-primary shrink-0 ml-1" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
