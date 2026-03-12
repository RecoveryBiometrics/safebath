# SafeBath — AI Operations Roadmap

Last updated: March 12, 2026

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

## Phase 2.5 — Technical SEO: Internal Linking + Schema
_March 12, 2026 — confirmed by local SEO research_

**Research finding:** Google uses geolocation for "near me" queries — literal "near me" text on pages or in anchor text has no ranking value. GBP, `areaServed` schema, review velocity, and hub-and-spoke internal linking are the real levers.

- [x] Fix internal linking — city+service pages now show same-county neighbors (was showing random global cities)
- [x] Add county service hub link from every city+service page
- [x] Hub-and-spoke links — all ~500 grab bar service pages now link to `/grab-bar-installation` with descriptive keyword anchor text
- [x] Add `HomeAndConstructionBusiness` schema to hub page — was missing entirely
- [x] Hub page `areaServed` lists all 8 served counties
- [ ] Add 2 internal links to NE Philadelphia railing page (was pos 8.3 — close to page 1)
- [ ] Expand `areaServed` on city+service pages to include county alongside city _(medium priority)_

> All changes tracked with check dates in `SEO-CHANGELOG.md`

---

# 🔜 UP NEXT

---

## 🔴 Phase 6 — Search Console Agent (NOW HIGHEST PRIORITY)
_Automated SEO measurement — replaces manual guesswork with data_

> **Why this is #1:** Every SEO change we make is currently invisible until someone manually pulls a Search Console report. Without measurement, we're flying blind and can't prove ROI. This gets built before anything else.

---

### What It Does

The agent runs on a schedule (weekly or biweekly), pulls ranking data, compares it to the baseline and prior weeks, and produces a structured report. Human decides what to act on.

**Mode A — Report Only (Human-in-the-Loop):**
Agent pulls data → analyzes → delivers report → human reviews → human decides what to build next

**Mode B — Report + Auto-Build:**
Agent pulls data → analyzes → delivers report → auto-commits low-risk changes (new city pages, meta tweaks) to `dev` → human reviews Vercel preview → human merges to `main`

Mode is a decision to be made once the agent is running. Starting with Mode A is safest.

---

### Step 1 — Google Search Console API Access (BLOCKER)
_Nothing else in this phase can happen without this_

**What's needed:**
- [ ] Create a Google Cloud project for SafeBath
- [ ] Enable the Search Console API
- [ ] Create OAuth 2.0 credentials (or service account if GSC supports it)
- [ ] Authorize the credentials against `safebathgrabbar.com`'s Search Console property
- [ ] Store credentials securely (env variable or secrets file — never committed to git)

**Human action required:** The business owner must authorize the OAuth consent screen once. After that, the agent runs without human involvement.

**Credential storage:** `/home/williamcourterwelch/safebath/.gsc-credentials.json` (gitignored)

---

### Step 2 — Build the Data-Pulling Script

**What it fetches from Search Console API:**
- Clicks, impressions, CTR, average position — by page URL and by query
- Date range: last 28 days vs. prior 28 days (tracks trends, not just snapshots)
- Filters: site = `safebathgrabbar.com`

**Output:** A structured JSON file saved to `/home/williamcourterwelch/safebath/seo-data/latest.json`

- [ ] Write `scripts/fetch-search-console.js` (Node.js, googleapis SDK)
- [ ] Test locally with real credentials
- [ ] Verify data matches what's visible in Search Console UI

---

### Step 3 — Build the Analysis Layer

**What the agent analyzes:**
- Pages that gained or lost position week-over-week (flags drops > 3 positions)
- Queries with high impressions but low CTR (title/meta opportunity)
- Pages near page 1 (positions 8–15) that could be pushed with internal links or content
- New queries emerging that have no dedicated page (gap detection)
- Compare against `SEO-CHANGELOG.md` — flag changes that have had < 8 weeks to take effect

