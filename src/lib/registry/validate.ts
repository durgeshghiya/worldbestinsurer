/**
 * Registry validators. Pure functions — shared by the ingestion pipeline
 * (scripts/registry) and the build-time integrity check, so the same rules
 * decide what gets in and what gets published.
 *
 * Errors block a record. Warnings send it to the review queue instead of
 * being silently accepted.
 */

import type {
  Provenance,
  Registry,
  RegistryDocument,
  RegistryInsurer,
  RegistryProduct,
  RegistryStatistic,
  Sourced,
} from "./types";

export interface Issue {
  level: "error" | "warning";
  code: string;
  message: string;
  key?: string;
}

// ─────────────────────────────── primitives ───────────────────────────────

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2})?)?$/;

export function isValidIsoDate(s: string | undefined, { allowFutureDays = 1 } = {}): boolean {
  if (!s || !ISO_DATE.test(s)) return false;
  const t = Date.parse(s);
  if (Number.isNaN(t)) return false;
  // A source cannot be dated meaningfully in the future.
  return t <= Date.now() + allowFutureDays * 86_400_000;
}

export function isHttpsUrl(s: string | undefined): boolean {
  if (!s) return false;
  try {
    return new URL(s).protocol === "https:";
  } catch {
    return false;
  }
}

/** Registrable-ish domain: last two labels, or three for .co.in / .org.in etc. */
export function baseDomain(url: string): string {
  const host = new URL(url).hostname.toLowerCase();
  const parts = host.split(".");
  const twoLevelTld = /^(co|org|gov|nic|net|ac)$/.test(parts[parts.length - 2] ?? "");
  return parts.slice(twoLevelTld ? -3 : -2).join(".");
}

/**
 * Normalise an insurer or product name for duplicate / consistency checks.
 * "HDFC ERGO General Insurance Co. Ltd." → "hdfc ergo general"
 */
export function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\b(ltd|limited|co|company|corporation|corp|pvt|private|the|insurance|of|india)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─────────────────────────────── UIN ───────────────────────────────

export type UinFormat = "life" | "non-life" | "non-life-legacy" | "unknown";

export interface UinClass {
  format: UinFormat;
  /** IRDAI registration number embedded in the UIN, where the format has one. */
  registrationPrefix?: string;
  /** Three-letter insurer code, for the post-2016 non-life format. */
  insurerCode?: string;
}

/**
 * IRDAI UIN shapes, as printed on product literature:
 *   life             512N279V02            reg-no + letter + product + V + version
 *   non-life         NBHHLIP23169V032223   insurer-code + line + serial + V + version + FY
 *   non-life-legacy  IRDAN108RP0001V01200102
 */
export function classifyUin(raw: string): UinClass {
  const uin = raw.trim().toUpperCase();
  let m = uin.match(/^(\d{3})[A-Z]\d{3}V\d{2}$/);
  if (m) return { format: "life", registrationPrefix: m[1] };
  m = uin.match(/^IRDAN(\d{3})[A-Z]{1,3}\d{3,4}V\d{2}\d{6}$/);
  if (m) return { format: "non-life-legacy", registrationPrefix: m[1] };
  m = uin.match(/^([A-Z]{3})[A-Z]{2,6}\d{5}V\d{6}$/);
  if (m) return { format: "non-life", insurerCode: m[1] };
  return { format: "unknown" };
}

// ─────────────────────────────── provenance ───────────────────────────────

export function checkProvenance(
  p: Provenance | undefined,
  where: string,
  sourceIds: Set<string>
): Issue[] {
  const out: Issue[] = [];
  if (!p) {
    return [{ level: "error", code: "missing-source", message: `${where}: no provenance`, key: where }];
  }
  if (!sourceIds.has(p.sourceId))
    out.push({ level: "error", code: "unknown-source", message: `${where}: sourceId "${p.sourceId}" is not in sources.json`, key: where });
  if (!isHttpsUrl(p.url))
    out.push({ level: "error", code: "bad-source-url", message: `${where}: source URL is not https: ${p.url}`, key: where });
  if (!isValidIsoDate(p.retrievedAt))
    out.push({ level: "error", code: "bad-retrieved-at", message: `${where}: retrievedAt is not a valid past date`, key: where });
  if (p.sourceDate && !isValidIsoDate(p.sourceDate))
    out.push({ level: "error", code: "bad-source-date", message: `${where}: sourceDate is invalid or in the future`, key: where });
  return out;
}

function sourced<T>(
  f: Sourced<T> | undefined,
  where: string,
  ids: Set<string>
): Issue[] {
  return f ? checkProvenance(f.provenance, where, ids) : [];
}

// ─────────────────────────────── records ───────────────────────────────

