"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ChevronDown, Heart, Shield, Car, Plane,
  ArrowRight, Sparkles, Globe, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Health Insurance", href: "/compare/health", icon: Heart, color: "text-health", bg: "bg-health-light", glow: "group-hover/item:shadow-[0_0_20px_rgba(244,63,94,0.15)]", desc: "Compare health plans across top insurers" },
  { name: "Term Life Insurance", href: "/compare/term-life", icon: Shield, color: "text-term", bg: "bg-term-light", glow: "group-hover/item:shadow-[0_0_20px_rgba(99,102,241,0.15)]", desc: "Evaluate coverage, riders, and claim ratios" },
  { name: "Motor Insurance", href: "/compare/motor", icon: Car, color: "text-motor", bg: "bg-motor-light", glow: "group-hover/item:shadow-[0_0_20px_rgba(6,214,160,0.15)]", desc: "Check add-ons, garages, and NCB benefits" },
  { name: "Travel Insurance", href: "/compare/travel", icon: Plane, color: "text-travel", bg: "bg-travel-light", glow: "group-hover/item:shadow-[0_0_20px_rgba(245,158,11,0.15)]", desc: "Medical cover, trip cancellation, and more" },
];

const allCountries = [
  { code: "in", name: "India", flag: "🇮🇳" },
  { code: "us", name: "United States", flag: "🇺🇸" },
  { code: "uk", name: "United Kingdom", flag: "🇬🇧" },
  { code: "ae", name: "UAE", flag: "🇦🇪" },
  { code: "sg", name: "Singapore", flag: "🇸🇬" },
  { code: "ca", name: "Canada", flag: "🇨🇦" },
  { code: "au", name: "Australia", flag: "🇦🇺" },
  { code: "de", name: "Germany", flag: "🇩🇪" },
  { code: "sa", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "jp", name: "Japan", flag: "🇯🇵" },
  { code: "kr", name: "South Korea", flag: "🇰🇷" },
  { code: "hk", name: "Hong Kong", flag: "🇭🇰" },
];

const navLinks = [
  { name: "Insurers", href: "/insurers" },
  { name: "Learn", href: "/learn" },
  { name: "About", href: "/about" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) {
        setCountryOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled
          ? "glass border-b border-border/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-[1320px] px-5 lg:px-8">
        <div className="flex h-[68px] items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-9 h-9">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary via-[#7c3aed] to-accent opacity-90 group-hover:opacity-100 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.3)]" />
              <span className="relative flex items-center justify-center w-full h-full text-white font-bold text-[11px] tracking-tight">
                WBI
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-[18px] sm:text-[20px] font-bold tracking-[-0.03em] text-text-primary leading-none">
                World Best Insurer
              </span>
              <span className="text-[9px] font-medium text-text-tertiary tracking-[0.12em] uppercase leading-none mt-0.5">
                Global Insurance Comparison
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-0.5">
            {/* Country Selector */}
            <div className="relative" ref={countryRef}>
              <button
                onClick={() => { setCountryOpen(!countryOpen); setCompareOpen(false); }}
                className={cn(
                  "flex items-center gap-1.5 px-3.5 py-2 text-[13.5px] font-medium rounded-xl transition-all duration-200",
                  countryOpen
                    ? "text-primary bg-primary-light"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-sunken"
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                Country
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", countryOpen && "rotate-180")} />
              </button>

              {countryOpen && (
                <div className="absolute top-full left-0 pt-3 w-[400px]">
                  <div className="bg-surface rounded-2xl border border-border shadow-2xl p-3 animate-scale-in">
                    <p className="px-2 py-1.5 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.12em]">
                      Select a country
                    </p>
                    <div className="grid grid-cols-2 gap-1 mt-1.5 max-h-[380px] overflow-y-auto">
                      {allCountries.map((c) => (
                        <Link
                          key={c.code}
                          href={`/${c.code}`}
                          onClick={() => setCountryOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-surface-sunken transition-all duration-200 group/c"
                        >
                          <span className="text-[20px]">{c.flag}</span>
                          <div>
                            <p className="text-[13px] font-semibold text-text-primary group-hover/c:text-primary transition-colors">
                              {c.name}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compare dropdown */}
            <div
              className="relative"
              onMouseEnter={() => { setCompareOpen(true); setCountryOpen(false); }}
              onMouseLeave={() => setCompareOpen(false)}
            >
              <button
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-[13.5px] font-medium rounded-xl transition-all duration-200",
                  compareOpen
                    ? "text-primary bg-primary-light"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-sunken"
                )}
              >
                Compare
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform duration-300",
                    compareOpen && "rotate-180"
                  )}
                />
              </button>

              {compareOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[560px]">
                  <div className="bg-surface rounded-2xl border border-border shadow-2xl p-3 animate-scale-in">
                    <div className="grid grid-cols-2 gap-1.5">
                      {categories.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          className={cn("flex items-start gap-3 p-3.5 rounded-xl hover:bg-surface-sunken transition-all duration-200 group/item", cat.glow)}
                        >
                          <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200", cat.bg)}>
                            <cat.icon className={cn("w-5 h-5", cat.color)} />
                          </div>
                          <div>
                            <p className="text-[13.5px] font-semibold text-text-primary group-hover/item:text-primary transition-colors">
                              {cat.name}
                            </p>
                            <p className="text-[11.5px] text-text-tertiary leading-snug mt-0.5">
                              {cat.desc}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-2 pt-2.5 border-t border-border-light">
                      <Link
                        href="/methodology"
                        className="flex items-center gap-2 px-3.5 py-2.5 text-[12px] font-medium text-text-tertiary hover:text-primary transition-colors rounded-xl hover:bg-primary-light"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        How we collect &amp; verify data
                        <ArrowRight className="w-3 h-3 ml-auto" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-[13.5px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-sunken rounded-xl transition-all duration-200"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/contact"
              className="px-4 py-2 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/waitlist"
              className="btn-glow inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold text-white bg-gradient-to-r from-primary to-[#7c3aed] rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              Join Waitlist
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 -mr-2 text-text-secondary hover:text-text-primary rounded-xl transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-border-light animate-slide-up">
            {/* Country selector - mobile */}
            <div className="mb-4">
              <p className="px-3 py-1.5 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.12em]">
                🌍 Select Country
              </p>
              <div className="grid grid-cols-3 gap-1.5 mt-1">
                {allCountries.map((c) => (
                  <Link
                    key={c.code}
                    href={`/${c.code}`}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-surface-sunken transition-colors text-center"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span className="text-[18px]">{c.flag}</span>
                    <span className="text-[12px] font-medium text-text-primary truncate">{c.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="space-y-1 mb-4 pt-3 border-t border-border-light">
              <p className="px-3 py-1.5 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.12em]">
                Compare Insurance
              </p>
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-surface-sunken transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", cat.bg)}>
                    <cat.icon className={cn("w-5 h-5", cat.color)} />
                  </div>
                  <div>
                    <span className="text-[14px] font-semibold text-text-primary">{cat.name}</span>
                    <p className="text-[11px] text-text-tertiary">{cat.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
            <div className="space-y-1 mb-4 pt-3 border-t border-border-light">
              {navLinks.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-3 text-[14px] font-medium text-text-secondary hover:text-text-primary rounded-xl hover:bg-surface-sunken"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="pt-3 border-t border-border-light px-3">
              <Link
                href="/waitlist"
                className="flex items-center justify-center gap-2 w-full py-3 text-[14px] font-semibold text-white bg-gradient-to-r from-primary to-[#7c3aed] rounded-xl"
                onClick={() => setMobileOpen(false)}
              >
                Join Waitlist <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
