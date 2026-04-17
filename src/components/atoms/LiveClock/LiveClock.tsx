// src/components/atoms/LiveClock/LiveClock.tsx
// Renders a live clock that updates every 15s. Used inside the footer's
// availability card to give the "currently open" claim a pulse of realism.
"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

interface Props {
  timeZone?: string;
  locale?: string;
  className?: string;
}

export function LiveClock({
  timeZone = "America/Los_Angeles",
  locale = "en-US",
  className,
}: Props) {
  // SSR renders an empty span, hydration fills it. This avoids an SSR/client
  // mismatch because the server's clock and the user's browser differ.
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat(locale, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 15_000);
    return () => window.clearInterval(id);
  }, [locale, timeZone]);

  return (
    <span className={cn("tabular-nums", className)}>{time || "--:--"}</span>
  );
}
