# SafeBath SEO Change Log

> **Purpose:** Track every SEO change made to the site — what was done, when it was deployed, and when to check results. Check this file before making changes to avoid reverting work that hasn't had time to take effect.

## Ground Rules
- SEO changes take **6–12 weeks** to fully show in rankings
- Schema changes and internal links can index faster (2–4 weeks) but position changes are slower
- Do NOT reverse or contradict a change until at least 8 weeks have passed
- Baseline (Dec 2025 – Mar 2026): **57 clicks | 3,548 impressions | 1.6% CTR | avg pos 27.9**
- Next measurement: pull Search Console data the week of **May 5, 2026** (8 weeks from site launch)

---

## Change Log

---

### 2026-03-11 — Phase 1: New Pages + Meta Optimizations

**Type:** New pages + on-page SEO

**URLs affected:** `/`, `/grab-bar-installation`, `/bathroom-safety-rockville-*`, `/bathroom-safety-lansdale-*`, `/bathroom-safety-lancaster-*`, `/bathroom-safety-bethesda-*`, `/bathroom-safety-west-chester-*`, `/bathroom-safety-philadelphia-*`, `/bathroom-safety-horsham-*`, `/bathroom-safety-wilmington-*`, `/bathroom-safety-montgomery-county-*`, `/bathroom-safety-west-philadelphia-*`

**What was deployed:**
- New city pages: Rockville MD, Lansdale PA, Lancaster PA, Bethesda MD (grab bar + railing)
- Hub page: `/grab-bar-installation/` targeting generic "near me" grab bar queries
- ~150 auto-generated pages from adding Montgomery County MD (10 cities) and Lancaster County PA (10 cities)
- Homepage title updated: `Grab Bar Installation PA, DE & MD | 20-Year Local Experts | (610) 840-6371`
- 9 key pages given custom title + meta: West Chester, Philadelphia, Horsham, Wilmington, Rockville, Lancaster, Lansdale, Montgomery County
- "Handicap grab bars" H2 section added to Philadelphia + West Philadelphia pages
- "Repair" language added to Montgomery County railing page (H2 + FAQ)
- Cannibalization fix: hub page targets generic terms, city pages link to it

**Expected impact:** Move pages from avg position 28 → top 10 for target cities within 8–12 weeks. Rockville and Lancaster pages have the highest potential (were already ranking ~pos 11–14 with no dedicated page).

**Check results:** Week of May 5, 2026

**Status:** 🟡 Pending — deployed March 11, indexing in progress

---

### 2026-03-11 — Phase 2: Conversion Optimization

**Type:** UX / conversion

**URLs affected:** `*` (all pages — site-wide template change)

**What was deployed:**
- Trust bar on every page: Licensed & Insured | 20 Years Experience | Lifetime Labor Warranty | ADA-Compliant
- Mobile click-to-call fixed — phone icon always visible in mobile header
- CTA rewritten site-wide to "Call for Same-Week Scheduling"

**Expected impact:** Improved CTR from search results (indirectly, via brand trust signals), better conversion rate from existing traffic. Not a direct ranking signal.

**Check results:** Ongoing — watch phone call volume

**Status:** 🟡 Pending

---

### 2026-03-12 — Internal Linking: Neighbors Fix

**Type:** Internal linking structure

**URLs affected:** `/bathroom-safety-*/*` (all city+service pages)

**What was deployed:**
- City+service pages now show **same-county cities** in the "Other Cities" section instead of random global cities (was using `LOCATIONS.slice(0,10)` which could put Lancaster cities on a Wilmington page)
- Added "View all [County] [Service] →" link from every city+service page up to the county service hub
- Affects all ~1,000 city+service pages via template change in `[location]/[service]/page.tsx`

**Expected impact:** Improved geographic relevance signals. Google uses these co-citation patterns to understand a business's local coverage area. Expect gradual improvement in county-level rankings over 8–12 weeks.

**Check results:** Week of June 10, 2026

**Status:** 🟡 Pending — deployed to `dev` branch, needs merge to `main`

---

### 2026-03-12 — Internal Linking: Hub-and-Spoke Links

**Type:** Internal linking structure

**URLs affected:** `/bathroom-safety-*/bathroom-grab-bar-installation` (all grab bar service pages)

**What was deployed:**
- All grab bar city+service pages now include a "Grab Bar Installation Resources" section with 3 links to `/grab-bar-installation` using varied descriptive anchor text:
  - "Professional grab bar installation — PA, DE & MD"
  - "Grab bar installation pricing & what's included"
  - "ADA-compliant grab bar installation services"
- Research confirmed: Google uses geolocation for "near me" queries — literal "near me" text in anchors has no ranking value. Descriptive keyword anchors are correct approach.

