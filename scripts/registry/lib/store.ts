/**
 * Registry store — the pipeline's only write path to src/data/registry/in.
 *
 *  - Collections are rewritten atomically (write to .tmp, rename).
 *  - A timestamped backup of every collection is taken before a run writes.
 *  - Every field change is appended to changelog/<YYYY-MM>.json; nothing is overwritten
 *    without a record of what it was.
 *  - Statistics are append-only.
 */

import fs from "fs";
import path from "path";
import type {
  ChangeRecord,
  RegistryDocument,
  RegistryInsurer,
  RegistryMeta,
  RegistryProduct,
  RegistryStatistic,
  ReviewItem,
  Source,
} from "../../../src/lib/registry/types";

export const REGISTRY_DIR = path.join(process.cwd(), "src/data/registry/in");
export const BACKUP_DIR = path.join(process.cwd(), "data/registry-backups"); // gitignored

function read<T>(file: string, fallback: T): T {
  const p = path.join(REGISTRY_DIR, file);
  return fs.existsSync(p) ? (JSON.parse(fs.readFileSync(p, "utf-8")) as T) : fallback;
}

function writeAtomic(file: string, data: unknown): void {
  const p = path.join(REGISTRY_DIR, file);
  const tmp = `${p}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2) + "\n", "utf-8");
  fs.renameSync(tmp, p);
}

export class RegistryStore {
  meta = read<RegistryMeta>("_meta.json", { schemaVersion: 1, jurisdiction: "in", lastRun: {} });
  sources = read<Source[]>("sources.json", []);
  insurers = read<RegistryInsurer[]>("insurers.json", []);
  products = read<RegistryProduct[]>("products.json", []);
  documents = read<RegistryDocument[]>("documents.json", []);
  statistics = read<RegistryStatistic[]>("statistics.json", []);
  review = read<ReviewItem[]>("review-queue.json", []);
  private changes: ChangeRecord[] = [];
  private dirty = new Set<string>();

  constructor(private job: string) {}

  source(id: string): Source | undefined {
    return this.sources.find((s) => s.id === id);
  }

  record(change: Omit<ChangeRecord, "at" | "job">): void {
    this.changes.push({ at: new Date().toISOString(), job: this.job, ...change });
  }

  upsertInsurer(next: RegistryInsurer): "added" | "updated" | "unchanged" {
    return this.upsert(this.insurers, next, (x) => x.slug, "insurer", "insurers.json");
  }

  upsertProduct(next: RegistryProduct): "added" | "updated" | "unchanged" {
    return this.upsert(this.products, next, (x) => x.slug, "product", "products.json");
  }

  upsertDocument(next: RegistryDocument): "added" | "updated" | "unchanged" {
    return this.upsert(this.documents, next, (x) => x.id, "document", "documents.json");
  }

  /** Remove a document that no longer verifies. The removal is logged. */
  removeDocument(id: string, reason: string): boolean {
    const d = this.documents.find((x) => x.id === id);
    if (!d) return false;
    this.documents = this.documents.filter((x) => x.id !== id);
    this.dirty.add("documents.json");
    this.record({ kind: "document", key: id, field: "*", from: d.url, to: `removed: ${reason}`, sourceUrl: d.provenance.url });
    return true;
  }

  /** Statistics are never updated in place. Same id → unchanged. */
  appendStatistic(next: RegistryStatistic): "added" | "unchanged" {
    if (this.statistics.some((s) => s.id === next.id)) return "unchanged";
    this.statistics.push(next);
    this.dirty.add("statistics.json");
    this.record({ kind: "statistic", key: next.id, field: "*", from: null, to: next.value, sourceUrl: next.provenance.url });
    return "added";
  }

  enqueueReview(item: Omit<ReviewItem, "queuedAt">): void {
    const existing = this.review.findIndex((r) => r.id === item.id);
    const full = { ...item, queuedAt: new Date().toISOString() };
    if (existing >= 0) this.review[existing] = full;
    else this.review.push(full);
    this.dirty.add("review-queue.json");
  }

  clearReview(id: string): void {
    const before = this.review.length;
    this.review = this.review.filter((r) => r.id !== id);
    if (this.review.length !== before) this.dirty.add("review-queue.json");
  }

  markSourcesDirty(): void {
    this.dirty.add("sources.json");
  }

  setRun(summary: string, ok: boolean): void {
    this.meta.lastRun[this.job] = { at: new Date().toISOString(), ok, summary };
    this.dirty.add("_meta.json");
  }

  get pendingChanges(): number {
    return this.changes.length;
  }

  /** Back up, write every dirty collection, append the changelog. */
  commit(): void {
    if (this.dirty.size === 0 && this.changes.length === 0) return;
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const dir = path.join(BACKUP_DIR, stamp);
    fs.mkdirSync(dir, { recursive: true });
    fs.cpSync(REGISTRY_DIR, dir, { recursive: true });
    const payload: Record<string, unknown> = {
      "_meta.json": this.meta,
      "sources.json": this.sources,
      "insurers.json": [...this.insurers].sort((a, b) => a.slug.localeCompare(b.slug)),
      "products.json": [...this.products].sort((a, b) => a.slug.localeCompare(b.slug)),
      "documents.json": [...this.documents].sort((a, b) => a.id.localeCompare(b.id)),
      "statistics.json": this.statistics, // insertion order is history
      "review-queue.json": this.review,
    };
    for (const f of this.dirty) writeAtomic(f, payload[f]);
    if (this.changes.length) {
      // Monthly JSON shards: only .json may live in the registry directory
      // (the Next.js bundler traces it), and shards keep each file bounded.
      const shardDir = path.join(REGISTRY_DIR, "changelog");
      fs.mkdirSync(shardDir, { recursive: true });
      const shard = path.join(shardDir, `${new Date().toISOString().slice(0, 7)}.json`);
      const existing: ChangeRecord[] = fs.existsSync(shard) ? JSON.parse(fs.readFileSync(shard, "utf-8")) : [];
      fs.writeFileSync(shard, JSON.stringify([...existing, ...this.changes], null, 1) + "\n");
    }
    this.changes = [];
    this.dirty.clear();
  }

  private upsert<T extends { updatedAt: string; createdAt: string }>(
    list: T[],
    next: T,
    key: (t: T) => string,
    kind: ChangeRecord["kind"],
    file: string
  ): "added" | "updated" | "unchanged" {
    const k = key(next);
    const i = list.findIndex((x) => key(x) === k);
    const url = sourceUrlOf(next);
    if (i < 0) {
      list.push(next);
      this.dirty.add(file);
      this.record({ kind, key: k, field: "*", from: null, to: "created", sourceUrl: url });
      return "added";
    }
    const prev = list[i];
    const diffs = diffValues(prev, next);
    if (diffs.length === 0) return "unchanged";
    for (const d of diffs) this.record({ kind, key: k, field: d.field, from: d.from, to: d.to, sourceUrl: url });
    list[i] = { ...next, createdAt: prev.createdAt };
    this.dirty.add(file);
    return "updated";
  }
}

function sourceUrlOf(x: unknown): string {
  const o = x as Record<string, unknown>;
  const p = (o.provenance ?? (o.name as { provenance?: unknown } | undefined)?.provenance) as { url?: string } | undefined;
  return p?.url ?? "";
}

const IGNORED = new Set(["updatedAt", "createdAt", "retrievedAt", "lastCheckedAt"]);

/** Field-level diff that ignores fetch timestamps, so a re-run is a no-op. */
export function diffValues(a: unknown, b: unknown, prefix = ""): { field: string; from: unknown; to: unknown }[] {
  if (Object.is(a, b)) return [];
  const isObj = (v: unknown) => v !== null && typeof v === "object" && !Array.isArray(v);
  if (Array.isArray(a) && Array.isArray(b) && a.length === b.length) {
    // Element-wise, so fetch timestamps nested in array items are ignored too.
    return a.flatMap((x, i) => diffValues(x, b[i], `${prefix}[${i}]`));
  }
  if (isObj(a) && isObj(b)) {
    const out: { field: string; from: unknown; to: unknown }[] = [];
    const keys = new Set([...Object.keys(a as object), ...Object.keys(b as object)]);
    for (const key of keys) {
      if (IGNORED.has(key)) continue;
      out.push(
        ...diffValues(
          (a as Record<string, unknown>)[key],
          (b as Record<string, unknown>)[key],
          prefix ? `${prefix}.${key}` : key
        )
      );
    }
    return out;
  }
  if (JSON.stringify(a) === JSON.stringify(b)) return [];
  return [{ field: prefix || "*", from: a, to: b }];
}
