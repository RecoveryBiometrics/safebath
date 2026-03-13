require('dotenv').config();

const { fetchSearchConsoleData } = require('./fetch-gsc');
const { analyze } = require('./analyze');
const { interpret } = require('./interpret');
const { review } = require('./review');
const { generateReport } = require('./report');
const { sendReport } = require('./email');

async function run() {
  console.log('SafeBath SEO Agent starting...');

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.error('\n ERROR: GOOGLE_SERVICE_ACCOUNT_KEY is not set.');
    console.error(' See scripts/seo-agent/SETUP.md for setup instructions.\n');
    process.exit(1);
  }

  try {
    // 1. Fetch from Google Search Console
    console.log('\n[1/5] Fetching Search Console data...');
    const data = await fetchSearchConsoleData();

    // 2. Analyze — find wins, drops, opportunities, gaps
    console.log('[2/5] Analyzing...');
    const analysis = analyze(data);

    // 3. Interpret — connect page movements to changelog entries
    console.log('[3/5] Interpreting — linking changes to results...');
    const interpretation = interpret(analysis, data);

    // 4. Review — second pass to validate interpretations
    console.log('[4/5] Reviewing — checking for false correlations...');
    const reviewResult = review(interpretation, analysis);

    // 5. Generate report file
    console.log('[5/5] Generating report...');
    const { md, reportPath } = generateReport(data, analysis, interpretation, reviewResult);

    // Email the report
    const date = new Date().toISOString().split('T')[0];
    await sendReport(`SafeBath SEO Report — ${date}`, md);

    console.log('\nDone.');
    console.log(`  Clicks:       ${analysis.currentTotals.clicks}`);
    console.log(`  Impressions:  ${analysis.currentTotals.impressions}`);
    console.log(`  Avg position: ${analysis.currentTotals.avgPosition.toFixed(1)}`);
    console.log(`  Wins: ${analysis.wins.length}  |  Drops: ${analysis.drops.length}  |  Gaps: ${analysis.gaps.length}`);
    console.log(`  Attributed: ${reviewResult.stats.totalAttributed}  |  Unattributed: ${reviewResult.stats.totalUnattributed}  |  Warnings: ${reviewResult.stats.warningCount}`);
    console.log(`  Overall confidence: ${reviewResult.overallConfidence}`);
    console.log(`  Report: ${reportPath}`);

  } catch (err) {
    console.error('\nSEO Agent failed:', err.message);
    if (process.env.DEBUG) console.error(err.stack);
    process.exit(1);
  }
}

run();
