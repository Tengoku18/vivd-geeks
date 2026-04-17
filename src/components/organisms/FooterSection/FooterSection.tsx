// src/components/organisms/FooterSection/FooterSection.tsx
"use client";
import { useEffect, useRef } from "react";
import type { FooterConfig } from "@/config/sections";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { LiveClock } from "@/components/atoms/LiveClock";
import { cn } from "@/lib/cn";

// Inline style that repeats a faint dot at a fixed cadence. Used as a
// full-bleed background overlay to add texture without pulling focus.
const DOT_GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(240,237,232,0.08) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

interface Props {
  config: FooterConfig;
}

export default function FooterSection({ config }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    type STInstance = { kill: () => void };
    let trigger: STInstance | undefined;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const ctaLines = el.querySelectorAll<HTMLElement>(".footer-cta-line");
      const ctaSupporting = el.querySelectorAll<HTMLElement>(
        ".footer-cta-supporting",
      );
      const ctaVisual = el.querySelector<HTMLElement>(".footer-cta-visual");
      const reveals = el.querySelectorAll<HTMLElement>(".footer-reveal");

      const tl = gsap.timeline({ paused: true });

      if (ctaLines.length) {
        tl.from(ctaLines, {
          y: 60,
          opacity: 0,
          stagger: 0.12,
          duration: 1,
          ease: "power4.out",
        });
      }

      if (ctaVisual) {
        tl.from(
          ctaVisual,
          {
            scale: 0.85,
            opacity: 0,
            duration: 1.1,
            ease: "power3.out",
          },
          "-=0.8",
        );
      }

      if (ctaSupporting.length) {
        tl.from(
          ctaSupporting,
          {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.55",
        );
      }

      tl.from(
        reveals,
        {
          y: 30,
          opacity: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.45",
      );

      trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 85%",
        once: true,
        onEnter: () => tl.play(),
      });
    };

    init();
    return () => {
      trigger?.kill();
    };
  }, []);

  const scrollToTop = () => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={ref}
      className="bg-bg-dark relative z-[30] w-full overflow-hidden"
    >
      {/* Top divider */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/15 to-transparent"
      />

      {/* ── Ambient background (dot grid + drifting glow orbs) ──────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={DOT_GRID_STYLE}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/4 -right-1/4 h-[80vmin] w-[80vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,169,126,0.14),transparent_65%)] blur-3xl"
        style={{ animation: "drift-a 22s ease-in-out infinite" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1/3 -left-1/4 h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,160,220,0.08),transparent_65%)] blur-3xl"
        style={{ animation: "drift-b 28s ease-in-out infinite" }}
      />

      <div className="relative w-full px-6 pt-24 pb-10 md:px-12 md:pt-32 lg:px-20 xl:px-28">
        {/* ── Final CTA band ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 items-center gap-16 pb-20 md:grid-cols-[1.15fr_1fr] md:gap-20 md:pb-28">
          <div className="flex flex-col items-start gap-8">
            <h2
              className={cn(
                "font-display uppercase leading-[0.95] text-text-on-dark",
                "text-[clamp(2.25rem,5.5vw,5rem)]",
                "[text-shadow:0_2px_18px_rgba(0,0,0,0.75)]",
                "flex flex-col",
              )}
            >
              {config.cta.heading.map((line, i) => (
                <span key={i} className="footer-cta-line block">
                  {line}
                </span>
              ))}
            </h2>

            <Typography
              variant="body"
              className="footer-cta-supporting max-w-md text-white/70"
            >
              {config.cta.body}
            </Typography>

            <div className="footer-cta-supporting">
              <Button href={config.cta.buttonHref}>
                {config.cta.buttonText}
              </Button>
            </div>
          </div>

          {/* ── Right visual: rotating rings + availability card ──────── */}
          <div className="footer-cta-visual relative mx-auto hidden aspect-square w-full max-w-[440px] md:block">
            <svg
              viewBox="0 0 400 400"
              fill="none"
              stroke="currentColor"
              className="text-text-on-dark absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {/* Static outer ring */}
              <circle
                cx="200"
                cy="200"
                r="196"
                strokeWidth="1"
                opacity="0.12"
              />

              {/* Slow rotation — dashed ring */}
              <g
                style={{
                  transformOrigin: "200px 200px",
                  animation: "rotate-slow 40s linear infinite",
                }}
              >
                <circle
                  cx="200"
                  cy="200"
                  r="160"
                  strokeWidth="1.25"
                  strokeDasharray="3 14"
                  opacity="0.5"
                />
              </g>

              {/* Counter-rotation — accent arc */}
              <g
                style={{
                  transformOrigin: "200px 200px",
                  animation: "rotate-slow-reverse 30s linear infinite",
                }}
              >
                <circle
                  cx="200"
                  cy="200"
                  r="128"
                  stroke="var(--color-accent)"
                  strokeWidth="1"
                  strokeDasharray="1 28"
                  opacity="0.75"
                />
              </g>

              {/* Orbiting dot */}
              <g
                style={{
                  transformOrigin: "200px 200px",
                  animation: "rotate-slow 25s linear infinite",
                }}
              >
                <circle
                  cx="200"
                  cy="4"
                  r="3"
                  fill="var(--color-accent)"
                  stroke="none"
                />
              </g>

              {/* Faint inner ring */}
              <circle
                cx="200"
                cy="200"
                r="96"
                strokeWidth="1"
                opacity="0.08"
              />
            </svg>

            {/* Availability card sits at the SVG's center */}
            <div className="absolute top-1/2 left-1/2 flex w-[72%] max-w-[260px] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3 text-center">
              <span className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span
                    aria-hidden="true"
                    className="bg-accent absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{
                      animation: "pulse-soft 2.4s ease-in-out infinite",
                    }}
                  />
                  <span className="bg-accent relative inline-flex h-2 w-2 rounded-full" />
                </span>
                <span className="font-body text-text-on-dark text-[0.7rem] tracking-[0.3em] uppercase">
                  Available
                </span>
              </span>

              <span className="font-display text-text-on-dark text-2xl tracking-[0.05em] lg:text-3xl">
                <LiveClock timeZone="Australia/Sydney" />
              </span>

              <span className="font-body text-[0.65rem] tracking-[0.3em] text-white/50 uppercase">
                Sydney · Australia
              </span>

              <span className="mt-1 inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 font-body text-[0.6rem] tracking-[0.3em] text-white/70 uppercase">
                Q2 2026 · 02 slots
              </span>
            </div>
          </div>
        </div>

        {/* Divider between CTA band and nav columns */}
        <div
          aria-hidden="true"
          className="mb-16 h-px w-full bg-linear-to-r from-transparent via-white/15 to-transparent md:mb-20"
        />

        {/* ── Columns ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-10">
          <div className="footer-reveal flex flex-col gap-5">
            <span className="font-display text-text-on-dark text-2xl tracking-[0.15em] uppercase">
              Vivid Geeks
            </span>
            <Typography variant="body" className="max-w-sm text-white/70">
              {config.tagline}
            </Typography>
            <a
              href="mailto:hello@vividgeeks.com"
              className="font-body hover:text-accent w-fit text-sm tracking-[0.2em] text-white/75 uppercase transition-colors"
            >
              hello@vividgeeks.com
            </a>
          </div>

          {config.columns.map((col) => (
            <nav
              key={col.title}
              aria-label={col.title}
              className="footer-reveal flex flex-col gap-4"
            >
              <Typography
                variant="label"
                className="text-white/45"
                as="span"
              >
                {col.title}
              </Typography>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => {
                  const isExternal = /^https?:\/\//.test(link.href);
                  return (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        {...(isExternal
                          ? { target: "_blank", rel: "noreferrer noopener" }
                          : {})}
                        className={cn(
                          "font-body text-[0.95rem] tracking-[0.04em]",
                          "text-white/80 hover:text-accent",
                          "border-b border-transparent hover:border-accent",
                          "transition-[color,border-color] duration-200",
                        )}
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        {/* Divider above the bottom bar */}
        <div
          aria-hidden="true"
          className="mt-16 h-px w-full bg-linear-to-r from-transparent via-white/15 to-transparent md:mt-20"
        />

        {/* ── Bottom bar ───────────────────────────────────────────────── */}
        <div className="footer-reveal mt-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-body text-[0.75rem] tracking-[0.2em] text-white/50 uppercase">
            {config.copyright}
          </p>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-3">
            {config.legalLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="font-body hover:text-accent text-[0.75rem] tracking-[0.2em] text-white/50 uppercase transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={scrollToTop}
                className="group font-body hover:text-accent inline-flex items-center gap-2 text-[0.75rem] tracking-[0.2em] text-white/50 uppercase transition-colors"
                aria-label="Back to top"
              >
                <span>Back to top</span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:-translate-y-0.5"
                >
                  ↑
                </span>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
