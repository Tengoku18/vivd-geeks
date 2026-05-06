// src/components/organisms/CaseStudyChoreography/CaseStudyChoreography.tsx
//
// Tiny client island that owns all GSAP-driven reveals for a case-study page.
// Renders nothing — it just wires ScrollTrigger to elements marked with the
// data-attribute contract below, then cleans up on unmount.
//
// Contract
//   data-cs-reveal="rise"   — element y-translates 24px up + fades in once
//   data-cs-reveal="quote"  — pull-quote: scales 0.96 → 1 + fades in once
//   data-cs-stagger         — children stagger-fade in once
//
// Why an island instead of useEffect inside [slug]/page.tsx?
//   The page is a Server Component. Adding "use client" there would lose
//   automatic SSG. Wrapping the whole render in a client component would
//   defeat the same benefit. A tiny island keeps SSG intact and isolates
//   the GSAP import behind a dynamic boundary.
"use client";
import { useEffect } from "react";

export default function CaseStudyChoreography() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    type STInstance = { kill: () => void };
    const triggers: STInstance[] = [];
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled) return;

      // Rise + fade reveals — chapter headings, body paragraphs.
      document.querySelectorAll<HTMLElement>('[data-cs-reveal="rise"]').forEach((el) => {
        gsap.set(el, { y: 24, opacity: 0 });
        const t = ScrollTrigger.create({
          trigger: el,
          start:   "top 88%",
          once:    true,
          onEnter: () => {
            gsap.to(el, { y: 0, opacity: 1, duration: 0.95, ease: "power2.out" });
          },
        });
        triggers.push(t);
      });

      // Pull-quote — gentler scale-in for the editorial moment.
      document.querySelectorAll<HTMLElement>('[data-cs-reveal="quote"]').forEach((el) => {
        gsap.set(el, { scale: 0.96, opacity: 0 });
        const t = ScrollTrigger.create({
          trigger: el,
          start:   "top 78%",
          once:    true,
          onEnter: () => {
            gsap.to(el, { scale: 1, opacity: 1, duration: 1.2, ease: "power3.out" });
          },
        });
        triggers.push(t);
      });

      // Stagger groups — children fade in sequentially.
      document.querySelectorAll<HTMLElement>("[data-cs-stagger]").forEach((group) => {
        const children = Array.from(group.children) as HTMLElement[];
        if (!children.length) return;
        gsap.set(children, { y: 18, opacity: 0 });
        const t = ScrollTrigger.create({
          trigger: group,
          start:   "top 85%",
          once:    true,
          onEnter: () => {
            gsap.to(children, {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: "power2.out",
              stagger: 0.10,
            });
          },
        });
        triggers.push(t);
      });

      ScrollTrigger.refresh();
    })();

    return () => {
      cancelled = true;
      for (const t of triggers) t.kill();
    };
  }, []);

  return null;
}