**Expected impact:** Hub page gains link equity from ~500 grab bar service pages. Should strengthen hub page rankings for generic grab bar queries. Timeline: 8–12 weeks.

**Check results:** Week of June 10, 2026

**Status:** 🟡 Pending — deployed to `dev` branch, needs merge to `main`

---

### 2026-03-12 — Schema: areaServed on Hub Page

**Type:** Structured data

**URLs affected:** `/grab-bar-installation`

**What was deployed:**
- Hub page (`/grab-bar-installation`) now has `HomeAndConstructionBusiness` JSON-LD schema
- Previously had **no schema at all** — this is a significant gap filled
- `areaServed` lists all 8 served counties (Chester County PA, Delaware County PA, Montgomery County PA, Philadelphia County PA, New Castle County DE, Cecil County MD, Montgomery County MD, Lancaster County PA)
- Also includes: `serviceType`, `priceRange`, `telephone`, `address`, `openingHours`

**Expected impact:** Improves eligibility for local pack / Map Pack results for hub-level queries. `areaServed` is a primary signal for service-area businesses. Timeline: 4–8 weeks to index, 8–12 weeks for ranking movement.

**Check results:** Week of May 26, 2026

**Status:** 🟡 Pending — deployed to `dev` branch, needs merge to `main`

---

### 2026-03-13 — Phase 8: National Expansion — Las Vegas NV + Myrtle Beach SC

**Type:** New market pages + multi-market phone routing

**URLs affected:** `/bathroom-safety-las-vegas-nv*`, `/bathroom-safety-henderson-nv*`, `/bathroom-safety-north-las-vegas-nv*`, `/bathroom-safety-summerlin-nv*`, `/bathroom-safety-boulder-city-nv*`, `/bathroom-safety-enterprise-nv*`, `/bathroom-safety-spring-valley-nv-nv*`, `/bathroom-safety-paradise-nv*`, `/bathroom-safety-sunrise-manor-nv*`, `/bathroom-safety-mesquite-nv*`, `/bathroom-safety-clark-county-nv*`, `/bathroom-safety-myrtle-beach-sc*`, `/bathroom-safety-north-myrtle-beach-sc*`, `/bathroom-safety-conway-sc*`, `/bathroom-safety-surfside-beach-sc*`, `/bathroom-safety-murrells-inlet-sc*`, `/bathroom-safety-little-river-sc*`, `/bathroom-safety-garden-city-sc*`, `/bathroom-safety-carolina-forest-sc*`, `/bathroom-safety-loris-sc*`, `/bathroom-safety-aynor-sc*`, `/bathroom-safety-horry-county-sc*`

**What was deployed:**
- Clark County NV: 10 cities (Las Vegas, Henderson, North Las Vegas, Boulder City, Summerlin, Enterprise, Spring Valley, Paradise, Sunrise Manor, Mesquite)
- Horry County SC: 10 cities (Myrtle Beach, North Myrtle Beach, Conway, Surfside Beach, Murrells Inlet, Little River, Garden City, Carolina Forest, Loris, Aynor)
- ~177 new pages total (city pages + city×service pages + county pages + county×service pages)
- Market-specific phone numbers on all new pages: (725) 425-7383 for NV, (854) 246-2882 for SC
- Dynamic phone routing in Header, Footer, page CTAs, and JSON-LD schema
- Nav dropdown and footer show shortened county names (no state suffix)
- Updated llms.txt with new markets and phone numbers
- Total site: 1,427 pages (up from 1,250)

**Expected impact:** New market entry — these pages start from zero. Expect initial indexing within 1–2 weeks. Position movement in 8–12 weeks. Las Vegas and Myrtle Beach are identified as underserved markets with weak/no competition.

**Check results:** Week of May 26, 2026

**Status:** 🟡 Pending — deployed March 13, awaiting indexing

---

### 2026-04-02 — www → non-www 301 Redirect (Canonical Fix)

**Type:** Technical SEO / domain canonicalization

**URLs affected:** All pages — site-wide edge redirect via `vercel.json`

**What was deployed:**
- Added 301 redirect from `www.safebathgrabbar.com/*` → `safebathgrabbar.com/*` at Vercel edge
- Google was indexing both www and non-www as separate pages, splitting authority
- Homepage alone had 310 impressions on www + 243 on non-www = 553 total, split across two competing URLs
- Several other pages (Philly County, grab bar hub) also appeared under www

**Expected impact:** Consolidation of all link equity and authority onto single canonical domain. Should help all pages, especially homepage (currently pos 18-20). This is the single highest-impact technical fix — all other SEO work was being diluted by this split. Timeline: 2-4 weeks for Google to consolidate.

**Check results:** Week of April 21, 2026

**Status:** 🟡 Deployed — monitoring consolidation

---

