// src/components/organisms/DarkOverlay/DarkOverlay.tsx
"use client";
import { useEffect, useRef } from "react";

interface Props {
  enter: number;
  leave: number;
}

export default function DarkOverlay({ enter, leave }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    type STInstance = { kill: () => void };
    let trigger: STInstance | undefined;

    const init = async () => {
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const { gsap } = await import("gsap");
      gsap.registerPlugin(ScrollTrigger);

      const scrollEl = document.getElementById("scroll-container");
      if (!scrollEl) return;

      const eP = enter / 100;
      const lP = leave / 100;
      const fade = 0.04;

      trigger = ScrollTrigger.create({
        trigger: scrollEl,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          let opacity = 0;
          if (p >= eP - fade && p <= eP) {
            opacity = (p - (eP - fade)) / fade;
          } else if (p > eP && p < lP) {
            opacity = 0.9;
          } else if (p >= lP && p <= lP + fade) {
            opacity = 0.9 * (1 - (p - lP) / fade);
          }
          el.style.opacity = String(Math.max(0, Math.min(0.92, opacity)));
        },
      });
    };

    init();
    return () => {
      trigger?.kill();
    };
  }, [enter, leave]);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[8] bg-black opacity-0"
      aria-hidden="true"
    />
  );
}
