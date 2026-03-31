"use client";

import {
  Database,
  Building2,
  Layers,
  MapPin,
} from "lucide-react";
import CounterAnimation from "@/components/immersive/CounterAnimation";
import ScrollReveal from "@/components/immersive/ScrollReveal";
import type { MarketOverview } from "@/lib/insights";

const stats = [
  { key: "totalProducts", label: "Products Tracked", icon: Database, suffix: "+" },
  { key: "totalInsurers", label: "Insurers Compared", icon: Building2, suffix: "" },
  { key: "totalCategories", label: "Categories Covered", icon: Layers, suffix: "" },
  { key: "totalCities", label: "Cities in Database", icon: MapPin, suffix: "+" },
] as const;

export default function InsightsHero({ data }: { data: MarketOverview }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a]" />
      <div className="hidden md:block absolute top-[20%] left-[15%] w-[400px] h-[400px] rounded-full bg-[#2d3a8c]/20 blur-[120px]" />
      <div className="hidden md:block absolute bottom-[10%] right-[20%] w-[350px] h-[350px] rounded-full bg-[#c47d2e]/15 blur-[100px]" />

      <div className="relative mx-auto max-w-[1280px] px-5 lg:px-8 py-20 lg:py-28">
        <ScrollReveal>
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-full border border-white/10 bg-white/5 text-[11px] font-medium text-white/50 tracking-wide uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c47d2e] opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#c47d2e]" />
              </span>
              India Market Data
            </div>
            <h1 className="text-[32px] sm:text-[42px] lg:text-[52px] font-bold text-white tracking-[-0.03em] leading-[1.1] mb-4">
              Insurance Market
              <span className="block bg-gradient-to-r from-[#c47d2e] to-[#e09a4a] bg-clip-text text-transparent">
                Insights
              </span>
            </h1>
            <p className="text-[14px] sm:text-[16px] text-white/40 max-w-xl mx-auto leading-relaxed">
              Data-driven overview of India&apos;s insurance landscape. Explore claim settlement ratios,
              premium ranges, and coverage analysis across {data.totalProducts} products from {data.totalInsurers} insurers.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal stagger={0.1} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => {
            const Icon = s.icon;
            const value = data[s.key];
            return (
              <div
                key={s.key}
                className="relative bg-white/[0.04] backdrop-blur-sm border border-white/[0.06] rounded-xl p-5 text-center group hover:bg-white/[0.07] transition-all"
              >
                <div className="w-10 h-10 mx-auto mb-3 rounded-lg bg-white/[0.06] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#c47d2e]" />
                </div>
                <div className="text-[28px] sm:text-[34px] font-bold text-white mb-1">
                  <CounterAnimation target={value} suffix={s.suffix} />
                </div>
                <p className="text-[11px] text-white/35 font-medium uppercase tracking-[0.1em]">
                  {s.label}
                </p>
              </div>
            );
          })}
        </ScrollReveal>
      </div>
    </section>
  );
}
