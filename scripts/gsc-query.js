#!/usr/bin/env node
/**
 * GSC Local Query Script
 * Uses gcloud Application Default Credentials (ADC) to query Google Search Console.
 * Auth: williamcourterwelch@gmail.com via ADC
 * Property: sc-domain:safebathgrabbar.com
 */

const { google } = require('./seo-agent/node_modules/googleapis');
const fs = require('fs');
const path = require('path');

const SITE_URL = 'sc-domain:safebathgrabbar.com';
const QUOTA_PROJECT = 'safebath-seo-agent';

async function getAuth() {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
  });
  return auth;
}

async function querySearchAnalytics(auth, startDate, endDate) {
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const res = await searchconsole.searchanalytics.query({
    siteUrl: SITE_URL,
    requestBody: {
      startDate,
      endDate,
      dimensions: ['page'],
      rowLimit: 25000,
    },
    headers: { 'x-goog-user-project': QUOTA_PROJECT },
  });

  return res.data.rows || [];
}

async function main() {
  const command = process.argv[2] || 'test';

  console.log('🔍 GSC Local Query Tool');
  console.log(`   Property: ${SITE_URL}`);
  console.log(`   Auth: ADC (williamcourterwelch@gmail.com)`);
  console.log('');

  const auth = await getAuth();

  if (command === 'test') {
    // Simple test: pull last 7 days of data
    const end = new Date();
    end.setDate(end.getDate() - 2); // GSC data has 2-day lag
    const start = new Date(end);
    start.setDate(start.getDate() - 7);

    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];

    console.log(`📊 Test query: ${startDate} → ${endDate}`);
    const rows = await querySearchAnalytics(auth, startDate, endDate);

    console.log(`✅ Success! Got ${rows.length} pages with data.`);

    // Summary stats
    let totalClicks = 0, totalImpressions = 0;
    for (const row of rows) {
      totalClicks += row.clicks || 0;
      totalImpressions += row.impressions || 0;
    }
    console.log(`   Clicks: ${totalClicks}`);
    console.log(`   Impressions: ${totalImpressions}`);
    console.log(`   Pages with data: ${rows.length}`);

    // Show top 5
    const sorted = rows.sort((a, b) => b.impressions - a.impressions);
    console.log('\n📈 Top 5 pages by impressions:');
    for (const row of sorted.slice(0, 5)) {
      const url = row.keys[0].replace('https://safebathgrabbar.com', '');
      console.log(`   ${url} — ${row.clicks} clicks, ${row.impressions} impr, pos ${row.position.toFixed(1)}`);
    }

  } else if (command === 'not-indexed') {
    // Pull 28 days of data, find pages with 0 data (proxy for not-indexed)
    const end = new Date();
    end.setDate(end.getDate() - 2);
    const start = new Date(end);
    start.setDate(start.getDate() - 28);

    const startDate = start.toISOString().split('T')[0];
    const endDate = end.toISOString().split('T')[0];

    console.log(`📊 Fetching 28-day data: ${startDate} → ${endDate}`);
    const rows = await querySearchAnalytics(auth, startDate, endDate);

    // Pages that DO have GSC data (indexed and getting impressions)
    const pagesWithData = new Set(rows.map(r => r.keys[0]));
    console.log(`✅ Found ${pagesWithData.size} pages with Search Console data (likely indexed).`);

    // Load all known pages from sitemap or constants
    // For now, save the pages that DO have data
    const outputPath = path.join(__dirname, '..', 'seo-reports', `gsc-pages-with-data-${endDate}.json`);
    const output = {
      generatedAt: new Date().toISOString(),
      dateRange: { start: startDate, end: endDate },
      totalPagesWithData: pagesWithData.size,
      pages: rows.map(r => ({
        url: r.keys[0],
        clicks: r.clicks,
        impressions: r.impressions,
        ctr: r.ctr,
        position: r.position,
      })).sort((a, b) => b.impressions - a.impressions),
    };

    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`💾 Saved to ${outputPath}`);

    // Summary
    let totalClicks = 0, totalImpressions = 0;
    for (const row of rows) {
      totalClicks += row.clicks;
      totalImpressions += row.impressions;
    }
    console.log(`\n📊 28-day summary:`);
    console.log(`   Pages: ${pagesWithData.size}`);
    console.log(`   Clicks: ${totalClicks}`);
    console.log(`   Impressions: ${totalImpressions}`);

  } else {
    console.log('Usage:');
    console.log('  node gsc-query.js test          # Quick test (7 days)');
    console.log('  node gsc-query.js not-indexed    # Find pages without GSC data (28 days)');
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  if (err.message.includes('insufficient_scope') || err.message.includes('access_denied')) {
    console.error('\n💡 Fix: Run this to add the Search Console scope to your ADC:');
    console.error('   gcloud auth application-default login --scopes=https://www.googleapis.com/auth/webmasters.readonly,https://mail.google.com/,https://www.googleapis.com/auth/cloud-platform');
  }
  process.exit(1);
});
