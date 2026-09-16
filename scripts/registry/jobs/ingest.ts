/**
 * Ingest job — SOURCE → FETCH → PARSE → NORMALIZE → VALIDATE → DUPLICATE
 * CHECK → DATABASE. The site rebuild (pages, metadata, sitemap) follows from
 * the commit; nothing here writes HTML.
 *
 * A candidate is accepted only when every required fact verifies against the
 * source. Anything suspicious — a validation warning, a name change, a failed
 * optional fact — goes to the review queue with its reason. Approve it by
 * listing the warning code in scripts/registry/inbox/approvals.json.
 */

import fs from "fs";
import path from "path";
import type { Provenance, RegistryInsurer, Registry } from "../../../src/lib/registry/types";
import {
  normalizeName,
  validateInsurer,
  validateProduct,
  validateRegistry,
  validateStatistic,
  type Issue,
} from "../../../src/lib/registry/validate";
import { politeFetch } from "../lib/http";
import { JobLog } from "../lib/log";
import { RegistryStore } from "../lib/store";
import type { Candidate, Fact, InsurerCandidate, ProductCandidate, StatisticCandidate } from "../sources/candidate";
import { INBOX_DIR, loadSourcePage } from "../sources/page";
import { norm as normText } from "../lib/text";
import { toDocument, toInsurer, toProduct, toStatistic, type VerifiedFacts } from "../normalizers";
import { verifyFact } from "../validators/evidence";
import { REMOVED_PRODUCT_MAP } from "../../../src/lib/removed-products";

const REQUIRED: Record<Candidate["kind"], string[]> = {
  insurer: ["name", "insurerType", "website"],
  product: ["name"],
  statistic: ["value", "period"],
};

/**
 * Documents are files. An HTML response is refused — including the common
 * case of a ".pdf" URL answered by a single-page app's fallback shell, which
 * returns 200 and HTML for any path.
 */
const DOC_TYPES = /^application\/(pdf|msword|vnd\.openxmlformats-officedocument|vnd\.ms-excel)/;

function looksLikeDocument(contentType: string, body: Buffer): string | null {
  const ct = contentType.split(";")[0].trim();
  if (!DOC_TYPES.test(ct)) return `served as ${ct || "unknown type"}, not a document`;
  if (ct === "application/pdf" && body.length > 0 && body.subarray(0, 5).toString("latin1") !== "%PDF-")
    return "labelled PDF but the bytes are not a PDF";
  return null;
}

export interface IngestOptions {
  dryRun?: boolean;
  only?: string[]; // candidate ids
}

export interface IngestSummary {
  accepted: number;
  unchanged: number;
  held: number;
  rejected: number;
  documents: number;
}

function readInbox(log: JobLog): Candidate[] {
  if (!fs.existsSync(INBOX_DIR)) return [];
  const out: Candidate[] = [];
  for (const f of fs.readdirSync(INBOX_DIR).sort()) {
    if (!f.endsWith(".json") || f === "approvals.json") continue;
    try {
      const data = JSON.parse(fs.readFileSync(path.join(INBOX_DIR, f), "utf-8"));
      out.push(...(Array.isArray(data) ? data : [data]));
    } catch (e) {
      log.error("inbox-parse-failed", { file: f, error: String(e) });
    }
  }
  return out;
}

function readApprovals(): Record<string, string[]> {
  const p = path.join(INBOX_DIR, "approvals.json");
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf-8")) : {};
}

function siteProductIds(): Set<string> {
  const ids = new Set<string>();
  for (const c of ["health", "term-life", "motor", "travel"]) {
    const p = path.join(process.cwd(), "src/data/in", `${c}-insurance.json`);
    if (!fs.existsSync(p)) continue;
    const d = JSON.parse(fs.readFileSync(p, "utf-8"));
    for (const x of Array.isArray(d) ? d : d.products ?? []) ids.add(x.id);
  }
  return ids;
}

/** Normalise a URL for "is this document linked from that page" checks. */
function urlKey(u: string): string {
  try {
    const x = new URL(u);
    x.hash = "";
    return `${x.host.replace(/^www\./, "")}${decodeURI(x.pathname).replace(/\/$/, "")}${x.search}`.toLowerCase();
  } catch {
    return u.toLowerCase();
  }
}