- [ ] Write analysis logic (Claude agent reads `latest.json`, compares to `baseline.json`)
- [ ] Define thresholds: what counts as "significant" change worth flagging
- [ ] Generate recommendations in structured format (JSON or Markdown)

---

### Step 4 — Build the Report

**Report format:** Markdown file saved to `/home/williamcourterwelch/safebath/seo-reports/YYYY-MM-DD.md`

**Report sections:**
1. Summary: clicks, impressions, CTR, avg position vs. prior period
2. Wins: pages that moved up significantly
3. Drops: pages that fell — with diagnosis
4. Opportunities: high-impression / low-CTR pages with suggested title/meta rewrites
5. Gaps: queries with no matching page (top 10 by impression volume)
6. Pending changes: list from `SEO-CHANGELOG.md` with time elapsed + "too early to evaluate" flag
7. Recommended actions: ranked by estimated impact

**Delivery options (decide before building):**
- [ ] Option A: File only — human opens Claude and reviews the report file
- [ ] Option B: Email via GHL — agent sends report to owner's email on schedule
- [ ] Option C: GHL conversation message — report delivered as a CRM message

---

### Step 5 — Schedule the Agent

- [ ] Create a cron job that runs the fetch + analysis + report on a schedule
- [ ] Recommended: every Tuesday at 7am (consistent day makes trends readable)
- [ ] Use `CronCreate` tool in Claude Code or GitHub Actions workflow
- [ ] First run: retroactively establish baseline from Dec 2025 – Mar 2026 data (already documented)

---

### Step 6 — Human-in-the-Loop Approval (Mode B only)

_Skip this step if staying with Mode A (report only)_

- [ ] Agent writes recommended changes to a `proposed-changes/` folder as individual files
- [ ] Each file describes: what page, what change, why, expected impact
- [ ] Human reviews proposed changes in a Claude session
- [ ] Human approves specific items → agent commits them to `dev`
- [ ] Vercel preview auto-deploys → human merges to `main`

**What can be auto-proposed (low risk):**
- New city pages (just adds to `constants.ts`)
- Meta description rewrites for underperforming pages
- Internal link additions

**What always requires human review:**
- Changes to existing page copy
- New hub pages or structural changes
- Any change that contradicts a pending item in `SEO-CHANGELOG.md`

---

### Decision Needed Before Building

**Which delivery method for the report?** (Step 4)
- File only → simplest, requires you to open Claude to see it
- Email via GHL → passive, arrives in your inbox, no action needed to receive it
- GHL message → in your CRM alongside leads

**Mode A or B?** Start with A (report only), decide after first few reports whether to add auto-building.

---

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

## Phase 6 — Automated SEO Agent
_See full plan at the top of UP NEXT — this is now the #1 priority_

---

## Phase 7 — Scale
_When core markets are performing_

- [ ] Expand to Alexandria VA, Baltimore MD suburbs
- [ ] Google Local Services Ads (complement to organic SEO)
- [ ] Referral program for occupational therapists and home health agencies

---

## Phase 8 — National Lead Gen Network
_Expand from regional installer to national lead generation platform_

**Model:** SafeBath generates leads nationwide via SEO. Leads are routed to vetted local installers who pay per lead or a % of job value. SafeBath does not need to be the contractor in each market.

**GHL role:** Lead capture → pipeline by geography → auto-route to partner installer

---

### Top 30 US Markets — Senior Population Rankings

