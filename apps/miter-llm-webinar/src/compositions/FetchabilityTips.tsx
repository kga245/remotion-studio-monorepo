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
// Fetchability: 3 tips

const TIPS = [
  {
    number: "01",
    title: "Make it crawlable.",
    detail: "Clean HTML structure, no JavaScript-only rendering of key content. LLM crawlers are text-first.",
    delay: 30,
  },
  {
    number: "02",
    title: "Get indexed everywhere.",
    detail: "Submit to Bing, Google, and lesser-known indices. LLMs pull from a broader web than Google search.",
    delay: 90,
  },
  {
    number: "03",
    title: "Earn links from authority sources.",
    detail: "Citations from Wikipedia, news, and industry publications signal you're worth finding.",
    delay: 155,
  },
];

export const FetchabilityTips: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const bottomOpacity = interpolate(frame, [220, 250], [0, 1], {
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
        padding: "60px 120px",
        gap: 48,
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
            color: COLORS.orange,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            background: `${COLORS.orange}22`,
            border: `1px solid ${COLORS.orange}`,
            borderRadius: 4,
            padding: "6px 16px",
          }}
        >
          Barrier 01
        </div>
        <div
          style={{
            fontSize: 40,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "-0.01em",
          }}
        >
          Fetchability
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 300,
            color: "#ffffff66",
          }}
        >
          — Can LLMs find and access your content?
        </div>
      </div>

      {/* Tips */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 40,
          width: "100%",
        }}
      >
        {TIPS.map(({ number, title, detail, delay }) => {
          const progress = spring({
            frame: frame - delay,
            fps,
            config: { damping: 20, stiffness: 160 },
            durationInFrames: 35,
          });

          const opacity = interpolate(progress, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          });
          const x = interpolate(progress, [0, 1], [-60, 0]);

          const detailOpacity = interpolate(
            frame,
            [delay + 25, delay + 50],
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
                gap: 32,
              }}
            >
              <div
                style={{
                  fontSize: 64,
                  fontWeight: 900,
                  color: `${COLORS.orange}55`,
                  lineHeight: 0.9,
                  flexShrink: 0,
                  width: 80,
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
                  gap: 8,
                  borderLeft: `3px solid ${COLORS.orange}`,
                  paddingLeft: 28,
                }}
              >
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 700,
                    color: "#ffffff",
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 300,
                    color: "#ffffff77",
                    lineHeight: 1.5,
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
          color: COLORS.cyan,
          opacity: bottomOpacity,
          fontStyle: "italic",
        }}
      >
        If LLMs can't reach you, nothing else matters.
      </div>
    </AbsoluteFill>
  );
};
