import {
  AbsoluteFill,
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
    title: "Cite your sources.",
    delay: 30,
  },
  {
    number: "02",
    title: "Publish original data.",
    delay: 72,
  },
  {
    number: "03",
    title: "Put a real name behind your content.",
    delay: 114,
  },
  {
    number: "04",
    title: "Earn references from other sites.",
    delay: 156,
  },
  {
    number: "05",
    title: "Build something useful.",
    delay: 198,
  },
  {
    number: "06",
    title: "Date everything. Keep it fresh.",
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
            fontSize: 44,
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
            fontSize: 30,
            fontWeight: 300,
            color: "#ffffff66",
          }}
        >
          — Is your content worth citing?
        </div>
      </div>

      {/* Tips — single column */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
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
                gap: 20,
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
                  borderLeft: `3px solid ${COLORS.cyan}`,
                  paddingLeft: 20,
                }}
              >
                <div
                  style={{
                    fontSize: 28,
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
    </AbsoluteFill>
  );
};
