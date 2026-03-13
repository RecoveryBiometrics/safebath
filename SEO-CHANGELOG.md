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
