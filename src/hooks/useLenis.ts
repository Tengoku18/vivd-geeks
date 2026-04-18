// src/hooks/useLenis.ts
"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type Lenis from "lenis";
import { setLenis, getLenis } from "@/lib/lenisInstance";

export function useLenis() {
  const pathname = usePathname();

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
      setLenis(lenis);

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

          // Fade the glassmorphism backdrop in once we've left the hero so
          // the nav stays readable over every downstream section.
          const glass = document.getElementById("site-header-glass");
          if (glass) glass.style.opacity = scroll > 80 ? "1" : "0";
        },
      );

      gsap.ticker.add((time: number) => lenis!.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    };

    init();

    // GLOBAL link-click preempt. Snaps native scroll to 0 on any
    // primary-button click of an internal, non-hash anchor — *before*
    // the route change kicks in. Without this, the destination page
    // can briefly mount with the previous page's scroll position
    // because Next's scroll-to-top sometimes loses the race against
    // Lenis's own RAF interpolation.
    //
    // We deliberately skip:
    //   - hash-bearing hrefs ("/#contact") — those want to land on an
    //     anchor, not the top.
    //   - external / protocol links (http, mailto, tel).
    //   - middle-click / modified clicks (open in new tab).
    //   - same-path clicks (no navigation actually happens).
    const onDocumentClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return;
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      let el = e.target as Element | null;
      while (el && el.tagName !== "A") el = el.parentElement;
      if (!el) return;
      const a = el as HTMLAnchorElement;
      if (a.target && a.target !== "" && a.target !== "_self") return;

      const href = a.getAttribute("href") ?? "";
      if (!href.startsWith("/") || href.includes("#")) return;
      if (href === window.location.pathname) return;

      // Native reset only — Lenis is about to be destroyed by the
      // outgoing page's cleanup; the new page's useLenis will rebuild
      // and the pathname effect re-anchors the new instance to 0.
      window.scrollTo(0, 0);
    };
    document.addEventListener("click", onDocumentClick);

    // BUG FIX: cleanup lives in the useEffect return, NOT inside the async callback.
    // This guarantees Lenis is always destroyed on unmount.
    return () => {
      document.removeEventListener("click", onDocumentClick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  // Reset scroll to the top on every pathname change.
  //
  // BUG: a single window.scrollTo(0) on pathname change wasn't enough —
  // users were landing in the middle / at the footer of case-study
  // pages. Three independent things conspire against us:
  //   1. The browser's default scrollRestoration policy can re-apply
  //      the previous page's scroll on a new history entry.
  //   2. Lenis's RAF loop interpolates toward its remembered target
  //      every frame — so even after we set scrollY = 0, the next
  //      tick from a stale Lenis instance pulls scroll back.
  //   3. Lenis's async dynamic import means the new instance is
  //      constructed AFTER our pathname effect runs; if scrollY isn't
  //      0 at construction time, the new Lenis anchors there.
  //
  // Defence in depth:
  //   - scrollRestoration = "manual" disables (1) for good.
  //   - The reset runs synchronously, then again over the next two
  //     animation frames, which covers (2) and (3) by re-anchoring
  //     the new Lenis instance the moment it appears.
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const reset = () => {
      window.scrollTo(0, 0);
      // The active Lenis instance might be the one from this hook or
      // (during the brief overlap of route transitions) one belonging
      // to the outgoing page. Either way, force its target to 0.
      getLenis()?.scrollTo(0, { immediate: true, force: true });
    };

    reset();
    const ids: number[] = [];
    ids.push(
      requestAnimationFrame(() => {
        reset();
        ids.push(requestAnimationFrame(reset));
      }),
    );
    return () => ids.forEach(cancelAnimationFrame);
  }, [pathname]);
}
