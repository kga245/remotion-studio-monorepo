import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 6 seconds = 180 frames
// "LLMs are now that room." Dark, dramatic reveal

export const LLMsAreRoom: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "LLMs are now" builds
  const line1Opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const line1Y = interpolate(frame, [0, 30], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // "that room." springs in dramatically
  const roomScale = spring({
    frame: frame - 45,
    fps,
    config: { damping: 10, stiffness: 160, mass: 1.3 },
    durationInFrames: 45,
  });
  const roomOpacity = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flash on "room." appearance
  const flash = interpolate(frame, [45, 48, 58], [0, 0.15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow builds on "room."
  const roomGlow = interpolate(frame, [60, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Context line fades in
  const contextOpacity = interpolate(frame, [110, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contextY = interpolate(frame, [110, 145], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Vignette pulse
  const vignette = interpolate(frame, [45, 90], [0.3, 0.7], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#04040a",
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        overflow: "hidden",
      }}
    >
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 20%, #000000 100%)`,
          opacity: vignette,
          pointerEvents: "none",
        }}
      />

      {/* Flash */}
      <AbsoluteFill
        style={{
          background: "#ffffff",
          opacity: flash,
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* "LLMs are now" */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 300,
            color: "#ffffffbb",
            letterSpacing: "0.02em",
            opacity: line1Opacity,
            transform: `translateY(${line1Y}px)`,
          }}
        >
          LLMs are now
        </div>

        {/* "that room." */}
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: COLORS.orange,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            transform: `scale(${roomScale})`,
            opacity: roomOpacity,
            textShadow: `0 0 ${roomGlow * 80}px ${COLORS.orange}88`,
          }}
        >
          that room.
        </div>
      </div>

      {/* Context */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          opacity: contextOpacity,
          transform: `translateY(${contextY}px)`,
          fontSize: 30,
          fontWeight: 300,
          color: "#ffffff77",
          textAlign: "center",
          letterSpacing: "0.04em",
        }}
      >
        Billions of conversations. Zero people watching.
        <br />
        <span style={{ color: COLORS.cyan }}>
          Except the brands who optimized to be there.
        </span>
      </div>
    </AbsoluteFill>
  );
};
