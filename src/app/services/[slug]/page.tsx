// src/app/services/[slug]/page.tsx
//
// Service category detail page — one route per parent section (e.g.
// /services/search-intelligence covers SEO, AEO, and Google Ads). The
// page leads with the category headline, then stacks each detail as
// its own chapter with sub-headline, intro, body paragraphs and lists.
//
// Architecture
// ────────────
//   - Server component: SSG'd per slug via generateStaticParams.
//   - LenisInit + SiteHeader + FooterSection keep parity with /work/[slug],
//     so smooth-scroll + header behavior matches the rest of the site.
//   - No client-side state — pure content. Animations live on the homepage.

import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SERVICE_CATEGORIES } from "@/config/services";
import { FOOTER_CONFIG } from "@/config/sections";
import SiteHeader from "@/components/organisms/SiteHeader/SiteHeader";
import FooterSection from "@/components/organisms/FooterSection/FooterSection";
import LenisInit from "@/components/atoms/LenisInit/LenisInit";
import JsonLd from "@/components/atoms/JsonLd/JsonLd";
import ChevronLeft from "@/components/atoms/Icon/ChevronLeft";
import ChevronRight from "@/components/atoms/Icon/ChevronRight";
import { Button } from "@/components/atoms/Button";
import {
  absoluteUrl,
  breadcrumbSchema,
  webPageSchema,
  serviceSchema,
} from "@/lib/seo";

const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.9'/></svg>\")";

export function generateStaticParams() {
  return SERVICE_CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = SERVICE_CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return {};
  const title = `${cat.category} | Vivid Geeks`;
  const url = `/services/${cat.slug}`;
  return {
    title,
    description: cat.tagline,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url: absoluteUrl(url),
      title,
      description: cat.tagline,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: cat.tagline,
    },
  };
}

