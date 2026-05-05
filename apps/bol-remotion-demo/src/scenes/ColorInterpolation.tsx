import React from "react";
import {
  AbsoluteFill,
  interpolate,
  interpolateColors,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors, typography } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

const STOPS = [colors.cyan, colors.orange, colors.graphite, colors.cyan];

export const ColorInterpolation: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Interpolate across the palette over the full duration.
  const stopFrames = STOPS.map(
    (_, i) => (i / (STOPS.length - 1)) * durationInFrames,
  );

  const swatch = interpolateColors(frame, stopFrames, STOPS);

  // Show the current hex.
  const t = interpolate(frame, [0, durationInFrames], [0, STOPS.length - 1], {
    extrapolateRight: "clamp",
  });
  const lo = Math.floor(t);
  const hi = Math.min(lo + 1, STOPS.length - 1);
  const between = t - lo;
  const fromHex = STOPS[lo];
  const toHex = STOPS[hi];

  return (
    <VignetteFrame
      beat="B · 04"
      capability="Color interpolation"
      api="interpolateColors()"
    >
      <AbsoluteFill
        style={{
          fontFamily,
          padding: "24px 60px",
          color: colors.graphite,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 540,
            height: 540,
            borderRadius: 32,
            background: swatch,
            boxShadow: `0 24px 60px ${swatch}55`,
            transition: "none",
          }}
        />

        <div
          style={{
            marginTop: 56,
            display: "flex",
            alignItems: "center",
            gap: 32,
            fontFeatureSettings: '"tnum"',
          }}
        >
          <span style={{ ...typography.h2, fontSize: 24, opacity: 0.8 }}>
            {fromHex}
          </span>
          <span style={{ fontSize: 18, opacity: 0.5 }}>
            ──── {Math.round(between * 100)}% ────▶
          </span>
          <span style={{ ...typography.h2, fontSize: 24, opacity: 0.8 }}>
            {toHex}
          </span>
        </div>

        <div
          style={{
            marginTop: 24,
            fontSize: 18,
            opacity: 0.55,
            fontFamily: "monospace",
          }}
        >
          interpolateColors(frame, stops, [{STOPS.length} colors])
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
