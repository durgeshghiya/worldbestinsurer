/**
 * Public JSON shapes. Provenance is always included — it is the point of
 * the data — but internal bookkeeping (content hashes, check timestamps that
 * would churn) is not.
 */

import type {
  LoadedRegistry,
  RegistryDocument,
  RegistryInsurer,
  RegistryProduct,
  RegistryStatistic,
  SiteFacts,
} from "@/lib/registry";
import { insurerVerdict, productVerdict } from "@/lib/registry";
import { pagePath } from "./http";

export function insurerSummary(i: RegistryInsurer, reg: LoadedRegistry, site: SiteFacts) {
  return {
    slug: i.slug,
    name: i.name.value,
    insurerType: i.insurerType.value,
    segments: i.segments,
    irdaiRegistrationNumber: i.irdaiRegistrationNumber?.value ?? null,
    website: i.website.value,
    status: i.status,
    productCount: reg.productsByInsurer.get(i.slug)?.length ?? 0,
    statisticCount: reg.statisticsByInsurer.get(i.slug)?.length ?? 0,
    page: pagePath.insurer(i.slug),
    indexable: insurerVerdict(i.slug, reg, site).indexable,
    updatedAt: i.updatedAt,
  };
}

export function insurerDetail(i: RegistryInsurer, reg: LoadedRegistry, site: SiteFacts) {
  return {
    ...insurerSummary(i, reg, site),
    fields: {
      name: i.name,
      legalName: i.legalName ?? null,
      insurerType: i.insurerType,
      irdaiRegistrationNumber: i.irdaiRegistrationNumber ?? null,
      cin: i.cin ?? null,
      website: i.website,
      headquarters: i.headquarters ?? null,
    },
    formerNames: i.formerNames ?? [],
    documents: (reg.documentsByInsurer.get(i.slug) ?? []).map(documentShape),
    createdAt: i.createdAt,
  };
}

export function productSummary(p: RegistryProduct, reg: LoadedRegistry, site: SiteFacts) {
  const id = p.siteProductId ?? p.slug;
  return {
    slug: p.slug,
    name: p.name.value,
    insurer: p.insurerSlug,
    uin: p.uin?.value ?? null,
    productType: p.productType,
    segment: p.segment,
    status: p.status,
    page: pagePath.product(p.slug, p.siteProductId),
    indexable: productVerdict(id, reg, site).indexable,
    updatedAt: p.updatedAt,
  };
}

export function productDetail(p: RegistryProduct, reg: LoadedRegistry, site: SiteFacts) {
  return {
    ...productSummary(p, reg, site),
    fields: {
      name: p.name,
      uin: p.uin ?? null,
      policyTerm: p.policyTerm ?? null,
      eligibility: p.eligibility ?? null,
      premiumFrequency: p.premiumFrequency ?? null,
      sumInsured: p.sumInsured ?? null,
    },
    documents: (reg.documentsByProduct.get(p.slug) ?? []).map(documentShape),
    createdAt: p.createdAt,
  };
}

export function documentShape(d: RegistryDocument) {
  return {
    id: d.id,
    kind: d.kind,
    title: d.title,
    url: d.url,
    product: d.productSlug ?? null,
    available: d.lastStatus === undefined ? null : d.lastStatus >= 200 && d.lastStatus < 400,
    lastCheckedAt: d.lastCheckedAt ?? null,
    linkedFrom: d.provenance,
  };
}

export function statisticShape(s: RegistryStatistic) {
  return {
    id: s.id,
    scope: s.scope,
    insurer: s.insurerSlug ?? null,
    segment: s.segment ?? null,
    metric: s.metric,
    label: s.label,
    value: s.value,
    unit: s.unit,
    reportingPeriod: s.reportingPeriod,
    source: s.provenance,
    supersedes: s.supersedes ?? null,
    recordedAt: s.recordedAt,
  };
}
