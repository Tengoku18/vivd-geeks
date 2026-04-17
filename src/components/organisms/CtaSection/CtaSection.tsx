// src/components/organisms/CtaSection/CtaSection.tsx
"use client";
import { useEffect, useRef } from "react";
import type { CtaSectionData } from "@/config/sections";
import { SectionHeader } from "@/components/molecules/SectionHeader/SectionHeader";
import { Typography } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";

interface Props {
  section: CtaSectionData;
}

export default function CtaSection({ section }: Props) {
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

      const scrollEl = document.getElementById("scroll-container");
      if (!scrollEl) return;

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

      const children = el.querySelectorAll<HTMLElement>(
        ".section-label, .section-heading, .section-body, .cta-button",
      );
      const tl = gsap.timeline({ paused: true });
      tl.from(children, {
        y: 50,
        opacity: 0,
        stagger: 0.14,
        duration: 1.0,
        ease: "power3.out",
      });

      let hasPlayed = false;
      trigger = ScrollTrigger.create({
        trigger: scrollEl,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          // CTA persists — play once, never reverse
          if (self.progress >= (section.enter ?? 0) / 100 && !hasPlayed) {
            hasPlayed = true;
            tl.play();
          }
        },
      });
    };

    init();
    return () => {
      trigger?.kill();
    };
  }, [section]);

  return (
    <section
      ref={ref}
      className="absolute z-[15] w-full -translate-y-1/2 px-6 md:pr-[55vw] md:pl-12 lg:pl-20 xl:pl-28"
    >
      <div className="flex w-full flex-col gap-2 md:max-w-[42vw]">
        <SectionHeader label={section.label} heading={section.heading} />
        <Typography variant="body" className="section-body mt-4 max-w-md">
          {section.body}
        </Typography>
        <div className="cta-button mt-8">
          <Button href={section.buttonHref}>{section.buttonText}</Button>
        </div>
      </div>
    </section>
  );
}
