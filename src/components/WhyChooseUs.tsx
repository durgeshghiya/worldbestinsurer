"use client";

import { useEffect, useRef, useState } from "react";
import {
  Eye,
  ShieldOff,
  Cpu,
  Globe,
  BookOpen,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";

const reasons = [
  {
    icon: Eye,
    title: "Transparent Comparison",
    description:
      "Every plan displayed with full details, sources, and verification dates. No hidden bias or paid rankings.",
    gradient: "from-indigo-500 to-violet-500",
    bg: "bg-indigo-50",
    color: "text-indigo-600",
  },
  {
    icon: ShieldOff,
    title: "No Hidden Commissions",
    description:
      "We clearly disclose how we operate. Our goal is to help you compare, not push a specific product.",
    gradient: "from-rose-500 to-pink-500",
    bg: "bg-rose-50",
    color: "text-rose-600",
  },
  {
    icon: Cpu,
    title: "AI-Powered Updates",
    description:
      "Our automated research agents continuously verify and refresh data so you always see the latest information.",
    gradient: "from-violet-500 to-purple-500",
    bg: "bg-violet-50",
    color: "text-violet-600",
  },
  {
    icon: Globe,
    title: "12 Countries Covered",
    description:
      "Compare insurance across India, USA, UK, UAE, Singapore, Canada, Australia, Germany, and more.",
    gradient: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-50",
    color: "text-emerald-600",
  },
  {
    icon: BookOpen,
    title: "Expert Content",
    description:
      "In-depth guides, comparisons, and explainers written by insurance domain experts to help you decide.",
    gradient: "from-amber-500 to-orange-500",
    bg: "bg-amber-50",
    color: "text-amber-600",
  },
  {
    icon: BarChart3,
    title: "Data-Backed Insights",
    description:
      "Claim settlement ratios, network hospital counts, and premium trends sourced from official regulatory filings.",
    gradient: "from-blue-500 to-cyan-500",
    bg: "bg-blue-50",
    color: "text-blue-600",
  },
];

// ---------------------------------------------------------------------------
// Scroll-triggered animation hook
// ---------------------------------------------------------------------------

function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function WhyChooseUs() {
  const { ref, visible } = useScrollReveal();

  return (
    <section className="py-16" ref={ref}>
      {/* Header */}
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary bg-primary-light px-3 py-1 rounded-full mb-3">
          <Cpu className="w-3 h-3" />
          WHY US
        </span>
        <h2 className="text-[24px] md:text-[32px] font-bold text-text-primary">
          Why World Best Insurer?
        </h2>
        <p className="text-[14px] text-text-secondary mt-2 max-w-lg mx-auto">
          We built the platform we wished existed when comparing insurance plans
          across countries.
        </p>
      </div>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {reasons.map((r, i) => {
          const Icon = r.icon;
          return (
            <div
              key={r.title}
              className={cn(
                "card-premium bg-surface rounded-2xl border border-border p-6 transition-all duration-500",
                visible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              )}
              style={{
                transitionDelay: visible ? `${i * 80}ms` : "0ms",
              }}
            >
              {/* Icon */}
              <div
                className={cn(
                  "w-11 h-11 rounded-xl flex items-center justify-center mb-4",
                  r.bg
                )}
              >
                <Icon className={cn("w-5 h-5", r.color)} />
              </div>

              {/* Title */}
              <h3 className="text-[15px] font-bold text-text-primary mb-2">
                {r.title}
              </h3>

              {/* Description */}
              <p className="text-[12.5px] text-text-secondary leading-relaxed">
                {r.description}
              </p>

              {/* Decorative bottom gradient line on hover */}
              <div
                className={cn(
                  "mt-4 h-0.5 w-0 group-hover:w-full rounded-full bg-gradient-to-r transition-all duration-500",
                  r.gradient
                )}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
