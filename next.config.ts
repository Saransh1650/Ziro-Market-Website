import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://52.90.228.120:3000';

const nextConfig: NextConfig = {
  rewrites: async () => ([
    { source: '/api/waitlist',       destination: `${BACKEND_URL}/api/waitlist` },
    { source: '/api/backend/:path*', destination: `${BACKEND_URL}/api/:path*` },
  ]),
  headers: async () => ([
    {
      source: '/:path*',
      headers: [
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        // Scoped to just the clickjacking protection (frame-ancestors) rather
        // than a full script/style/connect-src policy — the latter needs to be
        // audited against every third-party origin actually in use (Vercel
        // Analytics, next/font, the backend API) before it can ship safely.
        { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    },
    {
      // Defense-in-depth: robots.txt already disallows crawling /api/, this
      // keeps compliant-but-JS-executing bots and link-preview scrapers out too.
      source: '/api/:path*',
      headers: [{ key: 'X-Robots-Tag', value: 'noindex' }],
    },
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
    // Same-day pre-release forecast, superseded by the actuals post once MOSPI
    // published the real May 2026 CPI print (both dated 2026-06-12).
    { source: '/blog/india-may-cpi-inflation-2026', destination: '/blog/india-may-2026-cpi-inflation-3-93-percent', permanent: true },
    // Consolidation 2026-09-06. GSC showed ~11 impressions sitewide and these
    // pages were competing with each other for the same queries. Merged into
    // one canonical page per query; unique analysis was folded in first.
    { source: '/blog/operation-economic-outcast-iran-sanctions-2026', destination: '/blog/india-iran-oil-sanctions-august-2026', permanent: true },
    { source: '/blog/iran-us-ceasefire-oil-price-2026-global-impact', destination: '/blog/india-iran-oil-sanctions-august-2026', permanent: true },
    { source: '/blog/strait-of-hormuz-india-oil-crisis-2026', destination: '/blog/what-happens-if-strait-of-hormuz-closes', permanent: true },
    { source: '/blog/gold-price-india-record-2026', destination: '/blog/gold-rate-today-india', permanent: true },
  ]),
};

export default nextConfig;
