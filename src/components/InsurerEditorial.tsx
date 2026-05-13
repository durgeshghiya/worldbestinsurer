import Link from "next/link";
import type { Insurer, InsuranceProduct } from "@/lib/types";

/**
 * Peer-aware editorial analysis for a single insurer.
 *
 * Mirrors the ProductEditorial pattern at the insurer level: compute
 * percentile bands for claim settlement ratio, established year, and
 * portfolio breadth against insurer peers in the same country, then
 * write ~350-500 words of substantive prose per insurer.
 *
 * The text is fully derived from data — every claim is checkable
 * against the underlying Insurer record. No marketing copy.
 */
export default function InsurerEditorial({
  insurer,
  countryName,
  peers,
  products,
}: {
  insurer: Insurer;
  countryName: string;
  peers: Insurer[];
  products: InsuranceProduct[];
}) {
  const others = peers.filter((p) => p.slug !== insurer.slug);
  const stats = others.length >= 3 ? computeStats(others) : null;

  const paras: string[] = [];

  paras.push(buildLede(insurer, countryName, products));

  const trackParagraph = buildTrackRecordParagraph(insurer, stats);
  if (trackParagraph) paras.push(trackParagraph);

  const breadthParagraph = buildBreadthParagraph(insurer, stats, products);
  paras.push(breadthParagraph);

  if (insurer.networkHospitals && stats?.networkMedian) {
    paras.push(buildNetworkParagraph(insurer, stats));
  }

  paras.push(buildHowToReadParagraph(insurer, countryName));

  if (paras.length < 3) return null;

  return (
    <section className="mt-10" aria-label="Editorial analysis">
      <h2 className="text-[18px] font-bold text-text-primary mb-4 tracking-[-0.01em]">
        Our take on {insurer.shortName}
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
        · Sourced against {insurer.shortName} public filings ·{" "}
        <Link href="/methodology" className="text-primary hover:underline">
          how we research insurers
        </Link>
      </p>
    </section>
  );
}

/* ──────────────────────── Helpers ──────────────────────── */

interface PeerStats {
  count: number;
  csrMedian: number | null;
  ageMedian: number | null;
  categoryMedian: number;
  networkMedian: number | null;
}

function computeStats(peers: Insurer[]): PeerStats {
  const csrs = peers
    .map((p) => p.claimSettlementRatio?.value)
    .filter((n): n is number => typeof n === "number" && n > 0)
    .sort((a, b) => a - b);
  const ages = peers
    .map((p) => p.established)
    .filter((n): n is number => typeof n === "number" && n > 0)
    .sort((a, b) => a - b);
  const catCounts = peers
    .map((p) => p.categories?.length ?? 0)
    .filter((n) => n > 0)
    .sort((a, b) => a - b);
  const nets = peers
    .map((p) => p.networkHospitals)
    .filter((n): n is number => typeof n === "number" && n > 0)
    .sort((a, b) => a - b);
  return {
    count: peers.length,
    csrMedian: csrs.length ? median(csrs) : null,
    ageMedian: ages.length ? median(ages) : null,
    categoryMedian: catCounts.length ? median(catCounts) : 0,
    networkMedian: nets.length ? median(nets) : null,
  };
}

