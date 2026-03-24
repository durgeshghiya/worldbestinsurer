# Zura — Insurance Comparison Platform for India

A premium, compliance-first insurance comparison and education platform built for Indian consumers. Compare health, term life, motor, and travel insurance plans across India's leading insurers.

## Live Features

- **4 insurance categories** — Health, Term Life, Motor, Travel
- **17 product listings** from 12 insurers
- **Side-by-side comparison tables** with interactive selection
- **Product detail pages** with inclusions, exclusions, features, and source links
- **Insurer directory** with profiles and key metrics
- **Educational content** — 8 guide topics covering insurance fundamentals
- **Lead capture** — Waitlist and contact forms
- **Full legal pages** — Disclaimer, Privacy Policy, Terms of Use
- **Data methodology page** — Transparency on sourcing and verification
- **Mobile-responsive** — Works on all screen sizes
- **SEO-optimized** — Metadata on all pages

## Compliance

This platform is designed as an **informational and educational** website. It does NOT:
- Sell or facilitate insurance purchases
- Claim to be an IRDAI-licensed broker or web aggregator
- Provide personalized insurance advice
- Collect premiums or process transactions

All product data is sourced from publicly available information and marked with confidence scores. See `/disclaimer` and `/methodology` for details.

## Tech Stack

- **Next.js 16** (App Router, Static Site Generation)
- **TypeScript**
- **Tailwind CSS v4**
- **Lucide React** (icons)
- **JSON data files** (migration-ready to database)

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

```
zura/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Homepage
│   │   ├── compare/[category]/ # Category comparison pages
│   │   ├── product/[id]/       # Product detail pages
│   │   ├── insurers/           # Insurer directory
│   │   ├── learn/              # Educational content
│   │   ├── about/              # About Zura
│   │   ├── disclaimer/         # Legal pages
│   │   ├── contact/            # Contact form
│   │   ├── waitlist/           # Waitlist signup
│   │   └── methodology/        # Data methodology
│   ├── components/             # Reusable components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── CategoryCard.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ComparisonTable.tsx
│   │   └── WaitlistForm.tsx
│   ├── lib/                    # Utilities and data access
│   │   ├── data.ts             # Data loading and helpers
│   │   └── types.ts            # TypeScript interfaces
│   └── data/                   # JSON data files
│       ├── health-insurance.json
│       ├── term-life-insurance.json
│       ├── motor-insurance.json
│       ├── travel-insurance.json
│       └── insurers.json
├── data/                       # Raw/processed data (source of truth)
│   ├── raw/
│   ├── processed/
│   ├── verified/
│   ├── unverified/
│   └── field-dictionary.json
├── research/                   # Research outputs
│   ├── compliance-note.md
│   ├── competitor-analysis.md
│   └── source-registry.md
├── docs/                       # Documentation
│   ├── project-plan.md
│   ├── future-roadmap.md
│   └── data-update-workflow.md
└── legal/                      # Legal document drafts
```

## Data Management

Product data is stored in JSON files under `src/data/`. To update:

1. Edit the relevant JSON file
2. Run `npm run build` to regenerate pages
3. Deploy

See `docs/data-update-workflow.md` for detailed process.

## Deployment

This site is optimized for **Vercel** deployment:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Or deploy to any static hosting by running `npm run build` and serving the `.next` output.

## Documentation

- [Project Plan](docs/project-plan.md)
- [Future Roadmap](docs/future-roadmap.md)
- [Data Update Workflow](docs/data-update-workflow.md)
- [Field Dictionary](data/field-dictionary.json)

## Future Roadmap

This MVP is designed to evolve into a fully licensed insurance platform:

1. **Content expansion** — More products, articles, calculators
2. **IRDAI licensing** — Web Aggregator or Broker registration
3. **Real-time quotes** — Insurer API integrations
4. **Policy issuance** — End-to-end purchase flow
5. **Advisory tools** — Personalized recommendations
6. **Mobile app** — React Native / Flutter

See `docs/future-roadmap.md` for the full roadmap.

## License

Proprietary. All rights reserved.
