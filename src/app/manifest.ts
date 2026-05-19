import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Vivid Geeks",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0b1d35",
    theme_color: "#0b1d35",
    orientation: "portrait",
    categories: ["business", "marketing", "design"],
    icons: [
      {
        src: "/logo/black/darkmode-logo-only.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
