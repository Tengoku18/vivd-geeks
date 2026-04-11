// src/components/organisms/StatsSection/StatsSection.tsx
"use client";
import { useEffect, useRef } from "react";
import type { StatsSectionData } from "@/config/sections";
import { StatBlock } from "@/components/molecules/StatBlock/StatBlock";

interface Props {
  section: StatsSectionData;
}

export default function StatsSection({ section }: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    type STInstance = { kill: () => void };
    let trigger: STInstance | undefined;
    const gsapInstances: STInstance[] = [];

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

      const enter = (section.enter ?? 0) / 100;
      let hasPlayed = false;

      // BUG FIX: the previous version had a nested ScrollTrigger inside gsap.from,
      // causing gsap.to() to fire on every scroll tick after the threshold —
      // meaning the counter reset and re-animated continuously.
      //
      // Correct pattern: one ScrollTrigger watches progress. When enter threshold
      // is crossed for the first time, animate all counters once and never again.
      trigger = ScrollTrigger.create({
        trigger: scrollEl,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          if (self.progress >= enter && !hasPlayed) {
            hasPlayed = true;

            el.querySelectorAll<HTMLElement>(".stat-number").forEach((num) => {
              const target = parseFloat(num.dataset.value ?? "0");
              const decimals = parseInt(num.dataset.decimals ?? "0", 10);

              const obj = { val: 0 };
              const anim = gsap.to(obj, {
                val: target,
                duration: 2.2,
                ease: "power1.out",
                onUpdate: () => {
                  num.textContent =
                    decimals === 0
                      ? String(Math.round(obj.val))
                      : obj.val.toFixed(decimals);
                },
              });
              gsapInstances.push(anim);
            });
          }
        },
      });
    };

    init();

    return () => {
      trigger?.kill();
      gsapInstances.forEach((a) => a.kill());
    };
  }, [section]);

  return (
    <section
      ref={ref}
      className="absolute z-[15] w-full -translate-y-1/2 text-center"
    >
      <div className="mx-auto grid max-w-400 grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-x-8 gap-y-12 px-8 max-md:grid-cols-2 max-md:gap-x-4 max-md:gap-y-8 max-md:px-6 md:px-12 lg:px-20 xl:px-28">
        {section.stats.map((s, i) => (
          <StatBlock key={i} stat={s} />
        ))}
      </div>
    </section>
  );
}
