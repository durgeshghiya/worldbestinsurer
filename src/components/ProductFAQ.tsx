import type { InsuranceProduct } from "@/lib/types";
import { FAQSchema } from "@/components/StructuredData";
import { formatCompact } from "@/lib/utils";
import { getCountryByCode } from "@/lib/countries";

export default function ProductFAQ({ product }: { product: InsuranceProduct }) {
  const c = getCountryByCode(product.countryCode);
  const currency = c?.currency.code ?? "INR";
  const catLabel = product.category.replace("-", " ");

  const faqs = [];

  // Question 1: Premium
  faqs.push({
    q: `What is the starting premium for ${product.productName}?`,
    a: `The illustrative starting premium for ${product.productName} by ${product.insurerName} is ${formatCompact(product.premiumRange.illustrativeMin, product.countryCode)} per year. Note that actual premiums depend on factors like age, coverage amount, and medical history.`,
  });

  // Question 2: Sum Insured
  faqs.push({
    q: `What is the maximum coverage (sum insured) available under ${product.productName}?`,
    a: `The maximum sum insured available for this ${catLabel} plan is ${formatCompact(product.sumInsured.max ?? 0, product.countryCode)}. The minimum coverage starts at ${formatCompact(product.sumInsured.min ?? 0, product.countryCode)}.`,
  });

  // Question 3: Eligibility
  faqs.push({
    q: `Who is eligible to buy ${product.productName}?`,
    a: `The entry age for this policy is ${product.eligibility.minAge} years${product.eligibility.maxAge ? ` up to ${product.eligibility.maxAge} years` : ' and above'}. It is available to residents of ${c?.name}.`,
  });

  // Question 4: Claim Settlement
  if (product.claimSettlement?.ratio) {
    faqs.push({
      q: `What is the claim settlement ratio for ${product.insurerName}?`,
      a: `${product.insurerName} has a reported claim settlement ratio of ${product.claimSettlement.ratio}%. This indicates the percentage of claims successfully settled by the insurer.`,
    });
  }

  // Question 5: Hospitals (if health)
  if (product.category === "health" && product.networkHospitals?.count) {
    faqs.push({
      q: `How many network hospitals does ${product.insurerName} have?`,
      a: `${product.insurerName} has a network of ${product.networkHospitals.count.toLocaleString()} hospitals where you can avail cashless treatment under the ${product.productName} plan.`,
    });
  }

  return (
    <div className="mt-12">
      <FAQSchema questions={faqs} />
      <h2 className="text-[20px] font-bold text-text-primary mb-6">
        Frequently Asked Questions about {product.productName}
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group bg-surface rounded-xl border border-border p-4 open:bg-surface-sunken transition-colors"
          >
            <summary className="text-[15px] font-semibold text-text-primary cursor-pointer list-none flex justify-between items-center">
              {faq.q}
              <span className="text-primary group-open:rotate-45 transition-transform duration-200">
                +
              </span>
            </summary>
            <p className="mt-3 text-[14px] text-text-secondary leading-relaxed">
              {faq.a}
            </p>
          </details>
        ))}
      </div>
    </div>
  );
}
