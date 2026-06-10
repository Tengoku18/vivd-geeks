// src/lib/availability.ts
// Computes the current Australian financial-year quarter and a scarcity-driven
// "slots remaining" count for the footer availability card.
//
//   - Australian FY quarters start in July: Q1 = Jul–Sep, Q2 = Oct–Dec,
//     Q3 = Jan–Mar, Q4 = Apr–Jun.
//   - The year shown is the CALENDAR year of the current month.
//   - Each quarter opens with 9 slots and sheds 3 per month within the quarter
//     (month 1 → 9, month 2 → 6, month 3 → 3) to create FOMO.
//
// Pure (no React) so the math is trivially checkable.

export interface QuarterInfo {
  quarter: number; // 1–4
  year: number; // calendar year
  label: string; // "Q4 2026"
  labelShort: string; // "Q4 '26"
  slots: number; // 9 | 6 | 3
  slotsPadded: string; // "03"
  slotsWord: string; // "three"
}

const SLOT_WORDS: Record<number, string> = {
  9: "nine",
  6: "six",
  3: "three",
};

export function getAustralianQuarter(
  date: Date = new Date(),
  timeZone = "Australia/Sydney",
): QuarterInfo {
  // Resolve the year + 1-based month in the target timezone — same TZ-aware
  // technique the LiveClock uses, so the card and the clock stay in agreement.
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
  }).formatToParts(date);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value); // 1–12

  const monthsSinceJuly = (month - 7 + 12) % 12; // Jul → 0 … Jun → 11
  const quarter = Math.floor(monthsSinceJuly / 3) + 1; // 1–4
  const monthWithinQuarter = monthsSinceJuly % 3; // 0–2
  const slots = 9 - monthWithinQuarter * 3; // 9 | 6 | 3

  return {
    quarter,
    year,
    label: `Q${quarter} ${year}`,
    labelShort: `Q${quarter} '${String(year).slice(2)}`,
    slots,
    slotsPadded: String(slots).padStart(2, "0"),
    slotsWord: SLOT_WORDS[slots] ?? String(slots),
  };
}
