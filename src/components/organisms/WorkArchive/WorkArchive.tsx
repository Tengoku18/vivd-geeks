// src/components/organisms/WorkArchive/WorkArchive.tsx
// Dark, consultancy-style /work surface. Replaces the cream "bookshelf"
// presentation with a layout that matches the rest of the site: dark
// background, gold accent, display type in caps, ambient glow + dot grid,
// and large project cards that read as case studies — not products on a
// shelf.
//
// Layout:
//   1. Hero — eyebrow + display heading + body + 4-stat row
//   2. Featured project — full-width card for the latest engagement
//   3. Archive grid — 2-col grid of remaining projects
//
// Scroll choreography (GSAP + ScrollTrigger):
//   - Hero copy stagger-fades in on mount.
//   - Each card fades + lifts as it enters the viewport.
//   - Each card's gradient + content layers parallax against scroll for
//     a subtle "alive" feel while browsing.
//
// All copy and gradients pull from WORK_PROJECTS so adding a new project
// drops in everywhere automatically.

"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { WORK_PROJECTS, type WorkProject } from "@/config/work";
import { getLenis } from "@/lib/lenisInstance";
import { cn } from "@/lib/cn";

// Preempt scroll-to-top before route navigation completes. Snapping the
// outgoing Lenis target to 0 here means the new case-study page can't
// inherit a non-zero anchor during the brief overlap when the old
// instance is still alive but the new page is hydrating.
function snapToTop() {
  if (typeof window === "undefined") return;
  window.scrollTo(0, 0);
  getLenis()?.scrollTo(0, { immediate: true, force: true });
}

const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.9'/></svg>\")";

const DOT_GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(240,237,232,0.08) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

interface ProjectCardProps {
  project: WorkProject;
  featured?: boolean;
  index: number;
}

