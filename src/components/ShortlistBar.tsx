"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Copy, Check, MessageCircle } from "lucide-react";

const STORAGE_KEY = "wbi_shortlist";

interface ShortlistItem {
  id: string;
  name: string;
  insurer: string;
  countryCode: string;
}

export function useShortlist() {
  const [items, setItems] = useState<ShortlistItem[]>([]);

  // Hydrating from localStorage on mount is the canonical pattern for client-
  // only persisted state. The extra render is one-time and intentional.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setItems(JSON.parse(stored));
    } catch { /* ignore */ }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  function save(newItems: ShortlistItem[]) {
    setItems(newItems);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
    } catch { /* ignore */ }
  }

  function add(item: ShortlistItem) {
    if (items.find((i) => i.id === item.id)) return;
    if (items.length >= 4) return; // max 4
    save([...items, item]);
  }

  function remove(id: string) {
    save(items.filter((i) => i.id !== id));
  }

  function clear() {
    save([]);
  }

  function has(id: string) {
    return items.some((i) => i.id === id);
  }

  return { items, add, remove, clear, has };
}

export function AddToShortlistButton({
  product,
}: {
  product: { id: string; productName: string; insurerName: string; countryCode: string };
}) {
  const { add, remove, has } = useShortlist();
  const isAdded = has(product.id);

  return (
    <button
      onClick={() => {
        if (isAdded) {
          remove(product.id);
        } else {
          add({
            id: product.id,
            name: product.productName,
            insurer: product.insurerName,
            countryCode: product.countryCode,
          });
        }
      }}
      className={`px-3 py-1.5 text-[11px] font-medium rounded-lg border transition-all ${
        isAdded
          ? "bg-primary/10 border-primary/20 text-primary"
          : "bg-surface border-border text-text-tertiary hover:border-primary/20 hover:text-primary"
      }`}
    >
      {isAdded ? "✓ In shortlist" : "+ Shortlist"}
    </button>
  );
}

export default function ShortlistBar() {
  const { items, remove, clear } = useShortlist();
  const [copied, setCopied] = useState(false);

  if (items.length === 0) return null;

  const shareUrl = typeof window !== "undefined"
    ? `${window.location.origin}/compare/shortlist?products=${items.map((i) => i.id).join(",")}`
    : "";

  function handleCopy() {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleWhatsApp() {
    const text = `Compare these insurance plans on World Best Insurer:\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border shadow-xl">
      <div className="mx-auto max-w-[1320px] px-5 py-3">
        <div className="flex items-center gap-3">
          {/* Plan chips */}
          <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 rounded-lg shrink-0"
              >
                <span className="text-[11px] font-medium text-text-primary truncate max-w-[120px]">
                  {item.name}
                </span>
                <button
                  onClick={() => remove(item.id)}
                  className="text-text-tertiary hover:text-error"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg border border-border hover:bg-surface-sunken transition-colors"
              title="Copy link"
            >
              {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4 text-text-tertiary" />}
            </button>

            <button
              onClick={handleWhatsApp}
              className="p-2 rounded-lg border border-border hover:bg-surface-sunken transition-colors"
              title="Share via WhatsApp"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366]" />
            </button>

            <Link
              href={`/compare/shortlist?products=${items.map((i) => i.id).join(",")}`}
              className="px-4 py-2 text-[12px] font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Compare {items.length}
            </Link>

            <button
              onClick={clear}
              className="text-[11px] text-text-tertiary hover:text-error transition-colors"
            >
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
