/**
 * Email forwarding via Resend.
 *
 * Sends notifications to CONTACT_EMAIL_TO whenever a contact message or lead
 * is submitted. If RESEND_API_KEY is not set, logs to console and returns
 * gracefully — never throws, never blocks the API response.
 *
 * Required env vars (set in Vercel Dashboard → Settings → Environment Variables):
 *   RESEND_API_KEY    — from https://resend.com/api-keys
 *   CONTACT_EMAIL_TO  — your personal inbox (e.g. you@gmail.com)
 *   CONTACT_EMAIL_FROM (optional) — verified sender, defaults to onboarding@resend.dev
 */

export interface EmailPayload {
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export async function sendNotificationEmail(payload: EmailPayload): Promise<{
  sent: boolean;
  reason?: string;
}> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL_TO;
  const from = process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";

  if (!apiKey) {
    console.warn("[email] RESEND_API_KEY not set — email not sent");
    return { sent: false, reason: "missing_api_key" };
  }
  if (!to) {
    console.warn("[email] CONTACT_EMAIL_TO not set — email not sent");
    return { sent: false, reason: "missing_recipient" };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const result = await resend.emails.send({
      from: `World Best Insurer <${from}>`,
      to: [to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      replyTo: payload.replyTo,
    });

    if (result.error) {
      console.error("[email] Resend error:", result.error);
      return { sent: false, reason: String(result.error.message || result.error) };
    }

    console.log("[email] Sent to", to, "id:", result.data?.id);
    return { sent: true };
  } catch (err) {
    console.error("[email] Exception:", err);
    return { sent: false, reason: String(err) };
  }
}

export function formatContactEmail(msg: {
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}): EmailPayload {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e2b7a; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">📬 New Contact Message</h2>
        <p style="margin: 4px 0 0 0; opacity: 0.8; font-size: 13px;">worldbestinsurer.com</p>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #6b7280; width: 100px;">From</td><td style="padding: 6px 0;"><strong>${escapeHtml(msg.name)}</strong></td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(msg.email)}">${escapeHtml(msg.email)}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Subject</td><td style="padding: 6px 0;">${escapeHtml(msg.subject)}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Time</td><td style="padding: 6px 0;">${new Date(msg.createdAt).toLocaleString()}</td></tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 16px 0;">
        <div style="background: #f9fafb; padding: 16px; border-radius: 6px; white-space: pre-wrap; font-size: 14px; line-height: 1.6;">${escapeHtml(msg.message)}</div>
        <div style="margin-top: 20px;">
          <a href="mailto:${escapeHtml(msg.email)}?subject=Re:%20${encodeURIComponent(msg.subject)}" style="background: #1e2b7a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-size: 13px; font-weight: 600;">Reply to ${escapeHtml(msg.name)}</a>
        </div>
      </div>
    </div>
  `;

  const text = `NEW CONTACT MESSAGE — worldbestinsurer.com

From: ${msg.name}
Email: ${msg.email}
Subject: ${msg.subject}
Time: ${new Date(msg.createdAt).toLocaleString()}

Message:
${msg.message}

Reply: ${msg.email}
`;

  return {
    subject: `[WBI Contact] ${msg.subject} — ${msg.name}`,
    html,
    text,
    replyTo: msg.email,
  };
}

export function formatLeadEmail(lead: {
  name: string;
  email: string;
  phone: string;
  productId: string;
  insurerSlug: string;
  category: string;
  countryCode: string;
  createdAt: string;
}): EmailPayload {
  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #c47d2e; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
        <h2 style="margin: 0;">🔥 New Lead</h2>
        <p style="margin: 4px 0 0 0; opacity: 0.9; font-size: 13px;">Someone wants a quote</p>
      </div>
      <div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #6b7280; width: 120px;">Name</td><td style="padding: 6px 0;"><strong>${escapeHtml(lead.name)}</strong></td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0;"><a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Phone</td><td style="padding: 6px 0;"><a href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone)}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Product</td><td style="padding: 6px 0;">${escapeHtml(lead.productId)}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Insurer</td><td style="padding: 6px 0;">${escapeHtml(lead.insurerSlug)}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Category</td><td style="padding: 6px 0;">${escapeHtml(lead.category)}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Country</td><td style="padding: 6px 0;">${escapeHtml(lead.countryCode.toUpperCase())}</td></tr>
          <tr><td style="padding: 6px 0; color: #6b7280;">Time</td><td style="padding: 6px 0;">${new Date(lead.createdAt).toLocaleString()}</td></tr>
        </table>
      </div>
    </div>
  `;

  const text = `NEW LEAD — worldbestinsurer.com

Name: ${lead.name}
Email: ${lead.email}
Phone: ${lead.phone}
Product: ${lead.productId}
Insurer: ${lead.insurerSlug}
Category: ${lead.category}
Country: ${lead.countryCode.toUpperCase()}
Time: ${new Date(lead.createdAt).toLocaleString()}
`;

  return {
    subject: `[WBI Lead] ${lead.name} wants ${lead.category} quote from ${lead.insurerSlug}`,
    html,
    text,
    replyTo: lead.email,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
