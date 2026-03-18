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

const CHANGELOG_PATH = path.join(__dirname, '../../SEO-CHANGELOG.md');

/**
 * Parse SEO-CHANGELOG.md to extract deployed changes and their status.
 * Each entry starts with ### YYYY-MM-DD — Title and has **Status:** line.
 */
function parsePendingChanges() {
  if (!fs.existsSync(CHANGELOG_PATH)) {
    console.warn('SEO-CHANGELOG.md not found — pending changes section will be empty');
    return [];
  }

  const content = fs.readFileSync(CHANGELOG_PATH, 'utf8');
  const entries = [];
  const entryPattern = /^### (\d{4}-\d{2}-\d{2}) — (.+)$/gm;

  let match;
  while ((match = entryPattern.exec(content)) !== null) {
    const deployed = match[1];
    const label = match[2].trim();
    const entryStart = match.index;

    // Find the status line within this entry (before the next ### or end of file)
    const nextEntry = content.indexOf('\n### ', entryStart + 1);
    const entryBlock = nextEntry !== -1
      ? content.slice(entryStart, nextEntry)
      : content.slice(entryStart);

    const statusMatch = entryBlock.match(/\*\*Status:\*\*\s*(.+)/);
    const status = statusMatch ? statusMatch[1].trim() : '';

    // Only include entries that are still pending (not marked ✅ complete)
    const isComplete = status.startsWith('✅') && /complete|done|assessed/i.test(status);
    entries.push({ label, deployed, status, isComplete });
  }

  return entries;
}

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

