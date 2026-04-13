"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, CheckCircle2, Star, Shield } from "lucide-react";
import type { InsuranceProduct, Category } from "@/lib/types";
import { estimateAllPremiums, type PremiumInputs } from "@/lib/premium-engine";

interface QuizProps {
  products: InsuranceProduct[];
  category: Category;
  countryCode: string;
  countryName: string;
  currencySymbol: string;
  categoryLabel: string;
}

type Step = "age" | "family" | "budget" | "priority" | "results";

export default function FindMyPlanQuiz({
  products,
  category,
  countryCode,
  countryName,
  currencySymbol,
  categoryLabel,
}: QuizProps) {
  const [step, setStep] = useState<Step>("age");
  const [age, setAge] = useState(30);
  const [familyType, setFamilyType] = useState<"individual" | "couple" | "family" | "parents">("individual");
  const [budget, setBudget] = useState<"low" | "mid" | "high">("mid");
  const [priority, setPriority] = useState<"price" | "coverage" | "claim" | "features">("coverage");

  const steps: Step[] = category === "health"
    ? ["age", "family", "budget", "priority", "results"]
    : ["age", "budget", "priority", "results"];

  const currentIdx = steps.indexOf(step);
  const progress = ((currentIdx) / (steps.length - 1)) * 100;

  function next() {
    const idx = steps.indexOf(step);
    if (idx < steps.length - 1) setStep(steps[idx + 1]);
  }

  function back() {
    const idx = steps.indexOf(step);
    if (idx > 0) setStep(steps[idx - 1]);
  }

  // Score and rank products
  function getRecommendations() {
    const inputs: PremiumInputs = {
      age,
      familyType,
      sumInsuredTier: budget,
    };

    const estimates = estimateAllPremiums(products, inputs);

    // Score each product based on user priority
    const scored = estimates.map((est) => {
      const product = products.find((p) => p.id === est.productId)!;
      let score = 50; // base

      // Price score (lower is better)
      const priceRank = estimates.indexOf(est);
      const priceScore = 100 - (priceRank / estimates.length) * 100;

      // Coverage score
      const coverageScore =
        (product.sumInsured.max ?? 0) > 2000000 ? 90 :
        (product.sumInsured.max ?? 0) > 500000 ? 70 : 50;

      // Claim score
      const claimScore = product.claimSettlement?.ratio
        ? Math.min(100, product.claimSettlement.ratio)
        : 60;

      // Feature score
      const featureScore = Math.min(100, (product.specialFeatures.length + product.riders.length) * 8);

      // Weight by priority
      switch (priority) {
        case "price":
          score = priceScore * 0.5 + claimScore * 0.2 + coverageScore * 0.2 + featureScore * 0.1;
          break;
        case "coverage":
          score = coverageScore * 0.4 + claimScore * 0.3 + featureScore * 0.2 + priceScore * 0.1;
          break;
        case "claim":
          score = claimScore * 0.5 + coverageScore * 0.2 + featureScore * 0.2 + priceScore * 0.1;
          break;
        case "features":
          score = featureScore * 0.4 + coverageScore * 0.3 + claimScore * 0.2 + priceScore * 0.1;
          break;
      }

      return { ...est, product, score: Math.round(score) };
    });

    return scored.sort((a, b) => b.score - a.score).slice(0, 5);
  }

  const fmt = (n: number) => `${currencySymbol}${n.toLocaleString()}`;

  return (
    <div>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[24px] sm:text-[32px] font-bold text-text-primary tracking-tight mb-2">
          Find Your Best {categoryLabel}
        </h1>
        <p className="text-[14px] text-text-tertiary">
          {countryName} &middot; {products.length} plans analyzed
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100 rounded-full mb-8 overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step: Age */}
      {step === "age" && (
        <div className="text-center">
          <p className="text-[16px] font-semibold text-text-primary mb-6">How old are you?</p>
          <input
            type="number"
            min={18}
            max={80}
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
            className="mx-auto block w-32 px-4 py-3 text-[20px] text-center font-bold bg-surface border border-border rounded-xl outline-none focus:border-primary/40 text-text-primary"
          />
          <p className="text-[12px] text-text-tertiary mt-2">years old</p>
          <button onClick={next} className="mt-8 px-8 py-3 bg-gray-900 text-white text-[14px] font-medium rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Step: Family */}
      {step === "family" && (
        <div className="text-center">
          <p className="text-[16px] font-semibold text-text-primary mb-6">Who do you want to cover?</p>
          <div className="grid grid-cols-2 gap-3 max-w-[400px] mx-auto">
            {(["individual", "couple", "family", "parents"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setFamilyType(opt)}
                className={`p-4 rounded-xl border text-[13px] font-medium transition-all ${
                  familyType === opt
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-surface text-text-secondary hover:border-gray-300"
                }`}
              >
                {opt === "individual" ? "Just me" : opt === "couple" ? "Me + spouse" : opt === "family" ? "Family (2A+2C)" : "Parents"}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 mt-8">
            <button onClick={back} className="px-6 py-3 text-[13px] text-text-tertiary hover:text-text-primary transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={next} className="px-8 py-3 bg-gray-900 text-white text-[14px] font-medium rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step: Budget */}
      {step === "budget" && (
        <div className="text-center">
          <p className="text-[16px] font-semibold text-text-primary mb-6">What&apos;s your budget preference?</p>
          <div className="grid grid-cols-3 gap-3 max-w-[450px] mx-auto">
            {([
              { value: "low" as const, label: "Budget", desc: "Lower premium" },
              { value: "mid" as const, label: "Balanced", desc: "Best value" },
              { value: "high" as const, label: "Premium", desc: "Max coverage" },
            ]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setBudget(opt.value)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  budget === opt.value
                    ? "border-primary bg-primary/5"
                    : "border-border bg-surface hover:border-gray-300"
                }`}
              >
                <p className={`text-[13px] font-semibold ${budget === opt.value ? "text-primary" : "text-text-primary"}`}>{opt.label}</p>
                <p className="text-[10px] text-text-tertiary mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 mt-8">
            <button onClick={back} className="px-6 py-3 text-[13px] text-text-tertiary hover:text-text-primary transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={next} className="px-8 py-3 bg-gray-900 text-white text-[14px] font-medium rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
              Next <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step: Priority */}
      {step === "priority" && (
        <div className="text-center">
          <p className="text-[16px] font-semibold text-text-primary mb-6">What matters most to you?</p>
          <div className="grid grid-cols-2 gap-3 max-w-[400px] mx-auto">
            {([
              { value: "price" as const, label: "Lowest price" },
              { value: "coverage" as const, label: "Best coverage" },
              { value: "claim" as const, label: "Claim reliability" },
              { value: "features" as const, label: "Most features" },
            ]).map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPriority(opt.value)}
                className={`p-4 rounded-xl border text-[13px] font-medium transition-all ${
                  priority === opt.value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border bg-surface text-text-secondary hover:border-gray-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 mt-8">
            <button onClick={back} className="px-6 py-3 text-[13px] text-text-tertiary hover:text-text-primary transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button onClick={next} className="px-8 py-3 bg-gray-900 text-white text-[14px] font-medium rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
              Show Results <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step: Results */}
      {step === "results" && (
        <div>
          <div className="text-center mb-8">
            <CheckCircle2 className="w-10 h-10 text-success mx-auto mb-3" />
            <p className="text-[18px] font-bold text-text-primary">Your Top Recommendations</p>
            <p className="text-[12px] text-text-tertiary mt-1">
              Based on age {age}, {familyType}, {budget} budget, priority: {priority}
            </p>
          </div>

          <div className="space-y-3">
            {getRecommendations().map((rec, idx) => (
              <Link
                key={rec.productId}
                href={`/${countryCode}/product/${rec.productId}`}
                className="block p-5 bg-surface rounded-xl border border-border hover:border-primary/20 hover:shadow-sm transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-bold shrink-0 ${
                    idx === 0 ? "bg-primary text-white" : "bg-surface-sunken text-text-tertiary"
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                      {rec.insurerName}
                    </p>
                    <p className="text-[14px] font-bold text-text-primary group-hover:text-primary transition-colors">
                      {rec.productName}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-text-tertiary">
                      <span className="font-medium text-text-primary">
                        {fmt(rec.estimatedAnnual)}/yr
                      </span>
                      {rec.product.claimSettlement?.ratio && (
                        <span className="flex items-center gap-0.5">
                          <Shield className="w-3 h-3" /> {rec.product.claimSettlement.ratio}% CSR
                        </span>
                      )}
                      <span className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {rec.score}% match
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-primary shrink-0 mt-2" />
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3 mt-8">
            <button onClick={back} className="px-6 py-3 text-[13px] text-text-tertiary hover:text-text-primary transition-colors inline-flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" /> Change answers
            </button>
            <Link
              href={`/${countryCode}/compare/${category}`}
              className="px-6 py-3 text-[13px] text-primary font-medium hover:underline"
            >
              View all plans →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
