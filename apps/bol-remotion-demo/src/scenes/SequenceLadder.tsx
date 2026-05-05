import React from "react";
import {
  AbsoluteFill,
  Sequence,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors, typography } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// Five staggered <Sequence>s, each entering at a different `from` frame.
// The bottom ruler labels each from-point so the staggered ladder is legible.
const STAGGER = [
  { from: 12, label: "Brief", color: colors.cyan },
  { from: 36, label: "Concept", color: colors.cyan },
  { from: 60, label: "Build", color: colors.orange },
  { from: 84, label: "Review", color: colors.cyan },
  { from: 108, label: "Ship", color: colors.orange },
];

const Card: React.FC<{ index: number; label: string; color: string }> = ({
  index,
  label,
  color,
}) => {
  // Inside a <Sequence>, useCurrentFrame is local (starts at 0).
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 200 },
  });

  return (
    <div
      style={{
        flex: 1,
        opacity: enter,
        transform: `translateY(${(1 - enter) * 28}px) scale(${0.85 + enter * 0.15})`,
        background: "white",
        border: `2px solid ${color}`,
        borderRadius: 16,
        padding: "24px 16px",
        textAlign: "center",
        boxShadow: `0 12px 28px rgba(53,61,80,0.10)`,
      }}
    >
      <div
        style={{
          ...typography.h2,
          fontSize: 18,
          color,
          marginBottom: 8,
        }}
      >
        Step {index + 1}
      </div>
      <div
        style={{
          fontSize: 36,
          fontWeight: 700,
          color: colors.graphite,
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const SequenceLadder: React.FC = () => {
  const { durationInFrames } = useVideoConfig();

  return (
    <VignetteFrame
      beat="C · 01"
      capability="Staggered Sequences"
      api="<Sequence from={...}>"
    >
      <AbsoluteFill
        style={{
          fontFamily,
          padding: "40px 60px",
          color: colors.graphite,
          flexDirection: "column",
          gap: 40,
        }}
      >
        {/* Cards row */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "stretch",
            gap: 20,
          }}
        >
          {STAGGER.map((s, i) => (
            <Sequence
              key={i}
              from={s.from}
              durationInFrames={durationInFrames - s.from}
              layout="none"
            >
              <Card index={i} label={s.label} color={s.color} />
            </Sequence>
          ))}
        </div>

        {/* Ruler */}
        <div
          style={{
            position: "relative",
            height: 60,
            margin: "0 8px",
          }}
        >
          {/* Baseline */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 12,
              height: 2,
              background: "rgba(53,61,80,0.15)",
            }}
          />
          {STAGGER.map((s, i) => {
            const leftPct = (s.from / durationInFrames) * 100;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${leftPct}%`,
                  top: 0,
                  transform: "translateX(-50%)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 4,
                    height: 24,
                    background: s.color,
                    margin: "0 auto",
                  }}
                />
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 14,
                    fontFeatureSettings: '"tnum"',
                    opacity: 0.6,
                  }}
                >
                  from={s.from}
                </div>
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
