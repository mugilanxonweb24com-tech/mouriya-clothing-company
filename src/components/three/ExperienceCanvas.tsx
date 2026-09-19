"use client";

import { Canvas } from "@react-three/fiber";
import SceneRoot from "@/components/three/SceneRoot";

export default function ExperienceCanvas() {
  return (
    <div className="experience-canvas" aria-hidden="true">
      <Canvas
        dpr={[1, 1.35]}
        camera={{ position: [0, 0, 7], fov: 42 }}
        gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[-4, 5, 6]} intensity={2.3} />
        <directionalLight position={[4, -1, 2]} intensity={0.5} />
        <SceneRoot />
      </Canvas>
    </div>
  );
}
