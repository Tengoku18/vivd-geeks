// src/components/organisms/ShaderGradientBg/ShaderGradientBg.tsx
//
// Animated WebGL gradient backdrop using @shadergradient/react.
// Replaces the previous raymarched metaball field. Renders a waterPlane
// shader with the brand palette (deep navy + heritage red) as a slow,
// continuously animating motion video behind the hero copy.
"use client";

import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { cn } from "@/lib/cn";

interface Props {
  className?: string;
}

export default function ShaderGradientBg({ className }: Props) {
  return (
    <div className={cn(className)} aria-hidden="true">
      <ShaderGradientCanvas
        style={{ width: "100%", height: "100%" }}
        pointerEvents="none"
        pixelDensity={1}
        fov={45}
      >
        <ShaderGradient
          animate="on"
          brightness={1.2}
          cAzimuthAngle={170}
          cDistance={4.4}
          cPolarAngle={70}
          cameraZoom={1}
          color1="#0B1D35"
          color2="#7b1113"
          color3="#000000"
          envPreset="city"
          grain="off"
          lightType="3d"
          positionX={0}
          positionY={0.9}
          positionZ={-0.3}
          range="enabled"
          rangeEnd={40}
          rangeStart={0}
          reflection={0.1}
          rotationX={45}
          rotationY={0}
          rotationZ={0}
          shader="defaults"
          type="waterPlane"
          uAmplitude={0}
          uDensity={1.2}
          uFrequency={0}
          uSpeed={0.2}
          uStrength={3.4}
          uTime={0}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    </div>
  );
}
