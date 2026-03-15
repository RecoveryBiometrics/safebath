/**
 * Agent 1: Researcher
 * Searches for real upcoming events in a city.
 *
 * Priority order:
 * 1. Curated events file (scripts/content-pipeline/events/{slug}.json) — always preferred
 * 2. Google Custom Search API — automated web search fallback
 * 3. Empty — pipeline skips the city
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const config = require('./config');

const EVENTS_DIR = path.join(__dirname, 'events');

const SAFETY_TIEINS = [
  "While you're out enjoying {city}'s community events, make sure the home you're coming back to is safe. A grab bar installation takes less than an hour.",
  "Heading out for a great time in {city}? Before you go, take 30 seconds to check the grab bars in your bathroom — or call us to have them installed.",
  "{city} is a great place to live and stay active. If you or a loved one wants to keep living independently at home, bathroom safety is the first step.",
  "Events like these are what make {city} special. Keeping your home safe so you can keep enjoying them is what we do.",
  "Whether you're exploring {city} or staying in this weekend, a safe bathroom matters. Professional grab bar installation starts at $199.",
];

function pickTieIn(city, index) {
  const template = SAFETY_TIEINS[index % SAFETY_TIEINS.length];
  return template.replace(/\{city\}/g, city.name);
}

/**
 * Search Google Custom Search API for local events.
 */
async function searchGoogle(cityName, state) {
  const apiKey = process.env.GOOGLE_CUSTOM_SEARCH_KEY;
  const cx = process.env.GOOGLE_CUSTOM_SEARCH_CX;

  if (!apiKey || !cx) return [];

  const queries = [
    `${cityName} ${state} events this month ${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}`,
    `${cityName} ${state} things to do upcoming`,
  ];

  const results = [];

  for (const query of queries) {
    try {
      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&num=5`;
      const data = await fetchJSON(url);

      if (data?.items) {
        for (const item of data.items) {
          results.push({
            title: item.title,
            snippet: item.snippet,
            link: item.link,
            source: item.displayLink,
          });
        }
      }
    } catch (err) {
      console.log(`  Google search failed: ${err.message}`);
    }
  }

  return results;
}

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(null); }
      });
    }).on('error', reject);
  });
}

/**
 * Convert raw Google search results into structured event objects.
 * Extracts event-like content from search snippets.
 */
function parseSearchResults(searchResults, city) {
  const events = [];
  const seen = new Set();

  for (const result of searchResults) {
    // Skip results that aren't event-like
    if (!result.snippet) continue;

    // Clean up title — remove site name suffixes
    let title = result.title
      .replace(/\s*\|.*$/, '')
      .replace(/\s*-\s*(Eventbrite|Patch|Facebook|Meetup|TripAdvisor).*$/i, '')
      .trim();

    if (seen.has(title)) continue;
    seen.add(title);

    // Only include results that look like events (contain dates, times, or event keywords)
    const eventSignals = /\b(march|april|may|june|PM|AM|event|festival|concert|show|workshop|market|fundraiser|celebration|dinner|parade)\b/i;
    if (!eventSignals.test(result.snippet) && !eventSignals.test(title)) continue;

    events.push({
      title: title.length > 60 ? title.slice(0, 57) + '...' : title,
      summary: result.snippet.slice(0, 200),
      description: `${result.snippet}\n\nMore details: ${result.link}`,
      category: 'community',
      source: result.link,
    });

    if (events.length >= 5) break;
  }

  return events;
}

/**
 * Research events for a city.
 * Checks curated file first, falls back to Google search.
 */
async function research(city) {
  console.log(`  Researching ${city.name}, ${city.state}...`);

  let events = [];

  // 1. Check for curated events file (always preferred)
  const eventsFile = path.join(EVENTS_DIR, `${city.slug}.json`);
  if (fs.existsSync(eventsFile)) {
    try {
      events = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
      console.log(`  Found ${events.length} curated events`);
    } catch {
      console.log(`  ${city.name}: malformed events file`);
    }
  }

  // 2. If no curated events, try Google Custom Search
  if (events.length === 0) {
    const searchResults = await searchGoogle(city.name, city.state);
    if (searchResults.length > 0) {
      events = parseSearchResults(searchResults, city);
      console.log(`  Found ${events.length} events via Google search`);
    }
  }

  // 3. Add safety tie-ins
  events = events.map((event, i) => ({
    ...event,
    safetyTieIn: event.safetyTieIn || pickTieIn(city, i),
  }));

  return {
    city: city.name,
    state: city.state,
    county: city.county,
    slug: city.slug,
    events,
    researchedAt: new Date().toISOString(),
  };
}

module.exports = { research };
