// src/components/molecules/StatBlock/StatBlock.tsx
// Single counter cell. The `.stat-number` class and data- attributes are
// queried by StatsSection's GSAP animation — do not rename.

import { Typography } from "@/components/atoms/Typography";
import type { StatItem } from "@/config/sections";

interface Props {
  stat: StatItem;
}

export function StatBlock({ stat }: Props) {
  return (
    <div className="flex flex-col items-center">
      <Typography
        variant="stat"
        as="span"
        className="stat-number"
        data-value={stat.value}
        data-decimals={stat.decimals ?? 0}
      >
        0
      </Typography>
      {stat.suffix && (
        <span className="font-display text-accent mt-1 text-[clamp(1.25rem,3vw,2.5rem)]">
          {stat.suffix}
        </span>
      )}
      <Typography variant="label" className="mt-3">
        {stat.label}
      </Typography>
    </div>
  );
}
