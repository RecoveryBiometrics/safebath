# Agent Context — SafeBath Grab Bar Operations Workspace

> Read this before taking any action. This file orients any AI agent dropped into this workspace.

---

## Business
- **Client:** SafeBath Grab Bar
- **Website:** https://safebathgrabbar.com (LIVE — pointed to Vercel)
- **Phone (PA/DE/MD):** (610) 840-6371
- **Phone (Las Vegas NV):** (725) 425-7383
- **Phone (Myrtle Beach SC):** (854) 246-2882
- **Industry:** Home safety installation — grab bars, railings, ADA accessibility
- **Service Area:** PA, DE, MD, NV, SC — suburban Philadelphia, Wilmington DE, Lancaster PA, suburban MD, Las Vegas NV metro, Myrtle Beach SC area
- **Pricing:** $199 first grab bar · $99 each additional · Railings: free estimate

---

## What's Been Built (as of March 16, 2026)
- Website migrated from Firebase Studio → GitHub → Vercel
- 1,427 pages live including ~150 new location+service pages
- Phases 0 (migration), 1 (SEO), 2 (conversion), 2.5 (technical SEO), 5.1 (content pipeline), and Phase 8 initial (national expansion) complete
- National expansion: Las Vegas NV (10 cities) + Myrtle Beach SC (10 cities) live
- See ROADMAP.md for full detail

---

## Systems Running
| System | What It Does |
|--------|-------------|
| **Vercel** | Hosts safebathgrabbar.com. Auto-deploys `main` branch. Preview URL per `dev` branch push. |
| **GitHub (website)** | `RecoveryBiometrics/safebath-website`. Branch: `dev` for edits, `main` for live. |
| **GitHub (workspace)** | `RecoveryBiometrics/safebath`. SEO agent, roadmap, docs. |
| **GHL MCP** | CRM + marketing platform. Use `ghl-safebath` MCP tools for all CRM operations. |
| **SEO Agent** | LIVE — weekly Tuesdays 9am ET. Monitors Search Console, generates reports to `seo-reports/`. |
| **Content Pipeline** | LIVE — daily 6am ET. Scrapes local events, writes articles, commits to main, Vercel auto-deploys. Lives in `safebath-website` repo at `scripts/content-pipeline/`. |
| **Gmail API** | Connected via gcloud ADC. Sends from `williamcourterwelch@gmail.com`. |

---

## Tools Available
### GHL MCP Server (`ghl-safebath`) — Location ID: `VL5PlkLBYG4mKk3N6PGw`
| Tool Category | What You Can Do |
|---------------|-----------------|
| `contacts_*` | Get, create, update contacts; add/remove tags |
| `conversations_*` | Search conversations; send messages |
| `opportunities_*` | View and update the sales pipeline |
| `calendars_*` | View calendar events and appointment notes |
| `blogs_*` | Create, update, publish blog posts |
| `social-media-posting_*` | Create and schedule social posts |
| `emails_*` | Create and fetch email templates |
| `payments_*` | View orders and transactions |
| `locations_*` | Get location info and custom fields |

### Website Code
- Local path: `/home/williamcourterwelch/safebath/site/`
- Stack: Next.js 15 + Tailwind + shadcn/ui
- To add cities: edit `site/src/lib/constants.ts` AND `site/scripts/content-pipeline/cities-data.json` → commit to `dev`
- To add pages: create in `site/src/app/` → commit to `dev`
- Never commit to `main` directly

---

## Brand Voice & Rules
- Lead with fear prevention: "Don't wait for a fall" beats "We install grab bars"
- Phone number always tappable: `<a href="tel:+16108406371">(610) 840-6371</a>`
- Trust signals: Licensed & Insured | 20 Years | Lifetime Labor Warranty | ADA-Compliant
- CTA text: "Call for Same-Week Scheduling"
- No invented testimonials — use placeholders
- All code changes: `dev` branch only

---

## Key Files
| File | Purpose |
|------|---------|
| `CLAUDE.md` | Detailed Claude context (auto-loaded) |
| `AGENT.md` | This file — onboarding for any AI agent |
| `ROADMAP.md` | Full phased plan — completed and pending |
| `SEO-CHANGELOG.md` | Every SEO change with deploy date + when to check results |
| `safebathgrabbar-seo-report.md` | SEO audit, page drafts, keyword strategy |
| `site/src/lib/constants.ts` | All locations, services, business info |
| `memory/MEMORY.md` | Claude's persistent session notes |
