# SafeBath — AI Operations Roadmap

Last updated: March 15, 2026

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

## ✅ RESOLVED — Email Delivery via Gmail API

_Resolved March 14, 2026. Gmail API connected via gcloud ADC. No SMTP secrets needed._

Email sends from `williamcourterwelch@gmail.com` to `bill@reiamplifi.com` using Application Default Credentials with the `x-goog-user-project: safebath-seo-agent` header. The old SMTP blocker is eliminated.

- [x] Gmail API enabled on `safebath-seo-agent` project
- [x] gcloud ADC authenticated with `https://mail.google.com/` scope
- [x] Test email sent successfully (March 14, 2026)
- [ ] Update SEO agent `email.js` to use Gmail API instead of nodemailer/SMTP
- [ ] Build daily digest GitHub Action using Gmail API

---

## ✅ Phase 6 — Search Console Agent (COMPLETE & RUNNING)
_Automated SEO measurement — replaces manual guesswork with data_

> **Agent is live and running.** First report generated March 13, 2026. Service account connected. GSC credential added to GitHub secrets. Weekly reports auto-commit to `seo-reports/`.

- [x] Google Search Console API enabled on `safebath-seo-agent` project
- [x] Service account: `seo-agent@safebath-seo-agent.iam.gserviceaccount.com`
- [x] Service account key stored in GitHub secret `GOOGLE_SERVICE_ACCOUNT_KEY`
- [x] Agent built and scheduled: every Tuesday 9am ET via GitHub Actions
- [x] First report: March 13, 2026 — 24 clicks, 1,827 impressions, 115 pages tracked
- [ ] Add local GSC access via ADC (being added in Phase 5.1)

| File | What it does |
|------|-------------|
| `scripts/seo-agent/fetch-gsc.js` | Pulls clicks, impressions, CTR, position by page + query (28-day rolling) |
| `scripts/seo-agent/analyze.js` | Finds wins, drops, opportunities (pos 8–20), content gaps |
| `scripts/seo-agent/report.js` | Generates `seo-reports/YYYY-MM-DD.md` with SEO-CHANGELOG.md safeguards |
| `scripts/seo-agent/index.js` | Main orchestrator |
| `.github/workflows/weekly-seo-report.yml` | GitHub Actions cron — every Tuesday 9am ET |

---

## 🔴 Phase 5.1 — Fix "Crawled Not Indexed" Pages (~700 pages) ← ACTIVE NOW
_Autonomous multi-agent pipeline to add unique, fact-checked local content to every page_

> **Problem:** ~700 of 1,427 pages are crawled but not indexed. Google sees them as too similar — same service description, different city name. Over half the site is invisible to search.

> **Baseline:** `seo-reports/not-indexed-pages-2026-03-14.md` — 700 not-indexed pages with priority tiers

### Step 1 — Local GSC Access (IN PROGRESS)
- [x] Write `scripts/gsc-query.js` using ADC auth (`williamcourterwelch@gmail.com`) — DONE, script at `scripts/gsc-query.js`
- [ ] Add `webmasters.readonly` scope to ADC ← **NEXT: run this command:**
  ```
  gcloud auth application-default login --scopes=https://www.googleapis.com/auth/webmasters.readonly,https://mail.google.com/,https://www.googleapis.com/auth/cloud-platform
  ```
  (opens browser for Google login, one-time, keeps existing Gmail + cloud scopes)
- [ ] Test: `node scripts/gsc-query.js test` — should show clicks/impressions
- [ ] Full pull: `node scripts/gsc-query.js not-indexed` — saves 28-day baseline to `seo-reports/`

### Step 2 — 4-Agent Content Pipeline (Daily Cron)

Runs daily via GitHub Actions. Processes 5 cities/day. Pushes directly to `main` (live).

```
Researcher → Fact Checker #1 → Copywriter → Fact Checker #2 → SEO Audit → Engineer → Deploy
     ↑              |               ↑              |               |
     └──── fix ─────┘               └──── fix ─────┘               ↓
                                                          (auto-fix & retry,
                                                           max 3 attempts)
```