export async function runIngest(opts: IngestOptions = {}): Promise<IngestSummary> {
  const log = new JobLog("ingest");
  const store = new RegistryStore("ingest");
  const approvals = readApprovals();
  const siteIds = siteProductIds();
  const now = new Date().toISOString();
  const summary: IngestSummary = { accepted: 0, unchanged: 0, held: 0, rejected: 0, documents: 0 };

  let candidates = readInbox(log);
  if (opts.only?.length) candidates = candidates.filter((c) => opts.only!.includes(c.id));
  // Insurers first: products and statistics validate against them.
  const order = { insurer: 0, product: 1, statistic: 2 } as const;
  candidates.sort((a, b) => order[a.kind] - order[b.kind]);
  log.info("start", { candidates: candidates.length, dryRun: !!opts.dryRun });

  const hold = (c: Candidate, reason: string) => {
    summary.held++;
    store.enqueueReview({ id: c.id, kind: c.kind, reason, candidate: c });
    log.warn("held-for-review", { id: c.id, reason });
  };
  const reject = (c: Candidate, reason: string) => {
    summary.rejected++;
    store.enqueueReview({ id: c.id, kind: c.kind, reason: `REJECTED: ${reason}`, candidate: c });
    log.error("rejected", { id: c.id, reason });
  };

  /** Blocking issues: errors, plus warnings that nobody has approved. */
  const blocking = (c: Candidate, issues: Issue[]) =>
    issues.filter((i) => i.level === "error" || !(approvals[c.id] ?? []).includes(i.code));

  for (const c of candidates) {
    const source = store.source(c.sourceId);
    if (!source) {
      reject(c, `unknown source "${c.sourceId}" — add it to sources.json first`);
      continue;
    }

    // ── FETCH + PARSE + VERIFY every fact ──
    const facts = c.facts as Record<string, Fact<string | number> | undefined>;
    const verified: VerifiedFacts = {};
    const failures: string[] = [];
    for (const [field, fact] of Object.entries(facts)) {
      if (!fact) continue;
      const url = fact.url ?? c.url;
      const loaded = await loadSourcePage(source, url, fact.url ? undefined : c.localFile);
      if (!loaded.ok) {
        failures.push(`${field}: ${loaded.reason}`);
        continue;
      }
      const r = verifyFact(field, fact, loaded.page, { pageUrl: loaded.url, sourceHomepage: source.homepage });
      if (!r.ok) {
        failures.push(`${field}: ${r.reason}`);
        continue;
      }
      const notes = [
        loaded.manual ? "retrieved manually by an operator" : undefined,
        r.location === "embedded" ? "found in the page's embedded structured data, not visible text" : undefined,
      ].filter(Boolean).join("; ");
      const provenance: Provenance = {
        sourceId: source.id,
        url: loaded.url,
        retrievedAt: loaded.retrievedAt,
        sourceDate: c.sourceDate,
        reportingPeriod: c.reportingPeriod,
        evidence: fact.evidence || undefined,
        license: source.license,
        notes: notes || undefined,
      };
      verified[field] = { value: fact.value, provenance };
    }

    const missingRequired = REQUIRED[c.kind].filter((f) => !verified[f]);
    if (missingRequired.length) {
      reject(c, `required fact(s) failed verification — ${failures.join(" | ")}`);
      continue;
    }
    if (failures.length) {
      // Optional facts that failed are dropped, and the drop is visible.
      log.warn("optional-facts-dropped", { id: c.id, failures });
      if (!(approvals[c.id] ?? []).includes("optional-facts-dropped")) {
        hold(c, `optional fact(s) failed verification — ${failures.join(" | ")}`);
        continue;
      }
    }

    // ── NORMALIZE + VALIDATE + DUPLICATE CHECK + WRITE ──
    const ids = new Set(store.sources.map((s) => s.id));
    if (c.kind === "insurer") {
      const res = await acceptInsurer(c, verified, store, source.homepage, now, ids, blocking, log);
      // held / rejected were already counted by hold() and reject().
      if (res === "held" || res === "rejected") continue;
      if (res === "unchanged") summary.unchanged++;
      else summary.accepted++;
    } else if (c.kind === "product") {
      const res = await acceptProduct(c, verified, store, now, ids, siteIds, blocking, log, summary);
      // held / rejected were already counted by hold() and reject().
      if (res === "held" || res === "rejected") continue;
      if (res === "unchanged") summary.unchanged++;
      else summary.accepted++;
    } else {
      const sc = c as StatisticCandidate;
      // The verified period text must agree with the period we file it under.
      const digits = (x: string) => (x.match(/\d+/g) ?? []).map((d) => d.slice(-2)).join("-");
      if (digits(String(verified.period.value)) !== digits(sc.reportingPeriod)) {
        reject(c, `reportingPeriod "${sc.reportingPeriod}" does not match the verified period "${verified.period.value}"`);
        continue;
      }
      // Bind the figure to its period: the passage that proves the period must
      // contain the (short, label-specific) passage that proves the value.
      if (!normText(String(sc.facts.period.evidence)).includes(normText(String(sc.facts.value.evidence)))) {
        reject(c, "the period evidence must contain the value evidence, so the figure and its year come from one passage");
        continue;
      }
      if (sc.sourceDateObserved) verified.value.provenance.sourceDateIsObserved = true;
      const rec = toStatistic(sc, verified, now);
      const issues = blocking(c, validateStatistic(rec, ids));
      if (issues.length) {
        hold(c, issues.map((i) => `[${i.code}] ${i.message}`).join(" | "));
        continue;
      }
      const r = store.appendStatistic(rec);
      if (r === "added") summary.accepted++;
      else summary.unchanged++;
    }
    store.clearReview(c.id);
  }

  // ── whole-registry gate: never write a registry that would fail the build ──
  const snapshot: Registry = {
    meta: store.meta,
    sources: store.sources,
    insurers: store.insurers,
    products: store.products,
    documents: store.documents,
    statistics: store.statistics,
  };
  const errors = validateRegistry(snapshot).filter((i) => i.level === "error");
  const ok = errors.length === 0;
  for (const e of errors) log.error("registry-invalid", { code: e.code, message: e.message });

  const line = `${summary.accepted} accepted, ${summary.unchanged} unchanged, ${summary.held} held, ${summary.rejected} rejected, ${summary.documents} documents`;
  if (!ok) {
    log.error("aborted", { reason: "registry would fail validation; nothing written" });
  } else if (opts.dryRun) {
    log.info("dry-run", { changes: store.pendingChanges });
  } else {
    store.setRun(line, summary.rejected === 0);
    store.commit();
  }
  log.info("done", { ...summary, log: path.relative(process.cwd(), log.file) });
  if (!ok) throw new Error("ingest aborted: registry invalid");
  return summary;

  // ── helpers (closures over hold/reject) ──

  async function acceptInsurer(
    c: InsurerCandidate,
    f: VerifiedFacts,
    st: RegistryStore,
    homepage: string,
    ts: string,
    sourceIds: Set<string>,
    block: typeof blocking,
    lg: JobLog
  ): Promise<"added" | "updated" | "unchanged" | "held" | "rejected"> {
    if (c.subject.siteSlug && c.subject.siteSlug !== c.subject.slug) {
      reject(c, "siteSlug must equal slug, so the insurer keeps one URL");
      return "rejected";
    }
    const formerNames: RegistryInsurer["formerNames"] = [];
    for (const fn of c.formerNames ?? []) {
      const url = fn.url ?? c.url;
      const loaded = await loadSourcePage(st.source(c.sourceId)!, url, fn.url ? undefined : c.localFile);
      const r = loaded.ok
        ? verifyFact("formerName", { value: fn.name, evidence: fn.evidence }, loaded.page, { pageUrl: loaded.url, sourceHomepage: homepage })
        : { ok: false, reason: loaded.reason };
      if (!r.ok || !loaded.ok) {
        lg.warn("former-name-unverified", { id: c.id, name: fn.name, reason: r.reason });
        continue;
      }
      formerNames.push({
        name: fn.name,
        until: fn.until,
        provenance: { sourceId: c.sourceId, url: loaded.url, retrievedAt: loaded.retrievedAt, evidence: fn.evidence },
      });
    }
    const rec = toInsurer(c, f, ts, formerNames);
    const issues = block(c, validateInsurer(rec, sourceIds));

    // Name drift: an existing insurer whose verified name changed is a rename
    // or a mistake. Either way a person decides — unless the old name is
    // documented as a former name.
    const prev = st.insurers.find((x) => x.slug === rec.slug);
    if (prev && normalizeName(prev.name.value) !== normalizeName(rec.name.value)) {
      const documented = (rec.formerNames ?? []).some((n) => normalizeName(n.name) === normalizeName(prev.name.value));
      if (!documented && !(approvals[c.id] ?? []).includes("name-changed")) {
        issues.push({ level: "warning", code: "name-changed", message: `name changed from "${prev.name.value}" to "${rec.name.value}"` });
      }
    }
    // Duplicate by registration number under a different slug.
    const reg = rec.irdaiRegistrationNumber?.value;
    const clash = reg && st.insurers.find((x) => x.slug !== rec.slug && x.irdaiRegistrationNumber?.value === reg);
    if (clash) issues.push({ level: "error", code: "duplicate-registration", message: `registration ${reg} already belongs to ${clash.slug}` });

    if (issues.length) {
      const hard = issues.some((i) => i.level === "error");
      (hard ? reject : hold)(c, issues.map((i) => `[${i.code}] ${i.message}`).join(" | "));
      return hard ? "rejected" : "held";
    }
    const r = st.upsertInsurer(rec);
    lg.info(`insurer-${r}`, { slug: rec.slug });
    return r;
  }

  async function acceptProduct(
    c: ProductCandidate,
    f: VerifiedFacts,
    st: RegistryStore,
    ts: string,
    sourceIds: Set<string>,
    siteIdSet: Set<string>,
    block: typeof blocking,
    lg: JobLog,
    sum: IngestSummary
  ): Promise<"added" | "updated" | "unchanged" | "held" | "rejected"> {
    const { slug, siteProductId } = c.subject;
    if (siteProductId && siteProductId !== slug) {
      reject(c, "siteProductId must equal slug, so the product keeps one URL");
      return "rejected";
    }
    if (siteProductId && !siteIdSet.has(siteProductId)) {
      reject(c, `siteProductId "${siteProductId}" does not exist in src/data/in`);
      return "rejected";
    }
    if (slug in REMOVED_PRODUCT_MAP) {
      // src/proxy.ts 301s these ids, so a page here would never be reachable.
      reject(
        c,
        siteProductId
          ? `"${slug}" is a live site product but is listed in REMOVED_PRODUCT_MAP — the map is stale; remove the entry`
          : `slug "${slug}" is a removed product id and would redirect — choose another slug, or remove it from REMOVED_PRODUCT_MAP if this is the same product returning`
      );
      return "rejected";
    }
    if (!siteProductId && siteIdSet.has(slug)) {
      reject(c, `slug "${slug}" collides with an existing site product — set siteProductId if they are the same product`);
      return "rejected";
    }
    const rec = toProduct(c, f, ts);
    const insurers = new Map(st.insurers.map((i) => [i.slug, i]));
    const issues = block(c, validateProduct(rec, insurers, sourceIds));
    const uin = rec.uin?.value;
    const clash = uin && st.products.find((p) => p.slug !== slug && p.uin?.value === uin);
    if (clash) issues.push({ level: "error", code: "duplicate-uin", message: `UIN ${uin} already belongs to ${clash.slug}` });
    if (issues.length) {
      const hard = issues.some((i) => i.level === "error");
      (hard ? reject : hold)(c, issues.map((i) => `[${i.code}] ${i.message}`).join(" | "));
      return hard ? "rejected" : "held";
    }

    // Documents: linked from the verified product page, and actually a file.
    const loaded = await loadSourcePage(st.source(c.sourceId)!, c.url, c.localFile);
    const linked = new Set(loaded.ok ? loaded.page.links.map((l) => urlKey(l.href)) : []);
    const keep = new Set<string>();
    for (const ref of c.documents ?? []) {
      if (!linked.has(urlKey(ref.url))) {
        lg.warn("document-not-linked", { id: c.id, url: ref.url });
        continue;
      }
      const got = await politeFetch(ref.url);
      if (!got.ok) {
        lg.warn("document-unreachable", { id: c.id, url: ref.url, reason: got.detail });
        continue;
      }
      const notDoc = looksLikeDocument(got.contentType, got.body);
      if (notDoc) {
        lg.warn("document-refused", { id: c.id, url: ref.url, reason: notDoc });
        continue;
      }
      const linkedFrom: Provenance = {
        sourceId: c.sourceId,
        url: loaded.ok ? loaded.url : c.url,
        retrievedAt: loaded.ok ? loaded.retrievedAt : ts,
        notes: "document linked from this official page",
      };
      const fresh = toDocument(ref, c, linkedFrom, {
        status: got.status,
        contentType: got.contentType.split(";")[0],
        sha256: got.sha256,
        at: got.fetchedAt,
      }, ts);
      keep.add(fresh.id);
      const prev = st.documents.find((d) => d.id === fresh.id);
      let doc = { ...fresh, url: got.url };
      if (prev) {
        // Hash tracking belongs to check-documents; ingest must not churn it.
        doc = { ...doc, contentHash: prev.contentHash, volatile: prev.volatile, lastCheckedAt: prev.lastCheckedAt };
      } else {
        // New file: fetch again to learn whether the server regenerates it.
        const again = await politeFetch(ref.url);
        if (again.ok && again.sha256 !== got.sha256) doc = { ...doc, volatile: true, contentHash: undefined };
      }
      const r = st.upsertDocument(doc);
      if (r !== "unchanged") sum.documents++;
      lg.info(`document-${r}`, { product: slug, kind: ref.kind });
    }
    // Anything previously stored for this product that did not verify now goes.
    for (const d of st.documents.filter((x) => x.productSlug === slug && !keep.has(x.id))) {
      st.removeDocument(d.id, "no longer verifies as an official document linked from the product page");
      sum.documents++;
      lg.warn("document-removed", { product: slug, url: d.url });
    }

    const r = st.upsertProduct(rec);
    lg.info(`product-${r}`, { slug, uin: uin ?? "—" });
    return r;
  }
}
