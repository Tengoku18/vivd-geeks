// src/hooks/useLenis.ts
"use client";
import { useEffect } from "react";
import type Lenis from "lenis";

export function useLenis() {
  useEffect(() => {
    let lenis: Lenis | undefined;

    // BUG FIX: async imports must not use a nested return for cleanup.
    // Capture lenis in outer scope and destroy from the effect cleanup function.
    const init = async () => {
      const { default: LenisCtor } = await import("lenis");
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      lenis = new LenisCtor({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      // BUG FIX: SiteHeader used window.addEventListener("scroll") which
      // does not fire reliably under Lenis. Wire header scroll detection
      // here via Lenis onScroll, not window scroll.
      lenis.on("scroll", ScrollTrigger.update);
      lenis.on(
        "scroll",
        ({ scroll, direction }: { scroll: number; direction: number }) => {
          const header = document.getElementById("site-header");
          if (!header) return;
          header.style.transform =
            direction === 1 && scroll > 80
              ? "translateY(-100%)"
              : "translateY(0)";
        },
      );

      gsap.ticker.add((time: number) => lenis!.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    };

    init();

    // BUG FIX: cleanup lives in the useEffect return, NOT inside the async callback.
    // This guarantees Lenis is always destroyed on unmount.
    return () => {
      lenis?.destroy();
    };
  }, []);
}