**Agents:**
1. **Researcher** — Reddit (market-specific subreddits) + Census + web search for hyper-local info
2. **Fact Checker #1** — Verifies all claims against Census Bureau, CDC, local gov, Wikipedia
3. **Copywriter** — Writes unique content per city: intro, housing challenges, "Why Choose Us", safety stats, neighborhood mentions
4. **Fact Checker #2** — Validates copy accuracy + uniqueness (flags >60% similarity to sibling cities)
5. **SEO Audit** — Validates title tags, meta descriptions, H1s, schema, canonicals, internal links, OG tags, alt text. Blocks deploy if wrong.
6. **Engineer** — Writes validated JSON to `site/src/data/cities/{slug}-{state}.json`

**Self-healing:** Failed checks loop back with improved prompts. Max 3 retries. Agents fix their own issues.

**Token-optimized:** JSON between agents, shared caches (census, brand rules), batch county lookups, skip re-verified sibling data.

### Step 3 — "What's Happening in [City]" Local Blog

Each city gets a living local news/events section:
- **On city page:** 10 most recent entries as teaser
- **Archive:** `/bathroom-safety-{city}-{state}/local-news/` — full history, each entry has own URL
- **Appends daily** — new entry at top, nothing deleted, builds over time
- **Interlinked:** blog entries ↔ service pages ↔ city hub (hub-and-spoke per city)
- **Result:** 161 local blogs × daily entries = thousands of new unique indexed pages

### Step 4 — Daily Report (emailed via Gmail API)

Daily email to `bill@reiamplifi.com` with:
- Cities processed today + live safebathgrabbar.com links (already deployed)
- Research summary, fact check results, content written
- Indexing recovery tracker: "X/700 pages now indexed"
- Any errors or flagged issues

### Processing Order
1. **Non-indexed pages first** (~700 pages) — most urgent
2. **Then ALL remaining pages** — even indexed pages get the full treatment
3. All 161 cities, no exceptions

### Success Metrics
- **Baseline:** ~700 not indexed (March 14, 2026)
- **Target:** Under 200 not indexed by June 2026
- **Measurement:** Weekly via SEO agent indexing report

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

## Phase 5 — Reddit-Powered Content Engine (Blog + GBP Posts)
_One source of truth: real questions from Reddit → blog posts on safebathgrabbar.com + daily GBP posts_

> **Goal:** Reddit is the single content source for everything. Real people asking real questions about grab bars, bathroom safety, and aging in place. Every question becomes a blog post AND a GBP post. No invented content, no generic AI filler.

### How It Works

```
Reddit scraper (daily via GitHub Actions)
    ↓
Scans subreddits + keywords for new questions/discussions
    ↓
Agent categorizes each finding: blog post, GBP post, or both
    ↓
┌─────────────────────────────┬──────────────────────────────┐
│ BLOG (long-form)            │ GBP POST (short-form)        │
│ Markdown file → dev branch  │ Posted via GBP API daily     │
│ Human reviews → merge →live │ 7-day rotation from queue    │
│ SEO agent tracks rankings   │ Activity signal for Map Pack │
└─────────────────────────────┴──────────────────────────────┘
```

### Step 1 — Connect the Google Business Profile API ⚠️ HUMAN ACTION REQUIRED

_~15 minutes. One-time setup._

1. [ ] Go to https://console.cloud.google.com → select the `safebath-seo` project
2. [ ] Search for **"My Business Business Information API"** → Enable it
3. [ ] Search for **"My Business Account Management API"** → Enable it
4. [ ] Search for **"Business Profile Performance API"** → Enable it
5. [ ] Go to **IAM & Admin** → **Service Accounts** → click the existing `seo-agent` service account
6. [ ] Note the service account email (e.g. `seo-agent@safebath-seo.iam.gserviceaccount.com`)
7. [ ] Go to https://business.google.com → open SafeBath Grab Bar listing
8. [ ] **Users** → **Add user** → paste the service account email → set role to **Manager**
9. [ ] Verify access: the service account should now be able to read/write the GBP listing

> **Note:** The same service account key already stored in GitHub (`GOOGLE_SERVICE_ACCOUNT_KEY`) will work for GBP too — no new secret needed.

### Step 2 — GBP Completeness Audit (Claude does this)

- [ ] Pull current GBP listing via API — check every field
- [ ] Fill all missing fields: services list, service area (all counties), business description, hours, attributes, appointment link, website URL
- [ ] Add primary + secondary categories
- [ ] Seed Q&A with top 10 questions people actually search for

### Step 3 — Reddit Scraper Agent (Claude builds this)