export function validateInsurer(i: RegistryInsurer, ids: Set<string>): Issue[] {
  const k = `insurer:${i.slug}`;
  const out: Issue[] = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(i.slug))
    out.push({ level: "error", code: "bad-slug", message: `${k}: slug must be kebab-case`, key: k });
  out.push(...sourced(i.name, `${k}.name`, ids));
  out.push(...sourced(i.legalName, `${k}.legalName`, ids));
  out.push(...sourced(i.insurerType, `${k}.insurerType`, ids));
  out.push(...sourced(i.irdaiRegistrationNumber, `${k}.irdaiRegistrationNumber`, ids));
  out.push(...sourced(i.cin, `${k}.cin`, ids));
  out.push(...sourced(i.website, `${k}.website`, ids));
  out.push(...sourced(i.headquarters, `${k}.headquarters`, ids));
  if (!isHttpsUrl(i.website?.value))
    out.push({ level: "error", code: "bad-website", message: `${k}: website must be an https URL`, key: k });
  const reg = i.irdaiRegistrationNumber?.value;
  if (reg !== undefined && !/^\d{1,3}$/.test(reg))
    out.push({ level: "error", code: "bad-registration", message: `${k}: IRDAI registration number "${reg}" is not 1–3 digits`, key: k });
  const cin = i.cin?.value;
  if (cin !== undefined && !/^[LU]\d{5}[A-Z]{2}\d{4}[A-Z]{3}\d{6}$/.test(cin))
    out.push({ level: "warning", code: "bad-cin", message: `${k}: CIN "${cin}" does not match the MCA format`, key: k });
  if (i.segments.length === 0)
    out.push({ level: "warning", code: "no-segments", message: `${k}: no segments recorded`, key: k });
  return out;
}

export function validateProduct(
  p: RegistryProduct,
  insurers: Map<string, RegistryInsurer>,
  ids: Set<string>
): Issue[] {
  const k = `product:${p.slug}`;
  const out: Issue[] = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug))
    out.push({ level: "error", code: "bad-slug", message: `${k}: slug must be kebab-case`, key: k });
  const ins = insurers.get(p.insurerSlug);
  if (!ins)
    out.push({ level: "error", code: "unknown-insurer", message: `${k}: insurer "${p.insurerSlug}" is not in the registry`, key: k });
  out.push(...sourced(p.name, `${k}.name`, ids));
  out.push(...sourced(p.uin, `${k}.uin`, ids));
  out.push(...sourced(p.policyTerm, `${k}.policyTerm`, ids));
  out.push(...sourced(p.eligibility, `${k}.eligibility`, ids));
  out.push(...sourced(p.premiumFrequency, `${k}.premiumFrequency`, ids));
  out.push(...sourced(p.sumInsured, `${k}.sumInsured`, ids));

  if (p.uin) {
    const c = classifyUin(p.uin.value);
    if (c.format === "unknown") {
      out.push({ level: "warning", code: "uin-format", message: `${k}: UIN "${p.uin.value}" is not a recognised IRDAI format`, key: k });
    }
    // A life UIN starts with the insurer's IRDAI registration number. A
    // mismatch means the product is attributed to the wrong company.
    const reg = ins?.irdaiRegistrationNumber?.value;
    if (c.registrationPrefix && reg && c.registrationPrefix !== reg.padStart(3, "0")) {
      out.push({
        level: "error",
        code: "uin-insurer-mismatch",
        message: `${k}: UIN prefix ${c.registrationPrefix} does not match ${p.insurerSlug}'s registration number ${reg}`,
        key: k,
      });
    }
    if (c.format === "life" && ins && ins.insurerType.value !== "life") {
      out.push({ level: "warning", code: "uin-type-mismatch", message: `${k}: life-format UIN on a ${ins.insurerType.value} insurer`, key: k });
    }
  }
  return out;
}

export function validateDocument(d: RegistryDocument, ids: Set<string>): Issue[] {
  const k = `document:${d.id}`;
  const out: Issue[] = [...checkProvenance(d.provenance, k, ids)];
  if (!isHttpsUrl(d.url))
    out.push({ level: "error", code: "bad-document-url", message: `${k}: document URL is not https`, key: k });
  if (d.lastStatus !== undefined && (d.lastStatus < 200 || d.lastStatus >= 400))
    out.push({ level: "warning", code: "broken-document", message: `${k}: last check returned HTTP ${d.lastStatus}`, key: k });
  return out;
}

/** Percentages that cannot exceed 100. Solvency and loss ratios can. */
const BOUNDED_PERCENT = /(settlement-ratio|market-share|claims-settled-within)/;

