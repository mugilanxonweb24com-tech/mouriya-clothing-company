"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  CatmullRomCurve3,
  CylinderGeometry,
  DoubleSide,
  ExtrudeGeometry,
  Group,
  MathUtils,
  Mesh,
  Path,
  PlaneGeometry,
  Shape,
  TubeGeometry,
  Vector3,
} from "three";
import { manufacturingProgress } from "@/lib/manufacturingProgress";

type MaterialMesh = Mesh & { material: { opacity: number } };

const ORANGE = "#ff5a1f";
const TEXTILE = "#c9c0ae";
const STEEL = "#717686";

function visibility(progress: number, start: number, end: number) {
  return MathUtils.smoothstep(progress, start, Math.min(start + 0.06, end)) * (1 - MathUtils.smoothstep(progress, Math.max(start, end - 0.08), end));
}

export default function ManufacturingScene() {
  const root = useRef<Group>(null);
  const thread = useRef<MaterialMesh>(null);
  const ribbon = useRef<MaterialMesh>(null);
  const knitting = useRef<Group>(null);
  const dyeing = useRef<Group>(null);
  const rollers = useRef<Group>(null);
  const printing = useRef<Group>(null);
  const embroidery = useRef<Group>(null);
  const finished = useRef<MaterialMesh>(null);
  const threadGeometry = useMemo(() => {
    const curve = new CatmullRomCurve3([
      new Vector3(-7, -0.4, 0),
      new Vector3(-6.2, 0.9, 0.15),
      new Vector3(-5.3, -0.15, 0),
      new Vector3(-4.5, 0.5, 0.1),
    ]);
    return new TubeGeometry(curve, 48, 0.045, 8, false);
  }, []);
  const shirtGeometry = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-0.9, 1.8);
    shape.lineTo(-1.6, 1.45);
    shape.lineTo(-2.2, 0.7);
    shape.lineTo(-1.6, 0.05);
    shape.lineTo(-1.1, 0.38);
    shape.lineTo(-1.05, -1.8);
    shape.lineTo(1.05, -1.8);
    shape.lineTo(1.1, 0.38);
    shape.lineTo(1.6, 0.05);
    shape.lineTo(2.2, 0.7);
    shape.lineTo(1.6, 1.45);
    shape.lineTo(0.9, 1.8);
    shape.lineTo(0.48, 1.48);
    shape.lineTo(-0.48, 1.48);
    shape.closePath();
    const neckline = new Path();
    neckline.absellipse(0, 1.52, 0.46, 0.22, 0, Math.PI * 2, false, 0);
    shape.holes.push(neckline);
    return new ExtrudeGeometry(shape, { depth: 0.12, bevelEnabled: false, curveSegments: 8 });
  }, []);
  const ribbonGeometry = useMemo(() => new PlaneGeometry(2.5, 1.05, 8, 4), []);
  const rollerGeometry = useMemo(() => new CylinderGeometry(0.5, 0.5, 2.4, 16), []);
  const machineGeometry = useMemo(() => ({
    knittingDrum: new CylinderGeometry(0.8, 0.8, 0.35, 24),
    knittingNeedle: new CylinderGeometry(0.06, 0.06, 1.7, 8),
    dyeChamber: new CylinderGeometry(1.15, 1.15, 1.5, 24),
    dyeRibbon: new PlaneGeometry(1.8, 0.04),
    printBed: new PlaneGeometry(2.1, 1.35),
    printMark: new PlaneGeometry(0.55, 0.55),
    embroideryNeedle: new CylinderGeometry(0.04, 0.04, 1.5, 8),
    embroiderySurface: new PlaneGeometry(1.5, 0.95),
    stitch: new PlaneGeometry(0.6, 0.06),
  }), []);

  useFrame((state, delta) => {
    if (!root.current) return;

    const progress = manufacturingProgress.value;
    const active = manufacturingProgress.active;
    const isMobile = state.size.width < 760;
    const sceneOpacity = active ? 1 : 0;
    const cameraX = MathUtils.lerp(-4.4, 4.4, progress);
    const cameraY = MathUtils.lerp(0.2, isMobile ? 0.45 : 0.8, progress);
    const cameraZ = isMobile ? 7.8 : 7.2;

    if (active) {
      state.camera.position.x = MathUtils.damp(state.camera.position.x, cameraX, 3.5, delta);
      state.camera.position.y = MathUtils.damp(state.camera.position.y, cameraY, 3.5, delta);
      state.camera.position.z = MathUtils.damp(state.camera.position.z, cameraZ, 3.5, delta);
      state.camera.lookAt(cameraX + 0.3, 0, 0);
    }
    root.current.position.y = MathUtils.damp(root.current.position.y, active ? 0 : -20, 4, delta);
    root.current.scale.setScalar(MathUtils.damp(root.current.scale.x, active ? (isMobile ? 1.1 : 1.45) : 1, 4, delta));

    const meshes = [thread.current, ribbon.current, finished.current];
    const groups = [knitting.current, dyeing.current, rollers.current, printing.current, embroidery.current];
    const opacities = [
      visibility(progress, 0, 0.16),
      visibility(progress, 0.1, 0.36),
      visibility(progress, 0.1, 0.3),
      visibility(progress, 0.24, 0.44),
      visibility(progress, 0.38, 0.58),
      visibility(progress, 0.52, 0.7),
      visibility(progress, 0.66, 0.84),
      visibility(progress, 0.78, 0.99),
    ];

    meshes.forEach((mesh, index) => {
      if (mesh) mesh.material.opacity = MathUtils.damp(mesh.material.opacity, opacities[index] * sceneOpacity, 6, delta);
    });
    groups.forEach((group, index) => {
      if (!group) return;
      group.traverse((child) => {
        const childMesh = child as MaterialMesh;
        if ("material" in childMesh && childMesh.material && "opacity" in childMesh.material) {
          childMesh.material.opacity = MathUtils.damp(childMesh.material.opacity, opacities[index + 2] * sceneOpacity, 6, delta);
        }
      });
    });

    if (knitting.current) knitting.current.rotation.y += delta * 0.35;
    if (rollers.current) rollers.current.rotation.z += delta * 0.7;
    if (printing.current) printing.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.08;
    if (embroidery.current) embroidery.current.position.y = Math.sin(state.clock.elapsedTime * 4) * 0.1;
    if (finished.current) {
      finished.current.rotation.y = MathUtils.damp(finished.current.rotation.y, Math.sin(progress * Math.PI) * 0.08, 3, delta);
      finished.current.position.y = MathUtils.damp(finished.current.position.y, 0.1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.04, 3, delta);
    }
  });

  return (
    <group ref={root}>
      <mesh ref={thread} geometry={threadGeometry} position={[-0.1, 0, 0]}>
        <meshStandardMaterial color={ORANGE} roughness={0.8} metalness={0.05} transparent opacity={0} />
      </mesh>
      <mesh ref={ribbon} geometry={ribbonGeometry} position={[-3.25, 0, 0]} rotation={[0.1, -0.1, 0]}>
        <meshStandardMaterial color={TEXTILE} roughness={0.94} side={DoubleSide} transparent opacity={0} />
      </mesh>
      <group ref={knitting} position={[-3.9, 0, 0]}>
        <mesh geometry={machineGeometry.knittingDrum} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={STEEL} roughness={0.72} transparent opacity={0} />
        </mesh>
        <mesh position={[0, -1.05, 0]} geometry={machineGeometry.knittingNeedle}>
          <meshStandardMaterial color={ORANGE} roughness={0.8} transparent opacity={0} />
        </mesh>
      </group>
      <group ref={dyeing} position={[-1.7, 0, 0]}>
        <mesh geometry={machineGeometry.dyeChamber} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color={ORANGE} roughness={0.88} transparent opacity={0} />
        </mesh>
        <mesh position={[0, 0.85, 0]} geometry={machineGeometry.dyeRibbon}>
          <meshBasicMaterial color={TEXTILE} transparent opacity={0} />
        </mesh>
      </group>
      <group ref={rollers} position={[0, 0, 0]}>
        <mesh geometry={rollerGeometry} rotation={[0, 0, Math.PI / 2]} position={[0, 0.55, 0]}>
          <meshStandardMaterial color={STEEL} roughness={0.65} transparent opacity={0} />
        </mesh>
        <mesh geometry={rollerGeometry} rotation={[0, 0, Math.PI / 2]} position={[0, -0.55, 0]}>
          <meshStandardMaterial color={STEEL} roughness={0.65} transparent opacity={0} />
        </mesh>
        <mesh geometry={ribbonGeometry} position={[0, 0, 0.12]} scale={[1.1, 0.65, 1]}>
          <meshStandardMaterial color={TEXTILE} roughness={0.94} side={DoubleSide} transparent opacity={0} />
        </mesh>
      </group>
      <group ref={printing} position={[2, 0, 0]}>
        <mesh geometry={machineGeometry.printBed}>
          <meshStandardMaterial color={TEXTILE} roughness={0.94} side={DoubleSide} transparent opacity={0} />
        </mesh>
        <mesh position={[0, 0.35, 0.08]} geometry={machineGeometry.printMark}>
          <meshBasicMaterial color={ORANGE} transparent opacity={0} />
        </mesh>
      </group>
      <group ref={embroidery} position={[4, 0, 0]}>
        <mesh geometry={machineGeometry.embroideryNeedle} position={[0, 0.8, 0]}>
          <meshStandardMaterial color={ORANGE} roughness={0.8} transparent opacity={0} />
        </mesh>
        <mesh geometry={machineGeometry.embroiderySurface}>
          <meshStandardMaterial color={TEXTILE} roughness={0.94} side={DoubleSide} transparent opacity={0} />
        </mesh>
        <mesh geometry={machineGeometry.stitch} position={[0, 0.05, 0.08]}>
          <meshBasicMaterial color={ORANGE} transparent opacity={0} />
        </mesh>
      </group>
      <mesh ref={finished} geometry={shirtGeometry} position={[6.25, 0, 0]} scale={0.62}>
        <meshStandardMaterial color={TEXTILE} roughness={0.94} side={DoubleSide} transparent opacity={0} />
      </mesh>
    </group>
  );
}
