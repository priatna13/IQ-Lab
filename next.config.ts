import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Surface more server error context in production logs (still redacted in browser).
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
