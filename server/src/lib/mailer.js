import nodemailer from "nodemailer";

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT || 465);
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  return transporter;
}

const ENTITIES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escape = (s = "") => s.replace(/[&<>"']/g, (c) => ENTITIES[c]);

/** Emails you a copy of each new enquiry. Skipped when SMTP isn't configured. */
export async function notifyNewMessage(msg) {
  const t = getTransporter();
  if (!t) return false;
  await t.sendMail({
    from: `"Portfolio" <${process.env.SMTP_USER}>`,
    to: process.env.NOTIFY_EMAIL || process.env.SMTP_USER,
    replyTo: msg.email,
    subject: `New enquiry: ${msg.projectType} from ${msg.name}`,
    text: `${msg.name} <${msg.email}>\nType: ${msg.projectType}\nSender: ${msg.budget}\n\n${msg.message}`,
    html: `<p><b>${escape(msg.name)}</b> &lt;${escape(msg.email)}&gt;</p>
<p>Type: ${escape(msg.projectType)}<br/>Sender: ${escape(msg.budget)}</p>
<p style="white-space:pre-wrap">${escape(msg.message)}</p>`,
  });
  return true;
}
