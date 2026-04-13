import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCountryByCode, VALID_COUNTRY_CODES } from "@/lib/countries";
import { getProductsByCategory } from "@/lib/data";
import type { Category, InsuranceProduct } from "@/lib/types";
import FindMyPlanQuiz from "./FindMyPlanQuiz";

const validCategories = ["health", "term-life", "motor", "travel"];
const categoryLabels: Record<string, string> = {
  health: "Health Insurance",
  "term-life": "Term Life Insurance",
  motor: "Motor Insurance",
  travel: "Travel Insurance",
};

export async function generateStaticParams() {
  const params: { country: string; category: string }[] = [];
  for (const cc of VALID_COUNTRY_CODES) {
    for (const cat of validCategories) {
      params.push({ country: cc, category: cat });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; category: string }>;
}): Promise<Metadata> {
  const { country, category } = await params;
  const c = getCountryByCode(country);
  const label = categoryLabels[category];
  if (!c || !label) return {};
  return {
    title: `Find the Best ${label} for You — ${c.name}`,
    description: `Answer a few questions and get personalized ${label.toLowerCase()} recommendations from top insurers in ${c.name}. Free, no sign-up required.`,
  };
}

export default async function FindMyPlanPage({
  params,
}: {
  params: Promise<{ country: string; category: string }>;
}) {
  const { country, category } = await params;
  if (!validCategories.includes(category)) notFound();
  const c = getCountryByCode(country);
  if (!c) notFound();

  const products = getProductsByCategory(category as Category, country);
  const label = categoryLabels[category] ?? category;

  // Serialize products for the client component
  const serializedProducts = products.map((p) => ({
    id: p.id,
    productName: p.productName,
    insurerName: p.insurerName,
    insurerSlug: p.insurerSlug,
    category: p.category,
    countryCode: p.countryCode,
    premiumRange: p.premiumRange,
    sumInsured: p.sumInsured,
    eligibility: p.eligibility,
    claimSettlement: p.claimSettlement,
    networkHospitals: p.networkHospitals,
    specialFeatures: p.specialFeatures,
    riders: p.riders,
    renewability: p.renewability,
    confidenceScore: p.confidenceScore,
    waitingPeriod: p.waitingPeriod,
  }));

  return (
    <div className="mx-auto max-w-[700px] px-5 lg:px-8 py-10">
      <FindMyPlanQuiz
        products={serializedProducts as InsuranceProduct[]}
        category={category as Category}
        countryCode={country}
        countryName={c.name}
        currencySymbol={c.currency.symbol}
        categoryLabel={label}
      />
    </div>
  );
}
