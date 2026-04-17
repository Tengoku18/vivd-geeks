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

// ─── CONTACT ────────────────────────────────────────────────────────────────
export interface ContactInfo {
  label: string;
  value: string;
  href: string;
}

export interface ContactConfig {
  label: string;
  heading: string;
  body: string;
  info: ContactInfo[];
  socials: { label: string; href: string }[];
  services: string[]; // populates the "what do you need" select
}

export const CONTACT_CONFIG: ContactConfig = {
  label: "008 / Contact",
  heading: "Start The Conversation",
  body: "Tell us about your brand and where you want it to go. We reply to every serious enquiry within one business day.",
  info: [
    {
      label: "Email",
      value: "hello@vividgeeks.com",
      href: "mailto:hello@vividgeeks.com",
    },
    { label: "Phone", value: "+1 (415) 555-0134", href: "tel:+14155550134" },
    {
      label: "Studio",
      value: "San Francisco · Remote",
      href: "https://maps.google.com/?q=San+Francisco",
    },
  ],
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Dribbble", href: "https://dribbble.com" },
    { label: "X / Twitter", href: "https://twitter.com" },
  ],
  services: [
    "Search & Intelligence",
    "Growth & Performance",
    "Creative & Brand",
    "Digital Infrastructure",
    "Engagement & Retention",
    "Not sure yet",
  ],
};

// ─── FAQ ────────────────────────────────────────────────────────────────────
export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqConfig {
  label: string;
  heading: string;
  body: string;
  items: FaqItem[];
}

export const FAQ_CONFIG: FaqConfig = {
  label: "009 / FAQ",
  heading: "Questions, Answered",
  body: "The short version of what most prospective clients ask us before the first call. Still curious? Use the form above — we reply within a business day.",
  items: [
    {
      question: "What does a typical engagement look like?",
      answer:
        "Most partnerships start with a focused 4–6 week discovery and strategy sprint, followed by a retained monthly engagement. We build the system, hand over the playbook, and stay embedded as operators, not advisors.",
    },
    {
      question: "Do you work with early-stage startups?",
      answer:
        "Selectively. We take on pre-seed to Series A companies when there's a clear thesis, a product in market, and budget for at least six months of work. If the fit isn't right we'll tell you on the intro call.",
    },
    {
      question: "How is pricing structured?",
      answer:
        "Fixed-scope sprints for strategy and creative; monthly retainers for growth, performance, and infrastructure. Typical engagements land between $12k–$45k per month depending on surface area. No markups on ad spend or tooling.",
    },
    {
      question: "Can you take over an existing ad account or site?",
      answer:
        "Yes — most clients come to us with live accounts and a history of spend. We audit, preserve the learning, and rebuild the layers that are hurting performance before we push anything new.",
    },
    {
      question: "Do you offer one-off projects?",
      answer:
        "For brand identity, site builds, or a single campaign — yes. For anything that needs to compound (SEO, paid, CRO), no. We only accept work we can meaningfully move the needle on.",
    },
    {
      question: "Who owns the work when we finish?",
      answer:
        "You do. Every account, asset, document, and integration is under your ownership from day one. We build on your infrastructure, never ours.",
    },
  ],
};

// ─── FOOTER ─────────────────────────────────────────────────────────────────
export interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

export interface FooterCta {
  heading: string[]; // each string = one display line
  body: string;
  buttonText: string;
  buttonHref: string;
}

export interface FooterConfig {
  cta: FooterCta;
  tagline: string;
  columns: FooterColumn[];
  legalLinks: { label: string; href: string }[];
  copyright: string;
}

export const FOOTER_CONFIG: FooterConfig = {
  cta: {
    heading: ["Have a vision?", "Let's make it real."],
    body: "Currently accepting a limited number of engagements for Q2 2026.",
    buttonText: "Book an intro call",
    buttonHref: "mailto:hello@vividgeeks.com?subject=Intro%20call",
  },
  tagline:
    "An independent digital agency architecting market dominance for ambitious brands.",
  columns: [
    {
      title: "Studio",
      links: [
        { label: "About", href: "#about" },
        { label: "Work", href: "#work" },
        { label: "Careers", href: "#careers" },
      ],
    },
    {
      title: "Services",
      links: [
        { label: "Search & Intelligence", href: "#search-intelligence" },
        { label: "Growth & Performance", href: "#growth-performance" },
        { label: "Creative & Brand", href: "#creative-brand" },
        { label: "Digital Infrastructure", href: "#digital-infrastructure" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "Instagram", href: "https://instagram.com" },
        { label: "LinkedIn", href: "https://linkedin.com" },
        { label: "Dribbble", href: "https://dribbble.com" },
      ],
    },
  ],
  legalLinks: [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
    { label: "Cookies", href: "#cookies" },
  ],
  copyright: `© ${new Date().getFullYear()} Vivid Geeks. All rights reserved.`,
};
