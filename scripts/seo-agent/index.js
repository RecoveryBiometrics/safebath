require('dotenv').config();

const { fetchSearchConsoleData } = require('./fetch-gsc');
const { analyze } = require('./analyze');
const { generateReport } = require('./report');

async function run() {
  console.log('SafeBath SEO Agent starting...');

  if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    console.error('\n ERROR: GOOGLE_SERVICE_ACCOUNT_KEY is not set.');
    console.error(' See scripts/seo-agent/SETUP.md for setup instructions.\n');
    process.exit(1);
  }

  try {
    // 1. Fetch from Google Search Console
    console.log('\n[1/3] Fetching Search Console data...');
    const data = await fetchSearchConsoleData();

    // 2. Analyze
    console.log('[2/3] Analyzing...');
    const analysis = analyze(data);

    // 3. Generate report file
    console.log('[3/3] Generating report...');
    const { md, reportPath } = generateReport(data, analysis);

    // --- DELIVERY (choose one, uncomment when ready) ---

    // Option A: File only (current default)
    // Report is saved to seo-reports/YYYY-MM-DD.md — open it in Claude to review

    // Option B: Email via GHL
    // Requires GHL_API_KEY and GHL_LOCATION_ID env vars
    // const { sendViaGHL } = require('./deliver-ghl');
    // await sendViaGHL({ subject: `SafeBath SEO Report — ${new Date().toISOString().split('T')[0]}`, body: md });

    // Option C: GHL CRM conversation message
    // const { sendGHLMessage } = require('./deliver-ghl');
    // await sendGHLMessage({ contactId: 'OWNER_CONTACT_ID', message: md });

    // ---------------------------------------------------

    console.log('\nDone.');
    console.log(`  Clicks:       ${analysis.currentTotals.clicks}`);
    console.log(`  Impressions:  ${analysis.currentTotals.impressions}`);
    console.log(`  Avg position: ${analysis.currentTotals.avgPosition.toFixed(1)}`);
    console.log(`  Wins: ${analysis.wins.length}  |  Drops: ${analysis.drops.length}  |  Gaps: ${analysis.gaps.length}`);
    console.log(`  Report: ${reportPath}`);

  } catch (err) {
    console.error('\nSEO Agent failed:', err.message);
    if (process.env.DEBUG) console.error(err.stack);
    process.exit(1);
  }
}

run();
