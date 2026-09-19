"use client";

import { useMemo, useRef } from "react";
import { DoubleSide, ExtrudeGeometry, MathUtils, Mesh, PlaneGeometry, Shape, Path } from "three";
import { useFrame } from "@react-three/fiber";
import { heroProgress } from "@/lib/heroProgress";
import ManufacturingScene from "@/components/three/ManufacturingScene";

export default function SceneRoot() {
  const plane = useRef<Mesh>(null);
  const shirt = useRef<Mesh>(null);
  const geometry = useMemo(() => {
    const textile = new PlaneGeometry(7.4, 5.2, 40, 30);
    const positions = textile.attributes.position;

    for (let index = 0; index < positions.count; index += 1) {
      const x = positions.getX(index);
      const y = positions.getY(index);
      const fold = Math.sin(x * 1.35 + y * 0.7) * 0.16;
      const secondaryFold = Math.cos(y * 2.2 - x * 0.45) * 0.08;
      positions.setZ(index, fold + secondaryFold + Math.sin(x * 3.4) * 0.025);
    }

    positions.needsUpdate = true;
    textile.computeVertexNormals();
    return textile;
  }, []);

  const shirtGeometry = useMemo(() => {
    const silhouette = new Shape();
    silhouette.moveTo(-0.82, 1.82);
    silhouette.quadraticCurveTo(-1.2, 1.78, -1.62, 1.48);
    silhouette.lineTo(-2.28, 0.78);
    silhouette.quadraticCurveTo(-2.38, 0.66, -2.28, 0.5);
    silhouette.lineTo(-1.7, -0.02);
    silhouette.quadraticCurveTo(-1.48, 0.12, -1.16, 0.38);
    silhouette.lineTo(-1.08, -1.9);
    silhouette.quadraticCurveTo(0, -2.03, 1.08, -1.9);
    silhouette.lineTo(1.16, 0.38);
    silhouette.quadraticCurveTo(1.48, 0.12, 1.7, -0.02);
    silhouette.lineTo(2.28, 0.5);
    silhouette.quadraticCurveTo(2.38, 0.66, 2.28, 0.78);
    silhouette.lineTo(1.62, 1.48);
    silhouette.quadraticCurveTo(1.2, 1.78, 0.82, 1.82);
    silhouette.quadraticCurveTo(0.5, 1.48, 0, 1.48);
    silhouette.quadraticCurveTo(-0.5, 1.48, -0.82, 1.82);
    silhouette.closePath();

    const neckline = new Path();
    neckline.absellipse(0, 1.52, 0.5, 0.24, 0, Math.PI * 2, false, 0);
    silhouette.holes.push(neckline);

    return new ExtrudeGeometry(silhouette, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.02,
      curveSegments: 8,
    });
  }, []);

  useFrame((state, delta) => {
    if (!plane.current || !shirt.current) return;

    const progress = heroProgress.value;
    const isMobile = state.size.width < 760;
    const cameraDistance = MathUtils.lerp(isMobile ? 3.2 : 3.6, isMobile ? 8.2 : 10.5, progress);
    const cameraX = MathUtils.lerp(0, isMobile ? 0.45 : 1.05, progress);
    const cameraY = MathUtils.lerp(0.05, isMobile ? 0.3 : 0.65, progress);
    const macroOpacity = 0;
    const shirtOpacity = 0;

    state.camera.position.x = MathUtils.damp(state.camera.position.x, cameraX, 4, delta);
    state.camera.position.y = MathUtils.damp(state.camera.position.y, cameraY, 4, delta);
    state.camera.position.z = MathUtils.damp(state.camera.position.z, cameraDistance, 4, delta);
    state.camera.lookAt(0, 0, 0);

    plane.current.rotation.x = MathUtils.damp(plane.current.rotation.x, MathUtils.lerp(0.06, -0.18, progress), 4, delta);
    plane.current.rotation.y = MathUtils.damp(plane.current.rotation.y, MathUtils.lerp(-0.08, 0.2, progress), 4, delta);
    plane.current.rotation.z = MathUtils.damp(plane.current.rotation.z, MathUtils.lerp(0.02, -0.12, progress), 4, delta);
    plane.current.position.x = MathUtils.damp(plane.current.position.x, MathUtils.lerp(0.2, 1.15, progress), 4, delta);
    plane.current.position.y = MathUtils.damp(plane.current.position.y, MathUtils.lerp(-0.2, 0.15, progress), 4, delta);

    const material = plane.current.material;
    if (!Array.isArray(material) && "opacity" in material) {
      material.opacity = MathUtils.damp(material.opacity, macroOpacity, 5, delta);
    }

    shirt.current.position.x = MathUtils.damp(shirt.current.position.x, MathUtils.lerp(0.15, isMobile ? 0.5 : 1.45, progress), 4, delta);
    shirt.current.position.y = MathUtils.damp(shirt.current.position.y, MathUtils.lerp(-0.25, 0.05, progress), 4, delta);
    shirt.current.rotation.x = MathUtils.damp(shirt.current.rotation.x, MathUtils.lerp(0.02, -0.08, progress), 4, delta);
    shirt.current.rotation.y = MathUtils.damp(shirt.current.rotation.y, MathUtils.lerp(-0.05, 0.08, progress), 4, delta);
    shirt.current.rotation.z = MathUtils.damp(shirt.current.rotation.z, MathUtils.lerp(0.02, -0.04, progress), 4, delta);
    shirt.current.scale.setScalar(MathUtils.damp(shirt.current.scale.x, MathUtils.lerp(0.82, 1, progress), 4, delta));

    const shirtMaterial = shirt.current.material;
    if (!Array.isArray(shirtMaterial) && "opacity" in shirtMaterial) {
      shirtMaterial.opacity = MathUtils.damp(shirtMaterial.opacity, shirtOpacity, 5, delta);
    }
  });

  return (
    <>
      <mesh ref={plane} geometry={geometry} rotation={[0.06, -0.08, 0]} position={[0.2, -0.2, 0]}>
        <meshStandardMaterial color="#d7cec2" roughness={0.98} metalness={0.01} side={DoubleSide} transparent opacity={0.48} />
      </mesh>
      <mesh ref={shirt} geometry={shirtGeometry} position={[0.15, -0.25, 0.18]}>
        <meshStandardMaterial color="#d7cec2" roughness={0.97} metalness={0.01} side={DoubleSide} transparent opacity={0.62} />
      </mesh>
      <ManufacturingScene />
    </>
  );
}
