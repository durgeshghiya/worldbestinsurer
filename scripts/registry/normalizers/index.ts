/**
 * Normalizers: verified candidate → registry record.
 *
 * They only reshape and tidy. They never invent: a field with no verified
 * fact is left undefined, and the page renders "Not available in the current
 * public data."
 */

import { createHash } from "crypto";
import type {
  DocumentKind,
  Provenance,
  RegistryDocument,
  RegistryInsurer,
  RegistryProduct,
  RegistryStatistic,
  Sourced,
} from "../../../src/lib/registry/types";
import type { InsurerCandidate, ProductCandidate, StatisticCandidate } from "../sources/candidate";

export type VerifiedFacts = Record<string, { value: unknown; provenance: Provenance }>;

export const stableId = (...parts: string[]) =>
  createHash("sha256").update(parts.join("|")).digest("hex").slice(0, 16);

const tidy = (s: string) => s.replace(/\s+/g, " ").trim();

function src<T>(f: VerifiedFacts, key: string, map: (v: unknown) => T = (v) => v as T): Sourced<T> | undefined {
  const x = f[key];
  return x ? { value: map(x.value), provenance: x.provenance } : undefined;
}

const str = (v: unknown) => tidy(String(v));

export function toInsurer(c: InsurerCandidate, f: VerifiedFacts, now: string, formerNames: RegistryInsurer["formerNames"]): RegistryInsurer {
  return {
    slug: c.subject.slug,
    name: src(f, "name", str)!,
    legalName: src(f, "legalName", str),
    insurerType: src(f, "insurerType", (v) => v as RegistryInsurer["insurerType"]["value"])!,
    segments: [...new Set(c.meta.segments)].sort(),
    irdaiRegistrationNumber: src(f, "irdaiRegistrationNumber", (v) => String(v).replace(/^0+(?=\d)/, "")),
    cin: src(f, "cin", (v) => String(v).trim().toUpperCase()),
    website: src(f, "website", (v) => new URL(String(v)).toString())!,
    headquarters: src(f, "headquarters", str),
    status: c.meta.status,
    formerNames: formerNames?.length ? formerNames : undefined,
    siteSlug: c.subject.siteSlug,
    createdAt: now,
    updatedAt: now,
  };
}

export function toProduct(c: ProductCandidate, f: VerifiedFacts, now: string): RegistryProduct {
  return {
    slug: c.subject.slug,
    insurerSlug: c.subject.insurerSlug,
    name: src(f, "name", str)!,
    uin: src(f, "uin", (v) => String(v).trim().toUpperCase()),
    productType: c.meta.productType,
    segment: c.meta.segment,
    status: c.meta.status,
    policyTerm: src(f, "policyTerm", str),
    eligibility: src(f, "eligibility", str),
    premiumFrequency: src(f, "premiumFrequency", str),
    sumInsured: src(f, "sumInsured", str),
    siteProductId: c.subject.siteProductId,
    createdAt: now,
    updatedAt: now,
  };
}

export function toDocument(
  ref: { kind: DocumentKind; title: string; url: string },
  c: ProductCandidate,
  linkedFrom: Provenance,
  check: { status: number; contentType: string; sha256?: string; at: string },
  now: string
): RegistryDocument {
  return {
    id: stableId(ref.url),
    insurerSlug: c.subject.insurerSlug,
    productSlug: c.subject.slug,
    kind: ref.kind,
    title: tidy(ref.title),
    url: ref.url,
    contentType: check.contentType || undefined,
    contentHash: check.sha256,
    lastStatus: check.status,
    lastCheckedAt: check.at,
    provenance: linkedFrom,
    createdAt: now,
    updatedAt: now,
  };
}

export function toStatistic(c: StatisticCandidate, f: VerifiedFacts, now: string): RegistryStatistic {
  const v = f.value;
  const subject = c.subject.insurerSlug ?? c.subject.segment ?? "market";
  return {
    id: stableId(c.subject.scope, subject, c.meta.metric, c.reportingPeriod, c.sourceId, c.url),
    scope: c.subject.scope,
    insurerSlug: c.subject.insurerSlug,
    segment: c.subject.segment,
    metric: c.meta.metric,
    label: c.meta.label,
    value: Number(v.value),
    unit: c.meta.unit,
    reportingPeriod: c.reportingPeriod,
    provenance: { ...v.provenance, sourceDate: c.sourceDate, reportingPeriod: c.reportingPeriod },
    recordedAt: now,
  };
}
