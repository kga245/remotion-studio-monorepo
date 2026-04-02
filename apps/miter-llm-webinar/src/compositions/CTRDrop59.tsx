import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 8 seconds = 240 frames
// Position 1 CTR collapse: 27% → 11%, 59% drop headline

export const CTRDrop59: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-60): show "then" stat 27%
  // Phase 2 (60-120): transition — 27% shrinks/fades, 11% grows
  // Phase 3 (130+): "59% DROP" headline slams in

  // "Then" label fade in
  const thenOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Old number (27%) — scales down and fades out
  const oldScale = interpolate(frame, [60, 100], [1, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const oldOpacity = interpolate(frame, [60, 100], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // New number (11%) — springs in from small
  const newScale = spring({
    frame: frame - 75,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 35,
  });
  const newOpacity = interpolate(frame, [75, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "NOW" label
  const nowOpacity = interpolate(frame, [80, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Arrow between them
  const arrowOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // 59% DROP headline
  const dropScale = spring({
    frame: frame - 130,
    fps,
    config: { damping: 10, stiffness: 250, mass: 0.9 },
    durationInFrames: 40,
  });
  const dropOpacity = interpolate(frame, [130, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Context subtitle
  const contextOpacity = interpolate(frame, [155, 180], [0, 1], {
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
        gap: 0,
        overflow: "hidden",
      }}
    >
      {/* Top label */}
      <div
        style={{
          position: "absolute",
          top: 60,
          fontSize: 24,
          fontWeight: 400,
          color: COLORS.graphite,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: thenOpacity,
        }}
      >
        Position One Click-Through Rate
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 60,
          marginBottom: 60,
        }}
      >
        {/* Old stat: 27% */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: "#ffffff66",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              opacity: thenOpacity,
            }}
          >
            Then
          </div>
          <div
            style={{
              fontSize: 180,
              fontWeight: 900,
              color: "#ffffff44",
              lineHeight: 1,
              letterSpacing: "-0.05em",
              transform: `scale(${oldScale})`,
              opacity: oldOpacity,
              transformOrigin: "center center",
            }}
          >
            27%
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            fontSize: 60,
            color: COLORS.orange,
            opacity: arrowOpacity,
            fontWeight: 900,
          }}
        >
          →
        </div>

        {/* New stat: 11% */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 400,
              color: COLORS.orange,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              opacity: nowOpacity,
            }}
          >
            Now
          </div>
          <div
            style={{
              fontSize: 180,
              fontWeight: 900,
              color: COLORS.orange,
              lineHeight: 1,
              letterSpacing: "-0.05em",
              transform: `scale(${newScale})`,
              opacity: newOpacity,
              transformOrigin: "center center",
            }}
          >
            11%
          </div>
        </div>
      </div>

      {/* 59% DROP headline */}
      <div
        style={{
          transform: `scale(${dropScale})`,
          opacity: dropOpacity,
          display: "flex",
          alignItems: "baseline",
          gap: 24,
        }}
      >
        <span
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#ff3333",
            letterSpacing: "-0.04em",
            lineHeight: 1,
          }}
        >
          59%
        </span>
        <span
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          DROP
        </span>
      </div>

      {/* Context subtitle */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          opacity: contextOpacity,
          fontSize: 28,
          fontWeight: 300,
          color: "#ffffff88",
          letterSpacing: "0.04em",
          textAlign: "center",
        }}
      >
        AI Overviews are absorbing the clicks that used to go to position one.
      </div>
    </AbsoluteFill>
  );
};
