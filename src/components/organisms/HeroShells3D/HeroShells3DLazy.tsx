// src/components/organisms/HeroShells3D/HeroShells3DLazy.tsx
// "use client" wrapper — next/dynamic ssr:false must live in a client boundary.
"use client";
import dynamic from "next/dynamic";

const HeroShells3D = dynamic(() => import("./HeroShells3D"), {
  ssr: false,
  loading: () => null,
});

interface Props {
  className?: string;
}

export default function HeroShells3DLazy({ className }: Props) {
  return <HeroShells3D className={className} />;
}
