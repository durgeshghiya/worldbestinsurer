import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

/**
 * Lead Capture API Endpoint
 *
 * POST /api/leads
 * Body: { name, email, phone, productId, insurerSlug, category, countryCode, utmSource?, utmMedium?, utmCampaign? }
 *
 * Stores leads in data/leads/YYYY-MM.json (append-only, one file per month).
 * In production, replace with Supabase/PlanetScale + webhook to CRM.
 */

interface LeadPayload {
  name: string;
  email: string;
  phone: string;
  productId: string;
  insurerSlug: string;
  category: string;
  countryCode: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  // Allow international formats: +91..., (800)..., 0044..., etc.
  const cleaned = phone.replace(/[\s\-().]/g, "");
  return /^\+?\d{7,15}$/.test(cleaned);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<LeadPayload>;

    // Validate required fields
    const errors: string[] = [];
    if (!body.name || body.name.trim().length < 2) errors.push("Name is required (min 2 characters)");
    if (!body.email || !validateEmail(body.email)) errors.push("Valid email is required");
    if (!body.phone || !validatePhone(body.phone)) errors.push("Valid phone number is required");
    if (!body.productId) errors.push("Product ID is required");
    if (!body.countryCode) errors.push("Country code is required");

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    // Build lead record
    const lead = {
      id: `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      name: body.name!.trim(),
      email: body.email!.trim().toLowerCase(),
      phone: body.phone!.trim(),
      productId: body.productId!,
      insurerSlug: body.insurerSlug || "",
      category: body.category || "",
      countryCode: body.countryCode!,
      utmSource: body.utmSource || null,
      utmMedium: body.utmMedium || null,
      utmCampaign: body.utmCampaign || null,
      referrer: request.headers.get("referer") || null,
      userAgent: request.headers.get("user-agent") || null,
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null,
      createdAt: new Date().toISOString(),
    };

    // Store to monthly JSON file (file-based for now; swap for DB in production)
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const leadsDir = path.join(process.cwd(), "data", "leads");

    // Ensure dir exists
    if (!fs.existsSync(leadsDir)) {
      fs.mkdirSync(leadsDir, { recursive: true });
    }

    const filePath = path.join(leadsDir, `${monthKey}.json`);
    let existingLeads: unknown[] = [];
    if (fs.existsSync(filePath)) {
      try {
        existingLeads = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      } catch {
        existingLeads = [];
      }
    }

    existingLeads.push(lead);
    fs.writeFileSync(filePath, JSON.stringify(existingLeads, null, 2), "utf-8");

    console.log(`[leads] New lead captured: ${lead.id} | ${lead.email} | ${lead.productId} | ${lead.countryCode}`);

    return NextResponse.json({
      success: true,
      message: "Thank you! We'll connect you with the insurer shortly.",
      leadId: lead.id,
    });
  } catch (err) {
    console.error("[leads] Error:", err);
    return NextResponse.json(
      { success: false, errors: ["Internal server error"] },
      { status: 500 }
    );
  }
}

// GET /api/leads — simple lead count for admin (no sensitive data)
export async function GET() {
  try {
    const leadsDir = path.join(process.cwd(), "data", "leads");
    if (!fs.existsSync(leadsDir)) {
      return NextResponse.json({ totalLeads: 0, months: {} });
    }

    const files = fs.readdirSync(leadsDir).filter((f) => f.endsWith(".json"));
    const months: Record<string, number> = {};
    let total = 0;

    for (const file of files) {
      try {
        const data = JSON.parse(fs.readFileSync(path.join(leadsDir, file), "utf-8"));
        const count = Array.isArray(data) ? data.length : 0;
        months[file.replace(".json", "")] = count;
        total += count;
      } catch {
        // skip corrupted files
      }
    }

    return NextResponse.json({ totalLeads: total, months });
  } catch {
    return NextResponse.json({ totalLeads: 0, months: {} });
  }
}
