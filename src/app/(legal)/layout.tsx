// src/app/(legal)/layout.tsx
// Shared chrome for /privacy and /terms. Uses the cream palette introduced
// by the FAQ section so legal copy reads well for long-form prose, then
// punctuates with the dark FooterSection for continuity with the rest of
// the site.

import Link from "next/link";
import FooterSection from "@/components/organisms/FooterSection/FooterSection";
import { FOOTER_CONFIG } from "@/config/sections";

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative min-h-screen"
      style={{
        background:
          "linear-gradient(180deg, #f4f1ed 0%, #ece6dc 65%, #e4ddd0 100%)",
      }}
    >
      {/* Fine dot-grid texture — matches the FAQ section's surface */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(#1a1a1a 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <LegalHeader />
      <main className="relative">{children}</main>
      <FooterSection config={FOOTER_CONFIG} />
    </div>
  );
}

function LegalHeader() {
  return (
    <header className="relative z-20 border-b border-black/10 bg-transparent backdrop-blur-[2px]">
      <div className="flex items-center justify-between px-6 py-6 md:px-12 lg:px-20 xl:px-28">
        <Link
          href="/"
          className="font-display text-text-primary hover:text-accent text-2xl tracking-[0.15em] uppercase transition-colors duration-200"
        >
          Vivid Geeks
        </Link>
        <Link
          href="/"
          className="group font-body text-text-muted hover:text-accent inline-flex items-center gap-2 text-[0.75rem] tracking-[0.25em] uppercase transition-colors duration-200"
        >
          <span
            aria-hidden="true"
            className="inline-block transition-transform duration-300 group-hover:-translate-x-1"
          >
            ←
          </span>
          <span>Back home</span>
        </Link>
      </div>
    </header>
  );
}
