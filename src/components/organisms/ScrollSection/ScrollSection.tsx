// src/components/organisms/ScrollSection/ScrollSection.tsx
"use client";
import { useEffect, useRef } from "react";
import type { ContentSection } from "@/config/sections";
import { SectionHeader } from "@/components/molecules/SectionHeader/SectionHeader";
import { Typography } from "@/components/atoms/Typography";
import { cn } from "@/lib/cn";

interface Props {
  section: ContentSection;
}

// Mobile: single-column full-width with edge padding (no canvas split, no max-w cap).
// md+: original half/half layout where canvas occupies the opposite side.
const ALIGNMENT_CLASSES = {
  left: "px-6 md:pr-[55vw] md:pl-12 lg:pl-20 xl:pl-28 md:[&>div]:max-w-[42vw]",
  right:
    "px-6 md:pl-[55vw] md:pr-12 lg:pr-20 xl:pr-28 md:[&>div]:max-w-[42vw] md:[&>div]:ml-auto",
  center: "px-6 text-center md:px-12 lg:px-20",
} as const;

export default function ScrollSection({ section }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    type STInstance = { kill: () => void };
    let trigger: STInstance | undefined;
    let cleanupResize: (() => void) | undefined;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const scrollEl = document.getElementById("scroll-container");
      if (!scrollEl) return;

      // BUG FIX: scrollEl.scrollHeight read at mount may be 0 if the scroll
      // container's CSS var height hasn't been painted yet.
      // Defer position calculation until after first paint via rAF.
      const setPosition = () => {
        const totalH = scrollEl.scrollHeight;
        if (totalH === 0) {
          requestAnimationFrame(setPosition);
          return;
        }
        const mid =
          (((section.enter ?? 0) + (section.leave ?? 0)) / 2 / 100) * totalH;
        el.style.top = `${mid}px`;
      };
      requestAnimationFrame(setPosition);

      // BUG FIX: also reposition on window resize.
      const onResize = () => {
        const totalH = scrollEl.scrollHeight;
        if (totalH === 0) return;
        const mid =
          (((section.enter ?? 0) + (section.leave ?? 0)) / 2 / 100) * totalH;
        el.style.top = `${mid}px`;
      };
      window.addEventListener("resize", onResize);
      cleanupResize = () => window.removeEventListener("resize", onResize);

      const children = el.querySelectorAll<HTMLElement>(
        ".section-label, .section-heading, .section-body, .section-note",
      );

      const tl = gsap.timeline({ paused: true });
      const enter = (section.enter ?? 0) / 100;
      const leave = (section.leave ?? 0) / 100;

      switch (section.animation) {
        case "fade-up":
          tl.from(children, {
            y: 50,
            opacity: 0,
            stagger: 0.12,
            duration: 0.9,
            ease: "power3.out",
          });
          break;
        case "slide-left":
          tl.from(children, {
            x: -80,
            opacity: 0,
            stagger: 0.14,
            duration: 0.9,
            ease: "power3.out",
          });
          break;
        case "slide-right":
          tl.from(children, {
            x: 80,
            opacity: 0,
            stagger: 0.14,
            duration: 0.9,
            ease: "power3.out",
          });
          break;
        case "scale-up":
          tl.from(children, {
            scale: 0.85,
            opacity: 0,
            stagger: 0.12,
            duration: 1.0,
            ease: "power2.out",
          });
          break;
        case "rotate-in":
          tl.from(children, {
            y: 40,
            rotation: 3,
            opacity: 0,
            stagger: 0.1,
            duration: 0.9,
            ease: "power3.out",
          });
          break;
        case "stagger-up":
          tl.from(children, {
            y: 60,
            opacity: 0,
            stagger: 0.15,
            duration: 0.8,
            ease: "power3.out",
          });
          break;
        case "clip-reveal":
          tl.from(children, {
            clipPath: "inset(100% 0 0 0)",
            opacity: 0,
            stagger: 0.15,
            duration: 1.2,
            ease: "power4.inOut",
          });
          break;
      }

      trigger = ScrollTrigger.create({
        trigger: scrollEl,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          const p = self.progress;
          if (p >= enter && p <= leave) {
            // BUG FIX: tl.progress() === 0 check prevents replay after reverse().
            // Play if the timeline is paused/reversed (not actively playing).
            if ((!tl.isActive() && tl.reversed()) || tl.progress() < 0.05) {
              tl.play();
            }
          } else if (p < enter) {
            if (tl.progress() > 0) tl.reverse();
          }
        },
      });
    };

    init();

    return () => {
      // BUG FIX: kill ScrollTrigger instance and resize listener on unmount.
      trigger?.kill();
      cleanupResize?.();
    };
  }, [section]);

  const align = section.alignment ?? "left";

  return (
    <section
      ref={ref}
      className={cn(
        "pointer-events-none absolute z-[15] w-full -translate-y-1/2",
        ALIGNMENT_CLASSES[align],
      )}
    >
      <div className="pointer-events-auto">
        <SectionHeader label={section.label} heading={section.heading} />
        <Typography variant="body" className="section-body mt-4 max-w-md">
          {section.body}
        </Typography>
        {section.note && (
          <Typography variant="note" className="section-note mt-3">
            {section.note}
          </Typography>
        )}
      </div>
    </section>
  );
}
