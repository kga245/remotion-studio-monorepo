import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import {
  evolvePath,
  getLength,
  getPointAtLength,
  getTangentAtLength,
} from "@remotion/paths";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors, typography } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// Demonstrates @remotion/paths utilities:
//   - evolvePath: animates the stroke draw-on
//   - getLength + getPointAtLength + getTangentAtLength: positions/orients an
//     arrow that follows the head of the line as it draws.
//
// Path is a hand-crafted lineish trajectory in viewBox 0 0 1600 700.
const PATH =
  "M 60 580 L 240 510 L 420 540 L 600 420 L 800 460 L 980 320 L 1180 360 L 1380 220 L 1540 80";

const VIEW_W = 1600;
const VIEW_H = 700;

const Y_TICKS = [80, 220, 360, 500];
const X_TICKS = [
  { x: 60, label: "Q1" },
  { x: 420, label: "Q2" },
  { x: 800, label: "Q3" },
  { x: 1180, label: "Q4" },
  { x: 1540, label: "EOY" },
];

export const LineChartMarker: React.FC = () => {
  const frame = useCurrentFrame();
  const totalLen = getLength(PATH);

  // Draw progress (0 → 1) over 90 frames with eased acceleration.
  const drawProgress = interpolate(frame, [0, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const { strokeDasharray, strokeDashoffset } = evolvePath(drawProgress, PATH);

  const tipLen = drawProgress * totalLen;
  const tip = getPointAtLength(PATH, Math.max(0.01, tipLen));
  const tangent = getTangentAtLength(PATH, Math.max(0.01, tipLen));
  const angleDeg = (Math.atan2(tangent.y, tangent.x) * 180) / Math.PI;

  // Final big-number reveal after the line draws.
  const numEnter = interpolate(frame, [95, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  return (
    <VignetteFrame
      beat="F · 03"
      capability="Line chart with marker"
      api="evolvePath  ·  getPointAtLength  ·  getTangentAtLength"
    >
      <AbsoluteFill
        style={{
          fontFamily,
          padding: "32px 80px",
          color: colors.graphite,
          flexDirection: "column",
        }}
      >
        <div
          style={{
            ...typography.h2,
            fontSize: 22,
            color: colors.gray,
            marginBottom: 12,
          }}
        >
          Demo · year-over-year growth (illustrative)
        </div>

        <div
          style={{
            position: "relative",
            flex: 1,
            display: "flex",
            alignItems: "stretch",
          }}
        >
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
            preserveAspectRatio="xMinYMin meet"
          >
            {/* Y grid lines */}
            {Y_TICKS.map((y) => (
              <line
                key={y}
                x1={60}
                x2={VIEW_W - 40}
                y1={y}
                y2={y}
                stroke="rgba(53,61,80,0.08)"
                strokeWidth={1}
              />
            ))}
            {/* X axis */}
            <line
              x1={60}
              x2={VIEW_W - 40}
              y1={620}
              y2={620}
              stroke="rgba(53,61,80,0.18)"
              strokeWidth={2}
            />
            {/* Y axis */}
            <line
              x1={60}
              x2={60}
              y1={40}
              y2={620}
              stroke="rgba(53,61,80,0.18)"
              strokeWidth={2}
            />

            {/* Line */}
            <path
              d={PATH}
              fill="none"
              stroke={colors.orange}
              strokeWidth={6}
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />

            {/* Marker (arrow) following the tip */}
            <g
              style={{
                transform: `translate(${tip.x}px, ${tip.y}px) rotate(${angleDeg}deg)`,
                transformOrigin: "0 0",
                opacity: drawProgress > 0 && drawProgress < 1 ? 1 : 0,
              }}
            >
              <polygon points="0,0 -28,-12 -28,12" fill={colors.orange} />
            </g>

            {/* Final dot at tip after line completes */}
            {drawProgress >= 1 && (
              <circle
                cx={1540}
                cy={80}
                r={14}
                fill={colors.orange}
                stroke="white"
                strokeWidth={4}
              />
            )}

            {/* X tick labels */}
            {X_TICKS.map((t) => (
              <text
                key={t.x}
                x={t.x}
                y={660}
                fill="#8B8586"
                fontSize={20}
                textAnchor="middle"
                fontFamily={fontFamily}
              >
                {t.label}
              </text>
            ))}
          </svg>

          {/* Big-number reveal */}
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 32,
              opacity: numEnter,
              transform: `translateY(${(1 - numEnter) * 16}px)`,
              textAlign: "right",
            }}
          >
            <div
              style={{
                ...typography.h2,
                fontSize: 18,
                color: colors.gray,
              }}
            >
              EOY
            </div>
            <div
              style={{
                fontSize: 96,
                fontWeight: 700,
                color: colors.orange,
                letterSpacing: "-0.02em",
                fontFeatureSettings: '"tnum"',
                lineHeight: 1,
              }}
            >
              +312%
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
