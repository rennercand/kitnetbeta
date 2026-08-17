"use client";

/* eslint-disable react/no-unknown-property, react-hooks/immutability -- React Three Fiber uses custom JSX props and intentionally mutates Three.js scene objects. */

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { SoftShadows } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

type MoveKey = "forward" | "back" | "left" | "right";
type MoveState = Record<MoveKey, boolean>;
type TourView = { name: string; position: readonly [number, number, number]; look: readonly [number, number, number] };

const views: TourView[] = [
  { name: "Corredor", position: [0, 1.65, 8] as const, look: [0, 1.4, 2] as const },
  { name: "Entrada", position: [0, 1.65, 4.8] as const, look: [0, 1.3, 0] as const },
  { name: "Área de descanso", position: [0.8, 1.65, 0.6] as const, look: [-2.1, 1, -2.3] as const },
  { name: "Cozinha", position: [-0.2, 1.65, -0.4] as const, look: [2.5, 1, -2.2] as const },
  { name: "Banheiro", position: [0, 1.65, 1.2] as const, look: [2.4, 1.2, 2.6] as const },
];

const normalViews: TourView[] = [
  { name: "Corredor", position: [-1.42, 1.62, 7.25], look: [-1.42, 1.35, 4.25] },
  { name: "Entrada", position: [-1.42, 1.62, 4.25], look: [0, 1.25, .8] },
  { name: "Ambiente principal", position: [0, 1.62, 1.1], look: [-.15, 1.2, -1.45] },
  { name: "Cozinha", position: [-.25, 1.62, 2.6], look: [.75, .95, 4.75] },
  { name: "Quarto", position: [-1.05, 1.62, -2.7], look: [-1.05, 1.2, -5.15] },
  { name: "Banheiro", position: [1.28, 1.62, -2.3], look: [1.25, 1.08, -4.65] },
];

const modelColor = {
  wall: "#e8e8e4",
  wallLight: "#f2f2ef",
  floor: "#c8c8c4",
  grout: "#9ea19f",
  metal: "#aeb3b1",
  darkMetal: "#424646",
  counter: "#626a69",
  tile: "#d9d9d5",
  glass: "#cdd5d4",
  porcelain: "#eeeeeb",
};

