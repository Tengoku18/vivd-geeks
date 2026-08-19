// src/app/services/page.tsx
//
// Services overview — card grid listing every content section from
// SECTIONS_CONFIG. Cards whose `id` matches an entry in
// SERVICE_CATEGORIES link through to /services/[slug]; the rest stay
// as static info tiles so the page reflects the full scope of
// offerings even before every detail page is written.
//
// SSG'd server component. No client islands needed.

import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { SECTIONS_CONFIG } from "@/config/sections";
import {
  SERVICE_CATEGORIES,
  getServiceCategoryBySlug,
} from "@/config/services";
import { FOOTER_CONFIG } from "@/config/sections";
import SiteHeader from "@/components/organisms/SiteHeader/SiteHeader";
import FooterSection from "@/components/organisms/FooterSection/FooterSection";
import LenisInit from "@/components/atoms/LenisInit/LenisInit";
import JsonLd from "@/components/atoms/JsonLd/JsonLd";
import ChevronRight from "@/components/atoms/Icon/ChevronRight";
import {
  absoluteUrl,
  breadcrumbSchema,
  webPageSchema,
} from "@/lib/seo";
import { cn } from "@/lib/cn";

const PAGE_TITLE = "Services | Vivid Geeks";
const PAGE_DESCRIPTION =
  "Growth-driven digital marketing and creative solutions: data-driven marketing plans, powerful creative assets and high-converting digital systems built to generate measurable business growth.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/services"),
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

// Every content section becomes a card. The order matches the order
// users encounter them in the scroll experience on /.
const CARDS = SECTIONS_CONFIG.filter((s) => s.type === "content");

export default function ServicesIndexPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            url: "/services",
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            speakableSelectors: ["h1", "[data-speakable]"],
            breadcrumb: [
              { name: "Home", url: "/" },
              { name: "Services", url: "/services" },
            ],
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Services", url: "/services" },
          ]),
        ]}
      />
      <LenisInit />
      <SiteHeader />

      <main className="bg-bg-dark text-text-on-dark relative overflow-hidden">
        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pt-36 pb-16 md:px-12 md:pt-44 md:pb-20 lg:px-20 lg:pt-52 xl:px-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-1/3 -right-1/4 h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(184,37,42,0.20),transparent_65%)] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-1/3 -left-1/4 h-[80vmin] w-[80vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(11,29,53,0.55),transparent_65%)] blur-3xl"
          />

          <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6">
            <p className="font-body text-[0.7rem] tracking-[0.35em] uppercase text-white/55 md:text-[0.75rem]">
              Services
            </p>
            <h1
              data-speakable
              className="font-display text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.98] tracking-tight uppercase text-text-on-dark [text-shadow:0_2px_28px_rgba(0,0,0,0.6)]"
              style={{ textWrap: "balance" }}
            >
              Growth-Driven Digital Marketing &amp; Creative Solutions
            </h1>
            <p className="font-body font-medium max-w-3xl text-lg leading-[1.55] text-white/85 md:text-xl">
              We at Vivid Geeks design data-driven marketing plans, powerful
              creative assets and high-converting digital systems to help
              ambitious brands dominate online. Our strategies are built to
              generate measurable business growth, from search visibility and
              paid advertising to branding, automation, and customer retention.
            </p>
          </div>
        </section>

        {/* ── CARD GRID ──────────────────────────────────────────────────── */}
        <section className="relative px-6 pb-24 md:px-12 md:pb-32 lg:px-20 xl:px-28">
          <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-2 md:gap-8">
            {CARDS.map((section) => {
              if (section.type !== "content") return null;
              const detail = getServiceCategoryBySlug(section.id);
              const hasPage = !!detail;
              // Card visual is identical whether linked or not — the
              // difference is the affordance at the bottom ("Explore" vs
              // "Coming soon") and the hover state.
              const cardClass = cn(
                "group relative flex h-full flex-col overflow-hidden rounded-2xl",
                "border border-white/10 bg-white/[0.03] backdrop-blur-md",
                "p-6 md:p-8",
                "transition-[transform,background-color,border-color] duration-400",
                hasPage &&
                  "hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05]",
              );
              const content = (
                <>
                  {/* Optional cover — uses the same heroImage as the
                      detail page so the index feels visually connected. */}
                  {detail?.heroImage && (
                    <div className="relative -mx-6 -mt-6 mb-6 aspect-[16/9] overflow-hidden md:-mx-8 md:-mt-8 md:mb-7">
                      <Image
                        src={detail.heroImage}
                        alt={detail.heroImageAlt ?? ""}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-linear-to-t from-bg-dark/95 via-bg-dark/40 to-transparent"
                      />
                    </div>
                  )}

                  <p className="font-body text-[0.65rem] tracking-[0.35em] uppercase text-accent/85 md:text-[0.7rem]">
                    {section.label}
                  </p>
                  <h2 className="font-display mt-3 text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.05] tracking-tight uppercase text-text-on-dark">
                    {section.heading}
                  </h2>
                  <p className="font-body font-medium mt-4 text-base leading-[1.6] text-white/80 md:text-[1.05rem]">
                    {section.body}
                  </p>

                  {section.details && section.details.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {section.details.map((d) => (
                        <li
                          key={d.name}
                          className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 font-body text-[0.65rem] tracking-[0.2em] uppercase text-white/75 md:text-[0.7rem]"
                        >
                          {d.name}
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Spacer keeps the affordance pinned to the bottom of
                      the card regardless of body length, so the grid
                      reads as a rhythm of equal-weight tiles. */}
                  <div className="flex-1" />

                  <div className="mt-6 inline-flex items-center gap-2 font-body text-[0.7rem] tracking-[0.3em] uppercase md:text-[0.75rem]">
                    {hasPage ? (
                      <>
                        <span className="text-accent transition-colors duration-300 group-hover:text-white">
                          Explore
                        </span>
                        <span
                          aria-hidden="true"
                          className="inline-flex items-center text-accent transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-white"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </>
                    ) : (
                      <span className="text-white/40">
                        Detail coming soon
                      </span>
                    )}
                  </div>
                </>
              );

              return hasPage ? (
                <Link
                  key={section.id}
                  href={`/services/${section.id}`}
                  className={cardClass}
                  aria-label={`Explore ${section.heading}`}
                >
                  {content}
                </Link>
              ) : (
                <div key={section.id} className={cardClass}>
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        {/* ── CLOSING CTA ────────────────────────────────────────────────── */}
        {SERVICE_CATEGORIES.length > 0 && (
          <section className="relative px-6 pb-28 md:px-12 md:pb-36 lg:px-20 xl:px-28">
            <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md md:flex-row md:items-center md:justify-between md:p-12">
              <div className="max-w-xl">
                <p className="font-body text-[0.65rem] tracking-[0.35em] uppercase text-white/55 md:text-[0.7rem]">
                  Not sure where to start?
                </p>
                <h2 className="font-display mt-3 text-[clamp(1.75rem,3.6vw,2.75rem)] uppercase leading-[1.05] tracking-tight text-text-on-dark">
                  Let&apos;s map your engine.
                </h2>
              </div>
              <Link
                href="/#contact"
                className="font-body inline-flex items-center gap-3 self-start overflow-hidden border border-white/15 bg-transparent px-7 py-4 text-[0.75rem] tracking-[0.25em] uppercase text-text-on-dark transition-[border-color,color] duration-300 hover:border-accent hover:text-accent md:text-[0.8rem]"
              >
                Start the conversation
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </section>
        )}
      </main>

      <FooterSection config={FOOTER_CONFIG} />
    </>
  );
}
