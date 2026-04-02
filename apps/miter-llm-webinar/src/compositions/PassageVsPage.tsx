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
// Full page zooms into one highlighted passage nugget

const LOREM_LINES = [
  "Vinyl windows offer superior energy efficiency compared to traditional",
  "aluminum frames, with multi-chamber designs that reduce heat transfer by",
  "up to 40%. The key performance metric homeowners should evaluate is the",
  "U-factor: a lower U-factor indicates better insulation performance.",
  "",
  "When selecting replacement windows, consider the glass package alongside",
  "the frame material. Low-E coatings reflect infrared light while admitting",
  "visible light, reducing cooling costs in warm climates significantly.",
  "",
  "Triple-pane glass is the gold standard for energy performance in cold",
  "climates, offering U-factors as low as 0.15. For most applications,",
  "double-pane Low-E glass with argon fill provides an excellent balance",
  "of performance and cost at U-factors between 0.22 and 0.30.",
];

const HIGHLIGHT_LINES = [10, 11, 12]; // lines to highlight

export const PassageVsPage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: page overview (0-60)
  // Phase 2: zoom into passage (60-120)
  // Phase 3: highlight box pulses (120+)

  // Page zoom & focus
  const pageScale = interpolate(frame, [0, 5], [0.9, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const pageOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Zoom into passage
  const zoomScale = interpolate(frame, [60, 110], [1, 2.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });
  const zoomY = interpolate(frame, [60, 110], [0, -180], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Blur non-highlight lines
  const blurAmount = interpolate(frame, [60, 100], [0, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Highlight box appears
  const highlightOpacity = spring({
    frame: frame - 100,
    fps,
    config: { damping: 20, stiffness: 200 },
    durationInFrames: 30,
  });

  // Label fades in
  const labelOpacity = interpolate(frame, [130, 160], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Header
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
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        gap: 0,
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 52,
          fontSize: 26,
          fontWeight: 400,
          color: COLORS.orange,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: headerOpacity,
        }}
      >
        Passage-Level Extraction
      </div>

      {/* Page document */}
      <div
        style={{
          width: 760,
          background: "#13131f",
          border: `1px solid ${COLORS.graphite}44`,
          borderRadius: 8,
          padding: "40px 48px",
          transform: `scale(${pageScale * zoomScale}) translateY(${zoomY}px)`,
          opacity: pageOpacity,
          transformOrigin: "center 65%",
        }}
      >
        {/* Fake page title */}
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#ffffffcc",
            marginBottom: 24,
            borderBottom: `1px solid ${COLORS.graphite}44`,
            paddingBottom: 16,
          }}
        >
          Window Buying Guide: Energy Efficiency
        </div>

        {/* Page lines */}
        <div style={{ position: "relative" }}>
          {LOREM_LINES.map((line, i) => {
            const isHighlight = HIGHLIGHT_LINES.includes(i);
            return (
              <div
                key={i}
                style={{
                  fontSize: 14,
                  lineHeight: "22px",
                  color: isHighlight ? "#ffffff" : "#ffffff66",
                  filter: !isHighlight ? `blur(${blurAmount * 0.5}px)` : "none",
                  background:
                    isHighlight
                      ? `${COLORS.cyan}${Math.round(highlightOpacity * 28)
                          .toString(16)
                          .padStart(2, "0")}`
                      : "transparent",
                  padding: isHighlight ? "1px 4px" : "1px 4px",
                  borderRadius: 2,
                  transition: "none",
                  height: line === "" ? 12 : "auto",
                }}
              >
                {line}
              </div>
            );
          })}

          {/* Highlight box overlay */}
          <div
            style={{
              position: "absolute",
              left: -8,
              top: HIGHLIGHT_LINES[0] * 22 + (HIGHLIGHT_LINES[0] > 8 ? 24 : 0),
              right: -8,
              height: HIGHLIGHT_LINES.length * 22 + 4,
              border: `2px solid ${COLORS.cyan}`,
              borderRadius: 4,
              opacity: highlightOpacity,
              pointerEvents: "none",
              boxShadow: `0 0 ${highlightOpacity * 20}px ${COLORS.cyan}44`,
            }}
          />
        </div>
      </div>

      {/* Label */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: labelOpacity,
        }}
      >
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            color: COLORS.cyan,
            letterSpacing: "0.05em",
          }}
        >
          The Passage Nugget
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 300,
            color: "#ffffffaa",
          }}
        >
          LLMs don't read pages — they extract passages.
        </div>
      </div>
    </AbsoluteFill>
  );
};
