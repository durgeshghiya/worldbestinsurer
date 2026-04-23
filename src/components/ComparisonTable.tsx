"use client";

import { useState } from "react";
import { Check, X, ExternalLink, AlertCircle, ArrowUpRight, ChevronDown } from "lucide-react";
import Link from "next/link";
import { cn, formatCompact, freshnessLabel } from "@/lib/utils";
import type { InsuranceProduct, Category } from "@/lib/types";

interface Props {
  products: InsuranceProduct[];
  category: Category;
}

export default function ComparisonTable({ products, category }: Props) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(products.slice(0, 3).map((p) => p.id))
  );
  const [expanded, setExpanded] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < 4) next.add(id);
      return next;
    });
  };

  const compared = products.filter((p) => selected.has(p.id));
  const isHealth = category === "health";

  return (
    <div>
      {/* Selector pills */}
      <div className="mb-5">
        <p className="text-[12px] font-medium text-text-secondary mb-2.5">
          Select up to 4 plans to compare
        </p>
        <div className="flex flex-wrap gap-1.5">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={cn(
                "px-3 py-1.5 text-[12px] rounded-lg border font-medium transition-all",
                selected.has(p.id)
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-surface text-text-secondary border-border hover:border-primary/30 hover:text-primary"
              )}
            >
              {p.productName}
            </button>
          ))}
        </div>
      </div>

      {compared.length < 2 ? (
        <div className="text-center py-16 text-text-tertiary">
          <p className="text-[14px]">Select at least 2 plans to compare</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0 pb-2">
          <table className="w-full min-w-[600px] text-[13px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-3 w-40 text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.06em]">
                  Feature
                </th>
                {compared.map((p) => {
                  const f = freshnessLabel(p.lastVerified);
                  return (
                    <th key={p.id} className="text-left p-3">
                      <p className="text-[11px] text-primary font-semibold mb-0.5">
                        {p.insurerName.split(" ").slice(0, 2).join(" ")}
                      </p>
                      <p className="text-[13px] font-semibold text-text-primary">{p.productName}</p>
                      <span className="flex items-center gap-1 mt-1 text-[10px] text-text-tertiary">
                        <span className={cn(
                          "w-1 h-1 rounded-full",
                          f.color === "green" && "bg-success",
                          f.color === "amber" && "bg-warning",
                          f.color === "red" && "bg-danger",
                        )} />
                        {f.label} &middot; {p.lastVerified}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              <Row label="Cover range" values={compared.map((p) => `${formatCompact(p.sumInsured.min, p.countryCode)} – ${formatCompact(p.sumInsured.max, p.countryCode)}`)} />
              <Row label="Premium*" values={compared.map((p) => `${formatCompact(p.premiumRange.illustrativeMin, p.countryCode)} – ${formatCompact(p.premiumRange.illustrativeMax, p.countryCode)}/yr`)} />
              <Row label="Entry age" values={compared.map((p) => `${p.eligibility.minAge} – ${p.eligibility.maxAge ?? "N/A"} yrs`)} />
              <Row label="Claim ratio" values={compared.map((p) => p.claimSettlement?.ratio ? `${p.claimSettlement.ratio}%` : "—")} />
              <Row label="Renewability" values={compared.map((p) => p.renewability)} />

              {isHealth && (
                <>
                  <Row label="Initial wait" values={compared.map((p) => p.waitingPeriod?.initial ?? "—")} />
                  <Row label="PED wait" values={compared.map((p) => p.waitingPeriod?.preExisting ?? "—")} highlight />
                  <Row label="Network hospitals" values={compared.map((p) => p.networkHospitals ? `${(p.networkHospitals.count / 1000).toFixed(0)}K+` : "—")} />
                </>
              )}

              {/* Riders */}
              <tr className="hover:bg-surface-sunken/50 transition-colors">
                <td className="p-3 text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.06em]">Riders</td>
                {compared.map((p) => (
                  <td key={p.id} className="p-3">
                    <ul className="space-y-1">
                      {p.riders.slice(0, 3).map((r) => (
                        <li key={r} className="flex items-start gap-1.5 text-[12px] text-text-secondary">
                          <Check className="w-3 h-3 text-success mt-0.5 shrink-0" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>

              {expanded && (
                <>
                  {/* Special features */}
                  <tr className="hover:bg-surface-sunken/50 transition-colors">
                    <td className="p-3 text-[11px] font-semibold text-text-tertiary uppercase tracking-[0.06em]">Features</td>
                    {compared.map((p) => (
                      <td key={p.id} className="p-3">
                        <ul className="space-y-1">
                          {p.specialFeatures.map((f) => (
                            <li key={f} className="flex items-start gap-1.5 text-[12px] text-text-secondary">
                              <Check className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  {/* Confidence */}
                  <Row label="Data confidence" values={compared.map((p) => p.confidenceScore.toUpperCase())} />
                </>
              )}

              {/* Actions */}
              <tr>
                <td className="p-3" />
                {compared.map((p) => (
                  <td key={p.id} className="p-3">
                    <div className="flex flex-col gap-1.5">
                      {(p as { quoteUrl?: string }).quoteUrl && (
                        <a
                          href={(p as { quoteUrl?: string }).quoteUrl!}
                          target="_blank"
                          rel="noopener noreferrer nofollow"
                          className="text-[11.5px] px-3 py-1.5 font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-1"
                        >
                          Get Quote <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <div className="flex gap-1.5">
                        <Link
                          href={`/product/${p.id}`}
                          className="text-[11.5px] px-3 py-1.5 font-medium bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center gap-1"
                        >
                          Details <ArrowUpRight className="w-3 h-3" />
                        </Link>
                        <a
                          href={p.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11.5px] px-2.5 py-1.5 border border-border rounded-lg hover:bg-surface-sunken transition-colors"
                          title="Source"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 mx-auto mt-4 px-4 py-2 text-[12px] font-medium text-text-secondary hover:text-primary border border-border rounded-lg hover:bg-surface-sunken transition-all"
          >
            {expanded ? "Show less" : "Show more details"}
            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", expanded && "rotate-180")} />
          </button>
        </div>
      )}

      {/* Disclaimer */}
      <div className="mt-5 p-3.5 bg-warning-light rounded-xl flex items-start gap-2.5">
        <AlertCircle className="w-4 h-4 text-warning mt-0.5 shrink-0" />
        <p className="text-[11.5px] text-warning leading-relaxed">
          *Premiums are illustrative only, sourced from publicly available data.
          Actual premiums vary by individual. World Best Insurer does not sell insurance. Verify
          with the insurer directly.
        </p>
      </div>
    </div>
  );
}

function Row({
  label,
  values,
  highlight = false,
}: {
  label: string;
  values: string[];
  highlight?: boolean;
}) {
  return (
    <tr className={cn("hover:bg-surface-sunken/50 transition-colors", highlight && "bg-primary-light/30")}>
      <td className="p-3 text-[12px] font-medium text-text-secondary">{label}</td>
      {values.map((v, i) => (
        <td key={i} className="p-3 text-[12.5px] text-text-primary font-medium">
          {v}
        </td>
      ))}
    </tr>
  );
}
