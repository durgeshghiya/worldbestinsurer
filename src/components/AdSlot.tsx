"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const CLIENT_ID = "ca-pub-4984848270074853";

export interface AdSlotProps {
  slot: string | undefined;
  format?: "auto" | "rectangle" | "horizontal" | "vertical" | "fluid";
  className?: string;
}

/**
 * Renders a Google AdSense ad unit when a real slot ID is provided.
 *
 * Pass `slot={process.env.NEXT_PUBLIC_AD_SLOT_XYZ}`. Create the ad unit in
 * AdSense → Ads → By ad unit, then set `NEXT_PUBLIC_AD_SLOT_XYZ` in Vercel
 * env to activate the placement. Until the env var is set the component
 * renders nothing, so layout is stable whether ads are wired up or not.
 *
 * Consent Mode v2 (configured in layout.tsx) governs whether the ad actually
 * sets cookies or runs personalization — this component does not duplicate
 * that logic.
 */
export function AdSlot({ slot, format = "auto", className }: AdSlotProps) {
  useEffect(() => {
    if (!slot) return;
    if (typeof window === "undefined") return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* Ad failed to initialize — script not loaded yet, consent denied, or
         adblocker. All three are benign. */
    }
  }, [slot]);

  if (!slot) return null;

  return (
    <div className={className} aria-label="Advertisement">
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
