// src/components/organisms/SiteHeader/SiteHeader.tsx
//
// Site-wide navigation. Two modes:
//   - Desktop (md+): horizontal links inline next to the logo.
//   - Mobile (below md): hamburger trigger that opens a full-screen
//     overlay with stagger-revealed nav items.
//
// Hide/show + glass-fade on scroll is driven externally by the Lenis
// onScroll callback in useLenis.ts (look for #site-header / #site-header-glass).
// That contract is unchanged from the previous static version.
//
// Why the mobile menu is a client component
//   The hamburger needs open/close state, body-scroll lock, ESC handling,
//   and Lenis pause/resume — all client-only. The header is small enough
//   that the SSG cost of "use client" is negligible, so the whole file
//   goes client rather than splitting into a thin island.
//
// Body scroll lock
//   Lenis applies scroll transforms via rAF, so flipping `body.overflow`
//   alone isn't enough to halt scroll while the menu is open — Lenis
//   would still animate. We stop() and start() the singleton too.
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";
import { getLenis } from "@/lib/lenisInstance";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Work",     href: "/work" },
  { label: "Contact",  href: "/#contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  // ── Body scroll + Lenis lock when the overlay is open ──────────────────
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      getLenis()?.stop();
    } else {
      document.body.style.overflow = "";
      getLenis()?.start();
    }
    return () => {
      document.body.style.overflow = "";
      getLenis()?.start();
    };
  }, [open]);

  // ── Escape closes ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header
        id="site-header"
        className="fixed inset-x-0 top-0 z-50 transition-transform duration-400 ease-in-out"
      >
        {/* Adaptive glass backdrop — invisible at top, fades in once the
            user scrolls past the hero (driven from useLenis.ts). */}
        <div
          aria-hidden="true"
          id="site-header-glass"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out"
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-xl backdrop-saturate-150" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="relative flex w-full items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5 md:px-12 md:py-6 lg:px-20 xl:px-28">
          <a href="/" aria-label="Vivid Geeks home" className="relative z-10 shrink-0">
            <Image
              src="/logo/black/darkmode-horizontal.png"
              alt="Vivid Geeks"
              width={160}
              height={40}
              className="h-9 w-auto md:h-11"
              priority
            />
          </a>

          {/* ── Desktop nav (md+) ───────────────────────────────────────── */}
          <nav className="hidden gap-10 md:flex" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body hover:text-text-on-dark text-[0.8rem] tracking-[0.25em] text-white/45 uppercase transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* ── Mobile hamburger trigger ────────────────────────────────── */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-nav-menu"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className={cn(
              "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white/[0.04] backdrop-blur-md transition-colors duration-300 md:hidden",
              open ? "border-white/40" : "border-white/15 hover:border-white/30",
            )}
          >
            {/* Three lines that morph into an X. Each line uses
                origin-center + transform so the rotation pivots through
                the line's midpoint, not its corner. */}
            <span className="relative block h-3 w-5">
              <span
                className={cn(
                  "absolute left-0 block h-px w-full origin-center bg-text-on-dark transition-all duration-400 ease-[cubic-bezier(0.65,0,0.35,1)]",
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0 rotate-0",
                )}
              />
              <span
                className={cn(
                  "absolute top-1/2 left-0 block h-px w-full -translate-y-1/2 bg-text-on-dark transition-opacity duration-200",
                  open ? "opacity-0" : "opacity-100",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-px w-full origin-center bg-text-on-dark transition-all duration-400 ease-[cubic-bezier(0.65,0,0.35,1)]",
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0 rotate-0",
                )}
              />
            </span>
          </button>
        </div>
      </header>

      {/* ── Mobile menu overlay ────────────────────────────────────────────
          Sits at z-40, beneath the header (z-50) so the close (X) stays on
          top and tappable. Backdrop click dismisses; ESC dismisses; tapping
          any link dismisses. visibility transition (with delay on close)
          keeps the panel out of the tab order while invisible. */}
      <div
        id="mobile-nav-menu"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-40 overflow-hidden md:hidden",
          "transition-[opacity,visibility] duration-400 ease-out",
          open ? "visible opacity-100" : "invisible opacity-0 delay-300",
        )}
      >
        {/* Backdrop — tap-to-dismiss */}
        <div
          role="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="bg-bg-dark/95 absolute inset-0 backdrop-blur-2xl"
        />

        {/* Brand-cohesion glow — same idiom as the rest of the site */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-1/4 -right-1/4 h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(184,37,42,0.22),transparent_65%)] blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-1/4 -left-1/4 h-[60vmin] w-[60vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(11,29,53,0.45),transparent_65%)] blur-3xl"
        />

        <nav
          aria-label="Mobile navigation"
          className="relative flex h-full flex-col justify-between px-6 pt-28 pb-12 sm:px-8"
        >
          {/* Stagger-revealed link list */}
          <ul className="flex flex-col">
            {NAV_LINKS.map((link, i) => (
              <li key={link.href} className="border-b border-white/10 last:border-b-0">
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "group flex items-baseline gap-5 py-6 sm:py-7",
                    "font-display text-3xl uppercase leading-none tracking-tight text-text-on-dark sm:text-4xl",
                    "transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                    open ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
                  )}
                  style={{
                    transitionDelay: open ? `${180 + i * 90}ms` : "0ms",
                  }}
                >
                  <span className="font-body text-[0.6rem] tracking-[0.3em] text-white/40 uppercase">
                    0{i + 1}
                  </span>
                  <span className="flex-1">{link.label}</span>
                  <span
                    aria-hidden="true"
                    className="text-white/30 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>

          {/* Footer slot — booking + email. Reveals after the links so the
              eye lands on it last. */}
          <div
            className={cn(
              "transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
              open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
            )}
            style={{ transitionDelay: open ? "520ms" : "0ms" }}
          >
            <p className="font-body text-[0.6rem] tracking-[0.3em] text-white/40 uppercase">
              Booking now
            </p>
            <p className="font-body mt-2 text-sm text-white/70">
              Q2 ’26 — taking three more engagements.
            </p>
            <a
              href="mailto:hello@vividgeeks.com"
              onClick={() => setOpen(false)}
              className="font-body hover:text-accent mt-4 inline-block text-base text-text-on-dark transition-colors"
            >
              hello@vividgeeks.com
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
