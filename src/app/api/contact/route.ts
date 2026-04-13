import { NextRequest, NextResponse } from "next/server";
import { readJson, appendToJsonArray } from "@/lib/storage";

/**
 * Contact Messages API (Vercel-compatible)
 *
 * POST /api/contact — submit a contact form message
 * GET  /api/contact — list all messages
 *
 * Messages are logged to console (visible in Vercel Dashboard → Logs)
 * and stored in /tmp (ephemeral). For persistence, add Supabase.
 */

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

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

    const msg: ContactMessage = {
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

    // Also store in /tmp (ephemeral on Vercel, persistent locally)
    appendToJsonArray("messages-inbox.json", msg);

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll get back to you within 24 hours.",
    });
  } catch (err) {
    console.error("[contact] Error:", err);
    return NextResponse.json({ success: false, errors: ["Server error"] }, { status: 500 });
  }
}

export async function GET() {
  const messages = readJson<ContactMessage[]>("messages-inbox.json", []);
  return NextResponse.json({
    total: messages.length,
    unread: messages.length,
    messages: messages.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  });
}
