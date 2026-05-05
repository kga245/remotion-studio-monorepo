import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors, typography } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// Pie segments via SVG circles with stroke-dasharray. Each segment animates
// its dash offset from full-length (hidden) → 0 (drawn). Segments rotate
// staggered, starting from 12 o'clock (transform rotate(-90)).
const SEGMENTS = [
  { label: "Tutorials", value: 32, color: colors.orange },
  { label: "Demos", value: 24, color: colors.cyan },
  { label: "Process", value: 18, color: colors.graphite },
  { label: "Other", value: 26, color: colors.gray },
];

const RADIUS = 240;
const STROKE = 56;
const SIZE = 600;
const CENTER = SIZE / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const TOTAL = SEGMENTS.reduce((s, x) => s + x.value, 0);

export const PieChart: React.FC = () => {
  const frame = useCurrentFrame();

  // Each segment animates from frame (i * 12) to (i * 12 + 36).
  let rotationOffset = 0;
  const arcs = SEGMENTS.map((seg, i) => {
    const start = i * 12;
    const segmentProgress = interpolate(frame, [start, start + 36], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const segmentLength = (seg.value / TOTAL) * CIRCUMFERENCE;
    const offset = interpolate(segmentProgress, [0, 1], [segmentLength, 0]);
    const rotation = -90 + (rotationOffset / TOTAL) * 360;
    rotationOffset += seg.value;
    return { ...seg, segmentLength, offset, rotation };
  });

  return (
    <VignetteFrame
      beat="F · 02"
      capability="Pie chart, dash-offset"
      api="SVG stroke-dasharray + interpolate"
    >
      <AbsoluteFill
        style={{
          fontFamily,
          padding: "24px 80px",
          color: colors.graphite,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 80 }}>
          <svg width={SIZE} height={SIZE}>
            {/* Background ring */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={RADIUS}
              fill="none"
              stroke="rgba(53,61,80,0.06)"
              strokeWidth={STROKE}
            />
            {arcs.map((arc, i) => (
              <circle
                key={i}
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke={arc.color}
                strokeWidth={STROKE}
                strokeDasharray={`${arc.segmentLength} ${CIRCUMFERENCE}`}
                strokeDashoffset={arc.offset}
                transform={`rotate(${arc.rotation} ${CENTER} ${CENTER})`}
                strokeLinecap="butt"
              />
            ))}
          </svg>

          {/* Legend */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {SEGMENTS.map((seg, i) => {
              const start = i * 12 + 30;
              const enter = interpolate(frame, [start, start + 18], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              });
              return (
                <div
                  key={seg.label}
                  style={{
                    opacity: enter,
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    transform: `translateX(${(1 - enter) * 12}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 8,
                      background: seg.color,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        ...typography.h2,
                        fontSize: 24,
                        color: colors.graphite,
                      }}
                    >
                      {seg.label}
                    </div>
                    <div
                      style={{
                        fontSize: 16,
                        opacity: 0.6,
                        fontFeatureSettings: '"tnum"',
                      }}
                    >
                      {Math.round((seg.value / TOTAL) * 100)}%
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
