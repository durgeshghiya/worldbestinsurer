"use client";

import { useState, useMemo } from "react";
import { Search, X, Filter } from "lucide-react";
import ContactCard from "./ContactCard";
import type { Insurer, Category } from "@/lib/types";

const COUNTRY_FLAGS: Record<string, string> = {
  in: "🇮🇳",
  us: "🇺🇸",
  uk: "🇬🇧",
  ae: "🇦🇪",
  sg: "🇸🇬",
  ca: "🇨🇦",
  au: "🇦🇺",
  de: "🇩🇪",
  sa: "🇸🇦",
  jp: "🇯🇵",
  kr: "🇰🇷",
  hk: "🇭🇰",
};

const COUNTRY_NAMES: Record<string, string> = {
  in: "India",
  us: "United States",
  uk: "United Kingdom",
  ae: "UAE",
  sg: "Singapore",
  ca: "Canada",
  au: "Australia",
  de: "Germany",
  sa: "Saudi Arabia",
  jp: "Japan",
  kr: "South Korea",
  hk: "Hong Kong",
};

const CATEGORY_OPTIONS = [
  { value: "health", label: "Health", color: "#c44058" },
  { value: "term-life", label: "Term Life", color: "#2d3a8c" },
  { value: "motor", label: "Motor", color: "#2d8f6f" },
  { value: "travel", label: "Travel", color: "#c47d2e" },
];

interface Props {
  insurers: Insurer[];
  countries: string[];
}

export default function ContactDirectorySearch({ insurers, countries }: Props) {
  const [search, setSearch] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return insurers.filter((ins) => {
      if (selectedCountry && ins.countryCode !== selectedCountry) return false;
      if (selectedCategory && !ins.categories.includes(selectedCategory as Category)) return false;
      if (search) {
        const q = search.toLowerCase();
        const countryName = COUNTRY_NAMES[ins.countryCode]?.toLowerCase() || "";
        return (
          ins.name.toLowerCase().includes(q) ||
          ins.shortName.toLowerCase().includes(q) ||
          countryName.includes(q) ||
          ins.headquarters?.toLowerCase().includes(q) ||
          ins.contact?.customerCareNumber?.includes(q) ||
          ins.contact?.email?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [insurers, search, selectedCountry, selectedCategory]);

  // Group by country
  const grouped = useMemo(() => {
    const map = new Map<string, Insurer[]>();
    for (const cc of countries) {
      const items = filtered.filter((i) => i.countryCode === cc);
      if (items.length > 0) map.set(cc, items);
    }
    return map;
  }, [filtered, countries]);

  const totalResults = filtered.length;
  const hasFilters = !!search || !!selectedCountry || !!selectedCategory;

  return (
    <div>
      {/* Search & Filters */}
      <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-xl border-b border-border/50 -mx-4 px-4 py-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 mb-8">
        <div className="max-w-7xl mx-auto">
          {/* Search bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search by insurer name, country, city, phone, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-surface border border-border rounded-xl text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-surface-sunken transition-colors"
              >
                <X className="w-4 h-4 text-text-tertiary" />
              </button>
            )}
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 items-center">
            <Filter className="w-4 h-4 text-text-tertiary mr-1" />

            {/* Country pills */}
            <div className="flex flex-wrap gap-1.5">
              {countries.map((cc) => (
                <button
                  key={cc}
                  onClick={() => setSelectedCountry(selectedCountry === cc ? null : cc)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedCountry === cc
                      ? "bg-primary text-white shadow-sm"
                      : "bg-surface-sunken text-text-secondary hover:bg-surface hover:text-text-primary"
                  }`}
                >
                  {COUNTRY_FLAGS[cc]} {COUNTRY_NAMES[cc]}
                </button>
              ))}
            </div>

            {/* Divider */}
            <div className="w-px h-5 bg-border mx-1 hidden sm:block" />

            {/* Category pills */}
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_OPTIONS.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat.value ? null : cat.value)
                  }
                  className="px-2.5 py-1 rounded-full text-xs font-medium transition-all"
                  style={
                    selectedCategory === cat.value
                      ? { backgroundColor: cat.color, color: "#fff" }
                      : { backgroundColor: "var(--color-surface-sunken)", color: "var(--color-text-secondary)" }
                  }
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Clear all */}
            {hasFilters && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCountry(null);
                  setSelectedCategory(null);
                }}
                className="ml-2 text-xs text-primary hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Results count */}
          <p className="text-xs text-text-tertiary mt-3">
            {totalResults} insurer{totalResults !== 1 ? "s" : ""}{" "}
            {hasFilters && `found`}
            {!hasFilters && `across ${countries.length} countries`}
          </p>
        </div>
      </div>

      {/* Country-grouped results */}
      {grouped.size === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-text-secondary">No insurers found</p>
          <p className="text-sm text-text-tertiary mt-1">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="space-y-12">
          {[...grouped.entries()].map(([cc, items]) => (
            <section key={cc} id={`country-${cc}`}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{COUNTRY_FLAGS[cc]}</span>
                <h2 className="text-xl font-bold text-text-primary">
                  {COUNTRY_NAMES[cc]}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-surface-sunken text-xs font-medium text-text-tertiary">
                  {items.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {items.map((ins) => (
                  <ContactCard
                    key={ins.slug}
                    insurer={ins}
                    countryFlag={COUNTRY_FLAGS[cc]}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
