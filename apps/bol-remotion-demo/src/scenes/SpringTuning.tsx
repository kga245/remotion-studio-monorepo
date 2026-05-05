import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors, typography } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

const LOOP_FRAMES = 90; // restart every 3s

type Preset = {
  label: string;
  config: { damping?: number; stiffness?: number; mass?: number };
  caption: string;
};

const PRESETS: Preset[] = [
  {
    label: "Smooth",
    config: { damping: 200 },
    caption: "{ damping: 200 } — no bounce",
  },
  {
    label: "Snappy",
    config: { damping: 20, stiffness: 200 },
    caption: "{ damping: 20, stiffness: 200 }",
  },
  {
    label: "Bouncy",
    config: { damping: 8 },
    caption: "{ damping: 8 } — playful",
  },
  {
    label: "Heavy",
    config: { damping: 15, stiffness: 80, mass: 2 },
    caption: "{ damping: 15, stiffness: 80, mass: 2 }",
  },
];

const Cell: React.FC<{ preset: Preset; localFrame: number; fps: number }> = ({
  preset,
  localFrame,
  fps,
}) => {
  const t = spring({
    frame: localFrame,
    fps,
    config: preset.config,
  });
  // Scale from 0.2 → 1.0 so the springiness is visually obvious.
  const scale = 0.2 + t * 0.8;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 32,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          width: 200,
          height: 200,
          background: colors.orange,
          borderRadius: 24,
          transform: `scale(${scale})`,
          boxShadow: `0 12px 32px ${colors.orange}55`,
        }}
      />
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            ...typography.h2,
            fontSize: 28,
            color: colors.graphite,
            marginBottom: 8,
          }}
        >
          {preset.label}
        </div>
        <div
          style={{
            fontSize: 16,
            opacity: 0.65,
            fontFeatureSettings: '"tnum"',
            fontFamily: "monospace",
          }}
        >
          {preset.caption}
        </div>
      </div>
    </div>
  );
};

export const SpringTuning: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const localFrame = frame % LOOP_FRAMES;

  return (
    <VignetteFrame
      beat="B · 03"
      capability="Spring physics, four presets"
      api="spring({ config })"
    >
      <AbsoluteFill
        style={{
          fontFamily,
          padding: "32px 0",
          color: colors.graphite,
        }}
      >
        <div style={{ display: "flex", height: "100%" }}>
          {PRESETS.map((preset, i) => (
            <Cell key={i} preset={preset} localFrame={localFrame} fps={fps} />
          ))}
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
