import Link from "next/link";
import { Check, ExternalLink, ArrowUpRight, TrendingUp, Users, Calendar } from "lucide-react";
import { cn, formatCompact, freshnessLabel } from "@/lib/utils";
import type { InsuranceProduct } from "@/lib/types";

const confidenceStyles = {
  high: "bg-emerald-50 text-emerald-600 border-emerald-200",
  medium: "bg-amber-50 text-amber-600 border-amber-200",
  low: "bg-red-50 text-red-600 border-red-200",
};

export default function ProductCard({ product }: { product: InsuranceProduct }) {
  const p = product;
  const freshness = freshnessLabel(p.lastVerified);

  return (
    <div className="group card-premium card-spotlight bg-surface rounded-2xl border border-border overflow-hidden">
      {/* Top bar with category color */}
      <div className={cn(
        "h-1",
        p.category === "health" && "bg-gradient-to-r from-rose-500 to-pink-500",
        p.category === "term-life" && "bg-gradient-to-r from-indigo-500 to-violet-500",
        p.category === "motor" && "bg-gradient-to-r from-emerald-500 to-teal-500",
        p.category === "travel" && "bg-gradient-to-r from-amber-500 to-orange-500",
      )} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-[11px] font-bold text-primary uppercase tracking-[0.1em]">
              {p.insurerName.split(" ").slice(0, 2).join(" ")}
            </p>
            <h3 className="text-[15px] font-bold text-text-primary mt-0.5 leading-snug group-hover:text-primary transition-colors">
              {p.productName}
            </h3>
          </div>
          <span className={cn("shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full border", confidenceStyles[p.confidenceScore])}>
            {p.confidenceScore}
          </span>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-surface-sunken rounded-xl p-3">
            <p className="text-[10px] text-text-tertiary font-medium uppercase tracking-wider">Cover</p>
            <p className="text-[14px] font-bold text-text-primary mt-0.5">
              {formatCompact(p.sumInsured.min, p.countryCode)} – {formatCompact(p.sumInsured.max, p.countryCode)}
            </p>
          </div>
          <div className="bg-surface-sunken rounded-xl p-3">
            <p className="text-[10px] text-text-tertiary font-medium uppercase tracking-wider">Premium*</p>
            <p className="text-[14px] font-bold text-text-primary mt-0.5">
              {formatCompact(p.premiumRange.illustrativeMin, p.countryCode)}<span className="text-[11px] text-text-tertiary font-medium">/yr</span>
            </p>
          </div>
        </div>

        {/* Info row */}
        <div className="flex flex-wrap gap-3 mb-4 text-[11px] text-text-tertiary">
          {p.eligibility.minAge && (
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> {p.eligibility.minAge}–{p.eligibility.maxAge ?? "80"} yrs
            </span>
          )}
          {p.claimSettlement?.ratio && (
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> CSR {p.claimSettlement.ratio}%
            </span>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-1.5 mb-5">
          {p.specialFeatures.slice(0, 3).map((f) => (
            <li key={f} className="flex items-start gap-2 text-[12px] text-text-secondary">
              <Check className="w-3.5 h-3.5 text-accent mt-0.5 shrink-0" />
              <span className="leading-snug">{f}</span>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link
            href={`/product/${p.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[12.5px] font-semibold text-white bg-gradient-to-r from-primary to-[#7c3aed] rounded-xl hover:shadow-md transition-all duration-200"
          >
            View Details <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
          {p.sourceUrl && (
            <a
              href={p.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-text-tertiary hover:text-primary border border-border rounded-xl hover:border-primary/20 transition-all"
              aria-label="Open source"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Freshness */}
        <div className="mt-3 flex items-center gap-1.5 text-[10px] text-text-tertiary">
          <Calendar className="w-3 h-3" />
          <span>Verified: {p.lastVerified}</span>
          <span className={cn("ml-auto px-1.5 py-0.5 rounded text-[9px] font-medium", freshness.color === "green" ? "bg-emerald-50 text-emerald-600" : freshness.color === "amber" ? "bg-amber-50 text-amber-600" : "bg-red-50 text-red-600")}>
            {freshness.label}
          </span>
        </div>
      </div>
    </div>
  );
}
