// src/config/sections.ts
// Central configuration: changing values here never requires touching
// component files. Animation choreography is scheduled automatically.

// ─── FRAME SETTINGS ─────────────────────────────────────────────────────────
// FRAME_COUNT matches the number of WebPs in public/frames (extracted by ffmpeg).
// FRAME_SPEED 1.8–2.2 — higher = product animation finishes earlier in scroll.
// IMAGE_SCALE 0.82–0.90 — padded cover mode around the canvas drawImage.
export const FRAME_COUNT = 121;
export const FRAME_SPEED = 2.0;
export const IMAGE_SCALE = 1.0;

// ─── TYPES ──────────────────────────────────────────────────────────────────
export type AnimationType =
  | "fade-up"
  | "slide-left"
  | "slide-right"
  | "scale-up"
  | "rotate-in"
  | "stagger-up"
  | "clip-reveal";

export type SectionAlignment = "left" | "right" | "center";

// Explicit interface — do not use typeof HERO_CONFIG as a prop type.
// typeof infers readonly literal types that reject user-created objects.
export interface HeroConfig {
  label: string;
  heading: string[]; // each string = one display line
  typewriterPhrases: string[]; // rotating phrases typed below heading
  tagline: string;
}

export interface MarqueeConfig {
  text: string;
  speed: number; // negative = moves left
  enterAt: number; // % scroll to fade in
  leaveAt: number; // % scroll to fade out
}

interface SectionBase {
  id: string;
  animation: AnimationType;
  alignment?: SectionAlignment;
  // enter/leave are auto-calculated by distributeScrollRanges.
  // Only set manually if you need to override the distribution.
  enter?: number;
  leave?: number;
}

export interface ContentSection extends SectionBase {
  type: "content";
  label: string;
  heading: string;
  body: string;
  note?: string;
}

export interface StatItem {
  value: number;
  decimals?: number;
  suffix?: string;
  label: string;
}

export interface StatsSectionData extends SectionBase {
  type: "stats";
  alignment: "center";
  stats: StatItem[];
}

export interface CtaSectionData extends SectionBase {
  type: "cta";
  // type "cta" always persists — no persist flag needed.
  // distributeScrollRanges detects CTA via type, not persist.
  label: string;
  heading: string;
  body: string;
  buttonText: string;
  buttonHref: string;
}

// NOTE: "marquee" type is a fixed overlay, NOT a scroll section.
// Do not add marquee entries to SECTIONS_CONFIG. Use MARQUEE_CONFIG instead.
export type Section = ContentSection | StatsSectionData | CtaSectionData;

// ─── PAGE CONFIG ─────────────────────────────────────────────────────────────
// Add, remove, or reorder entries here.
// RULE: never use the same animation type for two consecutive entries.
// RULE: exactly one entry should have type "cta" — it must be last.
export const SECTIONS_CONFIG: Section[] = [
  {
    id: "search-intelligence",
    type: "content",
    animation: "slide-left",
    alignment: "left",
    label: "002 / Search & Intelligence",
    heading: "Search & Intelligence",
    body: "Own the moment your customer is looking for a solution.",
    note: "SEO · AEO · Google Ads",
  },
  {
    id: "growth-performance",
    type: "content",
    animation: "slide-right",
    alignment: "right",
    label: "003 / Growth & Performance",
    heading: "Growth & Performance",
    body: "Profitable scaling through data-backed customer acquisition.",
    note: "Performance Marketing · Meta Ads · Lead Generation",
  },
  {
    id: "creative-brand",
    type: "content",
    animation: "rotate-in",
    alignment: "left",
    label: "004 / Creative & Brand",
    heading: "Creative & Brand Identity",
    body: "Building the trust factor that justifies premium pricing.",
    note: "Logo · Graphics · Video · Content",
  },
  {
    id: "digital-infrastructure",
    type: "content",
    animation: "clip-reveal",
    alignment: "right",
    label: "005 / Digital Infrastructure",
    heading: "Digital Infrastructure",
    body: "The digital foundation that turns traffic into revenue.",
    note: "Web Design & Development · CRM & Sales Funnel",
  },
  {
    id: "engagement-retention",
    type: "content",
    animation: "scale-up",
    alignment: "left",
    label: "006 / Engagement & Retention",
    heading: "Engagement & Retention",
    body: "Turning one-time buyers into lifetime brand advocates.",
    note: "Email Marketing · Social Media Management",
  },
  {
    id: "stats",
    type: "stats",
    animation: "stagger-up",
    alignment: "center",
    stats: [
      { value: 24, suffix: "hrs", label: "Avg. Response" },
      { value: 3.5, decimals: 1, suffix: "×", label: "Avg. ROAS" },
      { value: 98, suffix: "%", label: "Client Retention" },
      { value: 50, suffix: "k+", label: "Leads Delivered" },
    ],
  },
  {
    id: "cta",
    type: "cta",
    animation: "fade-up",
    alignment: "left",
    label: "007 / Let's Build",
    heading: "Architect Your Market Dominance",
    body: "Most agencies sell clicks and impressions. We build systems that transform them into a measurable increase in your bottom line.",
    buttonText: "Start The Conversation",
    buttonHref: "#",
  },
];

export const HERO_CONFIG: HeroConfig = {
  label: "VIVID GEEKS · DIGITAL AGENCY",
  heading: ["We Turn"],
  typewriterPhrases: [
    "Clicks Into Revenue.",
    "Brands Into Authorities.",
    "Visitors Into Customers.",
    "Leads Into Loyalty.",
    "Data Into Dominance.",
  ],
  tagline:
    "We don't manage your digital presence — we architect your market dominance.",
};

export const MARQUEE_CONFIG: MarqueeConfig = {
  text: "VIVID GEEKS · MOTION, CRAFTED ·",
  speed: -25,
  enterAt: 18,
  leaveAt: 80,
};

// ID of the stats section that triggers the dark overlay.
export const STATS_SECTION_ID = "stats";
