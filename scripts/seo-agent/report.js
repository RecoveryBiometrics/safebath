const fs = require('fs');
const path = require('path');

const REPORTS_DIR = path.join(__dirname, '../../seo-reports');

// Baseline from Dec 2025 – Mar 2026 (first 90 days of site being live)
const BASELINE = {
  clicks: 57,
  impressions: 3548,
  ctr: 0.016,
  avgPosition: 27.9,
  period: 'Dec 2025 – Mar 2026',
};

// All SEO changes that need time to take effect — update this when new changes deploy
const PENDING_CHANGES = [
  { label: 'Phase 1 & 2: new pages, metas, trust bar, CTA', deployed: '2026-03-11' },
  { label: 'Internal linking: same-county neighbors fix', deployed: '2026-03-12' },
  { label: 'Hub-and-spoke links (grab bar pages → hub)', deployed: '2026-03-12' },
  { label: 'Hub page schema: HomeAndConstructionBusiness + areaServed', deployed: '2026-03-12' },
];

function weeksSince(dateStr) {
  const ms = Date.now() - new Date(dateStr).getTime();
  return Math.floor(ms / (7 * 24 * 60 * 60 * 1000));
}

function fmt(n) {
  return typeof n === 'number' ? n.toFixed(1) : 'N/A';
}

function pctChange(current, prior) {
  if (!prior || prior === 0) return '';
  const pct = ((current - prior) / prior) * 100;
  const sign = pct >= 0 ? '+' : '';
  return ` (${sign}${pct.toFixed(1)}%)`;
}

function generateReport(data, analysis) {
  const date = new Date().toISOString().split('T')[0];
  const { currentTotals, priorTotals, wins, drops, opportunities, gaps } = analysis;

  let md = `# SafeBath SEO Report — ${date}\n\n`;
  md += `> Auto-generated from Google Search Console\n`;
  md += `> **Current period:** ${data.currentPeriod.startDate} → ${data.currentPeriod.endDate}\n`;
  md += `> **Prior period:** ${data.priorPeriod.startDate} → ${data.priorPeriod.endDate}\n\n`;
  md += `---\n\n`;

  // Summary table
  md += `## Summary\n\n`;
  md += `| Metric | This Period | Prior 28 Days | Baseline (${BASELINE.period}) |\n`;
  md += `|--------|-------------|---------------|----------------------------|\n`;
  md += `| Clicks | **${currentTotals.clicks}** | ${priorTotals.clicks}${pctChange(currentTotals.clicks, priorTotals.clicks)} | ${BASELINE.clicks} |\n`;
  md += `| Impressions | **${currentTotals.impressions}** | ${priorTotals.impressions}${pctChange(currentTotals.impressions, priorTotals.impressions)} | ${BASELINE.impressions} |\n`;
  md += `| CTR | **${(currentTotals.ctr * 100).toFixed(2)}%** | ${(priorTotals.ctr * 100).toFixed(2)}% | ${(BASELINE.ctr * 100).toFixed(1)}% |\n`;
  md += `| Avg Position | **${fmt(currentTotals.avgPosition)}** | — | ${BASELINE.avgPosition} |\n`;
  md += `| Pages tracked | ${analysis.pageCount} | — | — |\n\n`;

  // Wins
  if (wins.length > 0) {
    md += `## Wins — Pages Moving Up\n\n`;
    md += `| Page | Now | Was | Change | Clicks |\n`;
    md += `|------|-----|-----|--------|--------|\n`;
    for (const w of wins) {
      const slug = w.url.replace('https://safebathgrabbar.com', '') || '/';
      md += `| ${slug} | ${fmt(w.position)} | ${fmt(w.priorPosition)} | **+${fmt(w.positionDelta)}** | ${w.clicks} |\n`;
    }
    md += '\n';
  }

  // Drops
  if (drops.length > 0) {
    md += `## Drops — Pages Moving Down\n\n`;
    md += `_Check SEO-CHANGELOG.md before acting — these may reflect a recent change that needs more time._\n\n`;
    md += `| Page | Now | Was | Change | Impressions |\n`;
    md += `|------|-----|-----|--------|-------------|\n`;
    for (const d of drops) {
      const slug = d.url.replace('https://safebathgrabbar.com', '') || '/';
      md += `| ${slug} | ${fmt(d.position)} | ${fmt(d.priorPosition)} | **${fmt(d.positionDelta)}** | ${d.impressions} |\n`;
    }
    md += '\n';
  }

  // Opportunities
  if (opportunities.length > 0) {
    md += `## Opportunities — Close to Page 1 (Positions 8–20)\n\n`;
    md += `_These pages are close. Better title/meta or 2 internal links could push them to page 1._\n\n`;
    md += `| Page | Position | Impressions | CTR |\n`;
    md += `|------|----------|-------------|-----|\n`;
    for (const o of opportunities) {
      const slug = o.keys[0].replace('https://safebathgrabbar.com', '') || '/';
      md += `| ${slug} | ${fmt(o.position)} | ${o.impressions} | ${(o.ctr * 100).toFixed(2)}% |\n`;
    }
    md += '\n';
  }

  // Gaps
  if (gaps.length > 0) {
    md += `## Gaps — Queries With No Dedicated Page\n\n`;
    md += `_High impressions, zero clicks. Each is a candidate for a new city/service page._\n\n`;
    md += `| Query | Impressions | Avg Position |\n`;
    md += `|-------|-------------|-------------|\n`;
    for (const g of gaps) {
      md += `| ${g.keys[0]} | ${g.impressions} | ${fmt(g.position)} |\n`;
    }
    md += '\n';
  }

  // Pending changes status
  md += `## Pending Changes — Do Not Reverse Yet\n\n`;
  md += `| Change | Deployed | Weeks Elapsed | Evaluation Status |\n`;
  md += `|--------|----------|---------------|-------------------|\n`;
  for (const c of PENDING_CHANGES) {
    const weeks = weeksSince(c.deployed);
    const status = weeks < 8 ? '🟡 Too early to evaluate' : weeks < 12 ? '🔵 Evaluating' : '✅ Ready to assess';
    md += `| ${c.label} | ${c.deployed} | ${weeks} | ${status} |\n`;
  }
  md += '\n';

  md += `---\n\n_Next report generated automatically next Tuesday at 9am ET_\n`;
  md += `_To add delivery via email or GHL, see scripts/seo-agent/index.js — delivery section_\n`;

  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const reportPath = path.join(REPORTS_DIR, `${date}.md`);
  fs.writeFileSync(reportPath, md);
  console.log(`Report saved → seo-reports/${date}.md`);
  return { md, reportPath };
}

module.exports = { generateReport };