| Rank | City | State | % 65+ | Notes |
|------|------|-------|-------|-------|
| 1 | The Villages | FL | ~85% | World's largest planned retirement community; median age 73 |
| 2 | Sun City / Sun City West | AZ | 75–87% | Original retirement city; Sun City West 86.5% 65+ |
| 3 | Laguna Woods | CA | ~83% | Near-entirely senior-occupied Orange County city; median age 75 |
| 4 | Prescott | AZ | ~40% | Interior AZ retirement hotspot; fastest-growing; median age 60 |
| 5 | Naples | FL | ~56% | Highest-income FL retirement city; median age 67.6 |
| 6 | Hilton Head Island | SC | ~38% | Affluent coastal SC; 38%+ seniors, no dominant local installer |
| 7 | Sarasota County | FL | ~37% | Entire county extremely senior-heavy; established market |
| 8 | Palm Springs / Palm Desert | CA | ~34% | Desert retirement corridor; no local specialist found |
| 9 | Boca Raton | FL | ~28% | Affluent Palm Beach County senior enclave |
| 10 | Sarasota (city) | FL | ~29% | Core of senior-heavy metro |
| 11 | Delray Beach | FL | ~27–28% | Senior-rich Palm Beach County |
| 12 | Cape Coral / Fort Myers | FL | ~25–29% | #1 ranked retirement metro nationally |
| 13 | Clearwater | FL | ~24% | Pinellas County coastal senior hub |
| 14 | Myrtle Beach | SC | ~23–25% | #1 fastest-growing US senior metro (2025); underserved |
| 15 | Port St. Lucie | FL | ~22% | Treasure Coast FL; Sumter County 58.9% at county level |
| 16 | Scottsdale | AZ | ~22% | Affluent Phoenix suburb; high-value installs |
| 17 | Prescott Valley | AZ | ~22% | Bedroom community to Prescott; very senior-heavy |
| 18 | Asheville | NC | ~19% | Fastest-growing NC retirement city; low competition |
| 19 | St. Petersburg | FL | ~20%+ | Pinellas County; connected to Tampa metro |
| 20 | Las Vegas | NV | ~16% | 101,000+ absolute seniors; historically #1 senior migration state |
| 21 | Pittsburgh | PA | ~15% | Large absolute elderly pop; Rust Belt city |
| 22 | Cleveland | OH | ~15% | ~55,000 seniors; underinvestment in senior-safety marketing |
| 23 | Tucson | AZ | ~15% | Established AZ market; lower density than Phoenix |
| 24 | Tampa | FL | ~13% | ~60,000 seniors; SimplyGrabBars home base — competitive |
| 25 | San Antonio | TX | ~13% | ~200,000 metro seniors; growing |
| 26 | Houston | TX | ~12% | ~280,000 seniors; +15.3% growth 2020–2023 |
| 27 | Phoenix | AZ | ~12% | ~200,000 seniors; sub-market niches available |
| 28 | Orlando | FL | ~12% | Served by handymen, not specialists — gap opportunity |
| 29 | Charlotte | NC | ~11% | ~105,000 seniors; rapidly growing |
| 30 | Palm Springs (winter) | CA | ~34%+ | Population triples in winter (snowbirds) |

---

### Installer Research by Market

#### 🔴 AVOID (Highly Competitive — Entrenched Incumbents)

**Sarasota / Bradenton, FL**
- Superior Safety Bars Inc. — 121 Birdeye reviews, 5-star, father-son, multi-county coverage
- Dr. Grab Bar — founded 2005, Moen-certified, 58+ reviews
- The Grab Bar Guy FL — in operation since 1999, 25-year track record
- SimplyGrabBars — Tampa-based, statewide coverage, strong digital
- CAPS Remodeling — CAPS-certified niche

**Naples, FL**
- Mr. Grab Bar — founded HERE in 1998 by a PT; 145,000+ bars installed FL-wide; this is their home base

**Laguna Woods / Orange County, CA**
- OC Grab Bars — CAPS-certified, NHAB-certified, 102 Yelp reviews, 5.0 stars, 21,952+ bars installed since 2005 — the strongest local specialist in the entire dataset

**Tampa, FL**
- SimplyGrabBars — headquartered here, Moen authorized, lifetime warranty, statewide reach

**The Villages, FL**
- Mr. Grab Bar, SimplyGrabBars, Lifegrip Solutions all active and optimized

---

#### 🟡 MODERATE OPPORTUNITY (Competitive but Beatable)

**Boca Raton / Delray Beach, FL**
- Grab Bar Guys Inc. — 20 years local, but modest web presence; site may be dated
- Next Day Access franchise — strong brand but not locally specialized
- SimplyGrabBars and Mr. Grab Bar also have pages here
- *Opportunity: Affluent market with no dominant reviewed local specialist*

