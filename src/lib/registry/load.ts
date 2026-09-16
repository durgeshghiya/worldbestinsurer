/**
 * Registry loader — the only code that reads src/data/registry/.
 *
 * Pages and API routes go through this module, never the files, so the
 * storage can move to a database later without touching them (plan §4).
 *
 * Loaded once per process and indexed. The registry is validated on load:
 * any error fails the build, because invalid data must not reach a page.
 * Warnings pass and are surfaced in the data-quality report.
 */

import fs from "fs";
import path from "path";
import type {
  Registry,
  RegistryDocument,
  RegistryInsurer,
  RegistryMeta,
  RegistryProduct,
  RegistryStatistic,
  Source,
} from "./types";
import { REGISTRY_SCHEMA_VERSION } from "./types";
import { validateRegistry, type Issue } from "./validate";

export const REGISTRY_DIR = path.join(process.cwd(), "src/data/registry/in");

function readCollection<T>(file: string, fallback: T): T {
  const p = path.join(REGISTRY_DIR, file);
  if (!fs.existsSync(p)) return fallback;
  return JSON.parse(fs.readFileSync(p, "utf-8")) as T;
}

export interface LoadedRegistry extends Registry {
  issues: Issue[];
  sourceById: Map<string, Source>;
  insurerBySlug: Map<string, RegistryInsurer>;
  insurerBySiteSlug: Map<string, RegistryInsurer>;
  productBySlug: Map<string, RegistryProduct>;
  productBySiteId: Map<string, RegistryProduct>;
  productsByInsurer: Map<string, RegistryProduct[]>;
  documentsByInsurer: Map<string, RegistryDocument[]>;
  documentsByProduct: Map<string, RegistryDocument[]>;
  statisticsByInsurer: Map<string, RegistryStatistic[]>;
}

let cache: LoadedRegistry | null = null;

function group<T>(items: T[], key: (t: T) => string | undefined): Map<string, T[]> {
  const m = new Map<string, T[]>();
  for (const it of items) {
    const k = key(it);
    if (!k) continue;
    const arr = m.get(k);
    if (arr) arr.push(it);
    else m.set(k, [it]);
  }
  return m;
}

export function loadRegistry(): LoadedRegistry {
  if (cache) return cache;

  const meta = readCollection<RegistryMeta>("_meta.json", {
    schemaVersion: REGISTRY_SCHEMA_VERSION,
    jurisdiction: "in",
    lastRun: {},
  });
  if (meta.schemaVersion !== REGISTRY_SCHEMA_VERSION) {
    throw new Error(
      `Registry schema is v${meta.schemaVersion}, code expects v${REGISTRY_SCHEMA_VERSION}. ` +
        `Run the migration in scripts/registry/migrations/ before building.`
    );
  }

  const registry: Registry = {
    meta,
    sources: readCollection<Source[]>("sources.json", []),
    insurers: readCollection<RegistryInsurer[]>("insurers.json", []),
    products: readCollection<RegistryProduct[]>("products.json", []),
    documents: readCollection<RegistryDocument[]>("documents.json", []),
    statistics: readCollection<RegistryStatistic[]>("statistics.json", []),
  };

  const issues = validateRegistry(registry);
  const errors = issues.filter((i) => i.level === "error");
  if (errors.length > 0) {
    throw new Error(
      `Registry failed validation with ${errors.length} error(s):\n` +
        errors.slice(0, 20).map((e) => `  - [${e.code}] ${e.message}`).join("\n")
    );
  }

  cache = {
    ...registry,
    issues,
    sourceById: new Map(registry.sources.map((s) => [s.id, s])),
    insurerBySlug: new Map(registry.insurers.map((i) => [i.slug, i])),
    insurerBySiteSlug: new Map(
      registry.insurers.filter((i) => i.siteSlug).map((i) => [i.siteSlug as string, i])
    ),
    productBySlug: new Map(registry.products.map((p) => [p.slug, p])),
    productBySiteId: new Map(
      registry.products.filter((p) => p.siteProductId).map((p) => [p.siteProductId as string, p])
    ),
    productsByInsurer: group(registry.products, (p) => p.insurerSlug),
    documentsByInsurer: group(registry.documents, (d) => d.insurerSlug),
    documentsByProduct: group(registry.documents, (d) => d.productSlug),
    statisticsByInsurer: group(registry.statistics, (s) => s.insurerSlug),
  };
  return cache;
}

/** For the pipeline and tests: drop the in-process cache. */
export function resetRegistryCache(): void {
  cache = null;
}
