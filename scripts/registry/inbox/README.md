# Registry inbox

Every fact enters the registry from here. A file in this folder holds one
**candidate** or an array of them (see `../sources/candidate.ts`). A candidate
is a claim: the ingest job fetches the source itself and accepts a fact only if
its `evidence` is on that page and its `value` is inside the evidence.

```bash
npm run registry -- inspect <url> --grep "UIN"   # see what the pipeline sees
npm run registry:ingest -- --dry-run             # verify without writing
npm run registry:ingest                          # verify and write
npm run registry -- review                       # what was held, and why
```

## Rules

- Quote evidence verbatim from the page, 400 characters at most.
- Short identifiers need their label in the evidence: `Regn. No. 512`, `UIN: 512N279V02`.
- Never type a value you did not read on the source page. There is no field
  for a guess; leave it out and the site shows "Not available in the current
  public data."
- Documents must be linked from the candidate's `url` and must respond 2xx.
- `siteSlug` / `siteProductId` must equal `slug` so a record keeps one URL.

## Sources that forbid crawling

IRDAI (`robots.txt: Disallow: /`) and insurers whose robots.txt answers 403 are
`manual` sources. The pipeline will not fetch them. A person may download the
published page or file, save it under `files/`, and set `localFile`; `url`
stays the official address it came from. PDFs must be saved as a `.txt` export.

## Approving a held candidate

`approvals.json` maps a candidate id to the warning codes a person has
reviewed and accepted, e.g.

```json
{ "max-life-identity": ["name-changed"] }
```

Errors cannot be approved — fix the candidate instead.
