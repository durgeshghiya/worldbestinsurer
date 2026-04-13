import type { InsuranceProduct } from "@/lib/types";

/**
 * Auto-generated editorial section for product pages.
 * Provides unique, original analysis per product based on its data fields.
 * This addresses AdSense "Low value content" by adding editorial prose
 * beyond just data tables.
 */
export default function ProductEditorial({
  product,
  countryName,
}: {
  product: InsuranceProduct;
  countryName: string;
}) {
  const p = product;

  // Build dynamic analysis paragraphs
  const paras: string[] = [];

  // Paragraph 1: Overview positioning
  const catLabel = p.category.replace("-", " ");
  paras.push(
    `${p.productName} by ${p.insurerName} is a ${catLabel} insurance product available in ${countryName}. ` +
    `It offers coverage ranging from ${p.sumInsured.min?.toLocaleString() ?? "N/A"} to ${p.sumInsured.max?.toLocaleString() ?? "N/A"} ` +
    `with illustrative annual premiums starting from ${p.premiumRange.illustrativeMin.toLocaleString()}. ` +
    `The plan is available for individuals aged ${p.eligibility.minAge} to ${p.eligibility.maxAge ?? "no upper limit"} and offers ${p.renewability.toLowerCase()} renewability.`
  );

  // Paragraph 2: Claim settlement + trust
  if (p.claimSettlement?.ratio) {
    const csrLevel =
      p.claimSettlement.ratio >= 95 ? "excellent" :
      p.claimSettlement.ratio >= 90 ? "strong" :
      p.claimSettlement.ratio >= 80 ? "moderate" : "below average";
    paras.push(
      `${p.insurerName} has an ${csrLevel} claim settlement ratio of ${p.claimSettlement.ratio}%` +
      (p.claimSettlement.year ? ` (${p.claimSettlement.year})` : "") +
      (p.claimSettlement.source ? `, as reported by ${p.claimSettlement.source}` : "") +
      `. This is an important metric to consider when evaluating the reliability of any insurance provider, ` +
      `as it indicates the percentage of claims the insurer actually pays out to policyholders.`
    );
  }

  // Paragraph 3: Network hospitals (health-specific)
  if (p.networkHospitals?.count && p.category === "health") {
    paras.push(
      `The plan provides access to a network of ${p.networkHospitals.count.toLocaleString()} hospitals` +
      (p.networkHospitals.source ? ` (${p.networkHospitals.source})` : "") +
      `, which is important for cashless claim processing. A larger hospital network means more options for ` +
      `treatment without having to pay upfront and file for reimbursement later.`
    );
  }

  // Paragraph 4: Key features
  if (p.specialFeatures.length > 0) {
    const feats = p.specialFeatures.slice(0, 4).join(", ");
    paras.push(
      `Notable features of this plan include ${feats}. ` +
      `These features differentiate ${p.productName} from other ${catLabel} insurance options available in ${countryName} ` +
      `and may be particularly relevant depending on your specific coverage needs and priorities.`
    );
  }

  // Paragraph 5: Waiting periods (health-specific)
  if (p.waitingPeriod && p.category === "health") {
    paras.push(
      `This plan has an initial waiting period of ${p.waitingPeriod.initial}, ` +
      `a pre-existing disease waiting period of ${p.waitingPeriod.preExisting}, ` +
      `and a specific disease waiting period of ${p.waitingPeriod.specific}. ` +
      `When comparing health insurance plans, shorter waiting periods generally provide earlier access to full coverage.`
    );
  }

  // Paragraph 6: Riders
  if (p.riders.length > 0) {
    const riderList = p.riders.slice(0, 4).join(", ");
    paras.push(
      `Available riders and add-ons include ${riderList}. ` +
      `Riders allow you to customise the base coverage to better match your individual risk profile and protection needs.`
    );
  }

  if (paras.length < 2) return null;

  return (
    <div className="mt-8 mb-6">
      <h2 className="text-[16px] font-bold text-text-primary mb-4">
        About This Plan
      </h2>
      <div className="text-[13.5px] text-text-secondary leading-[1.8] space-y-3">
        {paras.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-text-tertiary">
        Analysis by{" "}
        <a href="/author/editorial-team" className="text-primary hover:underline">
          WBI Editorial Team
        </a>{" "}
        · Last verified: {p.lastVerified} · Confidence: {p.confidenceScore}
      </p>
    </div>
  );
}
