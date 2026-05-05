import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { ThreeCanvas } from "@remotion/three";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// 12 small spheres orbiting around a central larger sphere. Alternating brand
// colors. Demonstrates: multi-mesh scenes, parametric placement on a circle,
// per-mesh material colors driven by index.
const RING_COUNT = 12;
const RING_RADIUS = 2.6;
const SPHERE_RADIUS = 0.32;
const ORBIT_SPEED = (Math.PI * 2) / 240; // one full orbit per 8s at 30fps

// Alternate cyan/orange/cyan around the ring with graphite center.
const ringColor = (i: number): string => {
  const cycle = i % 3;
  if (cycle === 0) return colors.orange;
  if (cycle === 1) return colors.cyan;
  return colors.lightGray;
};

const Field: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rotation = frame * ORBIT_SPEED;
  const settle = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 90 },
  });
  // Camera-style tilt so we see the ring as a 3D object, not a 2D circle.
  const tiltY = interpolate(frame, [0, 240], [-0.1, 0.4]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 8, 5]} intensity={1.3} />
      <directionalLight
        position={[-5, -3, -2]}
        intensity={0.5}
        color={colors.cyan}
      />

      {/* Central sphere — graphite base */}
      <mesh scale={settle * 1.0} rotation={[0, tiltY, 0]}>
        <sphereGeometry args={[1.0, 48, 48]} />
        <meshStandardMaterial
          color={colors.graphite}
          metalness={0.55}
          roughness={0.3}
        />
      </mesh>

      {/* Ring of orbiting spheres */}
      {Array.from({ length: RING_COUNT }).map((_, i) => {
        const baseAngle = (i / RING_COUNT) * Math.PI * 2;
        const angle = baseAngle + rotation;
        // Add a small Y bob so the ring undulates slightly during rotation.
        const bob = Math.sin(angle * 2 + frame * 0.04) * 0.18;
        const x = Math.cos(angle) * RING_RADIUS;
        const z = Math.sin(angle) * RING_RADIUS;
        const enter = spring({
          frame: frame - i * 3,
          fps,
          config: { damping: 16, stiffness: 120 },
        });
        return (
          <mesh
            key={i}
            position={[x, bob, z]}
            rotation={[0, tiltY, 0]}
            scale={enter * 1.0}
          >
            <sphereGeometry args={[SPHERE_RADIUS, 24, 24]} />
            <meshStandardMaterial
              color={ringColor(i)}
              metalness={0.4}
              roughness={0.35}
            />
          </mesh>
        );
      })}
    </>
  );
};

export const ThreeOrbitField: React.FC = () => {
  return (
    <VignetteFrame
      beat="H · 03"
      capability="Orbital field"
      api="parametric mesh placement, per-index brand color"
      tone="dark"
    >
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
        }}
      >
        <ThreeCanvas
          width={1280}
          height={720}
          camera={{ position: [0, 1.8, 5.2], fov: 45 }}
          gl={{ antialias: true }}
        >
          <Field />
        </ThreeCanvas>

        <div
          style={{
            position: "absolute",
            bottom: 80,
            fontSize: 22,
            opacity: 0.65,
            color: "white",
            letterSpacing: "0.04em",
          }}
        >
          12 satellites · alternating brand colors · single graphite core
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
