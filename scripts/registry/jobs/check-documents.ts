/**
 * Weekly: confirm every official document is still served, and detect
 * documents the insurer changed without changing the URL (content hash).
 * A broken or changed document goes to the review queue; it is not deleted.
 */

import { politeFetch } from "../lib/http";
import { JobLog } from "../lib/log";
import { RegistryStore } from "../lib/store";

export async function runCheckDocuments(): Promise<void> {
  const log = new JobLog("check-documents");
  const store = new RegistryStore("check-documents");
  let ok = 0;
  let broken = 0;
  let changed = 0;

  for (const d of store.documents) {
    const res = await politeFetch(d.url);
    const at = new Date().toISOString();
    if (!res.ok) {
      broken++;
      log.warn("document-unavailable", { id: d.id, url: d.url, reason: res.detail });
      if (d.lastStatus !== res.status) {
        store.upsertDocument({ ...d, lastStatus: res.status ?? 0, lastCheckedAt: at, updatedAt: at });
      }
      store.enqueueReview({
        id: `document:${d.id}`,
        kind: "document",
        reason: `document no longer available (${res.reason}: ${res.detail}) — ${d.url}`,
        candidate: d,
      });
      continue;
    }
    const contentType = res.contentType.split(";")[0].trim();
    const isDoc = /^application\/(pdf|msword|vnd\.openxmlformats-officedocument|vnd\.ms-excel)/.test(contentType) &&
      !(contentType === "application/pdf" && res.body.subarray(0, 5).toString("latin1") !== "%PDF-");
    if (!isDoc) {
      broken++;
      log.warn("document-not-a-file", { id: d.id, url: d.url, contentType });
      store.enqueueReview({
        id: `document:${d.id}`,
        kind: "document",
        reason: `URL now serves ${contentType || "an unknown type"} instead of a document — ${d.url}`,
        candidate: d,
      });
      continue;
    }
    let volatile = d.volatile ?? false;
    if (!volatile && d.contentHash && d.contentHash !== res.sha256) {
      // Distinguish an edited file from one the server regenerates per request.
      const again = await politeFetch(d.url);
      if (again.ok && again.sha256 !== res.sha256) {
        volatile = true;
        log.info("document-volatile", { id: d.id, url: d.url });
      }
    }
    if (!volatile && d.contentHash && d.contentHash !== res.sha256) {
      changed++;
      log.warn("document-changed", { id: d.id, url: d.url });
      store.enqueueReview({
        id: `document:${d.id}`,
        kind: "document",
        reason: `document content changed at the same URL — check whether product facts changed: ${d.url}`,
        candidate: d,
      });
    } else {
      ok++;
      store.clearReview(`document:${d.id}`);
    }
    store.upsertDocument({
      ...d,
      lastStatus: res.status,
      volatile: volatile || undefined,
      contentHash: volatile ? undefined : res.sha256,
      lastCheckedAt: at,
      updatedAt: at,
    });
  }
  store.setRun(`${ok} ok, ${changed} changed, ${broken} unavailable`, broken === 0);
  store.commit();
  log.info("done", { ok, changed, broken });
}
