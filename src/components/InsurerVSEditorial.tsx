import Link from "next/link";
import type { Insurer, InsuranceProduct } from "@/lib/types";

/**
 * Editorial wrapper for /[country]/vs/insurer/[slug] pages.
 *
 * Generates ~300-500 words of comparison-specific prose for an
 * insurer-versus-insurer comparison: who each one is, how they
 * differ on claim record / breadth / network / age, and how a
 * buyer should weight those differences. Fully data-driven —
 * every number cited comes from the underlying Insurer records.
 */
export default function InsurerVSEditorial({
  a,
  b,
  productsA,
  productsB,
  countryName,
}: {
  a: Insurer;
  b: Insurer;
  productsA: InsuranceProduct[];
  productsB: InsuranceProduct[];
  countryName: string;
}) {
  const paras: string[] = [];

  paras.push(buildLede(a, b, countryName));
  paras.push(buildClaimRecordParagraph(a, b));
  paras.push(buildBreadthParagraph(a, b, productsA, productsB));

  const networkPara = buildNetworkParagraph(a, b);
  if (networkPara) paras.push(networkPara);

  paras.push(buildHowToDecideParagraph(a, b, countryName));

  if (paras.length < 3) return null;

  return (
    <section className="mt-10 max-w-[760px] mx-auto" aria-label="Editorial analysis">
      <h2 className="text-[18px] font-bold text-text-primary mb-4 tracking-[-0.01em]">
        How {a.shortName} and {b.shortName} actually differ
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
        <Link href={`/insurer/${a.slug}`} className="text-primary hover:underline">
          {a.shortName} profile
        </Link>{" "}
        ·{" "}
        <Link href={`/insurer/${b.slug}`} className="text-primary hover:underline">
          {b.shortName} profile
        </Link>
      </p>
    </section>
  );
}

/* ──────────────────────── Paragraph builders ──────────────────────── */

function buildLede(a: Insurer, b: Insurer, country: string): string {
  const now = new Date().getFullYear();
  const aYears = a.established ? now - a.established : null;
  const bYears = b.established ? now - b.established : null;

  let body =
    `${a.shortName} and ${b.shortName} are two of the insurers we track in ${country}. ` +
    `${a.shortName} is headquartered in ${a.headquarters || "an undisclosed location"}` +
    (aYears != null ? ` and has been operating for ${aYears} years (established ${a.established})` : "") +
    `; ${b.shortName} is headquartered in ${b.headquarters || "an undisclosed location"}` +
    (bYears != null ? ` and has been operating for ${bYears} years (established ${b.established})` : "") +
    `. `;

  if (aYears && bYears) {
    const diff = Math.abs(aYears - bYears);
    if (diff >= 20) {
      const older = aYears > bYears ? a : b;
      const younger = older === a ? b : a;
      body +=
        `That is roughly ${diff} years of difference in market experience — ${older.shortName} predates ${younger.shortName} by a generation, which usually translates into more granular underwriting data and a larger book of legacy claims to reference. ` +
        `Older does not automatically mean better, but it does mean more institutional memory of what claims look like in this market.`;
    } else if (diff >= 5) {
      body += `Both have been in the market long enough to have meaningful claim histories, with ${diff} years of difference in operating tenure — not a structural gap.`;
    } else {
      body += `Both have been in the market for comparable lengths of time, which means like-for-like comparisons of their operating metrics are meaningful.`;
    }
  }
  return body;
}

function buildClaimRecordParagraph(a: Insurer, b: Insurer): string {
  const ar = a.claimSettlementRatio?.value;
  const br = b.claimSettlementRatio?.value;
  const ay = a.claimSettlementRatio?.year;
  const by = b.claimSettlementRatio?.year;

  if (ar && br) {
    const diff = Math.abs(ar - br);
    const higher = ar > br ? a : ar < br ? b : null;
    if (!higher || diff < 1) {
      return `Claim settlement ratios are effectively identical: ${ar}% for ${a.shortName}${ay ? ` (${ay})` : ""} and ${br}% for ${b.shortName}${by ? ` (${by})` : ""}. Reliability of claims paid is not a meaningful differentiator between these two — both perform within roughly the same band.`;
    }
    if (diff < 3) {
      return `Claim settlement runs ${ar}% for ${a.shortName}${ay ? ` (${ay})` : ""} versus ${br}% for ${b.shortName}${by ? ` (${by})` : ""}. The ${diff}-point gap is small and may be within year-to-year noise rather than a structural difference; reasonable buyers can weight this either way.`;
    }
    return (
      `On the most consequential metric — does the insurer actually pay claims when filed — ${higher.shortName} reports a claim settlement ratio of ${higher === a ? ar : br}%` +
      `${(higher === a ? ay : by) ? ` (${higher === a ? ay : by})` : ""}, versus ${(higher === a ? br : ar)!}% for ${(higher === a ? b : a).shortName}` +
      `${(higher === a ? by : ay) ? ` (${higher === a ? by : ay})` : ""}. ` +
      `A ${diff}-point gap is large enough to matter, particularly on term life and other products where the policy's only real economic value is the payout at claim time.`
    );
  }
  if (ar) {
    return `${a.shortName} reports a claim settlement ratio of ${ar}%${ay ? ` (${ay})` : ""}. ${b.shortName}'s ratio is not currently disclosed in our data — itself a signal worth weighing. Insurers that publish settlement ratios and let those numbers be audited against complaints data are easier to plan around.`;
  }
  if (br) {
    return `${b.shortName} reports a claim settlement ratio of ${br}%${by ? ` (${by})` : ""}. ${a.shortName}'s ratio is not currently disclosed in our data — itself a signal worth weighing.`;
  }
  return `Neither insurer publishes a claim settlement ratio that we have been able to verify against regulator filings; both should be evaluated primarily on product features and disclosed terms, with a stronger emphasis on contractual exclusions and dispute resolution clauses since the actual claim record is not auditable here.`;
}

