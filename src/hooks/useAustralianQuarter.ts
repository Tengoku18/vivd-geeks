// src/hooks/useAustralianQuarter.ts
// Client hook exposing the live Australian-FY quarter + slot count.
//
// SSR-safety mirrors LiveClock: the real value is computed POST-MOUNT so it
// stays correct even when the page HTML is statically cached at build time.
// The initial state is a fixed, time-independent fallback that's identical on
// the server and the first client render — avoiding any hydration mismatch.
"use client";
import { useEffect, useState } from "react";
import { getAustralianQuarter, type QuarterInfo } from "@/lib/availability";

// Neutral first-paint value. Replaced on mount with the real Sydney value.
const FALLBACK: QuarterInfo = {
  quarter: 2,
  year: 2026,
  label: "Q2 2026",
  labelShort: "Q2 '26",
  slots: 2,
  slotsPadded: "02",
  slotsWord: "two",
};

export function useAustralianQuarter(): QuarterInfo {
  const [info, setInfo] = useState<QuarterInfo>(FALLBACK);

  useEffect(() => {
    // Subscribe to the wall clock: fill the real value on mount, then re-check
    // periodically so a long-open tab rolls over correctly at a month boundary.
    const tick = () => setInfo(getAustralianQuarter());
    tick();
    const id = window.setInterval(tick, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return info;
}
