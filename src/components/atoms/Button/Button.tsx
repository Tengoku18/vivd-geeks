// src/components/atoms/Button/Button.tsx
// Dual-mode button: renders a <Link> or external <a> when `href` is supplied,
// otherwise a <button>. Styles from the skill's CTA spec.

import Link from "next/link";
import type { ReactNode, MouseEventHandler } from "react";
import { cn } from "@/lib/cn";

const BASE_CLASS = cn(
  "group inline-flex items-center gap-3 self-start",
  "border border-white/15 bg-transparent",
  "px-7 py-4 min-w-[12rem]",
  "font-body text-[0.75rem] tracking-[0.25em] uppercase",
  "text-text-on-dark",
  "transition-colors duration-300 ease-out",
  "hover:bg-accent hover:text-bg-dark hover:border-accent",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
);

interface CommonProps {
  children: ReactNode;
  className?: string;
}

interface LinkButtonProps extends CommonProps {
  href: string;
  onClick?: never;
}

interface ClickButtonProps extends CommonProps {
  href?: undefined;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

export type ButtonProps = LinkButtonProps | ClickButtonProps;

function Arrow() {
  return (
    <span
      aria-hidden="true"
      className="transition-transform duration-300 group-hover:translate-x-1"
    >
      →
    </span>
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
          <span>{children}</span>
          <Arrow />
        </a>
      );
    }
    return (
      <Link href={href} className={cn(BASE_CLASS, className)}>
        <span>{children}</span>
        <Arrow />
      </Link>
    );
  }

  const { children, className, onClick } = props;
  return (
    <button
      type="button"
      className={cn(BASE_CLASS, className)}
      onClick={onClick}
    >
      <span>{children}</span>
      <Arrow />
    </button>
  );
}
