/**
 * Affiliate Link Resolution
 *
 * Maps (countryCode, insurerSlug) → affiliate URL template.
 * If no affiliate partnership exists, returns the insurer's direct sourceUrl.
 *
 * Affiliate URLs include tracking parameters for attribution.
 * All affiliate links are disclosed to users per FTC/FCA/IRDAI guidelines.
 */

interface AffiliatePartner {
  insurerSlug: string;
  countryCode: string;
  affiliateUrl: string; // Template with {productId} placeholder
  partnerId: string;
  active: boolean;
}

// Affiliate partner registry — add partnerships here as they're signed
const affiliatePartners: AffiliatePartner[] = [
  // These are placeholder templates — replace with actual partner URLs
  // {
  //   insurerSlug: "hdfc-ergo",
  //   countryCode: "in",
  //   affiliateUrl: "https://partner.hdfcergo.com/?ref=wbi&pid={productId}",
  //   partnerId: "wbi-hdfc",
  //   active: false,
  // },
];

/**
 * Resolve the outbound URL for a product.
 * Returns affiliate URL if partnership exists, otherwise the product's sourceUrl.
 */
export function resolveOutboundUrl(
  productId: string,
  insurerSlug: string,
  countryCode: string,
  sourceUrl: string
): { url: string; isAffiliate: boolean; partnerId?: string } {
  const partner = affiliatePartners.find(
    (p) =>
      p.insurerSlug === insurerSlug &&
      p.countryCode === countryCode &&
      p.active
  );

  if (partner) {
    const url = partner.affiliateUrl.replace("{productId}", productId);
    return { url, isAffiliate: true, partnerId: partner.partnerId };
  }

  return { url: sourceUrl, isAffiliate: false };
}

/**
 * Check if a product has an active affiliate partnership.
 */
export function hasAffiliatePartnership(
  insurerSlug: string,
  countryCode: string
): boolean {
  return affiliatePartners.some(
    (p) =>
      p.insurerSlug === insurerSlug &&
      p.countryCode === countryCode &&
      p.active
  );
}
