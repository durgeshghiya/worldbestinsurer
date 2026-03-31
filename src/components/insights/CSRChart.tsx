"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp } from "lucide-react";
import type { InsurerCSR, CSRBucket } from "@/lib/insights";

function csrBarColor(csr: number): string {
  if (csr >= 90) return "#2d3a8c";
  if (csr >= 80) return "#2d8f6f";
  if (csr >= 70) return "#c47d2e";
  return "#c44058";
}

export default function CSRChart({
  insurerCSRs,
  csrBuckets,
  categoryAvgCSRs,
}: {
  insurerCSRs: InsurerCSR[];
  csrBuckets: CSRBucket[];
  categoryAvgCSRs: { category: string; avgCSR: number; color: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
      <div className="flex items-center gap-2.5 mb-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        <h2 className="text-[22px] sm:text-[28px] font-bold text-text-primary tracking-[-0.02em]">
          Claim Settlement Ratios
        </h2>
      </div>
      <p className="text-[13px] text-text-secondary mb-8 max-w-2xl">
        CSR indicates the percentage of claims an insurer settles. Higher is better for policyholders.
      </p>

      {/* Distribution buckets */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {csrBuckets.map((b) => (
          <div key={b.range} className="bg-surface rounded-xl border border-border p-4 text-center">
            <div className="text-[24px] font-bold text-text-primary">{b.count}</div>
            <div className="text-[11px] font-medium mt-1" style={{ color: b.color }}>
              {b.range}
            </div>
            <div className="text-[10px] text-text-tertiary mt-0.5">insurers</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div ref={ref} className="bg-surface rounded-xl border border-border p-5 mb-8">
        <div className="space-y-2.5">
          {insurerCSRs.slice(0, 20).map((insurer, i) => (
            <div key={insurer.slug} className="flex items-center gap-3">
              <div className="w-[140px] sm:w-[180px] shrink-0 text-right">
                <span className="text-[12px] font-medium text-text-primary truncate block">
                  {insurer.shortName}
                </span>
              </div>
              <div className="flex-1 h-7 bg-surface-sunken rounded-md overflow-hidden relative">
                <motion.div
                  className="h-full rounded-md"
                  style={{ backgroundColor: csrBarColor(insurer.csr) }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${insurer.csr}%` } : { width: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.03, ease: "easeOut" }}
                />
              </div>
              <span className="w-[52px] shrink-0 text-[12px] font-semibold text-text-primary text-right tabular-nums">
                {insurer.csr}%
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[10px] text-text-tertiary">
          Source: Insurer-reported data. CSR may vary by product line and year.
        </p>
      </div>

      {/* Category avg CSR */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {categoryAvgCSRs.map((c) => (
          <div
            key={c.category}
            className="bg-surface rounded-xl border border-border p-4"
          >
            <div className="h-1 rounded-full mb-3" style={{ backgroundColor: c.color }} />
            <div className="text-[11px] text-text-tertiary font-medium mb-1">{c.category}</div>
            <div className="text-[22px] font-bold text-text-primary">
              {c.avgCSR > 0 ? `${c.avgCSR}%` : "N/A"}
            </div>
            <div className="text-[10px] text-text-tertiary">avg. product CSR</div>
          </div>
        ))}
      </div>
    </section>
  );
}
