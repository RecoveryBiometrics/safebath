/**
 * Parses constants.ts to extract all cities.
 * This avoids importing TypeScript directly — we parse the JS-compatible data.
 */
const fs = require('fs');
const config = require('./config');

function parseCities() {
  const content = fs.readFileSync(config.CONSTANTS_PATH, 'utf8');

  // Extract COUNTIES_AND_LOCATIONS array
  const match = content.match(/export const COUNTIES_AND_LOCATIONS\s*=\s*\[([\s\S]*?)\n\];/);
  if (!match) throw new Error('Could not parse COUNTIES_AND_LOCATIONS from constants.ts');

  const cities = [];
  const countyPattern = /county:\s*'([^']+)'/g;
  const cityPattern = /\{\s*name:\s*'([^']+)',\s*slug:\s*'([^']+)',\s*state:\s*'([^']+)',\s*county:\s*'([^']+)'/g;

  let cityMatch;
  while ((cityMatch = cityPattern.exec(content)) !== null) {
    cities.push({
      name: cityMatch[1],
      slug: cityMatch[2],
      state: cityMatch[3],
      county: cityMatch[4],
    });
  }

  return cities;
}

/**
 * Get the phone number for a city based on its county.
 */
function getPhoneForCity(city) {
  const override = config.PHONE_OVERRIDES[city.county];
  if (override) return override;
  return { display: '(610) 840-6371', tel: '+16108406371' };
}

/**
 * Generate the URL slug for a city page.
 */
function slugifyCity(city) {
  const slug = city.name.toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  return `bathroom-safety-${slug}-${city.state.toLowerCase()}`;
}

module.exports = { parseCities, getPhoneForCity, slugifyCity };
