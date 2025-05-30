import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/',
      },
    ];
  },
};

export default nextConfig;
