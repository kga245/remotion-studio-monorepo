import {
  AbsoluteFill,
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
    title: "Use clear headings. Each section answers one question.",
    delay: 30,
  },
  {
    number: "02",
    title: "Lead with the answer. Don't bury it.",
    delay: 78,
  },
  {
    number: "03",
    title: "Write each section so it stands on its own.",
    delay: 126,
  },
  {
    number: "04",
    title: "Use comparison tables with real specs and data.",
    delay: 174,
  },
  {
    number: "05",
    title: "Add FAQ sections. Cover the full range of questions.",
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
            fontSize: 44,
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
            fontSize: 30,
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
        {TIPS.map(({ number, title, delay }) => {
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
