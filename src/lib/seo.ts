// Central SEO constants — single source of truth for canonical URLs,
// company identity, and JSON-LD structured data used across the site.
// Update here once when domain, contact details, or services change.

export const SITE_URL = "https://vividgeeksdigital.com.au";
export const SITE_NAME = "Vivid Geeks Digital";
export const SITE_TITLE =
  "Vivid Geeks Digital — SEO, Paid Media, Creative & Growth Systems";
export const SITE_DESCRIPTION =
  "Vivid Geeks Digital is a Sydney-based digital agency that builds systems turning clicks into revenue — SEO, AEO, paid media, creative, web, CRM and retention under one roof.";
export const SITE_KEYWORDS = [
  "digital marketing agency Sydney",
  "SEO agency Sydney",
  "AEO answer engine optimization",
  "Google Ads agency",
  "Meta Ads agency",
  "performance marketing Australia",
  "lead generation agency",
  "growth marketing agency",
  "CRM and sales funnels",
  "web design and development Sydney",
  "brand identity agency",
  "email marketing agency",
  "social media management Sydney",
  "Vivid Geeks",
];
export const SITE_LOCALE = "en_AU";
export const SITE_TWITTER = "@vividgeeksdigital";
export const COMPANY_EMAIL = "hello@vividgeeksdigital.com.au";
export const COMPANY_PHONE = "+61403372187";
export const COMPANY_LOGO = `${SITE_URL}/logo/black/darkmode-horizontal.png`;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/opengraph-image.jpeg`;

export const SOCIAL_PROFILES = [
  "https://www.instagram.com/vividgeeksdigital",
  "https://www.linkedin.com/company/best-ever-digital-marketing-agency/",
  "https://www.facebook.com/profile.php?id=61574347935078",
];

export function absoluteUrl(path: string): string {
  if (!path.startsWith("/")) return path;
  return `${SITE_URL}${path}`;
}

// ─── JSON-LD builders ──────────────────────────────────────────────────────
// Schema.org primitives. Each helper returns a plain object that callers
// embed inside a <script type="application/ld+json"> tag.

export interface JsonLd {
  // Schema.org dictates an open shape; keep it loose.
  [key: string]: unknown;
}

export function organizationSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    legalName: "Vivid Geeks Digital",
    alternateName: "Vivid Geeks",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: COMPANY_LOGO,
      width: 512,
      height: 512,
    },
    image: DEFAULT_OG_IMAGE,
    description: SITE_DESCRIPTION,
    email: COMPANY_EMAIL,
    telephone: COMPANY_PHONE,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sydney",
      addressRegion: "NSW",
      addressCountry: "AU",
    },
    sameAs: SOCIAL_PROFILES,
    knowsAbout: [
      "Search Engine Optimization",
      "Answer Engine Optimization",
      "Google Ads",
      "Meta Ads",
      "Performance Marketing",
      "Lead Generation",
      "Brand Identity",
      "Web Design",
      "CRM and Sales Funnels",
      "Email Marketing",
      "Social Media Management",
    ],
    areaServed: [
      { "@type": "Country", name: "Australia" },
      { "@type": "Place", name: "Worldwide" },
    ],
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: "en-AU",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function professionalServiceSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#service`,
    name: SITE_NAME,
    url: SITE_URL,
    image: DEFAULT_OG_IMAGE,
    description: SITE_DESCRIPTION,
    priceRange: "$$$",
    telephone: COMPANY_PHONE,
    email: COMPANY_EMAIL,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sydney",
      addressRegion: "NSW",
      addressCountry: "AU",
    },
    areaServed: [
      { "@type": "Country", name: "Australia" },
      { "@type": "Place", name: "Worldwide" },
    ],
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[],
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface CaseStudySchemaInput {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  client: string;
}

export function caseStudySchema(input: CaseStudySchemaInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.title,
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.url),
    image: input.image,
    datePublished: input.datePublished,
    author: { "@id": `${SITE_URL}/#organization` },
    creator: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    about: input.client,
  };
}
