// src/components/organisms/LegalPageShell/LegalPageShell.tsx
// Typographic shell used by /privacy and /terms. Keeps the hero + prose
// rhythm consistent so updating one page doesn't drift the other.

import type { ReactNode } from "react";
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
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 lg:pt-36 lg:pb-28">
        <div className="relative px-6 md:px-12 lg:px-20 xl:px-28">
          <span className="font-body text-text-muted text-[0.8rem] tracking-[0.3em] uppercase">
            {label}
          </span>
          <h1 className="font-display text-text-primary mt-5 text-[clamp(2.25rem,5.5vw,5rem)] leading-[0.95] tracking-[-0.01em] uppercase">
            {heading}
          </h1>

          <div className="mt-8 flex items-center gap-4">
            <span
              aria-hidden="true"
              className="bg-accent/70 block h-px w-12"
            />
            <span className="font-body text-text-muted/80 text-[0.75rem] tracking-[0.25em] uppercase">
              Effective · {effectiveDate}
            </span>
          </div>

          {intro && (
            <p className="font-body text-text-muted mt-8 max-w-[62ch] text-lg leading-[1.65]">
              {intro}
            </p>
          )}
        </div>
      </section>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <article className="relative pb-28 md:pb-36">
        <div className="mx-auto max-w-[72ch] px-6 md:px-12 lg:px-8 xl:px-0">
          <div className="space-y-14">{children}</div>

          <p className="font-body text-text-muted/70 mt-20 border-t border-black/10 pt-8 text-[0.85rem] leading-[1.6] italic">
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
      <h2 className="font-display text-text-primary text-[clamp(1.25rem,2vw,1.75rem)] leading-[1.15] tracking-[0.01em] uppercase">
        {title}
      </h2>
      <div className="font-body text-text-muted mt-4 space-y-4 text-[1.02rem] leading-[1.7]">
        {children}
      </div>
    </section>
  );
}
