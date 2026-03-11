# Agent Context — SafeBath Grab Bar Operations Workspace

> Read this before taking any action. This file orients any AI agent dropped into this workspace.

---

## Business
- **Client:** SafeBath Grab Bar
- **Website:** https://safebathgrabbar.com (LIVE — pointed to Vercel as of March 11, 2026)
- **Phone:** (610) 840-6371
- **Industry:** Home safety installation — grab bars, railings, ADA accessibility
- **Service Area:** PA, DE, MD — suburban Philadelphia, Wilmington DE, Lancaster PA, Montgomery County MD
- **Pricing:** $199 first grab bar · $99 each additional · Railings: free estimate

---

## What's Been Built (Session 1 — March 11, 2026)
- Website migrated from Firebase Studio → GitHub → Vercel
- 1,250 pages live including ~150 new location+service pages
- Phases 0 (migration), 1 (SEO), and 2 (conversion) complete
- See ROADMAP.md for full detail

---

## Systems Running
| System | What It Does |
|--------|-------------|
| **Vercel** | Hosts safebathgrabbar.com. Auto-deploys `main` branch. Preview URL per `dev` branch push. |
| **GitHub** | Version control. Repo: `RecoveryBiometrics/safebath-website`. Branch: `dev` for edits, `main` for live. |
| **GHL MCP** | CRM + marketing platform. Use `ghl-safebath` MCP tools for all CRM operations. |
| **SEO Agent** | Not built yet — planned for Phase 6. Will monitor Search Console + Analytics and auto-build content. |

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
- To add cities: edit `site/src/lib/constants.ts` → commit to `dev`
- To add pages: create in `site/src/app/` → commit to `dev`
- Never commit to `main` directly

---

## Current Priorities (What To Do Next)
1. **Real local content** — write genuine copy for West Chester, Wilmington, Lansdale, Philadelphia in `constants.ts`
2. **Review collection** — use GHL to identify past customers and send review requests
3. **Social posting** — establish weekly cadence via GHL social tools
4. **SEO agent** — connect Google Search Console API, build recurring monitor

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
| `ROADMAP.md` | Full phased plan — completed and pending |
| `safebathgrabbar-seo-report.md` | SEO audit, page drafts, keyword strategy |
| `site/src/lib/constants.ts` | All locations, services, business info |
| `memory/MEMORY.md` | Claude's persistent session notes |
