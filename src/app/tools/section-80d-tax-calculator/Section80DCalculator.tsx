"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Shield,
  HelpCircle,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Sparkles,
  Calculator,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  FileCheck,
} from "lucide-react";

export default function Section80DCalculator() {
  // Self & Family
  const [selfAgeCategory, setSelfAgeCategory] = useState<"below_60" | "senior">("below_60");
  const [selfPremium, setSelfPremium] = useState<number>(22000);
  const [selfMedicalExpenses, setSelfMedicalExpenses] = useState<number>(0);

  // Parents
  const [parentsStatus, setParentsStatus] = useState<"below_60" | "senior" | "none">("senior");
  const [parentsPremium, setParentsPremium] = useState<number>(45000);
  const [parentsMedicalExpenses, setParentsMedicalExpenses] = useState<number>(0);

  // Preventive Health Checkup
  const [preventiveCheckup, setPreventiveCheckup] = useState<number>(5000);

  // Tax Profile
  const [taxRegime, setTaxRegime] = useState<"old" | "new">("old");
  const [taxSlab, setTaxSlab] = useState<number>(0.312); // 30% + 4% cess = 31.2%

  const calculations = useMemo(() => {
    // 1. Self & Family Cap
    const selfCap = selfAgeCategory === "senior" ? 50000 : 25000;
    
    // Eligible medical expenses for self (only valid if senior citizen)
    const validSelfMedical = selfAgeCategory === "senior" ? selfMedicalExpenses : 0;
    const rawSelfClaim = selfPremium + validSelfMedical;

    // 2. Parents Cap
    let parentsCap = 0;
    if (parentsStatus === "senior") parentsCap = 50000;
    else if (parentsStatus === "below_60") parentsCap = 25000;

    const validParentsMedical = parentsStatus === "senior" ? parentsMedicalExpenses : 0;
    const rawParentsClaim = parentsStatus !== "none" ? parentsPremium + validParentsMedical : 0;

    // 3. Preventive Checkup allocation
    // Overall cap of ₹5,000 across self and parents.
    const eligiblePreventive = Math.min(5000, preventiveCheckup);

    // Preventive checkup can be absorbed in self or parents bucket depending on headroom
    const selfRoomBeforePreventive = Math.max(0, selfCap - rawSelfClaim);
    const selfPreventiveUsed = Math.min(selfRoomBeforePreventive, eligiblePreventive);
    const remainingPreventive = eligiblePreventive - selfPreventiveUsed;

    const parentsRoomBeforePreventive = Math.max(0, parentsCap - rawParentsClaim);
    const parentsPreventiveUsed = Math.min(parentsRoomBeforePreventive, remainingPreventive);

    const actualSelfDeduction = Math.min(selfCap, rawSelfClaim + selfPreventiveUsed);
    const actualParentsDeduction = Math.min(parentsCap, rawParentsClaim + parentsPreventiveUsed);

    const totalDeductionClaimed = rawSelfClaim + rawParentsClaim + eligiblePreventive;
    const maxPossibleDeduction = selfCap + parentsCap;
    const totalEligibleDeduction = actualSelfDeduction + actualParentsDeduction;

    // Tax Saved Calculation
    const taxSavedOldRegime = Math.round(totalEligibleDeduction * taxSlab);
    const taxSavedNewRegime = 0; // Section 80D is strictly disallowed under New Tax Regime (Section 115BAC)

    const effectiveTaxSaved = taxRegime === "old" ? taxSavedOldRegime : taxSavedNewRegime;

    return {
      selfCap,
      parentsCap,
      maxPossibleDeduction,
      totalDeductionClaimed,
      actualSelfDeduction,
      actualParentsDeduction,
      totalEligibleDeduction,
      eligiblePreventive,
      selfPreventiveUsed,
      parentsPreventiveUsed,
      taxSavedOldRegime,
      taxSavedNewRegime,
      effectiveTaxSaved,
      selfUtilizationPct: Math.min(100, Math.round((actualSelfDeduction / selfCap) * 100)),
      parentsUtilizationPct: parentsCap > 0 ? Math.min(100, Math.round((actualParentsDeduction / parentsCap) * 100)) : 0,
    };
  }, [
    selfAgeCategory,
    selfPremium,
    selfMedicalExpenses,
    parentsStatus,
    parentsPremium,
    parentsMedicalExpenses,
    preventiveCheckup,
    taxRegime,
    taxSlab,
  ]);

  const handleReset = () => {
    setSelfAgeCategory("below_60");
    setSelfPremium(22000);
    setSelfMedicalExpenses(0);
    setParentsStatus("senior");
    setParentsPremium(45000);
    setParentsMedicalExpenses(0);
    setPreventiveCheckup(5000);
    setTaxRegime("old");
    setTaxSlab(0.312);
  };

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Input Controls */}
      <div className="lg:col-span-7 bg-surface rounded-2xl border border-border p-6 sm:p-8 space-y-7 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-border/80">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              Tax & Policy Inputs
            </h2>
            <p className="text-xs text-text-secondary mt-0.5">
              Income Tax Act Section 80D (Assessment Year 2025-26 & 2026-27)
            </p>
          </div>
          <button
            onClick={handleReset}
            className="text-xs text-text-secondary hover:text-primary flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-surface-sunken"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>

        {/* Tax Regime Selector */}
        <div className="p-4 rounded-xl bg-surface-sunken border border-border space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-text-primary">Income Tax Regime</span>
            <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-medium">
              {taxRegime === "old" ? "Deduction Allowed" : "No 80D in New Regime"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTaxRegime("old")}
              className={`py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all ${
                taxRegime === "old"
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface text-text-secondary hover:text-text-primary border border-border"
              }`}
            >
              Old Tax Regime (Claim 80D)
            </button>
            <button
              type="button"
              onClick={() => setTaxRegime("new")}
              className={`py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all ${
                taxRegime === "new"
                  ? "bg-warning text-white shadow-xs"
                  : "bg-surface text-text-secondary hover:text-text-primary border border-border"
              }`}
            >
              New Tax Regime (Section 115BAC)
            </button>
          </div>

          {taxRegime === "new" && (
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-warning/10 border border-warning/20 text-xs text-warning">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                <strong>Under the New Tax Regime, Section 80D deduction is ₹0.</strong> To claim deductions for health
                insurance, you must opt for the Old Tax Regime when filing your ITR.
              </span>
            </div>
          )}

          {/* Tax Slab Selection (Old Regime) */}
          {taxRegime === "old" && (
            <div className="pt-2">
              <label className="text-xs text-text-secondary block mb-1.5 font-medium">
                Your Income Tax Bracket (including 4% Health & Education cess):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "5% Slab (5.2%)", rate: 0.052 },
                  { label: "20% Slab (20.8%)", rate: 0.208 },
                  { label: "30% Slab (31.2%)", rate: 0.312 },
                ].map((slab) => (
                  <button
                    key={slab.rate}
                    type="button"
                    onClick={() => setTaxSlab(slab.rate)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium text-center border transition-all ${
                      taxSlab === slab.rate
                        ? "bg-surface text-primary border-primary font-bold shadow-xs"
                        : "bg-surface text-text-secondary border-border hover:border-text-secondary"
                    }`}
                  >
                    {slab.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 1: Self, Spouse & Children */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              <span>1. Self, Spouse & Dependent Children</span>
              <span className="text-xs font-normal text-text-secondary">
                (Max: {formatINR(calculations.selfCap)})
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelfAgeCategory("below_60")}
              className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                selfAgeCategory === "below_60"
                  ? "border-primary bg-primary/5 text-primary font-semibold"
                  : "border-border bg-surface text-text-secondary hover:text-text-primary"
              }`}
            >
              Below 60 Years (Cap ₹25,000)
            </button>
            <button
              type="button"
              onClick={() => setSelfAgeCategory("senior")}
              className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all ${
                selfAgeCategory === "senior"
                  ? "border-primary bg-primary/5 text-primary font-semibold"
                  : "border-border bg-surface text-text-secondary hover:text-text-primary"
              }`}
            >
              Senior Citizen 60+ (Cap ₹50,000)
            </button>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="text-text-secondary font-medium">Annual Health Insurance Premium Paid</label>
              <span className="font-semibold text-text-primary">{formatINR(selfPremium)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={60000}
              step={1000}
              value={selfPremium}
              onChange={(e) => setSelfPremium(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-surface-sunken rounded-lg cursor-pointer"
            />
          </div>

          {selfAgeCategory === "senior" && (
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <label className="text-text-secondary font-medium flex items-center gap-1">
                  <span>Medical Expenditure for Uninsured Senior Self</span>
                  <span title="Permitted only if you do NOT have a health insurance policy in force.">
                    <HelpCircle className="w-3 h-3 text-text-secondary/70" />
                  </span>
                </label>
                <span className="font-semibold text-text-primary">{formatINR(selfMedicalExpenses)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={50000}
                step={2000}
                value={selfMedicalExpenses}
                onChange={(e) => setSelfMedicalExpenses(Number(e.target.value))}
                className="w-full accent-primary h-1.5 bg-surface-sunken rounded-lg cursor-pointer"
              />
            </div>
          )}
        </div>

        {/* Section 2: Parents */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              <span>2. Parents (Father / Mother)</span>
              <span className="text-xs font-normal text-text-secondary">
                {parentsStatus === "none" ? "(Not Claiming)" : `(Max: ${formatINR(calculations.parentsCap)})`}
              </span>
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "senior", label: "Senior Citizens (60+)", cap: "Cap ₹50,000" },
              { id: "below_60", label: "Below 60 Years", cap: "Cap ₹25,000" },
              { id: "none", label: "Don't Claim", cap: "₹0" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setParentsStatus(p.id as any)}
                className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all ${
                  parentsStatus === p.id
                    ? "border-primary bg-primary/5 text-primary font-semibold"
                    : "border-border bg-surface text-text-secondary hover:text-text-primary"
                }`}
              >
                <div>{p.label}</div>
                <div className="text-[10px] text-text-secondary mt-0.5">{p.cap}</div>
              </button>
            ))}
          </div>

          {parentsStatus !== "none" && (
            <>
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <label className="text-text-secondary font-medium">Annual Premium Paid for Parents</label>
                  <span className="font-semibold text-text-primary">{formatINR(parentsPremium)}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={80000}
                  step={2000}
                  value={parentsPremium}
                  onChange={(e) => setParentsPremium(Number(e.target.value))}
                  className="w-full accent-primary h-1.5 bg-surface-sunken rounded-lg cursor-pointer"
                />
              </div>

              {parentsStatus === "senior" && (
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <label className="text-text-secondary font-medium flex items-center gap-1">
                      <span>Medical Bills for Uninsured Senior Parents</span>
                      <span title="If your senior citizen parents don't have health insurance, actual medical expenses qualify up to ₹50,000.">
                        <HelpCircle className="w-3 h-3 text-text-secondary/70" />
                      </span>
                    </label>
                    <span className="font-semibold text-text-primary">{formatINR(parentsMedicalExpenses)}</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={50000}
                    step={2000}
                    value={parentsMedicalExpenses}
                    onChange={(e) => setParentsMedicalExpenses(Number(e.target.value))}
                    className="w-full accent-primary h-1.5 bg-surface-sunken rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Section 3: Preventive Health Checkup */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
              <span>3. Preventive Health Checkup</span>
              <span className="text-xs font-normal text-text-secondary">(Max ₹5,000 overall limit)</span>
            </h3>
          </div>

          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <label className="text-text-secondary font-medium">
                Preventive Health Checkup Expense (Self, Family & Parents)
              </label>
              <span className="font-semibold text-text-primary">{formatINR(preventiveCheckup)}</span>
            </div>
            <input
              type="range"
              min={0}
              max={10000}
              step={500}
              value={preventiveCheckup}
              onChange={(e) => setPreventiveCheckup(Number(e.target.value))}
              className="w-full accent-primary h-1.5 bg-surface-sunken rounded-lg cursor-pointer"
            />
            <p className="text-[11px] text-text-secondary mt-1">
              * Note: Preventive checkup is within the overall ₹25,000 / ₹50,000 sub-limits, not an extra allowance. Cash
              payments are permitted for checkups.
            </p>
          </div>
        </div>
      </div>

      {/* Results & Tax Savings Breakdown */}
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-surface rounded-2xl border border-border p-6 sm:p-7 shadow-sm space-y-6">
          <div className="border-b border-border/80 pb-4">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary">
              Annual Tax Relief
            </span>
            <div className="mt-2 flex items-baseline justify-between">
              <div className="text-3xl sm:text-4xl font-extrabold text-primary tracking-tight">
                {formatINR(calculations.effectiveTaxSaved)}
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                Cash Saved / Yr
              </span>
            </div>
            <p className="text-xs text-text-secondary mt-1.5">
              Direct tax reduction into your bank account under the Old Tax Regime.
            </p>
          </div>

          {/* Breakdown summary */}
          <div className="space-y-3.5">
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary">Total Eligible 80D Deduction</span>
              <span className="font-bold text-text-primary text-base">
                {formatINR(calculations.totalEligibleDeduction)}
              </span>
            </div>

            <div className="w-full bg-surface-sunken rounded-full h-2 overflow-hidden flex">
              <div
                className="bg-primary h-full transition-all duration-300"
                style={{
                  width: `${(calculations.totalEligibleDeduction / (calculations.maxPossibleDeduction || 1)) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-text-secondary">
              <span>Claimed: {formatINR(calculations.totalDeductionClaimed)}</span>
              <span>Ceiling: {formatINR(calculations.maxPossibleDeduction)}</span>
            </div>

            {/* Category Buckets */}
            <div className="pt-3 space-y-2.5">
              <div className="p-3 rounded-xl bg-surface-sunken/60 border border-border/70 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-text-primary">Self, Spouse & Children</div>
                  <div className="text-text-secondary text-[11px]">
                    Cap: {formatINR(calculations.selfCap)} · Used: {calculations.selfUtilizationPct}%
                  </div>
                </div>
                <div className="font-bold text-text-primary">{formatINR(calculations.actualSelfDeduction)}</div>
              </div>

              {parentsStatus !== "none" && (
                <div className="p-3 rounded-xl bg-surface-sunken/60 border border-border/70 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-text-primary">Parents Coverage</div>
                    <div className="text-text-secondary text-[11px]">
                      Cap: {formatINR(calculations.parentsCap)} · Used: {calculations.parentsUtilizationPct}%
                    </div>
                  </div>
                  <div className="font-bold text-text-primary">{formatINR(calculations.actualParentsDeduction)}</div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-surface-sunken/60 border border-border/70 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-text-primary">Preventive Health Checkup</div>
                  <div className="text-text-secondary text-[11px]">Absorption within caps</div>
                </div>
                <div className="font-bold text-text-primary">
                  {formatINR(calculations.selfPreventiveUsed + calculations.parentsPreventiveUsed)}
                </div>
              </div>
            </div>
          </div>

          {/* Old vs New Tax Regime Verdict */}
          <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 space-y-2 text-xs">
            <div className="font-bold text-text-primary flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-primary" />
              Tax Regime Decision Insight
            </div>
            <p className="text-text-secondary leading-relaxed">
              If your family pays <strong>{formatINR(selfPremium + parentsPremium)}</strong> in health premiums, opting
              for the <strong>Old Tax Regime</strong> delivers a guaranteed tax refund of{" "}
              <strong>{formatINR(calculations.taxSavedOldRegime)}</strong>. Make sure your total 80C, 80D, and HRA
              deductions outweigh the lower baseline rates of the New Regime.
            </p>
          </div>
        </div>

        {/* Regulatory & Compliance Rules Card */}
        <div className="bg-surface rounded-2xl border border-border p-6 space-y-3.5 text-xs text-text-secondary">
          <h4 className="font-bold text-text-primary text-sm flex items-center gap-1.5">
            <FileCheck className="w-4 h-4 text-primary" />
            IRDAI & CBDT Compliance Rules
          </h4>
          <ul className="space-y-2 leading-relaxed">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>No Cash for Premiums:</strong> Premium payments made in cash are completely ineligible for
                Section 80D. Only Net Banking, UPI, Cards, or Cheques qualify.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Cash allowed for Checkups:</strong> Up to ₹5,000 paid for preventive checkups is allowed even if
                paid in cash.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
              <span>
                <strong>Section 80D Certificate:</strong> Download the annual 80D tax certificate from your insurer's
                portal before filing your Income Tax Return.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
