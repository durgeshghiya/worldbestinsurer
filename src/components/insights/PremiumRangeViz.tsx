"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { IndianRupee } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { PremiumRangeData } from "@/lib/insights";

export default function PremiumRangeViz({ data }: { data: PremiumRangeData[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  const globalMax = Math.max(...data.map((d) => d.max));

  return (
    <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
      <div className="flex items-center gap-2.5 mb-2">
        <IndianRupee className="w-5 h-5 text-primary" />
        <h2 className="text-[22px] sm:text-[28px] font-bold text-text-primary tracking-[-0.02em]">
          Premium Range Analysis
        </h2>
      </div>
      <p className="text-[13px] text-text-secondary mb-8 max-w-2xl">
        Illustrative annual premium ranges across insurance categories. Actual premiums depend on age, sum insured, and other factors.
      </p>

      <div ref={ref} className="bg-surface rounded-xl border border-border p-5 space-y-6">
        {data.map((cat, i) => {
          const startPct = (cat.min / globalMax) * 100;
          const widthPct = ((cat.max - cat.min) / globalMax) * 100;
          const medianPct = (cat.median / globalMax) * 100;

          return (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-semibold text-text-primary">{cat.name}</span>
                <span className="text-[11px] text-text-tertiary">
                  {formatCurrency(cat.min)} — {formatCurrency(cat.max)}
                </span>
              </div>
              <div className="relative h-8 bg-surface-sunken rounded-lg overflow-hidden">
                <motion.div
                  className="absolute top-0 h-full rounded-lg"
                  style={{
                    left: `${startPct}%`,
                    backgroundColor: cat.color,
                    opacity: 0.75,
                  }}
                  initial={{ width: 0 }}
                  animate={inView ? { width: `${widthPct}%` } : { width: 0 }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" }}
                />
                {/* Median marker */}
                <motion.div
                  className="absolute top-0 h-full w-0.5 bg-text-primary/50"
                  style={{ left: `${medianPct}%` }}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-text-tertiary">{formatCurrency(cat.min)}</span>
                <span className="text-[10px] text-text-tertiary">Median: {formatCurrency(cat.median)}</span>
                <span className="text-[10px] text-text-tertiary">{formatCurrency(cat.max)}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-[10px] text-text-tertiary">
        Premiums are illustrative and based on standard assumptions. Verify with respective insurers for accurate quotes.
      </p>
    </section>
  );
}
