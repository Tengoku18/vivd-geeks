// src/config/work.ts
// Project catalogue for the /work bookshelf. Each entry is one "book" —
// covers, spine art, and case-study copy all derive from this single source.
// Keep the order newest → oldest; the timeline at the bottom renders 1:1.

export type Season = "Winter" | "Spring" | "Summer" | "Fall";

export interface WorkProject {
  slug: string;
  title: string;
  subtitle: string;
  year: number;
  season: Season;
  client: string;
  discipline: string; // e.g. "E-commerce • Brand • Paid"
  // Visual identity for the cover. Two-tier system:
  //   - If `coverImage` is set, that wins — the card and the case-study
  //     hero render the image as the background.
  //   - Otherwise the gradient defined by `coverBackground` takes over.
  // `coverImage` may be a /public path (e.g. "/images/lumen.jpg") or any
  // absolute https URL — `next.config.ts` permits both.
  coverImage?: string;
  coverBackground: string; // any valid `background` shorthand — fallback when no coverImage
  coverTextColor: string; // hex / rgb / currentColor — sits over the cover
  accentColor: string; // used for badges, flip-back ink
  tagline: string; // shown on cover
  summary: string; // shown on detail overlay back + case-study intro
  body: string[]; // case-study paragraphs
  metrics: { label: string; value: string }[];
  externalUrl?: string; // optional "visit live site" link on case study
}