export default async function ServiceCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = SERVICE_CATEGORIES.findIndex((c) => c.slug === slug);
  if (idx < 0) notFound();
  const cat = SERVICE_CATEGORIES[idx];

  // Next category for the "Continue" CTA. We loop so the user can walk
  // the whole offering without hitting a dead end.
  const next =
    SERVICE_CATEGORIES[(idx + 1) % SERVICE_CATEGORIES.length] ?? null;
  const hasNext = next && next.slug !== cat.slug;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            url: `/services/${cat.slug}`,
            name: `${cat.category} | Vivid Geeks`,
            description: cat.tagline,
            speakableSelectors: ["[data-speakable]", "h1", "h2"],
            breadcrumb: [
              { name: "Home", url: "/" },
              { name: cat.category, url: `/services/${cat.slug}` },
            ],
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: cat.category, url: `/services/${cat.slug}` },
          ]),
          ...cat.details.map((d) =>
            serviceSchema({
              name: d.name,
              description: d.headline,
              slug: d.slug,
              category: cat.category,
            }),
          ),
        ]}
      />
      <LenisInit />
      <SiteHeader />

      <main className="bg-bg-dark text-text-on-dark relative overflow-hidden">
        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pt-36 pb-20 md:px-12 md:pt-44 md:pb-28 lg:px-20 lg:pt-52 xl:px-28">
          {/* Optional bg image — fills the hero box and stays bound to it
              (no fixed/parallax), so it scrolls away naturally. Layered:
              image → navy scrim → brand glows → grain → content. */}
          {cat.heroImage && (
            <>
              <Image
                src={cat.heroImage}
                alt={cat.heroImageAlt ?? ""}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              {/* Base darkening layer — floors the whole image so even the
                  brightest spots in the photo (e.g. white UI screenshots)
                  stay legible behind the headline. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-black/55"
              />
              {/* Navy scrim on top — adds brand tone and weights the bottom
                  edge so text reads against a deeper base while the top of
                  the image still breathes. */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(180deg, rgba(11,29,53,0.55) 0%, rgba(11,29,53,0.45) 40%, rgba(11,29,53,0.9) 100%)",
                }}
              />
            </>
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-1/3 -right-1/4 h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(184,37,42,0.20),transparent_65%)] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-1/3 -left-1/4 h-[80vmin] w-[80vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(11,29,53,0.55),transparent_65%)] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.15]"
            style={{ backgroundImage: GRAIN_BG }}
          />

          <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-7">
            <Link
              href="/services"
              className="font-body inline-flex w-fit items-center gap-2 text-[0.65rem] tracking-[0.3em] uppercase text-white/65 transition-colors hover:text-white md:text-[0.7rem]"
            >
              <ChevronLeft className="h-3 w-3" /> Back to services
            </Link>

            <p className="font-body text-[0.7rem] tracking-[0.35em] uppercase text-white/55 md:text-[0.75rem]">
              {cat.label}
            </p>

            <h1
              data-speakable
              className="font-display text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.98] tracking-tight uppercase text-text-on-dark [text-shadow:0_2px_28px_rgba(0,0,0,0.6)]"
              style={{ textWrap: "balance" }}
            >
              {cat.headline}
            </h1>

            <p className="font-body font-medium max-w-3xl text-lg leading-[1.55] text-white/85 md:text-xl">
              {cat.tagline}
            </p>

            {/* In-page jump nav — lets the user skim across the chapters
                without having to scroll the whole page. */}
            {cat.details.length > 1 && (
              <nav
                aria-label="On this page"
                className="mt-2 flex flex-wrap gap-2"
              >
                {cat.details.map((d) => (
                  <a
                    key={d.slug}
                    href={`#${d.slug}`}
                    className="rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 font-body text-[0.7rem] tracking-[0.2em] uppercase text-white/75 transition-colors hover:border-white/35 hover:text-white md:text-[0.75rem]"
                  >
                    {d.name}
                  </a>
                ))}
              </nav>
            )}
          </div>
        </section>

        {/* ── CHAPTERS (one per detail) ──────────────────────────────────── */}
        {cat.details.map((d, i) => (
          <section
            key={d.slug}
            id={d.slug}
            className="relative scroll-mt-32 px-6 pt-12 pb-20 md:px-12 md:pt-20 md:pb-28 lg:px-20 xl:px-28"
          >
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
              {/* Subtle divider between chapters so they read as distinct
                  pieces without a hard rule. */}
              {i > 0 && (
                <div
                  aria-hidden="true"
                  className="mx-auto h-px w-24 bg-linear-to-r from-transparent via-white/25 to-transparent"
                />
              )}

              <header className="flex flex-col gap-4">
                <p className="font-body text-[0.65rem] tracking-[0.35em] uppercase text-accent/85 md:text-[0.7rem]">
                  {String(i + 1).padStart(2, "0")} · {d.name}
                </p>
                <h2 className="font-display text-[clamp(1.75rem,4.5vw,3.5rem)] leading-[1.05] tracking-tight uppercase text-text-on-dark">
                  {d.headline}
                </h2>
              </header>

              <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:gap-16">
                <div className="flex flex-col gap-6">
                  <p className="font-body font-medium text-lg leading-[1.7] text-white/90 md:text-xl">
                    {d.intro}
                  </p>
                  {d.body.map((para, j) => (
                    <p
                      key={j}
                      className="font-body font-medium text-base leading-[1.75] text-white/80 md:text-lg"
                    >
                      {para}
                    </p>
                  ))}
                </div>

                <aside className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
                  {d.lists.map((block) => (
                    <div
                      key={block.title}
                      className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md"
                    >
                      <p className="font-body text-[0.65rem] tracking-[0.35em] uppercase text-accent/85">
                        {block.title}
                      </p>
                      <ul className="mt-5 flex flex-col gap-2.5">
                        {block.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 font-body font-medium text-[0.95rem] leading-[1.5] text-white/85"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[0.55em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </aside>
              </div>
            </div>
          </section>
        ))}

        {/* ── CLOSING CTA ────────────────────────────────────────────────── */}
        <section className="relative px-6 pb-28 md:px-12 md:pb-36 lg:px-20 xl:px-28">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md md:gap-12 md:p-12">
            <div className="flex flex-col gap-3">
              <p className="font-body text-[0.65rem] tracking-[0.35em] uppercase text-white/55 md:text-[0.7rem]">
                Ready when you are
              </p>
              <h2 className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] uppercase leading-[1.05] tracking-tight text-text-on-dark">
                Let&apos;s talk about your {cat.category.toLowerCase()} strategy.
              </h2>
            </div>
            {/* CTAs sit on their own row beneath the headline so the button
                never has to compete with the heading for horizontal space —
                the long button label could otherwise wrap and clip inside
                the button's overflow-hidden bounds. */}
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              {/* Primary CTA — uses the shared Button atom (border + gold
                  fill-on-hover + text-roll). overflow-hidden is baked in
                  so the animation can never leak past the button bounds. */}
              <Button href="/#contact">Start the conversation</Button>
              {/* Secondary action is a quiet text link rather than a second
                  Button — pairing two filled buttons would over-emphasize
                  the "next" path. */}
              {hasNext && (
                <Link
                  href={`/services/${next.slug}`}
                  className="font-body inline-flex items-center gap-2 whitespace-nowrap text-[0.7rem] tracking-[0.3em] uppercase text-white/70 transition-colors hover:text-white md:text-[0.75rem]"
                >
                  Next · {next.category}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <FooterSection config={FOOTER_CONFIG} />
    </>
  );
}
