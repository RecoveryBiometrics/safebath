/**
 * Loads city data from cities-data.json.
 * To update: re-extract from site/src/lib/constants.ts locally.
 */
const path = require('path');
const config = require('./config');

function parseCities() {
  return require(path.join(__dirname, 'cities-data.json'));
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
