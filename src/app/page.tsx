import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";
import JsonLd from "@/components/atoms/JsonLd/JsonLd";
import { FAQ_CONFIG, SECTIONS_CONFIG } from "@/config/sections";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_TITLE,
  DEFAULT_OG_IMAGE,
  faqSchema,
  webPageSchema,
  serviceSchema,
  serviceCatalogSchema,
  type ServiceSchemaInput,
} from "@/lib/seo";

// Flatten every service detail across SECTIONS_CONFIG into a single list of
// ServiceSchemaInput entries. Done at module scope so the result is computed
// once at build time and shared by both the schema array and the catalog
// node — no duplicated work per request.
const SERVICE_ENTRIES: ServiceSchemaInput[] = SECTIONS_CONFIG.flatMap(
  (section) =>
    section.type === "content" && section.details
      ? section.details.map((d) => ({
          name: d.name,
          description: d.description,
          slug: d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
          category: section.heading,
        }))
      : [],
);

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
  const services = SERVICE_ENTRIES.map(serviceSchema);
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            url: "/",
            name: SITE_TITLE,
            description: SITE_DESCRIPTION,
            primaryImage: DEFAULT_OG_IMAGE,
            speakableSelectors: [
              "[data-speakable]",
              "h1",
              "[data-speakable-faq]",
            ],
            mainEntityId: `${SITE_URL}/#service-catalog`,
          }),
          serviceCatalogSchema(SERVICE_ENTRIES),
          ...services,
          faqSchema(FAQ_CONFIG.items),
        ]}
      />
      <HomePageClient />
    </>
  );
}
