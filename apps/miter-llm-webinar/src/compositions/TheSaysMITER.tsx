import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 7 seconds = 210 frames
// "The AI says MITER." — MITER glows, pulses, dominates.

export const TheSaysMITER: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "The AI says" fades in quietly
  const prefixOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const prefixY = interpolate(frame, [0, 30], [20, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // MITER springs in with massive impact
  const miterScale = spring({
    frame: frame - 40,
    fps,
    config: { damping: 10, stiffness: 140, mass: 1.4 },
    durationInFrames: 55,
  });
  const miterOpacity = interpolate(frame, [40, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Flash on impact
  const flash = interpolate(frame, [40, 43, 55], [0, 0.2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow intensifies and pulses
  const glowBase = interpolate(frame, [55, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glowPulse = Math.sin((frame - 80) / 20) * 0.15 + 0.85;
  const glow = glowBase * (frame > 80 ? glowPulse : 1);

  // "." appears after MITER settles
  const dotOpacity = interpolate(frame, [95, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Context line at bottom
  const contextOpacity = interpolate(frame, [130, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const contextY = interpolate(frame, [130, 160], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Second context line
  const context2Opacity = interpolate(frame, [160, 185], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Background glow bloom
  const bloomSize = interpolate(glow, [0, 1], [0, 400]);

  return (
    <AbsoluteFill
      style={{
        background: "#04040c",
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
        overflow: "hidden",
      }}
    >
      {/* Background glow bloom */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse ${bloomSize * 2}px ${bloomSize}px at 50% 45%, ${COLORS.orange}22, transparent)`,
          pointerEvents: "none",
        }}
      />

      {/* Flash overlay */}
      <AbsoluteFill
        style={{
          background: "#ffffff",
          opacity: flash,
          pointerEvents: "none",
        }}
      />

      {/* Main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* "The AI says" */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 300,
            color: "#ffffffbb",
            letterSpacing: "0.04em",
            opacity: prefixOpacity,
            transform: `translateY(${prefixY}px)`,
          }}
        >
          The AI says
        </div>

        {/* MITER + period */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            lineHeight: 0.9,
          }}
        >
          <div
            style={{
              fontSize: 240,
              fontWeight: 900,
              color: COLORS.orange,
              letterSpacing: "-0.04em",
              transform: `scale(${miterScale})`,
              opacity: miterOpacity,
              textShadow: `
                0 0 ${glow * 40}px ${COLORS.orange}cc,
                0 0 ${glow * 80}px ${COLORS.orange}88,
                0 0 ${glow * 160}px ${COLORS.orange}44
              `,
              lineHeight: 0.9,
            }}
          >
            MITER
          </div>
          <div
            style={{
              fontSize: 200,
              fontWeight: 900,
              color: COLORS.orange,
              opacity: dotOpacity * miterOpacity,
              lineHeight: 0.9,
              marginBottom: 8,
              textShadow: `0 0 ${glow * 40}px ${COLORS.orange}cc`,
            }}
          >
            .
          </div>
        </div>
      </div>

      {/* Context lines */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: "#ffffffaa",
            opacity: contextOpacity,
            transform: `translateY(${contextY}px)`,
            textAlign: "center",
          }}
        >
          That's the goal. That's the destination.
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 300,
            color: COLORS.cyan,
            opacity: context2Opacity,
            textAlign: "center",
            letterSpacing: "0.04em",
          }}
        >
          GEO gets you there.
        </div>
      </div>
    </AbsoluteFill>
  );
};
