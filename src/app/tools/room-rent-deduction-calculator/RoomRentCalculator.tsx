"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Info,
  RotateCcw,
  Sparkles,
} from "lucide-react";

type LimitType = "1_percent" | "2_percent" | "fixed" | "no_limit";

const SUM_INSURED_PRESETS = [300000, 500000, 1000000, 1500000, 2500000];

export default function RoomRentCalculator() {
  const [sumInsured, setSumInsured] = useState<number>(500000);
  const [limitType, setLimitType] = useState<LimitType>("1_percent");
  const [fixedLimit, setFixedLimit] = useState<number>(5000);
  const [actualRoomRent, setActualRoomRent] = useState<number>(10000);
  const [days, setDays] = useState<number>(4);
  const [associatedExpenses, setAssociatedExpenses] = useState<number>(200000);
  const [nonScalableExpenses, setNonScalableExpenses] = useState<number>(150000);

  // Computed allowed room rent per day
  const allowedRoomRent = useMemo(() => {
    switch (limitType) {
      case "1_percent":
        return Math.round(sumInsured * 0.01);
      case "2_percent":
        return Math.round(sumInsured * 0.02);
      case "fixed":
        return fixedLimit;
      case "no_limit":
        return actualRoomRent;
      default:
        return Math.round(sumInsured * 0.01);
    }
  }, [limitType, sumInsured, fixedLimit, actualRoomRent]);

  // Calculations
  const results = useMemo(() => {
    const totalRoomBill = actualRoomRent * days;
    const allowedRoomBill = Math.min(allowedRoomRent, actualRoomRent) * days;
    const roomExcessDeduction = Math.max(0, totalRoomBill - allowedRoomBill);

    // Proportionate ratio: allowed room rent / actual room rent (capped at 1.0)
    const ratio = actualRoomRent > 0 ? Math.min(1, allowedRoomRent / actualRoomRent) : 1;

    // Associated expenses scaling
    const associatedAllowed = Math.round(associatedExpenses * ratio);
    const associatedCut = associatedExpenses - associatedAllowed;

    // Non-scalable expenses (Medicines, Implants, Consumables) - IRDAI mandates NO proportionate cut
    const nonScalableAllowed = nonScalableExpenses;
    const nonScalableCut = 0;

    const totalHospitalBill = totalRoomBill + associatedExpenses + nonScalableExpenses;
    const totalInsurerPays = allowedRoomBill + associatedAllowed + nonScalableAllowed;
    const totalDeduction = roomExcessDeduction + associatedCut;
    const percentageLost = totalHospitalBill > 0 ? (totalDeduction / totalHospitalBill) * 100 : 0;

    return {
      allowedRoomRent,
      totalRoomBill,
      allowedRoomBill,
      roomExcessDeduction,
      ratio,
      ratioPercentage: Math.round(ratio * 100),
      associatedAllowed,
      associatedCut,
      nonScalableAllowed,
      nonScalableCut,
      totalHospitalBill,
      totalInsurerPays,
      totalDeduction,
      percentageLost: Math.round(percentageLost),
      isBreached: actualRoomRent > allowedRoomRent && limitType !== "no_limit",
    };
  }, [allowedRoomRent, actualRoomRent, days, associatedExpenses, nonScalableExpenses, limitType]);

  const resetDefaults = () => {
    setSumInsured(500000);
    setLimitType("1_percent");
    setFixedLimit(5000);
    setActualRoomRent(10000);
    setDays(4);
    setAssociatedExpenses(200000);
    setNonScalableExpenses(150000);
  };

  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");

  return (
    <div className="w-full">
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left: Input Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-border-light">
              <h2 className="text-[17px] font-bold text-text-primary">1. Policy & Room Limits</h2>
              <button
                type="button"
                onClick={resetDefaults}
                className="inline-flex items-center gap-1.5 text-[12px] font-medium text-text-tertiary hover:text-primary transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>

            {/* Sum Insured */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[13px] font-semibold text-text-secondary">
                  Policy Sum Insured
                </label>
                <span className="text-[15px] font-bold text-primary tabular-nums">
                  {fmt(sumInsured)}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {SUM_INSURED_PRESETS.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setSumInsured(amt)}
                    className={`px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-all ${
                      sumInsured === amt
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-surface-sunken text-text-secondary hover:border-border-strong hover:text-text-primary"
                    }`}
                  >
                    {fmt(amt)}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min={100000}
                max={5000000}
                step={50000}
                value={sumInsured}
                onChange={(e) => setSumInsured(Number(e.target.value))}
                className="w-full h-2 bg-surface-sunken rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Room Limit Type */}
            <div>
              <label className="block text-[13px] font-semibold text-text-secondary mb-2">
                Room Rent Capping in Policy
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { id: "1_percent", label: "1% of Cover", sub: "Standard retail" },
                  { id: "2_percent", label: "2% of Cover", sub: "ICU or premium" },
                  { id: "fixed", label: "Fixed ₹ Limit", sub: "Per day cap" },
                  { id: "no_limit", label: "No Limit", sub: "Single private" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLimitType(item.id as LimitType)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      limitType === item.id
                        ? "border-primary bg-primary-light/40 shadow-sm"
                        : "border-border bg-surface-sunken hover:border-border-strong"
                    }`}
                  >
                    <p className={`text-[12.5px] font-bold ${limitType === item.id ? "text-primary" : "text-text-primary"}`}>
                      {item.label}
                    </p>
                    <p className="text-[10.5px] text-text-tertiary mt-0.5">{item.sub}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Fixed Limit input */}
            {limitType === "fixed" && (
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-1">
                  Fixed Daily Room Limit (₹)
                </label>
                <input
                  type="number"
                  value={fixedLimit}
                  onChange={(e) => setFixedLimit(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-[14px] text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}

            {/* Allowed daily rent readout */}
            <div className="p-3.5 rounded-xl bg-surface-sunken border border-border-light flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <span className="text-[12.5px] text-text-secondary">Your Policy Allows Up To:</span>
              </div>
              <span className="text-[15px] font-bold text-text-primary tabular-nums">
                {limitType === "no_limit" ? "No Cap (100% Covered)" : `${fmt(allowedRoomRent)} / day`}
              </span>
            </div>
          </div>

          {/* Actual Hospital Bill Breakdown */}
          <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm space-y-6">
            <h2 className="text-[17px] font-bold text-text-primary pb-3 border-b border-border-light">
              2. Hospital Bill Details
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-1">
                  Actual Room Rent Charged (₹ / day)
                </label>
                <input
                  type="number"
                  step={500}
                  value={actualRoomRent}
                  onChange={(e) => setActualRoomRent(Math.max(0, Number(e.target.value)))}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-[14px] font-medium text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-[12px] font-semibold text-text-secondary mb-1">
                  Days in Hospital
                </label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  value={days}
                  onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
                  className="w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-[14px] font-medium text-text-primary focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Associated Medical Expenses */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px] font-semibold text-text-secondary inline-flex items-center gap-1.5">
                  Associated Medical Expenses (₹)
                  <span
                    title="Surgeon fee, OT charges, anaesthetist, consultant visits, nursing charges. These ARE scaled down."
                    className="cursor-help text-text-tertiary"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </label>
                <span className="text-[13px] font-bold text-text-primary tabular-nums">
                  {fmt(associatedExpenses)}
                </span>
              </div>
              <p className="text-[11px] text-text-tertiary mb-2">
                Surgeon fee, OT charges, anaesthesia, nursing, doctor visits (subject to proportionate deduction).
              </p>
              <input
                type="range"
                min={0}
                max={1000000}
                step={10000}
                value={associatedExpenses}
                onChange={(e) => setAssociatedExpenses(Number(e.target.value))}
                className="w-full h-2 bg-surface-sunken rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Non-Scalable Expenses */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px] font-semibold text-text-secondary inline-flex items-center gap-1.5">
                  Non-Scalable Expenses (₹)
                  <span
                    title="Medicines, consumables, implants, stents, MRI/CT diagnostics. Under IRDAI rules, these CANNOT be scaled down."
                    className="cursor-help text-text-tertiary"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </span>
                </label>
                <span className="text-[13px] font-bold text-text-primary tabular-nums">
                  {fmt(nonScalableExpenses)}
                </span>
              </div>
              <p className="text-[11px] text-text-tertiary mb-2">
                Medicines, implants (stents/pacemakers), diagnostics, consumables (protected from scaling under IRDAI).
              </p>
              <input
                type="range"
                min={0}
                max={1000000}
                step={10000}
                value={nonScalableExpenses}
                onChange={(e) => setNonScalableExpenses(Number(e.target.value))}
                className="w-full h-2 bg-surface-sunken rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Right: Results Card (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div
            className={`rounded-2xl border p-6 shadow-md transition-all ${
              results.isBreached
                ? "border-amber-500/40 bg-gradient-to-b from-amber-500/[0.06] via-surface to-surface"
                : "border-emerald-500/40 bg-gradient-to-b from-emerald-500/[0.06] via-surface to-surface"
            }`}
          >
            {/* Status Header */}
            <div className="flex items-start gap-3 pb-4 border-b border-border-light">
              {results.isBreached ? (
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              <div>
                <h3 className="text-[16px] font-bold text-text-primary">
                  {results.isBreached
                    ? "Proportionate Deduction Triggered"
                    : "Zero Proportionate Deduction"}
                </h3>
                <p className="text-[12px] text-text-secondary mt-0.5">
                  {results.isBreached
                    ? `You chose a room exceeding your policy limit by ${fmt(actualRoomRent - allowedRoomRent)}/day.`
                    : "Your room rent is within your policy limit. No associated charges are scaled down."}
                </p>
              </div>
            </div>

            {/* Core Metrics */}
            <div className="py-6 space-y-4">
              <div className="p-4 rounded-xl bg-surface border border-border">
                <span className="block text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                  Out-of-Pocket Deduction
                </span>
                <span
                  className={`block text-[32px] font-extrabold tracking-tight mt-1 tabular-nums ${
                    results.isBreached ? "text-amber-600" : "text-emerald-600"
                  }`}
                >
                  {fmt(results.totalDeduction)}
                </span>
                {results.isBreached && (
                  <span className="block text-[12px] font-medium text-amber-700/80 mt-1">
                    {results.percentageLost}% of your total hospital bill is cut due to room choice!
                  </span>
                )}
              </div>

              {/* Progress Bar of Settlement */}
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-text-tertiary mb-1.5">
                  <span>Insurer Settlement Share</span>
                  <span>{results.totalHospitalBill > 0 ? Math.round((results.totalInsurerPays / results.totalHospitalBill) * 100) : 100}%</span>
                </div>
                <div className="w-full h-3 bg-surface-sunken rounded-full overflow-hidden flex">
                  <div
                    style={{
                      width: `${results.totalHospitalBill > 0 ? (results.totalInsurerPays / results.totalHospitalBill) * 100 : 100}%`,
                    }}
                    className="bg-emerald-500 h-full transition-all duration-500"
                  />
                  <div
                    style={{
                      width: `${results.totalHospitalBill > 0 ? (results.totalDeduction / results.totalHospitalBill) * 100 : 0}%`,
                    }}
                    className="bg-amber-500 h-full transition-all duration-500"
                  />
                </div>
                <div className="flex justify-between text-[10.5px] text-text-tertiary mt-1">
                  <span className="text-emerald-600 font-medium">Insurer pays: {fmt(results.totalInsurerPays)}</span>
                  <span className="text-amber-600 font-medium">You pay: {fmt(results.totalDeduction)}</span>
                </div>
              </div>

              {/* Detailed Breakdown List */}
              <div className="space-y-2.5 pt-2 text-[12.5px]">
                <div className="flex justify-between py-1 border-b border-border-light">
                  <span className="text-text-secondary">Total Hospital Bill</span>
                  <span className="font-semibold text-text-primary tabular-nums">{fmt(results.totalHospitalBill)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-light">
                  <span className="text-text-secondary">Proportionate Settlement Ratio</span>
                  <span className="font-semibold text-primary tabular-nums">{results.ratioPercentage}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-light">
                  <span className="text-text-secondary">Room Rent Excess Cut</span>
                  <span className="font-medium text-amber-600 tabular-nums">-{fmt(results.roomExcessDeduction)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border-light">
                  <span className="text-text-secondary">Surgeon & OT Charges Cut</span>
                  <span className="font-medium text-amber-600 tabular-nums">-{fmt(results.associatedCut)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-text-secondary">Medicines & Implants Cut (IRDAI Protected)</span>
                  <span className="font-medium text-emerald-600 tabular-nums">₹0 (100% Allowed)</span>
                </div>
              </div>
            </div>

            {/* Critical IRDAI Advisory Box */}
            <div className="p-4 rounded-xl bg-surface-sunken border border-border text-[12px] text-text-secondary space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-text-primary">
                <ShieldAlert className="w-4 h-4 text-primary shrink-0" />
                IRDAI Regulatory Protection
              </div>
              <p className="leading-[1.6]">
                Under the <strong>IRDAI Health Insurance Regulations & Master Circular</strong>, insurers are strictly
                prohibited from applying proportionate deduction to medicines, medical consumables, diagnostic charges,
                or implantable medical devices (such as cardiac stents or joint prostheses).
              </p>
              <p className="leading-[1.6]">
                If your insurer scaled down your pharmacy or implant bills, you can dispute the deduction with your insurer's
                Grievance Redressal Officer (GRO) and the Insurance Ombudsman.
              </p>
            </div>

            {/* Read the in-depth guide link */}
            <div className="pt-2">
              <Link
                href="/finance/room-rent-limit-proportionate-deduction-health-insurance/"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-[13px] font-semibold hover:bg-primary-hover transition-colors shadow-sm"
              >
                Read Complete Room Rent Guide
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
