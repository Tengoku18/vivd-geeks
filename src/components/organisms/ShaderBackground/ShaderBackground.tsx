// src/components/organisms/ShaderBackground/ShaderBackground.tsx
//
// Raymarched 3D metaball field — true 3D depth, not faked.
//
// Technique
// ─────────
//   Each pixel casts a ray into a 3D scene of orbiting spheres blended
//   with smooth-min (smin) into a single organic blob field. The ray
//   marches forward in adaptive steps until it hits the surface, then
//   we compute the surface normal from the SDF gradient and shade with
//   key/fill/rim lights using the brand palette.
//
//   The shapes feel genuinely 3D because they are: they catch light on
//   one side, fall into shadow on the other, and silhouettes glow with
//   a fresnel rim. Three blobs orbit on independent timing — they merge
//   and split as they pass, never repeating.
//
// Background
//   Cheap 3-octave FBM gives the void some organic warmth without the
//   cost of the previous 6-octave double-warped FBM.
//
// Performance
//   48 raymarch iterations × 3 sphere SDFs ≈ 150 sphere evals per pixel.
//   dpr=1, antialias=false. Hidden on mobile (md:block on parent).
//   prefers-reduced-motion freezes time at a "good frame".
"use client";
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { cn } from "@/lib/cn";

