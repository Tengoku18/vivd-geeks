// src/app/work/[slug]/page.tsx
//
// Case-study template — premium scrollytelling layout.
//
// Story arc (each section is a "chapter")
// ────────────────────────────────────────
//   1. HERO          — full-bleed cover, brand cohesion via navy scrim
//   2. HOOK          — single oversized hero metric (the "headline result")
//   3. CHAPTER 01    — The Brief    (body[0])
//   4. CHAPTER 02    — The Work     (body[1])
//   5. PULL QUOTE    — summary set as an editorial pull
//   6. CHAPTER 03    — The Result   (body[2])
//   7. METRICS WALL  — every metric as an animated counter (brand maroon)
//   8. NEXT PROJECT  — bridge to the next case
//
// Why server-rendered + thin client islands?
//   The page is data-driven (WORK_PROJECTS). Server rendering preserves
//   per-slug SSG and metadata. Animation lives in two tiny client islands
//   so we keep prerendering for every slug.
//
// Cohesion vs identity
//   Each project keeps its own gradient + accentColor on the hero so the
//   archive still feels varied. Structural elements (chapter numerals,
//   pull-quote marks, animated metric numbers) all use brand maroon, which
//   is what ties the whole archive together.

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { WORK_PROJECTS } from "@/config/work";
import { FOOTER_CONFIG } from "@/config/sections";
import SiteHeader from "@/components/organisms/SiteHeader/SiteHeader";
import FooterSection from "@/components/organisms/FooterSection/FooterSection";
import LenisInit from "@/components/atoms/LenisInit/LenisInit";
import AnimatedMetric from "@/components/atoms/AnimatedMetric";
import CaseStudyChoreography from "@/components/organisms/CaseStudyChoreography";

const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.9'/></svg>\")";

