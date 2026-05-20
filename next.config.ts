import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => ([
    { source: '/api/waitlist',       destination: 'http://52.90.228.120:3000/api/waitlist' },
    { source: '/api/backend/:path*', destination: 'http://52.90.228.120:3000/api/:path*' },
  ]),
};

export default nextConfig;
