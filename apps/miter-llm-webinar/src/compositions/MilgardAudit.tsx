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
// Milgard brand visibility scorecard

const METRICS = [
  {
    platform: "ChatGPT",
    platformColor: "#10A37F",
    metric: "Brand Mentions",
    value: 32,
    suffix: "%",
    target: 32,
    delay: 40,
    grade: "B+",
    gradeColor: "#34d399",
  },
  {
    platform: "Google AI",
    platformColor: "#4285F4",
    metric: "AI Overview Presence",
    value: 19.5,
    suffix: "%",
    target: 19.5,
    delay: 85,
    grade: "C+",
    gradeColor: "#fbbf24",
  },
  {
    platform: "Perplexity",
    platformColor: "#20B8CD",
    metric: "Citation Rate",
    value: 14,
    suffix: "%",
    target: 14,
    delay: 130,
    grade: "C",
    gradeColor: "#fbbf24",
  },
  {
    platform: "All LLMs",
    platformColor: COLORS.orange,
    metric: "Recommended When Asked",
    value: 41,
    suffix: "%",
    target: 41,
    delay: 175,
    grade: "B",
    gradeColor: "#34d399",
  },
];

type MetricRowProps = (typeof METRICS)[0];

const MetricRow: React.FC<MetricRowProps> = ({
  platform,
  platformColor,
  metric,
  value,
  suffix,
  target,
  delay,
  grade,
  gradeColor,
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
  const rowX = interpolate(rowProgress, [0, 1], [-60, 0]);

  // Bar width animates
  const barWidth = interpolate(rowProgress, [0.2, 1], [0, target], {
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
        transform: `translateX(${rowX}px)`,
        width: "100%",
      }}
    >
      {/* Platform pill */}
      <div
        style={{
          width: 160,
          padding: "8px 16px",
          background: `${platformColor}22`,
          border: `1px solid ${platformColor}`,
          borderRadius: 6,
          fontSize: 18,
          fontWeight: 700,
          color: platformColor,
          textAlign: "center",
          flexShrink: 0,
        }}
      >
        {platform}
      </div>

      {/* Metric label */}
      <div
        style={{
          width: 280,
          fontSize: 18,
          fontWeight: 300,
          color: "#ffffff88",
          flexShrink: 0,
        }}
      >
        {metric}
      </div>

      {/* Bar */}
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
            width: `${barWidth}%`,
            background: `linear-gradient(90deg, ${platformColor}cc, ${platformColor}88)`,
            borderRadius: 4,
          }}
        />
      </div>

      {/* Value */}
      <div
        style={{
          width: 80,
          fontSize: 28,
          fontWeight: 900,
          color: "#ffffff",
          textAlign: "right",
          flexShrink: 0,
        }}
      >
        {value}
        {suffix}
      </div>

      {/* Grade */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: `2px solid ${gradeColor}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: 900,
          color: gradeColor,
          flexShrink: 0,
        }}
      >
        {grade}
      </div>
    </div>
  );
};

export const MilgardAudit: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });
  const brandOpacity = interpolate(frame, [0, 20], [0, 1], {
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
        padding: "60px 100px",
        gap: 40,
        overflow: "hidden",
      }}
    >
      {/* Header row */}
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
            fontSize: 22,
            fontWeight: 400,
            color: COLORS.orange,
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
            opacity: brandOpacity,
          }}
        >
          Milgard Windows
        </div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 300,
            color: "#ffffff44",
            marginLeft: "auto",
            letterSpacing: "0.05em",
          }}
        >
          Q1 2025 Benchmark
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

      {/* Bottom takeaway */}
      <div
        style={{
          fontSize: 24,
          fontWeight: 400,
          color: COLORS.cyan,
          opacity: bottomOpacity,
          borderLeft: `4px solid ${COLORS.cyan}`,
          paddingLeft: 20,
          lineHeight: 1.4,
        }}
      >
        Strong brand awareness, but citation rates lag behind mention rates.
        <br />
        <span style={{ fontWeight: 300, color: "#ffffff88", fontSize: 20 }}>
          Opportunity: increase extractable, cited content.
        </span>
      </div>
    </AbsoluteFill>
  );
};
