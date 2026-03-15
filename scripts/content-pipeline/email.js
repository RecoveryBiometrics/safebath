/**
 * Email notification for the content pipeline.
 * Sends a summary to bill@reiamplifi.com after each run.
 * Uses Gmail SMTP if credentials are available, skips gracefully if not.
 */
const nodemailer = require('nodemailer');

const TO = 'bill@reiamplifi.com';

async function sendPipelineEmail(results, failures) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn('SMTP_USER / SMTP_PASS not set — skipping email.');
    return false;
  }

  const date = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const totalDeployed = results.reduce((sum, r) => sum + (r.deployed || 0), 0);

  let body = `SafeBath Content Pipeline — ${date}\n\n`;
  body += `Cities processed: ${results.length + failures.length}\n`;
  body += `Articles deployed: ${totalDeployed}\n`;
  body += `Failures: ${failures.length}\n\n`;

  if (results.length > 0) {
    body += `--- DEPLOYED ---\n\n`;
    for (const r of results) {
      if (r.deployed > 0) {
        body += `${r.city}, ${r.state}: ${r.deployed} new articles\n`;
        body += `  Preview: ${r.url}\n`;
        for (const a of r.articles || []) {
          body += `  - ${a.title}\n`;
        }
        body += '\n';
      } else if (r.reason) {
        body += `${r.city}: skipped — ${r.reason}\n`;
      }
    }
  }

  if (failures.length > 0) {
    body += `--- FAILURES ---\n\n`;
    body += failures.join(', ') + '\n';
    body += 'Check GitHub Actions log for details.\n\n';
  }

  body += `---\n`;
  body += `This email is sent automatically after each daily pipeline run.\n`;
  body += `Pipeline code: scripts/content-pipeline/\n`;
  body += `To stop these emails, remove SMTP_USER and SMTP_PASS from GitHub secrets.\n`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  const subject = `SafeBath Pipeline: ${totalDeployed} articles deployed${failures.length > 0 ? ` (${failures.length} failures)` : ''}`;

  await transporter.sendMail({
    from: `SafeBath Content Pipeline <${user}>`,
    to: TO,
    subject,
    text: body,
  });

  console.log(`Email sent to ${TO}`);
  return true;
}

module.exports = { sendPipelineEmail };