export function validateStatistic(s: RegistryStatistic, ids: Set<string>): Issue[] {
  const k = `statistic:${s.id}`;
  const out: Issue[] = [...checkProvenance(s.provenance, k, ids)];
  if (!s.provenance?.sourceDate)
    out.push({ level: "error", code: "missing-source-date", message: `${k}: statistics require a sourceDate`, key: k });
  if (!s.reportingPeriod)
    out.push({ level: "error", code: "missing-period", message: `${k}: statistics require a reporting period`, key: k });
  if (!Number.isFinite(s.value))
    out.push({ level: "error", code: "bad-value", message: `${k}: value is not a finite number`, key: k });
  if (s.unit === "%" && (s.value < 0 || (BOUNDED_PERCENT.test(s.metric) && s.value > 100)))
    out.push({ level: "error", code: "bad-percentage", message: `${k}: ${s.value}% is out of range for ${s.metric}`, key: k });
  if (s.scope === "insurer" && !s.insurerSlug)
    out.push({ level: "error", code: "missing-subject", message: `${k}: insurer-scoped statistic has no insurerSlug`, key: k });
  return out;
}

// ─────────────────────────────── whole-registry ───────────────────────────────

function dupes<T>(items: T[], key: (t: T) => string | undefined): string[] {
  const seen = new Map<string, number>();
  for (const it of items) {
    const k = key(it);
    if (k) seen.set(k, (seen.get(k) ?? 0) + 1);
  }
  return [...seen].filter(([, n]) => n > 1).map(([k]) => k);
}

/** Validate every record and every cross-record rule. */
export function validateRegistry(r: Registry): Issue[] {
  const ids = new Set(r.sources.map((s) => s.id));
  const insurers = new Map(r.insurers.map((i) => [i.slug, i]));
  const out: Issue[] = [];

  for (const i of r.insurers) out.push(...validateInsurer(i, ids));
  for (const p of r.products) out.push(...validateProduct(p, insurers, ids));
  for (const d of r.documents) out.push(...validateDocument(d, ids));
  for (const s of r.statistics) out.push(...validateStatistic(s, ids));

  for (const k of dupes(r.sources, (s) => s.id))
    out.push({ level: "error", code: "duplicate-source", message: `duplicate source id ${k}` });
  for (const k of dupes(r.insurers, (i) => i.slug))
    out.push({ level: "error", code: "duplicate-insurer", message: `duplicate insurer slug ${k}` });
  for (const k of dupes(r.insurers, (i) => normalizeName(i.name.value)))
    out.push({ level: "warning", code: "duplicate-insurer-name", message: `two insurers normalise to "${k}"` });
  for (const k of dupes(r.insurers, (i) => i.irdaiRegistrationNumber?.value))
    out.push({ level: "error", code: "duplicate-registration", message: `two insurers share IRDAI registration ${k}` });
  for (const k of dupes(r.products, (p) => p.slug))
    out.push({ level: "error", code: "duplicate-product", message: `duplicate product slug ${k}` });
  for (const k of dupes(r.products, (p) => p.uin?.value.toUpperCase()))
    out.push({ level: "error", code: "duplicate-uin", message: `two products share UIN ${k}` });
  for (const k of dupes(r.products, (p) => `${p.insurerSlug}|${normalizeName(p.name.value)}`))
    out.push({ level: "warning", code: "duplicate-product-name", message: `two products from one insurer normalise to "${k}"` });
  for (const k of dupes(r.documents, (d) => d.id))
    out.push({ level: "error", code: "duplicate-document", message: `duplicate document id ${k}` });
  for (const k of dupes(r.statistics, (s) => s.id))
    out.push({ level: "error", code: "duplicate-statistic", message: `duplicate statistic id ${k}` });

  const productSlugs = new Set(r.products.map((p) => p.slug));
  for (const d of r.documents) {
    if (!insurers.has(d.insurerSlug))
      out.push({ level: "error", code: "orphan-document", message: `document ${d.id} references unknown insurer ${d.insurerSlug}` });
    if (d.productSlug && !productSlugs.has(d.productSlug))
      out.push({ level: "error", code: "orphan-document", message: `document ${d.id} references unknown product ${d.productSlug}` });
  }
  for (const s of r.statistics) {
    if (s.insurerSlug && !insurers.has(s.insurerSlug))
      out.push({ level: "error", code: "orphan-statistic", message: `statistic ${s.id} references unknown insurer ${s.insurerSlug}` });
  }
  const statIds = new Set(r.statistics.map((s) => s.id));
  for (const s of r.statistics) {
    if (s.supersedes && !statIds.has(s.supersedes))
      out.push({ level: "error", code: "bad-supersedes", message: `statistic ${s.id} supersedes unknown ${s.supersedes}` });
  }
  return out;
}
