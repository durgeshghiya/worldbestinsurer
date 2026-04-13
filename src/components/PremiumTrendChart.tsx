"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface HistoryEntry {
  date: string;
  premiumMin: number | null;
  premiumMax: number | null;
  csr: number | null;
}

export default function PremiumTrendChart({
  productId,
  currencySymbol,
}: {
  productId: string;
  currencySymbol: string;
}) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    // Load history from the data/history/ directory via a simple fetch
    // Since these are static files, we can try to import them
    // For now, we'll show the current snapshot info
    fetch(`/api/v1/products?id=${productId}&apiKey=wbi_demo_2026_public`)
      .then((r) => r.json())
      .then((data) => {
        if (data.product) {
          // Create a single-point history from current data
          setHistory([
            {
              date: data.product.lastVerified || new Date().toISOString().split("T")[0],
              premiumMin: data.product.premiumRange?.illustrativeMin,
              premiumMax: data.product.premiumRange?.illustrativeMax,
              csr: data.product.claimSettlement?.ratio,
            },
          ]);
        }
      })
      .catch(() => {});
  }, [productId]);

  if (history.length === 0) return null;

  const latest = history[history.length - 1];
  const previous = history.length > 1 ? history[history.length - 2] : null;

  // Calculate trend
  let premiumTrend: "up" | "down" | "stable" = "stable";
  let premiumChange = 0;

  if (previous && latest.premiumMin && previous.premiumMin) {
    const avg = (latest.premiumMin + (latest.premiumMax || latest.premiumMin)) / 2;
    const prevAvg = (previous.premiumMin + (previous.premiumMax || previous.premiumMin)) / 2;
    premiumChange = Math.round(((avg - prevAvg) / prevAvg) * 100);
    premiumTrend = premiumChange > 0 ? "up" : premiumChange < 0 ? "down" : "stable";
  }

  const fmt = (n: number | null) => n ? `${currencySymbol}${n.toLocaleString()}` : "—";

  return (
    <div className="p-4 bg-surface rounded-xl border border-border">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-text-tertiary" />
        <h3 className="text-[13px] font-bold text-text-primary">Premium Trend</h3>
      </div>

      <div className="flex items-center gap-4">
        <div>
          <p className="text-[10px] text-text-tertiary uppercase tracking-wider">Current Range</p>
          <p className="text-[15px] font-bold text-text-primary">
            {fmt(latest.premiumMin)} – {fmt(latest.premiumMax)}
            <span className="text-[10px] font-normal text-text-tertiary">/yr</span>
          </p>
        </div>

        {premiumChange !== 0 && (
          <div className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
            premiumTrend === "up" ? "bg-error/10 text-error" :
            premiumTrend === "down" ? "bg-success/10 text-success" :
            "bg-surface-sunken text-text-tertiary"
          }`}>
            {premiumTrend === "up" ? <TrendingUp className="w-3 h-3" /> :
             premiumTrend === "down" ? <TrendingDown className="w-3 h-3" /> :
             <Minus className="w-3 h-3" />}
            {Math.abs(premiumChange)}%
          </div>
        )}

        {latest.csr && (
          <div className="ml-auto text-right">
            <p className="text-[10px] text-text-tertiary uppercase tracking-wider">CSR</p>
            <p className="text-[15px] font-bold text-text-primary">{latest.csr}%</p>
          </div>
        )}
      </div>

      {/* Mini sparkline placeholder */}
      {history.length > 1 && (
        <div className="mt-3 h-12 bg-surface-sunken rounded-lg flex items-end gap-px px-2">
          {history.slice(-12).map((entry, i) => {
            const avg = ((entry.premiumMin || 0) + (entry.premiumMax || 0)) / 2;
            const maxAvg = Math.max(...history.map((h) => ((h.premiumMin || 0) + (h.premiumMax || 0)) / 2));
            const height = maxAvg > 0 ? (avg / maxAvg) * 100 : 50;
            return (
              <div
                key={i}
                className="flex-1 bg-primary/20 rounded-t-sm min-h-[2px]"
                style={{ height: `${Math.max(10, height)}%` }}
                title={`${entry.date}: ${fmt(entry.premiumMin)}`}
              />
            );
          })}
        </div>
      )}

      <p className="text-[9px] text-text-tertiary mt-2">
        Last verified: {latest.date} · Data updates daily
      </p>
    </div>
  );
}