function Box({ position, size, color = modelColor.wallLight }: { position: [number, number, number]; size: [number, number, number]; color?: string }) {
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

function BarredWindow({ position, rotation = [0, 0, 0], width = 2.3 }: { position: [number, number, number]; rotation?: [number, number, number]; width?: number }) {
  return (
    <group position={position} rotation={rotation}>
      <Box position={[0, 0, 0]} size={[width, 1.45, .07]} color={modelColor.glass} />
      <Box position={[0, .73, -.08]} size={[width + .18, .08, .08]} color={modelColor.wallLight} />
      <Box position={[0, -.73, -.08]} size={[width + .18, .08, .08]} color={modelColor.wallLight} />
      {Array.from({ length: 7 }, (_, index) => -width / 2 + .14 + index * ((width - .28) / 6)).map((x) => <Box key={x} position={[x, 0, -.11]} size={[.045, 1.55, .045]} color={modelColor.wallLight} />)}
    </group>
  );
}

function Kitchenette() {
  return (
    <group>
      <Box position={[2.72, .86, -2.15]} size={[1.15, .12, 2.65]} color={modelColor.counter} />
      <Box position={[2.72, .39, -2.15]} size={[.12, .85, 2.55]} color="#e8e8e5" />
      <Box position={[2.66, 1.28, -2.15]} size={[.05, .72, 2.55]} color="#f2f1ed" />
      <Box position={[2.55, .94, -2.18]} size={[.55, .06, .72]} color="#9aa2a1" />
      <Box position={[2.48, 1.2, -2.18]} size={[.08, .55, .08]} color="#c7cdcc" />
      <Box position={[2.35, 1.45, -2.18]} size={[.32, .06, .08]} color="#c7cdcc" />
    </group>
  );
}

function FrontKitchen() {
  return (
    <group>
      <Box position={[.72, .88, 4.68]} size={[2.45, .12, .62]} color={modelColor.counter} />
      <Box position={[-.42, .43, 4.7]} size={[.12, .86, .52]} color={modelColor.wall} />
      <Box position={[1.86, .43, 4.7]} size={[.12, .86, .52]} color={modelColor.wall} />
      <Box position={[.72, 1.35, 4.93]} size={[2.55, .84, .045]} color={modelColor.tile} />
      {[-.08, .34, .76, 1.18, 1.6].map((x) => <Box key={x} position={[x, 1.35, 4.9]} size={[.015, .82, .018]} color={modelColor.grout} />)}
      <Box position={[.72, .95, 4.58]} size={[.76, .05, .4]} color={modelColor.darkMetal} />
      <Box position={[.72, 1.22, 4.72]} size={[.07, .55, .07]} color={modelColor.metal} />
      <Box position={[.88, 1.46, 4.72]} size={[.34, .06, .07]} color={modelColor.metal} />
    </group>
  );
}

function BathroomDetails() {
  return (
    <group>
      <Box position={[1.46, 1.38, -5.9]} size={[1.9, 2.7, .08]} color={modelColor.tile} />
      {[.42, .86, 1.3, 1.74, 2.18].map((y) => <Box key={y} position={[1.46, y, -5.84]} size={[1.88, .012, .02]} color={modelColor.grout} />)}
      {[.82, 1.28, 1.74, 2.2].map((x) => <Box key={x} position={[x, 1.38, -5.84]} size={[.012, 2.64, .02]} color={modelColor.grout} />)}
      <BarredWindow position={[1.46, 1.75, -5.78]} width={.86} />

      <group position={[.88, 0, -4.48]}>
        <mesh position={[0, .43, 0]} castShadow>
          <cylinderGeometry args={[.33, .27, .48, 24]} />
          <meshStandardMaterial color={modelColor.porcelain} roughness={.5} />
        </mesh>
        <Box position={[0, .78, .08]} size={[.62, .56, .32]} color={modelColor.porcelain} />
        <Box position={[0, .69, -.2]} size={[.66, .12, .62]} color={modelColor.porcelain} />
      </group>

      <Box position={[2.3, .86, -3.32]} size={[.12, .72, 1.18]} color={modelColor.wall} />
      <Box position={[2.22, 1.21, -3.32]} size={[.34, .1, 1.25]} color={modelColor.porcelain} />
      <Box position={[2.16, 1.18, -3.32]} size={[.36, .04, .62]} color={modelColor.darkMetal} />
      <Box position={[2.14, 1.47, -3.32]} size={[.06, .55, .06]} color={modelColor.metal} />

      <Box position={[2.28, 1.63, -5.55]} size={[.06, 1.35, .06]} color={modelColor.metal} />
      <Box position={[2.12, 2.27, -5.55]} size={[.34, .06, .06]} color={modelColor.metal} />
      <mesh position={[1.92, 2.23, -5.55]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[.13, .13, .04, 20]} />
        <meshStandardMaterial color={modelColor.metal} roughness={.35} />
      </mesh>
      <Box position={[2.3, 1.35, -4.45]} size={[.06, .06, .95]} color={modelColor.metal} />
    </group>
  );
}

function NormalKitnet() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, .5]} receiveShadow>
        <planeGeometry args={[5, 13]} />
        <meshStandardMaterial color={modelColor.floor} roughness={.94} />
      </mesh>
      {Array.from({ length: 7 }, (_, index) => <Box key={`row-${index}`} position={[0, .008, -5.5 + index * 1.85]} size={[4.9, .012, .022]} color={modelColor.grout} />)}
      {[-1.65, -.82, 0, .82, 1.65].map((x) => <Box key={`column-${x}`} position={[x, .009, .5]} size={[.018, .012, 12.8]} color={modelColor.grout} />)}
      <Box position={[-2.5, 1.4, -.5]} size={[.14, 2.8, 11]} color={modelColor.wall} />
      <Box position={[2.5, 1.4, -.5]} size={[.14, 2.8, 11]} color={modelColor.wall} />
      <Box position={[0, 2.82, -.5]} size={[5, .08, 11]} color={modelColor.wallLight} />

      <Box position={[-2.28, 1.4, 5]} size={[.44, 2.8, .14]} />
      <Box position={[.52, 1.4, 5]} size={[3.96, 2.8, .14]} />
      <Box position={[-1.45, 2.55, 5]} size={[1.22, .5, .14]} />
      <SlattedDoor position={[-1.46, 0, 5.06]} rotation={[0, .72, 0]} />
      <FrontKitchen />

      <Box position={[-2.08, 1.4, -1.55]} size={[.84, 2.8, .14]} />
      <Box position={[.05, 1.4, -1.55]} size={[1.2, 2.8, .14]} />
      <Box position={[2.1, 1.4, -1.55]} size={[.8, 2.8, .14]} />
      <Box position={[0, 2.55, -1.55]} size={[5, .5, .14]} />
      <group position={[-1.12, 0, -1.48]} rotation={[0, -.72, 0]}>
        <Box position={[.5, 1.35, 0]} size={[1.02, 2.7, .08]} color={modelColor.wallLight} />
        <Box position={[.9, 1.35, -.09]} size={[.06, .06, .12]} color={modelColor.darkMetal} />
      </group>
      <group position={[1.18, 0, -1.48]} rotation={[0, .68, 0]}>
        <Box position={[-.48, 1.35, 0]} size={[1.02, 2.7, .08]} color={modelColor.wallLight} />
        <Box position={[-.88, 1.35, -.09]} size={[.06, .06, .12]} color={modelColor.darkMetal} />
      </group>

      <Box position={[.45, 1.4, -3.78]} size={[.12, 2.8, 4.45]} color={modelColor.wall} />
      <Box position={[0, 1.4, -6]} size={[5, 2.8, .14]} />
      <BarredWindow position={[-2.38, 1.62, -4.25]} rotation={[0, Math.PI / 2, 0]} width={1.32} />
      <BathroomDetails />

    </group>
  );
}