Runs daily via GitHub Actions. Searches these subreddits + keywords:

**Subreddits:** r/AgingParents, r/eldercare, r/HomeImprovement, r/occupationaltherapy, r/CaregiverSupport, r/Aging, r/disability, r/PhysicalTherapy

**Keywords:** grab bar, bathroom safety, elderly fall, hip fracture, aging in place, shower seat, walk-in shower, ADA bathroom, parent fell, mom fell, dad fell, bathroom modification, home safety

**What it does with findings:**
1. Categorizes each: blog topic, GBP post topic, or both
2. For blog topics: drafts a full markdown blog post answering the real question, commits to `dev` for review
3. For GBP posts: writes a short-form version (1500 char max) to a posting queue
4. Weekly digest in SEO report: "5 new topics found, 2 blog posts drafted, 7 GBP posts queued"

### Step 4 — Blog on safebathgrabbar.com/blog (Claude builds this)

- [ ] Add `/blog` route to Next.js site
- [ ] Blog posts stored as markdown files in `site/src/content/blog/` (no CMS needed)
- [ ] Static generation at build time — fast, free, zero maintenance
- [ ] Each post gets: title, meta description, schema markup, internal links to relevant service pages
- [ ] Blog index page at `/blog` with category filtering
- [ ] Every post answers a real Reddit question — linked back to the original thread for authenticity

### Step 5 — Daily GBP Posting Agent (Claude builds this)

Runs daily via GitHub Actions. Posts to GBP from the Reddit-sourced queue:

| Day | Content Type | Source |
|-----|-------------|--------|
| Monday | Before/after install photo + city name | Real job photos (Bill provides) |
| Tuesday | Safety stat / fall prevention fact | Reddit questions about fall risks |
| Wednesday | Service spotlight with pricing | Reddit questions about cost/options |
| Thursday | Service area callout | Rotate through all served markets |
| Friday | Offer/CTA with market-specific phone | Rotate markets |
| Saturday | Answer a real question from Reddit | Direct Reddit Q&A format |
| Sunday | Educational tip | Reddit misconceptions (e.g. suction cups) |

**Photo strategy:** 2–3 real job photos per week uploaded to GBP. Before/after pairs. Google tracks photo views and engagement — this is a ranking signal.

### Step 6 — GBP Insights in Weekly Report

Add to the existing SEO agent report:
- [ ] GBP views (search vs. maps)
- [ ] GBP actions (calls, direction requests, website clicks)
- [ ] Post engagement
- [ ] Review count + average rating trend

### Content Tiers (what the Reddit scraper looks for)

**Tier 1 — High intent, converts directly:**
- "How much does grab bar installation cost in [city]?"
- "Best grab bars for showers 2026"
- "Suction cup grab bars vs. wall-mounted — which is safer?"
- "Do I need a contractor to install grab bars?"

**Tier 2 — Problem-aware, builds traffic:**
- "What to do after your parent falls at home"
- "Hip fracture recovery timeline — what to expect"
- "Signs your elderly parent's bathroom isn't safe"
- "Aging in place checklist — home modifications for seniors"

**Tier 3 — Authority building, strengthens domain:**
- "ADA bathroom requirements for residential homes"
- "Medicare and Medicaid coverage for home safety modifications"
- "Occupational therapist home assessment — what to expect"
- "Fall prevention statistics 2026 — why bathrooms are the #1 risk"

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

### Who to Target as Lead Recipients

**The answer is NOT the companies with the best websites.** SimplyGrabBars and OC Grab Bars already have their own lead gen — they don't need you and won't pay well.

**The answer is NOT the completely dead businesses either.** If a site is down and no one answers, they can't fulfill leads.

**The sweet spot: Operationally proven, digitally invisible.**

Look for companies that have:
- Been in business 10–25 years
- Word-of-mouth reputation and PT/OT referrals
- Decent offline reviews but almost no Google presence
- A weak, dated, or barely-there website
- No blog, no city pages, no schema — surviving entirely on referrals

These companies CAN do the work. They just can't find customers online. That's exactly where you step in.

**Best targets from our research (operationally strong, digitally weak):**

