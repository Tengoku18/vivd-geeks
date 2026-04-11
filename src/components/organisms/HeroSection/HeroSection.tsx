// src/components/organisms/HeroSection/HeroSection.tsx
// RSC — no "use client". Renders purely static HTML.
//
// Uses the SectionHeader molecule for the label and Typography atom for
// the multi-line display heading. Animation is handled by the page/Canvas
// scene via the fixed id="hero-section".

import type { HeroConfig } from "@/config/sections";
import { Typography } from "@/components/atoms/Typography";

interface Props {
  config: HeroConfig;
}

export default function HeroSection({ config }: Props) {
  return (
    // BUG FIX: id="hero-section" must match what CanvasScene queries via
    // document.getElementById("hero-section"). Keep these in sync.
    <section
      id="hero-section"
      className="bg-bg-dark fixed inset-0 z-20 flex flex-col justify-end px-8 pb-20 transition-opacity duration-75 ease-linear md:px-12 md:pb-24 lg:px-20 xl:px-28"
    >
      <div className="mx-auto flex w-full max-w-400 flex-col">
        <Typography variant="label" className="mb-4">
          {config.label}
        </Typography>
        <Typography variant="display" as="h1" className="flex flex-col">
          {config.heading.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </Typography>
        <Typography variant="body" className="mt-6 max-w-md">
          {config.tagline}
        </Typography>
      </div>
      <div
        className="absolute right-8 bottom-10 text-[0.65rem] tracking-[0.3em] text-white/25 md:right-12 lg:right-20 xl:right-28"
        aria-hidden="true"
      >
        SCROLL ↓
      </div>
    </section>
  );
}
