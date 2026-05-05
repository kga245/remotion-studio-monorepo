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
// User journey: LLM chat → memory → browser → brand website
// The attribution link is invisible/broken — shows why tracking is hard

const STEPS = [
  {
    icon: "💬",
    label: "LLM Chat",
    sub: "Discovers your brand",
    x: 200,
    delay: 20,
  },
  {
    icon: "🧠",
    label: "Memory",
    sub: "Files it away for later",
    x: 600,
    delay: 60,
  },
  {
    icon: "🔍",
    label: "Browser Search",
    sub: "Types your brand name",
    x: 1000,
    delay: 100,
  },
  {
    icon: "🌐",
    label: "Your Website",
    sub: "Attributes to 'direct traffic'",
    x: 1400,
    delay: 140,
  },
];

export const InvisiblePath: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Connection lines between steps
  const lineProgress = (i: number) =>
    interpolate(frame, [STEPS[i].delay + 20, STEPS[i].delay + 50], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });

  // "Invisible" label appears
  const invisibleOpacity = interpolate(frame, [170, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Lines break / become dashed
  const breakProgress = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bottom insight
  const insightOpacity = interpolate(frame, [225, 255], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const stepY = 440;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.dark,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 44,
          fontWeight: 400,
          color: COLORS.orange,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: headerOpacity,
        }}
      >
        The Invisible Attribution Path
      </div>

      {/* Connection lines (SVG) */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        viewBox="0 0 1920 1080"
      >
        {STEPS.slice(0, -1).map((step, i) => {
          const nextStep = STEPS[i + 1];
          const progress = lineProgress(i);
          const endX =
            step.x + 160 + (nextStep.x - 60 - (step.x + 160)) * progress;

          // First connection (LLM→Memory) becomes dashed/broken
          const isDashed = i === 0 && breakProgress > 0.5;
          const lineOpacity =
            i === 0
              ? interpolate(breakProgress, [0, 0.5, 1], [0.6, 0.6, 0.2])
              : 0.6;

          return (
            <g key={i}>
              <line
                x1={step.x + 160}
                y1={stepY}
                x2={endX}
                y2={stepY}
                stroke={i === 0 ? `${COLORS.orange}` : `${COLORS.cyan}`}
                strokeWidth={3}
                strokeDasharray={isDashed ? "12 8" : "none"}
                opacity={lineOpacity * progress}
              />
              {/* Arrow head */}
              {progress > 0.9 && (
                <polygon
                  points={`${nextStep.x - 60},${stepY} ${nextStep.x - 72},${stepY - 8} ${nextStep.x - 72},${stepY + 8}`}
                  fill={i === 0 ? COLORS.orange : COLORS.cyan}
                  opacity={lineOpacity}
                />
              )}
            </g>
          );
        })}

        {/* "INVISIBLE" label across first connection */}
        <text
          x={(STEPS[0].x + STEPS[1].x) / 2 + 80}
          y={stepY - 30}
          textAnchor="middle"
          fill="#ff4444"
          fontSize={28}
          fontWeight={700}
          fontFamily={fontFamily}
          opacity={invisibleOpacity}
        >
          ✗ NO ATTRIBUTION
        </text>
      </svg>

      {/* Step nodes */}
      {STEPS.map((step, i) => {
        const appear = spring({
          frame: frame - step.delay,
          fps,
          config: { damping: 14, stiffness: 160 },
          durationInFrames: 30,
        });

        const isLast = i === STEPS.length - 1;
        const _borderColor = isLast ? "#ff4444" : COLORS.cyan;

        return (
          <div
            key={step.label}
            style={{
              position: "absolute",
              left: step.x,
              top: stepY,
              transform: `translate(-50%, -50%) scale(${appear})`,
              textAlign: "center",
              width: 260,
            }}
          >
            {/* Icon */}
            <div
              style={{
                fontSize: 52,
                marginBottom: 12,
              }}
            >
              {step.icon}
            </div>

            {/* Label */}
            <div
              style={{
                fontSize: 30,
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: 8,
              }}
            >
              {step.label}
            </div>

            {/* Sub-label */}
            <div
              style={{
                fontSize: 22,
                fontWeight: 300,
                color: isLast ? "#ff444499" : "#ffffff88",
                lineHeight: 1.3,
              }}
            >
              {step.sub}
            </div>
          </div>
        );
      })}

      {/* "What analytics sees" callout */}
      <div
        style={{
          position: "absolute",
          left: STEPS[3].x,
          top: stepY + 130,
          transform: "translate(-50%, 0)",
          opacity: invisibleOpacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 700,
            color: "#ff4444",
            border: "2px solid #ff444466",
            borderRadius: 12,
            padding: "12px 24px",
            background: "#ff444411",
          }}
        >
          Analytics reports: "Direct Traffic"
        </div>
      </div>

      {/* Bottom insight */}
      <div
        style={{
          position: "absolute",
          bottom: 44,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 32,
          fontWeight: 300,
          color: "#ffffffaa",
          opacity: insightOpacity,
        }}
      >
        The LLM started the journey — but your analytics will never know.
      </div>
    </AbsoluteFill>
  );
};
