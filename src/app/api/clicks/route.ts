import { NextRequest, NextResponse } from "next/server";
import { readJson, appendToJsonArray } from "@/lib/storage";

/**
 * Click Tracking API (Vercel-compatible)
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.productId || !body.insurerSlug) {
      return NextResponse.json({ error: "productId and insurerSlug required" }, { status: 400 });
    }

    const click = {
      id: `clk_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      productId: body.productId,
      insurerSlug: body.insurerSlug,
      countryCode: body.countryCode || "unknown",
      isAffiliate: body.isAffiliate || false,
      partnerId: body.partnerId || null,
      referrer: request.headers.get("referer") || null,
      createdAt: new Date().toISOString(),
    };

    console.log("═══ OUTBOUND CLICK ═══");
    console.log(JSON.stringify(click, null, 2));
    console.log("═══════════════════════");

    appendToJsonArray("clicks.json", click);

    return NextResponse.json({ success: true, clickId: click.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  const clicks = readJson<unknown[]>("clicks.json", []);
  return NextResponse.json({ totalClicks: clicks.length });
}
