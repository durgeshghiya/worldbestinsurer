import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-auth";
import { getAllProducts, getProductsByCategory, getProductById } from "@/lib/data";
import type { Category } from "@/lib/types";

/**
 * GET /api/v1/products
 *
 * Query params:
 *   country  — filter by country code (e.g., "in", "us", "uk")
 *   category — filter by category ("health", "term-life", "motor", "travel")
 *   id       — get a specific product by ID
 *   limit    — max results (default 50, max 200)
 *   offset   — pagination offset
 */
export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth.authenticated) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.status }
    );
  }

  const params = request.nextUrl.searchParams;
  const country = params.get("country") || undefined;
  const category = params.get("category") as Category | null;
  const id = params.get("id");
  const limit = Math.min(parseInt(params.get("limit") || "50"), 200);
  const offset = parseInt(params.get("offset") || "0");

  // Single product lookup
  if (id) {
    const product = getProductById(id, country);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  }

  // List products
  let products = category
    ? getProductsByCategory(category, country)
    : getAllProducts(country);

  const total = products.length;
  products = products.slice(offset, offset + limit);

  return NextResponse.json({
    total,
    offset,
    limit,
    count: products.length,
    products: products.map((p) => ({
      id: p.id,
      productName: p.productName,
      insurerName: p.insurerName,
      insurerSlug: p.insurerSlug,
      category: p.category,
      subCategory: p.subCategory,
      countryCode: p.countryCode,
      premiumRange: p.premiumRange,
      sumInsured: p.sumInsured,
      eligibility: p.eligibility,
      claimSettlement: p.claimSettlement,
      networkHospitals: p.networkHospitals,
      renewability: p.renewability,
      confidenceScore: p.confidenceScore,
      lastVerified: p.lastVerified,
      specialFeatures: p.specialFeatures.slice(0, 5),
      sourceUrl: p.sourceUrl,
    })),
  });
}
