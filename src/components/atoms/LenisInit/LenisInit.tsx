// src/components/atoms/LenisInit/LenisInit.tsx
// Client-only side-effect: initializes Lenis smooth scroll for the page.
// Renders nothing. Use this from server components that want the same
// scroll behavior as the home page (header hide/show, smooth wheel,
// ScrollTrigger sync) without needing to mark the whole route as
// "use client".

"use client";

import { useLenis } from "@/hooks/useLenis";

export default function LenisInit() {
  useLenis();
  return null;
}
