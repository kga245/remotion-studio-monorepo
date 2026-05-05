import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { colors, semantic, typography } from "../styles/theme";

type Tone = "light" | "dark";

type Props = {
  beat: string;
  capability: string;
  api: string;
  tone?: Tone;
  children: React.ReactNode;
};

// Shared header bar for capability vignettes. Keeps the demo visually unified
// while the content area is free to be radically different per capability.
export const VignetteFrame: React.FC<Props> = ({
  beat,
  capability,
  api,
  tone = "light",
  children,
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
  });

  const barHeight = 96;
  const onDark = tone === "dark";
  const background = onDark ? semantic.bgDark : semantic.bgWhite;
  const textColor = onDark ? semantic.textOnDark : semantic.textOnLight;
  const subtleLine = onDark ? "rgba(255,255,255,0.08)" : "rgba(53,61,80,0.10)";

  return (
    <AbsoluteFill style={{ background, color: textColor }}>
      {/* Header bar */}
      <div
        style={{
          height: barHeight,
          padding: "0 56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: `1px solid ${subtleLine}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span
            style={{
              ...typography.h2,
              fontSize: 18,
              color: colors.orange,
            }}
          >
            BOL · Motion demo
          </span>
          <span
            style={{
              ...typography.body,
              fontSize: 16,
              opacity: 0.6,
            }}
          >
            {beat}
          </span>
        </div>
        <div
          style={{
            ...typography.h2,
            fontSize: 18,
            opacity: 0.7,
          }}
        >
          {api}
        </div>
      </div>

      {/* Capability headline */}
      <div
        style={{
          padding: "32px 56px 0",
          ...typography.h1,
          fontSize: 56,
          letterSpacing: "-0.02em",
        }}
      >
        {capability}
      </div>

      {/* Content area */}
      <div style={{ flex: 1, position: "relative" }}>{children}</div>

      {/* Progress strip */}
      <div
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          height: 4,
          width: `${progress * 100}%`,
          background: colors.orange,
        }}
      />
    </AbsoluteFill>
  );
};
