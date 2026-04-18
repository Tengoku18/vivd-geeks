// src/lib/scrollToHash.ts
// Smooth-scrolls to the element matching a `#hash`. Compatible with the
// site's scroll-driven layout where service sections are absolutely
// positioned inside #scroll-container and centered via translateY(-50%).
//
// Naive `el.scrollIntoView()` would align the element's bounding-box top
// with the viewport top — leaving the visible content above the fold
// because of the -50% transform. We compute the document Y that places
// the element's vertical center at the viewport's vertical center.

import { getLenis } from "./lenisInstance";

export function scrollToHash(hash: string): boolean {
  const id = hash.startsWith("#") ? hash.slice(1) : hash;
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;

  const rect = el.getBoundingClientRect();
  const absoluteTop = window.scrollY + rect.top;
  // If the element is taller than the viewport, just pin its top; otherwise
  // center it vertically.
  const centeringOffset = Math.max(0, (window.innerHeight - rect.height) / 2);
  const target = absoluteTop - centeringOffset;

  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, { duration: 1.8 });
  } else {
    window.scrollTo({ top: target, behavior: "smooth" });
  }
  return true;
}
