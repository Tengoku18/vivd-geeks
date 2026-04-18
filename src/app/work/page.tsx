// src/app/work/page.tsx
// /work — dark, consultancy-style archive. Uses the same SiteHeader,
// FooterSection, and Lenis smooth-scroll setup as the home page so the
// transition between routes feels like one site, not two.

"use client";

import { useLenis } from "@/hooks/useLenis";
import { FOOTER_CONFIG } from "@/config/sections";
import SiteHeader from "@/components/organisms/SiteHeader/SiteHeader";
import FooterSection from "@/components/organisms/FooterSection/FooterSection";
import { WorkArchive } from "@/components/organisms/WorkArchive";

export default function WorkPage() {
  // Drives SiteHeader hide/show + glass backdrop fade on scroll. The
  // header reads scroll position via Lenis (see useLenis.ts), so without
  // this hook the nav would never collapse and the glass would never
  // fade in.
  useLenis();

  return (
    <>
      <SiteHeader />
      <WorkArchive />
      <FooterSection config={FOOTER_CONFIG} />
    </>
  );
}
