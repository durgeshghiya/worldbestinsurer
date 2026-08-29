"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

const CLIENT_ID = "ca-pub-4984848270074853";

export type AdFormat = "auto" | "rectangle" | "horizontal" | "vertical" | "fluid";

export interface AdSlotProps {
  /** Pass `process.env.NEXT_PUBLIC_AD_SLOT_*`. Renders nothing when unset. */
  slot: string | undefined;
  format?: AdFormat;
  className?: string;
  /**
   * Reserved height in px while the ad loads. Prevents the ad from pushing
   * content down when it fills (Cumulative Layout Shift). Defaults are the
   * typical rendered heights per format; override when a placement sits in a
   * tighter box.
   */
  minHeight?: number;
  /** Hide the "Advertisement" label (only for placements already inside a labelled region). */
  hideLabel?: boolean;
}

const DEFAULT_MIN_HEIGHT: Record<AdFormat, number> = {
  auto: 280,
  rectangle: 280,
  horizontal: 100,
  vertical: 600,
  fluid: 200,
};

/**
 * Google AdSense display unit.
 *
 * Activation is env-gated: the component renders nothing at all until
 * `slot` has a value, so placements can be committed and deployed before
 * the AdSense account is approved and ad units exist. To turn a placement
 * on, create the unit in AdSense → Ads → By ad unit, then set the matching
 * `NEXT_PUBLIC_AD_SLOT_*` variable in Vercel and redeploy.
 * See docs/adsense-activation.md.
 *
 * Consent Mode v2 (layout.tsx) governs whether the ad may set cookies or
 * personalise — this component deliberately does not duplicate that logic.
 *
 * Each mounted instance pushes exactly once. React 18 StrictMode double-
 * invokes effects in dev, and pushing twice for one <ins> triggers
 * "All 'ins' elements already have ads in them" — the ref guard prevents it.
 */
export function AdSlot({
  slot,
  format = "auto",
  className,
  minHeight,
  hideLabel = false,
}: AdSlotProps) {
  const pushed = useRef(false);

  useEffect(() => {
    if (!slot || pushed.current) return;
    pushed.current = true;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* Script not loaded yet, consent denied, or an ad blocker. All benign —
         the reserved box simply stays empty. */
    }
  }, [slot]);

  if (!slot) return null;

  const reserved = minHeight ?? DEFAULT_MIN_HEIGHT[format];

  return (
    <aside
      className={className}
      aria-label="Advertisement"
      style={{ minHeight: reserved, contain: "layout" }}
    >
      {!hideLabel && (
        <div
          style={{
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            opacity: 0.45,
            marginBottom: 6,
            textAlign: "center",
          }}
        >
          Advertisement
        </div>
      )}
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight: reserved }}
        data-ad-client={CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
