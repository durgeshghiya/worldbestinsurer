import type { MetadataRoute } from "next";

/**
 * robots.txt. Protects non-public paths and advertises the sitemap index.
 * CSS, JS (/_next/) and images are deliberately NOT blocked: Google must be
 * able to render pages to evaluate them.
 *
 * Note: Cloudflare prepends its own managed block (AI crawler rules) to the
 * served file. That block is configured in Cloudflare, not here.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/debug/", "/login/", "/private/"],
      },
    ],
    sitemap: "https://worldbestinsurer.com/sitemap.xml",
  };
}
