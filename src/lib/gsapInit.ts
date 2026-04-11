// src/lib/gsapInit.ts
// Centralises GSAP plugin registration.
// Import and call initGsap() once per component tree — safe to call multiple
// times because GSAP deduplicates internally, but keeping one call site
// avoids confusion.

let initialised = false;

export async function initGsap() {
  const { gsap } = await import("gsap");
  const { ScrollTrigger } = await import("gsap/ScrollTrigger");
  if (!initialised) {
    gsap.registerPlugin(ScrollTrigger);
    initialised = true;
  }
  return { gsap, ScrollTrigger };
}
