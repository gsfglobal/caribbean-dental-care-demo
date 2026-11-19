"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { buildToothGeometry } from "./tooth";

export type Progress = { current: number };

const C = { green: "#629963", greenSoft: "#99c79a", blue: "#425f78", blueSoft: "#879fb4", enamel: "#f7f4ee" };

/** Lijnen geïnspireerd op de boog in het logo: zachte banden rond de kies. */
function orbitCurve(radius: number, tilt: number, phase: number, wobble = 0.12) {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = (i / 64) * Math.PI * 1.35 + phase;
    pts.push(new THREE.Vector3(Math.cos(a) * radius, Math.sin(a * 2) * wobble + Math.sin(a) * tilt, Math.sin(a) * radius * 0.8));
  }
  return new THREE.CatmullRomCurve3(pts);
}

function Tooth({ progress, reduced, compact }: { progress: Progress; reduced: boolean; compact: boolean }) {
  const group = useRef<THREE.Group>(null);
  const spin = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const { pointer, clock } = useThree();
  const geo = useMemo(() => buildToothGeometry(compact ? 54 : 72), [compact]);
  const ribbons = useMemo(
    () => [
      { g: new THREE.TubeGeometry(orbitCurve(1.22, 0.3, 0.2), 160, 0.022, 10, false), color: C.green, speed: 0.12 },
      { g: new THREE.TubeGeometry(orbitCurve(1.42, -0.22, 2.4, 0.14), 160, 0.012, 8, false), color: C.blue, speed: -0.08 },
      { g: new THREE.TubeGeometry(orbitCurve(1.08, 0.1, 4.1, 0.08), 160, 0.008, 8, false), color: C.blueSoft, speed: 0.18 },
    ],
    []
  );
  const enamel = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: C.enamel,
        roughness: 0.28,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.18,
        sheen: 0.5,
        sheenColor: new THREE.Color("#ffffff"),
        sheenRoughness: 0.5,
        transmission: 0.06,
        thickness: 0.6,
        ior: 1.5,
        specularIntensity: 0.6,
      }),
    []
  );
  const ribbonMats = useRef<THREE.MeshStandardMaterial[]>([]);
  const ribbonRefs = useRef<(THREE.Mesh | null)[]>([]);
  const born = useRef<number | null>(null);

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    if (born.current === null) born.current = clock.elapsedTime;
    const t = state.clock.elapsedTime;
    // Entree: zacht inschalen en omhoog komen
    const intro = reduced ? 1 : Math.min(1, (t - born.current) / 1.6);
    const e = 1 - Math.pow(1 - intro, 3);
    const p = reduced ? 0 : progress.current;
    const px = reduced ? 0 : pointer.x;
    const py = reduced ? 0 : pointer.y;
    g.scale.setScalar(THREE.MathUtils.lerp(0.82, 1, e));
    // Parallax bij scrollen + volgen van de muis (diepte-effect)
    g.position.y = THREE.MathUtils.damp(g.position.y, THREE.MathUtils.lerp(-0.35, 0.05, e) + p * 0.9 + (reduced ? 0 : Math.sin(t * 0.8) * 0.04), 4, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, 0.18 - py * 0.22 + p * 0.5, 3, dt);
    g.rotation.z = THREE.MathUtils.damp(g.rotation.z, -0.08 - px * 0.08, 3, dt);
    if (spin.current) {
      // Lichte, continue rotatie + reactie op horizontale muisbeweging
      const target = (reduced ? 0.6 : t * 0.22) + px * 0.6;
      spin.current.rotation.y = THREE.MathUtils.damp(spin.current.rotation.y, target, 2.5, dt);
    }
    ribbonRefs.current.forEach((m, i) => {
      if (!m) return;
      m.rotation.y = reduced ? i : t * ribbons[i].speed + i;
      const mat = ribbonMats.current[i];
      if (mat) mat.opacity = 0.85 * e;
    });
    // Dynamisch licht volgt de muis
    if (light.current) {
      light.current.position.x = THREE.MathUtils.damp(light.current.position.x, 1.5 + px * 2.5, 2.5, dt);
      light.current.position.y = THREE.MathUtils.damp(light.current.position.y, 1.2 + py * 1.5, 2.5, dt);
    }
  });

  return (
    <>
      <group ref={group}>
        <group ref={spin}>
          <mesh geometry={geo} material={enamel} />
        </group>
        {ribbons.map((r, i) => (
          <mesh key={i} ref={(m) => { ribbonRefs.current[i] = m; }} geometry={r.g} rotation-x={0.25}>
            <meshStandardMaterial
              ref={(m) => { if (m) ribbonMats.current[i] = m; }}
              color={r.color}
              emissive={r.color}
              emissiveIntensity={0.35}
              roughness={0.4}
              transparent
              opacity={0}
            />
          </mesh>
        ))}
      </group>
      <pointLight ref={light} position={[1.5, 1.2, 2.4]} intensity={8} distance={8} color="#ffffff" />
    </>
  );
}

export default function HeroScene({ progress, active, reduced, compact }: { progress: Progress; active: boolean; reduced: boolean; compact: boolean }) {
  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={active ? "always" : "never"}
      dpr={compact ? [1, 1.4] : [1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.15, compact ? 5.6 : 5.0], fov: 32 }}
    >
      <ambientLight intensity={0.45} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-3, -1, -2]} intensity={10} color={C.green} distance={9} />
      <pointLight position={[3, -2, -3]} intensity={8} color={C.blue} distance={9} />
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2.2} position={[0, 4, 3]} scale={[8, 2, 1]} color="#ffffff" />
        <Lightformer intensity={1.1} position={[-5, 0, 1]} rotation-y={Math.PI / 2} scale={[6, 3, 1]} color={C.greenSoft} />
        <Lightformer intensity={1.1} position={[5, -1, -2]} rotation-y={-Math.PI / 2} scale={[6, 3, 1]} color={C.blueSoft} />
      </Environment>
      <Tooth progress={progress} reduced={reduced} compact={compact} />
      <ContactShadows position={[0, -1.25, 0]} opacity={0.22} scale={5} blur={2.8} far={2.5} color="#142b3b" frames={1} />
    </Canvas>
  );
}
