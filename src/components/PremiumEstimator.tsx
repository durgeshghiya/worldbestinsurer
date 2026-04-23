"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Calculator, ArrowRight, Info } from "lucide-react";
import type { InsuranceProduct, Category } from "@/lib/types";
import { estimateAllPremiums, type PremiumInputs } from "@/lib/premium-engine";

interface PremiumEstimatorProps {
  products: InsuranceProduct[];
  category: Category;
  countryCode: string;
  currencySymbol: string;
}

export default function PremiumEstimator({
  products,
  category,
  countryCode,
  currencySymbol,
}: PremiumEstimatorProps) {
  const [age, setAge] = useState(30);
  const [familyType, setFamilyType] = useState<"individual" | "couple" | "family" | "parents">("individual");
  const [sumInsuredTier, setSumInsuredTier] = useState<"low" | "mid" | "high">("mid");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [smoker, setSmoker] = useState(false);
  const [vehicleAge, setVehicleAge] = useState(1);
  const [coverType, setCoverType] = useState<"comprehensive" | "third-party">("comprehensive");
  const [tripDuration, setTripDuration] = useState(7);
  const [destination, setDestination] = useState<"asia" | "europe" | "americas" | "global">("asia");
  const [showResults, setShowResults] = useState(false);

  const inputs: PremiumInputs = useMemo(
    () => ({
      age,
      familyType,
      sumInsuredTier,
      gender,
      smoker,
      vehicleAge,
      coverType,
      tripDuration,
      destination,
    }),
    [age, familyType, sumInsuredTier, gender, smoker, vehicleAge, coverType, tripDuration, destination]
  );

  const estimates = useMemo(() => {
    if (!showResults) return [];
    return estimateAllPremiums(products, inputs);
  }, [showResults, inputs, products]);

  const fmt = (n: number) => `${currencySymbol}${n.toLocaleString()}`;

  return (
    <div className="bg-surface rounded-2xl border border-border p-5 sm:p-6 mb-10">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-primary" />
        <h2 className="text-[16px] font-bold text-text-primary">
          Estimate Your Premium
        </h2>
      </div>
      <p className="text-[12px] text-text-tertiary mb-5">
        Adjust the inputs below to see estimated premiums for each plan.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
        {/* Age */}
        <div>
          <label className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1">
            Age
          </label>
          <input
            type="number"
            min={18}
            max={80}
            value={age}
            onChange={(e) => { setAge(Number(e.target.value)); setShowResults(false); }}
            className="w-full px-3 py-2 text-[13px] bg-surface-sunken border border-border rounded-lg outline-none focus:border-primary/30 text-text-primary"
          />
        </div>

        {/* Health-specific inputs */}
        {category === "health" && (
          <>
            <div>
              <label className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1">
                Cover for
              </label>
              <select
                value={familyType}
                onChange={(e) => { setFamilyType(e.target.value as typeof familyType); setShowResults(false); }}
                className="w-full px-3 py-2 text-[13px] bg-surface-sunken border border-border rounded-lg outline-none focus:border-primary/30 text-text-primary"
              >
                <option value="individual">Individual</option>
                <option value="couple">Couple</option>
                <option value="family">Family (2A + 2C)</option>
                <option value="parents">Parents</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1">
                Sum Insured
              </label>
              <select
                value={sumInsuredTier}
                onChange={(e) => { setSumInsuredTier(e.target.value as typeof sumInsuredTier); setShowResults(false); }}
                className="w-full px-3 py-2 text-[13px] bg-surface-sunken border border-border rounded-lg outline-none focus:border-primary/30 text-text-primary"
              >
                <option value="low">Basic</option>
                <option value="mid">Standard</option>
                <option value="high">Premium</option>
              </select>
            </div>
          </>
        )}

        {/* Term life inputs */}
        {category === "term-life" && (
          <>
            <div>
              <label className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => { setGender(e.target.value as typeof gender); setShowResults(false); }}
                className="w-full px-3 py-2 text-[13px] bg-surface-sunken border border-border rounded-lg outline-none focus:border-primary/30 text-text-primary"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1">
                Smoker
              </label>
              <select
                value={smoker ? "yes" : "no"}
                onChange={(e) => { setSmoker(e.target.value === "yes"); setShowResults(false); }}
                className="w-full px-3 py-2 text-[13px] bg-surface-sunken border border-border rounded-lg outline-none focus:border-primary/30 text-text-primary"
              >
                <option value="no">Non-smoker</option>
                <option value="yes">Smoker</option>
              </select>
            </div>
          </>
        )}

        {/* Motor inputs */}
        {category === "motor" && (
          <>
            <div>
              <label className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1">
                Vehicle Age (years)
              </label>
              <input
                type="number"
                min={0}
                max={20}
                value={vehicleAge}
                onChange={(e) => { setVehicleAge(Number(e.target.value)); setShowResults(false); }}
                className="w-full px-3 py-2 text-[13px] bg-surface-sunken border border-border rounded-lg outline-none focus:border-primary/30 text-text-primary"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1">
                Cover Type
              </label>
              <select
                value={coverType}
                onChange={(e) => { setCoverType(e.target.value as typeof coverType); setShowResults(false); }}
                className="w-full px-3 py-2 text-[13px] bg-surface-sunken border border-border rounded-lg outline-none focus:border-primary/30 text-text-primary"
              >
                <option value="comprehensive">Comprehensive</option>
                <option value="third-party">Third-party only</option>
              </select>
            </div>
          </>
        )}

        {/* Travel inputs */}
        {category === "travel" && (
          <>
            <div>
              <label className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1">
                Trip Duration (days)
              </label>
              <input
                type="number"
                min={1}
                max={365}
                value={tripDuration}
                onChange={(e) => { setTripDuration(Number(e.target.value)); setShowResults(false); }}
                className="w-full px-3 py-2 text-[13px] bg-surface-sunken border border-border rounded-lg outline-none focus:border-primary/30 text-text-primary"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider block mb-1">
                Destination
              </label>
              <select
                value={destination}
                onChange={(e) => { setDestination(e.target.value as typeof destination); setShowResults(false); }}
                className="w-full px-3 py-2 text-[13px] bg-surface-sunken border border-border rounded-lg outline-none focus:border-primary/30 text-text-primary"
              >
                <option value="asia">Asia</option>
                <option value="europe">Europe / Schengen</option>
                <option value="americas">Americas</option>
                <option value="global">Global</option>
              </select>
            </div>
          </>
        )}
      </div>

      <button
        onClick={() => setShowResults(true)}
        className="px-6 py-2.5 text-[13px] font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        Estimate Premiums
      </button>

      {/* Results */}
      {showResults && estimates.length > 0 && (
        <div className="mt-6 border-t border-border pt-5">
          <div className="flex items-center gap-1.5 mb-4">
            <Info className="w-3.5 h-3.5 text-text-tertiary" />
            <p className="text-[11px] text-text-tertiary">
              Estimates based on {estimates[0]?.assumptions}. Actual premiums may vary.
            </p>
          </div>

          <div className="space-y-2">
            {estimates.slice(0, 10).map((est, idx) => (
              <Link
                key={est.productId}
                href={`/${countryCode}/product/${est.productId}`}
                className="flex items-center gap-4 p-3 bg-surface-sunken/50 rounded-xl hover:bg-surface-sunken transition-colors group"
              >
                <span className="text-[11px] font-bold text-text-tertiary w-5 text-center">
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text-primary group-hover:text-primary truncate">
                    {est.productName}
                  </p>
                  <p className="text-[11px] text-text-tertiary">{est.insurerName}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[14px] font-bold text-text-primary">
                    {fmt(est.estimatedAnnual)}<span className="text-[10px] font-normal text-text-tertiary">/yr</span>
                  </p>
                  <p className="text-[10px] text-text-tertiary">
                    {fmt(est.estimatedMonthly)}/mo
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-text-tertiary group-hover:text-primary shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
