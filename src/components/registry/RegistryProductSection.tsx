/**
 * The registry block on an India product page: UIN and other sourced product
 * facts, official documents, related products, FAQs and the provenance
 * notice. Used both inside existing product pages and as the body of
 * registry-only product pages.
 */

import Link from "next/link";
import {
  PRODUCT_TYPE_LABEL,
  productView,
  relatedProducts,
  siteCategoryFor,
  type LoadedRegistry,
  type RegistryProduct,
  type SiteFacts,
} from "@/lib/registry";
import { FAQSchema } from "@/components/StructuredData";
import {
  DataNotice,
  DocumentList,
  FactTable,
  FaqList,
  LinkGrid,
  SectionHeading,
} from "./RegistryBlocks";

export default function RegistryProductSection({
  product,
  reg,
  site,
}: {
  product: RegistryProduct;
  reg: LoadedRegistry;
  site: SiteFacts;
}) {
  const v = productView(product, reg);
  const related = relatedProducts(product.slug, reg, site);
  const hub = siteCategoryFor(product.productType);

  return (
    <section aria-labelledby="product-official-data" className="mt-12 space-y-10">
      <FAQSchema questions={v.faqs} />

      <div>
        <SectionHeading id="product-official-data" eyebrow="Official data" title={`${v.name} — product identification`} />
        <FactTable
          caption={`Official product details for ${v.name}`}
          sources={reg.sourceById}
          rows={[
            { label: "Product name", fact: product.name },
            { label: "UIN", fact: product.uin },
            { label: "Policy term", fact: product.policyTerm },
            { label: "Eligibility", fact: product.eligibility },
            { label: "Premium payment", fact: product.premiumFrequency },
            { label: "Sum insured / assured", fact: product.sumInsured },
          ]}
        />
        <p className="mt-3 text-[12.5px] text-text-tertiary">
          <span className="font-semibold text-text-secondary">WorldBestInsurer classification:</span>{" "}
          {PRODUCT_TYPE_LABEL[product.productType]}
          {product.status === "withdrawn" && " · marked withdrawn by the source"}
          . The UIN is the identifier IRDAI-regulated insurers print on product literature.
        </p>
      </div>

      <div>
        <SectionHeading eyebrow="Official documents" title={`${v.name} documents`} />
        <DocumentList docs={v.docs} sources={reg.sourceById} />
      </div>

      <div>
        <SectionHeading eyebrow="Explore" title="Related products" />
        <div className="mb-4 flex flex-wrap gap-2">
          {v.insurer && (
            <Link
              href={`/in/insurer/${v.insurer.slug}/`}
              className="inline-flex rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:border-primary/30 hover:text-primary"
            >
              All about {v.insurer.name.value}
            </Link>
          )}
          {hub && (
            <Link
              href={`/in/compare/${hub}/`}
              className="inline-flex rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:border-primary/30 hover:text-primary"
            >
              Compare similar plans in India
            </Link>
          )}
          <Link
            href="/in/products/"
            className="inline-flex rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:border-primary/30 hover:text-primary"
          >
            Product &amp; UIN directory
          </Link>
        </div>
        <LinkGrid links={related} />
      </div>

      <div>
        <SectionHeading title={`Questions about ${v.name}`} />
        <FaqList items={v.faqs} />
      </div>

      <DataNotice updated={v.updated} sourceNames={v.sources} />
    </section>
  );
}
