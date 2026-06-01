// src/components/atoms/Icon/ChevronDown.tsx
// Inline SVG so the icon inherits color via currentColor and animates
// alongside text (no font/icon library dependency). Used by the Services
// dropdown trigger in SiteHeader — rotates 180° while the menu is open.

import type { SVGProps } from "react";

export default function ChevronDown({
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
      // Pass a className like "h-3 w-3" to override.
      className={className ?? "h-[1em] w-[1em]"}
      {...props}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
