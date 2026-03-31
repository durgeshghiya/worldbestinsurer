"use client";

import Link from "next/link";
import { Heart, Shield, Car, Plane, ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/immersive/ScrollReveal";
import type { CategoryInsight } from "@/lib/insights";
import { formatCurrency } from "@/lib/utils";

const icons: Record<string, typeof Heart> = {
  health: Heart,
  "term-life": Shield,
  motor: Car,
  travel: Plane,
};

const colors: Record<string, string> = {
  health: "#c44058",
  "term-life": "#2d3a8c",
  motor: "#2d8f6f",
  travel: "#c47d2e",
};

export default function CategoryBreakdown({
  categories,
}: {
  categories: CategoryInsight[];
}) {
  return (
    <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
      <h2 className="text-[22px] sm:text-[28px] font-bold text-text-primary tracking-[-0.02em] mb-2">
        Category Deep Dive
      </h2>
      <p className="text-[13px] text-text-secondary mb-8 max-w-2xl">
        Detailed breakdown of each insurance category in the Indian market.
      </p>

      <ScrollReveal stagger={0.1} className="grid sm:grid-cols-2 gap-5">
        {categories.map((cat) => {
          const Icon = icons[cat.slug] ?? Heart;
          const color = colors[cat.slug] ?? "#6b7280";

          return (
            <div
              key={cat.slug}
              className="bg-surface rounded-xl border border-border overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="h-1" style={{ backgroundColor: color }} />
              <div className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}12` }}
                  >
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div>
                    <h3 className="text-[16px] font-bold text-text-primary">{cat.name}</h3>
                    <p className="text-[11px] text-text-tertiary">
                      {cat.productCount} products &middot; {cat.insurerCount} insurers
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-surface-sunken rounded-lg p-3">
                    <div className="text-[10px] text-text-tertiary font-medium mb-1">Premium Range</div>
                    <div className="text-[13px] font-semibold text-text-primary">
                      {formatCurrency(cat.premiumMin)} – {formatCurrency(cat.premiumMax)}
                    </div>
                    <div className="text-[9px] text-text-tertiary">per year (illustrative)</div>
                  </div>
                  <div className="bg-surface-sunken rounded-lg p-3">
                    <div className="text-[10px] text-text-tertiary font-medium mb-1">Sum Insured</div>
                    <div className="text-[13px] font-semibold text-text-primary">
                      {cat.sumInsuredMin != null ? formatCurrency(cat.sumInsuredMin) : "N/A"} – {cat.sumInsuredMax != null ? formatCurrency(cat.sumInsuredMax) : "N/A"}
                    </div>
                    <div className="text-[9px] text-text-tertiary">coverage range</div>
                  </div>
                  <div className="bg-surface-sunken rounded-lg p-3">
                    <div className="text-[10px] text-text-tertiary font-medium mb-1">Avg CSR</div>
                    <div className="text-[13px] font-semibold text-text-primary">
                      {cat.avgCSR != null ? `${cat.avgCSR}%` : "N/A"}
                    </div>
                    <div className="text-[9px] text-text-tertiary">claim settlement ratio</div>
                  </div>
                  <div className="bg-surface-sunken rounded-lg p-3">
                    <div className="text-[10px] text-text-tertiary font-medium mb-1">Last Updated</div>
                    <div className="text-[13px] font-semibold text-text-primary">
                      {cat.lastUpdated || "N/A"}
                    </div>
                    <div className="text-[9px] text-text-tertiary">data refresh date</div>
                  </div>
                </div>

                {cat.subCategories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {cat.subCategories.map((sub) => (
                      <span
                        key={sub}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-surface-sunken text-text-tertiary"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}

                <Link
                  href={`/compare/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors"
                  style={{ color }}
                >
                  Compare {cat.name.replace(" Insurance", "")} plans
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </ScrollReveal>
    </section>
  );
}
