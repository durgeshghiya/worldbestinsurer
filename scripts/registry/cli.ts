#!/usr/bin/env tsx
/**
 * Registry pipeline CLI.
 *
 *   npm run registry -- inspect <url> [--grep "text"]   what the pipeline sees on a page
 *   npm run registry -- ingest [--dry-run] [--only id,id]
 *   npm run registry -- check-sources                   daily: robots + reachability
 *   npm run registry -- check-documents                 weekly: document liveness + changes
 *   npm run registry -- refresh-statistics              monthly: data.gov.in API
 *   npm run registry -- validate                        exit 1 on any registry error
 *   npm run registry -- review [--clear <id|all>]       list or clear the review queue
 *   npm run registry -- quality-report                  writes docs/data-quality-report.md
 *   npm run registry -- seo-audit [--base <url>]        writes docs/seo-audit-report.md
 */

import { runIngest } from "./jobs/ingest";
import { runCheckSources } from "./jobs/check-sources";
import { runCheckDocuments } from "./jobs/check-documents";
import { runRefreshStatistics } from "./jobs/refresh-statistics";
import { runQualityReport } from "./reports/quality-report";
import { runSeoAudit } from "./reports/seo-audit";
import { politeFetch } from "./lib/http";
import { extractPage, norm } from "./lib/text";
import { RegistryStore } from "./lib/store";
import { validateRegistry } from "../../src/lib/registry/validate";

function flag(name: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const has = (name: string) => process.argv.includes(`--${name}`);

async function inspect(url: string): Promise<void> {
  const res = await politeFetch(url);
  if (!res.ok) {
    console.log(`BLOCKED  ${res.reason}  ${res.detail}`);
    process.exitCode = 2;
    return;
  }
  console.log(`OK  HTTP ${res.status}  ${res.contentType}  ${res.body.length} bytes`);
  console.log(`final url: ${res.url}`);
  if (!res.contentType.includes("html")) return;
  const page = extractPage(res.body.toString("utf-8"), res.url);
  console.log(`title: ${page.title}`);
  const grep = flag("grep");
  if (grep) {
    const hay = page.visible;
    const needle = norm(grep);
    const lower = norm(hay);
    let from = 0;
    let hits = 0;
    for (;;) {
      const at = lower.indexOf(needle, from);
      if (at < 0 || hits >= 12) break;
      console.log(`\n[visible #${++hits}] …${hay.slice(Math.max(0, at - 160), at + needle.length + 200)}…`);
      from = at + needle.length;
    }
    if (!hits) {
      const e = norm(page.embedded).indexOf(needle);
      console.log(e >= 0 ? `\n[embedded only] …${page.embedded.slice(Math.max(0, e - 120), e + 200)}…` : "\n(no match)");
    }
  } else {
    console.log(`\nvisible text (first 1500 chars):\n${page.visible.slice(0, 1500)}`);
  }
  const docs = page.links.filter((l) => /\.pdf(\?|$)|brochure|wording|prospectus|policy-document|download/i.test(l.href));
  if (docs.length) {
    console.log(`\ndocument-like links (${docs.length}):`);
    for (const d of docs.slice(0, 40)) console.log(`  ${d.text.slice(0, 60).padEnd(60)}  ${d.href}`);
  }
}

async function main(): Promise<void> {
  const cmd = process.argv[2];
  switch (cmd) {
    case "inspect": {
      const url = process.argv[3];
      if (!url) throw new Error("usage: inspect <url> [--grep text]");
      await inspect(url);
      break;
    }
    case "ingest":
      await runIngest({ dryRun: has("dry-run"), only: flag("only")?.split(",") });
      break;
    case "check-sources":
      await runCheckSources();
      break;
    case "check-documents":
      await runCheckDocuments();
      break;
    case "refresh-statistics":
      await runRefreshStatistics();
      break;
    case "validate": {
      const s = new RegistryStore("validate");
      const issues = validateRegistry(s);
      for (const i of issues) console.log(`${i.level === "error" ? "✗" : "!"} [${i.code}] ${i.message}`);
      const errors = issues.filter((i) => i.level === "error").length;
      console.log(`\n${errors} error(s), ${issues.length - errors} warning(s)`);
      if (errors) process.exitCode = 1;
      break;
    }
    case "review": {
      const s = new RegistryStore("review");
      // --clear <id|all>: the operator has acted on the item (or the candidate
      // was withdrawn). Clearing is recorded like any other change.
      const clear = flag("clear");
      if (clear) {
        const ids = clear === "all" ? s.review.map((r) => r.id) : [clear];
        for (const id of ids) s.clearReview(id);
        await s.commit();
        console.log(`cleared ${ids.length} review item(s)`);
        break;
      }
      if (!s.review.length) console.log("review queue is empty");
      for (const r of s.review) console.log(`- ${r.id}  (${r.kind}, ${r.queuedAt.slice(0, 10)})\n    ${r.reason}`);
      break;
    }
    case "quality-report":
      await runQualityReport();
      break;
    case "seo-audit":
      await runSeoAudit({ base: flag("base") });
      break;
    default:
      console.log(
        "usage: registry <inspect|ingest|check-sources|check-documents|refresh-statistics|validate|review|quality-report|seo-audit>"
      );
      process.exitCode = cmd ? 1 : 0;
  }
}

main().catch((e) => {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
});
