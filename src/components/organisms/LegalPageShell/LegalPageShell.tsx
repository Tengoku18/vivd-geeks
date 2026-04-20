// src/components/organisms/LegalPageShell/LegalPageShell.tsx
// Typographic shell used by /privacy and /terms. Dark theme to match
// the rest of the site. Adds top padding to clear the fixed SiteHeader.

import type { ReactNode, AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

interface ShellProps {
  label: string;
  heading: string;
  effectiveDate: string;
  intro?: string;
  children: ReactNode;
}

export default function LegalPageShell({
  label,
  heading,
  effectiveDate,
  intro,
  children,
}: ShellProps) {
  return (
    <>
      {/* ── Hero ───────────────────────────────────────────────────────── */}
      {/* pt-* values clear the fixed SiteHeader (~96px on desktop). */}
      <section className="relative px-6 pt-36 pb-16 md:px-12 md:pt-44 md:pb-24 lg:px-20 lg:pt-52 lg:pb-28 xl:px-28">
        <div className="relative">
          <span className="font-body text-[0.7rem] tracking-[0.3em] uppercase text-white/55 md:text-[0.75rem]">
            {label}
          </span>
          <h1 className="font-display mt-5 text-[clamp(2.25rem,5.5vw,5rem)] leading-[0.95] tracking-tight uppercase text-text-on-dark [text-shadow:0_2px_18px_rgba(0,0,0,0.5)]">
            {heading}
          </h1>

          <div className="mt-8 flex items-center gap-4">
            <span aria-hidden="true" className="bg-accent block h-px w-12" />
            <span className="font-body text-[0.7rem] tracking-[0.3em] uppercase text-white/55 md:text-[0.75rem]">
              Effective · {effectiveDate}
            </span>
          </div>

          {intro && (
            <p className="font-body mt-8 max-w-[62ch] text-base leading-[1.7] text-white/75 md:text-lg">
              {intro}
            </p>
          )}
        </div>
      </section>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <article className="relative px-6 pb-28 md:px-12 md:pb-36 lg:px-20 xl:px-28">
        <div className="mx-auto max-w-[72ch]">
          <div className="space-y-14">{children}</div>

          <p className="font-body mt-20 border-t border-white/10 pt-8 text-[0.85rem] leading-[1.6] text-white/45 italic">
            This document is provided as-is. It is not legal advice — consult
            a qualified lawyer in your jurisdiction before relying on it.
          </p>
        </div>
      </article>
    </>
  );
}

// ─── Section primitive ───────────────────────────────────────────────────────
interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function LegalSection({ title, children, className }: SectionProps) {
  return (
    <section className={cn("scroll-mt-24", className)}>
      <h2 className="font-display text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.15] tracking-tight uppercase text-text-on-dark">
        {title}
      </h2>
      <div className="font-body mt-4 space-y-4 text-[1.02rem] leading-[1.7] text-white/75">
        {children}
      </div>
    </section>
  );
}

// ─── Inline link primitive ──────────────────────────────────────────────────
// Centralised so the privacy/terms pages don't hard-code link styling.
// Uses the white/25 underline + accent hover idiom seen elsewhere on the
// dark surfaces (footer, work cards).
type LegalLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function LegalLink({ className, ...rest }: LegalLinkProps) {
  return (
    <a
      {...rest}
      className={cn(
        "border-b border-white/25 text-text-on-dark transition-colors hover:border-accent hover:text-accent",
        className,
      )}
    />
  );
}

// ─── Inline emphasis primitive ──────────────────────────────────────────────
// `<strong>` defaults to bold, but the body font reads better with the
// regular weight bumped to white/95 for emphasis instead.
export function LegalEmphasis({ children }: { children: ReactNode }) {
  return (
    <strong className="font-normal text-text-on-dark">{children}</strong>
  );
}
