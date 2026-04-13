import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

/**
 * Click Tracking API
 *
 * POST /api/clicks — log an outbound click (to insurer website)
 * GET /api/clicks — admin: daily click summary
 */

interface ClickEvent {
  id: string;
  productId: string;
  insurerSlug: string;
  countryCode: string;
  isAffiliate: boolean;
  partnerId: string | null;
  referrer: string | null;
  sessionId: string | null;
  createdAt: string;
}

const CLICKS_DIR = path.join(process.cwd(), "data", "clicks");

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.productId || !body.insurerSlug) {
      return NextResponse.json({ error: "productId and insurerSlug required" }, { status: 400 });
    }

    const click: ClickEvent = {
      id: `clk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      productId: body.productId,
      insurerSlug: body.insurerSlug,
      countryCode: body.countryCode || "unknown",
      isAffiliate: body.isAffiliate || false,
      partnerId: body.partnerId || null,
      referrer: request.headers.get("referer") || null,
      sessionId: body.sessionId || null,
      createdAt: new Date().toISOString(),
    };

    // Store to daily file
    const today = new Date().toISOString().split("T")[0];
    if (!fs.existsSync(CLICKS_DIR)) {
      fs.mkdirSync(CLICKS_DIR, { recursive: true });
    }

    const file = path.join(CLICKS_DIR, `${today}.json`);
    let clicks: ClickEvent[] = [];
    if (fs.existsSync(file)) {
      try { clicks = JSON.parse(fs.readFileSync(file, "utf-8")); } catch { clicks = []; }
    }
    clicks.push(click);
    fs.writeFileSync(file, JSON.stringify(clicks, null, 2));

    return NextResponse.json({ success: true, clickId: click.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!fs.existsSync(CLICKS_DIR)) {
      return NextResponse.json({ totalClicks: 0, days: {} });
    }

    const files = fs.readdirSync(CLICKS_DIR).filter((f) => f.endsWith(".json"));
    const days: Record<string, number> = {};
    let total = 0;

    for (const file of files.slice(-30)) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(CLICKS_DIR, file), "utf-8"));
        const count = Array.isArray(data) ? data.length : 0;
        days[file.replace(".json", "")] = count;
        total += count;
      } catch { /* skip */ }
    }

    return NextResponse.json({ totalClicks: total, days });
  } catch {
    return NextResponse.json({ totalClicks: 0, days: {} });
  }
}
