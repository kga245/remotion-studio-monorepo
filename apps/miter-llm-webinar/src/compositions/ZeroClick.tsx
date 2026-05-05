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
// "60% of searches result in ZERO clicks." — ZERO is the visual punch

export const ZeroClick: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "60% of searches result in" builds in
  const leadOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const leadY = interpolate(frame, [0, 25], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // "ZERO" EXPLODES — spring from tiny with bounce
  const zeroScale = spring({
    frame: frame - 35,
    fps,
    config: { damping: 8, stiffness: 120, mass: 1.5 },
    durationInFrames: 50,
  });
  const zeroOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "clicks." follows after ZERO settles
  const clicksOpacity = interpolate(frame, [90, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const clicksX = interpolate(frame, [90, 115], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Glow pulse on ZERO (after it settles)
  const glowPulse = interpolate(
    frame,
    [80, 110, 140, 170, 200],
    [0, 1, 0.4, 0.9, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const glowSize = interpolate(glowPulse, [0, 1], [0, 80]);

  // Background flash on ZERO impact
  const bgFlash = interpolate(frame, [35, 38, 50], [0, 0.12, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.dark,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Flash overlay */}
      <AbsoluteFill
        style={{
          background: "#ffffff",
          opacity: bgFlash,
          pointerEvents: "none",
        }}
      />

      {/* Main content stack */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        {/* Lead-in line */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 300,
            color: "#ffffffcc",
            letterSpacing: "0.02em",
            transform: `translateY(${leadY}px)`,
            opacity: leadOpacity,
            textAlign: "center",
          }}
        >
          60% of searches result in
        </div>

        {/* ZERO — the visual punch */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Glow behind ZERO */}
          <div
            style={{
              position: "absolute",
              width: 600 + glowSize * 2,
              height: 280 + glowSize,
              borderRadius: "50%",
              background: `radial-gradient(ellipse, ${COLORS.orange}${Math.round(
                glowPulse * 50,
              )
                .toString(16)
                .padStart(2, "0")}, transparent 70%)`,
              filter: "blur(40px)",
              opacity: zeroOpacity,
            }}
          />

          <div
            style={{
              fontSize: 280,
              fontWeight: 900,
              color: COLORS.orange,
              letterSpacing: "-0.06em",
              lineHeight: 0.9,
              transform: `scale(${zeroScale})`,
              opacity: zeroOpacity,
              position: "relative",
              zIndex: 1,
            }}
          >
            ZERO
          </div>
        </div>

        {/* "clicks." */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            letterSpacing: "-0.01em",
            transform: `translateX(${clicksX}px)`,
            opacity: clicksOpacity,
          }}
        >
          clicks.
        </div>
      </div>
    </AbsoluteFill>
  );
};