function buildBreadthParagraph(
  a: Insurer,
  b: Insurer,
  pa: InsuranceProduct[],
  pb: InsuranceProduct[]
): string {
  const aCats = a.categories.length;
  const bCats = b.categories.length;
  const aShared = a.categories.filter((c) => b.categories.includes(c));
  const sharedList =
    aShared.length === 0
      ? "no overlapping categories"
      : aShared.length === 1
        ? `the ${aShared[0]} category`
        : aShared.length === 2
          ? `the ${aShared[0]} and ${aShared[1]} categories`
          : `${aShared.slice(0, -1).join(", ")}, and ${aShared[aShared.length - 1]} categories`;

  let body =
    `${a.shortName} operates across ${aCats} ${aCats === 1 ? "line" : "lines"} (${a.categories.join(", ")}), with ${pa.length} ${pa.length === 1 ? "product" : "products"} in our database. ` +
    `${b.shortName} operates across ${bCats} ${bCats === 1 ? "line" : "lines"} (${b.categories.join(", ")}), with ${pb.length} ${pb.length === 1 ? "product" : "products"}. `;

  if (aShared.length === 0) {
    body +=
      `The two insurers do not actually overlap on any category in our data, which makes head-to-head comparison difficult — you are choosing between different products for different needs, not between two competing plans in the same slot.`;
  } else {
    body +=
      `Where the comparison actually applies is ${sharedList}, where both insurers offer competing products that a buyer would realistically choose between.`;
  }

  return body;
}

function buildNetworkParagraph(a: Insurer, b: Insurer): string | null {
  const an = a.networkHospitals;
  const bn = b.networkHospitals;
  if (!an && !bn) return null;
  if (an && bn) {
    if (an === bn) {
      return `Both insurers list cashless hospital networks of similar size (${an.toLocaleString()} vs ${bn.toLocaleString()}); network density is not a meaningful differentiator between them for health products.`;
    }
    const bigger = an > bn ? a : b;
    const biggerCount = an > bn ? an : bn;
    const smallerCount = an > bn ? bn : an;
    const ratio = biggerCount / smallerCount;
    return (
      `On cashless hospital network — the most practically important figure for health insurance — ${bigger.shortName} lists ${biggerCount.toLocaleString()} hospitals versus ${smallerCount.toLocaleString()} for the other. ` +
      `That is roughly ${Math.round(ratio * 100 - 100)}% more network coverage, which matters most outside metro cities where network density thins out fastest. ` +
      `If you live in a tier-2 or smaller town, the larger network usually outweighs a small premium difference; in metros the gap is less practically significant.`
    );
  }
  if (an) {
    return `${a.shortName} lists a cashless network of ${an.toLocaleString()} hospitals; ${b.shortName}'s network size is not currently disclosed in our data.`;
  }
  if (bn) {
    return `${b.shortName} lists a cashless network of ${bn.toLocaleString()} hospitals; ${a.shortName}'s network size is not currently disclosed in our data.`;
  }
  return null;
}

function buildHowToDecideParagraph(a: Insurer, b: Insurer, country: string): string {
  return (
    `How to actually choose between ${a.shortName} and ${b.shortName} in ${country}: the insurer choice is one input, but the specific plan you pick within that insurer matters more. ` +
    `Two flagships from different insurers are usually closer to each other than a flagship and a budget plan from the same insurer. ` +
    `Use the insurer-level comparison above to set your priors (which company you trust on claim record, network, and tenure), then click into the specific plans listed on each insurer's profile to compare features, exclusions, and waiting periods at the product level. ` +
    `When all else is comparable, weight the insurer with the stronger published claim record — the policy is only worth what the insurer actually pays.`
  );
}
