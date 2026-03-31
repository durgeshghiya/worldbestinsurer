"use client";

import Link from "next/link";
import { Clock, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { daysSince, freshnessLabel } from "@/lib/utils";
import type { FreshnessData } from "@/lib/insights";

const statusIcons = {
  green: CheckCircle2,
  amber: AlertCircle,
  red: XCircle,
};

const statusColors = {
  green: { text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-200" },
  amber: { text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
  red: { text: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
};

export default function DataFreshness({
  freshness,
  overallConfidence,
}: {
  freshness: FreshnessData[];
  overallConfidence: string;
}) {
  return (
    <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
      <div className="flex items-center gap-2.5 mb-2">
        <Clock className="w-5 h-5 text-primary" />
        <h2 className="text-[22px] sm:text-[28px] font-bold text-text-primary tracking-[-0.02em]">
          Data Freshness
        </h2>
      </div>
      <p className="text-[13px] text-text-secondary mb-8 max-w-2xl">
        How recently each category&apos;s data was verified. We aim to keep all data within 90 days of the source.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {freshness.map((f) => {
          const fresh = f.lastUpdated ? freshnessLabel(f.lastUpdated) : { label: "Unknown", color: "red" as const };
          const days = f.lastUpdated ? daysSince(f.lastUpdated) : -1;
          const Icon = statusIcons[fresh.color];
          const colors = statusColors[fresh.color];

          return (
            <div
              key={f.category}
              className="bg-surface rounded-xl border border-border overflow-hidden"
            >
              <div className="h-1" style={{ backgroundColor: f.color }} />
              <div className="p-5">
                <div className="text-[14px] font-semibold text-text-primary mb-3">
                  {f.name}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${colors.text}`} />
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text} ${colors.border} border`}>
                    {fresh.label}
                  </span>
                </div>
                <div className="text-[12px] text-text-secondary">
                  Last updated: <span className="font-medium text-text-primary">{f.lastUpdated || "N/A"}</span>
                </div>
                {days >= 0 && (
                  <div className="text-[11px] text-text-tertiary mt-1">
                    {days} days ago
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confidence + methodology */}
      <div className="bg-surface-sunken rounded-xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <div className="text-[13px] font-semibold text-text-primary mb-1">Data Confidence</div>
          <p className="text-[12px] text-text-secondary">
            All products currently carry a <span className="font-medium text-text-primary capitalize">{overallConfidence}</span> confidence score.
            Scores are based on source type, verification recency, and field completeness.
          </p>
        </div>
        <Link
          href="/methodology"
          className="shrink-0 px-4 py-2 text-[12px] font-medium text-primary bg-primary-light rounded-lg hover:bg-primary/10 transition-colors"
        >
          View Methodology
        </Link>
      </div>
    </section>
  );
}
