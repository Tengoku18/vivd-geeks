// src/components/organisms/HeroSection/HeroSection.tsx
// RSC — no "use client". Renders purely static HTML.
//
// Uses the SectionHeader molecule for the label and Typography atom for
// the multi-line display heading. Animation is handled by the page/Canvas
// scene via the fixed id="hero-section".

import type { HeroConfig } from "@/config/sections";
import { Typography } from "@/components/atoms/Typography";
import { Typewriter } from "@/components/atoms/Typewriter/Typewriter";
import HeroPlayground from "@/components/organisms/HeroPlayground/HeroPlayground";

interface Props {
  config: HeroConfig;
}

export default function HeroSection({ config }: Props) {
  return (
    // BUG FIX: id="hero-section" must match what CanvasScene queries via
    // document.getElementById("hero-section"). Keep these in sync.
    <section
      id="hero-section"
      className="bg-bg-dark fixed inset-0 z-20 flex flex-col items-start justify-center transition-opacity duration-75 ease-linear"
    >
      {/* Interactive particle network — desktop only, occupies the right
          portion of the hero. Desktop heading still has ~55% width on the
          left, which fits "WORTH SCROLLING." comfortably at clamp() sizes. */}
      <HeroPlayground className="pointer-events-auto absolute inset-y-0 right-0 hidden w-[48%] md:block" />
      <div className="relative z-10 flex w-full flex-col items-start px-6 text-left md:max-w-[60%] md:px-12 lg:px-20 xl:px-28">
        <Typography variant="label" className="mb-5">
          {config.label}
        </Typography>
        <Typography variant="display" as="h1" className="flex flex-col">
          {config.heading.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
          <span className="block">
            <Typewriter phrases={config.typewriterPhrases} />
          </span>
        </Typography>
        <Typography variant="body" className="mt-8 max-w-lg">
          {config.tagline}
        </Typography>
      </div>
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-[0.65rem] tracking-[0.35em] whitespace-nowrap text-white/30"
        aria-hidden="true"
      >
        SCROLL ↓
      </div>
    </section>
  );
}
