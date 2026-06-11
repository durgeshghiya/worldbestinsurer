"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
 * Dark hairline variant of HomeSelector for the immersive homepage.
 * Same routing contract: /{country}/compare/{category}/, with partial
 * fallbacks when only one selector is filled.
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

  return (
    <div className="imm-launcher">
      <label className="imm-field">
        <span className="imm-field-label">Country market</span>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          aria-label="Country market"
        >
          <option value="">Select country</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name}
            </option>
          ))}
        </select>
      </label>

      <label className="imm-field">
        <span className="imm-field-label">Insurance type</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Insurance type"
        >
          <option value="">Select type</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.shortName}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={handleCompare}
        disabled={!country && !category}
        className="imm-compare-btn"
      >
        Compare <span aria-hidden="true">→</span>
      </button>
    </div>
  );
}
