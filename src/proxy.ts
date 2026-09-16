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

/**
 * /admin is internal. With ADMIN_PASSWORD set it needs HTTP Basic auth
 * (any username). Without it, it is hidden in production and open only in
 * local development, so an unconfigured deploy never exposes it.
 */
function guardAdmin(request: NextRequest): NextResponse | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    return process.env.VERCEL_ENV === "production"
      ? new NextResponse("Not found", { status: 404, headers: { "X-Robots-Tag": "noindex" } })
      : null;
  }
  const header = request.headers.get("authorization") ?? "";
  const [scheme, encoded] = header.split(" ");
  if (scheme === "Basic" && encoded) {
    const decoded = atob(encoded);
    const supplied = decoded.slice(decoded.indexOf(":") + 1);
    if (timingSafeEqual(supplied, password)) return null;
  }
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="WBI admin"', "X-Robots-Tag": "noindex" },
  });
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    return guardAdmin(request) ?? NextResponse.next();
  }

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
    "/admin",
    "/admin/:path*",
  ],
};
