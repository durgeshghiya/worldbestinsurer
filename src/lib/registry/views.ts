/**
 * View models for registry pages — computed from data only.
 *
 * FAQ answers are templated from sourced fields and say what the source
 * states ("LIC's official website gives its IRDAI registration number as
 * 512"), never a characterisation of the company. Where a fact is missing
 * the answer says so.
 */

import type { LoadedRegistry } from "./load";
import type { Provenance, RegistryInsurer, RegistryProduct } from "./types";
import {
  INSURER_TYPE_LABEL,
  NOT_AVAILABLE,
  PRODUCT_TYPE_LABEL,
  SEGMENT_LABEL,
  formatDate,
  formatPeriod,
  formatStatValue,
  latest,
} from "./format";

export interface Faq {
  q: string;
  a: string;
}

const withArticle = (phrase: string) => `${/^[aeiou]/i.test(phrase) ? "an" : "a"} ${phrase}`;

function sourceName(p: Provenance, reg: LoadedRegistry): string {
  return reg.sourceById.get(p.sourceId)?.name ?? p.sourceId;
}

function provenancesOf(...xs: ({ provenance: Provenance } | undefined)[]): Provenance[] {
  return xs.filter(Boolean).map((x) => x!.provenance);
}

export function insurerView(i: RegistryInsurer, reg: LoadedRegistry, siteProductNames: string[] = []) {
  const products = reg.productsByInsurer.get(i.slug) ?? [];
  const docs = reg.documentsByInsurer.get(i.slug) ?? [];
  const stats = reg.statisticsByInsurer.get(i.slug) ?? [];
  const name = i.name.value;

  const provs = [
    ...provenancesOf(i.name, i.legalName, i.insurerType, i.irdaiRegistrationNumber, i.cin, i.website, i.headquarters),
    ...products.flatMap((p) => provenancesOf(p.name, p.uin)),
    ...stats.map((s) => s.provenance),
  ];
  const sources = [...new Set(provs.map((p) => sourceName(p, reg)))];
  const updated = latest([
    i.updatedAt,
    ...products.map((p) => p.updatedAt),
    ...docs.map((d) => d.updatedAt),
    ...stats.map((s) => s.recordedAt),
  ]);
  const latestPeriod = stats.map((s) => s.reportingPeriod).sort().at(-1);

  const productLines = [...new Set(products.map((p) => SEGMENT_LABEL[p.segment]))];
  const listed = [
    ...products.map((p) => (p.uin ? `${p.name.value} (UIN ${p.uin.value})` : p.name.value)),
    ...siteProductNames.filter((n) => !products.some((p) => p.name.value === n)),
  ];

  const faqs: Faq[] = [];
  faqs.push({
    q: `What is ${name}?`,
    a: i.irdaiRegistrationNumber
      ? `${name} is ${withArticle(INSURER_TYPE_LABEL[i.insurerType.value].toLowerCase())}. ` +
        `Its official website gives its IRDAI registration number as ${i.irdaiRegistrationNumber.value}` +
        (i.headquarters ? ` and lists its office in ${i.headquarters.value}.` : ".") +
        ` Source: ${sourceName(i.irdaiRegistrationNumber.provenance, reg)}.`
      : `${name} is listed here as ${withArticle(INSURER_TYPE_LABEL[i.insurerType.value].toLowerCase())}. ` +
        `Its IRDAI registration number is not available in the current public data.`,
  });
  faqs.push({
    q: `Which lines of insurance does ${name} have products listed for here?`,
    a: productLines.length
      ? `Products listed on WorldBestInsurer cover: ${productLines.join(", ")}. This reflects the products we have verified, not the insurer's full range.`
      : `No products from ${name} are verified on WorldBestInsurer yet.`,
  });
  faqs.push({
    q: `Which ${name} products are publicly listed on WorldBestInsurer?`,
    a: listed.length ? `${listed.join("; ")}.` : NOT_AVAILABLE,
  });
  if (stats.length) {
    const top = [...stats].sort((a, b) => b.reportingPeriod.localeCompare(a.reportingPeriod))[0];
    faqs.push({
      q: `What is the latest available statistic for ${name}?`,
      a: `${top.label}: ${formatStatValue(top)} for ${formatPeriod(top.reportingPeriod)}, ` +
        (top.provenance.sourceDateIsObserved
          ? `as shown by ${sourceName(top.provenance, reg)} on ${formatDate(top.provenance.sourceDate)}.`
          : `published ${formatDate(top.provenance.sourceDate)} by ${sourceName(top.provenance, reg)}.`),
    });
  }
  faqs.push({
    q: `Where does this information about ${name} come from?`,
    a: sources.length
      ? `From ${sources.join(", ")}. Each value on this page links to the exact page it was read from, and was re-checked against that page before publication. Last updated ${formatDate(updated?.slice(0, 10))}.`
      : NOT_AVAILABLE,
  });

  return { name, products, docs, stats, sources, updated, latestPeriod, faqs };
}

export function productView(p: RegistryProduct, reg: LoadedRegistry) {
  const insurer = reg.insurerBySlug.get(p.insurerSlug);
  const docs = reg.documentsByProduct.get(p.slug) ?? [];
  const provs = provenancesOf(p.name, p.uin, p.policyTerm, p.eligibility, p.premiumFrequency, p.sumInsured);
  const sources = [...new Set(provs.map((x) => sourceName(x, reg)))];
  const updated = latest([p.updatedAt, ...docs.map((d) => d.updatedAt)]);
  const name = p.name.value;
  const ins = insurer?.name.value ?? p.insurerSlug;

  const faqs: Faq[] = [
    {
      q: `What is the UIN of ${name}?`,
      a: p.uin
        ? `${ins}'s product page gives the UIN (Unique Identification Number) of ${name} as ${p.uin.value}. Source: ${sourceName(p.uin.provenance, reg)}.`
        : `The UIN of ${name} is ${NOT_AVAILABLE.toLowerCase()}`,
    },
    {
      q: `What kind of insurance is ${name}?`,
      a: `WorldBestInsurer classifies ${name} as ${PRODUCT_TYPE_LABEL[p.productType].toLowerCase()} insurance from ${ins}.`,
    },
    {
      q: `Who can buy ${name}?`,
      a: p.eligibility ? `${p.eligibility.value} (as stated by ${sourceName(p.eligibility.provenance, reg)}).` : NOT_AVAILABLE,
    },
    {
      q: `Where can I read the official ${name} documents?`,
      a: docs.length
        ? `${ins} publishes: ${docs.map((d) => d.title).join("; ")}. The links on this page go directly to the insurer's own copies.`
        : `No official documents for ${name} are linked here yet. Check ${ins}'s website.`,
    },
  ];

  return { name, insurer, docs, sources, updated, faqs };
}
