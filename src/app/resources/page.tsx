// src/app/resources/page.tsx
//
// Resources — the Vivid Geeks editorial index. A card grid of every post
// in BLOG_POSTS, each linking through to /resources/[slug]. Mirrors the
// /services index in layout and tone so the site reads as one piece.
//
// SSG'd server component. No client islands needed.

import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { BLOG_POSTS, formatPostDate } from "@/config/resources";
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

const PAGE_TITLE = "Resources | Vivid Geeks";
const PAGE_DESCRIPTION =
  "Field notes on search, growth, and digital infrastructure from the Vivid Geeks team: AEO, attribution, conversion-first web, and the systems that turn traffic into revenue.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/resources" },
  openGraph: {
    type: "website",
    url: absoluteUrl("/resources"),
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: PAGE_TITLE,
    description: PAGE_DESCRIPTION,
  },
};

export default function ResourcesIndexPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Vivid Geeks | Resources",
    itemListElement: BLOG_POSTS.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: absoluteUrl(`/resources/${p.slug}`),
      name: p.title,
    })),
  };

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            url: "/resources",
            name: PAGE_TITLE,
            description: PAGE_DESCRIPTION,
            speakableSelectors: ["h1", "[data-speakable]"],
            breadcrumb: [
              { name: "Home", url: "/" },
              { name: "Resources", url: "/resources" },
            ],
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Resources", url: "/resources" },
          ]),
          itemListSchema,
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
              Resources
            </p>
            <h1
              data-speakable
              className="font-display text-[clamp(2.25rem,7vw,5.5rem)] leading-[0.98] tracking-tight uppercase text-text-on-dark [text-shadow:0_2px_28px_rgba(0,0,0,0.6)]"
              style={{ textWrap: "balance" }}
            >
              Field Notes On Market Dominance
            </h1>
            <p className="font-body font-medium max-w-3xl text-lg leading-[1.55] text-white/85 md:text-xl">
              No fluff, no recycled listicles. Just the strategies, hard
              lessons and uncomfortable truths we use to turn clicks into
              revenue, written by the team doing the work.
            </p>
          </div>
        </section>

        {/* ── CARD GRID ──────────────────────────────────────────────────── */}
        <section className="relative px-6 pb-24 md:px-12 md:pb-32 lg:px-20 xl:px-28">
          <div className="mx-auto grid w-full max-w-6xl gap-6 md:grid-cols-2 md:gap-8">
            {BLOG_POSTS.map((post) => (
              <Link
                key={post.slug}
                href={`/resources/${post.slug}`}
                aria-label={`Read ${post.title}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md transition-[transform,background-color,border-color] duration-400 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.05]"
              >
                {/* Cover — artwork when set, gradient as the fallback that
                    shows through underneath while the image loads. */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{ background: post.cover }}
                  />
                  {post.image && (
                    <Image
                      src={post.image}
                      alt={post.imageAlt ?? ""}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  )}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-linear-to-t from-bg-dark/95 via-bg-dark/30 to-transparent"
                  />
                  <span
                    className="font-body absolute bottom-4 left-5 text-[0.65rem] tracking-[0.3em] uppercase md:text-[0.7rem]"
                    style={{ color: post.accent }}
                  >
                    {post.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <h2 className="font-display text-[clamp(1.5rem,3vw,2.25rem)] leading-[1.05] tracking-tight uppercase text-text-on-dark transition-colors duration-300 group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p className="font-body font-medium mt-4 text-base leading-[1.6] text-white/80 md:text-[1.05rem]">
                    {post.excerpt}
                  </p>

                  <div className="flex-1" />

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <span className="font-body text-[0.7rem] tracking-[0.2em] uppercase text-white/45">
                      {formatPostDate(post.date)} · {post.readTime}
                    </span>
                    <span className="inline-flex items-center gap-2 font-body text-[0.7rem] tracking-[0.3em] uppercase text-accent transition-colors duration-300 group-hover:text-white md:text-[0.75rem]">
                      Read
                      <ChevronRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── CLOSING CTA ────────────────────────────────────────────────── */}
        <section className="relative px-6 pb-28 md:px-12 md:pb-36 lg:px-20 xl:px-28">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-start gap-8 rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md md:flex-row md:items-center md:justify-between md:p-12">
            <div className="max-w-xl">
              <p className="font-body text-[0.65rem] tracking-[0.35em] uppercase text-white/55 md:text-[0.7rem]">
                Prefer it applied to your business?
              </p>
              <h2 className="font-display mt-3 text-[clamp(1.75rem,3.6vw,2.75rem)] uppercase leading-[1.05] tracking-tight text-text-on-dark">
                Let&apos;s build the system.
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
      </main>

      <FooterSection config={FOOTER_CONFIG} />
    </>
  );
}
