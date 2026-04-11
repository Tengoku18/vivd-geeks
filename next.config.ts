import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 1080, 1920],
    // Frames under /public are immutable — cache aggressively.
    minimumCacheTTL: 31536000,
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
