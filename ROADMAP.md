# SafeBath — AI Operations Roadmap

Last updated: March 11, 2026

---

## Vision
Use AI to run SafeBath's digital marketing, content, and CRM operations end-to-end — so the business owner can focus on installations while leads, content, and follow-ups run automatically.

---

# ✅ COMPLETED

## Phase 0 — Website Migration
_Source code extracted from Firebase Studio, connected to GitHub + Vercel_

- [x] Pushed Next.js project from Firebase Studio → GitHub (`RecoveryBiometrics/safebath-website`)
- [x] Cloned repo into `/home/williamcourterwelch/safebath/site/`
- [x] Removed Gemini AI dependency — site builds in seconds, no API keys needed
- [x] Created `dev` branch — all Claude edits go here, never directly to `main`
- [x] Connected `safebath-website` to Vercel
- [x] Added `robots.txt` — search engines can now crawl everything
- [x] Added `llms.txt` — AI models can now understand the business
- [x] Fixed sitemap — all 1,250 pages including new hub page are indexed
- [x] Pointed `safebathgrabbar.com` DNS to Vercel — **site is live on real domain**

---

## Phase 1 — SEO Content
_Based on the 90-day SEO audit in `safebathgrabbar-seo-report.md`_

### New Pages
- [x] Rockville, MD — Grab Bar Installation → `/bathroom-safety-rockville-md/bathroom-grab-bar-installation`
- [x] Lansdale, PA — Stair & ADA Railing → `/bathroom-safety-lansdale-pa/stair-garage-railing-installation`
- [x] Lancaster, PA — Grab Bar Installation → `/bathroom-safety-lancaster-pa/bathroom-grab-bar-installation`
- [x] Bethesda, MD — Grab Bar Installation → `/bathroom-safety-bethesda-md/bathroom-grab-bar-installation`
- [x] Hub Page → `/grab-bar-installation/` (fixes keyword cannibalization)
- [x] Montgomery County, MD — 10 cities added (Rockville, Gaithersburg, Silver Spring, Potomac + more)
- [x] Lancaster County, PA — 10 cities added (Lancaster, Lititz, Ephrata, Manheim + more)
- [x] ~150 new location + service pages total auto-generated

### Existing Page Optimizations
- [x] Homepage title & meta description updated
- [x] 9 key pages given specific title/meta overrides (West Chester, Philadelphia, Horsham, Wilmington, Rockville, Lancaster, Lansdale, Montgomery County)
- [x] "Handicap grab bars" H2 section added to Philadelphia + West Philadelphia pages
- [x] "Repair" language added to Montgomery County railing page (H2 + section)
- [x] Keyword cannibalization fixed via hub page + internal links

---

## Phase 2 — Conversion Optimization
_Get more calls from existing traffic_

- [x] Trust bar on every page — Licensed & Insured | 20 Years Experience | Lifetime Labor Warranty | ADA-Compliant
- [x] Mobile click-to-call fixed — phone icon always visible on mobile header
- [x] CTA rewritten site-wide — "Call for Same-Week Scheduling" on every page
- [ ] Add Google review count to meta descriptions _(requires collecting reviews first — Phase 5)_
- [ ] Lead every page intro with fear-prevention framing _(ongoing, future sessions)_

---

# 🔜 UP NEXT

## Phase 3 — Real Local Content
_Replace AI-generated city filler with genuine local copy_

The "Discover [City]" sections were removed when Gemini was cut. Replace with real, hand-written copy for the highest-traffic cities first.

- [ ] Write real local content for West Chester, PA (landmarks, character, community)
- [ ] Write real local content for Wilmington, DE
- [ ] Write real local content for Lansdale, PA
- [ ] Write real local content for Philadelphia neighborhoods
- [ ] Content goes into `site/src/lib/constants.ts` — pages pick it up automatically
- [ ] Work through remaining top-traffic cities over time

**Why it matters:** Google rewards genuine local expertise. A real paragraph about Brandywine Creek or the Exton Square Mall outperforms any AI-generated version.

---

## Phase 4 — Reputation & Reviews
_Biggest multiplier for local SEO and conversion_

- [ ] Identify all recent customers in GHL
- [ ] Send personalized review request via GHL conversation tools
- [ ] Get to 50+ Google reviews (current baseline unknown)
- [ ] Add review schema markup to website
- [ ] Add review count to meta descriptions once collected

---

## Phase 5 — Social Media & Local Authority
_Use GHL social posting tools_

- [ ] Establish weekly posting cadence: 2–3 posts/week
- [ ] Content types: before/after installs, safety tips, testimonials, service area callouts
- [ ] Post to Google Business Profile, Facebook, Instagram
- [ ] Monthly blog post on safety topics (fall prevention, ADA compliance, aging in place)

---

## Phase 6 — Automated SEO Agent (Recurring)
_AI that monitors, analyzes, and builds autonomously on a schedule_

**What it does:**

1. **Pulls data** — Google Search Console (impressions, clicks, positions) + Google Analytics (sessions, conversions)
2. **Analyzes** — flags dropping pages, surfaces new keyword gaps, identifies pages gaining traction
3. **Builds** — adds new city/service pages, updates meta descriptions, refreshes underperforming content
4. **Reports** — sends a weekly summary to the owner: what changed, what was built, what to expect

**To build this we need:**
- [ ] Connect Google Search Console API
- [ ] Connect Google Analytics 4 API
- [ ] Set up agent scheduling (weekly/biweekly/monthly cron)
- [ ] Define approval workflow — auto-deploy minor changes, flag major ones for review

---

## Phase 7 — Scale
_When core markets are performing_

- [ ] Expand to Alexandria VA, Baltimore MD suburbs
- [ ] Google Local Services Ads (complement to organic SEO)
- [ ] Referral program for occupational therapists and home health agencies

---

# 📋 REFERENCE

## Key URLs
| Resource | URL |
|----------|-----|
| Live site | https://safebathgrabbar.com |
| Vercel preview | https://safebath-website.vercel.app |
| GitHub (website) | https://github.com/RecoveryBiometrics/safebath-website |
| GitHub (workspace) | https://github.com/RecoveryBiometrics/safebath |

## Key Facts
| Item | Detail |
|------|--------|
| Phone | (610) 840-6371 |
| Pricing | $199 first bar · $99 each additional |
| GHL Location ID | VL5PlkLBYG4mKk3N6PGw |
| Branch workflow | All edits → `dev` → merge to `main` → auto-deploys |
| SEO baseline | 57 clicks · 3,548 impressions · 1.6% CTR · pos 27.9 (Dec 2025–Mar 2026) |

## Notes & Decisions
- Gemini AI removed — no API key required, build is instant and reliable
- Vercel chosen over Netlify — built by the Next.js team, native support
- `dev` branch protects live site — every change gets a preview URL before going live
- Hub page at `/grab-bar-installation/` fixes cannibalization across 5–6 competing pages
- All SEO page drafts (Rockville, Lansdale, Lancaster) are in `safebathgrabbar-seo-report.md`