// Dummy agency work — swap in real entries without touching any component.
export const WORK_PROJECTS: WorkProject[] = [
  {
    slug: "lumen-atlas",
    title: "Lumen Atlas",
    subtitle: "Commerce, reimagined",
    year: 2026,
    season: "Winter",
    client: "Lumen Atlas",
    discipline: "E-commerce • Brand • Performance",
    coverBackground:
      "radial-gradient(120% 120% at 15% 10%, #ffd7a3 0%, #ff8a5b 35%, #2a0f3c 80%)",
    coverTextColor: "#fff5e6",
    accentColor: "#ff8a5b",
    tagline: "A Shopify rebuild that doubled AOV",
    summary:
      "Headless Shopify migration, full identity refresh, and a paid-media engine that lifted AOV 112% in six months.",
    body: [
      "Lumen Atlas came to us with a beautiful product and a store that could not keep up. Checkout abandonment was sitting above 80% and their paid channels were bleeding cash on broken attribution.",
      "We rebuilt the storefront headless on Next.js + Shopify Hydrogen, re-pointed the tag stack through GTM server-side, and rebuilt every acquisition asset from the brand up.",
      "Three months post-launch, AOV had climbed from $48 to $102 and blended ROAS held 4.1× at triple the spend.",
    ],
    metrics: [
      { label: "AOV lift", value: "+112%" },
      { label: "Blended ROAS", value: "4.1×" },
      { label: "Checkout time", value: "-38%" },
    ],
    externalUrl: "https://example.com",
  },
  {
    slug: "harbor-and-hue",
    title: "Harbor & Hue",
    subtitle: "Hospitality, quietly confident",
    year: 2025,
    season: "Fall",
    client: "Harbor & Hue Hotels",
    discipline: "Brand • Web • CRM",
    coverBackground:
      "linear-gradient(160deg, #0f2027 0%, #2c5364 50%, #e8c39e 100%)",
    coverTextColor: "#f7efe2",
    accentColor: "#e8c39e",
    tagline: "A boutique group's first direct-booking engine",
    summary:
      "Four properties, one booking flow, and a loyalty CRM that routes returning guests past OTA fees.",
    body: [
      "Harbor & Hue had grown from one coastal property to four and still depended on OTA inventory for 70% of nights sold.",
      "We designed a single booking flow across all four houses, built the CRM to identify and re-engage direct-channel guests, and shipped an editorial site that finally looked like the rooms.",
      "Direct bookings are now 54% of revenue; margin on those stays is 22 points higher than OTA.",
    ],
    metrics: [
      { label: "Direct bookings", value: "+163%" },
      { label: "OTA dependence", value: "-31pts" },
      { label: "Repeat rate", value: "2.4×" },
    ],
  },
  {
    slug: "nocturne-labs",
    title: "Nocturne Labs",
    subtitle: "B2B with a pulse",
    year: 2025,
    season: "Summer",
    client: "Nocturne Labs",
    discipline: "Web • SEO • Content",
    coverBackground:
      "linear-gradient(135deg, #1a1a2e 0%, #4a2c80 45%, #f56565 100%)",
    coverTextColor: "#f4efff",
    accentColor: "#f56565",
    tagline: "Developer-tool brand, built for search",
    summary:
      "A technical content engine and a site architecture that moved organic from 8k to 140k monthly sessions.",
    body: [
      "Nocturne shipped a great product with almost no inbound pipeline. Sales was hand-selling every deal and the docs site was doing all the marketing.",
      "We mapped a content ladder against bottom-funnel queries, rebuilt information architecture around job-to-be-done pages, and trained their PMMs on a repeatable brief.",
      "Eighteen months in, 41% of qualified pipeline now cites a blog post in the lead source field.",
    ],
    metrics: [
      { label: "Organic sessions", value: "+1,650%" },
      { label: "Inbound pipeline", value: "+38%" },
      { label: "Pages ranking top 10", value: "220+" },
    ],
  },
  {
    slug: "saltwater-supply",
    title: "Saltwater Supply",
    subtitle: "DTC with a voice",
    year: 2024,
    season: "Winter",
    client: "Saltwater Supply Co.",
    discipline: "Creative • Paid Social • Retention",
    coverBackground:
      "linear-gradient(180deg, #f4e1c1 0%, #f4a261 55%, #6d597a 100%)",
    coverTextColor: "#1a1a1a",
    accentColor: "#6d597a",
    tagline: "Paid-social creative at the speed of culture",
    summary:
      "A weekly creative sprint that shipped 40+ hooks per month and turned Meta into their cheapest channel.",
    body: [
      "Saltwater's first-party margins were healthy, but their creative cycle was slow — two ads a week, shot once a quarter, and fatigued fast.",
      "We embedded a two-person creative cell with their brand team and moved them to a weekly testing rhythm: 10 hooks, 4 edits, 2 winners.",
      "CPA on Meta dropped 44% in the first quarter and the cell has shipped every Friday since.",
    ],
    metrics: [
      { label: "CPA on Meta", value: "-44%" },
      { label: "Hooks / month", value: "40+" },
      { label: "Repeat rate", value: "+27%" },
    ],
  },
  {
    slug: "field-and-form",
    title: "Field & Form",
    subtitle: "A studio, off-grid",
    year: 2024,
    season: "Summer",
    client: "Field & Form Studio",
    discipline: "Brand • Editorial • Web",
    coverBackground:
      "linear-gradient(135deg, #2d5016 0%, #a8b68d 50%, #f4f1ed 100%)",
    coverTextColor: "#1a1a1a",
    accentColor: "#2d5016",
    tagline: "A design studio's editorial-first portfolio",
    summary:
      "Long-form case studies, a custom CMS, and a brand system built for ten years of work, not one launch.",
    body: [
      "Field & Form wanted a portfolio that read like their pitch deck — quiet, confident, hero-image heavy, and easy to update without a developer.",
      "We shipped a Sanity-backed Next.js site with reusable editorial blocks, and a brand system built around a single variable font.",
      "Three of their five biggest inbound projects since launch have cited a specific case study by name.",
    ],
    metrics: [
      { label: "Inbound leads", value: "+210%" },
      { label: "Time on site", value: "4m 18s" },
      { label: "Case studies shipped", value: "22" },
    ],
  },
  {
    slug: "monsoon-club",
    title: "Monsoon Club",
    subtitle: "Membership, reinvented",
    year: 2023,
    season: "Fall",
    client: "Monsoon Club",
    discipline: "Product • CRM • Retention",
    coverBackground:
      "linear-gradient(135deg, #6e3b75 0%, #d988b9 50%, #ffd166 100%)",
    coverTextColor: "#1a1a1a",
    accentColor: "#6e3b75",
    tagline: "A subscription wine club that stopped churning",
    summary:
      "Lifecycle journeys, segment-aware merchandising, and a win-back loop that halved churn inside a year.",
    body: [
      "Monsoon was acquiring members faster than it could keep them. Month-three churn was 38% and the team was firefighting cancellation tickets.",
      "We rebuilt onboarding, added a pause-before-cancel path, and tied the CRM to consumption data so re-engagement emails referenced the last bottle shipped.",
      "Annualised net revenue retention went from 71% to 119% over twelve months.",
    ],
    metrics: [
      { label: "Month-3 churn", value: "-48%" },
      { label: "NRR", value: "119%" },
      { label: "Win-back rate", value: "31%" },
    ],
  },
  {
    slug: "paper-moon",
    title: "Paper Moon",
    subtitle: "A publisher, digital-first",
    year: 2023,
    season: "Spring",
    client: "Paper Moon Media",
    discipline: "Web • SEO • Growth",
    coverBackground:
      "linear-gradient(135deg, #0b132b 0%, #1c2541 45%, #c0a062 100%)",
    coverTextColor: "#f4f1ed",
    accentColor: "#c0a062",
    tagline: "An independent publisher built for the algorithm era",
    summary:
      "A content platform rebuild, a subscription funnel, and programmatic SEO that added a third revenue line.",
    body: [
      "Paper Moon had a devoted readership and a CMS that had not been meaningfully updated since 2016. Every new idea cost weeks of engineer time.",
      "We migrated them to a modern headless stack, built a subscription paywall with granular gating, and shipped four programmatic SEO surfaces.",
      "Subscription revenue now clears three months of payroll every month, and organic traffic has tripled.",
    ],
    metrics: [
      { label: "Paid subscribers", value: "+320%" },
      { label: "Organic sessions", value: "3.1×" },
      { label: "Pages published / wk", value: "120+" },
    ],
  },
  {
    slug: "orchard-and-oak",
    title: "Orchard & Oak",
    subtitle: "Farm-to-table, direct",
    year: 2022,
    season: "Fall",
    client: "Orchard & Oak",
    discipline: "E-commerce • Brand • Retention",
    coverBackground:
      "linear-gradient(135deg, #c44536 0%, #e09f3e 45%, #335c67 100%)",
    coverTextColor: "#f4f1ed",
    accentColor: "#335c67",
    tagline: "A regional grocer's first real storefront",
    summary:
      "Subscription boxes, a membership tier, and an identity that finally matched the produce in the crate.",
    body: [
      "Orchard & Oak had built a fifteen-year wholesale business and wanted to go direct without cannibalising their restaurant accounts.",
      "We designed a subscription product, built the ops flow for weekly assembly, and shipped a brand that the founders' daughters actually wanted to hand-deliver.",
      "Direct-to-consumer is now 28% of revenue and zero restaurant accounts have churned because of it.",
    ],
    metrics: [
      { label: "DTC revenue share", value: "28%" },
      { label: "Boxes / week", value: "1,400+" },
      { label: "Wholesale retained", value: "100%" },
    ],
  },
];
