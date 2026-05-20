// src/components/atoms/Icon/ChevronLeft.tsx
// Inline SVG so the icon inherits color via currentColor and animates
// alongside text (no font/icon library dependency).

import type { SVGProps } from "react";

export default function ChevronLeft({
  className,
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      // Sized in em so it scales with the surrounding text by default.
      // Pass a className like "h-4 w-4" to override.
      className={className ?? "h-[1em] w-[1em]"}
      {...props}
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
