// src/components/organisms/HeroPlayground/HeroPlayground.tsx
// Interactive particle network. Dots drift with subtle velocity, connect
// to near neighbours with thin lines, and react to the cursor (push away)
// and click/tap (shockwave burst). Canvas is sized to its wrapper so the
// hero can place it in whatever slot it wants.
"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface Props {
  className?: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number; // base radius
}

const PARTICLE_COUNT = 70;
const LINK_DISTANCE = 140; // px — neighbours closer than this get a line
const REPEL_RADIUS = 160; // px — cursor push radius
const REPEL_FORCE = 0.55;
const DAMPING = 0.96;
const DRIFT = 0.18;
const BURST_FORCE = 9;

export default function HeroPlayground({ className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    const particles: Particle[] = [];
    const cursor = { x: -9999, y: -9999, active: false };
    let raf = 0;

    const seed = () => {
      particles.length = 0;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * DRIFT,
          vy: (Math.random() - 0.5) * DRIFT,
          r: 1.2 + Math.random() * 1.6,
        });
      }
    };

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (particles.length === 0) seed();
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      cursor.x = e.clientX - rect.left;
      cursor.y = e.clientY - rect.top;
      cursor.active = true;
    };
    const onPointerLeave = () => {
      cursor.active = false;
      cursor.x = -9999;
      cursor.y = -9999;
    };
    const onPointerDown = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      for (const p of particles) {
        const dx = p.x - cx;
        const dy = p.y - cy;
        const dist = Math.hypot(dx, dy) || 1;
        const force = Math.max(0, (REPEL_RADIUS * 2 - dist) / (REPEL_RADIUS * 2));
        p.vx += (dx / dist) * force * BURST_FORCE;
        p.vy += (dy / dist) * force * BURST_FORCE;
      }
    };

    const tick = () => {
      ctx.clearRect(0, 0, w, h);

      // Update positions
      for (const p of particles) {
        // Cursor repulsion
        if (cursor.active) {
          const dx = p.x - cursor.x;
          const dy = p.y - cursor.y;
          const dist = Math.hypot(dx, dy);
          if (dist < REPEL_RADIUS && dist > 0.01) {
            const f = ((REPEL_RADIUS - dist) / REPEL_RADIUS) * REPEL_FORCE;
            p.vx += (dx / dist) * f;
            p.vy += (dy / dist) * f;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= DAMPING;
        p.vy *= DAMPING;

        // Keep a tiny drift so the field never fully stops
        if (Math.abs(p.vx) < 0.02) p.vx += (Math.random() - 0.5) * 0.04;
        if (Math.abs(p.vy) < 0.02) p.vy += (Math.random() - 0.5) * 0.04;

        // Bounce off edges
        if (p.x < 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x > w) {
          p.x = w;
          p.vx *= -1;
        }
        if (p.y < 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y > h) {
          p.y = h;
          p.vy *= -1;
        }
      }

      // Draw links
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DISTANCE) {
            const alpha = (1 - dist / LINK_DISTANCE) * 0.4;
            ctx.strokeStyle = `rgba(200, 169, 126, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const glow = cursor.active
          ? Math.max(
              0,
              1 - Math.hypot(p.x - cursor.x, p.y - cursor.y) / REPEL_RADIUS,
            )
          : 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r + glow * 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 237, 232, ${0.55 + glow * 0.45})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    raf = requestAnimationFrame(tick);

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("pointerdown", onPointerDown);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  return (
    <div ref={wrapRef} className={cn(className)}>
      <canvas
        ref={canvasRef}
        className="block h-full w-full touch-none cursor-crosshair"
        aria-hidden="true"
      />
    </div>
  );
}
