import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 10 seconds = 300 frames
// Authority: 6 tips

const TIPS = [
  {
    number: "01",
    title: "Build a Wikipedia presence.",
    detail: "Wikipedia is a primary training source for every major LLM.",
    delay: 30,
  },
  {
    number: "02",
    title: "Earn earned media coverage.",
    detail: "Press mentions from credible news sources dramatically increase authority scores.",
    delay: 72,
  },
  {
    number: "03",
    title: "Get cited by industry publications.",
    detail: "Trade press, association sites, and analyst reports are high-authority citation sources.",
    delay: 114,
  },
  {
    number: "04",
    title: "Build author authority.",
    detail: "Named authors with credentials and Google Scholar profiles increase content trust.",
    delay: 156,
  },
  {
    number: "05",
    title: "Accumulate reviews on trusted platforms.",
    detail: "Houzz, Consumer Reports, and similar third-party review platforms signal legitimacy.",
    delay: 198,
  },
  {
    number: "06",
    title: "Pursue awards and certifications.",
    detail: "Industry recognition provides structured authority signals that LLMs can parse.",
    delay: 240,
  },
];

export const AuthorityTips: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
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
        padding: "48px 100px",
        gap: 28,
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
            color: COLORS.cyan,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            background: `${COLORS.cyan}22`,
            border: `1px solid ${COLORS.cyan}`,
            borderRadius: 4,
            padding: "6px 16px",
          }}
        >
          Barrier 02
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.01em",
          }}
        >
          Authority
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 300,
            color: "#ffffff66",
          }}
        >
          — Is your content worth citing?
        </div>
      </div>

      {/* Tips — 2 column layout for 6 tips */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px 48px",
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
          const y = interpolate(progress, [0, 1], [30, 0]);

          return (
            <div
              key={number}
              style={{
                opacity,
                transform: `translateY(${y}px)`,
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 16,
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: `${COLORS.cyan}55`,
                  lineHeight: 0.9,
                  flexShrink: 0,
                  width: 48,
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
                  gap: 4,
                  borderLeft: `2px solid ${COLORS.cyan}`,
                  paddingLeft: 16,
                }}
              >
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 300,
                    color: "#ffffff66",
                    lineHeight: 1.4,
                  }}
                >
                  {detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
