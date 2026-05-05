import React from "react";
import {
  AbsoluteFill,
  Easing,
  Freeze,
  interpolate,
  Loop,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors, typography } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// Three columns demonstrating two related Remotion building blocks:
//   <Loop> — repeat a child component N times within its parent timeline.
//   <Freeze frame={n}> — render a child as if useCurrentFrame() always returns n.
//
// All three columns host the same Pulse animation (a ball that scales up via
// spring then settles, lasting 60 frames). Each column applies a different
// wrapper so staff can see the difference at a glance.

const PULSE_LEN = 60; // frames

const Pulse: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // A jump: scale balloons fast, then settles back to rest.
  const jumpUp = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 200 },
  });
  const jumpDown = interpolate(frame, [30, 55], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.cubic),
  });
  const t = jumpUp - (1 - jumpDown);
  const scale = 0.4 + Math.max(0, t) * 0.7;
  const lift = -t * 80;

  return (
    <div
      style={{
        width: 220,
        height: 220,
        borderRadius: 110,
        background: colors.orange,
        boxShadow: `0 ${20 + t * 30}px ${30 + t * 30}px ${colors.orange}55`,
        transform: `translateY(${lift}px) scale(${scale})`,
      }}
    />
  );
};

const Column: React.FC<{
  label: string;
  api: string;
  caption: string;
  children: React.ReactNode;
  accent?: string;
}> = ({ label, api, caption, children, accent = colors.orange }) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 20,
      padding: 24,
      borderRight: `1px solid rgba(53,61,80,0.10)`,
    }}
  >
    {/* Label */}
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          ...typography.h2,
          fontSize: 18,
          color: accent,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 16,
          fontFamily: "monospace",
          opacity: 0.6,
          marginTop: 4,
        }}
      >
        {api}
      </div>
    </div>

    {/* Stage area */}
    <div
      style={{
        flex: 1,
        width: "100%",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(53,61,80,0.04)",
        borderRadius: 16,
      }}
    >
      {children}
    </div>

    <div
      style={{
        fontSize: 16,
        opacity: 0.7,
        textAlign: "center",
        maxWidth: 260,
      }}
    >
      {caption}
    </div>
  </div>
);

export const LoopFreeze: React.FC = () => {
  return (
    <VignetteFrame
      beat="C · 03"
      capability="Loop and Freeze"
      api="<Loop>  ·  <Freeze frame>"
    >
      <AbsoluteFill
        style={{
          fontFamily,
          padding: "20px 40px 40px",
          color: colors.graphite,
          flexDirection: "row",
        }}
      >
        <Column
          label="NORMAL"
          api="<Pulse />"
          caption="Plays once over 60 frames, then sits at the final frame."
          accent={colors.gray}
        >
          <Pulse />
        </Column>

        <Column
          label="LOOPED 3×"
          api="<Loop times={3}>"
          caption="<Loop> repeats the same animation three times in succession."
        >
          <Loop durationInFrames={PULSE_LEN} times={3} layout="none">
            <Pulse />
          </Loop>
        </Column>

        <Column
          label="FROZEN @15"
          api="<Freeze frame={15}>"
          caption="<Freeze> pins useCurrentFrame() to 15. The animation never moves."
          accent={colors.cyan}
        >
          <Freeze frame={15}>
            <Pulse />
          </Freeze>
        </Column>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
