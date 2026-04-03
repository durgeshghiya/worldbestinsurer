import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  BarChart3,
  TrendingUp,
  Building2,
  IndianRupee,
  Landmark,
} from "lucide-react";
import { BreadcrumbSchema } from "@/components/StructuredData";
import { computeInsights } from "@/lib/insights";
import { formatCurrency } from "@/lib/utils";

import InsightsHero from "@/components/insights/InsightsHero";
import CSRChart from "@/components/insights/CSRChart";
import CategoryBreakdown from "@/components/insights/CategoryBreakdown";
import InsurerLandscape from "@/components/insights/InsurerLandscape";
import PremiumRangeViz from "@/components/insights/PremiumRangeViz";
import CityHeatmap from "@/components/insights/CityHeatmap";
import DataFreshness from "@/components/insights/DataFreshness";

export const metadata: Metadata = {
  title: "India Insurance Market Insights — Data Dashboard",
  description:
    "Explore India's insurance landscape with data-driven insights. Claim settlement ratios, premium ranges, coverage analysis across 97 products from 34 insurers.",
  keywords: [
    "insurance insights India",
    "claim settlement ratio",
    "insurance market analysis",
    "IRDAI data",
    "health insurance India",
    "term life insurance comparison",
    "motor insurance India",
    "travel insurance India",
  ],
  openGraph: {
    title: "India Insurance Market Insights",
    description:
      "Data-driven overview of 97 insurance products from 34 insurers across 4 categories.",
    type: "website",
    url: "https://worldbestinsurer.com/insights",
  },
};

/* Icons for market stats */
const statIcons: Record<string, typeof TrendingUp> = {
  TrendingUp,
  Building2,
  IndianRupee,
  Shield,
  Landmark,
  BarChart3,
};

export default function InsightsPage() {
  const data = computeInsights();

  return (
    <div>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://worldbestinsurer.com" },
          { name: "Market Insights", url: "https://worldbestinsurer.com/insights" },
        ]}
      />

      {/* ── Hero ── */}
      <InsightsHero data={data.overview} />

      {/* ── Market Stats ── */}
      <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
        <h2 className="text-[22px] sm:text-[28px] font-bold text-text-primary tracking-[-0.02em] mb-2">
          Market Snapshot
        </h2>
        <p className="text-[13px] text-text-secondary mb-8 max-w-2xl">
          Key metrics from the Indian insurance market, derived from our product database.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.marketStats.map((stat) => {
            const Icon = statIcons[stat.icon] ?? BarChart3;
            return (
              <div
                key={stat.label}
                className="bg-surface rounded-xl border border-border p-5 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-primary-light flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[12px] text-text-tertiary font-medium">
                    {stat.label}
                  </span>
                </div>
                <div className="text-[20px] font-bold text-text-primary mb-1">
                  {stat.value}
                </div>
                <p className="text-[11px] text-text-tertiary">{stat.note}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CSR Analysis ── */}
      <CSRChart
        insurerCSRs={data.insurerCSRs}
        csrBuckets={data.csrBuckets}
        categoryAvgCSRs={data.categoryAvgCSRs}
      />

      {/* ── Category Deep Dive ── */}
      <CategoryBreakdown categories={data.categoryInsights} />

      {/* ── Insurer Landscape ── */}
      <InsurerLandscape insurers={data.insurerRows} hqData={data.hqData} />

      {/* ── Premium Range ── */}
      <PremiumRangeViz data={data.premiumRanges} />

      {/* ── Coverage Distribution ── */}
      <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
        <div className="flex items-center gap-2.5 mb-2">
          <Shield className="w-5 h-5 text-primary" />
          <h2 className="text-[22px] sm:text-[28px] font-bold text-text-primary tracking-[-0.02em]">
            Coverage Distribution
          </h2>
        </div>
        <p className="text-[13px] text-text-secondary mb-8 max-w-2xl">
          How products are distributed across sum insured ranges.
        </p>
        <div className="bg-surface rounded-xl border border-border p-5">
          <div className="space-y-3">
            {data.coverageDistribution.map((bucket) => {
              const maxCount = Math.max(
                ...data.coverageDistribution.map((b) => b.count)
              );
              const pct = maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;
              return (
                <div key={bucket.bucket} className="flex items-center gap-3">
                  <span className="w-[100px] sm:w-[120px] text-[12px] text-text-secondary text-right shrink-0">
                    {bucket.bucket}
                  </span>
                  <div className="flex-1 h-7 bg-surface-sunken rounded-md overflow-hidden">
                    <div
                      className="h-full bg-primary/60 rounded-md transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-[40px] text-[12px] font-semibold text-text-primary text-right shrink-0 tabular-nums">
                    {bucket.count}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-[10px] text-text-tertiary">
            Products counted by maximum sum insured available.
          </p>
        </div>
      </section>

      {/* ── Geographic Coverage ── */}
      <CityHeatmap
        stateData={data.stateData}
        tierData={data.tierData}
        totalCities={data.overview.totalCities}
        totalStates={data.overview.totalStates}
      />

      {/* ── Data Freshness ── */}
      <DataFreshness
        freshness={data.freshness}
        overallConfidence={data.overallConfidence}
      />

      {/* ── Regulatory Snapshot ── */}
      <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
        <div className="bg-surface-sunken rounded-2xl p-8">
          <div className="flex items-center gap-2.5 mb-4">
            <Landmark className="w-5 h-5 text-primary" />
            <h2 className="text-[18px] font-bold text-text-primary">Regulatory Context</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-[13px] font-semibold text-text-primary mb-2">IRDAI — Insurance Regulator</h3>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                The Insurance Regulatory and Development Authority of India (IRDAI)
                regulates all insurance activities in the country. Established in 1999,
                IRDAI licenses insurers, approves products, mandates claim settlement
                timelines, and publishes industry data annually.
              </p>
            </div>
            <div>
              <h3 className="text-[13px] font-semibold text-text-primary mb-2">About This Data</h3>
              <p className="text-[12px] text-text-secondary leading-relaxed">
                All data on this page is derived from publicly available information —
                official insurer websites, policy brochures, and IRDAI annual reports.
                World Best Insurer is an informational platform and does not sell,
                distribute, or advise on insurance products.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/methodology"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium text-primary bg-primary-light rounded-lg hover:bg-primary/10 transition-colors"
            >
              Our Methodology <ArrowRight className="w-3 h-3" />
            </Link>
            <Link
              href="/disclaimer"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-medium text-text-secondary bg-surface rounded-lg border border-border hover:border-primary/20 transition-colors"
            >
              Disclaimer
            </Link>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="mx-auto max-w-[1280px] px-5 lg:px-8 pb-16">
        <div className="bg-gradient-to-br from-[#1a1a2e] to-[#2d3a8c] rounded-2xl p-8 sm:p-10 text-center">
          <h2 className="text-[20px] sm:text-[24px] font-bold text-white mb-2">
            Ready to Compare Insurance Plans?
          </h2>
          <p className="text-[13px] text-white/50 max-w-lg mx-auto mb-6">
            Explore {data.overview.totalProducts} products across {data.overview.totalInsurers} insurers.
            Transparent data, zero sales pressure.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/compare/health"
              className="px-5 py-2.5 text-[13px] font-semibold text-[#1a1a2e] bg-white rounded-lg hover:bg-white/90 transition-colors"
            >
              Compare Plans
            </Link>
            <Link
              href="/waitlist"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-medium text-white/80 border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
            >
              Get Early Access <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
