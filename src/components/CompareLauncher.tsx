"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface Country {
  code: string;
  name: string;
  flag: string;
}

interface Category {
  slug: string;
  shortName: string;
}

/**
 * The homepage's primary action: pick a market and a line of cover, go to the
 * comparison table. Routing contract is /{country}/compare/{category}/, with
 * partial fallbacks when only one selector is filled.
 */
export default function CompareLauncher({
  countries,
  categories,
}: {
  countries: Country[];
  categories: Category[];
}) {
  const router = useRouter();
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");

  function handleCompare() {
    if (country && category) {
      router.push(`/${country}/compare/${category}/`);
    } else if (category) {
      router.push(`/compare/${category}/`);
    } else if (country) {
      router.push(`/${country}/`);
    }
  }

  const fieldClass =
    "w-full appearance-none rounded-xl border border-border bg-surface px-4 py-3 " +
    "text-[14.5px] text-text-primary shadow-sm transition-colors " +
    "hover:border-border-strong focus:border-primary focus:outline-none " +
    "focus:ring-2 focus:ring-primary/15";

  const labelClass =
    "mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.1em] text-text-tertiary";

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={labelClass}>Country market</span>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            aria-label="Country market"
            className={fieldClass}
          >
            <option value="">Select country</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={labelClass}>Insurance type</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            aria-label="Insurance type"
            className={fieldClass}
          >
            <option value="">Select type</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.shortName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        type="button"
        onClick={handleCompare}
        disabled={!country && !category}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl
                   bg-primary px-5 py-3 text-[14.5px] font-semibold text-white
                   transition-colors hover:bg-primary-hover
                   focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2
                   disabled:cursor-not-allowed disabled:bg-border-strong disabled:text-text-tertiary
                   sm:w-auto"
      >
        Compare plans
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
