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
// PGT audit scorecard — shows the gap/opportunity vs Milgard

const METRICS = [
  {
    platform: "ChatGPT",
    platformColor: "#10A37F",
    metric: "Brand Mentions",
    value: 8,
    suffix: "%",
    delay: 40,
    grade: "D",
    gradeColor: "#ef4444",
    gap: "+24% to benchmark",
  },
  {
    platform: "Google AI",
    platformColor: "#4285F4",
    metric: "AI Overview Presence",
    value: 4.5,
    suffix: "%",
    delay: 80,
    grade: "F",
    gradeColor: "#ef4444",
    gap: "+15% to benchmark",
  },
  {
    platform: "Perplexity",
    platformColor: "#20B8CD",
    metric: "Citation Rate",
    value: 2,
    suffix: "%",
    delay: 120,
    grade: "F",
    gradeColor: "#ef4444",
    gap: "+12% to benchmark",
  },
  {
    platform: "All LLMs",
    platformColor: COLORS.orange,
    metric: "Recommended When Asked",
    value: 11,
    suffix: "%",
    delay: 155,
    grade: "D-",
    gradeColor: "#ef4444",
    gap: "+30% to benchmark",
  },
];

type MetricRowProps = (typeof METRICS)[0];

const MetricRow: React.FC<MetricRowProps> = ({
  platform,
  platformColor,
  metric,
  value,
  suffix,
  delay,
  grade,
  gradeColor,
  gap,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const rowProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 22, stiffness: 160 },
    durationInFrames: 35,
  });

  const rowOpacity = interpolate(rowProgress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  const barWidth = interpolate(rowProgress, [0.2, 1], [0, value], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 24,
        opacity: rowOpacity,
        width: "100%",
      }}
    >
      <div
        style={{
          width: 160,
          padding: "8px 16px",
          background: `${platformColor}22`,
          border: `1px solid ${platformColor}`,
          borderRadius: 6,
          fontSize: 22,
          fontWeight: 700,
          color: platformColor,
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {platform}
      </div>

      <div
        style={{
          width: 280,
          fontSize: 22,
          fontWeight: 300,
          color: "#ffffff88",
          flexShrink: 0,
        }}
      >
        {metric}
      </div>

      <div
        style={{
          flex: 1,
          height: 28,
          background: `${COLORS.graphite}44`,
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            width: `${barWidth * 2}%`,
            background: `linear-gradient(90deg, ${gradeColor}cc, ${gradeColor}88)`,
            borderRadius: 4,
          }}
        />
      </div>

      <div
        style={{
          width: 80,
          fontSize: 28,
          fontWeight: 900,
          color: gradeColor,
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {value}
        {suffix}
      </div>

      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: `2px solid ${gradeColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 900,
          color: gradeColor,
          flexShrink: 0,
        }}
      >
        {grade}
      </div>

      <div
        style={{
          width: 180,
          fontSize: 20,
          fontWeight: 400,
          color: COLORS.orange,
          flexShrink: 0,
        }}
      >
        ↑ {gap}
      </div>
    </div>
  );
};

export const PGTAudit: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const bottomOpacity = interpolate(frame, [165, 195], [0, 1], {
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
        gap: 36,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "baseline",
          gap: 24,
          opacity: headerOpacity,
          width: "100%",
        }}
      >
        <div
          style={{
            fontSize: 44,
            fontWeight: 400,
            color: "#ef4444",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          GEO Visibility Audit
        </div>
        <div
          style={{
            fontSize: 36,
            fontWeight: 900,
            color: "#ffffff",
          }}
        >
          PGT Innovations
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 300,
            color: "#ffffff44",
            marginLeft: "auto",
            letterSpacing: "0.05em",
          }}
        >
          Opportunity Analysis
        </div>
      </div>

      {/* Metrics */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 24,
          width: "100%",
        }}
      >
        {METRICS.map((m) => (
          <MetricRow key={m.platform} {...m} />
        ))}
      </div>

      {/* Bottom */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 400,
          color: COLORS.orange,
          opacity: bottomOpacity,
          borderLeft: `4px solid ${COLORS.orange}`,
          paddingLeft: 20,
          lineHeight: 1.4,
        }}
      >
        Significant visibility gap vs. category leaders.
        <br />
        <span style={{ fontWeight: 700, color: "#ffffff", fontSize: 30 }}>
          This is the GEO opportunity.
        </span>
      </div>
    </AbsoluteFill>
  );
};