function generateReport(data, analysis, interpretation, reviewResult, inspection) {
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

  // Indexing Status (from URL Inspection API)
  if (inspection && !inspection.skipped && inspection.summary) {
    const s = inspection.summary;
    md += `## Indexing Status — Crawled-Not-Indexed Tracker\n\n`;
    md += `> Checked ${s.batchSize} pages this run (batch ${s.batchRange} of ${s.totalTracked} tracked)\n\n`;
    md += `| Status | Count |\n`;
    md += `|--------|-------|\n`;
    md += `| Indexed (PASS) | **${s.indexed}** |\n`;
    md += `| Not Indexed | ${s.notIndexed} |\n`;
    md += `| Errors | ${s.errors} |\n\n`;

    // Show newly indexed pages (wins!)
    const newlyIndexed = inspection.inspected.filter(r => r.verdict === 'PASS');
    if (newlyIndexed.length > 0) {
      md += `### Newly Indexed Pages\n\n`;
      md += `_These pages were on the not-indexed list but are now indexed._\n\n`;
      for (const p of newlyIndexed) {
        const slug = p.url.replace('https://safebathgrabbar.com', '') || '/';
        md += `- ${slug}\n`;
      }
      md += '\n';
    }

    // Show pages still not indexed with last crawl info
    const stillNotIndexed = inspection.inspected.filter(
      r => r.verdict !== 'PASS' && r.verdict !== 'ERROR'
    );
    if (stillNotIndexed.length > 0) {
      md += `### Still Not Indexed (${stillNotIndexed.length} pages)\n\n`;
      md += `| Page | Coverage State | Last Crawl | Fetch Status |\n`;
      md += `|------|---------------|------------|-------------|\n`;
      const show = stillNotIndexed.slice(0, 20); // Cap at 20 in report
      for (const p of show) {
        const slug = p.url.replace('https://safebathgrabbar.com', '') || '/';
        const crawl = p.lastCrawlTime ? p.lastCrawlTime.split('T')[0] : '—';
        md += `| ${slug} | ${p.coverageState} | ${crawl} | ${p.pageFetchState || '—'} |\n`;
      }
      if (stillNotIndexed.length > 20) {
        md += `| _...and ${stillNotIndexed.length - 20} more_ | | | |\n`;
      }
      md += '\n';
    }

    // Load cumulative stats if available
    const cumulativePath = path.join(__dirname, '../../seo-data/inspect-cumulative.json');
    if (fs.existsSync(cumulativePath)) {
      const cum = JSON.parse(fs.readFileSync(cumulativePath, 'utf8'));
      md += `### Cumulative Progress\n\n`;
      md += `| Metric | Value |\n`;
      md += `|--------|-------|\n`;
      md += `| Total URLs inspected (all time) | ${cum.totalInspected} |\n`;
      md += `| Currently indexed | **${cum.indexed}** |\n`;
      md += `| Still not indexed | ${cum.notIndexed} |\n`;
      md += `| Index rate | ${cum.totalInspected > 0 ? ((cum.indexed / cum.totalInspected) * 100).toFixed(1) : 0}% |\n\n`;
    }
  }

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

  // --- INTERPRETATION: What's working and why ---
  if (interpretation && reviewResult) {
    md += `## Analysis — What's Working (and What's Not)\n\n`;
    md += `> **Overall confidence:** ${reviewResult.overallConfidence}\n`;
    md += `> Attributed: ${reviewResult.stats.totalAttributed} pages | Unattributed: ${reviewResult.stats.totalUnattributed} pages | Warnings: ${reviewResult.stats.warningCount}\n\n`;

    // Attributions
    if (interpretation.attributions.length > 0) {
      md += `### Changes Linked to Page Movement\n\n`;
      for (const attr of interpretation.attributions) {
        const arrow = attr.direction === 'up' ? '📈' : '📉';
        const deltaSign = attr.direction === 'up' ? '+' : '';
        md += `**${arrow} ${attr.url}** — position ${fmt(attr.positionWas)} → ${fmt(attr.positionNow)} (${deltaSign}${fmt(attr.delta)})\n`;
        md += `- **Likely cause:** ${attr.likelyCause.change} _(deployed ${attr.likelyCause.deployed}, ${attr.likelyCause.weeksAgo} weeks ago)_\n`;
        md += `- **Confidence:** ${attr.likelyCause.confidence.toUpperCase()} — ${attr.likelyCause.reason}\n`;
        if (attr.allMatchingChanges.length > 1) {
          md += `- **Also matched:** ${attr.allMatchingChanges.slice(1).map(c => c.change).join(', ')}\n`;
        }
        md += '\n';
      }
    }

    // Unattributed
    if (interpretation.unattributed.length > 0) {
      md += `### Unattributed Movement (No Matching Change)\n\n`;
      md += `_These pages moved but don't match any logged SEO change. Could be algorithm updates, competitor changes, or external links._\n\n`;
      md += `| Page | Direction | Delta | Impressions |\n`;
      md += `|------|-----------|-------|-------------|\n`;
      for (const u of interpretation.unattributed) {
        const dir = u.direction === 'up' ? '↑' : '↓';
        md += `| ${u.url} | ${dir} | ${fmt(Math.abs(u.delta))} | ${u.impressions} |\n`;
      }
      md += '\n';
    }

    // Boosted opportunities
    if (interpretation.boostedOpportunities.length > 0) {
      md += `### Opportunities Boosted by Recent Changes\n\n`;
      md += `_These pages are close to page 1 AND were affected by a recent change. A small push could get them there._\n\n`;
      for (const opp of interpretation.boostedOpportunities) {
        md += `- **${opp.url}** — position ${fmt(opp.position)}, ${opp.impressions} impressions. Affected by "${opp.change}" (${opp.weeksAgo} weeks ago)\n`;
      }
      md += '\n';
    }

    // Warnings from review agent
    if (reviewResult.warnings.length > 0) {
      md += `### ⚠️ Review Warnings\n\n`;
      for (const w of reviewResult.warnings) {
        const icon = w.severity === 'high' ? '🔴' : '🟡';
        md += `${icon} **${w.type.replace(/_/g, ' ').toUpperCase()}:** ${w.message}\n\n`;
      }
    }

    // Insights from review agent
    if (reviewResult.insights.length > 0) {
      md += `### 💡 Insights\n\n`;
      for (const i of reviewResult.insights) {
        const icon = i.actionable ? '👉' : 'ℹ️';
        md += `${icon} ${i.message}\n\n`;
      }
    }
  }

  // Pending changes status — parsed from SEO-CHANGELOG.md
  const allChanges = parsePendingChanges();
  const pending = allChanges.filter(c => !c.isComplete);
  const completed = allChanges.filter(c => c.isComplete);

  if (pending.length > 0) {
    md += `## Pending Changes — Do Not Reverse Yet\n\n`;
    md += `| Change | Deployed | Weeks Elapsed | Evaluation Status |\n`;
    md += `|--------|----------|---------------|-------------------|\n`;
    for (const c of pending) {
      const weeks = weeksSince(c.deployed);
      const evalStatus = weeks < 8 ? '🟡 Too early to evaluate' : weeks < 12 ? '🔵 Evaluating' : '✅ Ready to assess';
      md += `| ${c.label} | ${c.deployed} | ${weeks} | ${evalStatus} |\n`;
    }
    md += '\n';
  }

  if (completed.length > 0) {
    md += `## Completed Changes\n\n`;
    md += `| Change | Deployed | Weeks Ago |\n`;
    md += `|--------|----------|-----------|\n`;
    for (const c of completed) {
      md += `| ${c.label} | ${c.deployed} | ${weeksSince(c.deployed)} |\n`;
    }
    md += '\n';
  }

  md += `---\n\n_Next report generated automatically next Tuesday at 9am ET_\n`;
  md += `_To add delivery via email or GHL, see scripts/seo-agent/index.js — delivery section_\n`;

  if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

  const reportPath = path.join(REPORTS_DIR, `${date}.md`);
  fs.writeFileSync(reportPath, md);
  console.log(`Report saved → seo-reports/${date}.md`);
  return { md, reportPath };
}

