import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://52.90.228.120:3000';

const nextConfig: NextConfig = {
  rewrites: async () => ([
    { source: '/api/waitlist',       destination: `${BACKEND_URL}/api/waitlist` },
    { source: '/api/backend/:path*', destination: `${BACKEND_URL}/api/:path*` },
  ]),
  // 301 redirects for consolidated/retired blog URLs, so their SEO authority
  // flows to the canonical evergreen page that replaced them, and old indexed
  // URLs stop returning 404 (a 404 drops the page's rankings and breadcrumbs).
  redirects: async () => ([
    { source: '/blog/gold-falls-fed-hawkish-june-2026', destination: '/blog/gold-price-today', permanent: true },
    { source: '/blog/bitcoin-price-june-2026-crypto-india', destination: '/blog/bitcoin-price-today', permanent: true },
    // Retired June-dated pages (deleted 2026-07-01) -> closest live equivalent.
    { source: '/blog/india-us-trade-deal-june-2026', destination: '/blog/india-us-trade-deal-2026', permanent: true },
    { source: '/blog/iran-us-peace-deal-june-2026-india-market-impact', destination: '/blog/crude-oil-price-today', permanent: true },
    { source: '/blog/sensex-rally-iran-peace-talks-june-2026', destination: '/blog/indian-stock-market-today', permanent: true },
    { source: '/blog/ai-stocks-selloff-capex-june-2026', destination: '/blog/indian-stock-market-today', permanent: true },
    { source: '/blog/indian-it-stocks-crash-accenture-june-2026', destination: '/blog/indian-stock-market-today', permanent: true },
    { source: '/blog/rbi-june-2026-repo-rate-unchanged', destination: '/blog/indian-stock-market-today', permanent: true },
    { source: '/blog/us-fed-fomc-june-2026-warsh-rate-hold-neutral', destination: '/blog/indian-stock-market-today', permanent: true },
    { source: '/blog/us-fed-kevin-warsh-june-2026-rate-hold', destination: '/blog/indian-stock-market-today', permanent: true },
    { source: '/blog/ecb-rate-hike-europe-economy-june-2026', destination: '/blog/indian-stock-market-today', permanent: true },
    { source: '/blog/nifty-week-ahead-june-22-2026', destination: '/blog/indian-stock-market-today', permanent: true },
    { source: '/blog/global-markets-week-ahead-june-22-2026', destination: '/blog/stock-market-july-2026-what-to-watch', permanent: true },
    { source: '/blog/turtlemint-ipo-june-2026', destination: '/blog/how-to-apply-for-ipo-india', permanent: true },
    { source: '/blog/susan-electricals-sme-ipo-june-2026', destination: '/blog/how-to-apply-for-ipo-india', permanent: true },
  ]),
};

export default nextConfig;
