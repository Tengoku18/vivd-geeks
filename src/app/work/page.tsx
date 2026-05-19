// /work — dark, consultancy-style archive. Server shell exports metadata
// and structured data; the interactive archive lives in WorkPageClient.

import type { Metadata } from "next";
import WorkPageClient from "./WorkPageClient";
import JsonLd from "@/components/atoms/JsonLd/JsonLd";
import { WORK_PROJECTS } from "@/config/work";
import {
  SITE_URL,
  breadcrumbSchema,
  absoluteUrl,
  webPageSchema,
} from "@/lib/seo";

const TITLE = "Work — Case Studies & Client Outcomes";
const DESCRIPTION =
  "Selected case studies from Vivid Geeks — SEO, paid media, brand identity, web builds, and growth systems with measured outcomes from the engagement ledger.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work" },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/work`,
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function WorkPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Vivid Geeks — Selected Work",
    itemListElement: WORK_PROJECTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/work/${p.slug}`),
      name: p.title,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            url: "/work",
            name: TITLE,
            description: DESCRIPTION,
            speakableSelectors: ["[data-speakable]", "h1"],
            breadcrumb: [
              { name: "Home", url: "/" },
              { name: "Work", url: "/work" },
            ],
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Work", url: "/work" },
          ]),
          itemListSchema,
        ]}
      />
      <WorkPageClient />
    </>
  );
}
