"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, SoftShadows } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type MoveKey = "forward" | "back" | "left" | "right";
type MoveState = Record<MoveKey, boolean>;

const views = [
  { name: "Corredor", position: [0, 1.65, 8] as const, look: [0, 1.4, 2] as const },
  { name: "Entrada", position: [0, 1.65, 4.8] as const, look: [0, 1.3, 0] as const },
  { name: "Área de descanso", position: [0.8, 1.65, 0.6] as const, look: [-2.1, 1, -2.3] as const },
  { name: "Cozinha", position: [-0.2, 1.65, -0.4] as const, look: [2.5, 1, -2.2] as const },
  { name: "Banheiro", position: [0, 1.65, 1.2] as const, look: [2.4, 1.2, 2.6] as const },
];

function Box({ position, size, color = "#f7f7f4" }: { position: [number, number, number]; size: [number, number, number]; color?: string }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.82} />
    </mesh>
  );
}

function SlattedDoor({ position, rotation = [0, 0, 0] }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <Box position={[0, 1.35, 0]} size={[1.02, 2.7, .08]} color="#eeeeec" />
      {Array.from({ length: 11 }, (_, index) => (
        <Box key={index} position={[0, .32 + index * .18, -.052]} size={[.88, .045, .025]} color="#c9cbc9" />
      ))}
      <Box position={[-.4, 1.38, -.09]} size={[.06, .06, .12]} color="#242627" />
    </group>
  );
}

function BarredWindow({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <Box position={[0, 0, 0]} size={[2.3, 1.45, .07]} color="#dce4e5" />
      <Box position={[0, .73, -.08]} size={[2.48, .08, .08]} color="#f1f1ef" />
      <Box position={[0, -.73, -.08]} size={[2.48, .08, .08]} color="#f1f1ef" />
      {[-1, -.66, -.33, 0, .33, .66, 1].map((x) => <Box key={x} position={[x, 0, -.11]} size={[.045, 1.55, .045]} color="#ededeb" />)}
    </group>
  );
}

function Kitchenette() {
  return (
    <group>
      <Box position={[2.72, .86, -2.15]} size={[1.15, .12, 2.65]} color="#2f7c87" />
      <Box position={[2.72, .39, -2.15]} size={[.12, .85, 2.55]} color="#e8e8e5" />
      <Box position={[2.66, 1.28, -2.15]} size={[.05, .72, 2.55]} color="#f2f1ed" />
      <Box position={[2.55, .94, -2.18]} size={[.55, .06, .72]} color="#9aa2a1" />
      <Box position={[2.48, 1.2, -2.18]} size={[.08, .55, .08]} color="#c7cdcc" />
      <Box position={[2.35, 1.45, -2.18]} size={[.32, .06, .08]} color="#c7cdcc" />
    </group>
  );
}