function Apartment({ variant }: { variant: "kitnet" | "loft" }) {
  const loft = variant === "loft";
  if (!loft) return <NormalKitnet />;
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

    </group>
  );
}

function CameraRig({ movement, guided, selected, viewSet, reducedMotion }: { movement: React.RefObject<MoveState>; guided: boolean; selected: number; viewSet: TourView[]; reducedMotion: boolean }) {
  const { camera, gl } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const look = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const right = useMemo(() => new THREE.Vector3(), []);
  const desiredVelocity = useMemo(() => new THREE.Vector3(), []);
  const velocity = useMemo(() => new THREE.Vector3(), []);
  const previousPosition = useMemo(() => new THREE.Vector3(), []);
  const guideCamera = useMemo(() => new THREE.PerspectiveCamera(), []);
  const euler = useMemo(() => new THREE.Euler(0, 0, 0, "YXZ"), []);
  const yaw = useRef(0);
  const pitch = useRef(0);
  const wasGuided = useRef(guided);

  useEffect(() => {
    camera.position.set(...viewSet[0].position);
    camera.lookAt(...viewSet[0].look);
    euler.setFromQuaternion(camera.quaternion, "YXZ");
    yaw.current = euler.y;
    pitch.current = euler.x;
  }, [camera, euler, viewSet]);

  useEffect(() => {
    const element = gl.domElement;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const down = (event: PointerEvent) => {
      if (guided) return;
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      element.setPointerCapture?.(event.pointerId);
    };
    const move = (event: PointerEvent) => {
      if (!dragging || guided) return;
      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      yaw.current -= deltaX * .004;
      pitch.current = THREE.MathUtils.clamp(pitch.current - deltaY * .004, -1.18, 1.18);
    };
    const up = (event: PointerEvent) => {
      dragging = false;
      if (element.hasPointerCapture?.(event.pointerId)) element.releasePointerCapture(event.pointerId);
    };
    element.addEventListener("pointerdown", down);
    element.addEventListener("pointermove", move);
    element.addEventListener("pointerup", up);
    element.addEventListener("pointercancel", up);
    return () => {
      element.removeEventListener("pointerdown", down);
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerup", up);
      element.removeEventListener("pointercancel", up);
    };
  }, [gl, guided]);

  useFrame((_, delta) => {
    if (guided) {
      const view = viewSet[selected];
      target.set(...view.position);
      look.set(...view.look);
      if (reducedMotion) camera.position.copy(target);
      else camera.position.lerp(target, 1 - Math.exp(-delta * 2.4));
      guideCamera.position.copy(camera.position);
      guideCamera.lookAt(look);
      if (reducedMotion) camera.quaternion.copy(guideCamera.quaternion);
      else camera.quaternion.slerp(guideCamera.quaternion, 1 - Math.exp(-delta * 4.5));
      velocity.set(0, 0, 0);
      wasGuided.current = true;
      return;
    }
    if (wasGuided.current) {
      euler.setFromQuaternion(camera.quaternion, "YXZ");
      yaw.current = euler.y;
      pitch.current = euler.x;
      wasGuided.current = false;
    }
    camera.rotation.set(pitch.current, yaw.current, 0, "YXZ");
    const state = movement.current;
    if (!state) return;
    direction.set(0, 0, -1).applyEuler(camera.rotation);
    direction.y = 0;
    direction.normalize();
    right.crossVectors(direction, camera.up).normalize();
    desiredVelocity.set(0, 0, 0);
    if (state.forward) desiredVelocity.add(direction);
    if (state.back) desiredVelocity.sub(direction);
    if (state.left) desiredVelocity.sub(right);
    if (state.right) desiredVelocity.add(right);
    if (desiredVelocity.lengthSq() > 0) desiredVelocity.normalize().multiplyScalar(2.25);
    velocity.lerp(desiredVelocity, 1 - Math.exp(-delta * 11));
    previousPosition.copy(camera.position);
    camera.position.addScaledVector(velocity, delta);
    const horizontalLimit = viewSet === normalViews ? 2.28 : 3;
    camera.position.x = THREE.MathUtils.clamp(camera.position.x, -horizontalLimit, horizontalLimit);
    camera.position.z = THREE.MathUtils.clamp(camera.position.z, -5.5, 9.5);
    if (viewSet === normalViews) {
      const crossed = (plane: number) => (previousPosition.z - plane) * (camera.position.z - plane) <= 0 && Math.abs(previousPosition.z - camera.position.z) > .001;
      const atEntrance = camera.position.x > -2.08 && camera.position.x < -.82;
      const atBedroomDoor = camera.position.x > -1.65 && camera.position.x < -.55;
      const atBathroomDoor = camera.position.x > .65 && camera.position.x < 1.7;
      if (crossed(5) && !atEntrance) camera.position.z = previousPosition.z;
      if (crossed(-1.55) && !atBedroomDoor && !atBathroomDoor) camera.position.z = previousPosition.z;
      const crossedDivider = (previousPosition.x - .45) * (camera.position.x - .45) <= 0 && Math.abs(previousPosition.x - camera.position.x) > .001;
      if (crossedDivider && camera.position.z < -1.7) camera.position.x = previousPosition.x;
    }
    camera.position.y = 1.65;
  });
  return null;
}

