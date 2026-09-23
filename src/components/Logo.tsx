import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** "mark" shows only the emblem; "full" includes the text brand name */
  variant?: "mark" | "full";
  /** Size preset */
  size?: "sm" | "md" | "lg" | "xl";
  /** Optional extra classes */
  className?: string;
  /** Invert colors for dark backgrounds (e.g. footer) */
  inverted?: boolean;
  /** Whether to wrap in a Next.js Link pointing to / */
  linkable?: boolean;
}

const SIZES = {
  sm: { box: "w-7 h-7", mark: "w-7 h-7", title: "text-[14px]", sub: "text-[9px]" },
  md: { box: "w-8 h-8", mark: "w-8 h-8", title: "text-[15px]", sub: "text-[10px]" },
  lg: { box: "w-10 h-10", mark: "w-10 h-10", title: "text-[18px]", sub: "text-[11px]" },
  xl: { box: "w-14 h-14", mark: "w-14 h-14", title: "text-[24px]", sub: "text-[13px]" },
};

export function LogoMark({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="wbi-logo-shield" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d3a8c" />
          <stop offset="50%" stopColor="#1e2b7a" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <linearGradient id="wbi-logo-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#c47d2e" />
        </linearGradient>
      </defs>

      {/* Protective Shield */}
      <path
        d="M50 8C65 14 82 17 88 20C88 48 82 72 50 92C18 72 12 48 12 20C18 17 35 14 50 8Z"
        fill="url(#wbi-logo-shield)"
        stroke="rgba(255, 255, 255, 0.22)"
        strokeWidth="2"
      />

      {/* Subtle Inner Contour */}
      <path
        d="M50 16C62 21 76 24 81 26C81 48 76 67 50 84C24 67 19 48 19 26C24 24 38 21 50 16Z"
        fill="none"
        stroke="#c47d2e"
        strokeWidth="1"
        strokeOpacity="0.4"
      />

      {/* Central Gold W Apex */}
      <path
        d="M30 40L42 66L50 50L58 66L70 40"
        stroke="url(#wbi-logo-gold)"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Trust Polaris Node */}
      <circle cx="50" cy="28" r="3.5" fill="#fbbf24" />
    </svg>
  );
}

export default function Logo({
  variant = "full",
  size = "md",
  className,
  inverted = false,
  linkable = true,
}: LogoProps) {
  const s = SIZES[size];

  const content = (
    <div className={cn("inline-flex items-center gap-2.5 group shrink-0", className)}>
      {/* Icon Mark */}
      <div className={cn("relative shrink-0 flex items-center justify-center rounded-lg p-0.5 shadow-sm transition-transform duration-300 group-hover:scale-105", s.box)}>
        <LogoMark className={s.mark} />
      </div>

      {/* Wordmark */}
      {variant === "full" && (
        <div className="flex flex-col">
          <span
            className={cn(
              "font-extrabold tracking-[-0.03em] leading-none transition-colors",
              s.title,
              inverted
                ? "text-white/95 group-hover:text-white"
                : "text-text-primary group-hover:text-primary"
            )}
          >
            World Best Insurer
          </span>
          <span
            className={cn(
              "font-bold uppercase tracking-[0.14em] mt-0.5",
              s.sub,
              inverted ? "text-white/40" : "text-text-tertiary"
            )}
          >
            Global Insurance
          </span>
        </div>
      )}
    </div>
  );

  if (linkable) {
    return (
      <Link href="/" aria-label="World Best Insurer Home">
        {content}
      </Link>
    );
  }

  return content;
}
