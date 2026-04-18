// src/components/atoms/Button/Button.tsx
// Dual-mode button: renders <Link>/<a> when `href` is supplied, otherwise a
// <button> (supports type="submit" + disabled for form use).
//
// Hover motion is a composed three-layer effect:
//   1. a gold fill grows from the left edge via scale-x (origin-left)
//   2. the label's letters "roll" — a white copy slides up and out while a
//      pre-tinted dark copy slides up from below into the filled bg
//   3. the arrow translates right and shifts to dark in sync with the fill
//
// Running the text as two stacked copies (rather than transitioning a single
// text color) avoids the muddy-color mid-point you get when bg and text both
// interpolate through the same half-opaque values at once.

import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";
import { cn } from "@/lib/cn";

// Shared easing — Apple-style "out-expo". Used on every moving piece so the
// fill, text roll, border, and arrow land on exactly the same frame.
const EASE = "ease-[cubic-bezier(0.65,0,0.35,1)]";

const BASE_CLASS = cn(
  "group relative inline-flex items-center gap-3 self-start overflow-hidden",
  "border border-white/15 bg-transparent",
  "px-7 py-4 min-w-[12rem]",
  "font-body text-[0.75rem] tracking-[0.25em] uppercase",
  "text-text-on-dark",
  "transition-[border-color] duration-520",
  EASE,
  "hover:border-accent",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  "disabled:pointer-events-none disabled:cursor-wait disabled:opacity-70",
);

interface CommonProps {
  children: ReactNode;
  className?: string;
}

interface LinkButtonProps extends CommonProps {
  href: string;
  onClick?: never;
  type?: never;
  disabled?: never;
}

interface ClickButtonProps extends CommonProps {
  href?: undefined;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export type ButtonProps = LinkButtonProps | ClickButtonProps;

function FillLayer() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "bg-accent absolute inset-0 origin-left",
        "scale-x-0 transition-transform duration-520",
        EASE,
        "group-hover:scale-x-100",
      )}
    />
  );
}

// Two stacked copies of the label. Overflow-hidden wrapper + top:100% on the
// second copy means it sits exactly one line below the first, outside the
// visible area. On hover both translate up by one line — the white copy
// exits, the dark copy enters. Using leading-[1.1] gives a tiny typographic
// breathing room so ascenders aren't clipped while keeping the roll seamless.
function TextRoll({ children }: { children: ReactNode }) {
  const transition = cn(
    "block transition-transform duration-520",
    EASE,
    "group-hover:-translate-y-full",
  );
  return (
    <span className="relative z-10 inline-block overflow-hidden leading-[1.1]">
      <span className={transition}>{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "text-bg-dark absolute top-full left-0",
          transition,
        )}
      >
        {children}
      </span>
    </span>
  );
}

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative z-10 inline-block",
        "transition-[transform,color] duration-520",
        EASE,
        "group-hover:translate-x-1 group-hover:text-bg-dark",
      )}
    >
      →
    </span>
  );
}

function Inner({ children }: { children: ReactNode }) {
  return (
    <>
      <FillLayer />
      <TextRoll>{children}</TextRoll>
      <Arrow />
    </>
  );
}

export function Button(props: ButtonProps) {
  if (props.href !== undefined) {
    const { href, children, className } = props;
    const isExternal = /^https?:\/\//.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          className={cn(BASE_CLASS, className)}
          target="_blank"
          rel="noreferrer noopener"
        >
          <Inner>{children}</Inner>
        </a>
      );
    }
    return (
      <Link href={href} className={cn(BASE_CLASS, className)}>
        <Inner>{children}</Inner>
      </Link>
    );
  }

  const { children, className, onClick, type = "button", disabled } = props;
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(BASE_CLASS, className)}
      onClick={onClick}
    >
      <Inner>{children}</Inner>
    </button>
  );
}