// ─── Shaders ──────────────────────────────────────────────────────────────────

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uAspect;
  uniform bool  uPaused;

  varying vec2 vUv;

  // ── Cheap 2D noise for background warmth ───────────────────────────────────
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453);
  }
  float gnoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash2(i + vec2(0.0, 0.0)), f - vec2(0.0, 0.0)),
          dot(hash2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm3(vec2 p) {
    float v = 0.0;
    float a = 0.55;
    mat2 m = mat2(0.80, -0.60, 0.60, 0.80);
    for (int i = 0; i < 3; i++) {
      v += a * gnoise(p);
      p = m * p * 2.05;
      a *= 0.5;
    }
    return v;
  }

  // ── 3D SDF primitives ──────────────────────────────────────────────────────
  float sdSphere(vec3 p, float r) {
    return length(p) - r;
  }
  // Smooth-min — quadratic, blends shapes organically
  float smin(float a, float b, float k) {
    float h = max(k - abs(a - b), 0.0) / k;
    return min(a, b) - h * h * k * 0.25;
  }

  // ── Scene SDF ──────────────────────────────────────────────────────────────
  // Three orbiting metaballs blended with smooth-min. Each blob has its own
  // independent orbital rhythm so the system never falls into a static loop.
  // The whole system is offset to +X so the spheres sit on the right side of
  // the viewport (away from the hero copy).
  float scene(vec3 p, float t) {
    p.x -= 1.10; // shift orbit centre to the right of the viewport

    vec3 p1 = vec3(
      sin(t * 0.30) * 1.05 + cos(t * 1.10) * 0.15,
      cos(t * 0.42) * 0.85,
      sin(t * 0.55) * 0.95
    );
    vec3 p2 = vec3(
      cos(t * 0.38 + 1.0) * 0.95,
      sin(t * 0.52 + 2.0) * 1.05,
      cos(t * 0.31 + 1.5) * 1.30
    );
    vec3 p3 = vec3(
      sin(t * 0.45 + 3.0) * 1.00,
      cos(t * 0.34 + 2.5) * 0.65,
      sin(t * 0.49 + 0.5) * 1.10
    );

    float d = sdSphere(p - p1, 0.72);
    d = smin(d, sdSphere(p - p2, 0.62), 0.85);
    d = smin(d, sdSphere(p - p3, 0.55), 0.85);
    return d;
  }

  // Tetrahedron technique — 4 SDF samples for a normal
  vec3 calcNormal(vec3 p, float t) {
    const vec2 k = vec2(1.0, -1.0);
    const float h = 0.0015;
    return normalize(
      k.xyy * scene(p + k.xyy * h, t) +
      k.yyx * scene(p + k.yyx * h, t) +
      k.yxy * scene(p + k.yxy * h, t) +
      k.xxx * scene(p + k.xxx * h, t)
    );
  }

  // ── Main ────────────────────────────────────────────────────────────────────
  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.x *= uAspect;

    float t = uPaused ? 7.5 : uTime;

    // ── Camera + ray ─────────────────────────────────────────────────────────
    vec3 ro = vec3(0.0, 0.15, 4.8);
    vec3 rd = normalize(vec3(uv * 0.85, -1.5));

    // ── Raymarch ─────────────────────────────────────────────────────────────
    float dist = 0.0;
    float minD = 1e10;
    bool  hit  = false;
    vec3  hitP = vec3(0.0);

    for (int i = 0; i < 48; i++) {
      vec3 p = ro + rd * dist;
      float d = scene(p, t);
      minD = min(minD, d);
      if (d < 0.002) { hit = true; hitP = p; break; }
      if (dist > 18.0) break;
      dist += d * 0.85; // slightly under-step for stability around smooth blends
    }

    // ── Background — slow FBM modulating a near-black gradient ───────────────
    vec2 bgUv = vUv - 0.5;
    bgUv.x *= uAspect;
    float bgN = fbm3(bgUv * 1.6 + t * 0.025) * 0.5 + 0.5;
    vec3  bgTop = vec3(0.014, 0.022, 0.040);
    vec3  bgBot = vec3(0.004, 0.008, 0.018);
    vec3  bg    = mix(bgBot, bgTop, vUv.y);
    bg += bgN * vec3(0.012, 0.020, 0.038); // subtle navy wash

    vec3 col;
    if (hit) {
      vec3 n = calcNormal(hitP, t);

      vec3 keyDir  = normalize(vec3( 0.55, 0.75, 0.45));
      vec3 fillDir = normalize(vec3(-0.70, 0.20, 0.30));
      vec3 viewDir = -rd;

      float diff = max(dot(n, keyDir),  0.0);
      float fill = max(dot(n, fillDir), 0.0) * 0.35;
      vec3  halfV = normalize(keyDir + viewDir);
      float spec = pow(max(dot(n, halfV), 0.0), 24.0) * 0.85;
      float fres = pow(1.0 - max(dot(n, viewDir), 0.0), 2.6);

      // ── Brand palette ──────────────────────────────────────────────────────
      //   Primary Navy (Deep Obsidian):   #0B1D35
      //   Accent Maroon (Heritage Red):    #7B1113
      //   Neutral Slate (Architect Grey): #F4F7FA
      vec3 maroon  = vec3(0.482, 0.067, 0.075);   // #7B1113 base
      vec3 maroonH = vec3(0.880, 0.180, 0.200);   // amped lit maroon
      vec3 navy    = vec3(0.043, 0.114, 0.208);   // #0B1D35
      vec3 deepN   = vec3(0.012, 0.025, 0.055);   // deepest shadow
      vec3 slate   = vec3(0.957, 0.969, 0.980);   // #F4F7FA

      col  = mix(deepN, navy, diff * 0.65 + 0.35);
      col  = mix(col, maroon,  smoothstep(0.10, 0.55, diff));
      col  = mix(col, maroonH, pow(diff, 2.4));
      col += spec * slate * 0.95;        // bright slate specular
      col += fres * slate * 0.35;        // slate fresnel rim
      col += fill * navy  * 1.30;        // navy bounce in shadows
    } else {
      col = bg;
      // Volumetric-feeling glow halo where rays passed close to the surface
      float glow = exp(-minD * 1.8);
      col += glow * vec3(0.42, 0.08, 0.10); // maroon halo
    }

    // Vignette
    float vd   = length(uv);
    float vign = 1.0 - smoothstep(0.55, 1.45, vd);
    col *= mix(0.55, 1.0, vign);

    // Subtle film grain
    float grain = (fract(sin(dot(vUv * 220.0 + t * 0.5, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.014;
    col += grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

// ─── GradientMesh ─────────────────────────────────────────────────────────────
function GradientMesh({ paused }: { paused: boolean }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTime:   { value: 0 },
      uAspect: { value: 1.778 },
      uPaused: { value: false },
    }),
    [],
  );

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;
    mat.uniforms.uTime.value   = state.clock.elapsedTime;
    mat.uniforms.uAspect.value = state.size.width / state.size.height;
    mat.uniforms.uPaused.value = paused;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={VERT}
        fragmentShader={FRAG}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────
interface Props {
  className?: string;
}

export default function ShaderBackground({ className }: Props) {
  const pausedRef = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    pausedRef.current = mq.matches;
    const handler = (e: MediaQueryListEvent) => { pausedRef.current = e.matches; };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <div className={cn(className)} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 60 }}
        gl={{ antialias: false, alpha: false }}
        dpr={1}
        style={{ background: "#07070a" }}
      >
        <GradientMesh paused={pausedRef.current} />
      </Canvas>
    </div>
  );
}
