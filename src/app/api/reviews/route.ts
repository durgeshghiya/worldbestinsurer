import { NextRequest, NextResponse } from "next/server";
import * as fs from "fs";
import * as path from "path";

/**
 * Reviews API
 *
 * GET /api/reviews?productId=xxx — fetch reviews for a product
 * POST /api/reviews — submit a new review (moderated)
 */

interface Review {
  id: string;
  productId: string;
  rating: number; // 1-5
  title: string;
  body: string;
  authorName: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

const REVIEWS_DIR = path.join(process.cwd(), "data", "reviews");

function getReviewsFile(productId: string): string {
  // Sanitize productId for filesystem
  const safe = productId.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
  return path.join(REVIEWS_DIR, `${safe}.json`);
}

function loadReviews(productId: string): Review[] {
  const file = getReviewsFile(productId);
  if (!fs.existsSync(file)) return [];
  try {
    return JSON.parse(fs.readFileSync(file, "utf-8"));
  } catch {
    return [];
  }
}

function saveReviews(productId: string, reviews: Review[]) {
  if (!fs.existsSync(REVIEWS_DIR)) {
    fs.mkdirSync(REVIEWS_DIR, { recursive: true });
  }
  fs.writeFileSync(getReviewsFile(productId), JSON.stringify(reviews, null, 2), "utf-8");
}

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ error: "productId required" }, { status: 400 });
  }

  const reviews = loadReviews(productId);

  // Calculate aggregate
  const count = reviews.length;
  const avg = count > 0
    ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
    : 0;

  // Rating distribution
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

    // Validate
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
      verified: false, // all new reviews are unverified
      helpful: 0,
      createdAt: new Date().toISOString(),
    };

    const reviews = loadReviews(body.productId);
    reviews.push(review);
    saveReviews(body.productId, reviews);

    return NextResponse.json({ success: true, reviewId: review.id });
  } catch {
    return NextResponse.json({ success: false, errors: ["Server error"] }, { status: 500 });
  }
}
