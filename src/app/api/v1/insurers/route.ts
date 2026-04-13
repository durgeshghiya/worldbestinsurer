import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "@/lib/api-auth";
import { getAllInsurers, getInsurerBySlug, getProductsByInsurer } from "@/lib/data";

/**
 * GET /api/v1/insurers
 *
 * Query params:
 *   country — filter by country code
 *   slug    — get a specific insurer
 *   limit   — max results (default 50, max 200)
 *   offset  — pagination offset
 */
export async function GET(request: NextRequest) {
  const auth = authenticateRequest(request);
  if (!auth.authenticated) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const params = request.nextUrl.searchParams;
  const country = params.get("country") || undefined;
  const slug = params.get("slug");
  const limit = Math.min(parseInt(params.get("limit") || "50"), 200);
  const offset = parseInt(params.get("offset") || "0");

  // Single insurer
  if (slug) {
    const insurer = getInsurerBySlug(slug, country);
    if (!insurer) {
      return NextResponse.json({ error: "Insurer not found" }, { status: 404 });
    }
    const products = getProductsByInsurer(slug, country);
    return NextResponse.json({
      insurer: {
        slug: insurer.slug,
        name: insurer.name,
        shortName: insurer.shortName,
        type: insurer.type,
        categories: insurer.categories,
        website: insurer.website,
        headquarters: insurer.headquarters,
        established: insurer.established,
        listed: insurer.listed,
        claimSettlementRatio: insurer.claimSettlementRatio,
        networkHospitals: insurer.networkHospitals,
        countryCode: insurer.countryCode,
        productCount: products.length,
      },
    });
  }

  // List insurers
  let insurers = getAllInsurers(country);
  const total = insurers.length;
  insurers = insurers.slice(offset, offset + limit);

  return NextResponse.json({
    total,
    offset,
    limit,
    count: insurers.length,
    insurers: insurers.map((i) => ({
      slug: i.slug,
      name: i.name,
      shortName: i.shortName,
      type: i.type,
      categories: i.categories,
      headquarters: i.headquarters,
      established: i.established,
      claimSettlementRatio: i.claimSettlementRatio,
      networkHospitals: i.networkHospitals,
      countryCode: i.countryCode,
    })),
  });
}
