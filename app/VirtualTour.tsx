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

function Apartment() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 1]} receiveShadow>
        <planeGeometry args={[7, 17]} />
        <meshStandardMaterial color="#d9d9d6" roughness={0.95} />
      </mesh>
      <Box position={[-3.4, 1.4, 1]} size={[0.14, 2.8, 17]} />
      <Box position={[3.4, 1.4, 1]} size={[0.14, 2.8, 17]} />
      <Box position={[-2.2, 1.4, -6]} size={[2.4, 2.8, 0.14]} />
      <Box position={[2.2, 1.4, -6]} size={[2.4, 2.8, 0.14]} />
      <Box position={[0, 0.42, -6]} size={[2, 0.84, 0.14]} />
      <Box position={[0, 2.48, -6]} size={[2, 0.64, 0.14]} />
      <mesh position={[0, 1.55, -6]}>
        <boxGeometry args={[2, 1.2, 0.04]} />
        <meshStandardMaterial color="#dfe7e8" transparent opacity={0.42} />
      </mesh>

      <Box position={[-2.25, 1.4, 4]} size={[2.3, 2.8, 0.14]} />
      <Box position={[2.25, 1.4, 4]} size={[2.3, 2.8, 0.14]} />
      <Box position={[0, 2.55, 4]} size={[2.2, 0.5, 0.14]} />
      <Box position={[-0.9, 1.05, 4.02]} size={[0.85, 2.1, 0.08]} color="#686b6e" />
      <Box position={[-3.38, 1.4, 7]} size={[0.14, 2.8, 6]} color="#e7e7e5" />
      <Box position={[3.38, 1.4, 7]} size={[0.14, 2.8, 6]} color="#e7e7e5" />

      <Box position={[-2.25, 0.28, -2.5]} size={[1.55, 0.55, 2.15]} color="#686b6e" />
      <Box position={[-2.25, 0.62, -2.5]} size={[1.4, 0.18, 2]} color="#f7f7f4" />
      <Box position={[2.7, 0.48, -2]} size={[1.1, 0.96, 2.6]} />
      <Box position={[2.7, 0.98, -2]} size={[1.15, 0.08, 2.65]} color="#343638" />
      <Box position={[2.45, 1.4, 1.8]} size={[1.8, 2.8, 0.12]} />
      <Box position={[1.6, 1.4, 2.7]} size={[0.12, 2.8, 1.8]} />
      <Box position={[2.65, 0.35, 2.55]} size={[0.5, 0.7, 0.5]} color="#e7e7e5" />
      <Box position={[-0.5, 0.76, -0.2]} size={[1.2, 0.08, 0.7]} color="#686b6e" />

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
  const [videoPlaying, setVideoPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [guided, setGuided] = useState(true);
  const [selected, setSelected] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
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
  const toggleVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play(); else video.pause();
  };
  const seekVideo = (ratio: number) => {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    video.currentTime = video.duration * ratio;
    void video.play();
  };

  return (
    <div className={`tour-shell ${mode === "hero" ? "hero-tour-shell" : ""} ${propertyType === "kitnet" ? "is-video-tour" : "is-model-tour"} ${interactive ? "is-active" : ""}`} id={mode === "hero" ? "tour" : "tour-viewer"}>
      {propertyType === "kitnet" ? (
        <video
          ref={videoRef}
          className="tour-video"
          src="/media/tour-real.mp4"
          autoPlay
          muted={muted}
          loop
          playsInline
          preload="auto"
          onPlay={() => setVideoPlaying(true)}
          onPause={() => setVideoPlaying(false)}
        />
      ) : (
        <Suspense fallback={<div className="tour-loading">Preparando sua visita virtual…</div>}>
          <Canvas shadows dpr={[1, 1.5]} camera={{ position: [0, 1.65, 8], fov: 62 }}>
            <color attach="background" args={[mode === "hero" ? "#191b1b" : "#efefec"]} />
            <ambientLight intensity={1.2} />
            <directionalLight position={[-3, 7, -5]} intensity={2} castShadow />
            <pointLight position={[0, 2.5, 0]} intensity={8} distance={13} />
            <SoftShadows size={15} samples={8} focus={0.7} />
            <Apartment />
            <CameraRig movement={movement} guided={guided} selected={selected} />
            {!guided && <OrbitControls enablePan={false} enableZoom={false} target={[0, 1.5, 0]} />}
          </Canvas>
        </Suspense>
      )}
      {mode === "hero" && (
        <div className="tour-type-switch" aria-label="Escolha o tipo de imóvel">
          <button className={propertyType === "kitnet" ? "active" : ""} aria-pressed={propertyType === "kitnet"} onClick={() => setPropertyType("kitnet")}>Kitnet normal</button>
          <button className={propertyType === "loft" ? "active" : ""} aria-pressed={propertyType === "loft"} onClick={() => setPropertyType("loft")}>Loft</button>
        </div>
      )}
      {mode === "hero" && !interactive && (
        <button className="hero-tour-enter" onClick={() => { setInteractive(true); if (propertyType === "kitnet") void videoRef.current?.play(); else setGuided(false); }} aria-label="Entrar no modo tour imersivo">
          <span>Clique para entrar no tour ↗</span>
        </button>
      )}
      {interactive && (
        <>
          <div className="tour-toolbar">
            {propertyType === "kitnet" ? (
              <>
                <button onClick={toggleVideo}>{videoPlaying ? "Pausar" : "Continuar"}</button>
                <button onClick={() => setMuted((value) => !value)}>{muted ? "Ativar som" : "Silenciar"}</button>
              </>
            ) : <button onClick={() => setGuided((value) => !value)}>{guided ? "Explorar livremente" : "Iniciar tour guiado"}</button>}
            <button onClick={() => document.getElementById(mode === "hero" ? "tour" : "tour-viewer")?.requestFullscreen?.()}>Tela cheia</button>
            {mode === "hero" && <button onClick={() => { setInteractive(false); setGuided(true); }}>Sair do tour</button>}
          </div>
          {propertyType === "kitnet" ? (
            <div className="tour-views video-chapters">
              <button onClick={() => seekVideo(0)}>Entrada</button>
              <button onClick={() => seekVideo(.34)}>Interior</button>
              <button onClick={() => seekVideo(.68)}>Cozinha</button>
            </div>
          ) : (
            <div className="tour-views">
              {views.map((view, index) => <button className={selected === index ? "active" : ""} key={view.name} onClick={() => { setGuided(true); setSelected(index); }}>{view.name}</button>)}
            </div>
          )}
          {propertyType === "loft" && !guided && (
            <div className="mobile-pad" aria-label="Controles de movimento">
              <button onPointerDown={() => hold("forward", true)} onPointerUp={() => hold("forward", false)}>↑</button>
              <button onPointerDown={() => hold("left", true)} onPointerUp={() => hold("left", false)}>←</button>
              <button onPointerDown={() => hold("back", true)} onPointerUp={() => hold("back", false)}>↓</button>
              <button onPointerDown={() => hold("right", true)} onPointerUp={() => hold("right", false)}>→</button>
            </div>
          )}
          <p className="tour-note">{propertyType === "kitnet" ? "Tour em vídeo real da kitnet." : "Visualização 3D conceitual do loft."}</p>
        </>
      )}
    </div>
  );
}
