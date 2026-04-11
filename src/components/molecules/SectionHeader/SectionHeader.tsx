// src/components/molecules/SectionHeader/SectionHeader.tsx
// Label + heading pair. Used by Hero, Scroll, Cta sections.
//
// NOTE: the className strings "section-label" and "section-heading" MUST
// remain static strings — the GSAP scroll animation querySelectorAll()s them
// by class name. Tailwind utilities are layered on top via cn().

import { Typography } from "@/components/atoms/Typography";
import { cn } from "@/lib/cn";

interface Props {
  label: string;
  heading: string;
  headingAs?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeader({
  label,
  heading,
  headingAs = "h2",
  className,
}: Props) {
  return (
    <div className={cn("flex flex-col", className)}>
      <Typography variant="label" className="section-label mb-3 block">
        {label}
      </Typography>
      <Typography as={headingAs} variant="h1" className="section-heading mt-2">
        {heading}
      </Typography>
    </div>
  );
}
