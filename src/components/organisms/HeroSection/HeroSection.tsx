// src/components/organisms/HeroSection/HeroSection.tsx
// RSC — no "use client". Renders purely static HTML; animation is handled
// by CSS keyframes (entrance) and the CanvasScene (scroll-driven fade).
//
// Right panel layering (desktop only, absolute inset-y-0 right-0 w-[48%]):
//   z-0  HeroOrb3D    — Three.js wireframe icosahedron (3D depth layer)
//   z-10 HeroPlayground — 2D interactive particle network (front layer)
//
// Entrance animation:
//   Each text element has `hero-enter` applied via inline style so the RSC
//   never needs client JS for the initial reveal. Delays are timed to start
//   roughly when the Loader overlay has finished fading (~0.9 s after frames
//   finish loading). animation-fill-mode:both keeps elements invisible until
//   their delay fires.

import type { HeroConfig } from "@/config/sections";
import { Typography } from "@/components/atoms/Typography";
import { Typewriter } from "@/components/atoms/Typewriter/Typewriter";
import HeroPlayground from "@/components/organisms/HeroPlayground/HeroPlayground";
import HeroOrb3DLazy from "@/components/organisms/HeroOrb3D/HeroOrb3DLazy";
// import ShaderBackgroundLazy from "@/components/organisms/ShaderBackground/ShaderBackgroundLazy";
import ShaderGradientBgLazy from "@/components/organisms/ShaderGradientBg/ShaderGradientBgLazy";
import HeroShells3DLazy from "@/components/organisms/HeroShells3D/HeroShells3DLazy";

interface Props {
  config: HeroConfig;
}

const ENTER = "hero-enter 0.85s cubic-bezier(0.22,1,0.36,1) both";

export default function HeroSection({ config }: Props) {
  return (
    // BUG FIX: id="hero-section" must match what CanvasScene queries via
    // document.getElementById("hero-section"). Keep these in sync.
    <section
      id="hero-section"
      className="bg-bg-dark pointer-events-none fixed inset-0 z-20 flex flex-col items-start justify-center transition-opacity duration-75 ease-linear"
    >
      {/* ── Shader gradient — full-screen animated WebGL backdrop ───────── */}
      {/* Sits at z-0 behind everything, on every breakpoint. bg-bg-dark on
          the section is now just a flash-of-bg fallback while the canvas
          mounts. */}
      {/* Metaballs raymarcher — replaced by ShaderGradient waterPlane.
      <ShaderBackgroundLazy className="pointer-events-none absolute inset-0 z-0 hidden md:block" />
      */}
      <ShaderGradientBgLazy className="pointer-events-none absolute inset-0 z-0" />

      {/* ── Right panel — all 3D layers commented out for now ─
      <HeroShells3DLazy className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-[52%] md:block" />
      <HeroOrb3DLazy className="pointer-events-none absolute inset-y-0 right-0 z-1 hidden w-[48%] md:block" />
      <HeroPlayground className="pointer-events-auto absolute inset-y-0 right-0 z-2 hidden w-[48%] md:block" />
      ── */}

      {/* ── Text content ──────────────────────────────────────────────── */}
      {/* min-w-0 + break-words guard the heading from extending past the
          viewport on tiny phones (~320 px wide) where a long typewriter
          phrase would otherwise force horizontal overflow. The flex parent
          inherits w-full from the section, so this just constrains the
          inner column to the available content area. */}
      <div className="relative z-20 flex w-full min-w-0 flex-col items-start px-5 text-left wrap-break-word sm:px-6 md:max-w-[60%] md:px-12 lg:px-20 xl:px-28">
        {/* Label — first to enter */}
        <Typography
          variant="label"
          className="mb-5"
          style={{ animation: ENTER, animationDelay: "0.85s" }}
        >
          {config.label}
        </Typography>

        {/* Display heading — each line staggers in after the label */}
        <Typography variant="display" as="h1" className="flex flex-col">
          {config.heading.map((line, i) => (
            <span
              key={i}
              className="block"
              style={{
                animation: ENTER,
                animationDelay: `${1.0 + i * 0.12}s`,
              }}
            >
              {line}
            </span>
          ))}
          {/* Typewriter handles its own appearance — just delay its container */}
          <span
            className="block"
            style={{ animation: ENTER, animationDelay: `${1.0 + config.heading.length * 0.12}s` }}
          >
            <Typewriter phrases={config.typewriterPhrases} />
          </span>
        </Typography>

        {/* Tagline */}
        <Typography
          variant="body"
          className="mt-8 max-w-lg"
          style={{ animation: ENTER, animationDelay: "1.3s" }}
        >
          {config.tagline}
        </Typography>
      </div>

      {/* ── Scroll hint ───────────────────────────────────────────────── */}
      <div
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 motion-reduce:hidden"
        aria-hidden="true"
        style={{ animation: ENTER, animationDelay: "1.5s" }}
      >
        <span className="text-[0.6rem] tracking-[0.4em] text-white/30 uppercase">Scroll</span>
        <svg
          width="14"
          height="20"
          viewBox="0 0 14 20"
          fill="none"
          className="text-white/25"
          style={{ animation: "scroll-bob 2.6s ease-in-out infinite 2s" }}
        >
          <rect x="1" y="1" width="12" height="18" rx="6" stroke="currentColor" strokeWidth="1.2" />
          <rect x="6" y="4" width="2" height="5" rx="1" fill="currentColor" />
        </svg>
      </div>
    </section>
  );
}