| Company | Market | Why They're the Sweet Spot |
|---|---|---|
| Grab Bar Guys Inc | Boca Raton FL | 20 years, Moen partner, zero digital footprint |
| NMB Grab Bar Guy | Myrtle Beach SC | 18 years installing, site is a liability not an asset |
| Get a Grip Avoid a Slip | Charlotte NC | 40-year contractor, one-page website |
| Grab Bar Guy AZ | Tucson AZ | Since 1999, PT/OT referred, dated site with no SEO |
| The Grab Bar Guy FL | Sarasota FL | 25 years, ownership changed 2024, digital declining |
| Texas Senior Safety | TX statewide | RN-credentialed, spread across 4 cities, can't own any |
| Ohio Walk-in Showers | Cleveland OH | Government contracts, since 2005, timeout on site fetch |

In markets with **no established installer found** (Prescott AZ, Hilton Head SC, Palm Springs CA), find a skilled general handyman and onboard them as a SafeBath network partner — they get the brand, the leads, and the backend. You get the revenue.

---

### How to Find and Recruit Installers

**Search sources (in priority order):**

1. **NAHB CAPS Directory** — nahb.org/caps → search by zip code → these are certified Aging in Place specialists, the highest-quality partners
2. **Google Maps** — search "grab bar installation [city]" — call the 3-star and 4-star results, not the 5-star (5-star = established, doesn't need you)
3. **Angi / Thumbtack** — search "grab bar installation" or "aging in place" by city — filter for small operators with fewer than 50 reviews
4. **OT/PT clinics** — call 5 occupational therapy practices in the target city and ask "who do you refer patients to for grab bar installation?" — these referrals are the most trusted operators in any market
5. **Facebook Groups** — search "handyman [city]", "home services [city]", "aging in place [state]"
6. **Nextdoor Neighborhood Favorites** — search for home services in the target neighborhood
7. **Direct outreach** — email/call the companies on our weak-site list above — they're exactly the right profile

**The pitch (keep it simple):**

> "I run a senior safety website that's ranking for grab bar searches in your area. I'm getting more inquiries than I can handle. I'd like to send you the first 5 leads at no charge — if you close them, we set up a simple pay-per-lead arrangement. No contracts, no commitment to start."

First 5 leads free eliminates all objections. If they can close $199–$300 jobs from warm inbound leads, they'll pay $25–$50 per lead happily.

**Partner agreement (simple, one page):**
- SafeBath sends lead via GHL (name, phone, city, service needed)
- Partner has 2-hour response window (leads go cold fast)
- Partner pays $X per lead OR 10–15% of job value — decide model first
- Partner must request a Google review from every SafeBath lead
- Either party can exit with 30 days notice

---

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

### Installer Competitive Analysis — Website Deep Dive

_Fetched March 2026. Used to identify content gaps and outrank difficulty per market._

---

#### 🔴 Hard to Outrank (but still beatable on content)

**SimplyGrabBars — Tampa/FL statewide** | simplygrabbars.com
- Site: Modern Elementor build, 7 FL regional zones, active blog
- Google: Displays reviews prominently; JSON-LD schema present
- Content gaps: **No pricing shown. No CAPS cert. No license number. Blog posts are broad safety topics, not city+service keyword pages.** Heavy JavaScript may hurt crawlability.
- How to beat: City-specific pages with pricing + CAPS messaging will outrank their zone-based approach on long-tail local queries

**OC Grab Bars — Orange County, CA** | ocgrabbars.com *(the gold standard)*
- Site: Modern, 34+ city pages, CAPS+NHAB certified, $250 pricing shown, blog, schema — best site in the dataset
- Reviews: 102 Yelp, 74 Birdeye, 5-star both
- Content gaps: **FAQ is only 9 questions. Blog is minimal. No video content. No schema on service/city subpages.**
- How to beat: Only with serious paid media or a local partner with 50+ reviews. Do not prioritize Orange County CA early.

---

#### 🟡 Medium Difficulty — Beatable with Good Content

**Dr. Grab Bar — Sarasota/Bradenton, FL** | drgrabbars.com
- Site: Modern, professional, $249 package pricing shown, lifetime warranty
- Content gaps: **Only 5 city pages for all of SW Florida. Zero blog. No schema visible. No CAPS cert. "Certified Home Advisor Installer" is not an industry-recognized credential.**
- How to beat: Build 20+ Sarasota/Manatee/Charlotte County city pages, add a blog, target "grab bar installation [neighborhood]" terms they're not covering

**Mr. Grab Bar — Naples/FL network** | mrgrabbar.com
- Site: Dated Shopify (Flex 5.5.0 theme). Looks like a product store, not a local service.
- Content gaps: **Location "pages" are dropdown values, not real crawlable pages — they have ZERO local SEO value. No blog. No visible trust signals on the site itself. No pricing.**
- How to beat: Any real city+service page structure beats their fake location pages. Despite 233 Birdeye reviews and 145,000 bars installed, the website is technically weak. Target their Naples, Ft. Myers, Cape Coral keywords directly.

**Grab Bars, Etc. — Sun City/Phoenix, AZ** | grabbarsetc.com
- Site: Divi WordPress — heavy JavaScript, content not rendering in raw HTML (bad for SEO crawlers)
- Content gaps: **JavaScript-dependent content = Google may not be indexing it fully. No visible blog in raw HTML. No city pages rendering. 28-year brand surviving on reputation, not search.**
- How to beat: A clean, fast, static site with Sun City + Phoenix metro city pages will outrank a slow JS-heavy site on most long-tail queries

**Texas Senior Safety — San Antonio/Houston/Austin/DFW** | txseniorsafety.com
- Site: Modern WordPress, 4 city pages, BBB accredited, RN credential (Ken Elkins), 8+ testimonials
- Content gaps: **Gmail contact email (unprofessional signal). Obfuscated JavaScript hurts crawlability. No CAPS cert. No pricing. Blog exists but depth unknown. Spread thin across 4 massive cities — can't deeply own any.**
- How to beat: Build 10+ neighborhood pages within any single TX city (e.g., "grab bar installation The Woodlands TX," "grab bar installation Katy TX") — they won't have those

**3 Birds Accessibility — Pittsburgh, PA** | 3birdsaccessibility.com
- Site: Modern, BBB accredited, PA license # shown, 6 location pages, 9 service categories
- Content gaps: **Only 3 blog posts. No pricing. No schema on service pages. Spreading across 6 cities means no city is deeply covered. No CAPS cert.**
- How to beat: Own Pittsburgh with 15+ neighborhood pages + a content-rich blog targeting "grab bar installation cost Pittsburgh" and similar — they won't rank for those

---

#### 🟢 Easy — Minimal Digital Presence

**Grab Bar Guys Inc — Boca Raton, FL** | grabbarguys.com
- Site: Generic template, no city pages, no blog, no pricing, no testimonials
- Content gaps: **Everything. No blog, no city pages for Delray/Boynton/Broward, no schema, no pricing, no certifications visible.** 20-year brand with a 2010-era digital presence.
- How to beat: Any structured city+service page targeting Palm Beach County terms beats them immediately

**Grab Bar Guy AZ — Tucson, AZ** | grabbarguyaz.com
- Site: Dated, generic page builder, no city pages, no pricing, no blog
- Content gaps: **No blog, no schema, no NAP consistency, no city pages for Oro Valley/Green Valley/Marana/Sahuarita — all suburbs he serves but doesn't target digitally**
- How to beat: 10 Tucson metro city pages + blog + pricing page = own the market in 90 days

**Get a Grip Avoid a Slip — Charlotte/Lake Norman, NC** | getagripavoidaslip.com
- Site: Effectively a one-page site — Divi theme with only a phone number in schema
- Content gaps: **Literally everything. No service pages, no city pages, no blog, no address, no certifications, no testimonials.** Barry Duckworth's 40-year reputation carries zero digital weight.
- How to beat: Any 5-page website beats this

**NMB Grab Bar Guy — Myrtle Beach, SC** | nmbgrabbarguy.com
- Site: Dated, basic, stock imagery, single geographic area, Gmail email
- Content gaps: **No blog, no schema, no pricing, no city pages, no testimonials, no certifications visible.** In the #1 fastest-growing senior metro in the US.
- How to beat: Build pages for Myrtle Beach, Conway, Surfside Beach, Pawleys Island, Murrels Inlet — he covers none of them. This market is functionally undefended.

**Port St. Lucie Grab Bar Specialists — Port St. Lucie, FL** | portstluciegrabbars.com
- Site: Divi theme with almost no rendered content — looks like an abandoned or minimally maintained site
- Content gaps: **No phone number visible, no address, no testimonials, no blog, no pricing. Strong domain name, empty website.**
- How to beat: Immediately — any real page beats this

**ADA Grab Bars & Safety Rails — Las Vegas, NV** | adagrabbarssafetyrails.com
- Site: ECONNREFUSED — site is unreachable
- Reviews: Near zero despite owning multiple domains
- Content gaps: **Site is down. Zero reviews. 101,000+ seniors in Las Vegas with no functioning specialist website.**
- How to beat: Get one partner with a working phone number and 10 Google reviews and the market flips

**The Grab Bar Guy FL — Sarasota, FL** | thegrabbarguyfl.com
- Site: Functional but minimal — no city pages, no pricing, no testimonials, no blog
- Content gaps: **Ownership transferred 2024 — active marketing has likely dropped. No city-specific landing pages despite "Punta Gorda to Sun City" service area claim.**
- How to beat: Build the city pages they don't have (Venice, North Port, Englewood, Osprey, Nokomis, Palmetto)

**Arizona Grab Bar — Phoenix, AZ** | arizonagrabbar.com
- Site: Dated, text-heavy, no city pages for Phoenix metro, no blog, no schema
- Content gaps: **"The Valley's Most Trusted" claim with no digital evidence. No city pages for Chandler, Gilbert, Tempe, Glendale, Peoria, Scottsdale, Mesa — all part of their service area.**
- How to beat: Build suburb-specific pages for Phoenix metro — they cover none of them

**Grab Bar Plus — Clearwater, FL** | grabbarplus.com
- Site: ECONNREFUSED — site down or unreachable
- Owner: Gary Zimmerman, sole proprietor since 2005, not BBB accredited
- How to beat: Site is unreachable — Clearwater/St. Pete is open

**Tampa Stronghold Grab Bars — Wesley Chapel, FL** | tampastrongholdgrabbars.com
- Site: ECONNREFUSED — site down or unreachable
- How to beat: Site is unreachable — verify if still in business before pursuing as partner

---

### Content Gap Summary — What Every Competitor Is Missing

These are the gaps that exist across nearly every market. SafeBath should build all of these for every target city:

| Content Type | % of Competitors Missing It | Why It Matters |
|---|---|---|
| Blog / educational content | ~90% | Captures "how much does grab bar cost" + "best grab bar for shower" queries |
| Transparent pricing page | ~95% | Ranks for "[city] grab bar installation cost" — high-intent queries |
| Neighborhood-level city pages | ~85% | e.g., "grab bar installation Westchase Tampa" vs just "Tampa" |
| FAQ schema markup | ~95% | Generates rich snippets in Google |
| CAPS certification mention | ~85% | Top trust signal; top-ranked operators all have it |
| Before/after photo gallery | ~80% | Conversion signal; also helps image search |
| Video content | ~99% | Almost no one has it — YouTube can rank separately |
| Schema on service+city pages | ~90% | areaServed, ServiceType, priceRange markup |

---

### Action Items for Phase 8

- [x] Add target cities to `constants.ts` — **Las Vegas NV (10 cities) and Myrtle Beach SC (10 cities) LIVE as of March 13, 2026**
- [x] Market-specific phone numbers: (725) 425-7383 for LV, (854) 246-2882 for MB — routing to pages, Header, Footer, schema
- [x] Call forwarding set up — both numbers forward to main line until partners are recruited
- [x] Sitemap, llms.txt, nav updated automatically
- [ ] Decide lead gen pricing model: pay-per-lead ($25–$50 flat) vs. % of job value (10–15%)
- [ ] Draft one-page partner agreement template (response SLA, review request, exit clause)
- [ ] Recruit first partner: search CAPS directory (nahb.org) for Myrtle Beach SC + Las Vegas NV
- [ ] Call 3 OT/PT clinics in target markets — ask who they refer patients to
- [ ] Build GHL pipeline: New Lead → Geography → Partner Assigned → Fulfilled / Lost
- [ ] Update out-of-area page CTA: "Get Connected to a Local Installer — Free Consultation"
- [ ] For every new city: add pricing page, blog post targeting "[city] grab bar cost", neighborhood sub-pages
- [ ] Send first 5 leads free to any new partner — prove value before asking for payment
- [ ] Add remaining target cities: Prescott AZ, Hilton Head SC, Palm Springs CA, Boca Raton FL, Delray Beach FL, Clearwater FL, Charlotte NC, Tucson AZ

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
