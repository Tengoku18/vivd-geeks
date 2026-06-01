// src/components/organisms/SiteHeader/SiteHeader.tsx
//
// Site-wide navigation. Two modes:
//   - Desktop (md+): three-column layout — logo (left), centered menu,
//     CTA + contact number (right). The "Services" item opens a hover
//     mega-menu below the bar listing every service category and its
//     sub-services, each deep-linking into /services/[slug].
//   - Mobile (below md): hamburger trigger that opens a full-screen
//     overlay with stagger-revealed nav items.
//
// Hide/show + glass-fade on scroll is driven externally by the Lenis
// onScroll callback in useLenis.ts (look for #site-header / #site-header-glass).
// That contract is unchanged from the previous static version.
//
// Why the mobile menu is a client component
//   The hamburger needs open/close state, body-scroll lock, ESC handling,
//   and Lenis pause/resume — all client-only. The desktop mega-menu also
//   needs hover/focus state. The header is small enough that the SSG cost
//   of "use client" is negligible, so the whole file goes client.
//
// Body scroll lock
//   Lenis applies scroll transforms via rAF, so flipping `body.overflow`
//   alone isn't enough to halt scroll while the menu is open — Lenis
//   would still animate. We stop() and start() the singleton too.
"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { getLenis } from "@/lib/lenisInstance";
import { CONTACT_CONFIG } from "@/config/sections";
import { SERVICE_CATEGORIES } from "@/config/services";
import { WORK_PROJECTS } from "@/config/work";
import { BLOG_POSTS } from "@/config/resources";
import ChevronRight from "@/components/atoms/Icon/ChevronRight";
import ChevronDown from "@/components/atoms/Icon/ChevronDown";

// Contact number surfaced in the navbar — single-sourced from the contact
// config so it never drifts from the rest of the site.
const PHONE = CONTACT_CONFIG.info.find((i) => i.label === "WhatsApp");

// Primary call-to-action shown on the right of the desktop bar.
const CTA = { label: "Start a Project", href: "/#contact" };

// Which nav items open a hover mega-menu. `menu` keys into the panels
// rendered below the bar; links without it behave as plain anchors.
type MenuKey = "services" | "work" | "resources";