### 2026-04-02 — GA4 Analytics (G-M1Q5T7BLG2)

**Type:** Analytics / tracking

**URLs affected:** All pages — added to root layout

**What was deployed:**
- Added Google Analytics 4 tracking via `next/script` with `afterInteractive` strategy
- Measurement ID: G-M1Q5T7BLG2
- Enhanced measurement on: page views, scrolls, outbound clicks, file downloads, phone link clicks
- No analytics existed before this — zero visibility into post-click behavior

**Expected impact:** No ranking impact (analytics doesn't affect SEO). Provides conversion data, bounce rates, phone click tracking needed to evaluate page effectiveness.

**Status:** ✅ Live

---

### 2026-04-02 — Internal Linking Overhaul (All Page Types)

**Type:** Internal linking structure

**URLs affected:** All city pages (167), all city+service pages (~1,500), all county pages (9), homepage

**What was deployed:**
- **City pages:** New "Bathroom Safety Across [County]" section with contextual link to parent county page + up to 12 neighboring city links as pill buttons
- **Service pages:** Added county landing page link ("All bathroom safety services in [County]"), services page link, directory link, and homepage link in Learn More section
- **County pages:** New 3-column footer section with links to other counties, popular service combos (grab bar, shower seat, railing for that county), and resources (homepage, hub page, directory)
- **Homepage:** Added missing H2 "Why Homeowners Trust SafeBath" before value prop section (fixes heading hierarchy gap: H1 → H3 was skipping H2)

**Expected impact:** Significantly improved internal link equity flow. Every city page now passes authority up to its county page. Every service page links to county landing, services hub, directory, and homepage. County pages cross-link to each other. This directly addresses the weak internal linking that was limiting county page rankings (Chester County at pos 10.2 had only nav links pointing to it). Timeline: 4-8 weeks for full effect.

**Check results:** Week of May 14, 2026

**Status:** 🟡 Deployed — monitoring

---

### 2026-04-02 — Chester County Metadata Optimization

**Type:** On-page SEO

**URLs affected:** `/bathroom-safety-chester-county-pa`, all other county landing pages

**What was deployed:**
- Chester County title: `Grab Bar & Bathroom Safety Installation in Chester County, PA | Up to $22K in Grant Programs`
- Chester County meta description: mentions CCHMP grant ($22,000) and PA Whole-Home Repair Program specifically
- All other county titles updated from generic "Bathroom Safety Experts in [County]" to "Grab Bar & Bathroom Safety Installation in [County] | Licensed Local Experts"
- All other county meta descriptions updated with specific trust signals (ADA-compliant, 20+ years, lifetime warranty)

**Expected impact:** Chester County is the closest page to page 1 (pos 10.2, 65 impressions). The grant program mention differentiates from competitors and should improve CTR. Timeline: 4-8 weeks.

**Check results:** Week of May 14, 2026

**Status:** 🟡 Deployed — monitoring

---

### 2026-04-02 — SEO Agent Updates (Full Data Pull + Slack Delivery)

**Type:** Infrastructure / reporting

**What was changed:**
- `fetch-gsc.js`: rowLimit 500 → 25,000 (pull all data)
- `inspect.js`: Now inspects ALL 2,052 pages from sitemap every run (was batching 200/week from stale March 14 baseline of 708 URLs)
- `inspect.js`: Reads from live Next.js sitemap instead of hardcoded markdown baseline
- `index.js` + new `slack.js`: Weekly report now posts to Slack #safebath instead of email
- `report.js`: Updated labels (no more "batch X of Y" language)
- `gsc-query.js`: Fixed output path bug (was writing to wrong directory)

**Expected impact:** Accurate reporting — previous reports showed 12/200 indexed when GSC dashboard showed 176/1,500+. No ranking impact.

**Status:** ✅ Live (pending SLACK_BOT_TOKEN in GitHub Actions secrets for automated delivery)

---

## What's NOT Done Yet (Planned)

| Item | Priority | Expected Impact |
|------|----------|-----------------|
| GBP audit + service area + photos | 🔴 Highest | Map Pack rankings — biggest single lever |
| Review collection via GHL (50+ reviews) | 🔴 High | Map Pack prominence signal |
| `areaServed` schema on city+service pages (add county alongside city) | 🟡 Medium | Marginal schema improvement |
| Real local content for West Chester, Wilmington, Lansdale, Philly | 🟡 Medium | E-E-A-T + differentiated content signal |
| NE Philadelphia railing page — add 2 internal links (was pos 8.3) | 🟡 Medium | Could push to page 1 quickly |
| Review schema markup once reviews are collected | 🟡 Medium | Rich result eligibility |
| Google Search Console + Analytics API connections | 🟠 Phase 6 | Needed for automated SEO agent |
