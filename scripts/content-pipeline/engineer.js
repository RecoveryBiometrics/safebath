/**
 * Agent 6: Engineer
 * Writes validated content to the site's data directory.
 * Merges new articles with existing ones (append, don't replace).
 */
const fs = require('fs');
const path = require('path');
const config = require('./config');

/**
 * Deploy articles for a city — merge with existing content.
 * Returns { deployed: number, total: number, filePath: string }
 */
function deploy(city, newEntries) {
  if (!fs.existsSync(config.NEWS_DATA_DIR)) {
    fs.mkdirSync(config.NEWS_DATA_DIR, { recursive: true });
  }

  const filePath = path.join(config.NEWS_DATA_DIR, `${city.slug}.json`);

  // Load existing entries
  let existing = [];
  if (fs.existsSync(filePath)) {
    try {
      existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }
  }

  // Deduplicate by slug — don't add articles we already have
  const existingSlugs = new Set(existing.map(e => e.slug));
  const toAdd = newEntries.filter(e => !existingSlugs.has(e.slug));

  if (toAdd.length === 0) {
    console.log(`  ${city.name}: no new articles to deploy (all already exist)`);
    return { deployed: 0, total: existing.length, filePath };
  }

  // Merge: new entries first (newest on top), then existing
  const merged = [...toAdd, ...existing];

  fs.writeFileSync(filePath, JSON.stringify(merged, null, 2));
  console.log(`  ${city.name}: deployed ${toAdd.length} new articles (${merged.length} total)`);

  return { deployed: toAdd.length, total: merged.length, filePath };
}

module.exports = { deploy };
