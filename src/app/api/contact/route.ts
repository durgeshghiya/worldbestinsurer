import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail, formatContactEmail } from "@/lib/email";

/**
 * Contact Messages API (Vercel-compatible)
 *
 * POST /api/contact — submit a contact form message
 * GET  /api/contact — health check
 *
 * Messages are (a) logged to console, (b) forwarded via Resend to
 * CONTACT_EMAIL_TO, and (c) stored in /tmp as a best-effort fallback.
 * Email delivery is the primary storage — /tmp is ephemeral.
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const errors: string[] = [];
    if (!body.name || body.name.trim().length < 2) errors.push("Name is required");
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.push("Valid email is required");
    if (!body.message || body.message.trim().length < 5) errors.push("Message is required (min 5 characters)");

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const msg = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      subject: (body.subject || "General question").trim(),
      message: body.message.trim().slice(0, 5000),
      createdAt: new Date().toISOString(),
    };

    // ⚡ LOG TO VERCEL DASHBOARD (Deployments → Functions → Logs)
    console.log("═══ NEW CONTACT MESSAGE ═══");
    console.log(JSON.stringify(msg, null, 2));
    console.log("═══════════════════════════");

    // 📧 Forward to inbox via Resend (fire-and-forget, never blocks response)
    sendNotificationEmail(formatContactEmail(msg)).catch((e) =>
      console.error("[contact] email send failed:", e)
    );

    // Try /tmp storage (non-critical — never fails the request)
    try {
      const fs = await import("fs");
      const path = await import("path");
      const tmpPath = path.join(
        process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data"),
        "messages-inbox.json"
      );
      const dir = path.dirname(tmpPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const existing = fs.existsSync(tmpPath)
        ? JSON.parse(fs.readFileSync(tmpPath, "utf-8"))
        : [];
      existing.push(msg);
      fs.writeFileSync(tmpPath, JSON.stringify(existing, null, 2), "utf-8");
    } catch (fsErr) {
      console.warn("[contact] /tmp write skipped:", fsErr);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll get back to you within 24 hours.",
    });
  } catch (err) {
    console.error("[contact] Error:", err);
    return NextResponse.json({ success: false, errors: ["Server error — please try again"] }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "/api/contact", method: "POST" });
}
