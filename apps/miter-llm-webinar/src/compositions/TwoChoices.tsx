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
// Choice A (faded/weak) vs Choice B (bold/glowing)

export const TwoChoices: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Choice A (left) fades in dully
  const choiceAOpacity = interpolate(frame, [15, 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const choiceAX = interpolate(frame, [15, 45], [-60, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // OR divider
  const orOpacity = interpolate(frame, [50, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Choice B springs in boldly
  const choiceBScale = spring({
    frame: frame - 65,
    fps,
    config: { damping: 12, stiffness: 180, mass: 1 },
    durationInFrames: 40,
  });
  const choiceBOpacity = interpolate(frame, [65, 85], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow intensifies on B
  const glowIntensity = interpolate(frame, [90, 150], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Choice A grays further out
  const choiceAFade = interpolate(frame, [100, 150], [1, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bottom label
  const bottomOpacity = interpolate(frame, [165, 190], [0, 1], {
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
        Two Paths Forward
      </div>

      {/* Choices row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "stretch",
          gap: 48,
          width: "100%",
        }}
      >
        {/* Choice A — weak, faded */}
        <div
          style={{
            flex: 1,
            opacity: choiceAOpacity * choiceAFade,
            transform: `translateX(${choiceAX}px)`,
            padding: "48px 40px",
            border: `1px solid ${COLORS.graphite}`,
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            filter: `grayscale(${interpolate(choiceAFade, [0.25, 1], [0.8, 0])}%)`,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 400,
              color: COLORS.graphite,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Option A
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#ffffff44",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Wait and
            <br />
            See
          </div>
          <div
            style={{
              width: 40,
              height: 3,
              background: COLORS.graphite,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {[
              "Hope competitors don't move first",
              "Monitor from the sidelines",
              "React when it's too late",
              "Lose ground in the AI era",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  fontSize: 18,
                  fontWeight: 300,
                  color: "#ffffff33",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ color: "#ffffff22" }}>—</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* OR divider */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: orOpacity,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: COLORS.graphite,
              letterSpacing: "0.1em",
            }}
          >
            OR
          </div>
        </div>

        {/* Choice B — bold, glowing */}
        <div
          style={{
            flex: 1,
            opacity: choiceBOpacity,
            transform: `scale(${choiceBScale})`,
            padding: "48px 40px",
            border: `2px solid ${COLORS.orange}`,
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            background: `${COLORS.orange}${Math.round(glowIntensity * 15)
              .toString(16)
              .padStart(2, "0")}`,
            boxShadow: `0 0 ${glowIntensity * 80}px ${COLORS.orange}44, inset 0 0 ${glowIntensity * 40}px ${COLORS.orange}11`,
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
            Option B — Recommended
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            Optimize
            <br />
            for GEO
          </div>
          <div
            style={{
              width: 40,
              height: 3,
              background: COLORS.orange,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {[
              "Build authority before competitors do",
              "Become the brand LLMs recommend",
              "Own the narrative in your category",
              "Compound advantage over time",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  fontSize: 18,
                  fontWeight: 400,
                  color: "#ffffffcc",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span style={{ color: COLORS.orange }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 700,
          color: COLORS.orange,
          opacity: bottomOpacity,
          textAlign: "center",
        }}
      >
        The brands that move now will be the ones the AI recommends.
      </div>
    </AbsoluteFill>
  );
};
