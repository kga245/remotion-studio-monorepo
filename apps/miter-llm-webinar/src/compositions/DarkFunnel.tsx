import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 9 seconds = 270 frames
// User journey from LLM chat to browser search — broken attribution

export const DarkFunnel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Step 1: LLM Chat
  const step1Scale = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 180 },
    durationInFrames: 30,
  });

  // Arrow 1
  const arrow1 = interpolate(frame, [35, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Step 2: "No click, answer given"
  const step2Scale = spring({
    frame: frame - 55,
    fps,
    config: { damping: 20, stiffness: 180 },
    durationInFrames: 30,
  });

  // The "BREAK" — broken link visualization
  const breakOpacity = interpolate(frame, [90, 115], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const breakShake = interpolate(
    frame,
    [90, 93, 96, 99, 102],
    [0, -6, 4, -2, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  // Dotted arrow (broken)
  const arrow2 = interpolate(frame, [95, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Step 3: Browser search
  const step3Scale = spring({
    frame: frame - 115,
    fps,
    config: { damping: 20, stiffness: 180 },
    durationInFrames: 30,
  });

  // Attribution crossed out
  const crossOpacity = interpolate(frame, [145, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Insight
  const insightOpacity = interpolate(frame, [185, 215], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const insightY = interpolate(frame, [185, 215], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const stepStyle = (
    scale: number,
    color: string,
    dim?: boolean,
  ): React.CSSProperties => ({
    padding: "32px 36px",
    background: dim ? `${COLORS.graphite}22` : `${color}22`,
    border: `2px solid ${dim ? COLORS.graphite : color}`,
    borderRadius: 12,
    display: "flex",
    flexDirection: "column" as const,
    gap: 10,
    transform: `scale(${scale})`,
    flexShrink: 0,
    width: 280,
    opacity: dim ? 0.5 : 1,
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
        gap: 40,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          fontSize: 44,
          fontWeight: 400,
          color: COLORS.orange,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: headerOpacity,
          textAlign: "center",
        }}
      >
        The Dark Funnel
      </div>

      {/* Journey row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          width: "100%",
          justifyContent: "center",
        }}
      >
        {/* Step 1: LLM Chat */}
        <div style={stepStyle(step1Scale, COLORS.cyan)}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: COLORS.cyan,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Step 1
          </div>
          <div style={{ fontSize: 32 }}>💬</div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            LLM Chat
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 300,
              color: "#ffffff88",
              lineHeight: 1.4,
            }}
          >
            "Which window brand is best for my climate?"
          </div>
        </div>

        {/* Arrow 1 */}
        <div
          style={{
            fontSize: 40,
            color: COLORS.cyan,
            opacity: arrow1,
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          →
        </div>

        {/* Step 2: Answer given, no click */}
        <div style={stepStyle(step2Scale, COLORS.orange)}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: COLORS.orange,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Step 2
          </div>
          <div style={{ fontSize: 32 }}>🤖</div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#ffffff",
            }}
          >
            LLM Answers
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 300,
              color: "#ffffff88",
              lineHeight: 1.4,
            }}
          >
            "Milgard offers excellent U-factors..."
            <br />
            User satisfied. No click.
          </div>
        </div>

        {/* BROKEN ARROW */}
        <div
          style={{
            position: "relative",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            opacity: arrow2,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#ef4444",
              opacity: breakOpacity,
              transform: `translateX(${breakShake}px)`,
              letterSpacing: "0.1em",
            }}
          >
            ⚡ ATTRIBUTION BREAKS
          </div>
          <div
            style={{
              fontSize: 32,
              color: "#ffffff33",
              letterSpacing: "0.2em",
            }}
          >
            - - →
          </div>
        </div>

        {/* Step 3: Later, branded search */}
        <div style={stepStyle(step3Scale, "#ffffff", true)}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: "#ffffff44",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            Days Later
          </div>
          <div style={{ fontSize: 32 }}>🔍</div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#ffffff88",
            }}
          >
            Browser Search
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 300,
              color: "#ffffff55",
              lineHeight: 1.4,
            }}
          >
            "Milgard windows near me"
          </div>

          {/* Attribution X */}
          {crossOpacity > 0 && (
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#ef4444",
                opacity: crossOpacity,
                textDecoration: "line-through",
                letterSpacing: "0.05em",
              }}
            >
              Source: LLM referral
            </div>
          )}
        </div>
      </div>

      {/* Bottom insight */}
      <div
        style={{
          opacity: insightOpacity,
          transform: `translateY(${insightY}px)`,
          fontSize: 30,
          fontWeight: 400,
          color: "#ffffffaa",
          textAlign: "center",
          borderTop: `1px solid ${COLORS.graphite}`,
          paddingTop: 24,
          width: "100%",
        }}
      >
        The LLM influenced the purchase.{" "}
        <span style={{ color: "#ef4444", fontWeight: 700 }}>
          Analytics will never show it.
        </span>
        <br />
        <span style={{ fontSize: 26, fontWeight: 300, color: "#ffffff66" }}>
          Brand mention frequency is now a leading indicator, not trailing.
        </span>
      </div>
    </AbsoluteFill>
  );
};
