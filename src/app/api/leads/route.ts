import { NextRequest, NextResponse } from "next/server";
import { sendNotificationEmail, formatLeadEmail } from "@/lib/email";

/**
 * Lead Capture API (Vercel-compatible)
 *
 * POST /api/leads — capture a lead from product quote forms
 * GET  /api/leads — health check
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const errors: string[] = [];
    if (!body.name || body.name.trim().length < 2) errors.push("Name is required (min 2 characters)");
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) errors.push("Valid email is required");
    if (!body.phone || body.phone.replace(/[\s\-().]/g, "").length < 7) errors.push("Valid phone number is required");
    if (!body.productId) errors.push("Product ID is required");

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.trim(),
      productId: body.productId,
      insurerSlug: body.insurerSlug || "",
      category: body.category || "",
      countryCode: body.countryCode || "",
      utmSource: body.utmSource || null,
      utmMedium: body.utmMedium || null,
      utmCampaign: body.utmCampaign || null,
      referrer: request.headers.get("referer") || null,
      createdAt: new Date().toISOString(),
    };

    // ⚡ LOG TO VERCEL DASHBOARD
    console.log("═══ NEW LEAD ═══");
    console.log(JSON.stringify(lead, null, 2));
    console.log("═════════════════");

    // 📧 Forward to inbox via Resend (fire-and-forget)
    sendNotificationEmail(formatLeadEmail(lead)).catch((e) =>
      console.error("[leads] email send failed:", e)
    );

    // Non-critical /tmp write
    try {
      const fs = await import("fs");
      const path = await import("path");
      const tmpPath = path.join(
        process.env.VERCEL ? "/tmp" : path.join(process.cwd(), "data"),
        "leads.json"
      );
      const dir = path.dirname(tmpPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const existing = fs.existsSync(tmpPath)
        ? JSON.parse(fs.readFileSync(tmpPath, "utf-8"))
        : [];
      existing.push(lead);
      fs.writeFileSync(tmpPath, JSON.stringify(existing, null, 2), "utf-8");
    } catch (fsErr) {
      console.warn("[leads] /tmp write skipped:", fsErr);
    }

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll connect you with the insurer shortly.",
      leadId: lead.id,
    });
  } catch (err) {
    console.error("[leads] Error:", err);
    return NextResponse.json({ success: false, errors: ["Internal server error"] }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", endpoint: "/api/leads", method: "POST" });
}
