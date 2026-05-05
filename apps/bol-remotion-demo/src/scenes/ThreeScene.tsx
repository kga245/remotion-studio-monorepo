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

const TorusKnot: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Two full rotations across the vignette, each axis at a different rate
  // so the knot doesn't appear flat from the camera.
  const rotY = interpolate(frame, [0, durationInFrames], [0, Math.PI * 2]);
  const rotX = interpolate(frame, [0, durationInFrames], [0, Math.PI * 1.4]);

  // Scale springs in at the top of the vignette, holds, then settles.
  const scaleIn = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 90, mass: 1 },
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.4} />
      <directionalLight
        position={[-5, -3, -2]}
        intensity={0.6}
        color="#7BEDF8"
      />
      <mesh rotation={[rotX, rotY, 0]} scale={scaleIn * 1.2}>
        <torusKnotGeometry args={[1, 0.32, 180, 24]} />
        <meshStandardMaterial
          color={colors.orange}
          metalness={0.6}
          roughness={0.25}
        />
      </mesh>
    </>
  );
};

export const ThreeScene: React.FC = () => {
  return (
    <VignetteFrame
      beat="07 / 07"
      capability="Real 3D, rendered per frame"
      api="@remotion/three  ·  react-three-fiber"
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
          camera={{ position: [0, 0, 4], fov: 45 }}
          gl={{ antialias: true }}
        >
          <TorusKnot />
        </ThreeCanvas>

        <div
          style={{
            position: "absolute",
            bottom: 80,
            fontSize: 22,
            opacity: 0.65,
            letterSpacing: "0.04em",
          }}
        >
          Three.js scene · frame-perfect, no playback drift
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
