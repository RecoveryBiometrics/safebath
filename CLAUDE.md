# SafeBath Workspace — Claude Context

> This file is auto-loaded at the start of every Claude session. Always read this first.

---

## The Business
- **Company:** SafeBath Grab Bar
- **Website:** https://safebathgrabbar.com ← LIVE on this domain as of March 11, 2026
- **Phone (PA/DE/MD):** (610) 840-6371
- **Phone (Las Vegas NV):** (725) 425-7383
- **Phone (Myrtle Beach SC):** (854) 246-2882
- **Service Area:** PA, DE, MD, NV, SC — suburban Philadelphia, Wilmington DE, Lancaster PA, suburban MD, Las Vegas NV metro, Myrtle Beach SC area
- **Core Services:** Grab bar installation, shower safety handles, bathtub rails, toilet grab bars, stair/garage railing installation, accessible shower seats
- **Differentiators:** 20+ years experience, ADA-compliant, lifetime labor warranty, same-week scheduling, starts at $199

---

## Current State (as of March 13, 2026)
- **Site is live** at safebathgrabbar.com — DNS pointed from Firebase to Vercel
- **1,427 pages** deployed and indexed
- **Phases 0, 1, 2, 2.5, and Phase 8 (initial) complete** — see ROADMAP.md for full detail
- **National expansion started:** Las Vegas NV (Clark County, 10 cities) and Myrtle Beach SC (Horry County, 10 cities) live with market-specific phone numbers
- **SEO Agent live:** running weekly Tuesdays 9am ET via GitHub Actions

---

## What's Running in the Background
| System | Status | What It Does |
|--------|--------|--------------|
| Vercel | ✅ Live | Auto-deploys `main` branch on every push. Preview URL per branch. |
| GitHub Actions | ✅ Live | Weekly SEO report every Tuesday 9am ET |
| GHL MCP | ✅ Connected | CRM, conversations, social posting, email templates |
| SEO Agent | ✅ Live | Monitors Search Console, generates weekly reports to `seo-reports/` |
| Gmail API | ✅ Connected | Send emails via gcloud ADC — daily reports, SEO reports, notifications |
| gcloud CLI | ✅ Authenticated | `williamcourterwelch@gmail.com` — Gmail, Search Console, GBP APIs |

---

## Website Code
- **GitHub:** https://github.com/RecoveryBiometrics/safebath-website
- **Local clone:** `/home/williamcourterwelch/safebath/site/`
- **Active branch:** `dev` — ALL edits go here. Never commit directly to `main`.
- **Deploy flow:** Edit → commit to `dev` → verify Vercel preview → merge to `main` → auto-deploys live

### Stack
- Next.js 15 (App Router) + Tailwind CSS + shadcn/ui
- No AI dependencies — Gemini removed March 2026
- Static generation: 1,427 pages pre-built at deploy time
- Sitemap: auto-generated from `constants.ts` at `/sitemap.xml`
- robots.txt: auto-generated, allows all crawlers
- llms.txt: at `/llms.txt` — helps AI models understand the business

### Key Files in the Site
| File | Purpose |
|------|---------|
| `site/src/lib/constants.ts` | All locations, services, and business info — the single source of truth |
| `site/src/app/[location]/page.tsx` | Dynamic city + county pages |
| `site/src/app/[location]/[service]/page.tsx` | Dynamic city + service pages |
| `site/src/app/grab-bar-installation/page.tsx` | Hub page for generic grab bar queries |
| `site/src/app/layout.tsx` | Root layout — Header, Footer, global styles |
| `site/src/components/Header.tsx` | Trust bar + click-to-call + nav |
| `site/src/app/sitemap.ts` | Auto-generates sitemap from all locations |
| `site/src/app/robots.ts` | robots.txt |
| `site/public/llms.txt` | AI model discovery file |

### How to Add a New City
1. Open `site/src/lib/constants.ts`
2. Add city to the appropriate county in `COUNTIES_AND_LOCATIONS`
3. Commit to `dev` — all service pages generate automatically

### URL Pattern
- City + service: `/bathroom-safety-{city}-{state}/{service-slug}`
- County + service: `/bathroom-safety-{county}-{state}/{service-slug}`
- Example: `/bathroom-safety-rockville-md/bathroom-grab-bar-installation`

---

## GHL (GoHighLevel CRM)
- **MCP Server:** `ghl-safebath`
- **Location ID:** `VL5PlkLBYG4mKk3N6PGw`
- Always use GHL MCP tools — never raw API calls
- Capabilities: contacts, conversations, blogs, social media, email templates, calendars, opportunities, payments

---

## Working Conventions
- Phone in all content: **(610) 840-6371** — always tappable `<a href="tel:+16108406371">`
- Pricing: $199 first bar · $99 each additional (same visit)
- CTA text: "Call for Same-Week Scheduling"
- Trust signals: Licensed & Insured | 20 Years Experience | Lifetime Labor Warranty | ADA-Compliant
- Brand voice: direct, trust-building, safety-focused, local — lead with fear prevention not features
- Do not invent testimonials — use placeholders if real ones aren't available
- All website edits: commit to `dev`, never `main`

---

## Key Workspace Files
| File | Purpose |
|------|---------|
| `CLAUDE.md` | This file — auto-loaded context for Claude |
| `AGENT.md` | Onboarding doc for any AI agent |
| `ROADMAP.md` | Full execution plan with completed/pending items |
| `safebathgrabbar-seo-report.md` | 90-day SEO audit, page drafts, title/meta strategy |
| `memory/MEMORY.md` | Claude's persistent notes across sessions |
| `SEO-CHANGELOG.md` | Every SEO change with deploy date + when to check results — **read before making SEO changes** |
