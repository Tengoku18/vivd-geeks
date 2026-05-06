// src/components/organisms/HeroOrb3D/HeroOrb3DLazy.tsx
// Client-side wrapper that defers the Three.js canvas to the browser.
// next/dynamic with ssr:false must live inside a "use client" boundary —
// that's why this thin wrapper exists instead of calling dynamic() directly
// from the HeroSection RSC.
"use client";
import dynamic from "next/dynamic";

const HeroOrb3D = dynamic(() => import("./HeroOrb3D"), {
  ssr: false,
  loading: () => null,
});

interface Props {
  className?: string;
}

export default function HeroOrb3DLazy({ className }: Props) {
  return <HeroOrb3D className={className} />;
}
