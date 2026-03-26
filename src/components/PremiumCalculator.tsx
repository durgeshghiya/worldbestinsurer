"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Shield,
  Car,
  Plane,
  ArrowUpRight,
  TrendingUp,
  Users,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import { cn, formatCompact } from "@/lib/utils";
import { getProductsByCategory } from "@/lib/data";
import type { Category, InsuranceProduct } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Props {
  category: Category;
  countryCode: string;
}

type HealthFamily = "individual" | "floater" | "parents";
type CityTier = "metro" | "non-metro";
type VehicleType = "car" | "two-wheeler";
type VehicleAge = "new" | "1-3" | "3-5" | "5+";
type CoverType = "comprehensive" | "third-party";
type TripType = "international" | "domestic";
type TripDuration = "7" | "15" | "30" | "annual";
type TravelerCount = "1" | "2" | "family";

// ---------------------------------------------------------------------------
// Shared UI primitives
// ---------------------------------------------------------------------------

function PillGroup<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={cn(
              "px-4 py-2 text-[12.5px] font-medium rounded-full border transition-all duration-200",
              value === o.value
                ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]"
                : "bg-surface border-border text-text-secondary hover:border-primary/30 hover:bg-primary-light"
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AgeSlider({
  value,
  onChange,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
          Age
        </label>
        <span className="text-[14px] font-bold text-primary">{value} yrs</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-surface-sunken rounded-full appearance-none cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary
          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:shadow-primary/30
          [&::-webkit-slider-thumb]:transition-transform [&::-webkit-slider-thumb]:hover:scale-110"
      />
      <div className="flex justify-between text-[10px] text-text-tertiary">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Cover amount options per category/country (illustrative)
// ---------------------------------------------------------------------------

function getCoverOptions(category: Category, countryCode: string) {
  const isIndia = countryCode === "in";
  if (category === "health") {
    return isIndia
      ? [
          { value: 500000, label: "\u20B95L" },
          { value: 1000000, label: "\u20B910L" },
          { value: 2500000, label: "\u20B925L" },
          { value: 5000000, label: "\u20B950L" },
          { value: 10000000, label: "\u20B91Cr" },
        ]
      : [
          { value: 50000, label: formatCompact(50000, countryCode) },
          { value: 100000, label: formatCompact(100000, countryCode) },
          { value: 250000, label: formatCompact(250000, countryCode) },
          { value: 500000, label: formatCompact(500000, countryCode) },
          { value: 1000000, label: formatCompact(1000000, countryCode) },
        ];
  }
  if (category === "term-life") {
    return isIndia
      ? [
          { value: 2500000, label: "\u20B925L" },
          { value: 5000000, label: "\u20B950L" },
          { value: 10000000, label: "\u20B91Cr" },
          { value: 20000000, label: "\u20B92Cr" },
        ]
      : [
          { value: 100000, label: formatCompact(100000, countryCode) },
          { value: 250000, label: formatCompact(250000, countryCode) },
          { value: 500000, label: formatCompact(500000, countryCode) },
          { value: 1000000, label: formatCompact(1000000, countryCode) },
        ];
  }
  return [];
}

// ---------------------------------------------------------------------------
// Category icon
// ---------------------------------------------------------------------------

const categoryConfig: Record<
  Category,
  { icon: typeof Heart; gradient: string; glow: string }
> = {
  health: {
    icon: Heart,
    gradient: "from-rose-500 to-pink-500",
    glow: "shadow-rose-500/20",
  },
  "term-life": {
    icon: Shield,
    gradient: "from-indigo-500 to-violet-500",
    glow: "shadow-indigo-500/20",
  },
  motor: {
    icon: Car,
    gradient: "from-emerald-500 to-teal-500",
    glow: "shadow-emerald-500/20",
  },
  travel: {
    icon: Plane,
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
  },
};

// ---------------------------------------------------------------------------
// Filter logic
// ---------------------------------------------------------------------------

function filterProducts(
  products: InsuranceProduct[],
  category: Category,
  filters: Record<string, unknown>
): InsuranceProduct[] {
  let results = [...products];

  // Age filter
  const age = filters.age as number | undefined;
  if (age !== undefined) {
    results = results.filter(
      (p) =>
        p.eligibility.minAge <= age &&
        (p.eligibility.maxAge === null || p.eligibility.maxAge >= age)
    );
  }

  // Cover amount filter
  const cover = filters.cover as number | undefined;
  if (cover !== undefined) {
    results = results.filter((p) => {
      const min = p.sumInsured.min ?? 0;
      const max = p.sumInsured.max ?? Infinity;
      return cover >= min && cover <= max;
    });
  }

  // Sub-category filters
  const subCat = filters.subCategory as string | undefined;
  if (subCat) {
    results = results.filter((p) =>
      p.subCategory.toLowerCase().includes(subCat.toLowerCase())
    );
  }

  // Sort by illustrative premium ascending
  results.sort(
    (a, b) => a.premiumRange.illustrativeMin - b.premiumRange.illustrativeMin
  );

  return results.slice(0, 5);
}

// ---------------------------------------------------------------------------
// Mini product result card
// ---------------------------------------------------------------------------

function MiniProductCard({
  product,
  countryCode,
  gradient,
}: {
  product: InsuranceProduct;
  countryCode: string;
  gradient: string;
}) {
  return (
    <div className="group/card relative bg-surface rounded-xl border border-border p-4 transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:-translate-y-0.5">
      <div
        className={cn(
          "absolute top-0 left-0 right-0 h-0.5 rounded-t-xl bg-gradient-to-r",
          gradient
        )}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold text-primary uppercase tracking-wider truncate">
            {product.insurerName}
          </p>
          <h4 className="text-[13px] font-semibold text-text-primary mt-0.5 leading-snug line-clamp-1">
            {product.productName}
          </h4>
        </div>
        {product.claimSettlement?.ratio && (
          <span className="shrink-0 flex items-center gap-1 text-[10px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
            <TrendingUp className="w-3 h-3" />
            {product.claimSettlement.ratio}%
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center gap-4">
        <div>
          <p className="text-[9px] text-text-tertiary uppercase tracking-wider">
            Cover
          </p>
          <p className="text-[12px] font-bold text-text-primary">
            {formatCompact(product.sumInsured.min, countryCode)} &ndash;{" "}
            {formatCompact(product.sumInsured.max, countryCode)}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-text-tertiary uppercase tracking-wider">
            From
          </p>
          <p className="text-[12px] font-bold text-text-primary">
            {formatCompact(product.premiumRange.illustrativeMin, countryCode)}
            <span className="text-[10px] text-text-tertiary font-medium">
              /yr
            </span>
          </p>
        </div>
        <Link
          href={`/product/${product.id}`}
          className="ml-auto flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
        >
          View Details <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>

      {product.specialFeatures.length > 0 && (
        <p className="mt-2 text-[10px] text-text-tertiary line-clamp-1">
          {product.specialFeatures[0]}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Category-specific filter panels
// ---------------------------------------------------------------------------

function HealthFilters({
  countryCode,
  onFilterChange,
}: {
  countryCode: string;
  onFilterChange: (f: Record<string, unknown>) => void;
}) {
  const [age, setAge] = useState(30);
  const [cover, setCover] = useState(getCoverOptions("health", countryCode)[1]?.value ?? 1000000);
  const [family, setFamily] = useState<HealthFamily>("individual");
  const [city, setCity] = useState<CityTier>("metro");

  const coverOptions = getCoverOptions("health", countryCode);

  useEffect(() => {
    onFilterChange({ age, cover, subCategory: family === "parents" ? "parent" : undefined });
  }, [age, cover, family, city]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-5">
      <AgeSlider value={age} onChange={setAge} min={18} max={75} />
      <PillGroup
        label="Cover Amount"
        options={coverOptions.map((o) => ({ value: String(o.value), label: o.label }))}
        value={String(cover)}
        onChange={(v) => setCover(Number(v))}
      />
      <PillGroup
        label="Family Type"
        options={[
          { value: "individual" as HealthFamily, label: "Individual" },
          { value: "floater" as HealthFamily, label: "Family Floater" },
          { value: "parents" as HealthFamily, label: "Parents" },
        ]}
        value={family}
        onChange={setFamily}
      />
      <PillGroup
        label="City Tier"
        options={[
          { value: "metro" as CityTier, label: "Metro" },
          { value: "non-metro" as CityTier, label: "Non-metro" },
        ]}
        value={city}
        onChange={setCity}
      />
    </div>
  );
}

function TermLifeFilters({
  countryCode,
  onFilterChange,
}: {
  countryCode: string;
  onFilterChange: (f: Record<string, unknown>) => void;
}) {
  const [age, setAge] = useState(30);
  const [cover, setCover] = useState(getCoverOptions("term-life", countryCode)[1]?.value ?? 5000000);
  const [gender, setGender] = useState<"male" | "female">("male");
  const [smoker, setSmoker] = useState<"no" | "yes">("no");

  const coverOptions = getCoverOptions("term-life", countryCode);

  useEffect(() => {
    onFilterChange({ age, cover });
  }, [age, cover, gender, smoker]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-5">
      <AgeSlider value={age} onChange={setAge} min={18} max={65} />
      <PillGroup
        label="Cover Amount"
        options={coverOptions.map((o) => ({ value: String(o.value), label: o.label }))}
        value={String(cover)}
        onChange={(v) => setCover(Number(v))}
      />
      <PillGroup
        label="Gender"
        options={[
          { value: "male" as const, label: "Male" },
          { value: "female" as const, label: "Female" },
        ]}
        value={gender}
        onChange={setGender}
      />
      <PillGroup
        label="Smoker"
        options={[
          { value: "no" as const, label: "No" },
          { value: "yes" as const, label: "Yes" },
        ]}
        value={smoker}
        onChange={setSmoker}
      />
    </div>
  );
}

function MotorFilters({
  onFilterChange,
}: {
  onFilterChange: (f: Record<string, unknown>) => void;
}) {
  const [vehicleType, setVehicleType] = useState<VehicleType>("car");
  const [vehicleAge, setVehicleAge] = useState<VehicleAge>("new");
  const [coverType, setCoverType] = useState<CoverType>("comprehensive");

  useEffect(() => {
    onFilterChange({
      subCategory: vehicleType === "two-wheeler" ? "two" : "car",
    });
  }, [vehicleType, vehicleAge, coverType]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-5">
      <PillGroup
        label="Vehicle Type"
        options={[
          { value: "car" as VehicleType, label: "Car" },
          { value: "two-wheeler" as VehicleType, label: "Two-wheeler" },
        ]}
        value={vehicleType}
        onChange={setVehicleType}
      />
      <PillGroup
        label="Vehicle Age"
        options={[
          { value: "new" as VehicleAge, label: "New" },
          { value: "1-3" as VehicleAge, label: "1-3 years" },
          { value: "3-5" as VehicleAge, label: "3-5 years" },
          { value: "5+" as VehicleAge, label: "5+ years" },
        ]}
        value={vehicleAge}
        onChange={setVehicleAge}
      />
      <PillGroup
        label="Cover Type"
        options={[
          { value: "comprehensive" as CoverType, label: "Comprehensive" },
          { value: "third-party" as CoverType, label: "Third-party Only" },
        ]}
        value={coverType}
        onChange={setCoverType}
      />
    </div>
  );
}

function TravelFilters({
  onFilterChange,
}: {
  onFilterChange: (f: Record<string, unknown>) => void;
}) {
  const [tripType, setTripType] = useState<TripType>("international");
  const [duration, setDuration] = useState<TripDuration>("7");
  const [travelers, setTravelers] = useState<TravelerCount>("1");

  useEffect(() => {
    onFilterChange({
      subCategory: tripType === "domestic" ? "domestic" : "international",
    });
  }, [tripType, duration, travelers]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-5">
      <PillGroup
        label="Trip Type"
        options={[
          { value: "international" as TripType, label: "International" },
          { value: "domestic" as TripType, label: "Domestic" },
        ]}
        value={tripType}
        onChange={setTripType}
      />
      <PillGroup
        label="Duration"
        options={[
          { value: "7" as TripDuration, label: "7 days" },
          { value: "15" as TripDuration, label: "15 days" },
          { value: "30" as TripDuration, label: "30 days" },
          { value: "annual" as TripDuration, label: "Annual" },
        ]}
        value={duration}
        onChange={setDuration}
      />
      <PillGroup
        label="Travelers"
        options={[
          { value: "1" as TravelerCount, label: "1" },
          { value: "2" as TravelerCount, label: "2" },
          { value: "family" as TravelerCount, label: "Family" },
        ]}
        value={travelers}
        onChange={setTravelers}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function PremiumCalculator({ category, countryCode }: Props) {
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const allProducts = useMemo(
    () => getProductsByCategory(category, countryCode),
    [category, countryCode]
  );
  const filtered = useMemo(
    () => filterProducts(allProducts, category, filters),
    [allProducts, category, filters]
  );

  const config = categoryConfig[category];
  const Icon = config.icon;

  const categoryLabel: Record<Category, string> = {
    health: "Health Insurance",
    "term-life": "Term Life Insurance",
    motor: "Motor Insurance",
    travel: "Travel Insurance",
  };

  return (
    <div className="relative">
      {/* Glassmorphism card */}
      <div className="relative rounded-3xl border border-border bg-surface/80 backdrop-blur-xl overflow-hidden shadow-lg">
        {/* Gradient border top */}
        <div
          className={cn(
            "h-1 bg-gradient-to-r",
            config.gradient
          )}
        />

        {/* Decorative blobs */}
        <div
          className={cn(
            "absolute -top-20 -right-20 w-60 h-60 rounded-full blur-3xl opacity-[0.06] bg-gradient-to-br",
            config.gradient
          )}
        />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full blur-3xl opacity-[0.04] bg-gradient-to-br from-primary to-accent" />

        <div className="relative p-6 md:p-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className={cn(
                "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg",
                config.gradient,
                config.glow
              )}
            >
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-text-primary">
                {categoryLabel[category]} Calculator
              </h3>
              <p className="text-[11px] text-text-tertiary flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                Adjust filters to explore plans
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Filter panel */}
            <div className="space-y-1">
              {category === "health" && (
                <HealthFilters
                  countryCode={countryCode}
                  onFilterChange={setFilters}
                />
              )}
              {category === "term-life" && (
                <TermLifeFilters
                  countryCode={countryCode}
                  onFilterChange={setFilters}
                />
              )}
              {category === "motor" && (
                <MotorFilters onFilterChange={setFilters} />
              )}
              {category === "travel" && (
                <TravelFilters onFilterChange={setFilters} />
              )}

              {/* Get Quote CTA */}
              <div className="pt-4">
                <a
                  href="#get-quote"
                  className={cn(
                    "inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold text-white rounded-xl",
                    "bg-gradient-to-r from-primary to-[#7c3aed] hover:shadow-lg hover:shadow-primary/20",
                    "transition-all duration-200 hover:scale-[1.02] btn-glow"
                  )}
                >
                  Get Free Quote
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Results */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[12px] font-semibold text-text-tertiary uppercase tracking-wider">
                  Matching Plans
                </h4>
                <span className="text-[11px] text-text-tertiary">
                  <Users className="w-3 h-3 inline mr-1" />
                  {filtered.length} of {allProducts.length}
                </span>
              </div>

              {filtered.length > 0 ? (
                <div className="space-y-2.5">
                  {filtered.map((p, i) => (
                    <div
                      key={p.id}
                      className="animate-fade-in"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <MiniProductCard
                        product={p}
                        countryCode={countryCode}
                        gradient={config.gradient}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-surface-sunken flex items-center justify-center mb-3">
                    <AlertCircle className="w-5 h-5 text-text-tertiary" />
                  </div>
                  <p className="text-[13px] font-medium text-text-secondary">
                    No matching plans found
                  </p>
                  <p className="text-[11px] text-text-tertiary mt-1">
                    Try adjusting your filters
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-6 pt-4 border-t border-border">
            <p className="text-[10px] text-text-tertiary flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3 shrink-0" />
              Illustrative only. Actual premiums may vary based on individual
              risk profile, medical history, and insurer underwriting.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
