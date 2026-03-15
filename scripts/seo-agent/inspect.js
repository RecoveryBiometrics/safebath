const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');
const { getAuthClient } = require('./auth');

const SITE_URL = process.env.GSC_SITE_URL || 'sc-domain:safebathgrabbar.com';
const DATA_DIR = path.join(__dirname, '../../seo-data');
const NOT_INDEXED_PATH = path.join(__dirname, '../../seo-reports/not-indexed-pages-2026-03-14.md');

// Inspect 200 pages per run to stay well within 2,000/day API limit.
// Full list (~700 pages) rotates through in ~4 weekly runs.
const BATCH_SIZE = 200;

// Delay between API calls to avoid rate limiting (ms)
const DELAY_MS = 150;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Parse the not-indexed baseline markdown file.
 * Returns array of URL paths like ['/bathroom-safety-philadelphia-pa/...', ...]
 */
function parseNotIndexedList() {
  if (!fs.existsSync(NOT_INDEXED_PATH)) {
    console.warn('Not-indexed baseline file not found — skipping inspection');
    return [];
  }
  const content = fs.readFileSync(NOT_INDEXED_PATH, 'utf8');
  const urls = [];
  for (const line of content.split('\n')) {
    const match = line.match(/^- \[[ x]\] (\/\S+)/);
    if (match) urls.push(match[1]);
  }
  return urls;
}

/**
 * Load previous inspection state to know where we left off.
 */
function loadState() {
  const statePath = path.join(DATA_DIR, 'inspect-state.json');
  if (fs.existsSync(statePath)) {
    return JSON.parse(fs.readFileSync(statePath, 'utf8'));
  }
  return { lastOffset: 0 };
}

function saveState(state) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(
    path.join(DATA_DIR, 'inspect-state.json'),
    JSON.stringify(state, null, 2)
  );
}

/**
 * Inspect a single URL via the URL Inspection API.
 * Returns simplified result object.
 */
async function inspectUrl(searchconsole, fullUrl) {
  try {
    const res = await searchconsole.urlInspection.index.inspect({
      requestBody: {
        inspectionUrl: fullUrl,
        siteUrl: SITE_URL,
      },
    });

    const result = res.data.inspectionResult;
    const index = result.indexStatusResult || {};

    return {
      url: fullUrl,
      verdict: index.verdict || 'UNKNOWN',
      coverageState: index.coverageState || 'Unknown',
      robotsTxtState: index.robotsTxtState || 'UNKNOWN',
      indexingState: index.indexingState || 'UNKNOWN',
      lastCrawlTime: index.lastCrawlTime || null,
      pageFetchState: index.pageFetchState || 'UNKNOWN',
      crawledAs: index.crawledAs || 'UNKNOWN',
      error: null,
    };
  } catch (err) {
    return {
      url: fullUrl,
      verdict: 'ERROR',
      coverageState: 'API Error',
      error: err.message,
    };
  }
}

/**
 * Run URL inspection on a batch of not-indexed pages.
 * Rotates through the full list across multiple runs.
 */
async function inspectPages() {
  const allPaths = parseNotIndexedList();
  if (allPaths.length === 0) {
    return { inspected: [], summary: null, skipped: true };
  }

  const state = loadState();
  let offset = state.lastOffset;

  // Wrap around if we've gone through the whole list
  if (offset >= allPaths.length) offset = 0;

  const batch = allPaths.slice(offset, offset + BATCH_SIZE);
  const nextOffset = offset + batch.length;

  console.log(`Inspecting ${batch.length} pages (${offset + 1}–${offset + batch.length} of ${allPaths.length})`);

  const auth = await getAuthClient();
  const searchconsole = google.searchconsole({ version: 'v1', auth });

  const results = [];
  for (let i = 0; i < batch.length; i++) {
    const urlPath = batch[i];
    const fullUrl = `https://safebathgrabbar.com${urlPath}`;

    if (i > 0) await sleep(DELAY_MS);

    const result = await inspectUrl(searchconsole, fullUrl);
    results.push(result);

    // Progress every 50
    if ((i + 1) % 50 === 0) {
      console.log(`  ...inspected ${i + 1}/${batch.length}`);
    }
  }

  // Summarize
  const indexed = results.filter(r => r.verdict === 'PASS').length;
  const notIndexed = results.filter(r => r.verdict === 'NEUTRAL' || r.verdict === 'FAIL').length;
  const errors = results.filter(r => r.verdict === 'ERROR').length;

  const summary = {
    inspectedAt: new Date().toISOString(),
    totalTracked: allPaths.length,
    batchRange: `${offset + 1}–${offset + batch.length}`,
    batchSize: batch.length,
    indexed,
    notIndexed,
    errors,
  };

  // Save results
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  const date = new Date().toISOString().split('T')[0];
  const resultsPath = path.join(DATA_DIR, `inspect-${date}.json`);

  // Merge with any existing results from today (if run multiple times)
  let allResults = results;
  if (fs.existsSync(resultsPath)) {
    const existing = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    const existingUrls = new Set(existing.results.map(r => r.url));
    const newResults = results.filter(r => !existingUrls.has(r.url));
    allResults = [...existing.results, ...newResults];
  }

  fs.writeFileSync(resultsPath, JSON.stringify({ summary, results: allResults }, null, 2));

  // Also save/update the latest cumulative view
  updateCumulativeResults(results);

  // Save rotation state
  saveState({ lastOffset: nextOffset >= allPaths.length ? 0 : nextOffset });

  console.log(`Inspection complete: ${indexed} indexed, ${notIndexed} not indexed, ${errors} errors`);

  return { inspected: results, summary, skipped: false };
}

/**
 * Maintain a cumulative file that tracks the latest status for every inspected URL.
 * This builds up over multiple weekly runs until we have full coverage.
 */
function updateCumulativeResults(newResults) {
  const cumulativePath = path.join(DATA_DIR, 'inspect-cumulative.json');
  let cumulative = {};

  if (fs.existsSync(cumulativePath)) {
    const data = JSON.parse(fs.readFileSync(cumulativePath, 'utf8'));
    cumulative = data.results || {};
  }

  // Merge new results (overwrite with latest)
  for (const r of newResults) {
    cumulative[r.url] = {
      verdict: r.verdict,
      coverageState: r.coverageState,
      lastCrawlTime: r.lastCrawlTime,
      pageFetchState: r.pageFetchState,
      checkedAt: new Date().toISOString(),
    };
  }

  const urls = Object.keys(cumulative);
  const indexed = urls.filter(u => cumulative[u].verdict === 'PASS').length;
  const notIndexed = urls.filter(u => cumulative[u].verdict !== 'PASS' && cumulative[u].verdict !== 'ERROR').length;

  fs.writeFileSync(cumulativePath, JSON.stringify({
    updatedAt: new Date().toISOString(),
    totalInspected: urls.length,
    indexed,
    notIndexed,
    results: cumulative,
  }, null, 2));
}

module.exports = { inspectPages };
