// src/app/resources/[slug]/page.tsx
//
// Blog article detail — one route per post in BLOG_POSTS. Leads with a
// gradient hero (no image assets needed), then renders the body as a
// stack of sections with an optional sticky "key takeaways" aside, and
// closes with a CTA + a link to the next article.
//
// Architecture mirrors /services/[slug] and /work/[slug]: SSG'd server
// component, LenisInit + SiteHeader + FooterSection for parity, no
// client-side state.

import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BLOG_POSTS, formatPostDate } from "@/config/resources";
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
  articleSchema,
} from "@/lib/seo";

const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.9'/></svg>\")";

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  const title = `${post.title} — Vivid Geeks`;
  const url = `/resources/${post.slug}`;
  return {
    title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url: absoluteUrl(url),
      title,
      description: post.excerpt,
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.excerpt,
    },
  };
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const idx = BLOG_POSTS.findIndex((p) => p.slug === slug);
  if (idx < 0) notFound();
  const post = BLOG_POSTS[idx];

  // Next article for the "Keep reading" CTA. Loop so the reader can walk
  // the whole archive without hitting a dead end.
  const next = BLOG_POSTS[(idx + 1) % BLOG_POSTS.length] ?? null;
  const hasNext = next && next.slug !== post.slug;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            url: `/resources/${post.slug}`,
            name: `${post.title} — Vivid Geeks`,
            description: post.excerpt,
            speakableSelectors: ["[data-speakable]", "h1", "h2"],
            datePublished: post.date,
            breadcrumb: [
              { name: "Home", url: "/" },
              { name: "Resources", url: "/resources" },
              { name: post.title, url: `/resources/${post.slug}` },
            ],
          }),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Resources", url: "/resources" },
            { name: post.title, url: `/resources/${post.slug}` },
          ]),
          articleSchema({
            headline: post.title,
            description: post.excerpt,
            url: `/resources/${post.slug}`,
            datePublished: post.date,
            author: post.author,
            about: post.category,
            articleBody: post.body
              .flatMap((s) => s.paragraphs)
              .join("\n\n"),
          }),
        ]}
      />
      <LenisInit />
      <SiteHeader />

      <main className="bg-bg-dark text-text-on-dark relative overflow-hidden">
        {/* ── HERO ───────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-6 pt-36 pb-16 md:px-12 md:pt-44 md:pb-20 lg:px-20 lg:pt-52 xl:px-28">
          {/* Cover bound to the hero box — scrolls away naturally. Layered:
              gradient fallback → artwork → dark scrim → grain → content. */}
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
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          )}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(13,13,13,0.55) 0%, rgba(13,13,13,0.6) 40%, rgba(13,13,13,0.94) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.15]"
            style={{ backgroundImage: GRAIN_BG }}
          />

          <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-7">
            <Link
              href="/resources"
              className="font-body inline-flex w-fit items-center gap-2 text-[0.65rem] tracking-[0.3em] uppercase text-white/65 transition-colors hover:text-white md:text-[0.7rem]"
            >
              <ChevronLeft className="h-3 w-3" /> Back to resources
            </Link>

            <p
              className="font-body text-[0.7rem] tracking-[0.35em] uppercase md:text-[0.75rem]"
              style={{ color: post.accent }}
            >
              {post.category}
            </p>

            <h1
              data-speakable
              className="font-display text-[clamp(2.25rem,6.5vw,5rem)] leading-[1.0] tracking-tight uppercase text-text-on-dark [text-shadow:0_2px_28px_rgba(0,0,0,0.6)]"
              style={{ textWrap: "balance" }}
            >
              {post.title}
            </h1>

            <p className="font-body font-medium max-w-2xl text-lg leading-[1.55] text-white/85 md:text-xl">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-body text-[0.7rem] tracking-[0.2em] uppercase text-white/55 md:text-[0.75rem]">
              <span>{post.author}</span>
              <span aria-hidden="true" className="text-white/25">
                /
              </span>
              <time dateTime={post.date}>{formatPostDate(post.date)}</time>
              <span aria-hidden="true" className="text-white/25">
                /
              </span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </section>

        {/* ── BODY ───────────────────────────────────────────────────────── */}
        <section className="relative px-6 pt-12 pb-20 md:px-12 md:pt-16 md:pb-28 lg:px-20 lg:pt-20 xl:px-28">
          <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] lg:gap-16">
            <article className="flex flex-col gap-12">
              {post.body.map((section, i) => (
                <div key={i} className="flex flex-col gap-6">
                  {section.heading && (
                    <h2 className="font-display text-[clamp(1.5rem,3.4vw,2.5rem)] leading-[1.1] tracking-tight uppercase text-text-on-dark">
                      {section.heading}
                    </h2>
                  )}
                  {section.paragraphs.map((para, j) => (
                    <p
                      key={j}
                      className="font-body font-medium text-base leading-[1.8] text-white/85 md:text-lg"
                    >
                      {para}
                    </p>
                  ))}
                  {section.list && (
                    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md md:p-7">
                      <p className="font-body text-[0.65rem] tracking-[0.35em] uppercase text-accent/85">
                        {section.list.title}
                      </p>
                      <ul className="mt-5 flex flex-col gap-2.5">
                        {section.list.items.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-3 font-body font-medium text-[0.95rem] leading-[1.55] text-white/85 md:text-base"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[0.6em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </article>

            {/* Key takeaways — sticky companion on desktop, inline on mobile. */}
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md md:p-7">
                <p className="font-body text-[0.65rem] tracking-[0.35em] uppercase text-accent/85">
                  Key takeaways
                </p>
                <ul className="mt-5 flex flex-col gap-4">
                  {post.takeaways.map((t, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 font-body font-medium text-[0.92rem] leading-[1.5] text-white/85"
                    >
                      <span className="font-display mt-[0.05em] shrink-0 text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        {/* ── CLOSING CTA ────────────────────────────────────────────────── */}
        <section className="relative px-6 pb-28 md:px-12 md:pb-36 lg:px-20 xl:px-28">
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 rounded-3xl border border-white/10 bg-white/[0.04] p-8 backdrop-blur-md md:gap-12 md:p-12">
            <div className="flex flex-col gap-3">
              <p className="font-body text-[0.65rem] tracking-[0.35em] uppercase text-white/55 md:text-[0.7rem]">
                Ready when you are
              </p>
              <h2 className="font-display text-[clamp(1.75rem,3.6vw,2.75rem)] uppercase leading-[1.05] tracking-tight text-text-on-dark">
                Want this working for your brand?
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-6 md:gap-8">
              <Button href="/#contact">Start the conversation</Button>
              {hasNext && (
                <Link
                  href={`/resources/${next.slug}`}
                  className="font-body inline-flex items-center gap-2 whitespace-nowrap text-[0.7rem] tracking-[0.3em] uppercase text-white/70 transition-colors hover:text-white md:text-[0.75rem]"
                >
                  Next · {next.title}
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
