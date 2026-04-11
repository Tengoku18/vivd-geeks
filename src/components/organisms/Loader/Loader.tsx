// src/components/organisms/Loader/Loader.tsx
"use client";
import { useEffect, useRef } from "react";

interface Props {
  progress: number; // 0–1
}

export default function Loader({ progress }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const dismissed = useRef(false);
  const pct = Math.min(100, Math.round(progress * 100));

  useEffect(() => {
    if (pct < 100 || dismissed.current) return;
    dismissed.current = true;
    const el = ref.current;
    if (!el) return;
    import("gsap").then(({ gsap }) => {
      gsap.to(el, {
        opacity: 0,
        duration: 0.6,
        delay: 0.3,
        ease: "power2.inOut",
        onComplete: () => {
          el.style.display = "none";
        },
      });
    });
  }, [pct]);

  return (
    <div
      ref={ref}
      className="bg-bg-dark fixed inset-0 z-[100] flex flex-col items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <span className="font-display text-text-on-dark mb-6 text-2xl tracking-[0.3em] uppercase">
        Loading
      </span>
      <div
        className="relative h-px w-48 overflow-hidden bg-white/10"
        aria-hidden="true"
      >
        <div
          className="bg-accent absolute inset-y-0 left-0 transition-[width] duration-[250ms] ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className="mt-3 text-xs text-white/25 [font-variant-numeric:tabular-nums]"
        aria-hidden="true"
      >
        {pct}%
      </span>
    </div>
  );
}
