// src/lib/scrollUtils.ts

import type { Section } from "@/config/sections";

const HERO_RANGE = 20; // hero occupies 0–20%
const SECTION_GAP = 1.5; // breathing room between sections
const CTA_RANGE = 10; // CTA gets the last 10% (90–100)

/**
 * Auto-distributes enter/leave scroll percentages across all non-CTA sections.
 * CTA is always pinned to 90–100%.
 * Sections with manually set enter/leave are left untouched.
 *
 * BUG PREVENTION: uses section.type === "cta" to detect CTA,
 * NOT section.persist (which is fragile and not on this type system).
 */
export function distributeScrollRanges(sections: Section[]): Section[] {
  const nonCta = sections.filter((s) => s.type !== "cta");
  const ctas = sections.filter((s) => s.type === "cta");

  const available = 100 - HERO_RANGE - CTA_RANGE;
  const slotSize = available / nonCta.length;

  const distributed: Section[] = nonCta.map((section, i) => {
    // Respect manual overrides
    if (section.enter !== undefined && section.leave !== undefined)
      return section;
    const enter = HERO_RANGE + i * slotSize;
    const leave = enter + slotSize - SECTION_GAP;
    return {
      ...section,
      enter: parseFloat(enter.toFixed(1)),
      leave: parseFloat(leave.toFixed(1)),
    };
  });

  // All CTAs appended at the end, evenly within the CTA_RANGE
  ctas.forEach((cta, i) => {
    const ctaSlot = CTA_RANGE / ctas.length;
    distributed.push({
      ...cta,
      enter: cta.enter ?? 90 + i * ctaSlot,
      leave: cta.leave ?? 90 + (i + 1) * ctaSlot,
    });
  });

  return distributed;
}

/**
 * Returns the enter/leave range for the dark overlay.
 * Falls back gracefully if the stats section ID isn't found.
 */
export function getOverlayRange(
  sections: Section[],
  statsId: string,
): { enter: number; leave: number } {
  const s = sections.find((sec) => sec.id === statsId);
  if (!s || s.enter === undefined || s.leave === undefined) {
    return { enter: 54, leave: 72 }; // safe fallback
  }
  return { enter: s.enter, leave: s.leave };
}
