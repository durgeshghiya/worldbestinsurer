# Zura — Future Roadmap

## Current State (MVP)
- Informational comparison platform
- Static JSON data
- Educational content
- Lead capture / waitlist
- No regulated activity

---

## Phase 1 — Content & Data Expansion (0-3 months)
- [ ] Expand to 50+ products across all categories
- [ ] Add critical illness, super top-up, group health categories
- [ ] Build blog CMS (headless CMS integration — Sanity/Strapi)
- [ ] Publish 20+ educational articles with SEO optimization
- [ ] Add premium calculator (illustrative, with clear disclaimers)
- [ ] Implement newsletter backend (SendGrid/Resend)
- [ ] Add search functionality across products and articles
- [ ] Implement product filtering UI (age, budget, features)
- [ ] Verify data — move products from "medium" to "high" confidence

## Phase 2 — IRDAI Licensing (3-6 months)
- [ ] Apply for IRDAI Web Aggregator registration OR Insurance Broker license
  - **Web Aggregator:** Allows comparison + lead forwarding to insurers
  - **Insurance Broker:** Allows advisory + policy facilitation
- [ ] Capital requirements: ~Rs 50L (web aggregator) or Rs 5Cr+ (broker)
- [ ] Compliance infrastructure: CKYC, data security audit, grievance officer
- [ ] Legal documentation and IRDAI submissions

## Phase 3 — Licensed Platform (6-12 months)
*After licence/registration is obtained:*
- [ ] Enable "Get Quote" functionality via insurer APIs
- [ ] Real-time premium comparison engine
- [ ] Personalized recommendations based on user profile
- [ ] Policy purchase facilitation (if broker license)
- [ ] Lead routing to insurer partners (if web aggregator)
- [ ] Commission/revenue integration

## Phase 4 — Full Platform (12-18 months)
- [ ] **Quote Engine:** Real-time quotes from multiple insurers via API integration
- [ ] **Policy Issuance:** End-to-end purchase flow (with broker license)
- [ ] **Claims Support:** Claim filing assistance, status tracking
- [ ] **CRM Integration:** Broker/advisor CRM for managing client relationships
- [ ] **Advisor Dashboard:** For licensed advisors/POSPs on the platform
- [ ] **Admin Panel:** Content management, data management, user management
- [ ] **Analytics Stack:** Business analytics, conversion tracking, user behavior

## Phase 5 — Scale (18-24 months)
- [ ] **Mobile App:** React Native or Flutter
- [ ] **AI Recommendations:** ML-powered plan matching
- [ ] **Policy Vault:** Digital locker for policy documents
- [ ] **Renewal Reminders:** Automated alerts for upcoming renewals
- [ ] **Family Coverage Optimizer:** Analyze gaps across family's insurance
- [ ] **Multi-language Support:** Hindi, regional languages
- [ ] **Insurer Partner Portal:** For insurers to manage products and data
- [ ] **API Platform:** Open API for other fintechs to use comparison data

## Technical Evolution Path

### Data Layer
```
Current: Static JSON files
→ Next: PostgreSQL/Supabase + Admin UI
→ Then: Insurer API integrations for real-time data
→ Scale: Data pipeline with automated ingestion + verification
```

### Backend
```
Current: Next.js SSG (no backend)
→ Next: Next.js API routes + database
→ Then: Dedicated API service (Node.js/Python)
→ Scale: Microservices (quote engine, CRM, payments)
```

### Auth
```
Current: None
→ Next: Email-based auth for saved comparisons
→ Then: Full auth (Google, phone OTP)
→ Scale: KYC integration for policy purchase
```

### Deployment
```
Current: Vercel static
→ Next: Vercel with serverless functions
→ Then: AWS/GCP with managed services
→ Scale: Multi-region for performance
```

## Key Risks & Mitigations
| Risk | Mitigation |
|------|-----------|
| IRDAI license delay | Build content and user base meanwhile |
| Data accuracy | Confidence scoring, verification workflow, user reports |
| Legal exposure | Strong disclaimers, legal review, compliance-first design |
| Competition from Policybazaar etc. | Focus on transparency, education, user trust |
| Insurer API access | Start with manual data, build relationships, negotiate access |
