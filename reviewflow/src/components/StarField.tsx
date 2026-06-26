"use client";

/**
 * StarField — fixed, full-screen 3D star background for the homepage hero.
 *
 * Pure `@react-three/fiber` + `three` (no drei). ~1200 glowing gold + white
 * star sprites floating in 3D depth with a slow auto-rotation and subtle
 * mouse/scroll parallax, drawn with additive blending.
 *
 * Designed to be lazy-loaded (next/dynamic, ssr:false) and cheap on mobile:
 *   - pixel ratio capped at 2
 *   - star count drops to 500 under 820px viewport width
 *   - rotation + parallax freeze when prefers-reduced-motion is set
 *   - z-index 0 + pointer-events:none so it sits behind content, never eating clicks
 *
 * No image asset is required — the glow sprite is painted in a <canvas> at runtime.
 */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const GOLD = new THREE.Color("#ffc24b");
const GOLD_SOFT = new THREE.Color("#ffd884");
const WHITE = new THREE.Color("#f4f3ff");

/** Small deterministic PRNG so star generation is pure (stable across renders). */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/** Paint a soft radial glow once and reuse it as an additive point sprite. */
function makeGlowTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.25, "rgba(255,255,255,0.85)");
    g.addColorStop(0.5, "rgba(255,255,255,0.35)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function Stars({ count, reduced }: { count: number; reduced: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { size } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const scrollY = useRef(0);

  const glow = useMemo(() => makeGlowTexture(), []);
  useEffect(() => () => glow.dispose(), [glow]);

  const { positions, colors, scales } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const tmp = new THREE.Color();
    const rand = mulberry32(0x5f3759 + count);
    for (let i = 0; i < count; i++) {
      // Distribute in a wide, deep slab so there's a real sense of depth.
      positions[i * 3 + 0] = (rand() - 0.5) * 60;
      positions[i * 3 + 1] = (rand() - 0.5) * 36;
      positions[i * 3 + 2] = (rand() - 0.5) * 40 - 8;

      // Mostly gold/gold-soft, with a sprinkle of bright white stars.
      const r = rand();
      if (r < 0.55) tmp.copy(GOLD);
      else if (r < 0.85) tmp.copy(GOLD_SOFT);
      else tmp.copy(WHITE);
      colors[i * 3 + 0] = tmp.r;
      colors[i * 3 + 1] = tmp.g;
      colors[i * 3 + 2] = tmp.b;

      scales[i] = 0.5 + rand() * 1.6;
    }
    return { positions, colors, scales };
  }, [count]);

  useEffect(() => {
    if (reduced) return;
    const onPointer = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const onScroll = () => {
      scrollY.current = window.scrollY;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
    };
  }, [reduced]);

  useFrame((_, delta) => {
    const pts = pointsRef.current;
    if (!pts) return;
    if (reduced) return;
    // Slow auto-rotation.
    pts.rotation.y += delta * 0.03;
    pts.rotation.x += delta * 0.008;
    // Eased parallax toward the cursor + a touch of scroll drift.
    const targetX = pointer.current.y * 0.12;
    const targetY = pointer.current.x * 0.2;
    pts.rotation.x += (targetX - pts.rotation.x % (Math.PI * 2)) * 0.0008;
    pts.position.x += (targetY * 2 - pts.position.x) * 0.04;
    pts.position.y += (-scrollY.current / size.height) * 1.2 - pts.position.y;
    pts.position.y *= 0.96;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-scale" args={[scales, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.35}
        sizeAttenuation
        map={glow}
        vertexColors
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.9}
      />
    </points>
  );
}

export default function StarField() {
  const reduced = usePrefersReducedMotion();
  const [count, setCount] = useState(1200);

  useEffect(() => {
    const compute = () => setCount(window.innerWidth < 820 ? 500 : 1200);
    compute();
    window.addEventListener("resize", compute, { passive: true });
    return () => window.removeEventListener("resize", compute);
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        camera={{ position: [0, 0, 18], fov: 70 }}
        frameloop={reduced ? "demand" : "always"}
      >
        <Stars count={count} reduced={reduced} />
      </Canvas>
    </div>
  );
}