function ProjectCard({
  project,
  featured = false,
  index,
}: ProjectCardProps) {
  return (
    <Link
      href={`/work/${project.slug}`}
      aria-label={`Open ${project.title} case study`}
      onClick={snapToTop}
      data-work-card
      className={cn(
        "group relative block overflow-hidden border border-white/10 bg-bg-dark",
        // Hover-only CSS transitions. GSAP only animates opacity on this
        // element, which is not in the transition list, so they don't
        // interfere.
        "transition-[border-color,box-shadow,translate] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
        "hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_30px_60px_-30px_rgba(200,169,126,0.35)]",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
        // Aspect ratio steps down as the column gets wider:
        //   mobile single-col → tall portrait (4/5)
        //   md two-col (~360px wide) → square
        //   lg+ two-col (~500–620px wide) → landscape (5/4) so the card
        //     never blows past viewport height
        // Featured card spans full width so it can stay cinematic at md+.
        featured
          ? "aspect-4/5 md:aspect-[2.2/1]"
          : "aspect-4/5 md:aspect-square lg:aspect-5/4",
      )}
    >
      {/* Top accent rule in the project's brand colour. Fades in and
          extends across on hover — small detail that gives each card its
          own identity without coupling the gradient choice. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-20 h-0.5 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-x-100"
        style={{ backgroundColor: project.accentColor }}
      />

      {/* Cover. Image wins when supplied; gradient is the fallback. Both
          live in the same wrapper so the hover-scale tween applies
          uniformly regardless of which one is rendered. */}
      <div
        aria-hidden={project.coverImage ? undefined : true}
        className="absolute inset-0 transition-transform duration-900 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.05]"
        style={
          project.coverImage ? undefined : { background: project.coverBackground }
        }
      >
        {project.coverImage && (
          <Image
            src={project.coverImage}
            alt={`${project.title} cover`}
            fill
            // Two columns at md+, single col below — sizes hint helps
            // Next/Image pick the right responsive variant.
            sizes="(min-width: 768px) 50vw, 100vw"
            // Featured card is above-the-fold on first paint so we mark
            // it as priority. Index 0 = the featured one.
            priority={featured}
            className="object-cover"
          />
        )}
      </div>

        {/* Bottom-up scrim. Without this, the title sits over the gradient
            mid-tones and loses contrast on the lighter covers. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-linear-to-t from-bg-dark/95 via-bg-dark/45 to-transparent"
        />

        {/* Film grain — the same SVG-noise data URI used elsewhere on the
            site so cards don't read as "flat CSS gradients". */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.18]"
          style={{ backgroundImage: GRAIN_BG }}
        />

        {/* TOP META — index numeral + discipline pill. flex-wrap with a gap
            ensures the pill drops to a second line on narrow screens instead
            of overlapping the numeral. The pill itself uses a smaller font
            on mobile so it usually fits inline. */}
        <div
          data-card-top
          className="relative z-10 flex flex-wrap items-start justify-between gap-x-4 gap-y-3 p-5 sm:p-6 md:p-8 lg:p-10"
        >
          <span className="font-body text-[0.55rem] tracking-[0.3em] uppercase text-white/65 md:text-[0.6rem]">
            {String(index + 1).padStart(2, "0")} / {project.season}{" "}
            {project.year}
          </span>
          <span className="font-body inline-flex max-w-full rounded-full border border-white/25 bg-black/30 px-2.5 py-1 text-[0.5rem] tracking-[0.2em] uppercase text-white/85 backdrop-blur-md md:px-3 md:py-1.5 md:text-[0.55rem] md:tracking-[0.25em]">
            {project.discipline}
          </span>
        </div>

        {/* BOTTOM CONTENT — absolute so the card height is governed by its
            aspect ratio, not by the copy. Long titles still wrap cleanly
            thanks to text-balance. Mobile uses tighter padding. */}
        <div
          data-card-bottom
          className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6 md:p-8 lg:p-10"
        >
          <p className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-white/55 md:text-[0.65rem]">
            {project.client}
          </p>
          <h3
            className={cn(
              "font-display mt-2 leading-[0.95] tracking-tight uppercase text-text-on-dark md:mt-3",
              "[text-shadow:0_2px_18px_rgba(0,0,0,0.55)]",
              featured
                ? "text-[clamp(1.85rem,5vw,4.75rem)]"
                : "text-[clamp(1.35rem,2.6vw,2.6rem)]",
            )}
            style={{ textWrap: "balance" }}
          >
            {project.title}
          </h3>
          <p
            className={cn(
              "font-body mt-3 leading-normal text-white/75 md:mt-4 md:leading-[1.55]",
              featured
                ? "max-w-xl text-sm md:text-base lg:text-lg"
                : "max-w-md text-[0.85rem] md:text-sm",
            )}
          >
            {project.tagline}.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-6">
            <span className="font-body inline-flex items-center gap-2 text-[0.65rem] tracking-[0.3em] uppercase text-text-on-dark transition-colors group-hover:text-accent md:text-[0.7rem]">
              View case study
              <span
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-x-1"
              >
                →
              </span>
            </span>
            {featured && project.metrics?.length > 0 && (
              <ul className="hidden items-center gap-6 border-l border-white/15 pl-6 md:flex">
                {project.metrics.slice(0, 3).map((m) => (
                  <li key={m.label} className="flex flex-col">
                    <span
                      className="font-display text-lg leading-none"
                      style={{ color: project.accentColor }}
                    >
                      {m.value}
                    </span>
                    <span className="font-body mt-1 text-[0.55rem] tracking-[0.25em] uppercase text-white/55">
                      {m.label}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
    </Link>
  );
}

export default function WorkArchive() {
  const rootRef = useRef<HTMLElement>(null);

  // Scroll choreography. Hero copy stagger-fades on mount, section heads
  // fade as they cross the fold, and each card eases in when it enters
  // the viewport. Single ease curve, single property (opacity) for the
  // cards — keeps the page calm while you scroll.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    type STInstance = { kill: () => void };
    const triggers: STInstance[] = [];
    let cancelled = false;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (reduced) return;

      // Hero — slight rise + fade so the copy doesn't appear pre-placed
      // on first paint.
      const heroBits = el.querySelectorAll<HTMLElement>("[data-hero-reveal]");
      if (heroBits.length) {
        gsap.from(heroBits, {
          y: 24,
          opacity: 0,
          duration: 1,
          ease: "power2.out",
          stagger: 0.1,
        });
      }

      // Section headers — fade their children together when they cross
      // the fold.
      el.querySelectorAll<HTMLElement>("[data-section-head]").forEach(
        (head) => {
          const t = ScrollTrigger.create({
            trigger: head,
            start: "top 90%",
            once: true,
            onEnter: () => {
              gsap.from(head.children, {
                opacity: 0,
                duration: 0.8,
                ease: "power2.out",
                stagger: 0.08,
              });
            },
          });
          triggers.push(t);
        },
      );

      // Cards — pure opacity ease-in. No translate, no scale, no rotate;
      // a single transitioning property is the calmest possible reveal
      // and avoids any subpixel jitter on smooth scroll.
      el.querySelectorAll<HTMLElement>("[data-work-card]").forEach((card) => {
        gsap.set(card, { opacity: 0 });
        const t = ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(card, {
              opacity: 1,
              duration: 1.1,
              ease: "power2.out",
            });
          },
        });
        triggers.push(t);
      });

      ScrollTrigger.refresh();
    };

    init();

    return () => {
      cancelled = true;
      for (const t of triggers) t.kill();
    };
  }, []);

  const [featured, ...rest] = WORK_PROJECTS;
  const oldestYear = Math.min(...WORK_PROJECTS.map((p) => p.year));
  const newestYear = Math.max(...WORK_PROJECTS.map((p) => p.year));
  const disciplines = new Set(
    WORK_PROJECTS.flatMap((p) =>
      p.discipline.split("•").map((s) => s.trim()),
    ),
  );

  const stats = [
    { value: WORK_PROJECTS.length.toString().padStart(2, "0"), label: "Engagements" },
    { value: `${newestYear - oldestYear + 1}`, label: "Years shipping" },
    { value: `${disciplines.size}+`, label: "Disciplines" },
    { value: "Q2 ’26", label: "Booking now" },
  ];

  return (
    <main
      ref={rootRef}
      className="bg-bg-dark text-text-on-dark relative overflow-hidden"
    >
      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-36 pb-20 md:px-12 md:pt-52 md:pb-32 lg:px-20 xl:px-28">
        {/* Ambient glow orbs — same idiom as the footer so the page reads
            as one design system, not a one-off. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/3 -right-1/4 h-[80vmin] w-[80vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,169,126,0.14),transparent_65%)] blur-3xl"
          style={{ animation: "drift-a 22s ease-in-out infinite" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/4 -left-1/4 h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,160,220,0.08),transparent_65%)] blur-3xl"
          style={{ animation: "drift-b 28s ease-in-out infinite" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={DOT_GRID_STYLE}
        />

        <div className="relative mx-auto flex max-w-350 flex-col gap-8 md:gap-10">
          <div data-hero-reveal className="flex flex-wrap items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span
                aria-hidden="true"
                className="bg-accent absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ animation: "pulse-soft 2.4s ease-in-out infinite" }}
              />
              <span className="bg-accent relative inline-flex h-2 w-2 rounded-full" />
            </span>
            <span className="font-body text-[0.65rem] tracking-[0.3em] uppercase text-white/55 md:text-[0.7rem]">
              Selected Work · {oldestYear} — {newestYear}
            </span>
          </div>

          <h1
            data-hero-reveal
            className="font-display max-w-[18ch] text-[clamp(2.25rem,7vw,6rem)] leading-[0.95] tracking-tight uppercase [text-shadow:0_2px_18px_rgba(0,0,0,0.7)]"
            style={{ textWrap: "balance" }}
          >
            Engagements that <span className="text-accent">earn</span> their
            place.
          </h1>

          <p
            data-hero-reveal
            className="font-body max-w-2xl text-base leading-[1.65] text-white/70 md:text-lg md:leading-[1.7]"
          >
            A working archive of the brands, products, and platforms we’ve
            shipped — each one measured in outcomes, not deliverables.
            Commerce, hospitality, B2B, and consumer.
          </p>

          {/* Stats row */}
          <dl
            data-hero-reveal
            className="mt-4 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/10 pt-10 sm:grid-cols-4 sm:gap-x-10 sm:gap-y-10 md:mt-6 md:pt-12"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="font-body text-[0.55rem] tracking-[0.3em] uppercase text-white/45 order-2 mt-3 md:text-[0.6rem]">
                  {s.label}
                </dt>
                <dd
                  className="font-display text-[clamp(1.5rem,2.8vw,2.6rem)] leading-none text-text-on-dark"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                >
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── FEATURED PROJECT ───────────────────────────────────────────── */}
      <section className="relative px-6 pb-14 md:px-12 md:pb-20 lg:px-20 xl:px-28">
        <div className="mx-auto max-w-350">
          <div
            data-section-head
            className="mb-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 md:mb-8"
          >
            <div>
              <p className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-white/45 md:text-[0.65rem]">
                Now Shipping
              </p>
              <h2 className="font-display mt-2 text-[clamp(1.25rem,2.4vw,2.2rem)] leading-none uppercase md:mt-3">
                Latest engagement
              </h2>
            </div>
            <span className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-white/45 md:text-[0.65rem]">
              {featured.season} {featured.year}
            </span>
          </div>
          <ProjectCard project={featured} featured index={0} />
        </div>
      </section>

      {/* ── ARCHIVE GRID ───────────────────────────────────────────────── */}
      <section className="relative px-6 pb-24 md:px-12 md:pb-40 lg:px-20 xl:px-28">
        <div className="mx-auto max-w-350">
          <div
            data-section-head
            className="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-12"
          >
            <div>
              <p className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-white/45 md:text-[0.65rem]">
                The Archive
              </p>
              <h2 className="font-display mt-2 text-[clamp(1.25rem,2.4vw,2.2rem)] leading-none uppercase md:mt-3">
                Earlier work
              </h2>
            </div>
            <p className="font-body max-w-md text-[0.85rem] leading-[1.6] text-white/55 md:text-sm">
              {rest.length} more engagements across commerce, brand, and
              digital infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-8">
            {rest.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i + 1} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
