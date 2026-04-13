"use client";

import { ExternalLink, Info } from "lucide-react";
import { resolveOutboundUrl } from "@/lib/affiliate";

interface AffiliateLinkProps {
  productId: string;
  insurerSlug: string;
  countryCode: string;
  sourceUrl: string;
  className?: string;
  children?: React.ReactNode;
}

export default function AffiliateLink({
  productId,
  insurerSlug,
  countryCode,
  sourceUrl,
  className,
  children,
}: AffiliateLinkProps) {
  const { url, isAffiliate, partnerId } = resolveOutboundUrl(
    productId,
    insurerSlug,
    countryCode,
    sourceUrl
  );

  async function handleClick() {
    // Fire and forget click tracking
    try {
      fetch("/api/clicks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          insurerSlug,
          countryCode,
          isAffiliate,
          partnerId,
        }),
      }).catch(() => {});
    } catch {
      // Non-critical — don't block navigation
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className={
          className ||
          "inline-flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold border-2 border-primary text-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-200"
        }
      >
        {children || (
          <>
            Visit Insurer Website <ExternalLink className="w-3.5 h-3.5" />
          </>
        )}
      </a>
      {isAffiliate && (
        <span className="inline-flex items-center gap-1 text-[9px] text-text-tertiary">
          <Info className="w-2.5 h-2.5" />
          We may earn a commission if you buy via this link
        </span>
      )}
    </span>
  );
}