**Clearwater / St. Pete, FL**
- Grab Bar Plus (Gary Zimmerman) — sole proprietor, since 2005, not BBB accredited, minimal reviews
- Tampa Stronghold Grab Bars — newer brand, strong positioning, moderate digital
- *Opportunity: No dominant local brand; Grab Bar Plus is the incumbent but vulnerable*

**Scottsdale / Phoenix, AZ**
- Grab Bars, Etc. — founded 1996, OT professionals, showroom, 28 years; dominant
- Senior Safe Homes — moderate-strong; full Phoenix metro
- Aging Safely Baths — A+ BBB, Phoenix + Tucson + Mesa
- *Opportunity: Sub-market pages (East Valley, North Scottsdale, West Valley) are underdeveloped*

**Tucson, AZ**
- Grab Bar Guy AZ — local sole operator since 1999, dedicated site, limited reviews
- Next Day Access franchise also active
- *Opportunity: One local incumbent, national franchise — beatable with strong GBP + reviews*

**Port St. Lucie, FL**
- Port St. Lucie Grab Bar Specialists — 14+ years, 20,000+ bars
- Treasure Coast Grab Bar Specialists — dedicated local brand
- Mighty Grab Bars — Age Safe Certified
- *Opportunity: Multiple players but none has dominant review count*

**Fort Myers / Cape Coral, FL**
- Mr. Grab Bar (Lee County), Dr. Grab Bar, Five Star Bath Solutions franchise
- GrabBars.com aggregator
- *Opportunity: Cape Coral has weaker local coverage; franchise presence signals market health*

**Charlotte, NC**
- Get a Grip Avoid a Slip (Barry Duckworth) — 40-year contractor, modest web presence
- Safe Home Pro — NC/SC licensed since 2010, moderate digital
- *Opportunity: No dominant grab bar brand in the 5th largest US banking city*

**Pittsburgh, PA**
- 3 Birds Accessibility — blog/content strategy, Pittsburgh-specific, moderate-strong
- Grab Bar Pros (Bruce Montgomery, RN) — strong credential, Lehigh Valley base
- *Opportunity: Rust Belt with high elderly pop and no dominant brand*

**Cleveland, OH**
- Ohio Walk-in Showers — since 2005, government contracts, Northeast OH coverage
- Innovate Building Solutions — content marketing powerhouse, Cleveland/Akron
- *Opportunity: No pure-play grab bar brand owns Cleveland proper*

**San Antonio / Houston, TX**
- Texas Senior Safety (Ken Elkins, RN) — 25 reviews, 4.7 stars, covers both cities + Austin
- Handle With Care Seniors — Houston home safety, moderate digital
- *Opportunity: TX Senior Safety is spread thin across 4 cities — local gap exists in each*

**Orlando, FL**
- TJ Handyman, HandyMangum — generalists, not specialists
- Mr. Grab Bar expanding here
- *Opportunity: Large metro served by handymen; a specialist brand could own it quickly*

**Sun City / Sun City West, AZ**
- Grab Bars, Etc. — dominant statewide AZ player
- Arizona Grab Bar — moderate; serves Sun City
- *Opportunity: 75–87% senior pop means demand perpetually outpaces supply*

---

#### 🟢 BEST OPPORTUNITIES (Underserved Markets — Move First)

**#1 — Prescott, AZ** ⭐
- 40%+ senior population — higher than Naples FL
- No confirmed local owner-operator found — only SEO aggregator shells
- Grab Bars, Etc. (Phoenix-based) lists Prescott Valley but no dedicated Prescott brand
- **Action: Find or recruit one installer; build city pages; GBP with Prescott address**

**#2 — Hilton Head Island, SC** ⭐
- 38%+ 65+ population — more senior-dense than Boca Raton and Cape Coral
- Affluent market (high average home value = high average job value)
- No dedicated grab bar installer confirmed — generic SC directories only
- **Action: Recruit local handyman or carpenter; wrap them in SafeBath brand; own the market**

