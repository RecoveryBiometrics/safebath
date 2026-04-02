/**
 * SEO Agent Configuration
 *
 * All business-specific values live here. To run this pipeline for a
 * different business, set these environment variables — no code changes needed.
 *
 * Required env vars:
 *   GOOGLE_SERVICE_ACCOUNT_KEY  — Google service account JSON
 *   GSC_SITE_URL                — e.g. sc-domain:example.com
 *   SITE_BASE                   — e.g. https://example.com
 *   BUSINESS_NAME               — e.g. SafeBath Grab Bar
 *
 * Optional env vars (have sensible defaults):
 *   GA4_PROPERTY_ID, SLACK_CHANNEL_ID, SLACK_BOT_TOKEN,
 *   SITEMAP_URL, SITEMAP_PATH, CHANGELOG_PATH,
 *   BASELINE_CLICKS, BASELINE_IMPRESSIONS, etc.
 */

const path = require('path');

function required(name) {
  const val = process.env[name];
  if (!val) {
    console.error(`\n ERROR: ${name} is not set.`);
    console.error(` Set it in .env or as a GitHub Actions secret.\n`);
    process.exit(1);
  }
  return val;
}

const config = {
  // Business identity
  businessName: process.env.BUSINESS_NAME || 'SafeBath Grab Bar',

  // Google Search Console
  gscSiteUrl: process.env.GSC_SITE_URL || 'sc-domain:safebathgrabbar.com',

  // Google Analytics 4
  ga4PropertyId: process.env.GA4_PROPERTY_ID || '14299063401',

  // Site
  siteBase: process.env.SITE_BASE || 'https://safebathgrabbar.com',

  // Sitemap — either a URL to fetch or a local file path
  sitemapUrl: process.env.SITEMAP_URL || '',  // e.g. https://example.com/sitemap.xml
  sitemapPath: process.env.SITEMAP_PATH || path.join(__dirname, '../../../website/.next/server/app/sitemap.xml.body'),

  // Data directories
  dataDir: process.env.SEO_DATA_DIR || path.join(__dirname, '../../seo-data'),
  reportsDir: process.env.REPORTS_DIR || path.join(__dirname, '../../seo-reports'),

  // Changelog
  changelogPath: process.env.CHANGELOG_PATH || path.join(__dirname, '../../SEO-CHANGELOG.md'),

  // Slack
  slackChannelId: process.env.SLACK_CHANNEL_ID || 'C0AQCHCC2JW',
  slackBotToken: process.env.SLACK_BOT_TOKEN || '',

  // Baseline metrics (from site's first 90 days — used for comparison in reports)
  baseline: {
    clicks: parseInt(process.env.BASELINE_CLICKS || '57'),
    impressions: parseInt(process.env.BASELINE_IMPRESSIONS || '3548'),
    ctr: parseFloat(process.env.BASELINE_CTR || '0.016'),
    avgPosition: parseFloat(process.env.BASELINE_AVG_POSITION || '27.9'),
    period: process.env.BASELINE_PERIOD || 'Dec 2025 – Mar 2026',
  },
};

module.exports = config;
