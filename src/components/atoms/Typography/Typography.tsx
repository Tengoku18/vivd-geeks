// src/components/atoms/Typography/Typography.tsx
// Reusable text primitive. Single source of truth for the type scale.
// Variants map to the skill's clamp() sizes. The `as` prop lets any
// semantic element adopt any visual variant without losing type safety.

import type { ElementType, ReactNode, ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export type TypographyVariant =
  | "display" // hero — clamp(3.5rem, 12vw, 14rem)
  | "h1" // section heading — clamp(2rem, 5vw, 5.5rem)
  | "h2" // mid headings — clamp(1.5rem, 3.5vw, 3rem)
  | "stat" // big counters — clamp(3rem, 8vw, 7rem)
  | "label" // kicker / eyebrow
  | "body" // prose
  | "note" // small print
  | "marquee"; // huge scrolling text — 12vw+

// Scroll copy sits over variable-brightness video frames. Each variant pairs
// a high-alpha fill with a text-shadow so it stays legible over dark product
// renders and bright skyline frames alike.
const TEXT_SHADOW_HEAVY = "[text-shadow:0_2px_18px_rgba(0,0,0,0.75)]";
const TEXT_SHADOW_LIGHT = "[text-shadow:0_1px_10px_rgba(0,0,0,0.8)]";

const VARIANT_CLASSES: Record<TypographyVariant, string> = {
  display: `font-display uppercase leading-[0.95] text-text-on-dark text-[clamp(2.5rem,7vw,8rem)] ${TEXT_SHADOW_HEAVY}`,
  h1: `font-display uppercase leading-[0.95] text-text-on-dark text-[clamp(2rem,5vw,5.5rem)] ${TEXT_SHADOW_HEAVY}`,
  h2: `font-display uppercase leading-[1] text-text-on-dark text-[clamp(1.5rem,3.5vw,3rem)] ${TEXT_SHADOW_HEAVY}`,
  stat: `font-display leading-none text-text-on-dark text-[clamp(3rem,8vw,7rem)] [font-variant-numeric:tabular-nums] ${TEXT_SHADOW_HEAVY}`,
  label: `font-body text-[0.8rem] tracking-[0.3em] uppercase text-white/85 ${TEXT_SHADOW_LIGHT}`,
  body: `font-body text-lg leading-[1.65] text-white/95 ${TEXT_SHADOW_LIGHT}`,
  note: `font-body text-[0.95rem] tracking-[0.05em] text-white/75 ${TEXT_SHADOW_LIGHT}`,
  marquee: `font-display uppercase leading-none text-text-on-dark text-[clamp(4rem,14vw,18rem)] ${TEXT_SHADOW_HEAVY}`,
};

type TypographyOwnProps<T extends ElementType> = {
  as?: T;
  variant: TypographyVariant;
  className?: string;
  children: ReactNode;
};

export type TypographyProps<T extends ElementType> = TypographyOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TypographyOwnProps<T>>;

const DEFAULT_ELEMENT: Record<TypographyVariant, ElementType> = {
  display: "h1",
  h1: "h2",
  h2: "h3",
  stat: "span",
  label: "span",
  body: "p",
  note: "p",
  marquee: "span",
};

export function Typography<T extends ElementType = "p">({
  as,
  variant,
  className,
  children,
  ...rest
}: TypographyProps<T>) {
  const Component = (as ?? DEFAULT_ELEMENT[variant]) as ElementType;
  return (
    <Component className={cn(VARIANT_CLASSES[variant], className)} {...rest}>
      {children}
    </Component>
  );
}
