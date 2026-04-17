// src/components/organisms/FAQSection/FAQSection.tsx
// Light-themed interlude between the dark Contact and Footer sections.
// The accordion uses the `grid-template-rows: 0fr → 1fr` technique so the
// browser interpolates the exact content height — no JS measurement, no
// overshoot, no jank.
"use client";
import { useEffect, useRef, useState } from "react";
import type { FaqConfig } from "@/config/sections";
import { cn } from "@/lib/cn";

interface Props {
  config: FaqConfig;
}

export default function FAQSection({ config }: Props) {
  const ref = useRef<HTMLElement>(null);
  // Allow only one open at a time — cleaner reading rhythm on a FAQ list.
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    type STInstance = { kill: () => void };
    let trigger: STInstance | undefined;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const introParts = el.querySelectorAll<HTMLElement>(".faq-intro");
      const items = el.querySelectorAll<HTMLElement>(".faq-item");

      const tl = gsap.timeline({ paused: true });
      tl.from(introParts, {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.9,
        ease: "power3.out",
      }).from(
        items,
        {
          y: 30,
          opacity: 0,
          stagger: 0.08,
          duration: 0.7,
          ease: "power3.out",
        },
        "-=0.5",
      );

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

  return (
    <section
      ref={ref}
      id="faq"
      className="relative z-[30] w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #f4f1ed 0%, #ece6dc 70%, #e4ddd0 100%)",
      }}
    >
      {/* Fine dot-grid texture over the cream bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(#1a1a1a 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      {/* Huge outlined wordmark — decorative watermark */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute select-none",
          "right-[-2vw] bottom-[-4vw]",
          "font-display leading-none uppercase",
          "text-[clamp(12rem,30vw,28rem)] tracking-[-0.02em]",
          "text-transparent",
          "[-webkit-text-stroke:1px_rgba(26,26,26,0.07)]",
        )}
        style={{ WebkitTextStroke: "1px rgba(26,26,26,0.08)" }}
      >
        FAQ
      </span>

      <div className="relative grid w-full grid-cols-1 gap-14 px-6 py-24 md:grid-cols-[0.9fr_1.1fr] md:gap-20 md:px-12 md:py-32 lg:px-20 lg:py-40 xl:px-28">
        {/* ── Intro column ─────────────────────────────────────────────── */}
        <div className="flex flex-col md:sticky md:top-28 md:self-start">
          <span
            className={cn(
              "faq-intro",
              "font-body text-[0.8rem] tracking-[0.3em] uppercase",
              "text-text-muted",
            )}
          >
            {config.label}
          </span>
          <h2
            className={cn(
              "faq-intro mt-5",
              "font-display text-text-primary uppercase",
              "leading-[0.95] tracking-[-0.01em]",
              "text-[clamp(2rem,5vw,5rem)]",
            )}
          >
            {config.heading}
          </h2>
          <p
            className={cn(
              "faq-intro mt-6 max-w-md",
              "font-body text-text-muted text-lg leading-[1.6]",
            )}
          >
            {config.body}
          </p>
          <div
            aria-hidden="true"
            className="faq-intro bg-accent/70 mt-10 h-px w-16"
          />
        </div>

        {/* ── Accordion column ─────────────────────────────────────────── */}
        <ul className="border-t border-[#1a1a1a]/12">
          {config.items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <li
                key={item.question}
                className="faq-item border-b border-[#1a1a1a]/12"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className={cn(
                    "group flex w-full items-center justify-between gap-6 py-7 text-left",
                    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent",
                  )}
                >
                  <span
                    className={cn(
                      "font-display uppercase",
                      "leading-[1.1] tracking-[0]",
                      "text-[clamp(1.1rem,1.8vw,1.75rem)]",
                      "transition-colors duration-300",
                      isOpen
                        ? "text-accent"
                        : "text-text-primary group-hover:text-accent",
                    )}
                  >
                    {item.question}
                  </span>
                  <PlusMinus open={isOpen} />
                </button>

                {/* Smooth height animation via grid-template-rows.
                    Browser interpolates the exact content height — no JS. */}
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  aria-hidden={!isOpen}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-[520ms]",
                    "ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p
                      className={cn(
                        "max-w-2xl pr-4 pb-7",
                        "font-body text-text-muted text-[1.02rem] leading-[1.7]",
                        "transition-[opacity,transform] duration-500",
                        isOpen
                          ? "translate-y-0 opacity-100"
                          : "-translate-y-1 opacity-0",
                      )}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

// ─── PlusMinus icon ───────────────────────────────────────────────────────────
// Two 1px strokes forming a plus. On open, the vertical bar rotates 90° and
// scales to 0 — leaving a clean minus. No chevron, no swap jump.
function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative flex h-5 w-5 shrink-0 items-center justify-center",
        "transition-colors duration-300",
        open ? "text-accent" : "text-text-primary",
      )}
    >
      <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current" />
      <span
        className={cn(
          "absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-current",
          "transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "rotate-90 scale-0" : "rotate-0 scale-100",
        )}
      />
    </span>
  );
}
