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

export default function HomeSelector({
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

  const isReady = country && category;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-[540px]">
      {/* Country dropdown */}
      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        className="flex-1 px-4 py-3 text-[14px] bg-white border border-gray-200 rounded-lg text-gray-900 outline-none focus:border-gray-400 transition-colors appearance-none cursor-pointer"
      >
        <option value="">Country</option>
        {countries.map((c) => (
          <option key={c.code} value={c.code}>
            {c.flag} {c.name}
          </option>
        ))}
      </select>

      {/* Category dropdown */}
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="flex-1 px-4 py-3 text-[14px] bg-white border border-gray-200 rounded-lg text-gray-900 outline-none focus:border-gray-400 transition-colors appearance-none cursor-pointer"
      >
        <option value="">Insurance type</option>
        {categories.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.shortName}
          </option>
        ))}
      </select>

      {/* Compare button */}
      <button
        onClick={handleCompare}
        disabled={!isReady}
        className="px-6 py-3 text-[14px] font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 shrink-0"
      >
        Compare
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
