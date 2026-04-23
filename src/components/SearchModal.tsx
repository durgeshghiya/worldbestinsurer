"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, X, Heart, Shield, Car, Plane, Building2, BookOpen,
  Globe, Command, CornerDownLeft, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ── */
import type { SearchItemData } from "@/lib/search-index";

interface SearchModalProps {
  items: SearchItemData[];
}

/* Map types/categories to icons client-side */
const typeIcons: Record<string, typeof Heart> = {
  product: Heart,
  insurer: Building2,
  article: BookOpen,
  country: Globe,
  category: Heart,
};
const catIcons: Record<string, typeof Heart> = {
  health: Heart,
  "term-life": Shield,
  motor: Car,
  travel: Plane,
};

function getItemIcon(item: SearchItemData): typeof Heart {
  if (item.categorySlug && catIcons[item.categorySlug]) return catIcons[item.categorySlug];
  return typeIcons[item.type] || Heart;
}

const typeLabels: Record<string, string> = {
  product: "Product",
  insurer: "Insurer",
  article: "Guide",
  country: "Market",
  category: "Category",
};

const typeColors: Record<string, string> = {
  product: "bg-primary-light text-primary",
  insurer: "bg-accent-light text-accent",
  article: "bg-info-light text-info",
  country: "bg-success-light text-success",
  category: "bg-health-light text-health",
};

export default function SearchModal({ items }: SearchModalProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  /* ── Keyboard shortcut: Cmd+K / Ctrl+K ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ── Focus input when opened; reset state each time ── */
  // Resetting query/selected index on open is an intentional UX behavior
  // (fresh search each time the modal opens), not a cascading render bug.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);
  /* eslint-enable react-hooks/set-state-in-effect */

  /* ── Filter results ── */
  const results = useMemo(() => {
    if (!query.trim()) {
      // Show popular/trending items when no query
      return items.slice(0, 8);
    }
    const q = query.toLowerCase();
    return items
      .filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.type.includes(q)
      )
      .slice(0, 12);
  }, [query, items]);

  /* ── Keyboard navigation ── */
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        setOpen(false);
        window.location.href = results[selectedIndex].href;
      }
    },
    [results, selectedIndex]
  );

  /* ── Scroll selected item into view ── */
  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-[12.5px] text-text-tertiary bg-surface-sunken border border-border rounded-lg hover:border-border-strong hover:text-text-secondary transition-all group"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-surface border border-border rounded text-text-tertiary ml-2">
          <Command className="w-2.5 h-2.5" />K
        </kbd>
      </button>

      {/* ── Modal ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[15vh] left-1/2 -translate-x-1/2 z-[101] w-[calc(100%-2rem)] max-w-[580px]"
            >
              <div className="bg-surface rounded-xl border border-border shadow-2xl overflow-hidden">
                {/* ── Search input ── */}
                <div className="flex items-center gap-3 px-4 py-3 border-b border-border-light">
                  <Search className="w-4 h-4 text-text-tertiary shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
                    onKeyDown={handleKeyDown}
                    placeholder="Search products, insurers, guides, countries..."
                    className="flex-1 bg-transparent text-[14px] text-text-primary placeholder:text-text-tertiary outline-none"
                  />
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1 text-text-tertiary hover:text-text-primary rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* ── Results ── */}
                <div ref={listRef} className="max-h-[400px] overflow-y-auto py-2">
                  {!query.trim() && (
                    <p className="px-4 py-1.5 text-[10px] font-bold text-text-tertiary uppercase tracking-[0.15em]">
                      <TrendingUp className="w-3 h-3 inline mr-1" />
                      Popular
                    </p>
                  )}

                  {results.length === 0 ? (
                    <div className="px-4 py-8 text-center">
                      <p className="text-[13px] text-text-tertiary">No results for &ldquo;{query}&rdquo;</p>
                      <p className="text-[11px] text-text-tertiary mt-1">Try searching for a product, insurer, or topic</p>
                    </div>
                  ) : (
                    results.map((item, i) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-2.5 mx-1 rounded-lg transition-all",
                          i === selectedIndex
                            ? "bg-primary-light"
                            : "hover:bg-surface-sunken"
                        )}
                        onMouseEnter={() => setSelectedIndex(i)}
                      >
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", typeColors[item.type] || "bg-surface-sunken text-text-secondary")}>
                          {(() => { const Icon = getItemIcon(item); return <Icon className="w-4 h-4" />; })()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-text-primary truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-text-tertiary truncate">
                            {item.subtitle}
                          </p>
                        </div>
                        <span className={cn("text-[9px] font-bold uppercase tracking-[0.1em] px-1.5 py-0.5 rounded-full", typeColors[item.type] || "bg-surface-sunken text-text-tertiary")}>
                          {typeLabels[item.type]}
                        </span>
                        {i === selectedIndex && (
                          <CornerDownLeft className="w-3 h-3 text-text-tertiary shrink-0" />
                        )}
                      </Link>
                    ))
                  )}
                </div>

                {/* ── Footer hints ── */}
                <div className="flex items-center gap-4 px-4 py-2.5 border-t border-border-light bg-surface-sunken/50">
                  <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
                    <kbd className="px-1 py-0.5 bg-surface border border-border rounded text-[9px]">↑↓</kbd>
                    Navigate
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
                    <kbd className="px-1 py-0.5 bg-surface border border-border rounded text-[9px]">↵</kbd>
                    Open
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-text-tertiary">
                    <kbd className="px-1 py-0.5 bg-surface border border-border rounded text-[9px]">Esc</kbd>
                    Close
                  </span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

