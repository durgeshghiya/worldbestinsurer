import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

/**
 * Contact Messages API
 *
 * POST /api/contact — submit a contact form message
 * GET  /api/contact — list all messages (admin)
 */

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const MESSAGES_DIR = path.join(process.cwd(), "data", "messages");
const MESSAGES_FILE = path.join(MESSAGES_DIR, "inbox.json");

function loadMessages(): ContactMessage[] {
  if (!fs.existsSync(MESSAGES_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function saveMessages(messages: ContactMessage[]) {
  if (!fs.existsSync(MESSAGES_DIR)) {
    fs.mkdirSync(MESSAGES_DIR, { recursive: true });
  }
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), "utf-8");
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
      read: false,
      createdAt: new Date().toISOString(),
    };

    const messages = loadMessages();
    messages.push(msg);
    saveMessages(messages);

    console.log(`[contact] New message: ${msg.id} | ${msg.email} | ${msg.subject}`);

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll get back to you within 24 hours.",
    });
  } catch {
    return NextResponse.json({ success: false, errors: ["Server error"] }, { status: 500 });
  }
}

export async function GET() {
  const messages = loadMessages();
  const unread = messages.filter((m) => !m.read).length;

  return NextResponse.json({
    total: messages.length,
    unread,
    messages: messages.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),
  });
}
