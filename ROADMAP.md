# SafeBath — AI Operations Roadmap

Last updated: March 11, 2026

---

## Vision
Use AI to run SafeBath's digital marketing, content, and CRM operations end-to-end — so the business owner can focus on installations while leads, content, and follow-ups run automatically.

---

## Phase 0 — Website Migration ✅ COMPLETE
_Source code extracted from Firebase Studio, connected to GitHub + Vercel_

- [x] Pushed Next.js project from Firebase Studio → GitHub (`RecoveryBiometrics/safebath-website`)
- [x] Cloned repo into `/home/williamcourterwelch/safebath/site/`
- [x] Removed Gemini AI dependency — site builds in seconds with no API keys
- [x] Created `dev` branch — all Claude edits go here, never directly to `main`
- [x] Connected `safebath-website` to Vercel — live at `safebath-website.vercel.app`
- [x] Verified site builds and deploys successfully (1,250 pages)
- [ ] **TODO (User — when ready):** Point `safebathgrabbar.com` DNS to Vercel to go fully live

---

## Phase 1 — SEO Content ✅ COMPLETE (Session 1)
_Based on the 90-day SEO audit in `safebathgrabbar-seo-report.md`_

### New Pages — All Created
| Priority | Page | URL | Status |
|----------|------|-----|--------|
| 1 | Rockville, MD — Grab Bar Installation | `/bathroom-safety-rockville-md/bathroom-grab-bar-installation` | ✅ Live |
| 2 | Lansdale, PA — Stair & ADA Railing | `/bathroom-safety-lansdale-pa/stair-garage-railing-installation` | ✅ Live |
| 3 | Lancaster, PA — Grab Bar Installation | `/bathroom-safety-lancaster-pa/bathroom-grab-bar-installation` | ✅ Live |
| 4 | Bethesda, MD — Grab Bar Installation | `/bathroom-safety-bethesda-md/bathroom-grab-bar-installation` | ✅ Live (auto-generated) |
| 5 | Hub Page — Grab Bar Installation | `/grab-bar-installation/` | ✅ Live |

Also added: Full Montgomery County MD (10 cities) and Lancaster County PA (10 cities) — ~140 new pages total.

### Existing Page Optimizations — All Complete
| Priority | Action | Status |
|----------|--------|--------|
| 1 | Homepage title & meta description | ✅ Done |
| 2 | Key page title/meta overrides (9 pages) | ✅ Done |
| 3 | Add "handicap grab bars" H2 section | ✅ Done (Philadelphia + West Philadelphia) |
| 4 | Add "repair" language to H1/H2 | ✅ Done (Montgomery County railing page) |
| 5 | Fix cannibalization — hub page + internal links | ✅ Done |

---

## Phase 2 — Conversion Optimization ✅ COMPLETE (Session 1)
_Get more calls from existing traffic_

- [x] Add click-to-call button visible on mobile (phone icon always in header)
- [x] Add trust bar to every page: Licensed & Insured | 20 Years Experience | Lifetime Labor Warranty | ADA-Compliant
- [x] Rewrite CTAs: "Call for Same-Week Scheduling" on all pages
- [ ] Add Google review count to meta descriptions — requires collecting reviews first (Phase 5)
- [ ] Lead every page intro with fear-prevention framing — partially done, continue in future sessions

---

## Phase 3 — CRM & Lead Automation (GHL)
_Use the GHL MCP to manage and automate the pipeline_

- [ ] Audit current GHL pipeline stages and contact tagging system
- [ ] Set up lead intake workflow: new contact → auto-tag → follow-up sequence
- [ ] Create email templates for: estimate confirmation, follow-up after estimate, post-install review request
- [ ] Build automation: after job marked complete → send review request SMS/email
- [ ] Create opportunity pipeline: New Lead → Estimate Sent → Booked → Installed → Review Requested
- [ ] Set up calendar availability for estimates and installations

---

## Phase 4 — Social Media & Local Authority
_Use GHL social posting tools_

- [ ] Establish weekly posting cadence: 2–3 posts/week
- [ ] Content types: before/after installs, safety tips, testimonials, service area callouts
- [ ] Create recurring post templates for each service type
- [ ] Post to Google Business Profile, Facebook, Instagram
- [ ] Monthly blog post on safety topics (fall prevention, ADA compliance, aging in place)

---

## Phase 5 — Reputation & Reviews
_Biggest multiplier for local SEO and conversion_

- [ ] Identify all recent customers in GHL
- [ ] Send personalized review request via GHL conversation tools
- [ ] Get to 50+ Google reviews (currently unknown baseline)
- [ ] Add schema markup for reviews to website
- [ ] Add review snippet to meta descriptions

---

## Phase 6 — Automated SEO Agent (Recurring)
_AI agent that monitors, analyzes, and builds autonomously_

Build a recurring AI agent that runs on a weekly, biweekly, or monthly schedule and does the following automatically:

**Step 1 — Pull data**
- Fetch Google Search Console data (impressions, clicks, positions, CTR by page)
- Fetch Google Analytics data (sessions, bounce rate, conversions by page)
- Compare current data to previous period baseline

**Step 2 — Analyze**
- Flag pages dropping in position (need content refresh)
- Surface new keyword opportunities (high impressions, low CTR)
- Identify pages gaining traction that could be expanded
- Check for new location/service combinations worth building

**Step 3 — Build**
- For new pages: add cities/services to `constants.ts`, commit to `dev`, Vercel auto-builds
- For content updates: edit page copy, meta descriptions, H2s directly in code
- For meta updates: update title tags and descriptions for underperforming pages

**Step 4 — Report**
- Send a weekly summary to the owner: what changed, what was built, what to expect

**Prerequisites before building this agent:**
- [ ] Connect Google Search Console API
- [ ] Connect Google Analytics 4 API
- [ ] Set up agent scheduling (cron or loop)
- [ ] Define approval workflow: auto-deploy minor changes, flag major ones for review

---

## Phase 7 — Expansion & Scale
_When core markets are performing_

- [ ] Identify next expansion service areas (Alexandria VA, Baltimore MD suburbs)
- [ ] Add real local content to highest-traffic city pages (replace Gemini filler with genuine copy)
- [ ] Explore paid search (Google Local Services Ads) as complement to organic
- [ ] Create a referral program for occupational therapists and home health agencies

---

## Future — Add Real Local Content to City Pages
_High SEO value. Do after Phase 6 agent is running._

The "Discover [City]" sections were removed when Gemini was cut. Replace with real, hand-written local copy for top-traffic cities first (West Chester, Wilmington, Lansdale, Philadelphia).

- Each city gets 2-3 genuine sentences + 2-3 real landmarks
- Content goes into `site/src/lib/constants.ts` — pages pick it up automatically
- Start with cities that already rank on page 1-2

---

## Notes & Decisions Log
- SEO baseline (Dec 2025 – Mar 2026): 57 clicks, 3,548 impressions, 1.6% CTR, avg pos 27.9
- Gemini AI removed from build — no longer needed, no API key required
- Vercel preview URL: `https://safebath-website.vercel.app`
- GitHub repo: `https://github.com/RecoveryBiometrics/safebath-website`
- All Claude edits go to `dev` branch → merge to `main` to deploy
- GHL Location ID: `VL5PlkLBYG4mKk3N6PGw`
- Phone: (610) 840-6371 | Pricing: $199 first bar, $99 each additional
