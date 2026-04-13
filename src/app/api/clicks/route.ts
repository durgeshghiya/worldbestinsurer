import { NextRequest, NextResponse } from "next/server";

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

    // Non-critical /tmp write
    try {
      const fs = await import("fs");
      const path = await import("path");
      const tmpPath = path.join(
        process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data"),
        "clicks.json"
      );
      const dir = path.dirname(tmpPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const existing = fs.existsSync(tmpPath)
        ? JSON.parse(fs.readFileSync(tmpPath, "utf-8"))
        : [];
      existing.push(click);
      fs.writeFileSync(tmpPath, JSON.stringify(existing, null, 2), "utf-8");
    } catch (fsErr) {
      console.warn("[clicks] /tmp write skipped:", fsErr);
    }

    return NextResponse.json({ success: true, clickId: click.id });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "/api/clicks", method: "POST" });
}
