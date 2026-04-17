// src/components/organisms/GlassOverlay/GlassOverlay.tsx
// Full-viewport frosted-glass scrim that fades in once the hero clears and
// stays active across every content/CTA section. The CanvasScene keeps
// running underneath; the blur + tint gives every section's copy a uniform
// high-contrast backdrop without per-card framing.
"use client";
import { useEffect, useRef } from "react";

interface Props {
  enter: number; // % scroll to start fading in
  leave: number; // % scroll to finish fading out
}

export default function GlassOverlay({ enter, leave }: Props) {
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
      // Widened fade so the overlay transition feels smooth on fast mobile
      // scroll (0.04 felt abrupt when the scroll container is compressed).
      const fade = 0.06;

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
            opacity = 1;
          } else if (p >= lP && p <= lP + fade) {
            opacity = 1 - (p - lP) / fade;
          }
          el.style.opacity = String(Math.max(0, Math.min(1, opacity)));
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
      className="pointer-events-none fixed top-0 left-0 z-[7] h-dvh w-screen bg-black/45 opacity-0 transform-gpu will-change-[opacity]"
      aria-hidden="true"
    />
  );
}
