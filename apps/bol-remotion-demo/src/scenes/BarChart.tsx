import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors, typography } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// Adapted from .agents/skills/remotion-best-practices/rules/assets/charts-bar-chart.tsx
// Each bar springs up with a stagger delay, demonstrating both data viz and
// the "drive 3rd-party libs from useCurrentFrame()" rule from the skill pack.
const STAGGER = 5;

const DATA = [
  { month: "Jan", value: 32 },
  { month: "Feb", value: 41 },
  { month: "Mar", value: 38 },
  { month: "Apr", value: 56 },
  { month: "May", value: 49 },
  { month: "Jun", value: 67 },
  { month: "Jul", value: 72 },
  { month: "Aug", value: 68 },
];

const Y_STEPS = [0, 25, 50, 75];
const Y_MAX = 80;

export const BarChart: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chartHeight = 480;

  return (
    <VignetteFrame
      beat="F · 01"
      capability="Bar chart, frame-driven"
      api="spring + delay stagger"
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
            marginBottom: 24,
          }}
        >
          Demo · monthly views (illustrative)
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            paddingBottom: 60,
          }}
        >
          {/* Y axis labels */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: 60,
              height: chartHeight,
              paddingRight: 16,
              fontSize: 16,
              color: colors.gray,
              textAlign: "right",
            }}
          >
            {Y_STEPS.slice()
              .reverse()
              .map((step) => (
                <div key={step}>{step}</div>
              ))}
          </div>

          {/* Chart area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "flex-end",
                height: chartHeight,
                gap: 16,
                paddingLeft: 24,
                borderLeft: `2px solid rgba(53,61,80,0.15)`,
                borderBottom: `2px solid rgba(53,61,80,0.15)`,
              }}
            >
              {/* Horizontal grid lines */}
              {Y_STEPS.map((step) => {
                const yPct = 100 - (step / Y_MAX) * 100;
                return (
                  <div
                    key={step}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      top: `${yPct}%`,
                      height: 1,
                      background: "rgba(53,61,80,0.06)",
                    }}
                  />
                );
              })}

              {DATA.map((d, i) => {
                const progress = spring({
                  frame: frame - i * STAGGER - 6,
                  fps,
                  config: { damping: 18, stiffness: 90 },
                });
                const barH = (d.value / Y_MAX) * chartHeight * progress;
                return (
                  <div
                    key={d.month}
                    style={{
                      flex: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "flex-end",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: barH,
                        background: colors.orange,
                        borderRadius: "10px 10px 0 0",
                        opacity: 0.5 + progress * 0.5,
                      }}
                    />
                  </div>
                );
              })}
            </div>

            {/* X axis labels */}
            <div
              style={{
                display: "flex",
                gap: 16,
                paddingLeft: 24,
                marginTop: 12,
              }}
            >
              {DATA.map((d) => (
                <div
                  key={d.month}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontSize: 18,
                    color: colors.gray,
                  }}
                >
                  {d.month}
                </div>
              ))}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
