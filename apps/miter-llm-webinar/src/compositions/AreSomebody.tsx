import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 7 seconds = 210 frames
// "Are you actually somebody? Have you done something? Do others vouch for you?"

const QUESTIONS = [
  {
    q: "Are you actually somebody?",
    delay: 10,
    color: COLORS.orange,
  },
  {
    q: "Have you done something worth talking about?",
    delay: 65,
    color: COLORS.cyan,
  },
  {
    q: "Do other important people vouch for you?",
    delay: 120,
    color: "#a78bfa",
  },
  {
    q: "Does your brand have genuine authority?",
    delay: 175,
    color: COLORS.orange,
  },
];

export const AreSomebody: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const bottomOpacity = interpolate(frame, [220, 245], [0, 1], {
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
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "60px 100px",
        gap: 48,
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
        }}
      >
        The Three Authority Questions
      </div>

      {/* Questions */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 40,
          width: "100%",
        }}
      >
        {QUESTIONS.map(({ q, delay, color }, i) => {
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 18, stiffness: 160 },
            durationInFrames: 35,
          });

          const opacity = interpolate(progress, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          });
          const x = interpolate(progress, [0, 1], [-80, 0]);

          return (
            <div
              key={q}
              style={{
                opacity,
                transform: `translateX(${x}px)`,
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 28,
              }}
            >
              {/* Number */}
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  color: `${color}44`,
                  lineHeight: 0.9,
                  flexShrink: 0,
                  width: 64,
                  textAlign: "right",
                }}
              >
                {i + 1}
              </div>

              {/* Text block */}
              <div
                style={{
                  borderLeft: `3px solid ${color}`,
                  paddingLeft: 24,
                }}
              >
                <div
                  style={{
                    fontSize: 40,
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.2,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {q}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom */}
      <div
        style={{
          fontSize: 30,
          fontWeight: 400,
          color: COLORS.orange,
          opacity: bottomOpacity,
          fontStyle: "italic",
        }}
      >
        LLMs are asking these questions about every brand, every query.
      </div>
    </AbsoluteFill>
  );
};
