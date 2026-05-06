// src/components/organisms/ShaderBackground/ShaderBackgroundLazy.tsx
// Client-side wrapper — defers the WebGL canvas to the browser.
// next/dynamic with ssr:false must live inside a "use client" boundary.
"use client";
import dynamic from "next/dynamic";

const ShaderBackground = dynamic(() => import("./ShaderBackground"), {
  ssr: false,
  loading: () => null,
});

interface Props {
  className?: string;
}

export default function ShaderBackgroundLazy({ className }: Props) {
  return <ShaderBackground className={className} />;
}
