// src/hooks/useCanvasFrames.ts
"use client";
import { useEffect, useRef, useState } from "react";

const PRIORITY_FRAMES = 10;

export function useCanvasFrames(frameCount: number) {
  const framesRef = useRef<HTMLImageElement[]>(new Array(frameCount));
  const [loadedCount, setLoadedCount] = useState(0);
  const [priorityReady, setPriorityReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadFrame = (i: number): Promise<void> =>
      new Promise((resolve) => {
        const img = new Image();
        img.src = `/frames/frame_${String(i + 1).padStart(4, "0")}.webp`;
        img.onload = () => {
          if (!mounted) {
            resolve();
            return;
          }
          framesRef.current[i] = img;
          // BUG FIX: use functional update to avoid stale closure on count.
          setLoadedCount((prev) => {
            const next = prev + 1;
            if (next === PRIORITY_FRAMES) setPriorityReady(true);
            return next;
          });
          resolve();
        };
        img.onerror = () => resolve(); // skip broken frames gracefully
      });

    // Phase 1: first N frames immediately
    Promise.all(
      Array.from({ length: Math.min(PRIORITY_FRAMES, frameCount) }, (_, i) =>
        loadFrame(i),
      ),
    ).then(() =>
      // Phase 2: rest in background
      Promise.all(
        Array.from(
          { length: Math.max(0, frameCount - PRIORITY_FRAMES) },
          (_, i) => loadFrame(i + PRIORITY_FRAMES),
        ),
      ),
    );

    return () => {
      mounted = false;
    };
  }, [frameCount]);

  return {
    framesRef,
    progress: loadedCount / Math.max(frameCount, 1),
    priorityReady,
    allReady: loadedCount >= frameCount,
  };
}
