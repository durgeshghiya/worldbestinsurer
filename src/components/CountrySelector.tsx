"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { countries, getCountryByCode } from "@/lib/countries";
import type { Country } from "@/lib/countries";

interface CountrySelectorProps {
  /** Currently active country code (e.g. "in") */
  currentCountry?: string;
  /** Base path pattern – %s is replaced with country code */
  hrefPattern?: string;
}

export default function CountrySelector({
  currentCountry = "in",
  hrefPattern = "/%s/compare/health",
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const active: Country | undefined = getCountryByCode(currentCountry);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function buildHref(code: string) {
    return hrefPattern.replace("%s", code);
  }

  return (
    <div ref={containerRef} className="relative inline-block text-left">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="text-lg leading-none" aria-hidden="true">
          {active?.flag ?? "\u{1F30D}"}
        </span>
        <span className="hidden sm:inline">
          {active?.name ?? "Select Country"}
        </span>
        <svg
          className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 z-50 mt-2 w-72 origin-top-right rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 focus:outline-none dark:border-gray-700 dark:bg-gray-900 sm:w-80"
          role="listbox"
          aria-label="Select country"
        >
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Choose your country
            </p>
          </div>

          <div className="max-h-80 overflow-y-auto py-1">
            {countries.map((c) => {
              const isCurrent = c.code === currentCountry;
              return (
                <Link
                  key={c.code}
                  href={buildHref(c.code)}
                  onClick={() => setOpen(false)}
                  role="option"
                  aria-selected={isCurrent}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    isCurrent
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                      : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  } ${!c.isActive && !isCurrent ? "opacity-60" : ""}`}
                >
                  <span className="text-xl leading-none shrink-0">
                    {c.flag}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">{c.name}</span>
                      {isCurrent && (
                        <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-blue-700 dark:bg-blue-800 dark:text-blue-200">
                          Current
                        </span>
                      )}
                      {!c.isActive && !isCurrent && (
                        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold uppercase text-gray-500 dark:bg-gray-800 dark:text-gray-400">
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-gray-400 truncate">
                      {c.currency.symbol} {c.currency.code} &middot;{" "}
                      {c.regulator}
                    </p>
                  </div>
                  {isCurrent && (
                    <svg
                      className="h-4 w-4 shrink-0 text-blue-600 dark:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
