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
} from "lucide-react";

export default function HumanLifeValueCalculator() {
  const [currentAge, setCurrentAge] = useState<number>(32);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [monthlyExpense, setMonthlyExpense] = useState<number>(60000);
  const [outstandingLoans, setOutstandingLoans] = useState<number>(4000000); // Home loan / Car loan
  const [futureGoals, setFutureGoals] = useState<number>(3000000); // Children education / marriage
  const [existingSavings, setExistingSavings] = useState<number>(1500000); // Mutual funds, PF, deposits
  const [existingTermCover, setExistingTermCover] = useState<number>(5000000); // Existing life insurance
  const [inflationRate, setInflationRate] = useState<number>(6); // 6%
  const [returnRate, setReturnRate] = useState<number>(8); // 8%

  const calculations = useMemo(() => {
    const workingYears = Math.max(1, retirementAge - currentAge);
    const annualExpense = monthlyExpense * 12;

    // Real rate of return adjusted for inflation: (1 + r) / (1 + i) - 1
    const r = returnRate / 100;
    const inf = inflationRate / 100;
    const realRate = (1 + r) / (1 + inf) - 1;

    // Present Value of future living expenses annuity
    let livingExpenseCorpus = 0;
    if (Math.abs(realRate) < 0.0001) {
      livingExpenseCorpus = annualExpense * workingYears;
    } else {
      livingExpenseCorpus = annualExpense * ((1 - Math.pow(1 + realRate, -workingYears)) / realRate);
    }

    const totalFinancialObligations = Math.round(livingExpenseCorpus + outstandingLoans + futureGoals);
    const totalAvailableAssets = Math.round(existingSavings + existingTermCover);
    const rawDeficit = totalFinancialObligations - totalAvailableAssets;
    const netAdditionalCoverNeeded = Math.max(0, rawDeficit);

    // Rule of thumb comparison: 15x to 20x annual income / expenses
    const simpleMultiplierCover = annualExpense * 20 + outstandingLoans;

    // Rounded recommended cover to nearest 25 Lakhs
    const roundedRecommendedCover = Math.ceil(netAdditionalCoverNeeded / 2500000) * 2500000;
    const totalIdealCover = Math.ceil((livingExpenseCorpus + outstandingLoans + futureGoals - existingSavings) / 2500000) * 2500000;

    return {
      workingYears,
      annualExpense,
      livingExpenseCorpus: Math.round(livingExpenseCorpus),
      totalFinancialObligations,
      totalAvailableAssets,
      netAdditionalCoverNeeded,
      roundedRecommendedCover,
      totalIdealCover,
      simpleMultiplierCover,
      isFullyCovered: netAdditionalCoverNeeded === 0,
    };
  }, [
    currentAge,
    retirementAge,
    monthlyExpense,
    outstandingLoans,
    futureGoals,
    existingSavings,
    existingTermCover,
    inflationRate,
    returnRate,
  ]);

  const resetDefaults = () => {
    setCurrentAge(32);
    setRetirementAge(60);
    setMonthlyExpense(60000);
    setOutstandingLoans(4000000);
    setFutureGoals(3000000);
    setExistingSavings(1500000);
    setExistingTermCover(5000000);
    setInflationRate(6);
    setReturnRate(8);
  };

  const fmt = (n: number) => {
    if (n >= 10000000) {
      const cr = (n / 10000000).toFixed(2);
      return `₹${cr.replace(/\.00$/, "")} Crore`;
    }
    if (n >= 100000) {
      const l = (n / 100000).toFixed(2);
      return `₹${l.replace(/\.00$/, "")} Lakh`;
    }
    return "₹" + n.toLocaleString("en-IN");
  };

  return (
    <div className="w-full">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border-light">
              <h2 className="text-[17px] font-bold text-text-primary">1. Family Profile & Living Expenses</h2>
              <button
                type="button"
                onClick={resetDefaults}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-text-tertiary hover:text-primary transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[12.5px] font-semibold text-text-secondary mb-1">
                  Current Age: <span className="text-primary font-bold">{currentAge} years</span>
                </label>
                <input
                  type="range"
                  min={18}
                  max={65}
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full h-2 bg-surface-sunken rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <label className="block text-[12.5px] font-semibold text-text-secondary mb-1">
                  Target Retirement Age: <span className="text-primary font-bold">{retirementAge} years</span>
                </label>
                <input
                  type="range"
                  min={currentAge + 1}
                  max={75}
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(Number(e.target.value))}
                  className="w-full h-2 bg-surface-sunken rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>

            {/* Monthly Household Expense */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12.5px] font-semibold text-text-secondary">
                  Monthly Household Living Expenses (excluding EMIs)
                </label>
                <span className="text-[14px] font-bold text-primary tabular-nums">
                  {fmt(monthlyExpense)} / mo
                </span>
              </div>
              <p className="text-[11px] text-text-tertiary mb-2">
                Groceries, utilities, school fees, lifestyle, medical bills. Annual: {fmt(monthlyExpense * 12)}/year.
              </p>
              <input
                type="range"
                min={20000}
                max={500000}
                step={5000}
                value={monthlyExpense}
                onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                className="w-full h-2 bg-surface-sunken rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          {/* Liabilities & Future Goals */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-6">
            <h2 className="text-[17px] font-bold text-text-primary pb-3 border-b border-border-light">
              2. Debts, Loans & Children's Goals
            </h2>

            {/* Outstanding Debts */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12.5px] font-semibold text-text-secondary">
                  Total Outstanding Debts & Liabilities
                </label>
                <span className="text-[14px] font-bold text-text-primary tabular-nums">
                  {fmt(outstandingLoans)}
                </span>
              </div>
              <p className="text-[11px] text-text-tertiary mb-2">
                Home loans, vehicle loans, personal loans. Your family must clear these immediately.
              </p>
              <input
                type="range"
                min={0}
                max={20000000}
                step={250000}
                value={outstandingLoans}
                onChange={(e) => setOutstandingLoans(Number(e.target.value))}
                className="w-full h-2 bg-surface-sunken rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Future Milestone Goals */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12.5px] font-semibold text-text-secondary">
                  Future Milestone Goals (Children's College & Wedding)
                </label>
                <span className="text-[14px] font-bold text-text-primary tabular-nums">
                  {fmt(futureGoals)}
                </span>
              </div>
              <p className="text-[11px] text-text-tertiary mb-2">
                Estimated lump-sum funds needed for children&apos;s higher education, university abroad, or marriage.
              </p>
              <input
                type="range"
                min={0}
                max={15000000}
                step={250000}
                value={futureGoals}
                onChange={(e) => setFutureGoals(Number(e.target.value))}
                className="w-full h-2 bg-surface-sunken rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          {/* Current Assets & Existing Cover */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-6">
            <h2 className="text-[17px] font-bold text-text-primary pb-3 border-b border-border-light">
              3. Existing Assets & Current Cover
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-1">
                  Existing Liquid Investments (₹)
                </label>
                <p className="text-[11px] text-text-tertiary mb-1.5">
                  Mutual funds, stocks, PF, FDs (exclude primary residence).
                </p>
                <input
                  type="number"
                  step={100000}
                  value={existingSavings}
                  onChange={(e) => setExistingSavings(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-[14px] font-medium text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-1">
                  Existing Term Life Cover (₹)
                </label>
                <p className="text-[11px] text-text-tertiary mb-1.5">
                  Active pure term insurance policies already in place.
                </p>
                <input
                  type="number"
                  step={500000}
                  value={existingTermCover}
                  onChange={(e) => setExistingTermCover(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-[14px] font-medium text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Output Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-b from-primary/[0.05] via-surface to-surface p-6 shadow-md">
            <div className="flex items-center gap-3 pb-4 border-b border-border-light">
              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                  Human Life Value Result
                </span>
                <h3 className="text-[17px] font-bold text-text-primary">
                  Recommended Term Insurance Cover
                </h3>
              </div>
            </div>

            {/* Core Recommendation Display */}
            <div className="py-6 space-y-4">
              <div className="p-5 rounded-2xl bg-surface border border-border shadow-sm text-center">
                <span className="text-[12px] font-semibold text-text-tertiary block">
                  {calculations.isFullyCovered
                    ? "Your Family Is Fully Protected"
                    : "Additional Cover You Need to Buy"}
                </span>
                <span className="text-[34px] sm:text-[40px] font-black text-primary block mt-1 tracking-tight tabular-nums">
                  {calculations.isFullyCovered
                    ? "Adequately Covered"
                    : fmt(calculations.roundedRecommendedCover)}
                </span>
                <span className="text-[12px] text-text-secondary mt-1 block">
                  Total Ideal Cover: <strong>{fmt(calculations.totalIdealCover)}</strong> across all policies
                </span>
              </div>

              {/* Breakdown Table */}
              <div className="space-y-2.5 text-[12.5px] pt-2">
                <div className="flex justify-between py-1 border-b border-border-light">
                  <span className="text-text-secondary">Years of Income Replacement</span>
                  <span className="font-semibold text-text-primary tabular-nums">
                    {calculations.workingYears} years (until age {retirementAge})
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-light">
                  <span className="text-text-secondary">Family Living Expenses Corpus</span>
                  <span className="font-semibold text-text-primary tabular-nums">
                    {fmt(calculations.livingExpenseCorpus)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-light">
                  <span className="text-text-secondary">Debts & Loans Payoff</span>
                  <span className="font-semibold text-text-primary tabular-nums">
                    +{fmt(outstandingLoans)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-light">
                  <span className="text-text-secondary">Future Milestones (College/Marriage)</span>
                  <span className="font-semibold text-text-primary tabular-nums">
                    +{fmt(futureGoals)}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-light text-emerald-600">
                  <span>Less: Existing Savings & Investments</span>
                  <span className="font-medium tabular-nums">-{fmt(existingSavings)}</span>
                </div>
                <div className="flex justify-between py-1 text-emerald-600">
                  <span>Less: Existing Term Cover Active</span>
                  <span className="font-medium tabular-nums">-{fmt(existingTermCover)}</span>
                </div>
              </div>
            </div>

            {/* Quick Summary Tip */}
            <div className="p-4 rounded-xl bg-surface-sunken border border-border text-[12px] text-text-secondary space-y-1.5">
              <div className="font-bold text-text-primary flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                The Golden Rule of Term Insurance
              </div>
              <p className="leading-[1.6]">
                Never buy term life insurance up to age 85 or 100. Buy cover only until your working retirement age (age 60 or 65),
                by which time your home loans are paid and children are financially independent. Whole-life term plans cost 2x to 3x
                more with zero added utility.
              </p>
            </div>

            {/* CTA to compare term plans */}
            <div className="pt-4">
              <Link
                href="/compare/term-life/"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-white text-[13px] font-semibold hover:bg-primary-hover transition-colors shadow-sm"
              >
                Compare Top Term Life Plans
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
