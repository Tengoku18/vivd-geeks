// src/app/work/[slug]/page.tsx
// Case-study template. One page per project, data-driven by WORK_PROJECTS.
// Server component (preserves SSG + generateMetadata) — interactivity is
// limited to the Lenis smooth-scroll init, mounted via the small
// LenisInit client island so we keep prerendering for free.

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WORK_PROJECTS } from "@/config/work";
import { FOOTER_CONFIG } from "@/config/sections";
import SiteHeader from "@/components/organisms/SiteHeader/SiteHeader";
import FooterSection from "@/components/organisms/FooterSection/FooterSection";
import LenisInit from "@/components/atoms/LenisInit/LenisInit";

const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.9'/></svg>\")";

export function generateStaticParams() {
  return WORK_PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = WORK_PROJECTS.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — Vivid Geeks Work`,
    description: project.summary,
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = WORK_PROJECTS.findIndex((p) => p.slug === slug);
  if (idx < 0) notFound();
  const project = WORK_PROJECTS[idx];
  // Wrap so the "next" link cycles back to the start of the catalog when
  // the user reaches the oldest project. WORK_PROJECTS is newest-first so
  // index+1 is the next-older case study — closest to "what came before".
  const next = WORK_PROJECTS[(idx + 1) % WORK_PROJECTS.length];

  return (
    <>
      <LenisInit />
      <SiteHeader />

      <main className="bg-bg-dark text-text-on-dark relative overflow-hidden">
        {/* ── HERO ───────────────────────────────────────────────────────
            Full-bleed cover. Image wins when supplied; gradient is the
            fallback. The cream → dark scrim at the bottom hands off into
            the body section without a hard seam. */}
        <section
          className="relative flex min-h-[88vh] flex-col justify-end overflow-hidden px-6 pt-40 pb-16 md:px-12 md:pt-52 md:pb-24 lg:px-20 xl:px-28"
          style={
            project.coverImage
              ? undefined
              : { background: project.coverBackground }
          }
        >
          {project.coverImage && (
            <Image
              src={project.coverImage}
              alt={`${project.title} hero`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.18]"
            style={{ backgroundImage: GRAIN_BG }}
          />
          {/* Hand-off scrim into the dark body section. */}
          <div
            aria-hidden="true"
            className="from-bg-dark/85 absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t to-transparent"
          />

          <div className="relative mx-auto flex w-full max-w-350 flex-col gap-6">
            <Link
              href="/work"
              className="font-body inline-flex w-fit items-center gap-2 text-[0.65rem] tracking-[0.3em] uppercase text-white/75 transition-colors hover:text-white md:text-[0.7rem]"
            >
              <span aria-hidden="true">←</span> All work
            </Link>

            <div className="font-body flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.6rem] tracking-[0.3em] uppercase text-white/75 md:text-[0.65rem]">
              <span>
                {project.season} {project.year}
              </span>
              <span aria-hidden="true">·</span>
              <span>{project.client}</span>
              <span aria-hidden="true">·</span>
              <span>{project.discipline}</span>
            </div>

            <h1
              className="font-display text-[clamp(2.5rem,9vw,8rem)] leading-[0.95] tracking-tight uppercase"
              style={{
                color: project.coverTextColor,
                textWrap: "balance",
                textShadow: "0 2px 24px rgba(0,0,0,0.45)",
              }}
            >
              {project.title}
            </h1>
            <p
              className="font-body max-w-2xl text-base leading-[1.55] text-white/90 md:text-lg lg:text-xl"
              style={{
                textShadow: "0 1px 12px rgba(0,0,0,0.5)",
              }}
            >
              {project.tagline}.
            </p>
          </div>
        </section>

        {/* ── BODY ───────────────────────────────────────────────────────
            Dark surface. Aside on left holds summary + optional live link;
            right column carries the case-study prose. */}
        <section className="relative px-6 py-20 md:px-12 md:py-28 lg:px-20 xl:px-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-1/4 -right-1/4 h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,169,126,0.08),transparent_65%)] blur-3xl"
          />
          <div className="relative mx-auto max-w-350">
            <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20">
              <aside className="md:sticky md:top-32 md:self-start">
                <p className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-white/45 md:text-[0.65rem]">
                  Summary
                </p>
                <p className="font-body mt-4 text-base leading-[1.65] text-white/80">
                  {project.summary}
                </p>

                {project.externalUrl && (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-body hover:text-accent mt-8 inline-flex items-center gap-2 border-b border-white/30 pb-1 text-[0.65rem] tracking-[0.3em] uppercase text-white/85 transition-colors hover:border-accent md:text-[0.7rem]"
                  >
                    Visit live site <span aria-hidden="true">↗</span>
                  </a>
                )}
              </aside>

              <div className="space-y-6">
                {project.body.map((para, i) => (
                  <p
                    key={i}
                    className="font-body text-base leading-[1.7] text-white/85 md:text-lg md:leading-[1.75]"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── METRICS ────────────────────────────────────────────────────
            The accent gradient sells the project's brand color without
            making the whole panel that color (which read as a billboard
            in the old layout). */}
        <section className="relative overflow-hidden border-y border-white/10 px-6 py-20 md:px-12 md:py-24 lg:px-20 xl:px-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              background: `radial-gradient(circle at 20% 50%, ${project.accentColor}, transparent 55%)`,
            }}
          />
          <div className="relative mx-auto max-w-350">
            <p className="font-body mb-12 text-[0.6rem] tracking-[0.3em] uppercase text-white/45 md:text-[0.65rem]">
              Outcomes
            </p>
            <div className="grid gap-10 md:grid-cols-3">
              {project.metrics.map((m) => (
                <div key={m.label} className="border-t border-white/15 pt-6">
                  <div
                    className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-none"
                    style={{
                      color: project.accentColor,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {m.value}
                  </div>
                  <div className="font-body mt-4 text-[0.65rem] tracking-[0.3em] uppercase text-white/65 md:text-[0.7rem]">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NEXT PROJECT ──────────────────────────────────────────────
            Big tap target that previews the next case in the queue with
            its own gradient — keeps the user inside the work flow. */}
        <section className="relative px-6 py-20 md:px-12 md:py-28 lg:px-20 xl:px-28">
          <div className="mx-auto max-w-350">
            <p className="font-body mb-8 text-[0.6rem] tracking-[0.3em] uppercase text-white/45 md:text-[0.65rem]">
              Next case
            </p>
            <Link
              href={`/work/${next.slug}`}
              aria-label={`Open ${next.title} case study`}
              className="group relative block overflow-hidden border border-white/10 transition-[border-color,transform] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 hover:border-accent/40"
            >
              <div
                aria-hidden={next.coverImage ? undefined : true}
                className="absolute inset-0 transition-transform duration-900 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.04]"
                style={
                  next.coverImage
                    ? undefined
                    : { background: next.coverBackground }
                }
              >
                {next.coverImage && (
                  <Image
                    src={next.coverImage}
                    alt={`${next.title} cover`}
                    fill
                    sizes="100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div
                aria-hidden="true"
                className="from-bg-dark/95 via-bg-dark/40 absolute inset-0 bg-linear-to-t to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.18]"
                style={{ backgroundImage: GRAIN_BG }}
              />

              <div className="relative flex min-h-[40vh] flex-col justify-end p-6 md:min-h-[55vh] md:p-12 lg:p-16">
                <p className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-white/65 md:text-[0.65rem]">
                  {next.season} {next.year} · {next.client}
                </p>
                <h2
                  className="font-display mt-3 text-[clamp(2rem,6vw,5rem)] leading-[0.95] tracking-tight uppercase text-text-on-dark [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]"
                  style={{ textWrap: "balance" }}
                >
                  {next.title}
                </h2>
                <p className="font-body mt-4 max-w-xl text-sm leading-[1.55] text-white/75 md:text-base">
                  {next.tagline}.
                </p>
                <span className="font-body mt-6 inline-flex items-center gap-2 text-[0.65rem] tracking-[0.3em] uppercase text-text-on-dark transition-colors group-hover:text-accent md:text-[0.7rem]">
                  Open case study
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>

            <div className="mt-10 flex justify-center">
              <Link
                href="/work"
                className="font-body hover:text-accent inline-flex items-center gap-2 text-[0.65rem] tracking-[0.3em] uppercase text-white/55 transition-colors md:text-[0.7rem]"
              >
                <span aria-hidden="true">←</span> Back to all work
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterSection config={FOOTER_CONFIG} />
    </>
  );
}
