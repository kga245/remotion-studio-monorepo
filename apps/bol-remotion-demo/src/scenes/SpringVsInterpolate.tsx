import React from "react";
import {
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors, typography } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

const TRACK_TOP = 80; // px down from content area top
const FALL_DISTANCE = 520; // px the dot travels
const REPLAY_EVERY = 90; // frames — lets staff see the difference twice

const Track: React.FC<{
  label: string;
  caption: string;
  y: number;
  color: string;
  align: "left" | "right";
}> = ({ label, caption, y, color, align }) => {
  return (
    <div
      style={{
        flex: 1,
        position: "relative",
        padding: "32px 48px",
      }}
    >
      <div
        style={{
          ...typography.h2,
          fontSize: 22,
          color,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          ...typography.body,
          fontSize: 18,
          opacity: 0.7,
          marginBottom: 32,
        }}
      >
        {caption}
      </div>

      {/* Track guide line */}
      <div
        style={{
          position: "absolute",
          top: TRACK_TOP + 60,
          [align === "left" ? "left" : "right"]: 80,
          width: 2,
          height: FALL_DISTANCE + 80,
          background: "rgba(53,61,80,0.10)",
        }}
      />

      {/* Animated dot */}
      <div
        style={{
          position: "absolute",
          top: TRACK_TOP + 60 + y - 24,
          [align === "left" ? "left" : "right"]: 80 - 22,
          width: 48,
          height: 48,
          borderRadius: 24,
          background: color,
          boxShadow: `0 8px 24px ${color}55`,
        }}
      />

      {/* Target line */}
      <div
        style={{
          position: "absolute",
          top: TRACK_TOP + 60 + FALL_DISTANCE,
          [align === "left" ? "left" : "right"]: 56,
          width: 50,
          height: 2,
          background: color,
          opacity: 0.4,
        }}
      />
    </div>
  );
};

export const SpringVsInterpolate: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Loop both animations so staff sees them twice — comparison is clearer.
  const local = frame % REPLAY_EVERY;

  const springT = spring({
    frame: local,
    fps,
    config: { damping: 12, stiffness: 200, mass: 0.8 },
  });
  const interpT = interpolate(local, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const springY = springT * FALL_DISTANCE;
  const interpY = interpT * FALL_DISTANCE;

  return (
    <VignetteFrame
      beat="02 / 07"
      capability="Spring vs interpolate"
      api="spring()  ·  interpolate()"
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          fontFamily,
        }}
      >
        <Track
          label="PHYSICS"
          caption="Mass, damping, stiffness — overshoots and settles."
          y={springY}
          color={colors.orange}
          align="left"
        />
        <div
          style={{
            width: 1,
            background: "rgba(53,61,80,0.08)",
            margin: "32px 0",
          }}
        />
        <Track
          label="EASING CURVE"
          caption="Explicit start, end, and curve — predictable timing."
          y={interpY}
          color={colors.graphite}
          align="right"
        />
      </div>
    </VignetteFrame>
  );
};
