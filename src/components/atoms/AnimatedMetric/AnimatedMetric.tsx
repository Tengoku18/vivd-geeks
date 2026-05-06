// src/components/atoms/AnimatedMetric/AnimatedMetric.tsx
// Counts up from 0 → target value when the element scrolls into view.
//
// Why parse the value string instead of accepting a number?
//   The case-study data uses pre-formatted strings like "+112%", "4.1×",
//   "+1,650%", "$48 → $102". Treating the value as a regex split lets the
//   counter handle every format without the data layer needing to change.
//
// Behaviour
//   - Splits "+112%" into prefix "+", number 112, suffix "%".
//   - Animates 0 → 112 over 1.6s with ease "power2.out" via GSAP.
//   - Decimals preserved (4.1 stays 4.1, formats with same fraction digits).
//   - Thousands separators preserved if present in the source.
//   - prefers-reduced-motion: skip the animation, render the final value
//     immediately.
//   - Falls back to the raw string for values with no parseable number
//     (e.g. "Q2 '26").
"use client";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface Props {
  value:     string;
  className?: string;
  /** Optional override for the count duration (seconds). */
  duration?: number;
}

// Matches: optional sign, digits with optional thousands commas, optional decimal.
// Captures: prefix (everything before number) | number | suffix (everything after).
const NUM_RE = /^([^\d-]*)(-?[\d,]+(?:\.\d+)?)(.*)$/;

export default function AnimatedMetric({ value, className, duration = 1.6 }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const match = NUM_RE.exec(value);
    if (!match) {
      // Non-numeric value (e.g. "Q2 '26") — render verbatim, no animation.
      el.textContent = value;
      return;
    }
    const [, prefix, numStr, suffix] = match;
    const hasComma   = numStr.includes(",");
    const fractionDigits = (numStr.split(".")[1] ?? "").length;
    const target     = parseFloat(numStr.replace(/,/g, ""));

    const format = (n: number) => {
      const fixed = n.toFixed(fractionDigits);
      // Restore comma thousands grouping if the source had one.
      if (!hasComma) return `${prefix}${fixed}${suffix}`;
      const [intPart, decPart] = fixed.split(".");
      const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return `${prefix}${grouped}${decPart ? `.${decPart}` : ""}${suffix}`;
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      el.textContent = format(target);
      return;
    }

    // Render the final string up-front so layout is stable, then walk it back
    // to 0 once GSAP/ScrollTrigger initialise. This avoids a flash of "0"
    // before hydration and keeps the column width pinned.
    el.textContent = format(target);

    type STInstance = { kill: () => void };
    const triggers: STInstance[] = [];
    let cancelled = false;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      if (cancelled || !el) return;

      const counter = { v: 0 };
      el.textContent = format(0);

      const t = ScrollTrigger.create({
        trigger: el,
        start:   "top 85%",
        once:    true,
        onEnter: () => {
          gsap.to(counter, {
            v:        target,
            duration,
            ease:     "power2.out",
            onUpdate: () => { if (el) el.textContent = format(counter.v); },
          });
        },
      });
      triggers.push(t);
    })();

    return () => {
      cancelled = true;
      for (const t of triggers) t.kill();
    };
  }, [value, duration]);

  // Initial SSR text — never blank, never wrong format width.
  return (
    <span
      ref={ref}
      className={cn("tabular-nums", className)}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {value}
    </span>
  );
}
