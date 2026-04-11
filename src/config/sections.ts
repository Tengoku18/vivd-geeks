// src/config/sections.ts
// Central configuration: changing values here never requires touching
// component files. Animation choreography is scheduled automatically.

// ─── FRAME SETTINGS ─────────────────────────────────────────────────────────
// FRAME_COUNT matches the number of WebPs in public/frames (extracted by ffmpeg).
// FRAME_SPEED 1.8–2.2 — higher = product animation finishes earlier in scroll.
// IMAGE_SCALE 0.82–0.90 — padded cover mode around the canvas drawImage.
export const FRAME_COUNT = 121;
export const FRAME_SPEED = 2.0;
export const IMAGE_SCALE = 0.87;

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
    id: "feature-1",
    type: "content",
    animation: "slide-left",
    alignment: "left",
    label: "002 / Feature",
    heading: "Engineered For Motion",
    body: "Frame-perfect scroll choreography that reveals the product one beat at a time.",
  },
  {
    id: "feature-2",
    type: "content",
    animation: "slide-right",
    alignment: "right",
    label: "003 / Feature",
    heading: "Crafted Details",
    body: "Every transition earns its place. No filler, no drift — just deliberate pacing.",
  },
  {
    id: "feature-3",
    type: "content",
    animation: "rotate-in",
    alignment: "left",
    label: "004 / Detail",
    heading: "Built From The Grain Up",
    body: "Materials and micro-interactions considered at the same level of care.",
  },
  {
    id: "stats",
    type: "stats",
    animation: "stagger-up",
    alignment: "center",
    stats: [
      { value: 24, suffix: "hrs", label: "Retention" },
      { value: 3.5, decimals: 1, suffix: "×", label: "Performance" },
      { value: 98, suffix: "%", label: "Satisfaction" },
      { value: 50, suffix: "k+", label: "Users" },
    ],
  },
  {
    id: "closing",
    type: "content",
    animation: "scale-up",
    alignment: "left",
    label: "005 / Details",
    heading: "Precision, End To End",
    body: "The experience that ships is the one we keep iterating on — never the one we sketched first.",
  },
  {
    id: "cta",
    type: "cta",
    animation: "fade-up",
    alignment: "left",
    label: "006 / Get Started",
    heading: "Ready?",
    body: "Bring this energy to your own product.",
    buttonText: "Get In Touch",
    buttonHref: "#",
  },
];

export const HERO_CONFIG: HeroConfig = {
  label: "001 / Vivid Geeks",
  heading: ["Vivid", "Geeks"],
  tagline: "A scroll-driven product story rendered frame by frame.",
};

export const MARQUEE_CONFIG: MarqueeConfig = {
  text: "VIVID GEEKS · MOTION, CRAFTED ·",
  speed: -25,
  enterAt: 18,
  leaveAt: 80,
};

// ID of the stats section that triggers the dark overlay.
export const STATS_SECTION_ID = "stats";
