# Data Update Workflow

## Adding a New Product

1. **Research** — Visit the insurer's official product page
2. **Create entry** — Add a new object to the relevant JSON file in `src/data/`
3. **Fill all fields** — Use the field dictionary (`data/field-dictionary.json`) as reference
4. **Set confidence** — "high" only if verified from policy wording, "medium" for product page data, "low" for secondary sources
5. **Set lastVerified** — Today's date
6. **Add notes** — Any assumptions or caveats
7. **Rebuild** — Run `npm run build` to regenerate static pages
8. **Review** — Check the new product page renders correctly

## Updating Existing Data

1. **Identify source** — Go to the insurer's official page
2. **Compare** — Check if data has changed
3. **Update** — Modify the JSON entry
4. **Update lastVerified** — Set to today's date
5. **Update confidenceScore** — Adjust if verification level changed
6. **Rebuild** — Run `npm run build`

## Adding a New Insurer

1. Add entry to `src/data/insurers.json`
2. Add products to the relevant category JSON file(s)
3. Rebuild

## Verification Checklist

For each product, verify against official source:
- [ ] Product name matches official name
- [ ] Sum insured range is current
- [ ] Eligibility criteria (age) is current
- [ ] Key inclusions are accurate
- [ ] Key exclusions are accurate
- [ ] Waiting periods (health) are accurate
- [ ] Riders listed are available
- [ ] Special features are current
- [ ] Source URL is valid and accessible
- [ ] Premium range (if shown) matches public calculator

## Data File Locations

| File | Content |
|------|---------|
| `src/data/health-insurance.json` | Health insurance products |
| `src/data/term-life-insurance.json` | Term life insurance products |
| `src/data/motor-insurance.json` | Motor insurance products |
| `src/data/travel-insurance.json` | Travel insurance products |
| `src/data/insurers.json` | Insurer directory |
| `data/field-dictionary.json` | Field definitions and types |
