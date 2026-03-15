/**
 * Agent 1: Researcher
 * Finds real upcoming events for a city by scraping public event sites.
 *
 * Sources (in priority order):
 * 1. Curated events file (events/{slug}.json) — always preferred if exists
 * 2. Eventbrite — most reliable structured data
 * 3. Patch.com — local community events
 * 4. allevents.in — broad coverage
 *
 * No API keys needed — all sources are public pages.
 */
const https = require('https');
const http = require('http');
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
  return SAFETY_TIEINS[index % SAFETY_TIEINS.length].replace(/\{city\}/g, city.name);
}

/**
 * Fetch a URL and return the HTML body as a string.
 */
function fetchPage(url, timeout = 10000) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SafeBathBot/1.0)',
        'Accept': 'text/html',
      },
      timeout,
    }, (res) => {
      // Follow redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchPage(res.headers.location, timeout).then(resolve);
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve(''));
    req.on('timeout', () => { req.destroy(); resolve(''); });
  });
}

/**
 * Scrape Eventbrite for city events.
 * URL pattern: https://www.eventbrite.com/d/pa--west-chester/events/
 */
async function scrapeEventbrite(city) {
  const stateMap = { PA: 'pa', DE: 'de', MD: 'md', NV: 'nv', SC: 'sc' };
  const st = stateMap[city.state] || city.state.toLowerCase();
  const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
  const url = `https://www.eventbrite.com/d/${st}--${citySlug}/events/`;

  const html = await fetchPage(url);
  if (!html) return [];

  const events = [];

  // Eventbrite uses structured data in script tags
  const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
  for (const match of jsonLdMatches) {
    try {
      const jsonStr = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
      const data = JSON.parse(jsonStr);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item['@type'] === 'Event' && item.name && item.startDate) {
          events.push({
            title: item.name.slice(0, 80),
            date: item.startDate,
            location: item.location?.name || item.location?.address?.addressLocality || city.name,
            summary: (item.description || '').slice(0, 200),
            url: item.url || url,
            source: 'eventbrite',
          });
        }
      }
    } catch { /* skip malformed JSON-LD */ }
  }

  // Fallback: parse event titles from HTML if no JSON-LD
  if (events.length === 0) {
    // Look for event card patterns in Eventbrite HTML
    const titlePattern = /data-testid="event-card"[^>]*>[\s\S]*?<h3[^>]*>(.*?)<\/h3>/gi;
    let m;
    while ((m = titlePattern.exec(html)) !== null && events.length < 5) {
      const title = m[1].replace(/<[^>]+>/g, '').trim();
      if (title.length > 5 && title.length < 100) {
        events.push({
          title,
          summary: `Event in ${city.name} — see Eventbrite for details.`,
          url,
          source: 'eventbrite',
        });
      }
    }
  }

  return events.slice(0, 5);
}

/**
 * Scrape allevents.in for city events.
 * URL pattern: https://allevents.in/west-chester-pa/all
 */
async function scrapeAllEvents(city) {
  const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
  const url = `https://allevents.in/${citySlug}-${city.state.toLowerCase()}/all`;

  const html = await fetchPage(url);
  if (!html) return [];

  const events = [];

  // allevents.in uses JSON-LD for events
  const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
  for (const match of jsonLdMatches) {
    try {
      const jsonStr = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
      const data = JSON.parse(jsonStr);
      const items = Array.isArray(data) ? data : data.itemListElement ? data.itemListElement.map(i => i.item) : [data];
      for (const item of items) {
        if ((item['@type'] === 'Event' || item['@type'] === 'SocialEvent') && item.name) {
          events.push({
            title: item.name.slice(0, 80),
            date: item.startDate || '',
            location: item.location?.name || city.name,
            summary: (item.description || '').replace(/<[^>]+>/g, '').slice(0, 200),
            url: item.url || url,
            source: 'allevents',
          });
        }
      }
    } catch { /* skip */ }
  }

  // Fallback: basic HTML title scraping
  if (events.length === 0) {
    const titlePattern = /<h3[^>]*class="[^"]*title[^"]*"[^>]*>([\s\S]*?)<\/h3>/gi;
    let m;
    while ((m = titlePattern.exec(html)) !== null && events.length < 5) {
      const title = m[1].replace(/<[^>]+>/g, '').trim();
      if (title.length > 5 && title.length < 100) {
        events.push({
          title,
          summary: `Event in ${city.name}.`,
          url,
          source: 'allevents',
        });
      }
    }
  }

  return events.slice(0, 5);
}