/**
 * Generate a plain-English email body (no markdown tables or formatting).
 * Same data as the markdown report, but written in readable paragraphs.
 */
function generateEmailBody(data, analysis, interpretation, reviewResult, inspection) {
  const date = new Date().toISOString().split('T')[0];
  const { currentTotals, priorTotals, wins, drops, opportunities, gaps } = analysis;

  let out = `SafeBath SEO Report — ${date}\n\n`;
  out += `Here's your weekly SEO update for safebathgrabbar.com.\n\n`;

  // --- Summary ---
  out += `TRAFFIC OVERVIEW\n\n`;

  const clickChange = pctChange(currentTotals.clicks, priorTotals.clicks);
  const impChange = pctChange(currentTotals.impressions, priorTotals.impressions);

  out += `Over the last 28 days, the site got ${currentTotals.clicks} clicks`;
  out += priorTotals.clicks ? ` (compared to ${priorTotals.clicks} last period${clickChange})` : '';
  out += `. Back when the site launched (${BASELINE.period}), you were getting about ${BASELINE.clicks} clicks, so `;
  out += currentTotals.clicks > BASELINE.clicks
    ? `that's solid growth.\n\n`
    : `there's room to grow.\n\n`;

  out += `Impressions (how often the site appeared in search results) were ${currentTotals.impressions}`;
  out += priorTotals.impressions ? `${impChange} vs. last period` : '';
  out += `. Click-through rate is ${(currentTotals.ctr * 100).toFixed(2)}%`;
  out += ` and average position is ${fmt(currentTotals.avgPosition)}. We're tracking ${analysis.pageCount} pages total.\n\n`;

  // --- Indexing ---
  if (inspection && !inspection.skipped && inspection.summary) {
    const s = inspection.summary;
    out += `INDEXING STATUS\n\n`;
    out += `We checked ${s.batchSize} pages this week. ${s.indexed} are indexed by Google and ${s.notIndexed} still aren't.`;
    if (s.errors > 0) out += ` There were ${s.errors} errors during inspection.`;
    out += `\n\n`;

    const newlyIndexed = inspection.inspected.filter(r => r.verdict === 'PASS');
    if (newlyIndexed.length > 0) {
      out += `Good news: ${newlyIndexed.length} page${newlyIndexed.length > 1 ? 's' : ''} that ${newlyIndexed.length > 1 ? 'were' : 'was'} previously not indexed ${newlyIndexed.length > 1 ? 'are' : 'is'} now showing up in Google:\n`;
      for (const p of newlyIndexed) {
        const slug = p.url.replace('https://safebathgrabbar.com', '') || '/';
        out += `  - ${slug}\n`;
      }
      out += `\n`;
    }

    const stillNotIndexed = inspection.inspected.filter(
      r => r.verdict !== 'PASS' && r.verdict !== 'ERROR'
    );
    if (stillNotIndexed.length > 0) {
      out += `${stillNotIndexed.length} page${stillNotIndexed.length > 1 ? 's are' : ' is'} still not indexed. `;
      out += `Google has crawled them but hasn't added them to search results yet. This is normal for newer pages — they usually get picked up over time.\n\n`;
    }

    const cumulativePath = path.join(__dirname, '../../seo-data/inspect-cumulative.json');
    if (fs.existsSync(cumulativePath)) {
      const cum = JSON.parse(fs.readFileSync(cumulativePath, 'utf8'));
      const rate = cum.totalInspected > 0 ? ((cum.indexed / cum.totalInspected) * 100).toFixed(1) : 0;
      out += `Overall, ${cum.indexed} out of ${cum.totalInspected} total tracked pages are indexed (${rate}% index rate).\n\n`;
    }
  }

  // --- Wins ---
  if (wins.length > 0) {
    out += `PAGES MOVING UP\n\n`;
    out += `${wins.length} page${wins.length > 1 ? 's' : ''} improved in search rankings this period:\n\n`;
    for (const w of wins) {
      const slug = w.url.replace('https://safebathgrabbar.com', '') || '/';
      out += `  ${slug} moved from position ${fmt(w.priorPosition)} to ${fmt(w.position)} (up ${fmt(w.positionDelta)} spots, ${w.clicks} click${w.clicks !== 1 ? 's' : ''})\n`;
    }
    out += `\n`;
  }

  // --- Drops ---
  if (drops.length > 0) {
    out += `PAGES THAT DROPPED\n\n`;
    out += `${drops.length} page${drops.length > 1 ? 's' : ''} lost ranking this period. Don't panic — some movement is normal, and recent SEO changes can take a few weeks to settle:\n\n`;
    for (const d of drops) {
      const slug = d.url.replace('https://safebathgrabbar.com', '') || '/';
      out += `  ${slug} went from position ${fmt(d.priorPosition)} to ${fmt(d.position)} (down ${fmt(Math.abs(d.positionDelta))} spots, ${d.impressions} impression${d.impressions !== 1 ? 's' : ''})\n`;
    }
    out += `\n`;
  }

  // --- Opportunities ---
  if (opportunities.length > 0) {
    out += `CLOSE TO PAGE 1\n\n`;
    out += `These pages are sitting between positions 8–20 in search results. They're close to page 1, and a little work (better title tags, a couple internal links) could push them over:\n\n`;
    for (const o of opportunities) {
      const slug = o.keys[0].replace('https://safebathgrabbar.com', '') || '/';
      out += `  ${slug} — position ${fmt(o.position)}, ${o.impressions} impressions, ${(o.ctr * 100).toFixed(2)}% CTR\n`;
    }
    out += `\n`;
  }

  // --- Gaps ---
  if (gaps.length > 0) {
    out += `MISSING PAGES\n\n`;
    out += `People are searching for these terms and seeing the site, but nobody is clicking. These could be good candidates for new dedicated pages:\n\n`;
    for (const g of gaps) {
      out += `  "${g.keys[0]}" — ${g.impressions} impressions, average position ${fmt(g.position)}\n`;
    }
    out += `\n`;
  }

  // --- Interpretation / Analysis ---
  if (interpretation && reviewResult) {
    out += `ANALYSIS\n\n`;
    out += `Overall confidence in this week's analysis: ${reviewResult.overallConfidence}. `;
    out += `We were able to link ${reviewResult.stats.totalAttributed} page movement${reviewResult.stats.totalAttributed !== 1 ? 's' : ''} to specific SEO changes we made. `;
    out += `${reviewResult.stats.totalUnattributed} movement${reviewResult.stats.totalUnattributed !== 1 ? 's' : ''} couldn't be explained by our changes (could be Google algorithm updates or competitor activity).\n\n`;

    if (interpretation.attributions.length > 0) {
      out += `Here's what we can connect to specific changes we made:\n\n`;
      for (const attr of interpretation.attributions) {
        const slug = attr.url.replace('https://safebathgrabbar.com', '') || attr.url;
        const dir = attr.direction === 'up' ? 'improved' : 'dropped';
        const deltaSign = attr.direction === 'up' ? 'up' : 'down';
        out += `  ${slug} ${dir} from position ${fmt(attr.positionWas)} to ${fmt(attr.positionNow)} (${deltaSign} ${fmt(Math.abs(attr.delta))}). `;
        out += `This is likely because of "${attr.likelyCause.change}" which we deployed ${attr.likelyCause.weeksAgo} week${attr.likelyCause.weeksAgo !== 1 ? 's' : ''} ago. `;
        out += `Confidence: ${attr.likelyCause.confidence}.\n\n`;
      }
    }

    if (interpretation.boostedOpportunities.length > 0) {
      out += `Some of our recent changes are helping pages that are close to page 1:\n\n`;
      for (const opp of interpretation.boostedOpportunities) {
        const slug = opp.url.replace('https://safebathgrabbar.com', '') || opp.url;
        out += `  ${slug} is at position ${fmt(opp.position)} with ${opp.impressions} impressions. Our "${opp.change}" change from ${opp.weeksAgo} weeks ago is helping it climb.\n`;
      }
      out += `\n`;
    }

    if (reviewResult.warnings.length > 0) {
      out += `THINGS TO WATCH\n\n`;
      for (const w of reviewResult.warnings) {
        out += `  - ${w.message}\n`;
      }
      out += `\n`;
    }

    if (reviewResult.insights.length > 0) {
      out += `RECOMMENDATIONS\n\n`;
      for (const i of reviewResult.insights) {
        out += `  - ${i.message}\n`;
      }
      out += `\n`;
    }
  }

  // --- Pending changes ---
  const allChanges = parsePendingChanges();
  const pending = allChanges.filter(c => !c.isComplete);

  if (pending.length > 0) {
    out += `CHANGES STILL COOKING\n\n`;
    out += `These are SEO changes we've made that haven't had enough time to fully show results yet. Don't reverse them — give them time:\n\n`;
    for (const c of pending) {
      const weeks = weeksSince(c.deployed);
      let status;
      if (weeks < 8) status = 'too early to evaluate';
      else if (weeks < 12) status = 'starting to see data';
      else status = 'ready to assess';
      out += `  "${c.label}" — deployed ${c.deployed} (${weeks} weeks ago, ${status})\n`;
    }
    out += `\n`;
  }

  out += `---\nNext report comes automatically next Tuesday at 9am ET.\n`;

  return out;
}

module.exports = { generateReport, generateEmailBody };
