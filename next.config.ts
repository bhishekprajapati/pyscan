import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    typedRoutes: true,
    useCache: true,
    cacheLife: {
      gasTrend: {
        revalidate: 3600 * 12,
        stale: 3600 * 24,
        expire: 3600 * 24 * 2,
      },
    },
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
