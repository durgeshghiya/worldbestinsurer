import type { Metadata } from "next";
import Link from "next/link";
import {
  Globe,
  Shield,
  Heart,
  Car,
  Plane,
  CheckCircle2,
  ArrowRight,
  Star,
  AlertCircle,
  FileText,
  Users,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Insurance for Foreigners — Compare International Insurance Plans",
  description:
    "Comparing insurance providers for foreigners? World Best Insurer covers health, life, motor, and travel insurance in 12 countries. Find the best insurance as an expat, student, or visitor.",
  keywords: [
    "insurance for foreigners",
    "comparing insurance providers for foreigners",
    "expat insurance comparison",
    "international health insurance",
    "insurance for expats",
    "insurance for international students",
    "visitor insurance",
    "foreigner insurance India",
    "expat health insurance UAE",
    "international travel insurance comparison",
    "best insurance comparison site foreigners",
  ],
  openGraph: {
    title: "Insurance for Foreigners — Compare International Plans",
    description:
      "The best insurance comparison site for foreigners, expats, students, and visitors in 12 countries.",
    url: "https://worldbestinsurer.com/insurance-for-foreigners/",
  },
  alternates: {
    canonical: "https://worldbestinsurer.com/insurance-for-foreigners/",
  },
};

const countries = [
  { code: "in", name: "India", flag: "🇮🇳", highlight: "Expat health & travel cover", regulator: "IRDAI" },
  { code: "us", name: "United States", flag: "🇺🇸", highlight: "Visitor & student health plans", regulator: "State DOI" },
  { code: "uk", name: "United Kingdom", flag: "🇬🇧", highlight: "NHS top-up & private health", regulator: "FCA" },
  { code: "ae", name: "UAE", flag: "🇦🇪", highlight: "Mandatory expat health insurance", regulator: "IA" },
  { code: "sg", name: "Singapore", flag: "🇸🇬", highlight: "MediShield & expat plans", regulator: "MAS" },
  { code: "au", name: "Australia", flag: "🇦🇺", highlight: "OVHC for visa holders", regulator: "APRA" },
  { code: "ca", name: "Canada", flag: "🇨🇦", highlight: "Visitor to Canada insurance", regulator: "OSFI" },
  { code: "de", name: "Germany", flag: "🇩🇪", highlight: "Statutory vs private health", regulator: "BaFin" },
];

const faqs = [
  {
    q: "Can foreigners buy insurance in another country?",
    a: "Yes — in most countries, foreigners, expats, students, and visa holders can purchase local insurance. Requirements vary by country and visa type. For example, UAE mandates health insurance for all residents. In Australia, certain visas require Overseas Visitor Health Cover (OVHC).",
  },
  {
    q: "What is the best insurance comparison site for foreigners?",
    a: "World Best Insurer compares health, life, motor, and travel insurance across 12 countries using verified, publicly available data. Unlike local comparison sites, we cover multiple countries in one place — ideal for expats, international students, and frequent travellers.",
  },
  {
    q: "What insurance do I need as an expat?",
    a: "Expats typically need: (1) Health insurance — either local or international plan, (2) Travel insurance for frequent trips home, (3) Life insurance if you have dependents. The right combination depends on your country of residence and visa status.",
  },
  {
    q: "Is international health insurance the same as travel insurance?",
    a: "No. Travel insurance covers short trips (typically up to 180 days) and emergencies. International health insurance is for long-term residents abroad and covers routine care, hospitalisation, prescriptions, and specialist visits. Expats living abroad need international health insurance, not travel insurance.",
  },
  {
    q: "How do I compare insurance providers as a foreigner?",
    a: "Use World Best Insurer to compare plans by country. Filter by health, life, motor, or travel. Each product page shows sum insured, premium range, key features, and the regulator overseeing the insurer — so you can verify legitimacy before buying.",
  },
];