function Apartment({ variant }: { variant: "kitnet" | "loft" }) {
  const loft = variant === "loft";
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1]} receiveShadow>
        <planeGeometry args={[7, 17]} />
        <meshStandardMaterial color="#d6d4cf" roughness={0.92} />
      </mesh>
      {Array.from({ length: 8 }, (_, index) => <Box key={index} position={[0, .008, -5 + index * 2]} size={[6.7, .012, .025]} color="#aeb0ae" />)}
      <Box position={[-3.4, 1.4, 1]} size={[0.14, 2.8, 17]} color="#ececea" />
      <Box position={[3.4, 1.4, 1]} size={[0.14, 2.8, 17]} color="#ececea" />
      <Box position={[-2.2, 1.4, -6]} size={[2.4, 2.8, 0.14]} />
      <Box position={[2.2, 1.4, -6]} size={[2.4, 2.8, 0.14]} />
      <Box position={[0, 0.42, -6]} size={[2, 0.84, 0.14]} />
      <Box position={[0, 2.48, -6]} size={[2, 0.64, 0.14]} />
      <BarredWindow position={[0, 1.58, -5.91]} />

      <Box position={[-2.25, 1.4, 4]} size={[2.3, 2.8, 0.14]} />
      <Box position={[2.25, 1.4, 4]} size={[2.3, 2.8, 0.14]} />
      <Box position={[0, 2.55, 4]} size={[2.2, 0.5, 0.14]} />
      <SlattedDoor position={[-.9, 0, 4.05]} rotation={[0, -.78, 0]} />
      <Box position={[-3.38, 1.4, 7]} size={[0.14, 2.8, 6]} color="#e7e7e5" />
      <Box position={[3.38, 1.4, 7]} size={[0.14, 2.8, 6]} color="#e7e7e5" />
      <Box position={[0, 2.82, 1]} size={[6.8, .08, 17]} color="#f3f3f0" />

      <Kitchenette />
      <Box position={[-2.12, .3, -2.8]} size={[1.75, .58, 2.25]} color="#5e6261" />
      <Box position={[-2.12, .66, -2.8]} size={[1.62, .18, 2.12]} color="#f2f1ed" />
      <Box position={[-.55, .74, -.25]} size={[1.2, .09, .72]} color="#666a68" />

      {!loft ? (
        <>
          <Box position={[2.45, 1.4, 1.85]} size={[1.8, 2.8, .12]} />
          <Box position={[1.58, 1.4, 2.72]} size={[.12, 2.8, 1.85]} />
          <Box position={[2.66, .36, 2.52]} size={[.52, .72, .52]} color="#ededeb" />
        </>
      ) : (
        <>
          <Box position={[-1.7, 2.12, -3.7]} size={[3.1, .16, 3.9]} color="#565a59" />
          {[-2.7, -.7].map((x) => <Box key={x} position={[x, 1.05, -5.2]} size={[.12, 2.1, .12]} color="#565a59" />)}
          {Array.from({ length: 6 }, (_, index) => <Box key={index} position={[-.45 - index * .25, .28 + index * .29, -2.55]} size={[.7, .07, .18]} color="#737775" />)}
        </>
      )}

      {views.slice(2).map((view) => (
        <Html key={view.name} position={[view.look[0], 1.95, view.look[2]]} center distanceFactor={9}>
          <span className="tour-hotspot">{view.name}</span>
        </Html>
      ))}
    </group>
  );
}

function CameraRig({ movement, guided, selected }: { movement: React.RefObject<MoveState>; guided: boolean; selected: number }) {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    camera.position.set(...views[0].position);
  }, [camera]);

  useFrame((_, delta) => {
    if (guided) {
      const view = views[selected];
      target.set(...view.position);
      look.set(...view.look);
      camera.position.lerp(target, Math.min(1, delta * 1.6));
      camera.lookAt(look);
      return;
    }
    const state = movement.current;
    if (!state) return;
    camera.getWorldDirection(direction);
    direction.y = 0;
    direction.normalize();
    right.crossVectors(direction, camera.up).normalize();
    const speed = delta * 2.4;
    if (state.forward) camera.position.addScaledVector(direction, speed);
    if (state.back) camera.position.addScaledVector(direction, -speed);
    if (state.left) camera.position.addScaledVector(right, -speed);
    if (state.right) camera.position.addScaledVector(right, speed);
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -3, 3);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -5.5, 9.5);
    camera.position.y = 1.65;
  });
  return null;
}

