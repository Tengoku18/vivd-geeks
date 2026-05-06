// src/components/organisms/HeroShells3D/HeroShells3D.tsx
//
// Sydney Opera House–inspired curved shell sculptures.
//
// Geometry — proper spherical-segment math
// ─────────────────────────────────────────
//   Each shell is a wedge cut from a sphere — geometrically how the actual
//   Opera House shells are constructed (every shell in the real building is
//   cut from a single sphere of radius 75.2m). This gives real double
//   curvature: the surface curves both up the spine AND across the width.
//
//   Parametrization: for (u, v) ∈ [0,1]²
//     theta = u * THETA_MAX        // polar sweep, 0 at apex, MAX at base
//     phi   = (v - 0.5) * 2 * PHI_HALF * (sin θ / sin THETA_MAX)
//       (φ-range scales with sin θ — naturally produces a wedge that
//        converges to a point at the apex and widens at the base)
//
//   The result is a tall, double-curved sail with a sharp point at the top
//   and a curved arc at the base — the iconic Opera House silhouette.
//
// Composition
//   1 large central shell + 2 mid-flank shells + 2 deep-back shells. The
//   flanks are rotated outward so the cluster fans like a row of sails.
//
// Materials
//   MeshPhysicalMaterial with iridescence + clearcoat + low metalness ≈
//   the white-tile concrete of the actual roof. Picks up the warm amber
//   key + cool fill + amber rim from behind.
//
// Interaction
//   The whole cluster tilts toward the cursor (lerp factor 0.028 — feels
//   weighty, not jittery). Each shell breathes independently with a sine
//   offset for life. Idle Y-axis sway when the mouse is still.
"use client";
import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/cn";