const NAV_LINKS: { label: string; href: string; menu?: MenuKey }[] = [
  { label: "Services", href: "/services", menu: "services" },
  { label: "Work", href: "/work", menu: "work" },
  { label: "Resources", href: "/resources", menu: "resources" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  // Which desktop mega-menu is currently open (null = none).
  const [activeMenu, setActiveMenu] = useState<MenuKey | null>(null);
  // Small close delay so the cursor can travel from the trigger into the
  // panel without the menu collapsing underneath it.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMenu = (menu: MenuKey) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveMenu(menu);
  };
  const scheduleCloseMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActiveMenu(null), 140);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

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
    if (!open && !activeMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setActiveMenu(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, activeMenu]);

  return (
    <>
      <header
        id="site-header"
        className="fixed inset-x-0 top-0 z-50 transition-transform duration-400 ease-in-out"
      >
        {/* Adaptive glass backdrop — invisible at top, fades in once the
            user scrolls past the hero (driven from useLenis.ts via inline
            opacity, so it stays a plain static element here). The mega-menu
            panel carries its own solid backdrop for readability at the top. */}
        <div
          aria-hidden="true"
          id="site-header-glass"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 ease-out"
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-xl backdrop-saturate-150" />
          <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
        </div>

        <div className="relative flex w-full items-center justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5 md:px-12 md:py-6 lg:px-20 xl:px-28">
          {/* ── Left: logo ──────────────────────────────────────────────── */}
          <div className="flex flex-1 items-center">
            <Link
              href="/"
              aria-label="Vivid Geeks home"
              className="relative z-10 shrink-0"
            >
              <Image
                src="/logo/black/darkmode-horizontal.png"
                alt="Vivid Geeks Digital — digital agency"
                width={200}
                height={50}
                className="h-11 w-auto md:h-14"
                priority
              />
            </Link>
          </div>

          {/* ── Center: desktop nav (md+) ───────────────────────────────── */}
          <nav
            className="hidden items-center gap-10 md:flex"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) =>
              link.menu ? (
                <div
                  key={link.href}
                  className="relative z-10"
                  onMouseEnter={() => openMenu(link.menu!)}
                  onMouseLeave={scheduleCloseMenu}
                >
                  <Link
                    href={link.href}
                    aria-haspopup="true"
                    aria-expanded={activeMenu === link.menu}
                    onFocus={() => openMenu(link.menu!)}
                    className={cn(
                      "font-body flex items-center gap-1.5 text-[0.95rem] font-semibold tracking-[0.2em] uppercase transition-colors duration-200",
                      activeMenu === link.menu
                        ? "text-text-on-dark"
                        : "text-white/55 hover:text-text-on-dark",
                    )}
                  >
                    {link.label}
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform duration-300",
                        activeMenu === link.menu && "rotate-180",
                      )}
                    />
                  </Link>
                </div>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-[0.95rem] font-semibold tracking-[0.2em] text-white/55 uppercase transition-colors duration-200 hover:text-text-on-dark"
                >
                  {link.label}
                </Link>
              ),
            )}
          </nav>

          {/* ── Right: contact number + CTA (md+), hamburger (mobile) ────── */}
          <div className="flex flex-1 items-center justify-end gap-4 lg:gap-6">
            {PHONE && (
              <a
                href={PHONE.href}
                className="font-body hidden text-[0.95rem] font-semibold tracking-[0.12em] text-white/55 transition-colors duration-200 hover:text-text-on-dark lg:inline-block"
              >
                {PHONE.value}
              </a>
            )}
            <Link
              href={CTA.href}
              className="font-body hidden items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-6 py-3 text-[0.92rem] font-semibold tracking-[0.18em] text-text-on-dark uppercase backdrop-blur-md transition-colors duration-300 hover:border-accent hover:text-accent md:inline-flex"
            >
              {CTA.label}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>

            {/* ── Mobile hamburger trigger ──────────────────────────────── */}
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
        </div>

        {/* ── Services mega-menu (desktop hover panel) ─────────────────────
            Rendered inside the header so it inherits z-50 and sits above the
            page. Hover is kept alive by sharing the open/close handlers with
            the trigger; a short close delay bridges the gap between them. */}
        <div
          className={cn(
            "absolute inset-x-0 top-full hidden px-5 sm:px-6 md:block md:px-12 lg:px-20 xl:px-28",
            "transition-[opacity,transform] duration-300 ease-out",
            activeMenu === "services"
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0",
          )}
          onMouseEnter={() => openMenu("services")}
          onMouseLeave={scheduleCloseMenu}
        >
          <div className="mx-auto mt-3 w-full max-w-7xl overflow-hidden rounded-3xl border border-white/12 bg-bg-dark/95 shadow-2xl backdrop-blur-2xl">
            {/* Brand-cohesion glow — same idiom as the rest of the site */}
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-1/2 right-0 h-[50vmin] w-[50vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,169,126,0.14),transparent_65%)] blur-3xl"
              />
              <div className="relative grid grid-cols-2 gap-x-10 gap-y-10 p-9 md:p-12 lg:grid-cols-3 xl:grid-cols-5">
                {SERVICE_CATEGORIES.map((cat) => (
                  <div key={cat.slug} className="min-w-0">
                    <Link
                      href={`/services/${cat.slug}`}
                      onClick={() => setActiveMenu(null)}
                      className="group/cat block border-b border-white/10 pb-3"
                    >
                      <span className="font-body block text-[0.72rem] tracking-[0.28em] text-accent uppercase">
                        {cat.label.split("/")[0].trim()}
                      </span>
                      <span className="font-display mt-2 flex items-center gap-1 text-[1.5rem] leading-[1.1] tracking-tight text-text-on-dark uppercase transition-colors group-hover/cat:text-accent">
                        {cat.category}
                      </span>
                    </Link>

                    <ul className="mt-4 flex flex-col gap-1.5">
                      {cat.details.map((d) => (
                        <li key={d.slug}>
                          <Link
                            href={`/services/${cat.slug}#${d.slug}`}
                            onClick={() => setActiveMenu(null)}
                            className="group/item font-body flex items-center gap-1.5 py-1.5 text-[0.95rem] leading-snug text-white/75 transition-colors duration-200 hover:text-text-on-dark"
                          >
                            <span className="flex-1">{d.name}</span>
                            <ChevronRight className="h-3.5 w-3.5 -translate-x-1 text-accent opacity-0 transition-[transform,opacity] duration-200 group-hover/item:translate-x-0 group-hover/item:opacity-100" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Footer row — explore-all affordance */}
              <div className="border-t border-white/10 px-9 py-5 md:px-12">
                <Link
                  href="/services"
                  onClick={() => setActiveMenu(null)}
                  className="font-body inline-flex items-center gap-2 text-[0.8rem] tracking-[0.25em] text-white/70 uppercase transition-colors duration-200 hover:text-accent"
                >
                  View all services
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Work mega-menu (desktop hover panel) ─────────────────────────
            Mirrors the Services panel: a grid of case studies, each
            deep-linking into /work/[slug]. */}
        <div
          className={cn(
            "absolute inset-x-0 top-full hidden px-5 sm:px-6 md:block md:px-12 lg:px-20 xl:px-28",
            "transition-[opacity,transform] duration-300 ease-out",
            activeMenu === "work"
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0",
          )}
          onMouseEnter={() => openMenu("work")}
          onMouseLeave={scheduleCloseMenu}
        >
          <div className="mx-auto mt-3 w-full max-w-7xl overflow-hidden rounded-3xl border border-white/12 bg-bg-dark/95 shadow-2xl backdrop-blur-2xl">
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-1/2 right-0 h-[50vmin] w-[50vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,169,126,0.14),transparent_65%)] blur-3xl"
              />
              {/* nth-last-child clears the bottom border on the final row so
                  it doesn't double up against the footer's top border. The
                  last row holds 2 items at 2/3 cols and 4 items at xl (4
                  cols) for the current 8 projects. */}
              <div className="relative grid grid-cols-2 gap-x-10 gap-y-8 p-9 md:p-12 lg:grid-cols-3 xl:grid-cols-4 [&>*:nth-last-child(-n+2)]:border-b-0 xl:[&>*:nth-last-child(-n+4)]:border-b-0">
                {WORK_PROJECTS.map((project) => (
                  <Link
                    key={project.slug}
                    href={`/work/${project.slug}`}
                    onClick={() => setActiveMenu(null)}
                    className="group/work block min-w-0 border-b border-white/10 pb-3"
                  >
                    <span className="font-body block text-[0.68rem] tracking-[0.24em] text-accent uppercase">
                      {project.discipline}
                    </span>
                    <span className="font-display mt-2 flex items-center gap-1.5 text-[1.5rem] leading-[1.1] tracking-tight text-text-on-dark uppercase transition-colors group-hover/work:text-accent">
                      <span className="flex-1">{project.title}</span>
                      <ChevronRight className="h-4 w-4 -translate-x-1 text-accent opacity-0 transition-[transform,opacity] duration-200 group-hover/work:translate-x-0 group-hover/work:opacity-100" />
                    </span>
                    <span className="font-body mt-1.5 block text-[0.92rem] leading-snug text-white/65">
                      {project.subtitle}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Footer row — explore-all affordance */}
              <div className="border-t border-white/10 px-9 py-5 md:px-12">
                <Link
                  href="/work"
                  onClick={() => setActiveMenu(null)}
                  className="font-body inline-flex items-center gap-2 text-[0.8rem] tracking-[0.25em] text-white/70 uppercase transition-colors duration-200 hover:text-accent"
                >
                  View all work
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ── Resources mega-menu (desktop hover panel) ────────────────────
            Mirrors the Services/Work panels: a grid of blog posts, each
            deep-linking into /resources/[slug]. */}
        <div
          className={cn(
            "absolute inset-x-0 top-full hidden px-5 sm:px-6 md:block md:px-12 lg:px-20 xl:px-28",
            "transition-[opacity,transform] duration-300 ease-out",
            activeMenu === "resources"
              ? "visible translate-y-0 opacity-100"
              : "invisible -translate-y-2 opacity-0",
          )}
          onMouseEnter={() => openMenu("resources")}
          onMouseLeave={scheduleCloseMenu}
        >
          <div className="mx-auto mt-3 w-full max-w-7xl overflow-hidden rounded-3xl border border-white/12 bg-bg-dark/95 shadow-2xl backdrop-blur-2xl">
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-1/2 right-0 h-[50vmin] w-[50vmin] rounded-full bg-[radial-gradient(circle_at_center,rgba(200,169,126,0.14),transparent_65%)] blur-3xl"
              />
              <div className="relative grid grid-cols-2 gap-x-10 gap-y-8 p-9 md:p-12 lg:grid-cols-3">
                {BLOG_POSTS.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/resources/${post.slug}`}
                    onClick={() => setActiveMenu(null)}
                    className="group/post block min-w-0"
                  >
                    <span
                      className="font-body block text-[0.68rem] tracking-[0.24em] uppercase"
                      style={{ color: post.accent }}
                    >
                      {post.category}
                    </span>
                    <span className="font-display mt-2 flex items-start gap-1.5 text-[1.35rem] leading-[1.15] tracking-tight text-text-on-dark uppercase transition-colors group-hover/post:text-accent">
                      <span className="flex-1">{post.title}</span>
                      <ChevronRight className="mt-1 h-4 w-4 shrink-0 -translate-x-1 text-accent opacity-0 transition-[transform,opacity] duration-200 group-hover/post:translate-x-0 group-hover/post:opacity-100" />
                    </span>
                    <span className="font-body mt-2 block text-[0.78rem] tracking-[0.18em] uppercase text-white/45">
                      {post.readTime}
                    </span>
                  </Link>
                ))}
              </div>

              {/* Footer row — explore-all affordance */}
              <div className="border-t border-white/10 px-9 py-5 md:px-12">
                <Link
                  href="/resources"
                  onClick={() => setActiveMenu(null)}
                  className="font-body inline-flex items-center gap-2 text-[0.8rem] tracking-[0.25em] text-white/70 uppercase transition-colors duration-200 hover:text-accent"
                >
                  View all resources
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
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
                <Link
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
                    className="inline-flex items-center text-white/30 transition-transform duration-300 group-hover:translate-x-1"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Footer slot — booking + contact. Reveals after the links so the
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
              href="mailto:hello@vividgeeksdigital.com.au"
              onClick={() => setOpen(false)}
              className="font-body hover:text-accent mt-4 inline-block text-base text-text-on-dark transition-colors"
            >
              hello@vividgeeksdigital.com.au
            </a>
            {PHONE && (
              <a
                href={PHONE.href}
                onClick={() => setOpen(false)}
                className="font-body hover:text-accent mt-2 block text-base text-text-on-dark transition-colors"
              >
                {PHONE.value}
              </a>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}
