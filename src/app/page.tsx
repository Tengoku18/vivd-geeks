import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";
import JsonLd from "@/components/atoms/JsonLd/JsonLd";
import { FAQ_CONFIG } from "@/config/sections";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_TITLE,
  faqSchema,
} from "@/lib/seo";

// Server component shell — exposes metadata + structured data, then
// hands off to the client tree for the scroll-driven hero experience.
// Keeping page.tsx server-rendered is what lets Next.js inject metadata
// and inline crawler-readable JSON-LD into the prerendered HTML.

export const metadata: Metadata = {
  title: {
    absolute: SITE_TITLE,
  },
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function Home() {
  return (
    <>
      <JsonLd data={faqSchema(FAQ_CONFIG.items)} />
      <HomePageClient />
    </>
  );
}
