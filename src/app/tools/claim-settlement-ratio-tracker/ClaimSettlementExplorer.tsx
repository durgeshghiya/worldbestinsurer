"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Shield,
  Search,
  ArrowUpDown,
  CheckCircle2,
  ExternalLink,
  Building2,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Award,
  Filter,
} from "lucide-react";

export interface InsurerStatRecord {
  slug: string;
  name: string;
  shortName: string;
  type: "life" | "standalone-health" | "general";
  categories: string[];
  csrNumber: number;
  csrAmount: number | null;
  solvencyRatio: number;
  incurredClaimRatio: number | null;
  networkHospitals: number | null;
  avgTurnaroundDays: number;
  reportingYear: string;
  irdaReg: string;
}

interface Props {
  insurers: InsurerStatRecord[];
}

export default function ClaimSettlementExplorer({ insurers }: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<"all" | "life" | "standalone-health" | "general">("all");
  const [sortBy, setSortBy] = useState<"csr" | "solvency" | "hospitals" | "name">("csr");
  const [solvencyThreshold, setSolvencyThreshold] = useState<boolean>(false);

  const filteredAndSorted = useMemo(() => {
    return insurers
      .filter((i) => {
        // Category filter
        if (categoryFilter !== "all" && i.type !== categoryFilter) return false;

        // Solvency threshold filter (min 1.80)
        if (solvencyThreshold && i.solvencyRatio < 1.8) return false;

        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          return (
            i.name.toLowerCase().includes(q) ||
            i.shortName.toLowerCase().includes(q) ||
            i.slug.toLowerCase().includes(q)
          );
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "csr") return b.csrNumber - a.csrNumber;
        if (sortBy === "solvency") return b.solvencyRatio - a.solvencyRatio;
        if (sortBy === "hospitals") return (b.networkHospitals || 0) - (a.networkHospitals || 0);
        if (sortBy === "name") return a.shortName.localeCompare(b.shortName);
        return 0;
      });
  }, [insurers, categoryFilter, solvencyThreshold, searchQuery, sortBy]);

  const statsSummary = useMemo(() => {
    const total = filteredAndSorted.length;
    const avgCsr =
      total > 0
        ? (filteredAndSorted.reduce((acc, curr) => acc + curr.csrNumber, 0) / total).toFixed(1)
        : "0";
    const avgSolvency =
      total > 0
        ? (filteredAndSorted.reduce((acc, curr) => acc + curr.solvencyRatio, 0) / total).toFixed(2)
        : "0";
    return { total, avgCsr, avgSolvency };
  }, [filteredAndSorted]);

  const getBadgeColor = (csr: number) => {
    if (csr >= 99.0) return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
    if (csr >= 95.0) return "bg-primary/10 text-primary border-primary/20";
    if (csr >= 90.0) return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
    return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800";
  };

  return (
    <div className="space-y-8">
      {/* Controls Bar */}
      <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-6">
        {/* Top Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by insurer name (e.g. HDFC Life, Care, Max, Star)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-surface-sunken/60 text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* Sort By Select */}
          <div className="md:col-span-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-text-secondary whitespace-nowrap font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-2.5 px-3 rounded-xl border border-border bg-surface-sunken/60 text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary"
              >
                <option value="csr">Highest Settlement Ratio (CSR)</option>
                <option value="solvency">Highest Solvency Ratio</option>
                <option value="hospitals">Most Network Hospitals</option>
                <option value="name">Insurer Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Quick Toggle */}
          <div className="md:col-span-3 flex items-center justify-end">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-text-secondary select-none">
              <input
                type="checkbox"
                checked={solvencyThreshold}
                onChange={(e) => setSolvencyThreshold(e.target.checked)}
                className="w-4 h-4 rounded text-primary accent-primary focus:ring-primary"
              />
              <span className="font-medium">High Solvency (≥ 1.80)</span>
            </label>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/70">
          {[
            { id: "all", label: "All Insurers", count: insurers.length },
            { id: "life", label: "Life & Term Insurance", count: insurers.filter((i) => i.type === "life").length },
            {
              id: "standalone-health",
              label: "Standalone Health (SAHI)",
              count: insurers.filter((i) => i.type === "standalone-health").length,
            },
            {
              id: "general",
              label: "General / Health / Motor",
              count: insurers.filter((i) => i.type === "general").length,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                categoryFilter === tab.id
                  ? "bg-primary text-white shadow-xs"
                  : "bg-surface-sunken text-text-secondary hover:text-text-primary border border-border"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Aggregate Mini Metrics */}
        <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border/70 text-xs">
          <div className="bg-surface-sunken/40 p-3 rounded-xl border border-border/60">
            <div className="text-text-secondary">Showing Insurers</div>
            <div className="text-lg font-bold text-text-primary mt-0.5">{statsSummary.total}</div>
          </div>
          <div className="bg-surface-sunken/40 p-3 rounded-xl border border-border/60">
            <div className="text-text-secondary">Average Settlement</div>
            <div className="text-lg font-bold text-primary mt-0.5">{statsSummary.avgCsr}%</div>
          </div>
          <div className="bg-surface-sunken/40 p-3 rounded-xl border border-border/60">
            <div className="text-text-secondary">Average Solvency</div>
            <div className="text-lg font-bold text-text-primary mt-0.5">{statsSummary.avgSolvency}x</div>
          </div>
        </div>
      </div>

      {/* Insurers Grid / Table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-surface shadow-xs">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="border-b border-border bg-surface-sunken/80 text-text-primary font-bold">
              <th className="py-4 px-4 sm:px-6">Insurer Name</th>
              <th className="py-4 px-4 sm:px-6">Segment</th>
              <th className="py-4 px-4 sm:px-6 text-right">Settlement Ratio (by Number)</th>
              <th className="py-4 px-4 sm:px-6 text-right">Settlement by Amount</th>
              <th className="py-4 px-4 sm:px-6 text-right">Solvency Ratio</th>
              <th className="py-4 px-4 sm:px-6 text-right">Cashless Hospitals</th>
              <th className="py-4 px-4 sm:px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-text-secondary">
            {filteredAndSorted.map((ins) => (
              <tr key={ins.slug} className="hover:bg-surface-sunken/40 transition-colors">
                {/* Insurer Name & IRDAI reg */}
                <td className="py-4 px-4 sm:px-6 font-semibold text-text-primary">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-text-tertiary shrink-0" />
                    <div>
                      <Link
                        href={`/in/insurer/${ins.slug}`}
                        className="hover:text-primary transition-colors font-bold"
                      >
                        {ins.name}
                      </Link>
                      <div className="text-[11px] font-normal text-text-secondary mt-0.5">
                        IRDAI Reg. #{ins.irdaReg} · {ins.reportingYear}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Segment Tag */}
                <td className="py-4 px-4 sm:px-6">
                  <Link
                    href={
                      ins.type === "standalone-health"
                        ? "/in/compare/health"
                        : ins.type === "life"
                        ? "/in/compare/term-life"
                        : "/in/compare/health"
                    }
                    className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-surface-sunken border border-border capitalize hover:border-primary/40 hover:text-primary transition-colors"
                  >
                    {ins.type === "standalone-health"
                      ? "Standalone Health"
                      : ins.type === "life"
                      ? "Life & Term"
                      : "General Insurance"}
                  </Link>
                </td>

                {/* Claim Settlement Ratio (Number) */}
                <td className="py-4 px-4 sm:px-6 text-right">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${getBadgeColor(
                      ins.csrNumber
                    )}`}
                  >
                    {ins.csrNumber.toFixed(2)}%
                  </span>
                </td>

                {/* Claim Settlement Ratio (Amount) */}
                <td className="py-4 px-4 sm:px-6 text-right font-medium">
                  {ins.csrAmount !== null ? (
                    <span className="text-text-primary font-semibold">{ins.csrAmount.toFixed(2)}%</span>
                  ) : (
                    <span className="text-text-tertiary text-xs">
                      {ins.incurredClaimRatio ? `ICR: ${ins.incurredClaimRatio}%` : "N/A (General)"}
                    </span>
                  )}
                </td>

                {/* Solvency Ratio */}
                <td className="py-4 px-4 sm:px-6 text-right font-semibold">
                  <span
                    className={
                      ins.solvencyRatio >= 2.0
                        ? "text-emerald-700 dark:text-emerald-400"
                        : ins.solvencyRatio >= 1.5
                        ? "text-text-primary"
                        : "text-rose-600"
                    }
                  >
                    {ins.solvencyRatio.toFixed(2)}x
                  </span>
                  <div className="text-[10px] text-text-secondary font-normal">
                    (Min 1.50x req.)
                  </div>
                </td>

                {/* Network Hospitals */}
                <td className="py-4 px-4 sm:px-6 text-right font-semibold text-text-primary">
                  {ins.networkHospitals ? (
                    <span>{ins.networkHospitals.toLocaleString("en-IN")}+</span>
                  ) : (
                    <span className="text-text-tertiary text-xs">— (Life)</span>
                  )}
                </td>

                {/* Action Deep Link */}
                <td className="py-4 px-4 sm:px-6 text-center">
                  <Link
                    href={`/in/insurer/${ins.slug}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border bg-surface-sunken hover:border-primary/40 text-xs font-semibold text-text-primary hover:text-primary transition-colors"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
