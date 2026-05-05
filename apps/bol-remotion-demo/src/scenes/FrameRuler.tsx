import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// Demonstrates the heartbeat of every Remotion app: useCurrentFrame.
// Every animation in the rest of the deck is just math on this number.
export const FrameRuler: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const totalSeconds = durationInFrames / fps;
  const tickEvery = fps; // one major tick per second

  // Playhead position as % of ruler container (matches tick math).
  const playheadPct = (frame / durationInFrames) * 100;

  return (
    <VignetteFrame
      beat="A · 02"
      capability="The frame is the heartbeat"
      api="useCurrentFrame()  ·  useVideoConfig()"
    >
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
          color: colors.graphite,
        }}
      >
        {/* Big frame counter */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 24,
            marginBottom: 80,
          }}
        >
          <div
            style={{
              fontSize: 280,
              fontWeight: 700,
              letterSpacing: "-0.04em",
              fontFeatureSettings: '"tnum"',
              color: colors.orange,
              minWidth: 480,
              textAlign: "right",
            }}
          >
            {frame}
          </div>
          <div
            style={{
              fontSize: 56,
              fontWeight: 300,
              opacity: 0.5,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            frame
          </div>
        </div>

        {/* Time chip */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 400,
            opacity: 0.7,
            marginBottom: 60,
          }}
        >
          {(frame / fps).toFixed(2)}s of {totalSeconds.toFixed(1)}s · {fps} fps
        </div>

        {/* Ruler */}
        <div
          style={{
            position: "relative",
            width: "80%",
            height: 80,
          }}
        >
          {/* Ticks */}
          {Array.from({
            length: Math.floor(durationInFrames / tickEvery) + 1,
          }).map((_, i) => {
            const tickFrame = i * tickEvery;
            const leftPct = (tickFrame / durationInFrames) * 100;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: `${leftPct}%`,
                  top: 0,
                  height: 24,
                  width: 2,
                  background: "rgba(53,61,80,0.25)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 32,
                    left: -16,
                    width: 32,
                    textAlign: "center",
                    fontSize: 18,
                    opacity: 0.55,
                  }}
                >
                  {i}s
                </div>
              </div>
            );
          })}

          {/* Baseline */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 24,
              height: 2,
              background: "rgba(53,61,80,0.18)",
            }}
          />

          {/* Playhead */}
          <div
            style={{
              position: "absolute",
              left: `${playheadPct}%`,
              top: -12,
              width: 4,
              height: 48,
              background: colors.orange,
              borderRadius: 2,
              boxShadow: `0 0 20px ${colors.orange}88`,
            }}
          />
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
