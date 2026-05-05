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

// Three brand-colored cubes stacked, rotating in unison around the Y axis,
// each with a slight Z offset so the stacking reads with parallax.
// Demonstrates: per-mesh material colors driven directly by theme tokens.
const CUBES = [
  { color: colors.cyan, y: 1.2 },
  { color: colors.orange, y: 0 },
  { color: colors.graphite, y: -1.2 },
];

const Stack: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const rotY = interpolate(frame, [0, durationInFrames], [0, Math.PI * 1.5]);
  const settle = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 1 },
  });

  return (
    <>
      <ambientLight intensity={0.45} />
      <directionalLight position={[6, 8, 5]} intensity={1.4} />
      <directionalLight
        position={[-5, -2, -3]}
        intensity={0.55}
        color={colors.cyan}
      />
      {CUBES.map((c, i) => {
        const cubeIn = spring({
          frame: frame - i * 6,
          fps,
          config: { damping: 14, stiffness: 130 },
        });
        const scale = cubeIn * 0.92;
        return (
          <mesh
            key={i}
            position={[0, c.y * settle, 0]}
            rotation={[0, rotY, rotY * 0.15]}
            scale={scale}
          >
            <boxGeometry args={[1.6, 1.0, 1.6]} />
            <meshStandardMaterial
              color={c.color}
              metalness={0.35}
              roughness={0.4}
            />
          </mesh>
        );
      })}
    </>
  );
};

export const ThreeStack: React.FC = () => {
  return (
    <VignetteFrame
      beat="H · 02"
      capability="Brand-tinted 3D stack"
      api="<ThreeCanvas>  ·  meshStandardMaterial color={...}"
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
          camera={{ position: [0, 0, 6], fov: 42 }}
          gl={{ antialias: true }}
        >
          <Stack />
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
          Three meshes · cyan · orange · graphite · per-mesh material colors
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
