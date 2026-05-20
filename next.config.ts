import type { NextConfig } from "next";

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://52.90.228.120:3000';

const nextConfig: NextConfig = {
  rewrites: async () => ([
    { source: '/api/waitlist',       destination: `${BACKEND_URL}/api/waitlist` },
    { source: '/api/backend/:path*', destination: `${BACKEND_URL}/api/:path*` },
  ]),
};

export default nextConfig;
