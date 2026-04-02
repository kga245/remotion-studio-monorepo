import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 8 seconds at 30fps = 240 frames
// Giant "85%" kinetic stat with subtitle

export const Stat85: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Giant number springs in with heavy bounce
  const numberScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 180, mass: 1.2 },
    durationInFrames: 40,
  });

  // Percent sign slightly delayed
  const percentScale = spring({
    frame: frame - 8,
    fps,
    config: { damping: 15, stiffness: 200 },
    durationInFrames: 35,
  });

  // Line 1 subtitle slides up
  const sub1Y = interpolate(frame, [40, 70], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const sub1Opacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Line 2 subtitle slides up
  const sub2Y = interpolate(frame, [60, 90], [60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const sub2Opacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Accent line below number
  const lineWidth = interpolate(frame, [25, 55], [0, 340], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  // Background flash on slam
  const bgFlash = interpolate(frame, [0, 4, 12], [0.15, 0.08, 0], {
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
      {/* Background flash overlay */}
      <AbsoluteFill
        style={{
          background: COLORS.orange,
          opacity: bgFlash,
          pointerEvents: "none",
        }}
      />

      {/* Subtle grid lines */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${COLORS.graphite}22 1px, transparent 1px), linear-gradient(90deg, ${COLORS.graphite}22 1px, transparent 1px)`,
          backgroundSize: "120px 120px",
          pointerEvents: "none",
        }}
      />

      {/* Main stat container */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
        }}
      >
        {/* The giant "85%" */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontSize: 320,
              fontWeight: 900,
              color: COLORS.orange,
              transform: `scale(${numberScale})`,
              display: "inline-block",
              letterSpacing: "-0.04em",
              lineHeight: 0.85,
            }}
          >
            85
          </span>
          <span
            style={{
              fontSize: 160,
              fontWeight: 900,
              color: "#ffffff",
              transform: `scale(${percentScale})`,
              display: "inline-block",
              marginTop: 32,
              letterSpacing: "-0.02em",
            }}
          >
            %
          </span>
        </div>

        {/* Accent line */}
        <div
          style={{
            height: 4,
            width: lineWidth,
            background: `linear-gradient(90deg, ${COLORS.orange}, ${COLORS.cyan})`,
            borderRadius: 2,
            marginTop: 8,
            marginBottom: 32,
          }}
        />

        {/* Subtitle line 1 */}
        <div
          style={{
            transform: `translateY(${sub1Y}px)`,
            opacity: sub1Opacity,
            fontSize: 56,
            fontWeight: 300,
            color: "#ffffff",
            letterSpacing: "0.02em",
            textAlign: "center",
          }}
        >
          of consumers now use AI
        </div>

        {/* Subtitle line 2 */}
        <div
          style={{
            transform: `translateY(${sub2Y}px)`,
            opacity: sub2Opacity,
            fontSize: 56,
            fontWeight: 700,
            color: COLORS.cyan,
            letterSpacing: "0.02em",
            textAlign: "center",
            marginTop: 8,
          }}
        >
          in their buying process.
        </div>
      </div>
    </AbsoluteFill>
  );
};
