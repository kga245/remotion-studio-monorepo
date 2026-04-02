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
// "Your brand is what people say about you when you're not in the room." — Jeff Bezos

export const BezosQuote: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Quote mark appears first
  const quoteMarkScale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 200 },
    durationInFrames: 25,
  });

  // Quote text builds word by word via character reveal
  const quoteText = "Your brand is what people say about you when you're not in the room.";
  const totalChars = quoteText.length;
  const charsVisible = interpolate(frame, [20, 110], [0, totalChars], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const visibleText = quoteText.slice(0, Math.round(charsVisible));

  // Attribution slides in
  const attrOpacity = interpolate(frame, [120, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const attrX = interpolate(frame, [120, 150], [-40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Underline rule grows
  const ruleWidth = interpolate(frame, [115, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });

  // Transition note fades in
  const noteOpacity = interpolate(frame, [175, 210], [0, 1], {
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
        padding: "80px 160px",
        gap: 32,
        overflow: "hidden",
      }}
    >
      {/* Background texture */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at 30% 40%, ${COLORS.orange}06, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      {/* Opening quote mark */}
      <div
        style={{
          fontSize: 200,
          fontWeight: 900,
          color: `${COLORS.orange}33`,
          lineHeight: 0.8,
          position: "absolute",
          top: 60,
          left: 100,
          transform: `scale(${quoteMarkScale})`,
          transformOrigin: "top left",
          fontFamily: "Georgia, serif",
        }}
      >
        "
      </div>

      {/* Quote text */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 300,
          color: "#ffffff",
          lineHeight: 1.4,
          textAlign: "center",
          letterSpacing: "0.01em",
          position: "relative",
          zIndex: 1,
        }}
      >
        <span style={{ color: "#ffffffdd" }}>{visibleText}</span>
        {/* Cursor */}
        {charsVisible < totalChars && (
          <span
            style={{
              display: "inline-block",
              width: 3,
              height: "0.9em",
              background: COLORS.orange,
              marginLeft: 2,
              verticalAlign: "middle",
              opacity: Math.sin(frame / 5) > 0 ? 1 : 0,
            }}
          />
        )}
      </div>

      {/* Rule line */}
      <div
        style={{
          width: `${ruleWidth * 60}%`,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.orange}, transparent)`,
        }}
      />

      {/* Attribution */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          opacity: attrOpacity,
          transform: `translateX(${attrX}px)`,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.orange,
            letterSpacing: "0.08em",
          }}
        >
          — Jeff Bezos
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 300,
            color: "#ffffff66",
            letterSpacing: "0.08em",
          }}
        >
          Founder, Amazon
        </div>
      </div>

      {/* Transition note */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          fontSize: 22,
          fontWeight: 400,
          color: COLORS.cyan,
          opacity: noteOpacity,
          textAlign: "center",
          letterSpacing: "0.04em",
        }}
      >
        The room has changed.
      </div>
    </AbsoluteFill>
  );
};
