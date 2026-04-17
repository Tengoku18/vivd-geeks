// src/components/organisms/SiteHeader/SiteHeader.tsx
// BUG FIX: previous version used window.addEventListener("scroll") which
// does not fire reliably under Lenis's virtual scroll model.
// Header hide/show + glass fade-in is driven by the Lenis onScroll callback
// in useLenis.ts. This component renders the static shell; the transform
// and glass opacity are applied externally.

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Work", href: "#work" },
  { label: "Contact", href: "#contact" },
];

export default function SiteHeader() {
  return (
    // BUG FIX: id="site-header" must match the querySelector in useLenis.ts
    <header
      id="site-header"
      className="fixed inset-x-0 top-0 z-50 transition-transform duration-400 ease-in-out"
    >
      {/* Adaptive glass backdrop — invisible at top, fades in once the user
          scrolls past the hero. A dark-tinted frosted panel is used instead
          of a white one because the nav text is white, and a white glass
          would vanish over the cream-toned FAQ section. Opacity is toggled
          from useLenis.ts. */}
      <div
        aria-hidden="true"
        id="site-header-glass"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out"
      >
        <div className="absolute inset-0 bg-black/30 backdrop-blur-xl backdrop-saturate-150" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
      </div>

      <div className="relative flex w-full items-center justify-between px-6 py-6 md:px-12 lg:px-20 xl:px-28">
        <span className="font-display text-text-on-dark text-2xl tracking-[0.15em] uppercase">
          Vivid Geeks
        </span>
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
      </div>
    </header>
  );
}
