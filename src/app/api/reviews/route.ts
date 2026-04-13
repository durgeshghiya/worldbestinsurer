import { NextRequest, NextResponse } from "next/server";
import { readJson, appendToJsonArray } from "@/lib/storage";

/**
 * Reviews API (Vercel-compatible)
 */

interface Review {
  id: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
  authorName: string;
  verified: boolean;
  createdAt: string;
}

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const allReviews = readJson<Review[]>("reviews.json", []);
  const reviews = allReviews.filter((r) => r.productId === productId);

  const count = reviews.length;
  const avg = count > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
    : 0;

  const distribution = [1, 2, 3, 4, 5].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return NextResponse.json({
    productId,
    aggregate: { average: avg, count },
    distribution,
    reviews: reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const errors: string[] = [];
    if (!body.productId) errors.push("productId required");
    if (!body.rating || body.rating < 1 || body.rating > 5) errors.push("rating must be 1-5");
    if (!body.title || body.title.trim().length < 3) errors.push("title required (min 3 chars)");
    if (!body.body || body.body.trim().length < 10) errors.push("review body required (min 10 chars)");
    if (!body.authorName || body.authorName.trim().length < 2) errors.push("name required");

    if (errors.length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const review: Review = {
      id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      productId: body.productId,
      rating: Math.round(body.rating),
      title: body.title.trim().slice(0, 200),
      body: body.body.trim().slice(0, 2000),
      authorName: body.authorName.trim().slice(0, 100),
      verified: false,
      createdAt: new Date().toISOString(),
    };

    console.log("═══ NEW REVIEW ═══");
    console.log(JSON.stringify(review, null, 2));
    console.log("═══════════════════");

    appendToJsonArray("reviews.json", review);

    return NextResponse.json({ success: true, reviewId: review.id });
  } catch {
    return NextResponse.json({ success: false, errors: ["Server error"] }, { status: 500 });
  }
}
