"use client";

import { useState } from "react";
import {
  Car,
  Shield,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Info,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NCB_TIERS = [
  { label: "0% (New Policy / Prior Claim)", value: 0 },
  { label: "20% (1 Claim-Free Year)", value: 20 },
  { label: "25% (2 Claim-Free Years)", value: 25 },
  { label: "35% (3 Claim-Free Years)", value: 35 },
  { label: "45% (4 Claim-Free Years)", value: 45 },
  { label: "50% (5+ Claim-Free Years)", value: 50 },
];

export default function NCBCalculator() {
  const [estimatedRepair, setEstimatedRepair] = useState<number>(12000);
  const [baseODPremium, setBaseODPremium] = useState<number>(18000);
  const [currentNCB, setCurrentNCB] = useState<number>(50);
  const [deductible, setDeductible] = useState<number>(1000);
  const [timeHorizon, setTimeHorizon] = useState<number>(2); // 1, 2, or 3 years

  // NCB Progression Ladder
  // Index 0 = 0%, 1 = 20%, 2 = 25%, 3 = 35%, 4 = 45%, 5 = 50%
  const getNextNCB = (current: number) => {
    switch (current) {
      case 0: return 20;
      case 20: return 25;
      case 25: return 35;
      case 35: return 45;
      case 45: return 50;
      case 50: return 50;
      default: return 0;
    }
  };

  // Scenario A: DO NOT CLAIM (Keep and grow NCB)
  // Year 1 next renewal discount
  const ncbNoClaimY1 = getNextNCB(currentNCB);
  const ncbNoClaimY2 = getNextNCB(ncbNoClaimY1);
  const ncbNoClaimY3 = getNextNCB(ncbNoClaimY2);

  const premiumNoClaimY1 = baseODPremium * (1 - ncbNoClaimY1 / 100);
  const premiumNoClaimY2 = baseODPremium * (1 - ncbNoClaimY2 / 100);
  const premiumNoClaimY3 = baseODPremium * (1 - ncbNoClaimY3 / 100);

  // Scenario B: CLAIM NOW (NCB resets to 0%)
  const ncbClaimY1 = 0;
  const ncbClaimY2 = 20;
  const ncbClaimY3 = 25;

  const premiumClaimY1 = baseODPremium * (1 - ncbClaimY1 / 100);
  const premiumClaimY2 = baseODPremium * (1 - ncbClaimY2 / 100);
  const premiumClaimY3 = baseODPremium * (1 - ncbClaimY3 / 100);

  // Insurer Payout
  const insurerPayout = Math.max(0, estimatedRepair - deductible);
  const userOutOfPocketIfClaim = Math.min(estimatedRepair, deductible);

  // Total NCB penalty based on selected horizon
  let totalNCBLoss = 0;
  if (timeHorizon === 1) {
    totalNCBLoss = premiumClaimY1 - premiumNoClaimY1;
  } else if (timeHorizon === 2) {
    totalNCBLoss = (premiumClaimY1 - premiumNoClaimY1) + (premiumClaimY2 - premiumNoClaimY2);
  } else {
    totalNCBLoss = (premiumClaimY1 - premiumNoClaimY1) + (premiumClaimY2 - premiumNoClaimY2) + (premiumClaimY3 - premiumNoClaimY3);
  }

  // Net Financial Benefit of Claiming vs Paying Out of Pocket
  // If we claim: we gain `insurerPayout`, but we lose `totalNCBLoss`.
  // Net Benefit = insurerPayout - totalNCBLoss
  const netAdvantageOfClaim = insurerPayout - totalNCBLoss;
  const shouldClaim = netAdvantageOfClaim > 0;

  return (
    <div className="bg-surface rounded-2xl border border-border shadow-sm p-6 sm:p-8">
      {/* Interactive Controls Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Left: Repair & Deductible */}
        <div className="space-y-6">
          <h3 className="text-[16px] font-bold text-text-primary flex items-center gap-2">
            <Car className="w-4 h-4 text-cyan-500" />
            1. Repair Cost &amp; Deductible
          </h3>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="ncb-repair-cost" className="text-[13px] font-medium text-text-secondary">
                Estimated Repair Cost (₹)
              </label>
              <span className="text-[14px] font-bold font-mono text-text-primary">
                ₹{estimatedRepair.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              id="ncb-repair-cost"
              type="range"
              min="2000"
              max="100000"
              step="1000"
              value={estimatedRepair}
              onChange={(e) => setEstimatedRepair(Number(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-text-tertiary mt-1">
              <span>₹2,000 (Minor scratch)</span>
              <span>₹50,000</span>
              <span>₹1,00,000 (Major)</span>
            </div>
          </div>

          <div>
            <label htmlFor="ncb-deductible" className="block text-[13px] font-medium text-text-secondary mb-1.5">
              Compulsory Deductible (₹)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[1000, 2000, 5000].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDeductible(d)}
                  className={cn(
                    "py-2 text-[12px] font-semibold rounded-xl border transition-all",
                    deductible === d
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-600 dark:text-cyan-400"
                      : "bg-surface-sunken border-border text-text-secondary hover:text-text-primary"
                  )}
                >
                  ₹{d.toLocaleString("en-IN")} {d === 1000 ? "(≤1500cc)" : d === 2000 ? "(>1500cc)" : ""}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Policy Premium & Current NCB */}
        <div className="space-y-6">
          <h3 className="text-[16px] font-bold text-text-primary flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            2. Policy &amp; Current NCB Discount
          </h3>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="ncb-base-premium" className="text-[13px] font-medium text-text-secondary">
                Annual Own Damage (OD) Premium (₹)
              </label>
              <span className="text-[14px] font-bold font-mono text-text-primary">
                ₹{baseODPremium.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              id="ncb-base-premium"
              type="range"
              min="4000"
              max="80000"
              step="1000"
              value={baseODPremium}
              onChange={(e) => setBaseODPremium(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <p className="text-[11px] text-text-tertiary mt-1">
              Base Own Damage component before NCB discount (excluding third-party premium).
            </p>
          </div>

          <div>
            <label htmlFor="ncb-current-tier" className="block text-[13px] font-medium text-text-secondary mb-1.5">
              Current NCB on Policy
            </label>
            <select
              id="ncb-current-tier"
              value={currentNCB}
              onChange={(e) => setCurrentNCB(Number(e.target.value))}
              className="w-full px-3 py-2 text-[13px] font-medium bg-surface-sunken border border-border rounded-xl focus:outline-none focus:border-primary text-text-primary"
            >
              {NCB_TIERS.map((tier) => (
                <option key={tier.value} value={tier.value}>
                  {tier.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="ncb-projection-window" className="block text-[13px] font-medium text-text-secondary mb-1.5">
              Impact Horizon Calculation
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { y: 1, label: "1 Year" },
                { y: 2, label: "2 Years (Recommended)" },
                { y: 3, label: "3 Years" },
              ].map((h) => (
                <button
                  key={h.y}
                  type="button"
                  onClick={() => setTimeHorizon(h.y)}
                  className={cn(
                    "py-2 text-[11.5px] font-semibold rounded-xl border transition-all text-center",
                    timeHorizon === h.y
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-surface-sunken border-border text-text-secondary hover:text-text-primary"
                  )}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* VERDICT BANNER */}
      <div
        className={cn(
          "p-6 rounded-2xl border mb-8 transition-all",
          shouldClaim
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-100"
            : "bg-amber-500/10 border-amber-500/30 text-amber-950 dark:text-amber-100"
        )}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                shouldClaim ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400" : "bg-amber-500/20 text-amber-600 dark:text-amber-400"
              )}
            >
              {shouldClaim ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider opacity-75">
                Mathematical Verdict ({timeHorizon}-Year Horizon)
              </span>
              <h4 className="text-[20px] font-extrabold tracking-tight mt-0.5">
                {shouldClaim ? "Recommendation: FILE THE CLAIM" : "Recommendation: PAY OUT OF POCKET"}
              </h4>
              <p className="text-[13px] opacity-90 mt-1 leading-relaxed max-w-xl">
                {shouldClaim ? (
                  <>
                    Filing the claim gives you a net financial benefit of{" "}
                    <strong>₹{Math.abs(netAdvantageOfClaim).toLocaleString("en-IN")}</strong>. The insurer payout
                    (₹{insurerPayout.toLocaleString("en-IN")}) significantly outweighs your lost renewal NCB discount
                    (₹{totalNCBLoss.toLocaleString("en-IN")}).
                  </>
                ) : (
                  <>
                    Filing a claim will cost you{" "}
                    <strong>₹{Math.abs(netAdvantageOfClaim).toLocaleString("en-IN")} MORE</strong> in lost NCB discounts
                    over {timeHorizon} year{timeHorizon > 1 ? "s" : ""} than the insurance company will pay you after
                    deductibles. Pay the ₹{estimatedRepair.toLocaleString("en-IN")} repair directly to preserve your bonus.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0 bg-surface/80 p-3.5 rounded-xl border border-border/40">
            <span className="text-[11px] text-text-tertiary block font-medium">Net Financial Delta</span>
            <span
              className={cn(
                "text-[22px] font-mono font-black",
                shouldClaim ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
              )}
            >
              {shouldClaim ? "+" : "-"}₹{Math.abs(netAdvantageOfClaim).toLocaleString("en-IN")}
            </span>
          </div>
        </div>
      </div>

      {/* DETAILED SIDE-BY-SIDE BREAKDOWN */}
      <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-border">
        {/* Option A: Claim */}
        <div className="p-5 rounded-xl bg-surface-sunken border border-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold text-text-primary">If You File Insurance Claim</span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-rose-500/10 text-rose-500">
              NCB Resets to 0%
            </span>
          </div>

          <div className="space-y-2.5 text-[12px]">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-text-secondary">Estimated Repair Bill:</span>
              <span className="font-mono text-text-primary">₹{estimatedRepair.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-text-secondary">Compulsory Deductible (Your Share):</span>
              <span className="font-mono text-rose-500">-₹{deductible.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50 font-semibold">
              <span className="text-text-primary">Immediate Insurer Payout:</span>
              <span className="font-mono text-emerald-500">+₹{insurerPayout.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-text-secondary">{timeHorizon}-Year Future Premium Penalty:</span>
              <span className="font-mono text-rose-500">-₹{totalNCBLoss.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between pt-2 font-bold text-[13px]">
              <span className="text-text-primary">Net Real Benefit:</span>
              <span className={cn("font-mono", shouldClaim ? "text-emerald-500" : "text-rose-500")}>
                {netAdvantageOfClaim >= 0 ? "+" : ""}₹{netAdvantageOfClaim.toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Option B: Pay Out of Pocket */}
        <div className="p-5 rounded-xl bg-surface-sunken border border-border">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] font-bold text-text-primary">If You Pay Out of Pocket</span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
              NCB Jumps to {ncbNoClaimY1}%
            </span>
          </div>

          <div className="space-y-2.5 text-[12px]">
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-text-secondary">Garage Repair Bill Paid:</span>
              <span className="font-mono text-rose-500">-₹{estimatedRepair.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-text-secondary">Next Renewal NCB Earned:</span>
              <span className="font-mono text-text-primary">{ncbNoClaimY1}% Discount</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50 font-semibold">
              <span className="text-text-primary">{timeHorizon}-Year Premium Savings Kept:</span>
              <span className="font-mono text-emerald-500">+₹{totalNCBLoss.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/50">
              <span className="text-text-secondary">Claim History on Record:</span>
              <span className="font-mono text-emerald-500">0 Claims (Clean)</span>
            </div>
            <div className="flex justify-between pt-2 font-bold text-[13px]">
              <span className="text-text-primary">Net Cost to You:</span>
              <span className="font-mono text-text-primary">
                ₹{(estimatedRepair - totalNCBLoss).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