function median(sorted: number[]): number {
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[mid]
    : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

/* ──────────────────────── Paragraph builders ──────────────────────── */

function buildLede(
  ins: Insurer,
  country: string,
  products: InsuranceProduct[]
): string {
  const yearsActive = new Date().getFullYear() - ins.established;
  const cats =
    ins.categories.length === 1
      ? ins.categories[0]
      : ins.categories.length === 2
        ? `${ins.categories[0]} and ${ins.categories[1]}`
        : `${ins.categories.slice(0, -1).join(", ")}, and ${ins.categories[ins.categories.length - 1]}`;
  const productLine =
    products.length > 0
      ? `We currently track ${products.length} ${products.length === 1 ? "product" : "products"} from ${ins.shortName} on World Best Insurer.`
      : "";
  return (
    `${ins.shortName} is ${ins.type === "private" ? "a private" : "a"} insurer headquartered in ${ins.headquarters || "an undisclosed location"}` +
    (ins.established ? `, established in ${ins.established} — ${yearsActive} years in the market` : "") +
    `. The company operates in ${country} across ${cats}. ` +
    productLine
  );
}

function buildTrackRecordParagraph(
  ins: Insurer,
  stats: PeerStats | null
): string | null {
  if (!ins.claimSettlementRatio?.value) {
    return (
      `Public claim settlement data for ${ins.shortName} is not currently disclosed in regulator filings we can verify; this is itself a signal worth weighing. ` +
      `Insurers that publish settlement ratios annually and let those numbers be audited against complaints data tend to be the easier ones to plan around.`
    );
  }

  const csr = ins.claimSettlementRatio.value;
  const year = ins.claimSettlementRatio.year;
  const verified = ins.claimSettlementRatio.verified;
  const med = stats?.csrMedian;
  let band: string;
  if (csr >= 98) band = "the top tier of the category";
  else if (csr >= 95) band = "strong, near the top quartile";
  else if (csr >= 90) band = "above the typical category median";
  else if (csr >= 80) band = "in the middle of the pack";
  else band = "below the category median — a meaningful caution";

  let body =
    `${ins.shortName}'s most recent disclosed claim settlement ratio is ${csr}%${year ? ` (${year})` : ""}, which we read as ${band}. `;

  if (med) {
    const diff = csr - med;
    if (diff >= 3)
      body += `That puts ${ins.shortName} roughly ${diff} percentage points above the median insurer in ${ins.countryCode.toUpperCase()} — a real edge for buyers prioritising claim reliability. `;
    else if (diff <= -3)
      body += `That sits roughly ${Math.abs(diff)} percentage points below the median insurer in the country — worth weighing against premium savings, since one denied claim can outweigh many years of lower premiums. `;
    else
      body += `The ratio is within roughly ${Math.abs(diff)} percentage points of the country median, so the metric is unlikely to be the deciding factor between this and a comparable insurer. `;
  }

  body += verified
    ? `This figure has been verified by our editorial team against the publishing regulator.`
    : `This figure is reported by ${ins.shortName} but has not yet been verified by our editorial team against the regulator filing; expect to see a verification stamp on the next update cycle.`;

  return body;
}

function buildBreadthParagraph(
  ins: Insurer,
  stats: PeerStats | null,
  products: InsuranceProduct[]
): string {
  const catCount = ins.categories.length;
  const productCount = products.length;
  let breadthRead: string;
  if (catCount >= 4) breadthRead = "a full-line insurer covering every personal insurance category we track";
  else if (catCount === 3) breadthRead = "a three-line insurer";
  else if (catCount === 2) breadthRead = "a two-line specialist";
  else breadthRead = "a single-category specialist";

  let body =
    `${ins.shortName} is ${breadthRead} (${ins.categories.join(", ")}), with ${productCount} ${productCount === 1 ? "product" : "products"} listed in our database for this country. `;

  if (stats?.categoryMedian) {
    if (catCount > stats.categoryMedian)
      body += `That category breadth is wider than the typical insurer in the country (median of ${stats.categoryMedian} lines per insurer), which usually reflects a bundling strategy — buy more than one line, get a multi-policy discount and one customer-service relationship to manage. `;
    else if (catCount < stats.categoryMedian)
      body += `That is narrower than the typical insurer in the country (median of ${stats.categoryMedian} lines), which tends to indicate specialisation — the trade-off is fewer bundling opportunities but often deeper product engineering inside the chosen lines. `;
    else
      body += `That matches the typical category breadth for an insurer operating in this country. `;
  }

  if (products.length >= 4) {
    body += `The four-plus product lines suggest the company segments by sum insured tier and feature set rather than running a single flagship — useful if your eligibility falls outside the most common buyer profile.`;
  } else if (products.length >= 2) {
    body += `The two-to-three product lines are typical of insurers running one or two flagship plans plus a specialist option for higher sums insured.`;
  } else if (products.length === 1) {
    body += `Operating with a single flagship product (rather than a tiered portfolio) is unusual and often reflects either a focused strategy or a portfolio that we haven't yet fully indexed.`;
  }

  return body;
}

function buildNetworkParagraph(ins: Insurer, stats: PeerStats): string {
  if (!ins.networkHospitals || !stats.networkMedian) return "";
  const ratio = ins.networkHospitals / stats.networkMedian;
  let read: string;
  if (ratio >= 1.5)
    read = `materially larger than the category median (${stats.networkMedian.toLocaleString()} hospitals)`;
  else if (ratio >= 1.15)
    read = `noticeably wider than the median peer (${stats.networkMedian.toLocaleString()} hospitals)`;
  else if (ratio >= 0.85)
    read = `broadly in line with the median peer (${stats.networkMedian.toLocaleString()} hospitals)`;
  else
    read = `notably smaller than the median peer (${stats.networkMedian.toLocaleString()} hospitals) — verify your preferred hospitals are on the panel before buying`;

  return (
    `For health products, ${ins.shortName} lists a cashless hospital network of ${ins.networkHospitals.toLocaleString()} facilities. ` +
    `That is ${read}. Network coverage matters most outside metro cities — the headline number tells you the ceiling, ` +
    `not the actual density wherever you happen to need care, so cross-check with the insurer's online network search before signing.`
  );
}

function buildHowToReadParagraph(ins: Insurer, country: string): string {
  return (
    `When evaluating ${ins.shortName} against other insurers in ${country}, the metrics that matter most depend on the policy you are buying. ` +
    `For term life, claim settlement ratio and financial strength carry the most weight — the policy is worth nothing if the claim is denied at maturity. ` +
    `For health, the network breadth, pre-existing waiting period, and the specific exclusions list matter more than the headline premium difference. ` +
    `For motor, the depreciation schedule and the cashless garage network determine the real economic value of a claim. ` +
    `For travel, the medical evacuation limit and the list of excluded adventure activities are the two clauses to read before buying. ` +
    `${ins.shortName}'s individual products are listed below — click into any plan to see our peer-aware analysis of where it sits within ${ins.categories[0] ?? "the category"}.`
  );
}
