"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useEffect, useMemo, useRef, useState } from "react";

function prng01(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

type Anchor = {
  id: string;
  title: string;
  subtitle: string;
  position: [number, number, number];
  color: string;
};

const anchors: Anchor[] = [
  {
    id: "ai",
    title: "AI Research",
    subtitle: "Deep learning, detection pipelines, and rigorous iteration.",
    position: [-1.25, 0.55, 0.35],
    color: "#E2E8F0",
  },
  {
    id: "iot",
    title: "IoT + Embedded",
    subtitle: "ESP32/Raspberry Pi systems—sensing, telemetry, edge constraints.",
    position: [1.05, 0.35, -0.15],
    color: "#CBD5E1",
  },
  {
    id: "fs",
    title: "Full-Stack",
    subtitle: "APIs, data, and clean UX to communicate complex systems.",
    position: [0.25, -0.95, 0.25],
    color: "#94A3B8",
  },
  {
    id: "community",
    title: "Community",
    subtitle: "Electrogeeks—workshops, mentoring, and build culture.",
    position: [-0.35, 0.1, -0.95],
    color: "#A8B3C7",
  },
];

function MeshScene() {
  const groupRef = useRef<THREE.Group>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [activeAnchorId, setActiveAnchorId] = useState<string | null>(null);
  const { camera } = useThree();

  const tmpWorld = useMemo(() => new THREE.Vector3(), []);
  const tmpNdc = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const { points, segments, anchorLinks } = useMemo(() => {
    const count = 120;
    const spread = 3.2;
    const positions = new Float32Array(count * 3);
    const nodes: THREE.Vector3[] = [];

    for (let i = 0; i < count; i++) {
      const v = new THREE.Vector3(
        (prng01(i + 1.1) - 0.5) * spread,
        (prng01(i + 2.2) - 0.5) * spread,
        (prng01(i + 3.3) - 0.5) * spread
      );
      nodes.push(v);
      positions[i * 3 + 0] = v.x;
      positions[i * 3 + 1] = v.y;
      positions[i * 3 + 2] = v.z;
    }

    const maxDist = 0.92;
    const seg: number[] = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const d = nodes[i].distanceTo(nodes[j]);
        const keep = prng01(i * 999 + j * 97 + 0.5) > 0.28;
        if (d < maxDist && keep) {
          seg.push(nodes[i].x, nodes[i].y, nodes[i].z);
          seg.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }

    // Deterministic links from each anchor to nearby nodes (story map).
    const links: number[] = [];
    const anchorMaxDist = 1.35;
    const perAnchor = 8;
    for (const a of anchors) {
      const av = new THREE.Vector3(a.position[0], a.position[1], a.position[2]);
      const candidates: { idx: number; d: number }[] = [];
      for (let i = 0; i < nodes.length; i++) {
        const d = av.distanceTo(nodes[i]);
        if (d < anchorMaxDist) candidates.push({ idx: i, d });
      }
      candidates.sort((x, y) => x.d - y.d);
      for (const c of candidates.slice(0, perAnchor)) {
        const n = nodes[c.idx];
        links.push(av.x, av.y, av.z);
        links.push(n.x, n.y, n.z);
      }
    }

    const segPositions = new Float32Array(seg);
    const anchorLinkPositions = new Float32Array(links);
    return {
      points: positions,
      segments: segPositions,
      anchorLinks: anchorLinkPositions,
    };
  }, []);

  const pointsGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(points, 3));
    return g;
  }, [points]);

  const linesGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(segments, 3));
    return g;
  }, [segments]);

  const anchorLinesGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(anchorLinks, 3));
    return g;
  }, [anchorLinks]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const g = groupRef.current;
    if (!g) return;
    g.rotation.y = t * 0.12 + mouse.current.x * 0.15;
    g.rotation.x = t * 0.06 + -mouse.current.y * 0.12;

    // Cursor-proximity activation for anchors (works even when canvas is behind layout).
    let bestId: string | null = null;
    let bestDist = Infinity;
    for (const a of anchors) {
      tmpWorld.set(a.position[0], a.position[1], a.position[2]);
      g.localToWorld(tmpWorld);
      tmpNdc.copy(tmpWorld).project(camera);
      const dx = tmpNdc.x - mouse.current.x;
      const dy = tmpNdc.y - mouse.current.y;
      const d = Math.hypot(dx, dy);
      if (d < bestDist) {
        bestDist = d;
        bestId = a.id;
      }
    }

    const threshold = 0.12;
    const next = bestDist < threshold ? bestId : null;
    setActiveAnchorId((cur) => (cur === next ? cur : next));
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={linesGeom}>
        <lineBasicMaterial color={"#94a3b8"} transparent opacity={0.22} />
      </lineSegments>

      <lineSegments geometry={anchorLinesGeom}>
        <lineBasicMaterial color={"#e2e8f0"} transparent opacity={0.14} />
      </lineSegments>

      <points geometry={pointsGeom}>
        <pointsMaterial
          color={"#e2e8f0"}
          size={0.012}
          sizeAttenuation
          transparent
          opacity={0.6}
        />
      </points>

      {anchors.map((a) => (
        <group key={a.id} position={a.position}>
          <mesh>
            <sphereGeometry args={[0.06, 18, 18]} />
            <meshStandardMaterial
              color={a.color}
              emissive={"#93c5fd"}
              emissiveIntensity={activeAnchorId === a.id ? 0.55 : 0.18}
              transparent
              opacity={0.95}
            />
          </mesh>

          {activeAnchorId === a.id ? (
            <Html distanceFactor={10} position={[0.12, 0.12, 0]}>
              <div className="w-64 rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-left backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.05)]">
                <div className="text-sm font-semibold text-slate-50">
                  {a.title}
                </div>
                <div className="mt-1 text-xs leading-5 text-slate-300">
                  {a.subtitle}
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-widest text-slate-400">
                  Move cursor near nodes
                </div>
              </div>
            </Html>
          ) : null}
        </group>
      ))}
    </group>
  );
}

export default function NeuralMeshBackground() {
  return (
    <div className="relative h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.75} />
        <MeshScene />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/10 via-slate-950/55 to-slate-950" />
    </div>
  );
}