export default function VirtualTour({ mode = "default" }: { mode?: "default" | "hero" }) {
  const [interactive, setInteractive] = useState(mode === "default");
  const [propertyType, setPropertyType] = useState<"kitnet" | "loft">("kitnet");
  const [guided, setGuided] = useState(true);
  const [selected, setSelected] = useState(0);
  const movement = useRef<MoveState>({ forward: false, back: false, left: false, right: false });

  useEffect(() => {
    const map: Record<string, MoveKey> = { w: "forward", arrowup: "forward", s: "back", arrowdown: "back", a: "left", arrowleft: "left", d: "right", arrowright: "right" };
    const update = (event: KeyboardEvent, active: boolean) => {
      const key = map[event.key.toLowerCase()];
      if (key) movement.current[key] = active;
    };
    const down = (event: KeyboardEvent) => update(event, true);
    const up = (event: KeyboardEvent) => update(event, false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  useEffect(() => {
    if (!guided) return;
    const timer = window.setInterval(() => setSelected((value) => (value + 1) % views.length), 4200);
    return () => window.clearInterval(timer);
  }, [guided]);

  const hold = (key: MoveKey, active: boolean) => { movement.current[key] = active; };

  return (
    <div className={`tour-shell ${mode === "hero" ? "hero-tour-shell" : ""} is-model-tour ${interactive ? "is-active" : ""}`} id={mode === "hero" ? "tour" : "tour-viewer"}>
      <Suspense fallback={<div className="tour-loading">Preparando sua visita virtual…</div>}>
        <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 1.65, 8], fov: 62 }}>
          <color attach="background" args={[mode === "hero" ? "#191b1b" : "#efefec"]} />
          <ambientLight intensity={1.35} />
          <directionalLight position={[-3, 7, -5]} intensity={2.2} castShadow />
          <pointLight position={[0, 2.35, 1]} intensity={12} distance={17} />
          <pointLight position={[0, 2.35, -4]} intensity={7} distance={9} />
          <SoftShadows size={15} samples={8} focus={0.7} />
          <Apartment variant={propertyType} />
          <CameraRig movement={movement} guided={guided} selected={selected} />
          {!guided && <OrbitControls enablePan={false} enableZoom={false} target={[0, 1.5, 0]} />}
        </Canvas>
      </Suspense>
      {mode === "hero" && (
        <div className="tour-type-switch" aria-label="Escolha o tipo de imóvel">
          <button className={propertyType === "kitnet" ? "active" : ""} aria-pressed={propertyType === "kitnet"} onClick={() => setPropertyType("kitnet")}>Kitnet normal</button>
          <button className={propertyType === "loft" ? "active" : ""} aria-pressed={propertyType === "loft"} onClick={() => setPropertyType("loft")}>Loft</button>
        </div>
      )}
      {mode === "hero" && !interactive && (
        <button className="hero-tour-enter" onClick={() => { setInteractive(true); setGuided(false); }} aria-label="Entrar e caminhar no modelo 3D">
          <span>Clique para caminhar dentro ↗</span>
        </button>
      )}
      {interactive && (
        <>
          <div className="tour-toolbar">
            <button onClick={() => setGuided((value) => !value)}>{guided ? "Explorar livremente" : "Iniciar tour guiado"}</button>
            <button onClick={() => document.getElementById(mode === "hero" ? "tour" : "tour-viewer")?.requestFullscreen?.()}>Tela cheia</button>
            {mode === "hero" && <button onClick={() => { setInteractive(false); setGuided(true); }}>Sair do tour</button>}
          </div>
          <div className="tour-views">
            {views.map((view, index) => <button className={selected === index ? "active" : ""} key={view.name} onClick={() => { setGuided(true); setSelected(index); }}>{view.name}</button>)}
          </div>
          {!guided && (
            <div className="mobile-pad" aria-label="Controles de movimento">
              <button onPointerDown={() => hold("forward", true)} onPointerUp={() => hold("forward", false)}>↑</button>
              <button onPointerDown={() => hold("left", true)} onPointerUp={() => hold("left", false)}>←</button>
              <button onPointerDown={() => hold("back", true)} onPointerUp={() => hold("back", false)}>↓</button>
              <button onPointerDown={() => hold("right", true)} onPointerUp={() => hold("right", false)}>→</button>
            </div>
          )}
          <p className="tour-note">Modelo 3D baseado nas imagens e no vídeo. Use WASD ou as setas e arraste para olhar ao redor.</p>
        </>
      )}
    </div>
  );
}
