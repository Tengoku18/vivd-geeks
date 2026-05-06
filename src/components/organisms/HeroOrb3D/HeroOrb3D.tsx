// src/components/organisms/HeroOrb3D/HeroOrb3D.tsx
// Three.js wireframe orb that sits behind the particle network in the hero.
//
// Scene:
//   – Outer icosahedron wireframe  (accent #c8a97e, subdivision-1 = 20 faces)
//   – Inner icosahedron wireframe  (slightly smaller, counter-rotates, 60% opacity)
//   – Floating particle cloud      (200 small dots scattered in a sphere volume)
//
// Interaction:
//   – Continuous slow rotation (outer and inner at different speeds)
//   – Mouse tilt — camera subtly tracks cursor position
//   – Breathing scale — gentle sine-wave pulse on the outer mesh
//
// Background is transparent (gl alpha:true) so the dark hero shows through.
// The component is loaded via next/dynamic with ssr:false because Three.js
// requires browser globals (WebGLRenderer) that don't exist on the server.
"use client";
import { useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/cn";

// ─── Particle cloud ────────────────────────────────────────────────────────
// 200 points scattered inside a sphere of radius 3.2.
// Rendered as a single Points object for maximum performance.
function ParticleCloud() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 200;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Uniform random distribution inside a sphere (rejection sampling)
      let x, y, z;
      do {
        x = (Math.random() - 0.5) * 7;
        y = (Math.random() - 0.5) * 7;
        z = (Math.random() - 0.5) * 7;
      } while (x * x + y * y + z * z > 12.25); // radius 3.5
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.04;
    ref.current.rotation.x = t * 0.025;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#c8a97e"
        size={0.035}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

// ─── Wireframe meshes ──────────────────────────────────────────────────────
function WireframeMeshes() {
  const outerRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);

  // Track base rotation separately from mouse tilt so they don't fight.
  const baseX = useRef(0);
  const baseY = useRef(0);
  const tiltX = useRef(0);
  const tiltY = useRef(0);
  const mouse = useRef({ tx: 0, ty: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.current.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((state, delta) => {
    if (!outerRef.current || !innerRef.current) return;

    // Accumulate base rotation
    baseX.current += delta * 0.07;
    baseY.current += delta * 0.11;

    // Lerp tilt toward mouse position
    tiltX.current += (mouse.current.ty * 0.25 - tiltX.current) * 0.035;
    tiltY.current += (mouse.current.tx * 0.25 - tiltY.current) * 0.035;

    // Outer mesh
    outerRef.current.rotation.x = baseX.current + tiltX.current;
    outerRef.current.rotation.y = baseY.current + tiltY.current;

    // Breathing pulse
    const breathe = 1 + Math.sin(state.clock.elapsedTime * 0.55) * 0.025;
    outerRef.current.scale.setScalar(breathe);

    // Inner mesh counter-rotates
    innerRef.current.rotation.x = -(baseX.current * 0.7) + tiltX.current * 0.5;
    innerRef.current.rotation.y = -(baseY.current * 0.7) + tiltY.current * 0.5;
  });

  return (
    <>
      {/* Outer icosahedron — prominent accent wireframe */}
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[1.85, 1]} />
        <meshBasicMaterial color="#c8a97e" wireframe />
      </mesh>

      {/* Inner icosahedron — ghosted, counter-rotates for depth */}
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[1.1, 1]} />
        <meshBasicMaterial color="#c8a97e" wireframe transparent opacity={0.35} />
      </mesh>
    </>
  );
}

// ─── Camera rig — subtle drift toward cursor ───────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  const mouse = useRef({ tx: 0, ty: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.tx = (e.clientX / window.innerWidth - 0.5) * 0.6;
      mouse.current.ty = -(e.clientY / window.innerHeight - 0.5) * 0.4;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    camera.position.x += (mouse.current.tx - camera.position.x) * 0.025;
    camera.position.y += (mouse.current.ty - camera.position.y) * 0.025;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// ─── Public component ──────────────────────────────────────────────────────
interface Props {
  className?: string;
}

export default function HeroOrb3D({ className }: Props) {
  return (
    <div className={cn(className)} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 42 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        <CameraRig />
        <WireframeMeshes />
        <ParticleCloud />
      </Canvas>
    </div>
  );
}
