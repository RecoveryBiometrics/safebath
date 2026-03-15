/**
 * Agent 3: Copywriter
 * Takes research data (real local events) and writes short, date-specific blurbs.
 * Each entry is 2-3 paragraphs: what's happening, when, where, and a natural safety tie-in.
 */
const config = require('./config');

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

function getPhone(city) {
  const override = config.PHONE_OVERRIDES[city.county];
  return override ? override.display : config.BRAND.phone;
}

/**
 * Write news entries from researched events.
 * Each event becomes a short blurb — not a long article.
 */
function writeArticles(research, existingEntries = []) {
  const city = { name: research.city, state: research.state, county: research.county, slug: research.slug };
  const date = new Date().toISOString().split('T')[0];
  const phone = getPhone(city);

  if (!research.events || research.events.length === 0) {
    console.log(`  ${city.name}: no events found — skipping`);
    return [];
  }

  // Don't duplicate events we already have
  const existingSlugs = new Set(existingEntries.map(e => e.slug));

  const articles = [];
  for (const event of research.events) {
    const title = event.title;
    const slug = slugify(title);

    if (existingSlugs.has(slug)) continue;

    const body = writeEventBlurb(event, city, phone);

    articles.push({
      id: `${date}-${String(articles.length + 1).padStart(3, '0')}`,
      title,
      slug,
      date,
      excerpt: event.summary,
      body,
      category: event.category || 'local-news',
    });
  }

  console.log(`  ${city.name}: wrote ${articles.length} entries`);
  return articles;
}

function writeEventBlurb(event, city, phone) {
  let body = '';

  // Event details
  body += event.description;

  // Safety tie-in (subtle, one line, only if it fits)
  if (event.safetyTieIn) {
    body += `\n\n${event.safetyTieIn}`;
  }

  // CTA
  body += `\n\nSafe Bath Grab Bars serves ${city.name} and all of ${city.county}. Call ${phone} for same-week scheduling.`;

  return body;
}

module.exports = { writeArticles };