export default function VirtualTour({ mode = "default" }: { mode?: "default" | "hero" }) {
  const [interactive, setInteractive] = useState(mode === "default");
  const [propertyType, setPropertyType] = useState<"kitnet" | "loft">("kitnet");
  const [guided, setGuided] = useState(true);
  const [selected, setSelected] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const movement = useRef<MoveState>({ forward: false, back: false, left: false, right: false });
  const activeViews = propertyType === "kitnet" ? normalViews : views;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const map: Record<string, MoveKey> = { w: "forward", arrowup: "forward", s: "back", arrowdown: "back", a: "left", arrowleft: "left", d: "right", arrowright: "right" };
    const update = (event: KeyboardEvent, active: boolean) => {
      const key = map[event.key.toLowerCase()];
      if (!key || !interactive || guided) return;
      event.preventDefault();
      movement.current[key] = active;
    };
    const down = (event: KeyboardEvent) => update(event, true);
    const up = (event: KeyboardEvent) => update(event, false);
    const reset = () => { movement.current = { forward: false, back: false, left: false, right: false }; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", reset);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); window.removeEventListener("blur", reset); };
  }, [guided, interactive]);

  useEffect(() => {
    if (!guided || !interactive || reducedMotion) return;
    const timer = window.setInterval(() => setSelected((value) => (value + 1) % activeViews.length), 8000);
    return () => window.clearInterval(timer);
  }, [guided, interactive, activeViews, reducedMotion, selected]);

  const hold = (key: MoveKey, active: boolean) => { movement.current[key] = active; };

  return (
    <div className={`tour-shell ${mode === "hero" ? "hero-tour-shell" : ""} is-model-tour ${interactive ? "is-active" : ""}`} id={mode === "hero" ? "tour" : "tour-viewer"}>
      <Suspense fallback={<div className="tour-loading">Preparando sua visita virtual…</div>}>
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: [0, 1.65, 8], fov: 62 }}
          onCreated={({ gl }) => {
            gl.domElement.setAttribute("role", "img");
            gl.domElement.setAttribute("aria-label", "Passeio 3D interativo pela Kitnet Beta. Arraste para olhar e use WASD, setas ou os controles na tela para caminhar.");
          }}
        >
          <color attach="background" args={[mode === "hero" ? "#1d1f1f" : "#eeeeeb"]} />
          <ambientLight intensity={1.35} />
          <directionalLight position={[-3, 7, -5]} intensity={2.2} castShadow />
          <pointLight position={[0, 2.35, 1]} intensity={12} distance={17} />
          <pointLight position={[0, 2.35, -4]} intensity={7} distance={9} />
          <SoftShadows size={15} samples={8} focus={0.7} />
          <Apartment variant={propertyType} />
          <CameraRig movement={movement} guided={guided} selected={selected} viewSet={activeViews} reducedMotion={reducedMotion} />
        </Canvas>
      </Suspense>
      {mode === "hero" && (
        <div className="tour-type-switch" aria-label="Escolha o tipo de imóvel">
          <button className={propertyType === "kitnet" ? "active" : ""} aria-pressed={propertyType === "kitnet"} onClick={() => { setPropertyType("kitnet"); setSelected(0); }}>Kitnet real</button>
          <button className={propertyType === "loft" ? "active" : ""} aria-pressed={propertyType === "loft"} onClick={() => { setPropertyType("loft"); setSelected(0); }}>Loft conceitual</button>
        </div>
      )}
      {mode === "hero" && !interactive && (
        <button className="hero-tour-enter" onClick={() => { setInteractive(true); setGuided(true); setSelected(2); }} aria-label="Entrar e caminhar no modelo 3D">
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
            {activeViews.map((view, index) => <button className={selected === index ? "active" : ""} key={view.name} onClick={() => { setGuided(true); setSelected(index); }}>{view.name}</button>)}
          </div>
          {!guided && (
            <div className="mobile-pad" aria-label="Controles de movimento">
              <button aria-label="Andar para frente" onPointerDown={() => hold("forward", true)} onPointerUp={() => hold("forward", false)} onPointerCancel={() => hold("forward", false)}>↑</button>
              <button aria-label="Andar para a esquerda" onPointerDown={() => hold("left", true)} onPointerUp={() => hold("left", false)} onPointerCancel={() => hold("left", false)}>←</button>
              <button aria-label="Andar para trás" onPointerDown={() => hold("back", true)} onPointerUp={() => hold("back", false)} onPointerCancel={() => hold("back", false)}>↓</button>
              <button aria-label="Andar para a direita" onPointerDown={() => hold("right", true)} onPointerUp={() => hold("right", false)} onPointerCancel={() => hold("right", false)}>→</button>
            </div>
          )}
          <p className="tour-note">{propertyType === "kitnet" ? "Modelo reconstruído a partir do vídeo real da kitnet." : "Proposta conceitual de loft."} Use WASD ou as setas e arraste para olhar ao redor.</p>
        </>
      )}
    </div>
  );
}
