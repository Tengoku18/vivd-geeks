// src/components/atoms/Typewriter/Typewriter.tsx
// Types phrases one character at a time, holds, deletes, then advances to
// the next phrase in a continuous loop. Renders a blinking cursor.
"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  phrases: string[];
  typeSpeed?: number;   // ms per character when typing
  deleteSpeed?: number; // ms per character when deleting
  holdDelay?: number;   // ms to pause at full phrase
  emptyDelay?: number;  // ms to pause at empty before next phrase
}

export function Typewriter({
  phrases,
  typeSpeed = 70,
  deleteSpeed = 40,
  holdDelay = 2000,
  emptyDelay = 500,
}: Props) {
  const [displayed, setDisplayed] = useState("");
  const phraseIdx = useRef(0);
  const charIdx = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    if (phrases.length === 0) return;

    const step = () => {
      const current = phrases[phraseIdx.current];

      if (!deleting.current) {
        // Typing forward
        charIdx.current++;
        setDisplayed(current.slice(0, charIdx.current));

        if (charIdx.current >= current.length) {
          // Finished typing — hold, then start deleting
          deleting.current = true;
          return holdDelay;
        }
        return typeSpeed;
      } else {
        // Deleting backward
        charIdx.current--;
        setDisplayed(current.slice(0, charIdx.current));

        if (charIdx.current <= 0) {
          // Fully deleted — advance phrase
          deleting.current = false;
          phraseIdx.current = (phraseIdx.current + 1) % phrases.length;
          return emptyDelay;
        }
        return deleteSpeed;
      }
    };

    let timer: ReturnType<typeof setTimeout>;
    const loop = () => {
      const delay = step();
      timer = setTimeout(loop, delay);
    };

    // Kick off after a short initial delay
    timer = setTimeout(loop, 500);
    return () => clearTimeout(timer);
  }, [phrases, typeSpeed, deleteSpeed, holdDelay, emptyDelay]);

  return (
    <span className="inline">
      {displayed}
      <span className="ml-[2px] inline-block w-[3px] animate-[blink_1.06s_step-end_infinite] bg-accent align-middle"
        style={{ height: "0.85em" }}
        aria-hidden="true"
      />
    </span>
  );
}