**#3 — Las Vegas, NV** ⭐
- 101,000+ absolute seniors; historically the #1 senior in-migration state
- ADA Grab Bars (adagrabbarssafetyrails.com) has multiple domains but almost NO reviews
- Las Vegas Senior Services and Grab Bar Express — both moderate; none reviewed well
- **Action: Get one good partner with 10+ reviews and the market flips immediately**

**#4 — Palm Springs / Palm Desert, CA** ⭐
- 34%+ seniors; population 3x in winter with snowbirds
- Only LA-based company (Grab Bar Los Angeles) serving remotely
- Affluent, high-income desert retirement corridor
- **Action: Find Coachella Valley-based handyman; build local GBP + pages**

**#5 — Myrtle Beach, SC** ⭐
- #1 fastest-growing senior metro in the US as of 2025
- NMB Grab Bar Guy covers only North Myrtle Beach; no brand owns Myrtle Beach proper
- **Action: Recruit installer; capture market ahead of the growth curve**

**#6 — Asheville, NC**
- Fastest-growing NC retirement city; only Next Day Access franchise + one weak local player
- High-income, well-educated retirees; strong community culture means referrals travel
- **Action: Find mountain-town handyman; localize content around Biltmore, Blue Ridge, etc.**

---

### Competitor Landscape: National Aggregators to Know

These companies appear in 10+ markets and compete for the same SEO territory:

| Company | Model | Digital Strength | Threat Level |
|---------|-------|-----------------|--------------|
| Mr. Grab Bar (mrgrabbar.com) | FL network with 100s of city pages | Strong | High in FL |
| SimplyGrabBars (simplygrabbars.com) | Tampa-based, statewide FL | Strong | High in FL |
| GrabBars.com | National referral aggregator; 500+ network | Moderate | Medium nationwide |
| Next Day Access | National accessibility franchise | Strong | Medium in their markets |
| Strive Senior Bathroom Remodeling | SEO aggregator — city landing pages only | Moderate | Low (not real operators) |

---

### Pricing Benchmarks by Market

| Market | Typical Price Per Bar |
|--------|----------------------|
| Las Vegas, NV | ~$140 (18–24" bar + labor) |
| Pittsburgh, PA | $150–$300 |
| Orange County, CA | ~$250 (Moen + labor) |
| Southwest Florida | $199–$300 |
| Texas | $199–$275 |

SafeBath current pricing ($199 first bar, $99 additional) is competitive nationally.

---

### Key Insight: CAPS Certification as Market Signal

The highest-reviewed installers in every market hold CAPS (Certified Aging in Place Specialist) credentials:
- OC Grab Bars (CA) — CAPS + NHAB; 102 Yelp reviews
- Grab Bars, Etc. (AZ) — OT-founded; 28 years
- Gainey Flooring / Aging in Place AZ — CAPS certified

**CAPS certification correlates directly with higher review counts and dominant market position.** Any partner recruited for the network should be encouraged to pursue CAPS, and SafeBath's branding should emphasize CAPS-partnership.

---

### Action Items for Phase 8

- [ ] Decide lead gen pricing model: pay-per-lead ($X flat) vs. % of job value
- [ ] Recruit first partner in Prescott, AZ — search Angi, Thumbtack, local Facebook groups for handymen
- [ ] Recruit first partner in Hilton Head, SC — same sourcing approach
- [ ] Build GHL pipeline: New Lead → Geography Match → Partner Assigned → Job Won/Lost
- [ ] Add Prescott AZ and Hilton Head SC cities to `constants.ts`
- [ ] Update page templates: CTA shifts to "Get Connected to a Local Installer" for out-of-area markets
- [ ] Draft partner agreement template (lead fee, response time SLA, review request requirement)
- [ ] After first two markets: move to Las Vegas NV, Palm Springs CA, Myrtle Beach SC

---

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
