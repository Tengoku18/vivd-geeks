// src/components/organisms/SiteHeader/SiteHeader.tsx
// BUG FIX: previous version used window.addEventListener("scroll") which
// does not fire reliably under Lenis's virtual scroll model.
// Header hide/show is driven by the Lenis onScroll callback in useLenis.ts.
// This component renders the static shell; the transform is applied externally.

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
      <div className="flex w-full items-center justify-between px-6 py-6 md:px-12 lg:px-20 xl:px-28">
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
