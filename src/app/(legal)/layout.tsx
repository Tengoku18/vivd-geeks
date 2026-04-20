// src/app/(legal)/layout.tsx
// Shared chrome for /privacy and /terms. Now matches the dark theme used
// on /work and /work/[slug] — same SiteHeader, same FooterSection,
// same ambient glow + dot grid — so legal copy reads as part of the
// site rather than a stand-alone document.

import FooterSection from "@/components/organisms/FooterSection/FooterSection";
import SiteHeader from "@/components/organisms/SiteHeader/SiteHeader";
import LenisInit from "@/components/atoms/LenisInit/LenisInit";
import { FOOTER_CONFIG } from "@/config/sections";

const DOT_GRID_STYLE: React.CSSProperties = {
  backgroundImage:
    "radial-gradient(rgba(240,237,232,0.08) 1px, transparent 1px)",
  backgroundSize: "28px 28px",
};

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LenisInit />
      <SiteHeader />

      <main className="bg-bg-dark text-text-on-dark relative min-h-screen overflow-hidden">
        {/* Ambient glow orbs — same idiom as the footer + work pages so
            the legal pages read as part of one design system. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/4 -right-1/4 h-[70vmin] w-[70vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,169,126,0.12),transparent_65%)] blur-3xl"
          style={{ animation: "drift-a 22s ease-in-out infinite" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 -left-1/4 h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(120,160,220,0.07),transparent_65%)] blur-3xl"
          style={{ animation: "drift-b 28s ease-in-out infinite" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-30"
          style={DOT_GRID_STYLE}
        />

        <div className="relative">{children}</div>
      </main>

      <FooterSection config={FOOTER_CONFIG} />
    </>
  );
}
