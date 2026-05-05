import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { fontFamily } from "../theme";

// 6 seconds = 180 frames
// "Boardroom level attention." Red/warning treatment.

export const ExistentialThreat: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Red alert pulse
  const alertPulse = interpolate(
    frame,
    [0, 15, 30, 45, 60, 75, 90],
    [0, 1, 0, 1, 0.4, 0.8, 0.4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // "WARNING" label flickers in
  const warnScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 300 },
    durationInFrames: 20,
  });

  // Main headline slams in
  const headlineScale = spring({
    frame: frame - 30,
    fps,
    config: { damping: 12, stiffness: 200, mass: 1.1 },
    durationInFrames: 35,
  });
  const headlineOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0a0306",
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 120px",
        gap: 32,
        overflow: "hidden",
      }}
    >
      {/* Red alert background pulse */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, #ef000022, transparent 70%)`,
          opacity: alertPulse,
          pointerEvents: "none",
        }}
      />

      {/* Top border pulse */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: "#ef4444",
          opacity: alertPulse * 0.8 + 0.2,
        }}
      />

      {/* WARNING tag */}
      <div
        style={{
          transform: `scale(${warnScale})`,
          background: "#ef4444",
          borderRadius: 4,
          padding: "8px 24px",
          fontSize: 22,
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
        }}
      >
        ⚠ PRIORITY ALERT
      </div>

      {/* Main headline */}
      <div
        style={{
          transform: `scale(${headlineScale})`,
          opacity: headlineOpacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          This demands
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#ef4444",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            textShadow: `0 0 40px #ef444466`,
          }}
        >
          boardroom
        </div>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
          }}
        >
          level attention.
        </div>
      </div>
    </AbsoluteFill>
  );
};
