"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Menu, X, ChevronDown, Heart, Shield, Car, Plane,
  ArrowRight, Sparkles, Globe, ArrowUpRight, Search,
} from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  { name: "Health", href: "/compare/health", icon: Heart, color: "text-health", bg: "bg-health-light", desc: "Medical & hospitalization" },
  { name: "Term Life", href: "/compare/term-life", icon: Shield, color: "text-term", bg: "bg-term-light", desc: "Life cover & protection" },
  { name: "Motor", href: "/compare/motor", icon: Car, color: "text-motor", bg: "bg-motor-light", desc: "Car & bike insurance" },
  { name: "Travel", href: "/compare/travel", icon: Plane, color: "text-travel", bg: "bg-travel-light", desc: "Trip & medical abroad" },
];

const countries = [
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

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [countryOpen, setCountryOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const countryRef = useRef<HTMLDivElement>(null);
  const compareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setCountryOpen(false);
      if (compareRef.current && !compareRef.current.contains(e.target as Node)) setCompareOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-700",
        scrolled
          ? "glass border-b border-border/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto max-w-[1280px] px-5 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a2e] via-primary to-[#1a1a2e] group-hover:from-primary group-hover:via-accent group-hover:to-primary transition-all duration-700" />
              <span className="relative flex items-center justify-center w-full h-full text-white font-black text-[10px] tracking-[0.05em]">
                WBI
              </span>
            </div>
            <div className="hidden sm:block">
              <span className="text-[15px] font-bold tracking-[-0.03em] text-text-primary leading-none">
                World Best Insurer
              </span>
            </div>
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Country */}
            <div className="relative" ref={countryRef}>
              <button
                onClick={() => { setCountryOpen(!countryOpen); setCompareOpen(false); }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200",
                  countryOpen
                    ? "text-primary bg-primary-light"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-sunken"
                )}
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Country</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", countryOpen && "rotate-180")} />
              </button>

              {countryOpen && (
                <div className="absolute top-full left-0 pt-2.5 w-[380px] animate-scale-in" style={{ transformOrigin: "top left" }}>
                  <div className="bg-surface rounded-xl border border-border shadow-xl p-2">
                    <p className="px-3 py-2 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.15em]">
                      Select market
                    </p>
                    <div className="grid grid-cols-2 gap-0.5 max-h-[360px] overflow-y-auto">
                      {countries.map((c) => (
                        <Link
                          key={c.code}
                          href={`/${c.code}`}
                          onClick={() => setCountryOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-sunken transition-all group/c"
                        >
                          <span className="text-[18px] group-hover/c:scale-110 transition-transform">{c.flag}</span>
                          <span className="text-[13px] font-medium text-text-primary group-hover/c:text-primary transition-colors">
                            {c.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compare */}
            <div className="relative" ref={compareRef}>
              <button
                onClick={() => { setCompareOpen(!compareOpen); setCountryOpen(false); }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium rounded-lg transition-all duration-200",
                  compareOpen
                    ? "text-primary bg-primary-light"
                    : "text-text-secondary hover:text-text-primary hover:bg-surface-sunken"
                )}
              >
                <span>Compare</span>
                <ChevronDown className={cn("w-3 h-3 transition-transform duration-300", compareOpen && "rotate-180")} />
              </button>

              {compareOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2.5 w-[480px] animate-scale-in" style={{ transformOrigin: "top center" }}>
                  <div className="bg-surface rounded-xl border border-border shadow-xl p-2">
                    <div className="grid grid-cols-2 gap-1">
                      {categories.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          onClick={() => setCompareOpen(false)}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-surface-sunken transition-all group/item"
                        >
                          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all", cat.bg)}>
                            <cat.icon className={cn("w-4 h-4", cat.color)} />
                          </div>
                          <div>
                            <p className="text-[13px] font-semibold text-text-primary group-hover/item:text-primary transition-colors">
                              {cat.name}
                            </p>
                            <p className="text-[11px] text-text-tertiary mt-0.5">{cat.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-1.5 pt-2 border-t border-border-light">
                      <Link
                        href="/methodology"
                        onClick={() => setCompareOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-[11.5px] font-medium text-text-tertiary hover:text-primary transition-colors rounded-lg hover:bg-primary-light"
                      >
                        <Sparkles className="w-3 h-3" />
                        Our data methodology
                        <ArrowRight className="w-3 h-3 ml-auto" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/insurers" className="px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-sunken rounded-lg transition-all">
              Insurers
            </Link>
            <Link href="/learn" className="px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-sunken rounded-lg transition-all">
              Learn
            </Link>
            <Link href="/insights" className="px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-sunken rounded-lg transition-all">
              Insights
            </Link>
            <Link href="/about" className="px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-sunken rounded-lg transition-all">
              About
            </Link>
          </div>

          {/* ── Desktop CTA ── */}
          <div className="hidden lg:flex items-center gap-2">
            {/* Search trigger — opens Cmd+K modal */}
            <button
              onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
              className="flex items-center gap-2 px-3 py-1.5 text-[12px] text-text-tertiary bg-surface-sunken border border-border rounded-lg hover:border-border-strong hover:text-text-secondary transition-all"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
              <kbd className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[9px] font-medium bg-surface border border-border rounded text-text-tertiary">⌘K</kbd>
            </button>
            <Link
              href="/contact"
              className="px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:text-text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/waitlist"
              className="btn-glow inline-flex items-center gap-2 px-4 py-2 text-[12.5px] font-semibold text-white bg-[#1a1a2e] rounded-lg transition-all duration-300 hover:shadow-lg"
            >
              Get Early Access
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="lg:hidden p-2 -mr-2 text-text-secondary hover:text-text-primary rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div className="lg:hidden py-4 border-t border-border-light animate-fade-in">
            <p className="px-3 py-2 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.15em]">Markets</p>
            <div className="grid grid-cols-3 gap-1 mb-3">
              {countries.map((c) => (
                <Link
                  key={c.code}
                  href={`/${c.code}`}
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:bg-surface-sunken transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <span className="text-[16px]">{c.flag}</span>
                  <span className="text-[11px] font-medium text-text-primary truncate">{c.name}</span>
                </Link>
              ))}
            </div>

            <div className="pt-3 border-t border-border-light">
              <p className="px-3 py-2 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.15em]">Compare</p>
              {categories.map((cat) => (
                <Link
                  key={cat.href}
                  href={cat.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-surface-sunken transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", cat.bg)}>
                    <cat.icon className={cn("w-4 h-4", cat.color)} />
                  </div>
                  <div>
                    <span className="text-[13px] font-semibold text-text-primary">{cat.name}</span>
                    <p className="text-[10.5px] text-text-tertiary">{cat.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="space-y-0.5 pt-3 border-t border-border-light mt-3">
              {[
                { name: "Insurers", href: "/insurers" },
                { name: "Learn", href: "/learn" },
                { name: "Insights", href: "/insights" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2.5 text-[13px] font-medium text-text-secondary hover:text-text-primary rounded-lg hover:bg-surface-sunken"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 px-3 border-t border-border-light mt-3">
              <Link
                href="/waitlist"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-[13px] font-semibold text-white bg-[#1a1a2e] rounded-lg"
                onClick={() => setMobileOpen(false)}
              >
                Get Early Access <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