// Three chapter slugs map directly to body[0..2].
const CHAPTERS = [
  { num: "01", title: "The Brief" },
  { num: "02", title: "The Work" },
  { num: "03", title: "The Result" },
] as const;

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
  const next = WORK_PROJECTS[(idx + 1) % WORK_PROJECTS.length];
  // The headline metric — first one in the list. Used for the HOOK section.
  const hook = project.metrics[0];

  return (
    <>
      <LenisInit />
      <CaseStudyChoreography />
      <SiteHeader />

      <main className="bg-bg-dark text-text-on-dark relative overflow-hidden">
        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <section
          className="relative flex min-h-[92vh] flex-col justify-end overflow-hidden px-6 pt-40 pb-20 md:px-12 md:pt-52 md:pb-28 lg:px-20 xl:px-28"
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
          {/* Grain — keeps the gradient/photo from reading "flat CSS". */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.22]"
            style={{ backgroundImage: GRAIN_BG }}
          />
          {/* Brand-cohesion scrim — navy wash unifies all hero gradients
              against the page bg. Subtle (12% over the cover) so per-project
              colour still reads. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(180deg, rgba(11,29,53,0.18) 0%, transparent 35%, rgba(11,29,53,0.55) 100%)" }}
          />

          <div className="relative mx-auto flex w-full max-w-350 flex-col gap-7">
            <Link
              href="/work"
              className="font-body inline-flex w-fit items-center gap-2 text-[0.65rem] tracking-[0.3em] uppercase text-white/75 transition-colors hover:text-white md:text-[0.7rem]"
            >
              <span aria-hidden="true">←</span> All work
            </Link>

            <div className="font-body flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.6rem] tracking-[0.3em] uppercase text-white/75 md:text-[0.65rem]">
              <span>{project.season} {project.year}</span>
              <span aria-hidden="true">·</span>
              <span>{project.client}</span>
              <span aria-hidden="true">·</span>
              <span>{project.discipline}</span>
            </div>

            <h1
              className="font-display text-[clamp(2.5rem,9vw,8.5rem)] leading-[0.92] tracking-tight uppercase"
              style={{
                color: project.coverTextColor,
                textWrap: "balance",
                textShadow: "0 2px 28px rgba(0,0,0,0.5)",
              }}
            >
              {project.title}
            </h1>

            <p
              className="font-body max-w-2xl text-base leading-[1.55] text-white/95 md:text-lg lg:text-xl"
              style={{ textShadow: "0 1px 12px rgba(0,0,0,0.55)" }}
            >
              {project.tagline}.
            </p>

            <div
              className="mt-2 flex items-center gap-3 text-[0.55rem] tracking-[0.4em] uppercase text-white/55 md:text-[0.6rem]"
              aria-hidden="true"
            >
              <span className="h-px w-10 bg-white/40" />
              Scroll
            </div>
          </div>
        </section>

        {/* ── HOOK ────────────────────────────────────────────────────────
            One oversized metric. This is the "headline result" — what we
            want the visitor to remember after they leave. The maroon-bright
            colour overrides any per-project accent here so every case
            study screams its result with the same brand voice. */}
        <section className="relative overflow-hidden border-y border-white/10 px-6 py-24 md:px-12 md:py-36 lg:px-20 xl:px-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(184,37,42,0.28), transparent 60%)",
            }}
          />
          <div
            data-cs-reveal="rise"
            className="relative mx-auto flex max-w-350 flex-col items-center text-center"
          >
            <p className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-white/45 md:text-[0.65rem]">
              In one number
            </p>
            <span style={{ color: "var(--color-maroon-bright)" }}>
              <AnimatedMetric
                value={hook.value}
                duration={2.0}
                className="font-display mt-6 block text-[clamp(5rem,18vw,17rem)] leading-[0.85] tracking-tight"
              />
            </span>
            <p className="font-body mt-6 max-w-xl text-sm leading-[1.6] tracking-[0.05em] text-white/65 md:text-base">
              <span className="uppercase tracking-[0.25em] text-white/85">{hook.label}</span>
              <span className="mx-3 text-white/30" aria-hidden="true">·</span>
              {project.summary}
            </p>
          </div>
        </section>

        {/* ── STORY (3 chapters with a sticky chapter rail) ───────────────
            Two-column on desktop: a sticky aside on the left holds the
            project meta + summary; the right column carries the chapter
            content. Each chapter has a number, title, and one body
            paragraph from the data. */}
        <section className="relative px-6 py-24 md:px-12 md:py-32 lg:px-20 xl:px-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-1/4 -right-1/4 h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(11,29,53,0.45),transparent_65%)] blur-3xl"
          />
          <div className="relative mx-auto max-w-350">
            <div className="grid gap-14 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-20">
              {/* Sticky meta rail */}
              <aside className="md:sticky md:top-32 md:self-start">
                <div
                  className="border-l-2 pl-5"
                  style={{ borderColor: "var(--color-maroon-bright)" }}
                >
                  <p className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-white/45 md:text-[0.65rem]">
                    The Project
                  </p>
                  <p className="font-body mt-4 text-base leading-[1.65] text-white/80">
                    {project.summary}
                  </p>
                </div>

                <dl className="mt-10 space-y-5 text-[0.7rem] md:text-[0.75rem]">
                  <div>
                    <dt className="font-body text-[0.55rem] tracking-[0.3em] uppercase text-white/40">Client</dt>
                    <dd className="font-body mt-1 text-white/85">{project.client}</dd>
                  </div>
                  <div>
                    <dt className="font-body text-[0.55rem] tracking-[0.3em] uppercase text-white/40">Discipline</dt>
                    <dd className="font-body mt-1 text-white/85">{project.discipline}</dd>
                  </div>
                  <div>
                    <dt className="font-body text-[0.55rem] tracking-[0.3em] uppercase text-white/40">Engagement</dt>
                    <dd className="font-body mt-1 text-white/85">{project.season} {project.year}</dd>
                  </div>
                </dl>

                {project.externalUrl && (
                  <a
                    href={project.externalUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-body mt-10 inline-flex items-center gap-2 border-b pb-1 text-[0.65rem] tracking-[0.3em] uppercase transition-colors md:text-[0.7rem]"
                    style={{ color: "var(--color-slate)", borderColor: "rgba(244,247,250,0.4)" }}
                  >
                    Visit live site <span aria-hidden="true">↗</span>
                  </a>
                )}
              </aside>

              {/* Chapters */}
              <div className="space-y-24 md:space-y-28">
                {CHAPTERS.map((ch, i) => {
                  const para = project.body[i];
                  if (!para) return null;
                  return (
                    <article key={ch.num} className="relative">
                      <header data-cs-reveal="rise" className="mb-7 flex items-baseline gap-5 md:mb-9">
                        <span
                          className="font-display text-3xl leading-none tracking-tight md:text-4xl"
                          style={{ color: "var(--color-maroon-bright)" }}
                        >
                          {ch.num}
                        </span>
                        <span className="h-px flex-1 bg-white/15" aria-hidden="true" />
                        <h2 className="font-display text-[clamp(1.25rem,2.4vw,2rem)] uppercase leading-none tracking-tight">
                          {ch.title}
                        </h2>
                      </header>
                      <p
                        data-cs-reveal="rise"
                        className={`font-body text-lg leading-[1.7] text-white/88 md:text-xl md:leading-[1.7] ${i === 0 ? "cs-dropcap" : ""}`}
                      >
                        {para}
                      </p>

                      {/* Pull quote sits between chapter 2 and chapter 3 */}
                      {i === 1 && (
                        <blockquote
                          data-cs-reveal="quote"
                          className="relative mx-auto mt-20 max-w-3xl text-center md:mt-24"
                        >
                          <span
                            aria-hidden="true"
                            className="font-display absolute -top-12 left-1/2 -translate-x-1/2 text-[7rem] leading-none md:-top-14 md:text-[10rem]"
                            style={{ color: "var(--color-maroon-bright)", opacity: 0.4 }}
                          >
                            &ldquo;
                          </span>
                          <p
                            className="font-display relative text-[clamp(1.4rem,3vw,2.4rem)] leading-[1.25] tracking-tight"
                            style={{ color: "var(--color-slate)", textWrap: "balance" }}
                          >
                            {project.tagline}.
                          </p>
                          <footer className="font-body mt-6 text-[0.6rem] tracking-[0.35em] uppercase text-white/45 md:text-[0.65rem]">
                            — {project.client}
                          </footer>
                        </blockquote>
                      )}
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ── METRICS WALL ────────────────────────────────────────────────
            Every metric, blown up. Numbers count up on scroll using the
            brand maroon. Each cell has a hairline rule so the wall reads
            as a measured ledger, not a billboard. */}
        <section
          className="relative overflow-hidden border-y border-white/10 px-6 py-24 md:px-12 md:py-32 lg:px-20 xl:px-28"
          style={{ background: "linear-gradient(180deg, rgba(11,29,53,0.45) 0%, rgba(11,29,53,0.15) 100%)" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-25"
            style={{
              background: `radial-gradient(circle at 80% 30%, ${project.accentColor}, transparent 60%)`,
            }}
          />
          <div className="relative mx-auto max-w-350">
            <div data-cs-reveal="rise" className="mb-14 flex flex-wrap items-end justify-between gap-x-6 gap-y-3 md:mb-16">
              <div>
                <p className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-white/45 md:text-[0.65rem]">
                  Outcomes
                </p>
                <h2 className="font-display mt-3 text-[clamp(1.75rem,3.6vw,3.2rem)] uppercase leading-[0.95] tracking-tight">
                  Measured, not promised.
                </h2>
              </div>
              <p
                className="font-body max-w-sm text-[0.85rem] leading-[1.6] text-white/55 md:text-sm"
              >
                Numbers from the engagement ledger — not a pitch deck.
              </p>
            </div>

            <div data-cs-stagger className="grid gap-px overflow-hidden bg-white/10 md:grid-cols-3">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="bg-bg-dark relative px-6 py-12 md:px-10 md:py-16"
                >
                  <span style={{ color: "var(--color-maroon-bright)" }}>
                    <AnimatedMetric
                      value={m.value}
                      duration={1.8}
                      className="font-display block text-[clamp(2.75rem,5.5vw,5.5rem)] leading-none tracking-tight"
                    />
                  </span>
                  <div
                    className="mt-2 h-px w-12"
                    style={{ background: "var(--color-maroon-bright)" }}
                    aria-hidden="true"
                  />
                  <div className="font-body mt-5 text-[0.7rem] tracking-[0.3em] uppercase text-white/65 md:text-[0.75rem]">
                    {m.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── NEXT PROJECT ───────────────────────────────────────────────── */}
        <section className="relative px-6 py-24 md:px-12 md:py-32 lg:px-20 xl:px-28">
          <div className="mx-auto max-w-350">
            <div data-cs-reveal="rise" className="mb-10 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
              <div>
                <p className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-white/45 md:text-[0.65rem]">
                  Next case
                </p>
                <h2 className="font-display mt-3 text-[clamp(1.5rem,2.8vw,2.6rem)] uppercase leading-none tracking-tight">
                  Keep reading
                </h2>
              </div>
              <span className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-white/45 md:text-[0.65rem]">
                {next.season} {next.year} · {next.client}
              </span>
            </div>

            <Link
              href={`/work/${next.slug}`}
              aria-label={`Open ${next.title} case study`}
              className="group relative block overflow-hidden border border-white/10 transition-[border-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(184,37,42,0.35)]"
              style={{ borderColor: "rgba(255,255,255,0.10)" }}
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
              {/* Bottom-up scrim + grain — same idiom as the hero so the
                  card belongs to the page rather than feeling pasted on. */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-linear-to-t from-bg-dark/95 via-bg-dark/40 to-transparent"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.18]"
                style={{ backgroundImage: GRAIN_BG }}
              />

              <div className="relative flex min-h-[42vh] flex-col justify-end p-6 md:min-h-[55vh] md:p-12 lg:p-16">
                <p className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-white/65 md:text-[0.65rem]">
                  {next.discipline}
                </p>
                <h3
                  className="font-display mt-3 text-[clamp(2rem,6vw,5rem)] leading-[0.95] tracking-tight uppercase text-text-on-dark [text-shadow:0_2px_18px_rgba(0,0,0,0.55)]"
                  style={{ textWrap: "balance" }}
                >
                  {next.title}
                </h3>
                <p className="font-body mt-4 max-w-xl text-sm leading-[1.55] text-white/75 md:text-base">
                  {next.tagline}.
                </p>
                <span className="font-body mt-7 inline-flex items-center gap-3 text-[0.65rem] tracking-[0.3em] uppercase text-text-on-dark md:text-[0.7rem]">
                  <span
                    className="inline-block h-px w-10 transition-all duration-500"
                    style={{ background: "var(--color-maroon-bright)" }}
                    aria-hidden="true"
                  />
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

            <div className="mt-12 flex justify-center">
              <Link
                href="/work"
                className="font-body inline-flex items-center gap-2 text-[0.65rem] tracking-[0.3em] uppercase text-white/55 transition-colors hover:text-white md:text-[0.7rem]"
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
