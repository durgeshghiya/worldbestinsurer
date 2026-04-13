"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Share2, MessageCircle, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import type { InsuranceProduct } from "@/lib/types";

function ShortlistContent() {
  const searchParams = useSearchParams();
  const productIds = (searchParams.get("products") || "").split(",").filter(Boolean);
  const [products, setProducts] = useState<InsuranceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Fetch products from a simple client-side approach:
    // We'll read from window.__NEXT_DATA__ or just display the IDs
    // For a static site, we load the data via an API call
    setLoading(false);
  }, []);

  if (productIds.length === 0) {
    return (
      <div className="mx-auto max-w-[700px] px-5 py-16 text-center">
        <h1 className="text-[24px] font-bold text-text-primary mb-3">
          Your Shortlist is Empty
        </h1>
        <p className="text-[14px] text-text-tertiary mb-6">
          Add plans to your shortlist from any product or compare page.
        </p>
        <Link
          href="/compare/health"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white text-[14px] font-medium rounded-lg hover:bg-gray-800 transition-colors"
        >
          Browse Plans →
        </Link>
      </div>
    );
  }

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleWhatsApp() {
    const text = `Compare these insurance plans on World Best Insurer:\n${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }

  return (
    <div className="mx-auto max-w-[900px] px-5 lg:px-8 py-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] text-text-tertiary hover:text-primary mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Home
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-[24px] sm:text-[32px] font-bold text-text-primary tracking-tight">
            Your Comparison
          </h1>
          <p className="text-[13px] text-text-tertiary mt-1">
            {productIds.length} plans selected
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg border border-border hover:bg-surface-sunken transition-colors"
            title="Copy link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-success" />
            ) : (
              <Copy className="w-4 h-4 text-text-tertiary" />
            )}
          </button>
          <button
            onClick={handleWhatsApp}
            className="p-2 rounded-lg border border-border hover:bg-surface-sunken transition-colors"
            title="Share via WhatsApp"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
          </button>
        </div>
      </div>

      {/* Product links */}
      <div className="space-y-3">
        {productIds.map((id) => (
          <Link
            key={id}
            href={`/product/${id}`}
            className="block p-5 bg-surface rounded-xl border border-border hover:border-primary/20 hover:shadow-sm transition-all group"
          >
            <p className="text-[14px] font-semibold text-text-primary group-hover:text-primary transition-colors">
              {id.replace(/-/g, " ")}
            </p>
            <p className="text-[11px] text-text-tertiary mt-1">
              Click to view full details →
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-[11px] text-text-tertiary">
          Share this comparison with friends and family to help them decide.
        </p>
      </div>
    </div>
  );
}

export default function ShortlistPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-text-tertiary">Loading...</div>}>
      <ShortlistContent />
    </Suspense>
  );
}
