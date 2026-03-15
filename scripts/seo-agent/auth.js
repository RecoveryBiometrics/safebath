const { google } = require('googleapis');

// webmasters scope (not readonly) is required for URL Inspection API
const SCOPES = ['https://www.googleapis.com/auth/webmasters'];

async function getAuthClient() {
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  if (!key) {
    throw new Error(
      'GOOGLE_SERVICE_ACCOUNT_KEY is not set. See scripts/seo-agent/SETUP.md.'
    );
  }
  const credentials = JSON.parse(key);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });
  return auth.getClient();
}

module.exports = { getAuthClient };
