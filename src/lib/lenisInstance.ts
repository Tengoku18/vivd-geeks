// src/lib/lenisInstance.ts
// Module-level singleton so non-hook code (click handlers, scroll utilities)
// can reach the active Lenis without prop-drilling or context. `useLenis`
// registers the instance on mount and clears it on unmount.

import type Lenis from "lenis";

let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}
