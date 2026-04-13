/**
 * Premium Estimation Engine
 *
 * Calculates estimated premiums from product data + user inputs.
 * Uses coefficient multipliers seeded from publicly available rate structures.
 * NOT exact quotes — clearly labelled as estimates.
 */

import type { InsuranceProduct, Category } from "./types";

export interface PremiumInputs {
  age: number;
  familyType: "individual" | "couple" | "family" | "parents";
  sumInsuredTier: "low" | "mid" | "high";
  // Motor-specific
  vehicleAge?: number;
  coverType?: "comprehensive" | "third-party";
  // Travel-specific
  tripDuration?: number;
  destination?: "asia" | "europe" | "americas" | "global";
  // Term-specific
  gender?: "male" | "female";
  smoker?: boolean;
  coverAmount?: number;
}

export interface PremiumEstimate {
  productId: string;
  productName: string;
  insurerName: string;
  estimatedAnnual: number;
  estimatedMonthly: number;
  confidence: "high" | "medium" | "low";
  assumptions: string;
}

/* ─── Age multiplier curves ─── */

const healthAgeMultiplier: Record<string, number> = {
  "18-25": 0.7,
  "26-30": 0.85,
  "31-35": 1.0,
  "36-40": 1.25,
  "41-45": 1.55,
  "46-50": 1.9,
  "51-55": 2.4,
  "56-60": 3.0,
  "61-65": 3.8,
  "66+": 4.5,
};

const termAgeMultiplier: Record<string, number> = {
  "18-25": 0.5,
  "26-30": 0.7,
  "31-35": 1.0,
  "36-40": 1.5,
  "41-45": 2.2,
  "46-50": 3.2,
  "51-55": 4.5,
  "56-60": 6.5,
};

function getAgeBucket(age: number): string {
  if (age <= 25) return "18-25";
  if (age <= 30) return "26-30";
  if (age <= 35) return "31-35";
  if (age <= 40) return "36-40";
  if (age <= 45) return "41-45";
  if (age <= 50) return "46-50";
  if (age <= 55) return "51-55";
  if (age <= 60) return "56-60";
  if (age <= 65) return "61-65";
  return "66+";
}

/* ─── Family type multipliers ─── */

const familyMultiplier: Record<string, number> = {
  individual: 1.0,
  couple: 1.7,
  family: 2.2,
  parents: 1.5,
};

/* ─── Sum insured tier multiplier ─── */

const sumInsuredMultiplier: Record<string, number> = {
  low: 0.7,
  mid: 1.0,
  high: 1.6,
};

/* ─── Main estimator ─── */

export function estimatePremium(
  product: InsuranceProduct,
  inputs: PremiumInputs
): PremiumEstimate {
  const basePremium =
    (product.premiumRange.illustrativeMin + product.premiumRange.illustrativeMax) / 2;

  let multiplier = 1.0;
  let assumptions = "";

  switch (product.category) {
    case "health": {
      const ageBucket = getAgeBucket(inputs.age);
      const ageMult = healthAgeMultiplier[ageBucket] ?? 1.0;
      const famMult = familyMultiplier[inputs.familyType] ?? 1.0;
      const siMult = sumInsuredMultiplier[inputs.sumInsuredTier] ?? 1.0;
      multiplier = ageMult * famMult * siMult;
      // Normalize to base age 31-35 individual mid
      multiplier = multiplier / (1.0 * 1.0 * 1.0);
      assumptions = `Age ${inputs.age} (${ageBucket}), ${inputs.familyType}, ${inputs.sumInsuredTier} sum insured`;
      break;
    }

    case "term-life": {
      const ageBucket = getAgeBucket(inputs.age);
      const ageMult = termAgeMultiplier[ageBucket] ?? 1.0;
      const genderMult = inputs.gender === "female" ? 0.82 : 1.0;
      const smokerMult = inputs.smoker ? 1.6 : 1.0;
      multiplier = ageMult * genderMult * smokerMult;
      assumptions = `Age ${inputs.age}, ${inputs.gender ?? "male"}, ${inputs.smoker ? "smoker" : "non-smoker"}`;
      break;
    }

    case "motor": {
      const vehicleAgeMult =
        (inputs.vehicleAge ?? 0) <= 1 ? 1.0 :
        (inputs.vehicleAge ?? 0) <= 3 ? 0.85 :
        (inputs.vehicleAge ?? 0) <= 5 ? 0.7 : 0.55;
      const coverMult = inputs.coverType === "third-party" ? 0.35 : 1.0;
      multiplier = vehicleAgeMult * coverMult;
      assumptions = `Vehicle ${inputs.vehicleAge ?? 0}yr old, ${inputs.coverType ?? "comprehensive"}`;
      break;
    }

    case "travel": {
      const durationMult =
        (inputs.tripDuration ?? 7) <= 7 ? 0.6 :
        (inputs.tripDuration ?? 7) <= 15 ? 1.0 :
        (inputs.tripDuration ?? 7) <= 30 ? 1.5 : 2.0;
      const destMult =
        inputs.destination === "asia" ? 0.7 :
        inputs.destination === "europe" ? 1.0 :
        inputs.destination === "americas" ? 1.2 : 1.3;
      multiplier = durationMult * destMult;
      assumptions = `${inputs.tripDuration ?? 7} days, ${inputs.destination ?? "global"}`;
      break;
    }
  }

  const estimated = Math.round(basePremium * multiplier);
  const confidence = product.premiumRange.isVerified ? "high" : "medium";

  return {
    productId: product.id,
    productName: product.productName,
    insurerName: product.insurerName,
    estimatedAnnual: estimated,
    estimatedMonthly: Math.round(estimated / 12),
    confidence,
    assumptions,
  };
}

/**
 * Estimate premiums for all products in a category, sorted by estimated cost.
 */
export function estimateAllPremiums(
  products: InsuranceProduct[],
  inputs: PremiumInputs
): PremiumEstimate[] {
  return products
    .map((p) => estimatePremium(p, inputs))
    .sort((a, b) => a.estimatedAnnual - b.estimatedAnnual);
}
