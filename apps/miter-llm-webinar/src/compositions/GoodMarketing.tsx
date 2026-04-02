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
// "This isn't just an AI play. It's good marketing."

export const GoodMarketing: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Line 1 fades up
  const line1Opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });
  const line1Y = interpolate(frame, [0, 30], [30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Line 2 springs in with glow
  const line2Scale = spring({
    frame: frame - 50,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 35,
  });
  const line2Opacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow on "good marketing"
  const glow = interpolate(frame, [80, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Supporting bullets build
  const bullet1Op = interpolate(frame, [100, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bullet2Op = interpolate(frame, [118, 143], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const bullet3Op = interpolate(frame, [136, 161], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const bullets = [
    { text: "Great content that earns authority and trust.", op: bullet1Op },
    { text: "Consistent brand voice across every channel.", op: bullet2Op },
    { text: "Showing up wherever your customers seek answers.", op: bullet3Op },
  ];

  return (
    <AbsoluteFill
      style={{
        background: COLORS.dark,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 120px",
        gap: 40,
        overflow: "hidden",
      }}
    >
      {/* Background radial */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, ${COLORS.orange}${Math.round(glow * 8).toString(16).padStart(2, "0")}, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* Main copy */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 300,
            color: "#ffffffbb",
            opacity: line1Opacity,
            transform: `translateY(${line1Y}px)`,
            letterSpacing: "0.01em",
          }}
        >
          This isn't just an AI play.
        </div>

        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: COLORS.orange,
            opacity: line2Opacity,
            transform: `scale(${line2Scale})`,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            textShadow: `0 0 ${glow * 60}px ${COLORS.orange}66`,
          }}
        >
          It's good marketing.
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: interpolate(glow, [0, 1], [0, 500]),
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.orange}66, transparent)`,
        }}
      />

      {/* Supporting bullets */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          alignItems: "center",
        }}
      >
        {bullets.map(({ text, op }) => (
          <div
            key={text}
            style={{
              opacity: op,
              fontSize: 28,
              fontWeight: 300,
              color: "#ffffffaa",
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <span style={{ color: COLORS.orange, fontSize: 20 }}>●</span>
            {text}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
