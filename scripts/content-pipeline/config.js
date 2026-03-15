const path = require('path');

module.exports = {
  // How many cities to process per run
  CITIES_PER_RUN: 5,

  // Paths
  SITE_DIR: path.join(__dirname, '../../site'),
  NEWS_DATA_DIR: path.join(__dirname, '../../site/src/data/local-news'),
  STATE_FILE: path.join(__dirname, '../../seo-data/pipeline-state.json'),
  CONSTANTS_PATH: path.join(__dirname, '../../site/src/lib/constants.ts'),

  // Content rules
  MAX_SIMILARITY_PERCENT: 85,  // Flag if >85% similar to sibling city (tightens as content diversifies)
  MAX_RETRY_ATTEMPTS: 3,

  // Brand rules (injected into every agent prompt)
  BRAND: {
    name: 'Safe Bath Grab Bars',
    phone: '(610) 840-6371',
    url: 'https://safebathgrabbar.com',
    pricing: '$199 first bar, $99 each additional (same visit)',
    cta: 'Call for Same-Week Scheduling',
    trustSignals: [
      'Licensed & Insured',
      '20 Years Experience',
      'Lifetime Labor Warranty',
      'ADA-Compliant',
    ],
    voice: 'Direct, trust-building, safety-focused, local. Lead with fear prevention, not features.',
  },

  // Reddit subreddits to scan for content ideas
  SUBREDDITS: [
    'AgingParents',
    'eldercare',
    'HomeImprovement',
    'occupationaltherapy',
    'CaregiverSupport',
    'Aging',
    'disability',
    'PhysicalTherapy',
  ],

  // Content categories
  CATEGORIES: ['safety-tip', 'local-news', 'community', 'seasonal', 'stats'],

  // Phone overrides by county
  PHONE_OVERRIDES: {
    'Clark County, NV': { display: '(725) 425-7383', tel: '+17254257383' },
    'Horry County, SC': { display: '(854) 246-2882', tel: '+18542462882' },
  },
};
