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
// Extractability: 5 tips

const TIPS = [
  {
    number: "01",
    title: "Write direct, definitive answers.",
    detail: "Lead with the answer. LLMs pull the first clear sentence as a citation.",
    delay: 30,
  },
  {
    number: "02",
    title: "Use structured markup.",
    detail: "FAQ schema, How-To schema, and definition lists give LLMs extraction handles.",
    delay: 78,
  },
  {
    number: "03",
    title: "Create Q&A formatted content.",
    detail: "\"What is the best window for [scenario]?\" — answer that exact question in your content.",
    delay: 126,
  },
  {
    number: "04",
    title: "Keep paragraphs short and self-contained.",
    detail: "Each paragraph should answer one question. LLMs extract at the paragraph level.",
    delay: 174,
  },
  {
    number: "05",
    title: "Build comparison tables.",
    detail: "Tables comparing products, specs, and scenarios are highly extractable data structures.",
    delay: 218,
  },
];

export const ExtractabilityTips: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const bottomOpacity = interpolate(frame, [238, 262], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const accentColor = "#a78bfa";

  return (
    <AbsoluteFill
      style={{
        background: COLORS.dark,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "60px 120px",
        gap: 40,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
          opacity: headerOpacity,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 400,
            color: accentColor,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            background: `${accentColor}22`,
            border: `1px solid ${accentColor}`,
            borderRadius: 4,
            padding: "6px 16px",
          }}
        >
          Barrier 03
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.01em",
          }}
        >
          Extractability
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 300,
            color: "#ffffff66",
          }}
        >
          — Is your content usable as a direct answer?
        </div>
      </div>

      {/* Tips */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
          width: "100%",
        }}
      >
        {TIPS.map(({ number, title, detail, delay }) => {
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 20, stiffness: 160 },
            durationInFrames: 30,
          });

          const opacity = interpolate(progress, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          });
          const x = interpolate(progress, [0, 1], [-50, 0]);

          const detailOpacity = interpolate(
            frame,
            [delay + 20, delay + 40],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          return (
            <div
              key={number}
              style={{
                opacity,
                transform: `translateX(${x}px)`,
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 28,
              }}
            >
              <div
                style={{
                  fontSize: 52,
                  fontWeight: 900,
                  color: `${accentColor}55`,
                  lineHeight: 0.9,
                  flexShrink: 0,
                  width: 68,
                  textAlign: "right",
                  letterSpacing: "-0.04em",
                }}
              >
                {number}
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                  borderLeft: `3px solid ${accentColor}`,
                  paddingLeft: 24,
                }}
              >
                <div
                  style={{
                    fontSize: 30,
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 300,
                    color: "#ffffff77",
                    lineHeight: 1.4,
                    opacity: detailOpacity,
                  }}
                >
                  {detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 400,
          color: accentColor,
          opacity: bottomOpacity,
          fontStyle: "italic",
        }}
      >
        Cited content isn't clever. It's structured to be used.
      </div>
    </AbsoluteFill>
  );
};