export default function InsuranceForForeignersPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 text-white py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
            <Globe className="w-4 h-4" />
            <span>12 Countries · 4 Insurance Types · 100% Free</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Insurance for Foreigners,<br />
            <span className="text-blue-300">Expats & Visitors</span>
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-10">
            The best insurance comparison site for foreigners. Compare health, life, motor,
            and travel insurance providers across 12 countries — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/compare/health"
              className="inline-flex items-center gap-2 bg-white text-indigo-900 font-semibold px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors"
            >
              <Heart className="w-5 h-5" />
              Compare Health Insurance
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/compare/travel"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/20 transition-colors"
            >
              <Plane className="w-5 h-5" />
              Compare Travel Insurance
            </Link>
          </div>
        </div>
      </section>

      {/* Why foreigners need special insurance */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Why Foreigners Need to Compare Insurance Providers
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Insurance rules, costs, and coverage vary drastically by country.
            What works at home may not cover you abroad.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: AlertCircle,
                title: "Different Rules Per Country",
                desc: "UAE requires all residents to have health insurance. Australia requires OVHC for certain visa holders. Germany has mandatory public health insurance. Knowing the rules is step one.",
                color: "text-red-500",
                bg: "bg-red-50",
              },
              {
                icon: FileText,
                title: "Visa Compliance",
                desc: "Many visas — student, work, spouse — require proof of adequate insurance. Buying the wrong plan can jeopardise your visa. We show you regulator-approved insurers only.",
                color: "text-blue-500",
                bg: "bg-blue-50",
              },
              {
                icon: Users,
                title: "Local Plans Are Often Cheaper",
                desc: "International expat plans can cost 3–5× more than local insurance. In many countries, foreigners can buy local plans at the same price as residents — and get better coverage.",
                color: "text-green-500",
                bg: "bg-green-50",
              },
            ].map((item) => (
              <div key={item.title} className={`${item.bg} rounded-2xl p-6`}>
                <item.icon className={`w-8 h-8 ${item.color} mb-4`} />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Countries */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
            Compare Insurance in 12 Countries
          </h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Select your country of residence to compare local insurance providers.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {countries.map((country) => (
              <Link
                key={country.code}
                href={`/compare/health`}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-indigo-400 hover:shadow-md transition-all group"
              >
                <div className="text-3xl mb-3">{country.flag}</div>
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 mb-1">
                  {country.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2">{country.highlight}</p>
                <div className="inline-flex items-center gap-1 text-xs text-indigo-600 font-medium">
                  Regulated by {country.regulator}
                  <CheckCircle2 className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Insurance types */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Insurance Types for Foreigners
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Heart,
                title: "Health Insurance",
                color: "text-rose-500",
                bg: "bg-rose-50",
                border: "border-rose-200",
                href: "/compare/health",
                points: [
                  "Mandatory in UAE, Germany, Singapore for residents",
                  "Required for many student and work visas",
                  "Covers hospitalisation, OPD, specialist visits",
                  "Some plans cover pre-existing conditions after waiting period",
                ],
              },
              {
                icon: Plane,
                title: "Travel Insurance",
                color: "text-amber-500",
                bg: "bg-amber-50",
                border: "border-amber-200",
                href: "/compare/travel",
                points: [
                  "Essential for Schengen visa applications",
                  "Covers medical emergencies abroad",
                  "Trip cancellation and baggage cover",
                  "Available as single trip or annual multi-trip plans",
                ],
              },
              {
                icon: Shield,
                title: "Term Life Insurance",
                color: "text-indigo-500",
                bg: "bg-indigo-50",
                border: "border-indigo-200",
                href: "/compare/term-life",
                points: [
                  "Many countries allow expats to buy local life insurance",
                  "Protects dependents regardless of nationality",
                  "Premiums often lower than international expat plans",
                  "Check residency requirements per country",
                ],
              },
              {
                icon: Car,
                title: "Motor Insurance",
                color: "text-emerald-500",
                bg: "bg-emerald-50",
                border: "border-emerald-200",
                href: "/compare/motor",
                points: [
                  "Mandatory third-party cover in most countries",
                  "Foreign licence holders can usually buy local plans",
                  "Comprehensive cover recommended for expats",
                  "Check if international driving permit is required",
                ],
              },
            ].map((type) => (
              <div key={type.title} className={`border ${type.border} rounded-2xl p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`${type.bg} p-2 rounded-lg`}>
                    <type.icon className={`w-6 h-6 ${type.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{type.title}</h3>
                </div>
                <ul className="space-y-2 mb-5">
                  {type.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
                <Link
                  href={type.href}
                  className={`inline-flex items-center gap-2 text-sm font-medium ${type.color} hover:underline`}
                >
                  Compare {type.title} Plans <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-16 px-4 bg-indigo-900 text-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Foreigners Trust World Best Insurer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { stat: "12", label: "Countries Covered", sub: "India, US, UK, UAE, Singapore & more" },
              { stat: "100+", label: "Insurance Products", sub: "Verified from official insurer sources" },
              { stat: "Free", label: "Always Free to Use", sub: "No registration, no sales pressure" },
            ].map((item) => (
              <div key={item.label}>
                <div className="text-4xl font-bold text-blue-300 mb-2">{item.stat}</div>
                <div className="text-lg font-semibold mb-1">{item.label}</div>
                <div className="text-sm text-blue-200">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="border border-gray-200 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-start gap-2">
                  <Star className="w-5 h-5 text-indigo-500 mt-0.5 flex-shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm pl-7">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Start Comparing Insurance Providers Now
          </h2>
          <p className="text-gray-600 mb-8">
            Free, unbiased comparison for foreigners, expats, students, and visitors. No registration required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/compare/health"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl hover:bg-indigo-700 transition-colors"
            >
              <Heart className="w-5 h-5" />
              Compare Health Insurance
            </Link>
            <Link
              href="/compare/travel"
              className="inline-flex items-center gap-2 border border-indigo-600 text-indigo-600 font-semibold px-8 py-4 rounded-xl hover:bg-indigo-50 transition-colors"
            >
              <Plane className="w-5 h-5" />
              Compare Travel Insurance
            </Link>
          </div>
        </div>
      </section>

      {/* JSON-LD FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.a,
              },
            })),
          }),
        }}
      />
    </div>
  );
}