// ─── Shell Geometry ────────────────────────────────────────────────────────────
function buildShellGeo(uSegs = 64, vSegs = 32): THREE.BufferGeometry {
  const pos: number[] = [];
  const uvs: number[] = [];
  const idx: number[] = [];

  const R         = 1.8;                   // sphere radius
  const THETA_MAX = Math.PI * 0.50;        // 90° sweep — apex to base
  const PHI_HALF  = Math.PI * 0.165;       // ±29.7° azimuthal half-width at base

  const sinTM = Math.sin(THETA_MAX);
  const baseY = R * Math.cos(THETA_MAX);   // y at base (= 0 for THETA_MAX = 90°)

  for (let ui = 0; ui <= uSegs; ui++) {
    const u    = ui / uSegs;
    const th   = u * THETA_MAX;
    const sinT = Math.sin(th);
    const cosT = Math.cos(th);

    for (let vi = 0; vi <= vSegs; vi++) {
      const v    = vi / vSegs;
      // φ-range scales with sin θ → wedge converges to a point at apex
      const dphi = (v - 0.5) * 2 * PHI_HALF * (sinT / sinTM);

      // Spherical → Cartesian, oriented so the convex side faces +Z (camera)
      const x = -R * sinT * Math.sin(dphi);
      const y =  R * cosT - baseY;            // base at y = 0, apex at y = R
      const z =  R * sinT * Math.cos(dphi);   // bulge toward camera

      pos.push(x, y, z);
      uvs.push(u, v);
    }
  }

  for (let ui = 0; ui < uSegs; ui++) {
    for (let vi = 0; vi < vSegs; vi++) {
      const a = ui * (vSegs + 1) + vi;
      const b = a + 1;
      const c = (ui + 1) * (vSegs + 1) + vi;
      const d = c + 1;
      idx.push(a, c, b, b, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setIndex(idx);
  geo.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute("uv",       new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return geo;
}

const SHELL_GEO = buildShellGeo();

// ─── Shell ─────────────────────────────────────────────────────────────────────
interface ShellProps {
  position:    [number, number, number];
  rotation:    [number, number, number];
  scale:       number;
  phaseOffset: number;
  color?:      string;
}

function Shell({ position, rotation, scale, phaseOffset, color = "#e2dccf" }: ShellProps) {
  const ref = useRef<THREE.Mesh>(null);
  const baseY = position[1];

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime;
    ref.current.scale.setScalar(scale * (1 + Math.sin(t * 0.36 + phaseOffset) * 0.012));
    ref.current.position.y = baseY + Math.sin(t * 0.25 + phaseOffset) * 0.04;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation} geometry={SHELL_GEO}>
      <meshPhysicalMaterial
        color={color}
        metalness={0.05}
        roughness={0.22}
        iridescence={0.45}
        iridescenceIOR={1.40}
        clearcoat={0.55}
        clearcoatRoughness={0.10}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Cluster ──────────────────────────────────────────────────────────────────
// Mirrors the Opera House silhouette: one prominent shell forward, two
// flanking shells turned outward, two smaller shells deep behind.
function ShellCluster() {
  const groupRef = useRef<THREE.Group>(null);
  const tiltX    = useRef(0);
  const tiltY    = useRef(0);
  const mouse    = useRef({ tx: 0, ty: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.tx =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.current.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.elapsedTime;
    tiltX.current += (mouse.current.ty * 0.18 - tiltX.current) * 0.028;
    tiltY.current += (mouse.current.tx * 0.18 - tiltY.current) * 0.028;
    groupRef.current.rotation.x = tiltX.current;
    groupRef.current.rotation.y = tiltY.current + Math.sin(t * 0.06) * 0.025;
  });

  return (
    <group ref={groupRef}>
      {/* Front-center — largest shell, faces viewer head-on */}
      <Shell
        position={[-0.15, -0.55,  0.40]}
        rotation={[ 0.00,  0.00,  0.00]}
        scale={1.00}
        phaseOffset={0.0}
      />

      {/* Mid-right — slightly smaller, behind, turned slightly outward */}
      <Shell
        position={[ 0.85, -0.55,  0.05]}
        rotation={[ 0.00, -0.30,  0.00]}
        scale={0.88}
        phaseOffset={1.1}
        color="#dbd4c6"
      />

      {/* Mid-left — mirrored counterpart of mid-right */}
      <Shell
        position={[-1.05, -0.55, -0.05]}
        rotation={[ 0.00,  0.32,  0.00]}
        scale={0.82}
        phaseOffset={2.0}
        color="#dbd4c6"
      />

      {/* Far-back-right — small, deep, well turned outward */}
      <Shell
        position={[ 1.55, -0.60, -0.55]}
        rotation={[ 0.00, -0.55,  0.00]}
        scale={0.62}
        phaseOffset={0.5}
        color="#cec6b7"
      />

      {/* Far-back-left — mirrored counterpart */}
      <Shell
        position={[-1.70, -0.60, -0.50]}
        rotation={[ 0.00,  0.58,  0.00]}
        scale={0.58}
        phaseOffset={1.7}
        color="#cec6b7"
      />
    </group>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
interface Props {
  className?: string;
}

export default function HeroShells3D({ className }: Props) {
  return (
    <div className={cn(className)} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.50, 6.0], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 1.5]}
        style={{ background: "transparent" }}
      >
        {/* Warm ambient — matches the amber shader bleed-through */}
        <ambientLight intensity={0.45} color="#f8efde" />
        {/* Key — top-right, warm amber gold */}
        <directionalLight position={[4, 6, 4]} intensity={1.5} color="#f0c280" />
        {/* Fill — left, cool blue-white */}
        <pointLight position={[-5, 2, 3]} intensity={0.55} color="#a8c0ff" />
        {/* Rim — amber from behind, simulates shader light penetrating the cluster */}
        <pointLight position={[0, 1, -5]} intensity={1.0} color="#c84808" />
        {/* Underglow — bottom warmth, hints at ground reflection */}
        <pointLight position={[0, -2, 2]} intensity={0.30} color="#5a2008" />

        <ShellCluster />
      </Canvas>
    </div>
  );
}
