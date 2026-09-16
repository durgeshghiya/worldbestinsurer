/**
 * The registry block on an India insurer page: official identity facts,
 * listed products, documents, statistics, related insurers, FAQs and the
 * freshness/provenance notice. Renders nothing for insurers with no registry
 * record, so existing pages are unchanged until data arrives.
 */

import Link from "next/link";
import {
  INSURER_TYPE_LABEL,
  SEGMENT_LABEL,
  categoryHubsForInsurer,
  insurerView,
  registryProductLinks,
  relatedInsurers,
  statisticsPeriodLinks,
  type LoadedRegistry,
  type RegistryInsurer,
  type SiteFacts,
} from "@/lib/registry";
import { FAQSchema, JsonLd } from "@/components/StructuredData";
import {
  DataNotice,
  DocumentList,
  FactTable,
  FaqList,
  LinkGrid,
  SectionHeading,
  StatisticsTable,
} from "./RegistryBlocks";

const CATEGORY_LABEL: Record<string, string> = {
  health: "Health insurance",
  "term-life": "Term life insurance",
  motor: "Motor insurance",
  travel: "Travel insurance",
};

export default function RegistryInsurerSection({
  insurer,
  reg,
  site,
  siteProductNames,
}: {
  insurer: RegistryInsurer;
  reg: LoadedRegistry;
  site: SiteFacts;
  siteProductNames: string[];
}) {
  const v = insurerView(insurer, reg, siteProductNames);
  const productLinks = registryProductLinks(insurer.slug, reg, site);
  const related = relatedInsurers(insurer.slug, reg, site);
  const hubs = categoryHubsForInsurer(insurer.slug, reg);
  const statLinks = statisticsPeriodLinks(insurer.slug, reg);
  const url = `https://worldbestinsurer.com/in/insurer/${insurer.slug}/`;

  const orgSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}#organization`,
    name: insurer.name.value,
    url: insurer.website.value,
    ...(insurer.legalName && { legalName: insurer.legalName.value }),
    ...(insurer.headquarters && {
      address: { "@type": "PostalAddress", addressLocality: insurer.headquarters.value, addressCountry: "IN" },
    }),
    ...(insurer.irdaiRegistrationNumber && {
      identifier: {
        "@type": "PropertyValue",
        propertyID: "IRDAI registration number",
        value: insurer.irdaiRegistrationNumber.value,
      },
    }),
    subjectOf: { "@type": "WebPage", url },
  };

  return (
    <section aria-labelledby="official-data" className="mt-12 space-y-10">
      <JsonLd data={orgSchema} />
      <FAQSchema questions={v.faqs} />

      <div>
        <SectionHeading id="official-data" eyebrow="Official data" title={`${v.name} — registration details`} />
        <FactTable
          caption={`Official registration details for ${v.name}`}
          sources={reg.sourceById}
          rows={[
            { label: "Name", fact: insurer.name },
            { label: "Legal name", fact: insurer.legalName },
            {
              label: "Insurer type",
              fact: insurer.insurerType
                ? { ...insurer.insurerType, value: INSURER_TYPE_LABEL[insurer.insurerType.value] }
                : undefined,
            },
            { label: "IRDAI registration no.", fact: insurer.irdaiRegistrationNumber },
            { label: "Corporate Identity Number", fact: insurer.cin },
            { label: "Office", fact: insurer.headquarters },
            {
              label: "Official website",
              fact: insurer.website,
              display: (
                <a href={insurer.website.value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  {new URL(insurer.website.value).hostname}
                </a>
              ),
            },
          ]}
        />
        {insurer.formerNames?.length ? (
          <p className="mt-3 text-[13px] text-text-secondary">
            Previously known as {insurer.formerNames.map((f) => f.name).join(", ")}.
          </p>
        ) : null}
        <p className="mt-3 text-[12.5px] text-text-tertiary">
          <span className="font-semibold text-text-secondary">WorldBestInsurer classification:</span>{" "}
          {insurer.segments.map((s) => SEGMENT_LABEL[s]).join(", ") || "—"}. This grouping is ours, not the insurer&apos;s.
        </p>
      </div>

      {productLinks.length > 0 && (
        <div>
          <SectionHeading eyebrow="Official data" title={`${v.name} products with a UIN`} />
          <LinkGrid links={productLinks} />
        </div>
      )}

      <div>
        <SectionHeading eyebrow="Official documents" title="Documents published by the insurer" />
        <DocumentList docs={v.docs} sources={reg.sourceById} />
      </div>

      <div>
        <SectionHeading eyebrow="Official data" title={`${v.name} statistics`} />
        <StatisticsTable stats={v.stats} sources={reg.sourceById} caption={`Published statistics for ${v.name}`} />
        {statLinks.length > 0 && <div className="mt-4"><LinkGrid links={statLinks} /></div>}
      </div>

      {(hubs.length > 0 || related.length > 0) && (
        <div>
          <SectionHeading eyebrow="Explore" title="Related comparisons and insurers" />
          {hubs.length > 0 && (
            <ul className="mb-4 flex flex-wrap gap-2">
              {hubs.map((h) => (
                <li key={h}>
                  <Link
                    href={`/in/compare/${h}/`}
                    className="inline-flex rounded-lg border border-border bg-surface px-3 py-1.5 text-[13px] font-medium text-text-secondary hover:border-primary/30 hover:text-primary"
                  >
                    Compare {CATEGORY_LABEL[h]} in India
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <LinkGrid links={related} />
        </div>
      )}

      <div>
        <SectionHeading title={`Questions about ${v.name}`} />
        <FaqList items={v.faqs} />
      </div>

      <DataNotice updated={v.updated} period={v.latestPeriod} sourceNames={v.sources} />
    </section>
  );
}
