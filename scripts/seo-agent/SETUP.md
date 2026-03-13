# SEO Agent Setup Guide

One-time setup. After this, the agent runs every Tuesday at 9am ET automatically via GitHub Actions.

---

## Step 1 — Create a Google Cloud Project

1. Go to https://console.cloud.google.com
2. Click **Select a project** → **New Project**
3. Name it `safebath-seo` → Create
4. In the search bar, search for **"Google Search Console API"**
5. Click **Enable**

---

## Step 2 — Create a Service Account

1. In Google Cloud Console: **IAM & Admin** → **Service Accounts**
2. Click **Create Service Account**
3. Name: `seo-agent` → Create and Continue → Done
4. Click the new service account to open it
5. Go to the **Keys** tab → **Add Key** → **Create new key** → **JSON**
6. A `.json` file downloads to your computer — keep this safe

Copy the **service account email** from the details page — it looks like:
`seo-agent@safebath-seo.iam.gserviceaccount.com`

---

## Step 3 — Grant Search Console Access

1. Go to https://search.google.com/search-console
2. Select the `safebathgrabbar.com` property
3. **Settings** (gear icon) → **Users and permissions** → **Add user**
4. Paste the service account email from Step 2
5. Permission: **Full** → Add

---

## Step 4 — Add the Secret to GitHub

1. Go to https://github.com/RecoveryBiometrics/safebath
2. **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `GOOGLE_SERVICE_ACCOUNT_KEY`
5. Value: open the downloaded `.json` file, copy the **entire contents** as one block, paste it

---

## Step 5 — Verify It Works

After adding the secret, go to:
**GitHub** → **Actions** → **Weekly SEO Report** → **Run workflow** → **Run workflow**

Wait ~60 seconds. If successful, you'll see a new file in `seo-reports/` on the main branch.

If it fails, check the Actions log — the most common issue is the service account not having Search Console access (Step 3).

---

## Running Locally (Optional)

```bash
cd scripts/seo-agent
cp .env.example .env
# Edit .env — paste the JSON key contents as the value of GOOGLE_SERVICE_ACCOUNT_KEY
npm install
node index.js
```

Report will be saved to `seo-reports/YYYY-MM-DD.md`.

---

## Schedule

Runs every **Tuesday at 9am ET** via GitHub Actions.
Report is committed automatically to the `main` branch at `seo-reports/YYYY-MM-DD.md`.

To trigger manually at any time: GitHub → Actions → Weekly SEO Report → Run workflow.

---

## Adding Email Delivery

Reports are emailed to bill@reiamplifi.com each week. To enable:

1. Go to https://myaccount.google.com/apppasswords (you need 2FA enabled on the Google account)
2. Create an app password — name it `safebath-seo-agent`
3. Add two secrets to GitHub (**Settings** → **Secrets** → **Actions**):
   - `SMTP_USER` — the Gmail address (e.g. `you@gmail.com`)
   - `SMTP_PASS` — the 16-character app password from step 2

If the secrets aren't set, the agent still runs and saves the report — it just skips sending the email.
