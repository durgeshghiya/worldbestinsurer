"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, ArrowUpDown, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InsurerRow, HQData } from "@/lib/insights";

type SortField = "csr" | "productCount" | "networkHospitals" | "established";

const sortLabels: Record<SortField, string> = {
  csr: "CSR",
  productCount: "Products",
  networkHospitals: "Hospitals",
  established: "Established",
};

export default function InsurerLandscape({
  insurers,
  hqData,
}: {
  insurers: InsurerRow[];
  hqData: HQData[];
}) {
  const [sortBy, setSortBy] = useState<SortField>("csr");
  const [showAll, setShowAll] = useState(false);

  const sorted = [...insurers].sort((a, b) => {
    if (sortBy === "established") return a.established - b.established;
    const aVal = a[sortBy] ?? 0;
    const bVal = b[sortBy] ?? 0;
    return (bVal as number) - (aVal as number);
  });

  const displayed = showAll ? sorted : sorted.slice(0, 12);

  return (
    <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
      <div className="flex items-center gap-2.5 mb-2">
        <Building2 className="w-5 h-5 text-primary" />
        <h2 className="text-[22px] sm:text-[28px] font-bold text-text-primary tracking-[-0.02em]">
          Insurer Landscape
        </h2>
      </div>
      <p className="text-[13px] text-text-secondary mb-6 max-w-2xl">
        {insurers.length} insurers operating in the Indian market. Sort by key metrics below.
      </p>

      {/* Sort buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(sortLabels) as SortField[]).map((field) => (
          <button
            key={field}
            onClick={() => setSortBy(field)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium rounded-lg border transition-all",
              sortBy === field
                ? "bg-primary text-white border-primary"
                : "bg-surface text-text-secondary border-border hover:border-primary/30"
            )}
          >
            <ArrowUpDown className="w-3 h-3" />
            {sortLabels[field]}
          </button>
        ))}
      </div>

      {/* Insurer grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        {displayed.map((ins, i) => (
          <Link
            key={ins.slug}
            href={`/insurer/${ins.slug}`}
            className="bg-surface rounded-xl border border-border p-4 hover:border-primary/20 hover:shadow-sm transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-[13px] font-semibold text-text-primary group-hover:text-primary transition-colors">
                  {ins.shortName}
                </div>
                <div className="text-[10px] text-text-tertiary mt-0.5">
                  {ins.type} &middot; Est. {ins.established} &middot; {ins.headquarters}
                </div>
              </div>
              <span className="text-[10px] font-medium text-text-tertiary bg-surface-sunken px-2 py-0.5 rounded-full">
                #{i + 1}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <div className="text-[10px] text-text-tertiary">CSR</div>
                <div className="text-[14px] font-bold text-text-primary">{ins.csr > 0 ? `${ins.csr}%` : "N/A"}</div>
              </div>
              <div>
                <div className="text-[10px] text-text-tertiary">Products</div>
                <div className="text-[14px] font-bold text-text-primary">{ins.productCount}</div>
              </div>
              <div>
                <div className="text-[10px] text-text-tertiary">Hospitals</div>
                <div className="text-[14px] font-bold text-text-primary">
                  {ins.networkHospitals ? ins.networkHospitals.toLocaleString() : "—"}
                </div>
              </div>
            </div>
            {ins.listed && (
              <div className="mt-2 text-[9px] text-text-tertiary font-medium">
                BSE/NSE Listed
              </div>
            )}
          </Link>
        ))}
      </div>

      {insurers.length > 12 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-1.5 mx-auto text-[12px] font-medium text-primary hover:text-primary-hover transition-colors"
        >
          {showAll ? (
            <>Show less <ChevronUp className="w-3 h-3" /></>
          ) : (
            <>Show all {insurers.length} insurers <ChevronDown className="w-3 h-3" /></>
          )}
        </button>
      )}

      {/* HQ Distribution */}
      <div className="mt-10 bg-surface rounded-xl border border-border p-5">
        <h3 className="text-[14px] font-semibold text-text-primary mb-4">Insurer Headquarters Distribution</h3>
        <div className="space-y-2">
          {hqData.map((hq) => {
            const pct = (hq.count / insurers.length) * 100;
            return (
              <div key={hq.city} className="flex items-center gap-3">
                <span className="w-[100px] text-[12px] text-text-secondary text-right shrink-0">{hq.city}</span>
                <div className="flex-1 h-5 bg-surface-sunken rounded overflow-hidden">
                  <div
                    className="h-full bg-primary/70 rounded transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-[30px] text-[12px] font-medium text-text-primary text-right shrink-0">{hq.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
