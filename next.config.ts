import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    useCache: true,
  },
  logging: {
    fetches: {
      fullUrl: true,
      hmrRefreshes: false,
    },
    incomingRequests: true,
  },
};

export default nextConfig;
