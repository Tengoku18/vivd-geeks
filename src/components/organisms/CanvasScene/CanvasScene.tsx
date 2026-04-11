// src/components/organisms/CanvasScene/CanvasScene.tsx
"use client";
import { useEffect, useRef } from "react";
import { useCanvasFrames } from "@/hooks/useCanvasFrames";
// BUG FIX: import FRAME_COUNT and FRAME_SPEED from config — not hardcoded here.
// If the user updates config/sections.ts, this component automatically reflects it.
import { FRAME_COUNT, FRAME_SPEED, IMAGE_SCALE } from "@/config/sections";

interface Props {
  onLoadProgress?: (p: number) => void;
}

export default function CanvasScene({ onLoadProgress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const currentFrameRef = useRef(0);
  const bgColorRef = useRef("#0d0d0d");

  const { framesRef, progress, priorityReady } = useCanvasFrames(FRAME_COUNT);

  useEffect(() => {
    onLoadProgress?.(progress);
  }, [progress, onLoadProgress]);

  useEffect(() => {
    if (!priorityReady) return;

    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const sampleBgColor = (img: HTMLImageElement): string => {
      try {
        const tmp = document.createElement("canvas");
        tmp.width = 4;
        tmp.height = 4;
        const t = tmp.getContext("2d");
        if (!t) return "#0d0d0d";
        t.drawImage(img, 0, 0, 4, 4);
        const d = t.getImageData(0, 0, 1, 1).data;
        return `rgb(${d[0]},${d[1]},${d[2]})`;
      } catch {
        return "#0d0d0d";
      }
    };

    const drawFrame = (index: number) => {
      const img = framesRef.current[index];
      if (!img) return;
      const cw = window.innerWidth;
      const ch = window.innerHeight;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const scale = Math.max(cw / iw, ch / ih) * IMAGE_SCALE;
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      if (index % 20 === 0) bgColorRef.current = sampleBgColor(img);
      ctx.fillStyle = bgColorRef.current;
      ctx.fillRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      // BUG FIX: ctx.scale() is cumulative — calling it again on resize
      // stacks transforms. Use setTransform() to set an absolute matrix each time.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawFrame(currentFrameRef.current);
    };

    window.addEventListener("resize", resize);
    resize();

    type STInstance = { kill: () => void };
    let scrollTriggers: STInstance[] = [];

    const setupScrollTriggers = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const scrollEl = document.getElementById("scroll-container");
      if (!scrollEl) return;

      // Frame scrub
      const frameTrigger = ScrollTrigger.create({
        trigger: scrollEl,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const accelerated = Math.min(self.progress * FRAME_SPEED, 1);
          const index = Math.min(
            Math.floor(accelerated * FRAME_COUNT),
            FRAME_COUNT - 1,
          );
          if (index !== currentFrameRef.current) {
            currentFrameRef.current = index;
            requestAnimationFrame(() => drawFrame(index));
          }
        },
      });

      // Circle-wipe hero reveal
      const heroEl = document.getElementById("hero-section");
      const heroTrigger = ScrollTrigger.create({
        trigger: scrollEl,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          // BUG FIX: null-check heroEl before accessing .style
          if (heroEl) {
            heroEl.style.opacity = String(Math.max(0, 1 - p * 15));
          }
          // BUG FIX: use full "at X Y" syntax for Safari compatibility.
          // circle(0%) is ambiguous — Safari requires "at 50% 50%".
          const wipe = Math.min(1, Math.max(0, (p - 0.01) / 0.06));
          wrap.style.clipPath = `circle(${(wipe * 75).toFixed(1)}% at 50% 50%)`;
        },
      });

      scrollTriggers = [frameTrigger, heroTrigger];
    };

    setupScrollTriggers();

    return () => {
      window.removeEventListener("resize", resize);
      // BUG FIX: kill all ScrollTrigger instances created by this component.
      scrollTriggers.forEach((t) => t.kill());
    };
  }, [priorityReady, framesRef]);

  return (
    // BUG FIX: initial clip-path uses full "at 50% 50%" syntax for Safari.
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[1] h-screen w-screen will-change-[clip-path]"
      style={{ clipPath: "circle(0% at 50% 50%)" }}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        aria-hidden="true"
      />
    </div>
  );
}
