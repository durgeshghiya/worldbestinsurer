/**
 * Candidate — what every connector (and every person) submits.
 *
 * A candidate is a claim, not data. It becomes a registry record only after
 * the pipeline fetches `url` itself and finds each fact's `evidence` there,
 * with the fact's value inside that evidence. See validators/evidence.ts.
 *
 * Inbox files live in scripts/registry/inbox/*.json — each holds one
 * candidate or an array of them.
 */

import type {
  DocumentKind,
  EntityStatus,
  InsuranceSegment,
  InsurerType,
  ProductStatus,
  ProductType,
  StatisticScope,
} from "../../../src/lib/registry/types";

export interface Fact<T = string> {
  value: T;
  /** Verbatim text from the source that contains the value. ≤ 400 chars. */
  evidence: string;
  /** Override when this fact lives on a different page from the candidate's url. */
  url?: string;
}

interface Base {
  /** Stable id for the inbox entry, used in logs and the review queue. */
  id: string;
  sourceId: string;
  /** The page the facts come from (official URL even for manual files). */
  url: string;
  sourceDate?: string;
  reportingPeriod?: string;
  /**
   * For sources that cannot be fetched automatically (robots / protection):
   * path, relative to scripts/registry/inbox/files/, of the file a person
   * downloaded from `url`. Evidence is checked against this file instead.
   */
  localFile?: string;
  notes?: string;
}

export interface InsurerCandidate extends Base {
  kind: "insurer";
  subject: { slug: string; siteSlug?: string };
  meta: { segments: InsuranceSegment[]; status: EntityStatus };
  facts: {
    name: Fact;
    insurerType: Fact<InsurerType>;
    website: Fact;
    legalName?: Fact;
    irdaiRegistrationNumber?: Fact;
    cin?: Fact;
    headquarters?: Fact;
  };
  formerNames?: { name: string; until?: string; evidence: string; url?: string }[];
}

export interface DocumentRef {
  kind: DocumentKind;
  title: string;
  url: string;
}

export interface ProductCandidate extends Base {
  kind: "product";
  subject: { slug: string; insurerSlug: string; siteProductId?: string };
  meta: { productType: ProductType; segment: InsuranceSegment; status: ProductStatus };
  facts: {
    name: Fact;
    uin?: Fact;
    policyTerm?: Fact;
    eligibility?: Fact;
    premiumFrequency?: Fact;
    sumInsured?: Fact;
  };
  /** Official documents. Each must be linked from `url` and respond 2xx. */
  documents?: DocumentRef[];
}

export interface StatisticCandidate extends Base {
  kind: "statistic";
  sourceDate: string;
  /** Set when the source prints no date and sourceDate is the day we saw it. */
  sourceDateObserved?: boolean;
  /** Canonical form, e.g. "FY2025-26". Must agree with facts.period. */
  reportingPeriod: string;
  subject: { scope: StatisticScope; insurerSlug?: string; segment?: InsuranceSegment };
  meta: { metric: string; label: string; unit: string };
  facts: {
    value: Fact<number>;
    /** The period as the source prints it ("2025-26"), with evidence — so a
     *  right number cannot be filed under the wrong year. */
    period: Fact;
  };
}

export type Candidate = InsurerCandidate | ProductCandidate | StatisticCandidate;