/**
 * Scrape Patch.com for local events.
 * URL pattern varies by city — try the calendar page.
 */
async function scrapePatch(city) {
  const stateMap = { PA: 'pennsylvania', DE: 'delaware', MD: 'maryland', NV: 'nevada', SC: 'south-carolina' };
  const stateName = stateMap[city.state] || city.state.toLowerCase();
  const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
  const url = `https://patch.com/${stateName}/${citySlug}/calendar`;

  const html = await fetchPage(url);
  if (!html) return [];

  const events = [];

  // Patch uses JSON-LD too
  const jsonLdMatches = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
  for (const match of jsonLdMatches) {
    try {
      const jsonStr = match.replace(/<script[^>]*>/, '').replace(/<\/script>/, '');
      const data = JSON.parse(jsonStr);
      const items = Array.isArray(data) ? data : [data];
      for (const item of items) {
        if (item['@type'] === 'Event' && item.name) {
          events.push({
            title: item.name.slice(0, 80),
            date: item.startDate || '',
            location: item.location?.name || city.name,
            summary: (item.description || '').replace(/<[^>]+>/g, '').slice(0, 200),
            url: item.url || url,
            source: 'patch',
          });
        }
      }
    } catch { /* skip */ }
  }

  return events.slice(0, 5);
}

/**
 * Convert raw scraped events into the format the copywriter expects.
 */
function formatEvents(rawEvents, city) {
  const seen = new Set();
  const formatted = [];

  for (const event of rawEvents) {
    // Deduplicate by title similarity
    const normalizedTitle = event.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (seen.has(normalizedTitle)) continue;
    seen.add(normalizedTitle);

    // Filter out generic navigation/site text that isn't a real event
    const junkPatterns = /^(trending|host events|discover|sign up|log in|create|search|browse|see all|load more|view more|submit|menu|home|about)/i;
    if (junkPatterns.test(event.title)) continue;

    // Build a readable date string from ISO date if available
    let dateStr = '';
    if (event.date) {
      try {
        const d = new Date(event.date);
        dateStr = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
      } catch { /* skip */ }
    }

    const locationStr = event.location && event.location !== city.name
      ? ` at ${event.location}` : '';

    const description = dateStr
      ? `${event.title} takes place${locationStr} on ${dateStr} in ${city.name}, ${city.state}.\n\n${event.summary}`
      : `${event.title}${locationStr} in ${city.name}, ${city.state}.\n\n${event.summary}`;

    formatted.push({
      title: event.title,
      summary: event.summary || `Upcoming event in ${city.name}.`,
      description: description.trim(),
      category: 'community',
      source: event.url,
    });

    if (formatted.length >= 5) break;
  }

  return formatted;
}

/**
 * Research events for a city.
 * Checks curated file first, then scrapes event sites.
 */
async function research(city) {
  console.log(`  Researching ${city.name}, ${city.state}...`);

  let events = [];

  // 1. Check curated events file first
  const eventsFile = path.join(EVENTS_DIR, `${city.slug}.json`);
  if (fs.existsSync(eventsFile)) {
    try {
      events = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
      if (events.length > 0) {
        console.log(`  Found ${events.length} curated events`);
      }
    } catch {
      console.log(`  Malformed events file — falling back to web search`);
    }
  }

  // 2. If no curated events, scrape event sites
  if (events.length === 0) {
    console.log(`  Scraping event sites...`);

    // Run all scrapers in parallel
    const [eventbriteResults, allEventsResults, patchResults] = await Promise.all([
      scrapeEventbrite(city).catch(() => []),
      scrapeAllEvents(city).catch(() => []),
      scrapePatch(city).catch(() => []),
    ]);

    const allRaw = [...eventbriteResults, ...patchResults, ...allEventsResults];
    console.log(`  Raw results: ${eventbriteResults.length} Eventbrite, ${patchResults.length} Patch, ${allEventsResults.length} AllEvents`);

    events = formatEvents(allRaw, city);
    console.log(`  Formatted ${events.length} unique events`);
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
