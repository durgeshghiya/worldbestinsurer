"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const suggestions = [
  { text: "Health insurance in India", href: "/in/compare/health/" },
  { text: "Compare term life plans", href: "/compare/term-life/" },
  { text: "Best car insurance USA", href: "/us/compare/motor/" },
  { text: "Travel insurance for Schengen", href: "/learn/schengen-travel-insurance-requirements/" },
  { text: "Star Health vs Care Health", href: "/vs/star-comprehensive-vs-care-supreme/" },
  { text: "Health insurance UK", href: "/uk/compare/health/" },
  { text: "Motor insurance UAE", href: "/ae/compare/motor/" },
  { text: "How claim settlement works", href: "/learn/claim-settlement-ratio-explained/" },
];

const placeholders = [
  "Search health insurance plans...",
  "Compare term life insurance...",
  "Find motor insurance deals...",
  "Explore travel insurance...",
  "Search by insurer name...",
  "Compare plans across countries...",
];

export default function HeroSearch() {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Rotate placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = query.trim()
    ? suggestions.filter((s) => s.text.toLowerCase().includes(query.toLowerCase()))
    : suggestions;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      // Trigger Cmd+K modal with the query
      setFocused(false);
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }));
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full max-w-[620px] mx-auto">
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            "relative flex items-center gap-3 rounded-2xl transition-all duration-500",
            focused
              ? "bg-white/[0.12] border-white/[0.25] shadow-[0_0_40px_rgba(196,125,46,0.15),0_0_80px_rgba(45,58,140,0.1)]"
              : "bg-white/[0.07] border-white/[0.1] shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
          )}
          style={{ border: "1px solid" }}
        >
          {/* Search icon with glow */}
          <div className="pl-5">
            <Search className={cn("w-5 h-5 transition-colors duration-300", focused ? "text-[#c47d2e]" : "text-white/40")} />
          </div>

          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            placeholder={placeholders[placeholderIdx]}
            className="flex-1 bg-transparent py-4 text-[15px] sm:text-[16px] text-white placeholder:text-white/30 outline-none"
          />

          {/* Submit button */}
          <button
            type="submit"
            className={cn(
              "mr-2 flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-300",
              query.trim()
                ? "bg-gradient-to-r from-[#c47d2e] to-[#e09a4a] text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
                : "bg-white/[0.08] text-white/50 hover:bg-white/[0.12]"
            )}
          >
            <span className="hidden sm:inline">Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* ── Suggestions dropdown ── */}
      <AnimatePresence>
        {focused && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-full left-0 right-0 mt-2 z-20"
          >
            <div className="bg-[#1a1a2e]/95 backdrop-blur-xl rounded-xl border border-white/[0.08] shadow-2xl overflow-hidden">
              <div className="px-4 py-2.5 border-b border-white/[0.06]">
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.15em] flex items-center gap-1.5">
                  <TrendingUp className="w-3 h-3" />
                  {query.trim() ? "Suggestions" : "Popular Searches"}
                </p>
              </div>

              <div className="py-1.5 max-h-[280px] overflow-y-auto">
                {filtered.length === 0 ? (
                  <div className="px-4 py-4 text-center">
                    <p className="text-[12px] text-white/30">No suggestions found</p>
                    <p className="text-[11px] text-white/20 mt-1">Press Enter to search globally</p>
                  </div>
                ) : (
                  filtered.map((s, i) => (
                    <button
                      key={s.text}
                      onClick={() => {
                        setFocused(false);
                        setQuery("");
                        router.push(s.href);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.06] transition-all group text-left"
                    >
                      <div className="w-7 h-7 rounded-lg bg-white/[0.06] flex items-center justify-center shrink-0 group-hover:bg-white/[0.1] transition-colors">
                        <Search className="w-3.5 h-3.5 text-white/30 group-hover:text-[#c47d2e] transition-colors" />
                      </div>
                      <span className="text-[13px] text-white/60 group-hover:text-white/90 transition-colors flex-1">
                        {s.text}
                      </span>
                      <ArrowRight className="w-3 h-3 text-white/0 group-hover:text-white/30 transition-all" />
                    </button>
                  ))
                )}
              </div>

              <div className="px-4 py-2 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] text-white/20 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI-powered search
                </span>
                <span className="text-[10px] text-white/20">
                  Press <kbd className="px-1 py-0.5 bg-white/[0.06] rounded text-[9px]">⌘K</kbd> for full search
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
