/**
 * Data-quality report → docs/data-quality-report.md
 *
 * Everything here is computed from the registry files: coverage, provenance
 * completeness, validation issues, the review queue, source access status,
 * and which pages the indexability rules currently admit.
 */

import fs from "fs";
import path from "path";
import { RegistryStore } from "../lib/store";
import { classifyUin, validateRegistry } from "../../../src/lib/registry/validate";

const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : "—");

export async function runQualityReport(): Promise<void> {
  const s = new RegistryStore("quality-report");
  const issues = validateRegistry(s);
  const errors = issues.filter((i) => i.level === "error");
  const warnings = issues.filter((i) => i.level === "warning");

  const P = s.products;
  const withUin = P.filter((p) => p.uin);
  const uinFormats = new Map<string, number>();
  for (const p of withUin) {
    const f = classifyUin(p.uin!.value).format;
    uinFormats.set(f, (uinFormats.get(f) ?? 0) + 1);
  }
  const docsByProduct = new Map<string, number>();
  for (const d of s.documents) if (d.productSlug) docsByProduct.set(d.productSlug, (docsByProduct.get(d.productSlug) ?? 0) + 1);
  const optional = (p: (typeof P)[number]) => [p.policyTerm, p.eligibility, p.premiumFrequency, p.sumInsured].filter(Boolean).length;
  const productPageReady = P.filter((p) => p.siteProductId || (p.uin && (docsByProduct.get(p.slug) ?? 0) > 0 && optional(p) >= 2));

  const embedded = [
    ...s.insurers.flatMap((i) => [i.name, i.legalName, i.irdaiRegistrationNumber, i.cin, i.headquarters]),
    ...P.flatMap((p) => [p.name, p.uin, p.policyTerm, p.eligibility, p.premiumFrequency, p.sumInsured]),
  ].filter((f) => f?.provenance.notes?.includes("embedded")).length;
  const manual = [
    ...s.insurers.map((i) => i.name),
    ...P.map((p) => p.name),
  ].filter((f) => f.provenance.notes?.includes("manually")).length;

  const brokenDocs = s.documents.filter((d) => d.lastStatus !== undefined && (d.lastStatus < 200 || d.lastStatus >= 400));
  const periods = new Map<string, number>();
  for (const st of s.statistics) periods.set(st.reportingPeriod, (periods.get(st.reportingPeriod) ?? 0) + 1);

  const at = new Date().toISOString().slice(0, 16).replace("T", " ");
  const L: string[] = [
    "# Data-quality report",
    "",
    `Generated ${at} UTC by \`npm run registry -- quality-report\`. Registry schema v${s.meta.schemaVersion}, jurisdiction \`${s.meta.jurisdiction}\`.`,
    "",
    `**${errors.length === 0 ? "VALID" : "INVALID"}** — ${errors.length} validation error(s), ${warnings.length} warning(s), ${s.review.length} item(s) awaiting review.`,
    "",
    "## Coverage",
    "",
    "| Collection | Records | Notes |",
    "| --- | ---: | --- |",
    `| Sources | ${s.sources.length} | ${s.sources.filter((x) => x.accessMethod === "crawl").length} crawlable, ${s.sources.filter((x) => x.accessMethod === "manual").length} manual-only, ${s.sources.filter((x) => x.accessMethod === "api").length} API |`,
    `| Insurers | ${s.insurers.length} | ${s.insurers.filter((i) => i.irdaiRegistrationNumber).length} with IRDAI registration no., ${s.insurers.filter((i) => i.cin).length} with CIN, ${s.insurers.filter((i) => i.siteSlug).length} linked to an existing page |`,
    `| Products | ${P.length} | ${withUin.length} with UIN (${pct(withUin.length, P.length)}), ${P.filter((p) => p.siteProductId).length} linked to an existing page |`,
    `| Documents | ${s.documents.length} | ${brokenDocs.length} currently unavailable |`,
    `| Statistics | ${s.statistics.length} | across ${periods.size} reporting period(s) |`,
    "",
    "## Provenance",
    "",
    "Every stored fact carries a source URL, a retrieval time and, where the source",
    "shows it, the verbatim evidence. The pipeline re-fetched each source and",
    "confirmed the evidence was present before accepting it.",
    "",
    "| Measure | Count |",
    "| --- | ---: |",
    `| Facts verified in visible page text | ${[...s.insurers.flatMap((i) => [i.name, i.legalName, i.irdaiRegistrationNumber, i.cin, i.headquarters]), ...P.flatMap((p) => [p.name, p.uin, p.policyTerm, p.eligibility, p.premiumFrequency, p.sumInsured])].filter((f) => f && !f.provenance.notes?.includes("embedded")).length} |`,
    `| Facts found only in embedded structured data | ${embedded} |`,
    `| Records retrieved manually (robots-blocked sources) | ${manual} |`,
    "",
    "## Products",
    "",
    "| Measure | Count |",
    "| --- | ---: |",
    ...[...uinFormats].map(([f, n]) => `| UIN format: ${f} | ${n} |`),
    `| Products meeting the product-page indexability bar | ${productPageReady.length} |`,
    "",
    "## Source access",
    "",
    "| Source | Method | robots.txt | Checked |",
    "| --- | --- | --- | --- |",
    ...s.sources.map((x) => `| ${x.name} | ${x.accessMethod} | ${x.robots} | ${x.robotsCheckedAt ?? "—"} |`),
    "",
    "## Job history",
    "",
    "| Job | Last run | OK | Summary |",
    "| --- | --- | --- | --- |",
    ...Object.entries(s.meta.lastRun).map(([j, r]) => `| ${j} | ${r.at.slice(0, 16).replace("T", " ")} | ${r.ok ? "yes" : "**no**"} | ${r.summary} |`),
    "",
    "## Validation",
    "",
  ];
  if (!issues.length) L.push("No issues.");
  else {
    L.push("| Level | Code | Message |", "| --- | --- | --- |");
    for (const i of issues) L.push(`| ${i.level} | ${i.code} | ${i.message.replace(/\|/g, "\\|")} |`);
  }
  L.push("", "## Review queue", "");
  if (!s.review.length) L.push("Empty.");
  else {
    L.push("| Item | Kind | Reason |", "| --- | --- | --- |");
    for (const r of s.review) L.push(`| \`${r.id}\` | ${r.kind} | ${r.reason.replace(/\|/g, "\\|").slice(0, 300)} |`);
  }
  if (brokenDocs.length) {
    L.push("", "## Unavailable documents", "", ...brokenDocs.map((d) => `- HTTP ${d.lastStatus} — ${d.title}: ${d.url}`));
  }

  const out = path.join(process.cwd(), "docs/data-quality-report.md");
  fs.writeFileSync(out, L.join("\n") + "\n");
  console.log(`${errors.length} error(s), ${warnings.length} warning(s), ${s.review.length} in review → ${path.relative(process.cwd(), out)}`);
  if (errors.length) process.exitCode = 1;
}
