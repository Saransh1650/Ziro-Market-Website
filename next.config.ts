import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://52.90.228.120:3000';

const nextConfig: NextConfig = {
  rewrites: async () => ([
    { source: '/api/waitlist',       destination: `${BACKEND_URL}/api/waitlist` },
    { source: '/api/backend/:path*', destination: `${BACKEND_URL}/api/:path*` },
  ]),
  // 301 redirects for consolidated/retired blog URLs, so their SEO authority
  // flows to the canonical evergreen page that replaced them.
  redirects: async () => ([
    { source: '/blog/gold-falls-fed-hawkish-june-2026', destination: '/blog/gold-price-today', permanent: true },
  ]),
};

export default nextConfig;
