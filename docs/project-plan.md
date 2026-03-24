# Zura — Project Plan

## Overview
Zura is an informational insurance comparison and education platform for Indian consumers. This MVP focuses on enabling users to explore and compare insurance products across four categories: health, term life, motor, and travel insurance.

## Tech Stack
- **Framework:** Next.js 16 (App Router, static generation)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Data Store:** Local JSON files (migration-ready)
- **Deployment:** Vercel / any static hosting

## Architecture
- Static Site Generation (SSG) for performance and SEO
- JSON data files in `src/data/` for easy updates
- Reusable components for product cards, comparison tables, forms
- SEO metadata on all pages
- Mobile-first responsive design

## Phases Executed

### Phase 1 — Research & Compliance
- Regulatory landscape analysis (IRDAI framework)
- Compliance note with what site can/cannot do
- Competitor analysis (Policybazaar, Ditto, Coverfox, etc.)
- Data source registry

### Phase 2 — Data Collection
- Health insurance: 6 products from 6 insurers
- Term life insurance: 5 products from 5 insurers
- Motor insurance: 3 products from 3 insurers
- Travel insurance: 3 products from 3 insurers
- Insurer directory: 12 insurers
- All data sourced from public product pages (medium confidence)

### Phase 3 — Data Structure
- Field dictionary defining all data fields
- Normalized JSON datasets per category
- Insurer master dataset
- Confidence scoring system (high/medium/low)

### Phase 4 — Website Build
- Homepage with category navigation and waitlist
- 4 category comparison pages with interactive comparison tables
- 17 product detail pages
- Insurer directory page
- Learn/education page with 8 article previews
- About page
- Disclaimer/Privacy/Terms page
- Contact page with forms
- Waitlist/early access page
- Data methodology page

## Assumptions
1. All data is from publicly available sources and marked as "medium" confidence until manually verified
2. Premium figures are illustrative and clearly disclaimed
3. No IRDAI registration is currently held — all content is educational/informational
4. Insurer logos are NOT used to avoid trademark issues
5. No "buy now" or policy purchase functionality
6. Lead capture is limited to waitlist/notification signup

## Compliance Considerations
- Every page with product data has a disclaimer
- Footer contains a permanent disclaimer
- No claim of being a licensed broker/aggregator
- Premium figures marked as illustrative
- Clear separation between "informational" and "transactional" features
- About page explicitly states what Zura is and is not
- Full legal notices page with regulatory disclaimer, privacy policy, terms
