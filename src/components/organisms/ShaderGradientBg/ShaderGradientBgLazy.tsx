// src/components/organisms/ShaderGradientBg/ShaderGradientBgLazy.tsx
// Client-side wrapper — defers the WebGL canvas to the browser.
// next/dynamic with ssr:false must live inside a "use client" boundary.
"use client";
import dynamic from "next/dynamic";

const ShaderGradientBg = dynamic(() => import("./ShaderGradientBg"), {
  ssr: false,
  loading: () => null,
});

interface Props {
  className?: string;
}

export default function ShaderGradientBgLazy({ className }: Props) {
  return <ShaderGradientBg className={className} />;
}
