import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { REMOVED_PRODUCT_MAP } from "@/lib/removed-products";

const VALID_COUNTRY_CODES = new Set([
  "in", "us", "uk", "ae", "sg", "ca", "au", "de", "sa", "jp", "kr", "hk",
]);

const CATEGORY_TO_PATH: Record<string, string> = {
  health: "/in/compare/health/",
  "term-life": "/in/compare/term-life/",
  motor: "/in/compare/motor/",
  travel: "/in/compare/travel/",
};

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Match /product/{id}/ or /product/{id}
  const productMatch = pathname.match(/^\/product\/([^\/]+)\/?$/);
  if (productMatch) {
    const id = productMatch[1];
    const category = REMOVED_PRODUCT_MAP[id];
    if (category) {
      // 301 redirect to the appropriate compare page
      const target = CATEGORY_TO_PATH[category] || "/in/compare/health/";
      return NextResponse.redirect(new URL(target, request.url), 301);
    }
  }

  // Match /{country}/product/{id}/
  const countryProductMatch = pathname.match(/^\/([a-z]{2})\/product\/([^\/]+)\/?$/);
  if (countryProductMatch) {
    const cc = countryProductMatch[1];
    const id = countryProductMatch[2];
    if (VALID_COUNTRY_CODES.has(cc)) {
      const category = REMOVED_PRODUCT_MAP[id];
      if (category) {
        const target = `/${cc}/compare/${category}/`;
        return NextResponse.redirect(new URL(target, request.url), 301);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/product/:path*",
    "/:country/product/:path*",
  ],
};
