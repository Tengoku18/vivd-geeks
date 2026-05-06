// src/components/organisms/TestimonialsSection/TestimonialsSection.tsx
"use client";
import { useEffect, useRef } from "react";
import type { TestimonialsConfig, TestimonialItem } from "@/config/sections";
import { SectionHeader } from "@/components/molecules/SectionHeader/SectionHeader";
import { Typography } from "@/components/atoms/Typography";
import { cn } from "@/lib/cn";

interface Props {
  config: TestimonialsConfig;
}

export default function TestimonialsSection({ config }: Props) {
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

      const intro = el.querySelectorAll<HTMLElement>(".testimonial-intro");
      const track = el.querySelector<HTMLElement>(".testimonial-track");

      const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!motionOk) {
        gsap.set(intro, { opacity: 1, y: 0 });
        if (track) gsap.set(track, { opacity: 1 });
        return;
      }

      const tl = gsap.timeline({ paused: true });
      tl.from(intro, {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
      });
      if (track) {
        tl.from(
          track,
          { opacity: 0, duration: 1.0, ease: "power2.out" },
          "-=0.4",
        );
      }

      trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 78%",
        once: true,
        onEnter: () => tl.play(),
      });
    };

    init();
    return () => {
      trigger?.kill();
    };
  }, []);

  // Duplicate the item set so the track loops seamlessly while moving right.
  const loopItems = [...config.items, ...config.items];

  return (
    <section
      ref={ref}
      id="testimonials"
      className="bg-bg-dark relative z-[30] w-full overflow-hidden"
    >
      {/* Top hairline divider — mirrors Contact */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent"
      />
      {/* Dot-grid texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(rgba(240,237,232,0.08) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Drifting accent glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-1/3 -left-1/4 h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,169,126,0.12),transparent_65%)] blur-3xl"
        style={{ animation: "drift-a 28s ease-in-out infinite" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-1/3 right-0 h-[55vmin] w-[55vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,160,220,0.08),transparent_65%)] blur-3xl"
        style={{ animation: "drift-b 34s ease-in-out infinite" }}
      />

      <div className="relative px-6 pt-24 md:px-12 md:pt-32 lg:px-20 lg:pt-40 xl:px-28">
        {/* ── Intro ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_1.1fr] md:gap-20">
          <div className="testimonial-intro">
            <SectionHeader label={config.label} heading={config.heading} />
          </div>
          <Typography
            variant="body"
            className="testimonial-intro max-w-md self-end md:mb-2"
          >
            {config.body}
          </Typography>
        </div>
      </div>

      {/* ── Marquee track ─────────────────────────────────────────────── */}
      <div className="group relative mt-16 pb-24 md:mt-20 md:pb-32 lg:pb-40">
        {/* edge fades — let cards dissolve at viewport sides */}
        <div
          aria-hidden="true"
          className="from-bg-dark pointer-events-none absolute inset-y-0 left-0 z-10 w-[12vw] bg-linear-to-r to-transparent"
        />
        <div
          aria-hidden="true"
          className="from-bg-dark pointer-events-none absolute inset-y-0 right-0 z-10 w-[12vw] bg-linear-to-l to-transparent"
        />

        <div
          className={cn(
            "testimonial-track flex w-max gap-6 will-change-transform",
            "[animation:marquee-right_60s_linear_infinite]",
            "group-hover:[animation-play-state:paused]",
            "motion-reduce:[animation-play-state:paused]",
          )}
        >
          {loopItems.map((t, i) => (
            <Card key={`${t.author}-${i}`} item={t} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ item }: { item: TestimonialItem }) {
  return (
    <article
      className={cn(
        "group/card relative isolate flex shrink-0 flex-col overflow-hidden rounded-lg",
        "w-[85vw] sm:w-[440px] md:w-[460px]",
        "border border-white/10 bg-white/[0.035] backdrop-blur-md",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        "transition-[transform,border-color,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:border-accent/40 hover:bg-white/[0.06] hover:-translate-y-1",
      )}
    >
      {/* Soft inner radial — adds depth without a hard gradient line */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 [background:radial-gradient(120%_60%_at_0%_0%,rgba(200,169,126,0.08),transparent_60%)]"
      />

      {/* Decorative quote glyph — anchored with breathing room, ghosted */}
      <span
        aria-hidden="true"
        className={cn(
          "font-display text-accent/20 pointer-events-none absolute select-none",
          "top-6 left-7 text-[6.5rem] leading-[0.8]",
        )}
      >
        &ldquo;
      </span>

      <div className="relative flex h-full flex-col p-8 pt-24 md:p-10 md:pt-28">
        {item.metric && (
          <span
            className={cn(
              "font-body text-accent inline-flex w-fit items-center gap-2",
              "border-accent/30 rounded-full border px-3 py-1",
              "text-[0.7rem] tracking-[0.2em] uppercase",
              "bg-accent/[0.06]",
            )}
          >
            <span
              aria-hidden="true"
              className="bg-accent inline-block h-1 w-1 rounded-full"
            />
            {item.metric}
          </span>
        )}

        <p className="font-body text-text-on-dark/85 mt-5 flex-1 text-[1rem] leading-[1.7]">
          {item.quote}
        </p>

        <div className="mt-8 flex items-center gap-4">
          {/* Avatar monogram — the author's initial in an accent-tinted disc */}
          <span
            aria-hidden="true"
            className={cn(
              "font-display flex h-10 w-10 shrink-0 items-center justify-center",
              "border-accent/30 bg-accent/10 text-accent rounded-full border",
              "text-sm tracking-[0.05em] uppercase",
            )}
          >
            {item.author.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="font-display text-text-on-dark text-[0.95rem] tracking-[0.02em] uppercase">
              {item.author}
            </p>
            <p className="font-body mt-1 truncate text-xs tracking-[0.05em] text-white/55">
              {item.role}
            </p>
          </div>
        </div>

        {/* Bottom accent rule — thin, animates wider on hover */}
        <span
          aria-hidden="true"
          className={cn(
            "bg-accent/50 mt-7 block h-px w-10",
            "transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            "group-hover/card:w-20",
          )}
        />
      </div>
    </article>
  );
}
