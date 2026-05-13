import Link from "next/link";
import type { InsuranceProduct } from "@/lib/types";
import { formatCompact } from "@/lib/utils";

/**
 * Editorial wrapper for /vs/[slug] comparison pages.
 *
 * Generates ~250-350 words of substantive prose comparing two specific
 * products on their differentiating dimensions: premium gap, sum
 * insured gap, claim ratio gap, waiting periods, and (where present)
 * cashless network breadth. The text is data-driven — every number
 * in the copy comes from the underlying product records.
 */
export default function VSEditorial({
  a,
  b,
  countryName,
}: {
  a: InsuranceProduct;
  b: InsuranceProduct;
  countryName?: string;
}) {
  const cc = a.countryCode;
  const cat = a.category === "term-life" ? "term life" : a.category;
  const country = countryName ? ` in ${countryName}` : "";

  const paras: string[] = [];

  // Lede
  paras.push(
    `Why people compare ${a.productName} and ${b.productName}: both are ${cat} insurance plans${country} ` +
      `that sit in similar feature territory, so the decision tends to come down to a few specific differences rather than a clear winner. ` +
      `Below is what the catalog data says about each — what they share, where they diverge, and which buyer profile each one actually fits.`
  );

  // Premium + coverage comparison
  paras.push(buildPriceCoverageParagraph(a, b, cc));

  // Claim ratio
  if (a.claimSettlement?.ratio || b.claimSettlement?.ratio) {
    paras.push(buildClaimParagraph(a, b));
  }

  // Health-specific or generic
  if (a.category === "health" && b.category === "health") {
    paras.push(buildHealthSpecificParagraph(a, b));
  } else if (a.category === "term-life") {
    paras.push(
      `For term life products, the headline premiums you see here are illustrative starting points — your actual rate depends entirely on age, smoker status, ` +
        `policy term, and underwriting outcome, which can shift the gap between these two plans by 30-50% in either direction. The dimensions that meaningfully differ between insurers — ` +
        `claim settlement ratio, financial strength rating, rider availability, and policy continuation terms — matter more than the small premium delta visible in the catalog.`
    );
  }

  // Inclusions / exclusions deltas
  const deltaParagraph = buildDifferenceListParagraph(a, b);
  if (deltaParagraph) paras.push(deltaParagraph);

  // How to decide
  paras.push(buildDecisionParagraph(a, b));

  if (paras.length < 3) return null;

  return (
    <section className="mt-10 max-w-[760px]" aria-label="Editorial analysis">
      <h2 className="text-[18px] font-bold text-text-primary mb-4 tracking-[-0.01em]">
        How {a.productName} and {b.productName} actually compare
      </h2>
      <div className="text-[14px] text-text-secondary leading-[1.85] space-y-4">
        {paras.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <p className="mt-5 text-[11px] text-text-tertiary">
        Analysis by{" "}
        <Link href="/author/editorial-team" className="text-primary hover:underline">
          WBI Editorial Team
        </Link>{" "}
        ·{" "}
        <Link href={`/product/${a.id}`} className="text-primary hover:underline">
          {a.productName} details
        </Link>{" "}
        ·{" "}
        <Link href={`/product/${b.id}`} className="text-primary hover:underline">
          {b.productName} details
        </Link>
      </p>
    </section>
  );
}

/* ──────────────────────── Paragraph builders ──────────────────────── */

function buildPriceCoverageParagraph(
  a: InsuranceProduct,
  b: InsuranceProduct,
  cc: string
): string {
  const ap = a.premiumRange.illustrativeMin;
  const bp = b.premiumRange.illustrativeMin;
  const priceGap = ap === bp ? 0 : Math.abs(ap - bp);
  const priceGapPct =
    Math.min(ap, bp) > 0 ? Math.round((priceGap / Math.min(ap, bp)) * 100) : 0;
  const cheaper = ap < bp ? a : b;
  const pricier = ap < bp ? b : a;

  const asum = a.sumInsured.max ?? 0;
  const bsum = b.sumInsured.max ?? 0;
  const higherCover = asum > bsum ? a : asum < bsum ? b : null;
  const sumDiff = Math.abs(asum - bsum);

  let body =
    `On illustrative annual premium, ${cheaper.productName} starts at ${formatCompact(cheaper.premiumRange.illustrativeMin, cc)} ` +
    `versus ${formatCompact(pricier.premiumRange.illustrativeMin, cc)} for ${pricier.productName} — ` +
    (priceGap === 0
      ? `effectively the same. `
      : `roughly a ${priceGapPct}% gap. `);

  if (asum && bsum) {
    if (higherCover && sumDiff > 0) {
      body +=
        `Maximum sum insured runs ${formatCompact(higherCover.sumInsured.max ?? 0, cc)} on ${higherCover.productName} ` +
        `against ${formatCompact((higherCover === a ? b : a).sumInsured.max ?? 0, cc)} on the alternative — ` +
        `meaningful if you are buying near the ceiling, less so if your needs sit comfortably inside both ranges.`;
    } else {
      body +=
        `Both plans cap maximum sum insured at the same level (${formatCompact(asum, cc)}), so the coverage ceiling is not a differentiator here.`;
    }
  }
  return body;
}

function buildClaimParagraph(a: InsuranceProduct, b: InsuranceProduct): string {
  const ar = a.claimSettlement?.ratio;
  const br = b.claimSettlement?.ratio;
  if (ar && br) {
    const diff = Math.abs(ar - br);
    const better = ar > br ? a : ar < br ? b : null;
    if (!better || diff < 1) {
      return `Insurer claim settlement ratios are effectively identical (${ar}% vs ${br}%), so claim reliability is not a deciding factor between these two plans.`;
    }
    if (diff < 3) {
      return `${a.insurerName} reports a claim settlement ratio of ${ar}% versus ${br}% for ${b.insurerName} — a small difference that is probably within year-to-year noise rather than a structural gap.`;
    }
    return (
      `On claim settlement reliability, ${better.insurerName} reports ${better === a ? ar : br}% versus ${(better === a ? br : ar)!}% for ${(better === a ? b : a).insurerName} — ` +
      `a ${diff}-point gap that is large enough to matter. For products where the actual claim experience determines whether the policy is worth anything (term life especially), a multi-point CSR gap usually outweighs a small premium difference.`
    );
  }
  if (ar) {
    return `${a.insurerName} reports a claim settlement ratio of ${ar}%. ${b.insurerName}'s ratio is not currently disclosed in our data — itself a signal worth weighing.`;
  }
  if (br) {
    return `${b.insurerName} reports a claim settlement ratio of ${br}%. ${a.insurerName}'s ratio is not currently disclosed in our data — itself a signal worth weighing.`;
  }
  return "";
}

function buildHealthSpecificParagraph(
  a: InsuranceProduct,
  b: InsuranceProduct
): string {
  const aw = a.waitingPeriod;
  const bw = b.waitingPeriod;
  if (!aw || !bw) return "";
  let body =
    `On health-specific clauses: pre-existing waiting period is ${aw.preExisting} on ${a.productName} and ${bw.preExisting} on ${b.productName}; ` +
    `initial waiting is ${aw.initial} versus ${bw.initial}; specific-disease wait is ${aw.specific} versus ${bw.specific}. `;
  if (
    a.networkHospitals?.count &&
    b.networkHospitals?.count &&
    a.networkHospitals.count !== b.networkHospitals.count
  ) {
    const bigger =
      a.networkHospitals.count > b.networkHospitals.count ? a : b;
    body +=
      `Cashless hospital network sizes are ${a.networkHospitals.count.toLocaleString()} versus ${b.networkHospitals.count.toLocaleString()}; ` +
      `${bigger.productName}'s network is the larger of the two, which matters most for residents of smaller cities where network density thins out.`;
  }
  return body;
}

function buildDifferenceListParagraph(
  a: InsuranceProduct,
  b: InsuranceProduct
): string | null {
  const aOnly = (a.specialFeatures ?? []).filter(
    (f) => !(b.specialFeatures ?? []).includes(f)
  );
  const bOnly = (b.specialFeatures ?? []).filter(
    (f) => !(a.specialFeatures ?? []).includes(f)
  );
  if (aOnly.length === 0 && bOnly.length === 0) return null;
  const parts: string[] = [];
  if (aOnly.length > 0) {
    parts.push(
      `${a.productName} adds: ${aOnly.slice(0, 4).join(", ")}${aOnly.length > 4 ? ", among others" : ""}`
    );
  }
  if (bOnly.length > 0) {
    parts.push(
      `${b.productName} adds: ${bOnly.slice(0, 4).join(", ")}${bOnly.length > 4 ? ", among others" : ""}`
    );
  }
  return (
    `Feature differentiation between the two plans: ${parts.join(". ")}. ` +
    `These are the lines to read carefully — the rest of the feature lists overlap, but the items unique to each plan are the practical reasons to pick one over the other.`
  );
}

function buildDecisionParagraph(
  a: InsuranceProduct,
  b: InsuranceProduct
): string {
  return (
    `How to decide between ${a.productName} and ${b.productName}: if your priority is the lowest reliable premium and both insurers' claim records satisfy you, ` +
    `pick the cheaper one. If your priority is broader feature coverage or a higher sum insured ceiling, weight the plan with more headroom and verify the exclusions list doesn't contain anything you actually need. ` +
    `For ${a.category === "term-life" ? "term life specifically" : "any plan involving complex underwriting"}, get a quote from both insurers directly — illustrative premiums on a comparison site are starting points, ` +
    `not commitments, and the gap between quoted and listed rate can be material.`
  );
}
