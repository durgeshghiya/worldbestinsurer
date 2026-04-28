import Link from "next/link";
import type { InsuranceProduct } from "@/lib/types";
import { formatCompact } from "@/lib/utils";

/**
 * Peer-aware editorial analysis for a single product.
 *
 * Generates ~400-600 words of unique, specific, comparison-driven prose
 * per product by computing this plan's position against its category
 * peers in the same country (premium percentile, sum-insured percentile,
 * claim ratio vs median, waiting periods vs median, etc).
 *
 * Without `peers`, falls back to a thinner standalone summary. The
 * peer-aware path is the one that actually adds AdSense-grade signal:
 * "this premium is in the bottom quartile for the category" reads as
 * insight, not as a Madlib.
 */
export default function ProductEditorial({
  product,
  countryName,
  peers,
}: {
  product: InsuranceProduct;
  countryName: string;
  peers?: InsuranceProduct[];
}) {
  const p = product;
  const cc = p.countryCode;
  const others = (peers ?? []).filter((q) => q.id !== p.id);

  // ── Peer stats (only meaningful with at least 3 peers) ──
  const peerStats = others.length >= 3 ? computePeerStats(others) : null;

  const pos = peerStats
    ? {
        premium: percentile(p.premiumRange.illustrativeMin, peerStats.premiumValues),
        sum: percentile(p.sumInsured.max ?? 0, peerStats.sumValues),
        csr: p.claimSettlement?.ratio
          ? percentile(p.claimSettlement.ratio, peerStats.csrValues)
          : null,
      }
    : null;

  const paras: string[] = [];

  // ── 1. Lede — what this plan is, in plain English ──
  paras.push(buildLede(p, countryName));

  // ── 2. Premium positioning vs peers ──
  if (peerStats && pos) {
    paras.push(buildPremiumParagraph(p, peerStats, pos));
  }

  // ── 3. Coverage breadth ──
  paras.push(buildCoverageParagraph(p, peerStats, cc));

  // ── 4. Category-specific deep dive (different angle per category) ──
  const catParagraph = buildCategorySpecificParagraph(p, peerStats);
  if (catParagraph) paras.push(catParagraph);

  // ── 5. Honest limitations from exclusions ──
  if (p.keyExclusions && p.keyExclusions.length > 0) {
    paras.push(buildExclusionsParagraph(p));
  }

  // ── 6. "Best for / Skip if" — practical filter ──
  const fitParagraph = buildFitParagraph(p, pos);
  if (fitParagraph) paras.push(fitParagraph);

  if (paras.length < 3) return null;

  return (
    <section className="mt-10 mb-6" aria-label="Editorial analysis">
      <h2 className="text-[18px] font-bold text-text-primary mb-4 tracking-[-0.01em]">
        Our analysis of {p.productName}
      </h2>
      <div className="text-[14px] text-text-secondary leading-[1.85] space-y-4">
        {paras.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <p className="mt-5 text-[11px] text-text-tertiary">
        Analysis by{" "}
        <Link href="/author/editorial-team" className="text-primary hover:underline">
          WBI Editorial Team
        </Link>{" "}
        · Last verified: {p.lastVerified} · Confidence: {p.confidenceScore} ·{" "}
        Methodology:{" "}
        <Link href="/methodology" className="text-primary hover:underline">
          how we research plans
        </Link>
      </p>
    </section>
  );
}

/* ──────────────────────── Helpers ──────────────────────── */

interface PeerStats {
  count: number;
  premiumValues: number[];
  premiumMedian: number;
  sumValues: number[];
  sumMedian: number;
  csrValues: number[];
  csrMedian: number;
  pedWaitMedian: number | null;
  hospitalsMedian: number | null;
}

function computePeerStats(peers: InsuranceProduct[]): PeerStats {
  const premiumValues = peers
    .map((q) => q.premiumRange.illustrativeMin)
    .filter((n): n is number => Number.isFinite(n))
    .sort((a, b) => a - b);
  const sumValues = peers
    .map((q) => q.sumInsured.max ?? 0)
    .filter((n) => n > 0)
    .sort((a, b) => a - b);
  const csrValues = peers
    .map((q) => q.claimSettlement?.ratio)
    .filter((n): n is number => typeof n === "number" && n > 0)
    .sort((a, b) => a - b);
  const pedWaits = peers
    .map((q) => parseMonths(q.waitingPeriod?.preExisting))
    .filter((n): n is number => n !== null)
    .sort((a, b) => a - b);
  const hospCounts = peers
    .map((q) => q.networkHospitals?.count)
    .filter((n): n is number => typeof n === "number" && n > 0)
    .sort((a, b) => a - b);

  return {
    count: peers.length,
    premiumValues,
    premiumMedian: median(premiumValues),
    sumValues,
    sumMedian: median(sumValues),
    csrValues,
    csrMedian: median(csrValues),
    pedWaitMedian: pedWaits.length ? median(pedWaits) : null,
    hospitalsMedian: hospCounts.length ? median(hospCounts) : null,
  };
}

function median(sorted: number[]): number {
  if (sorted.length === 0) return 0;
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

/** What percentile is `value` in the sorted ascending `set`. 0–100. */
function percentile(value: number, sorted: number[]): number {
  if (sorted.length === 0) return 50;
  const below = sorted.filter((v) => v < value).length;
  return Math.round((below / sorted.length) * 100);
}

function parseMonths(s: string | undefined | null): number | null {
  if (!s) return null;
  const m = String(s).match(/(\d+)\s*(month|year)/i);
  if (!m) return null;
  const n = parseInt(m[1], 10);
  return /year/i.test(m[2]) ? n * 12 : n;
}

function bucket(pct: number): "bottom" | "lower" | "mid" | "upper" | "top" {
  if (pct <= 20) return "bottom";
  if (pct <= 40) return "lower";
  if (pct <= 60) return "mid";
  if (pct <= 80) return "upper";
  return "top";
}

function bucketLabel(b: ReturnType<typeof bucket>): string {
  return {
    bottom: "the bottom quintile",
    lower: "the lower-mid range",
    mid: "the middle of the pack",
    upper: "the upper-mid range",
    top: "the top quintile",
  }[b];
}

/* ──────────────────────── Paragraph builders ──────────────────────── */

function buildLede(p: InsuranceProduct, country: string): string {
  const cat = p.category === "term-life" ? "term life" : p.category;
  const sumMin = p.sumInsured.min
    ? formatCompact(p.sumInsured.min, p.countryCode)
    : null;
  const sumMax = p.sumInsured.max
    ? formatCompact(p.sumInsured.max, p.countryCode)
    : null;
  const sumRange =
    sumMin && sumMax ? `${sumMin} to ${sumMax}` : sumMin ?? sumMax ?? "varies";
  const ageRange =
    p.eligibility.maxAge != null
      ? `${p.eligibility.minAge} to ${p.eligibility.maxAge}`
      : `${p.eligibility.minAge} and above`;
  return (
    `${p.productName} is a ${cat} insurance plan from ${p.insurerName}, available to residents of ${country}. ` +
    `Sum insured ranges from ${sumRange}, eligible ages ${ageRange}, and the policy is ${p.renewability.toLowerCase()}. ` +
    `Below is our take on how it compares to other ${cat} plans in our database — what it does well, where it lags, and the kind of policyholder it actually fits.`
  );
}

function buildPremiumParagraph(
  p: InsuranceProduct,
  peers: PeerStats,
  pos: { premium: number; sum: number; csr: number | null }
): string {
  const pBucket = bucket(pos.premium);
  const sBucket = bucket(pos.sum);
  const cc = p.countryCode;
  const premiumStr = formatCompact(p.premiumRange.illustrativeMin, cc);
  const medianStr = formatCompact(peers.premiumMedian, cc);
  const sumStr = p.sumInsured.max
    ? formatCompact(p.sumInsured.max, cc)
    : "N/A";
  const sumMedianStr = peers.sumMedian
    ? formatCompact(peers.sumMedian, cc)
    : "N/A";

  const valueRead = (() => {
    // Cheap + high cover = value pick. Expensive + low cover = bad. Etc.
    if (pBucket === "bottom" && (sBucket === "upper" || sBucket === "top"))
      return "an unusually strong value pick: priced in the cheaper end while still offering above-median coverage";
    if (pBucket === "top" && (sBucket === "lower" || sBucket === "bottom"))
      return "a premium-heavy plan whose coverage ceiling does not justify the cost relative to peers";
    if (pBucket === "bottom")
      return "priced cheaply for the category, which usually signals either a budget plan or one with tighter sub-limits";
    if (pBucket === "top")
      return "priced toward the top of the category, typically reflecting either a wider feature set or stronger insurer reputation";
    return "priced near the category median";
  })();

  return (
    `Annual premium starts at ${premiumStr}, against a category median of ${medianStr} across the ${peers.count} ` +
    `comparable ${p.category === "term-life" ? "term life" : p.category} plans we track in this country. ` +
    `That places ${p.productName} in ${bucketLabel(pBucket)} on price, and ${bucketLabel(sBucket)} on coverage ceiling ` +
    `(maximum sum insured ${sumStr} versus a peer median of ${sumMedianStr}). On the value spectrum it reads as ${valueRead}.`
  );
}

function buildCoverageParagraph(
  p: InsuranceProduct,
  peers: PeerStats | null,
  cc: string
): string {
  const inclCount = p.keyInclusions?.length ?? 0;
  const featureCount = p.specialFeatures?.length ?? 0;
  const riderCount = p.riders?.length ?? 0;
  const tone =
    inclCount + featureCount >= 12
      ? "broad"
      : inclCount + featureCount >= 7
        ? "average"
        : "narrow";

  const headline = (() => {
    if (tone === "broad")
      return `Coverage breadth is one of the strongest reasons to consider this plan`;
    if (tone === "average")
      return `Coverage breadth is in line with what most ${p.category === "term-life" ? "term" : p.category} plans offer`;
    return `Coverage is on the leaner side compared to category peers`;
  })();

  const featureSample = (p.specialFeatures ?? []).slice(0, 3);
  const riderSample = (p.riders ?? []).slice(0, 3);

  let body =
    `${headline}: ${inclCount} core inclusions, ${featureCount} highlighted features, and ${riderCount} optional riders. `;

  if (featureSample.length > 0) {
    body +=
      `Notable features called out by ${p.insurerName} include ${joinWithComma(featureSample)}. `;
  }
  if (riderSample.length > 0) {
    body +=
      `On the rider side, ${p.productName} can be extended with ${joinWithComma(riderSample)} — each adding to the base premium but also widening what the policy will pay out for. `;
  }
  if (peers?.hospitalsMedian && p.networkHospitals?.count) {
    const ratio = p.networkHospitals.count / peers.hospitalsMedian;
    if (ratio >= 1.3)
      body += `The cashless network of ${p.networkHospitals.count.toLocaleString()} hospitals is roughly ${Math.round(ratio * 100 - 100)}% larger than the category median, which matters most for residents of smaller cities where coverage thins out fastest.`;
    else if (ratio <= 0.7)
      body += `The cashless network of ${p.networkHospitals.count.toLocaleString()} hospitals is well below the category median; if you live outside a metro, verify your preferred hospital is on the list before buying.`;
    else
      body += `The cashless network of ${p.networkHospitals.count.toLocaleString()} hospitals is broadly in line with peer plans.`;
  }
  // Avoid unused param warning
  void cc;
  return body.trim();
}

function buildCategorySpecificParagraph(
  p: InsuranceProduct,
  peers: PeerStats | null
): string | null {
  if (p.category === "health") {
    if (!p.waitingPeriod) return null;
    const pedMonths = parseMonths(p.waitingPeriod.preExisting);
    let body = `On waiting periods, ${p.productName} applies an initial waiting period of ${p.waitingPeriod.initial}, ` +
      `a pre-existing disease wait of ${p.waitingPeriod.preExisting}, and a specific-disease wait of ${p.waitingPeriod.specific}. `;
    if (pedMonths != null && peers?.pedWaitMedian) {
      const diff = pedMonths - peers.pedWaitMedian;
      if (diff <= -6)
        body += `The pre-existing wait is ${Math.abs(diff)} months shorter than the category median — a real advantage if you have any chronic condition you would like covered sooner rather than later.`;
      else if (diff >= 6)
        body += `The pre-existing wait runs ${diff} months longer than the category median, which is the single most consequential clause in any health policy: a longer wait means more years of paying premiums before chronic conditions are actually covered.`;
      else
        body += `The pre-existing wait is in line with the category median of around ${peers.pedWaitMedian} months.`;
    }
    return body.trim();
  }
  if (p.category === "term-life") {
    const ageRange =
      p.eligibility.maxAge != null
        ? `${p.eligibility.minAge}–${p.eligibility.maxAge}`
        : `${p.eligibility.minAge}+`;
    return (
      `Term life pricing is most sensitive to age, smoker status, and policy term, so the headline premium is illustrative only. ` +
      `${p.productName} accepts applicants aged ${ageRange}, which sets the practical ceiling on policy term — for someone applying at ${p.eligibility.minAge}, ` +
      `the longest possible cover runs through age ${p.eligibility.maxAge ?? "as configured"}. ` +
      `Whether the rate you get on quote will land near the illustrative minimum depends entirely on your underwriting bucket; non-smokers in the youngest cohort typically pay close to the floor, smokers and older applicants pay materially more. ` +
      `${p.insurerName}'s published claim settlement record is the metric that actually matters for term — the policy is worthless if claims are denied at maturity, and the difference between a 95% and 99% settlement ratio is the difference between routine claims paid and routine claims fought.`
    );
  }
  if (p.category === "motor") {
    return (
      `Motor cover splits into two functionally different things: third-party liability (legally required, capped statutorily) and own-damage cover (optional but the part most people actually claim against). ` +
      `Comprehensive plans like ${p.productName} bundle both, with the own-damage component priced from the vehicle's Insured Declared Value, year, and city. ` +
      `Premiums quoted publicly are illustrative for a representative profile; expect variation of 30–50% above or below depending on your specific car, location, and claim history. ` +
      `When evaluating motor plans, the two clauses that matter most are the depreciation schedule (how much the insurer deducts from a parts replacement claim) and the cashless garage network — verify that workshops near where you actually drive accept ${p.insurerName}'s authorisation.`
    );
  }
  if (p.category === "travel") {
    return (
      `Travel insurance is the simplest insurance product to compare on paper and the easiest to misjudge in practice. ` +
      `${p.productName} covers a typical mix of medical emergencies abroad, trip cancellation, lost baggage, and personal liability — what differentiates good travel cover from bad is the medical evacuation limit and the named exclusions for adventure activities. ` +
      `Single-trip cover is generally cheaper per day than multi-trip annual cover, but if you take more than three international trips a year the multi-trip almost always wins. ` +
      `Read the medical exclusions before you buy: pre-existing conditions are commonly excluded by default, and adventure activities (skiing, scuba, trekking above 4,000m) often need a paid rider.`
    );
  }
  return null;
}

function buildExclusionsParagraph(p: InsuranceProduct): string {
  const sample = p.keyExclusions.slice(0, 4);
  const more =
    p.keyExclusions.length > 4
      ? ` and ${p.keyExclusions.length - 4} other categories listed in the policy wording`
      : "";
  return (
    `Where ${p.productName} explicitly will not pay: ${joinWithComma(sample)}${more}. ` +
    `These are not unusual exclusions for a ${p.category === "term-life" ? "term life" : p.category} plan, but they are the boundary of the contract — anything outside that list is in scope, anything inside is not. ` +
    `Read the full exclusions list before signing; every plan we have ever audited has at least one exclusion the buyer did not realise was there.`
  );
}

function buildFitParagraph(
  p: InsuranceProduct,
  pos: { premium: number; sum: number; csr: number | null } | null
): string | null {
  if (!pos) return null;
  const cheap = pos.premium <= 35;
  const expensive = pos.premium >= 65;
  const lowSum = pos.sum <= 35;
  const highSum = pos.sum >= 65;
  const goodCSR = pos.csr != null && pos.csr >= 60;

  const bestFor: string[] = [];
  const skipIf: string[] = [];

  if (cheap) bestFor.push("buyers prioritising lowest annual outlay");
  if (highSum) bestFor.push("buyers who need a higher coverage ceiling than category average");
  if (goodCSR) bestFor.push("buyers who weight insurer track record above small premium differences");
  if (p.category === "health" && (p.networkHospitals?.count ?? 0) > 7000)
    bestFor.push("residents of metro and tier-2 cities where the cashless network density matters");

  if (expensive && lowSum) skipIf.push("you can find a cheaper plan with similar inclusions");
  if (lowSum) skipIf.push("you need coverage above the plan's maximum sum insured");
  if (p.category === "health" && p.waitingPeriod) {
    const ped = parseMonths(p.waitingPeriod.preExisting);
    if (ped != null && ped >= 36)
      skipIf.push("you have a pre-existing condition you need covered within 2 years");
  }

  if (bestFor.length === 0 && skipIf.length === 0) return null;

  let body = "";
  if (bestFor.length > 0) {
    body +=
      `Best fit for: ${bestFor.join("; ")}. `;
  }
  if (skipIf.length > 0) {
    body +=
      `Skip if: ${skipIf.join("; ")}. `;
  }
  body += `As with any insurance decision, get a quote from ${p.insurerName} directly to confirm the rate that actually applies to your profile — listed prices are illustrative.`;
  return body;
}

function joinWithComma(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
