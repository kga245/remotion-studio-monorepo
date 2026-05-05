import React from "react";
import {
  AbsoluteFill,
  Series,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors, typography } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// <Series> is sugar over <Sequence>: each child plays back-to-back. No manual
// `from` math — the runtime concatenates durations for you. With <Sequence>
// you'd write `from={0}`, `from={60}`, `from={120}` by hand and get them wrong
// once you change a duration. Series.Sequence siblings just stack.
const STEPS = [
  {
    label: "Brief",
    body: "What are we trying to say?",
    color: colors.cyan,
  },
  {
    label: "Build",
    body: "Compose, in code.",
    color: colors.orange,
  },
  {
    label: "Ship",
    body: "Render, deliver, repeat.",
    color: colors.cyan,
  },
];

const STEP_LEN = 60; // 2s per step at 30fps

const Step: React.FC<{
  label: string;
  body: string;
  color: string;
  index: number;
  total: number;
}> = ({ label, body, color, index, total }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 200 },
  });

  return (
    <AbsoluteFill
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 80,
        fontFamily,
      }}
    >
      <div
        style={{
          width: 900,
          padding: "56px 64px",
          background: "white",
          border: `3px solid ${color}`,
          borderRadius: 24,
          opacity: enter,
          transform: `translateY(${(1 - enter) * 28}px)`,
          boxShadow: `0 24px 48px rgba(53,61,80,0.10)`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            ...typography.h2,
            fontSize: 22,
            color,
            marginBottom: 16,
          }}
        >
          Step {index + 1} / {total}
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: colors.graphite,
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 300,
            color: colors.gray,
          }}
        >
          {body}
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SeriesSequence: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <VignetteFrame
      beat="C · 02"
      capability="Series.Sequence"
      api="<Series> automates from-frame math"
    >
      <AbsoluteFill style={{ fontFamily }}>
        {/* Three cards play one-after-another, no manual `from` math. */}
        <Series>
          {STEPS.map((step, i) => (
            <Series.Sequence key={i} durationInFrames={STEP_LEN}>
              <Step
                label={step.label}
                body={step.body}
                color={step.color}
                index={i}
                total={STEPS.length}
              />
            </Series.Sequence>
          ))}
        </Series>

        {/* Timeline ruler showing where the playhead is across the series. */}
        <div
          style={{
            position: "absolute",
            left: 60,
            right: 60,
            bottom: 32,
            height: 56,
          }}
        >
          {/* Baseline */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 18,
              height: 3,
              background: "rgba(53,61,80,0.10)",
              borderRadius: 2,
            }}
          />
          {/* Step segments */}
          {STEPS.map((step, i) => {
            const startPct = ((i * STEP_LEN) / durationInFrames) * 100;
            const widthPct = (STEP_LEN / durationInFrames) * 100;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${startPct}%`,
                  width: `${widthPct}%`,
                  top: 18,
                  height: 3,
                  background: step.color,
                  opacity: 0.6,
                }}
              />
            );
          })}
          {/* Playhead */}
          <div
            style={{
              position: "absolute",
              left: `${(frame / durationInFrames) * 100}%`,
              top: 0,
              width: 3,
              height: 40,
              background: colors.orange,
              borderRadius: 2,
              boxShadow: `0 0 16px ${colors.orange}99`,
            }}
          />
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
