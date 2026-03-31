"use client";

import { MapPin } from "lucide-react";
import ScrollReveal from "@/components/immersive/ScrollReveal";
import CounterAnimation from "@/components/immersive/CounterAnimation";
import type { StateData, TierData } from "@/lib/insights";

export default function CityHeatmap({
  stateData,
  tierData,
  totalCities,
  totalStates,
}: {
  stateData: StateData[];
  tierData: TierData[];
  totalCities: number;
  totalStates: number;
}) {
  const maxCityCount = stateData[0]?.cityCount ?? 1;

  return (
    <section className="mx-auto max-w-[1280px] px-5 lg:px-8 py-16">
      <div className="flex items-center gap-2.5 mb-2">
        <MapPin className="w-5 h-5 text-primary" />
        <h2 className="text-[22px] sm:text-[28px] font-bold text-text-primary tracking-[-0.02em]">
          Geographic Coverage
        </h2>
      </div>
      <p className="text-[13px] text-text-secondary mb-8 max-w-2xl">
        Insurance serviceable markets across {totalStates} states and {totalCities.toLocaleString()} cities in India.
      </p>

      {/* Tier cards */}
      <ScrollReveal stagger={0.1} className="grid grid-cols-3 gap-4 mb-10">
        {tierData.map((t) => (
          <div
            key={t.tier}
            className="bg-surface rounded-xl border border-border p-5 text-center"
          >
            <div className="text-[28px] sm:text-[34px] font-bold text-text-primary">
              <CounterAnimation target={t.count} />
            </div>
            <div className="text-[11px] text-text-tertiary font-medium mt-1">
              {t.label}
            </div>
          </div>
        ))}
      </ScrollReveal>

      {/* State distribution */}
      <div className="bg-surface rounded-xl border border-border p-5">
        <h3 className="text-[14px] font-semibold text-text-primary mb-4">
          Top 15 States by City Count
        </h3>
        <div className="space-y-2">
          {stateData.map((s) => {
            const pct = (s.cityCount / maxCityCount) * 100;
            return (
              <div key={s.state} className="flex items-center gap-3">
                <span className="w-[130px] sm:w-[160px] text-[12px] text-text-secondary text-right shrink-0 truncate">
                  {s.state}
                </span>
                <div className="flex-1 h-5 bg-surface-sunken rounded overflow-hidden">
                  <div
                    className="h-full bg-accent/60 rounded transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-[40px] text-[12px] font-medium text-text-primary text-right shrink-0 tabular-nums">
                  {s.cityCount}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
