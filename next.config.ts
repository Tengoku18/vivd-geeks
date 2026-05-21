import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Bypass Vercel's metered Image Optimization — sources are already
    // pre-compressed (AVIF/WebP) so the optimizer adds quota cost without
    // meaningful savings. Serves files directly via the CDN.
    unoptimized: true,
    // WORK_PROJECTS entries can set `coverImage` to an arbitrary HTTPS
    // URL. Next/Image refuses unknown remote hosts by default; opt every
    // HTTPS host in here so editors can drop a CDN URL straight into
    // src/config/work.ts without touching this file.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  compress: true,
  poweredByHeader: false,
  allowedDevOrigins: ["192.168.1.72", "192.168.1.111"],
};

export default nextConfig;
