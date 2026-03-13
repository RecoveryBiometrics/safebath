const nodemailer = require('nodemailer');

const TO = 'bill@reiamplifi.com';

async function sendReport(subject, markdownBody) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn('SMTP_USER / SMTP_PASS not set — skipping email delivery.');
    console.warn('See SETUP.md for instructions to enable email.');
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `SafeBath SEO Agent <${user}>`,
    to: TO,
    subject,
    text: markdownBody,
  });

  console.log(`Email sent to ${TO}`);
  return true;
}

module.exports = { sendReport };
