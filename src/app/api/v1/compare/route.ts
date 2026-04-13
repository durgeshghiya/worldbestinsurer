import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-auth";
import { getProductById } from "@/lib/data";

/**
 * GET /api/v1/compare?products=id1,id2,id3
 *
 * Returns side-by-side comparison data for up to 4 products.
 */
export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const productIds = (request.nextUrl.searchParams.get("products") || "")
    .split(",")
    .filter(Boolean)
    .slice(0, 4);

  if (productIds.length < 2) {
    return NextResponse.json(
      { error: "Provide at least 2 product IDs via ?products=id1,id2" },
      { status: 400 }
    );
  }

  const products = productIds
    .map((id) => getProductById(id))
    .filter(Boolean);

  if (products.length < 2) {
    return NextResponse.json(
      { error: "Could not find at least 2 of the requested products" },
      { status: 404 }
    );
  }

  // Build comparison matrix
  const fields = [
    "productName",
    "insurerName",
    "category",
    "countryCode",
    "premiumRange",
    "sumInsured",
    "eligibility",
    "claimSettlement",
    "networkHospitals",
    "renewability",
    "confidenceScore",
    "lastVerified",
    "specialFeatures",
    "riders",
    "waitingPeriod",
  ] as const;

  const comparison = products.map((p) => {
    const row: Record<string, unknown> = { id: p!.id };
    for (const field of fields) {
      row[field] = p![field as keyof typeof p];
    }
    return row;
  });

  return NextResponse.json({
    count: comparison.length,
    comparison,
  });
}
