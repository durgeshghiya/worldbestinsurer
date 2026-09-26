import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  async redirects() {
    return [
      // 1. Redirect legacy city pages (12,000+ thin pages) to their country category hub
      {
        source: '/:country/compare/:category/in/:city',
        destination: '/:country/compare/:category/',
        permanent: true,
      },
      // 2. Redirect old unlocalized product pages to their localized counterparts
      // (We assume 'in' as default if they hit the old URL structure)
      {
        source: '/product/:id',
        destination: '/in/product/:id/',
        permanent: true,
      },
      // 3. Catch-all for unlocalized city pages
      {
        source: '/compare/:category/in/:city',
        destination: '/in/compare/:category/',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
