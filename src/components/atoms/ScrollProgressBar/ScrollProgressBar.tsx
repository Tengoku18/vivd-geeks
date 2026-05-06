// src/components/atoms/ScrollProgressBar/ScrollProgressBar.tsx
// Thin accent-coloured line fixed to the top of the viewport.
// Fills left-to-right as the user scrolls through the full page.
// GSAP ScrollTrigger without a trigger defaults to the document root.
"use client";
import { useEffect, useRef } from "react";

export default function ScrollProgressBar() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      ScrollTrigger.create({
        start: "top top",
        end: "max",
        scrub: true,
        onUpdate: (self) => {
          el.style.transform = `scaleX(${self.progress})`;
        },
      });
    };

    init();
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed top-0 left-0 z-[101] h-[2px] w-full origin-left will-change-transform motion-reduce:hidden"
      style={{ background: "var(--color-accent)", transform: "scaleX(0)" }}
      aria-hidden="true"
    />
  );
}
