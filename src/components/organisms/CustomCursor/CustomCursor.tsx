// src/components/organisms/CustomCursor/CustomCursor.tsx
// Premium custom cursor — desktop only (skipped on touch devices).
//
// Design:
//   Dot  — 6 px accent circle, follows cursor exactly (no lag).
//   Ring — 28 px accent-bordered circle, follows with lerp (0.1 factor).
//
// Hover state (on <a> / <button>):
//   Ring expands to 44 px and brightens — giving the classic "magnetic" feel.
//
// Cursor::none is applied to <body> in JS so that touch devices keep the
// default cursor. CSS `cursor: none` is intentionally NOT in globals.css.
"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = -999, my = -999;
    let rx = -999, ry = -999;
    let visible = false;
    let hovering = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) {
        // Snap ring to cursor on first appearance — avoids the lerp slide-in
        rx = mx;
        ry = my;
        visible = true;
        dot.style.opacity = "1";
        ring.style.opacity = hovering ? "0.85" : "0.45";
      }
    };

    const onDocLeave = () => {
      visible = false;
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };

    const onInteractEnter = () => {
      hovering = true;
      ring.style.width = "44px";
      ring.style.height = "44px";
      ring.style.opacity = "0.85";
      ring.style.borderColor = "var(--color-accent)";
    };

    const onInteractLeave = () => {
      hovering = false;
      ring.style.width = "28px";
      ring.style.height = "28px";
      ring.style.opacity = visible ? "0.45" : "0";
      ring.style.borderColor = "rgba(200,169,126,0.55)";
    };

    const registerInteractives = () => {
      document.querySelectorAll<Element>("a, button, [role='button']").forEach((el) => {
        el.addEventListener("mouseenter", onInteractEnter);
        el.addEventListener("mouseleave", onInteractLeave);
      });
    };

    const tick = () => {
      if (visible) {
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;

        rx += (mx - rx) * 0.1;
        ry += (my - ry) * 0.1;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onDocLeave);
    document.body.style.cursor = "none";

    registerInteractives();
    // Re-run after dynamic content has mounted (GSAP-revealed sections, etc.)
    const t = setTimeout(registerInteractives, 1200);

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onDocLeave);
      document.body.style.cursor = "";
      document.querySelectorAll<Element>("a, button, [role='button']").forEach((el) => {
        el.removeEventListener("mouseenter", onInteractEnter);
        el.removeEventListener("mouseleave", onInteractLeave);
      });
    };
  }, []);

  return (
    <>
      {/* Dot — sharp instant tracker */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[202] h-[6px] w-[6px] rounded-full opacity-0 will-change-transform"
        style={{ background: "var(--color-accent)" }}
        aria-hidden="true"
      />
      {/* Ring — lagged follower with size/opacity transitions */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[201] rounded-full border opacity-0 will-change-transform"
        style={{
          width: "28px",
          height: "28px",
          borderColor: "rgba(200,169,126,0.55)",
          transition: "width 220ms cubic-bezier(0.22,1,0.36,1), height 220ms cubic-bezier(0.22,1,0.36,1), opacity 200ms, border-color 200ms",
        }}
        aria-hidden="true"
      />
    </>
  );
}
