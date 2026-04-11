// src/components/organisms/MarqueeText/MarqueeText.tsx
"use client";
import { useEffect, useRef } from "react";

interface Props {
  text: string;
  speed?: number; // negative = moves left
  enterAt?: number; // % scroll to fade in
  leaveAt?: number; // % scroll to fade out
}

export default function MarqueeText({
  text,
  speed = -25,
  enterAt = 20,
  leaveAt = 80,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const textEl = textRef.current;
    if (!wrap || !textEl) return;

    type STInstance = { kill: () => void };
    let slideTrigger: STInstance | undefined;
    let fadeTrigger: STInstance | undefined;

    const init = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const scrollEl = document.getElementById("scroll-container");
      if (!scrollEl) return;

      slideTrigger = ScrollTrigger.create({
        trigger: scrollEl,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          gsap.set(textEl, { xPercent: speed * self.progress });
        },
      });

      const fadeRange = 3;
      fadeTrigger = ScrollTrigger.create({
        trigger: scrollEl,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress * 100;
          let opacity = 0;
          if (p >= enterAt && p <= enterAt + fadeRange) {
            opacity = (p - enterAt) / fadeRange;
          } else if (p > enterAt + fadeRange && p < leaveAt - fadeRange) {
            opacity = 1;
          } else if (p >= leaveAt - fadeRange && p <= leaveAt) {
            opacity = (leaveAt - p) / fadeRange;
          }
          wrap.style.opacity = String(Math.max(0, Math.min(1, opacity)));
        },
      });
    };

    init();

    return () => {
      slideTrigger?.kill();
      fadeTrigger?.kill();
    };
  }, [speed, enterAt, leaveAt]);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed top-[44vh] left-0 z-10 w-screen overflow-hidden opacity-0 select-none"
      aria-hidden="true"
    >
      <div
        ref={textRef}
        className="font-display text-text-on-dark text-[clamp(4rem,12vw,14rem)] leading-none whitespace-nowrap uppercase opacity-[0.07] will-change-transform"
      >
        {text}&nbsp;&nbsp;{text}&nbsp;&nbsp;{text}
      </div>
    </div>
  );
}
