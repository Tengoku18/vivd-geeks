import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/webp"],
    deviceSizes: [640, 1080, 1920],
    // Frames under /public are immutable — cache aggressively.
    minimumCacheTTL: 31536000,
    // WORK_PROJECTS entries can set `coverImage` to an arbitrary HTTPS
    // URL. Next/Image refuses unknown remote hosts by default; opt every
    // HTTPS host in here so editors can drop a CDN URL straight into
    // src/config/work.ts without touching this file.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;
