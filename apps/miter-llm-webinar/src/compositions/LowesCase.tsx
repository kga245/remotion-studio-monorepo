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
// "Product to Project" paradigm shift card

export const LowesCase: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header fades in
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Old card slides in from left
  const oldCardX = interpolate(frame, [15, 50], [-400, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const oldCardOpacity = interpolate(frame, [15, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Arrow grows
  const arrowScale = spring({
    frame: frame - 60,
    fps,
    config: { damping: 20, stiffness: 200 },
    durationInFrames: 25,
  });

  // New card slides in from right — glowing, bold
  const newCardX = interpolate(frame, [75, 110], [400, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const newCardOpacity = interpolate(frame, [75, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Insight line fades in
  const insightOpacity = interpolate(frame, [130, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const insightY = interpolate(frame, [130, 165], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Orange glow pulse on new card
  const glowPulse = interpolate(frame, [110, 160, 210], [0, 1, 0.6], {
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
        padding: "60px 80px",
        gap: 48,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          fontSize: 26,
          fontWeight: 400,
          color: COLORS.orange,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: headerOpacity,
          textAlign: "center",
        }}
      >
        The Lowe's Paradigm Shift
      </div>

      {/* Cards row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 48,
          width: "100%",
        }}
      >
        {/* Old way card */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${oldCardX}px)`,
            opacity: oldCardOpacity,
            padding: "48px 40px",
            border: `1px solid ${COLORS.graphite}`,
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            filter: "grayscale(0.6)",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: "#ffffff44",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Old Model
          </div>
          <div
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: "#ffffff55",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Sell
            <br />
            Products
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 300,
              color: "#ffffff44",
              lineHeight: 1.5,
            }}
          >
            "Here's what we carry."
            <br />
            SKUs, specs, prices.
          </div>
        </div>

        {/* Arrow */}
        <div
          style={{
            fontSize: 56,
            color: COLORS.orange,
            transform: `scale(${arrowScale})`,
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          →
        </div>

        {/* New way card */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${newCardX}px)`,
            opacity: newCardOpacity,
            padding: "48px 40px",
            border: `2px solid ${COLORS.orange}`,
            borderRadius: 8,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            background: `${COLORS.orange}${Math.round(glowPulse * 12)
              .toString(16)
              .padStart(2, "0")}`,
            boxShadow: `0 0 ${glowPulse * 60}px ${COLORS.orange}44`,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: COLORS.orange,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            New Model
          </div>
          <div
            style={{
              fontSize: 60,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Enable
            <br />
            Projects
          </div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 300,
              color: "#ffffffcc",
              lineHeight: 1.5,
            }}
          >
            "Here's how to remodel your kitchen."
            <br />
            Guides, how-tos, expert answers.
          </div>
        </div>
      </div>

      {/* Insight */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 400,
          color: COLORS.cyan,
          textAlign: "center",
          opacity: insightOpacity,
          transform: `translateY(${insightY}px)`,
          letterSpacing: "0.02em",
          fontStyle: "italic",
        }}
      >
        LLMs answer "how do I?" — not "what do you sell?"
      </div>
    </AbsoluteFill>
  );
};
