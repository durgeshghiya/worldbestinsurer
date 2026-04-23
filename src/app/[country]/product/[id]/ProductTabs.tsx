"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  X,
  Shield,
  Clock,
  AlertTriangle,
  FileText,
  BarChart3,
  ChevronRight,
  Info,
} from "lucide-react";
import type { InsuranceProduct } from "@/lib/types";
import { formatCompact } from "@/lib/utils";

interface ProductTabsProps {
  product: InsuranceProduct;
  similarProducts: InsuranceProduct[];
}

type Tab = "overview" | "exclusions" | "claims" | "compare";

export default function ProductTabs({
  product: p,
  similarProducts,
}: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs: { id: Tab; label: string; icon: typeof Shield }[] = [
    { id: "overview", label: "Overview", icon: Shield },
    { id: "exclusions", label: "Exclusions & Waiting", icon: AlertTriangle },
    { id: "claims", label: "Claim Info", icon: FileText },
    { id: "compare", label: "Compare", icon: BarChart3 },
  ];

  return (
    <div>
      {/* Tab headers */}
      <div className="flex items-center gap-1 border-b border-border mb-6 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-3 text-[13px] font-medium border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-text-tertiary hover:text-text-secondary hover:border-border"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="min-h-[300px]">
        {/* OVERVIEW TAB */}
        {activeTab === "overview" && (
          <div className="space-y-6 animate-fade-in">
            {/* Key Inclusions */}
            {p.keyInclusions.length > 0 && (
              <div className="bg-surface rounded-2xl border border-border p-6">
                <h3 className="text-[15px] font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Check className="w-4 h-4 text-success" /> Key Inclusions
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {p.keyInclusions.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-[13px] text-text-secondary p-2 rounded-lg hover:bg-surface-sunken/50 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 text-success mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Features */}
            {p.specialFeatures.length > 0 && (
              <div className="bg-surface rounded-2xl border border-border p-6">
                <h3 className="text-[15px] font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" /> Special Features
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {p.specialFeatures.map((f) => (
                    <div
                      key={f}
                      className="flex items-start gap-2 text-[13px] text-text-secondary p-2 rounded-lg hover:bg-surface-sunken/50 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Riders */}
            {p.riders.length > 0 && (
              <div className="bg-surface rounded-2xl border border-border p-6">
                <h3 className="text-[15px] font-bold text-text-primary mb-4">
                  Riders / Add-ons
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {p.riders.map((r) => (
                    <div
                      key={r}
                      className="flex items-start gap-2 text-[13px] text-text-secondary p-2 rounded-lg hover:bg-surface-sunken/50 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* EXCLUSIONS & WAITING TAB */}
        {activeTab === "exclusions" && (
          <div className="space-y-6 animate-fade-in">
            {/* Exclusions */}
            {p.keyExclusions.length > 0 && (
              <div className="bg-surface rounded-2xl border border-border p-6">
                <h3 className="text-[15px] font-bold text-text-primary mb-4 flex items-center gap-2">
                  <X className="w-4 h-4 text-error" /> Key Exclusions
                </h3>
                <div className="space-y-2">
                  {p.keyExclusions.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2 text-[13px] text-text-secondary p-2 rounded-lg hover:bg-surface-sunken/50 transition-colors"
                    >
                      <X className="w-3.5 h-3.5 text-error mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Waiting Periods */}
            {p.waitingPeriod && (
              <div className="bg-surface rounded-2xl border border-border p-6">
                <h3 className="text-[15px] font-bold text-text-primary mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" /> Waiting Periods
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  <WaitingCard
                    label="Initial Waiting"
                    value={p.waitingPeriod.initial}
                    description="Time before any claims can be made"
                  />
                  <WaitingCard
                    label="Pre-existing Diseases"
                    value={p.waitingPeriod.preExisting}
                    description="Waiting for pre-existing conditions"
                  />
                  <WaitingCard
                    label="Specific Diseases"
                    value={p.waitingPeriod.specific}
                    description="Waiting for listed specific ailments"
                  />
                </div>
              </div>
            )}

            {p.keyExclusions.length === 0 && !p.waitingPeriod && (
              <div className="bg-surface rounded-2xl border border-border p-8 text-center">
                <Info className="w-8 h-8 text-text-tertiary mx-auto mb-3" />
                <p className="text-[14px] text-text-tertiary">
                  No exclusion or waiting period data available for this product.
                </p>
              </div>
            )}
          </div>
        )}

        {/* CLAIMS TAB */}
        {activeTab === "claims" && (
          <div className="space-y-6 animate-fade-in">
            {p.claimSettlement ? (
              <div className="bg-surface rounded-2xl border border-border p-6">
                <h3 className="text-[15px] font-bold text-text-primary mb-4 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Claim Settlement
                </h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {p.claimSettlement.ratio !== null && (
                    <div className="bg-surface-sunken rounded-xl p-4 text-center">
                      <p className="text-[28px] font-extrabold text-primary">
                        {p.claimSettlement.ratio}%
                      </p>
                      <p className="text-[11px] text-text-tertiary mt-1">
                        Claim Settlement Ratio
                      </p>
                    </div>
                  )}
                  {p.claimSettlement.year && (
                    <div className="bg-surface-sunken rounded-xl p-4 text-center">
                      <p className="text-[20px] font-bold text-text-primary">
                        {p.claimSettlement.year}
                      </p>
                      <p className="text-[11px] text-text-tertiary mt-1">
                        Reporting Year
                      </p>
                    </div>
                  )}
                  {p.claimSettlement.source && (
                    <div className="bg-surface-sunken rounded-xl p-4 text-center">
                      <p className="text-[13px] font-medium text-text-secondary leading-tight">
                        {p.claimSettlement.source}
                      </p>
                      <p className="text-[11px] text-text-tertiary mt-1">
                        Source
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-surface rounded-2xl border border-border p-8 text-center">
                <Info className="w-8 h-8 text-text-tertiary mx-auto mb-3" />
                <p className="text-[14px] text-text-tertiary">
                  Claim settlement information is not yet available for this product.
                </p>
              </div>
            )}

            {p.networkHospitals && (
              <div className="bg-surface rounded-2xl border border-border p-6">
                <h3 className="text-[15px] font-bold text-text-primary mb-3">
                  Network Hospitals
                </h3>
                <p className="text-[24px] font-extrabold text-primary">
                  {p.networkHospitals.count.toLocaleString()}
                </p>
                <p className="text-[11px] text-text-tertiary mt-1">
                  Source: {p.networkHospitals.source}
                </p>
              </div>
            )}
          </div>
        )}

        {/* COMPARE TAB */}
        {activeTab === "compare" && (
          <div className="animate-fade-in">
            {similarProducts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-[13px] border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-[11px] font-bold text-text-tertiary uppercase tracking-wide w-[140px]">
                        Feature
                      </th>
                      <th className="text-left py-3 px-4 text-[12px] font-bold text-primary bg-primary-light/30 rounded-tl-lg">
                        {p.productName}
                      </th>
                      {similarProducts.slice(0, 3).map((sp) => (
                        <th key={sp.id} className="text-left py-3 px-4 text-[12px] font-semibold text-text-primary">
                          {sp.productName}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <CompareRow
                      label="Insurer"
                      current={p.insurerName}
                      others={similarProducts.slice(0, 3).map((sp) => sp.insurerName)}
                    />
                    <CompareRow
                      label="Cover Range"
                      current={`${formatCompact(p.sumInsured.min, p.countryCode)} \u2013 ${formatCompact(p.sumInsured.max, p.countryCode)}`}
                      others={similarProducts.slice(0, 3).map(
                        (sp) =>
                          `${formatCompact(sp.sumInsured.min, sp.countryCode)} \u2013 ${formatCompact(sp.sumInsured.max, sp.countryCode)}`
                      )}
                    />
                    <CompareRow
                      label="Premium (yearly)"
                      current={`${formatCompact(p.premiumRange.illustrativeMin, p.countryCode)} \u2013 ${formatCompact(p.premiumRange.illustrativeMax, p.countryCode)}`}
                      others={similarProducts.slice(0, 3).map(
                        (sp) =>
                          `${formatCompact(sp.premiumRange.illustrativeMin, sp.countryCode)} \u2013 ${formatCompact(sp.premiumRange.illustrativeMax, sp.countryCode)}`
                      )}
                    />
                    <CompareRow
                      label="Entry Age"
                      current={`${p.eligibility.minAge} \u2013 ${p.eligibility.maxAge ?? "N/A"}`}
                      others={similarProducts
                        .slice(0, 3)
                        .map((sp) => `${sp.eligibility.minAge} \u2013 ${sp.eligibility.maxAge ?? "N/A"}`)}
                    />
                    <CompareRow
                      label="Renewability"
                      current={p.renewability}
                      others={similarProducts.slice(0, 3).map((sp) => sp.renewability)}
                    />
                    <CompareRow
                      label="Confidence"
                      current={p.confidenceScore}
                      others={similarProducts.slice(0, 3).map((sp) => sp.confidenceScore)}
                    />
                  </tbody>
                </table>
                <div className="mt-4 flex flex-wrap gap-2">
                  {similarProducts.slice(0, 3).map((sp) => (
                    <Link
                      key={sp.id}
                      href={`/${sp.countryCode}/product/${sp.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-[11px] font-semibold text-primary border border-primary/20 rounded-lg hover:bg-primary-light transition-colors"
                    >
                      View {sp.productName} <ChevronRight className="w-3 h-3" />
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-surface rounded-2xl border border-border p-8 text-center">
                <BarChart3 className="w-8 h-8 text-text-tertiary mx-auto mb-3" />
                <p className="text-[14px] text-text-tertiary">
                  No similar products available for comparison in this category and country.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function WaitingCard({
  label,
  value,
  description,
}: {
  label: string;
  value: string;
  description: string;
}) {
  return (
    <div className="bg-surface-sunken rounded-xl p-4">
      <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wide mb-1">
        {label}
      </p>
      <p className="text-[15px] font-bold text-text-primary mb-1">{value}</p>
      <p className="text-[10px] text-text-tertiary">{description}</p>
    </div>
  );
}

function CompareRow({
  label,
  current,
  others,
}: {
  label: string;
  current: string;
  others: string[];
}) {
  return (
    <tr className="border-b border-border-light hover:bg-surface-sunken/30 transition-colors">
      <td className="py-3 px-4 text-[11px] font-semibold text-text-tertiary uppercase tracking-wide">
        {label}
      </td>
      <td className="py-3 px-4 font-medium text-primary bg-primary-light/10">
        {current}
      </td>
      {others.map((val, i) => (
        <td key={i} className="py-3 px-4 text-text-secondary">
          {val}
        </td>
      ))}
    </tr>
  );
}
