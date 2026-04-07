import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/api/:path*',
        destination: 'http://52.90.228.120:3000/api/:path*',
      },
    ];
  },
};

export default nextConfig;
