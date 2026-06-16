"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useRef } from "react";

function Spinner() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const m = meshRef.current;
    if (!m) return;
    m.rotation.x = t * 0.6;
    m.rotation.y = t * 0.8;
  });
  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.05, 1]} />
      <meshStandardMaterial
        color={"#94a3b8"}
        wireframe
        transparent
        opacity={0.55}
      />
    </mesh>
  );
}

export default function HardwareModelPlaceholder() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3.2], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 3, 3]} intensity={0.6} />
      <Spinner />
    </Canvas>
  );
}
