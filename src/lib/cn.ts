// src/lib/cn.ts
// Minimal class name joiner — no external dependency.
// Accepts strings, undefined, false, or nested arrays; flattens and trims.

export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[];

export function cn(...args: ClassValue[]): string {
  const out: string[] = [];
  const walk = (val: ClassValue) => {
    if (!val && val !== 0) return;
    if (typeof val === "string" || typeof val === "number") {
      out.push(String(val));
      return;
    }
    if (Array.isArray(val)) {
      for (const v of val) walk(v);
    }
  };
  for (const a of args) walk(a);
  return out.join(" ");
}
