import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 6 seconds = 180 frames
// Two KPIs: Brand Mention Frequency + Citation Frequency

export const KPIs: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // KPI 1 — Brand Mention Frequency
  const kpi1Scale = spring({
    frame: frame - 25,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 35,
  });

  // KPI 1 details
  const kpi1Detail = interpolate(frame, [55, 80], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Divider
  const dividerOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // KPI 2 — Citation Frequency
  const kpi2Scale = spring({
    frame: frame - 85,
    fps,
    config: { damping: 14, stiffness: 200 },
    durationInFrames: 35,
  });

  const kpi2Detail = interpolate(frame, [115, 140], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bottom note
  const bottomOpacity = interpolate(frame, [145, 170], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const kpiCard = (
    scale: number,
    detailOpacity: number,
    number: string,
    title: string,
    subtitle: string,
    definition: string,
    color: string,
    question: string,
  ) => (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        padding: "48px 56px",
        background: `${color}0d`,
        border: `2px solid ${color}`,
        borderRadius: 12,
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {/* KPI number */}
      <div
        style={{
          fontSize: 16,
          fontWeight: 400,
          color,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        KPI {number}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 48,
          fontWeight: 900,
          color: "#ffffff",
          letterSpacing: "-0.02em",
          lineHeight: 1.1,
        }}
      >
        {title}
      </div>

      {/* Subtitle / metric name */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 400,
          color,
          letterSpacing: "0.04em",
        }}
      >
        {subtitle}
      </div>

      {/* Divider */}
      <div
        style={{
          width: 60,
          height: 3,
          background: color,
          borderRadius: 2,
          opacity: detailOpacity,
        }}
      />

      {/* Definition */}
      <div
        style={{
          fontSize: 20,
          fontWeight: 300,
          color: "#ffffffaa",
          lineHeight: 1.5,
          opacity: detailOpacity,
        }}
      >
        {definition}
      </div>

      {/* Question prompt */}
      <div
        style={{
          fontSize: 18,
          fontWeight: 400,
          color,
          fontStyle: "italic",
          opacity: detailOpacity,
          borderLeft: `3px solid ${color}`,
          paddingLeft: 16,
          lineHeight: 1.4,
        }}
      >
        "{question}"
      </div>
    </div>
  );

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
          fontSize: 26,
          fontWeight: 400,
          color: COLORS.orange,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: headerOpacity,
          textAlign: "center",
        }}
      >
        The Two GEO KPIs That Matter
      </div>

      {/* KPI row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 32,
          width: "100%",
          alignItems: "stretch",
        }}
      >
        {kpiCard(
          kpi1Scale,
          kpi1Detail,
          "01",
          "Brand\nMention\nFrequency",
          "% of relevant queries that name your brand",
          "How often does an LLM include your brand name when answering questions in your category?",
          COLORS.orange,
          "How often does the AI mention us — even without a link?",
        )}

        {/* Divider */}
        <div
          style={{
            width: 2,
            background: `linear-gradient(180deg, transparent, ${COLORS.graphite}, transparent)`,
            opacity: dividerOpacity,
            flexShrink: 0,
            alignSelf: "stretch",
          }}
        />

        {kpiCard(
          kpi2Scale,
          kpi2Detail,
          "02",
          "Citation\nFrequency",
          "% of responses that link back to your content",
          "When an LLM surfaces answers from your category, how often does your content get cited as the source?",
          COLORS.cyan,
          "How often does the AI point back to us as the source?",
        )}
      </div>

      {/* Bottom note */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 300,
          color: "#ffffff88",
          opacity: bottomOpacity,
          textAlign: "center",
        }}
      >
        These exist outside of traditional analytics. You have to measure them directly.
      </div>
    </AbsoluteFill>
  );
};
