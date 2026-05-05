import React from "react";
import { spring, useCurrentFrame, useVideoConfig } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// EDIT ME: This is the BOL voice line that gets revealed word-by-word.
// Per brand: sentence case, active voice, direct, confident. No exclamation.
// Comma-broken phrases give the reveal natural breath points.
const LINE = "The brand book, in motion — frame by frame, in code.";

// Frames between word reveals. Lower = snappier, higher = more dramatic.
const STAGGER = 5;

export const SequencedText: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Tokenize while preserving punctuation glued to its word.
  const words = LINE.split(/\s+/);

  return (
    <VignetteFrame
      beat="03 / 07"
      capability="Sequenced text reveal"
      api="spring()  ·  stagger"
      tone="dark"
    >
      <div
        style={{
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
          fontFamily,
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
            textAlign: "left",
            maxWidth: 1500,
          }}
        >
          {words.map((word, i) => {
            const wordIn = spring({
              frame: frame - i * STAGGER,
              fps,
              config: { damping: 18, stiffness: 200, mass: 0.6 },
            });
            // Subtle: the em-dash and final words tinted in BOL orange.
            const isAccent = word.includes("—") || i >= words.length - 2;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity: wordIn,
                  transform: `translateY(${(1 - wordIn) * 32}px)`,
                  marginRight: 22,
                  color: isAccent ? colors.orange : "inherit",
                }}
              >
                {word}
              </span>
            );
          })}
        </div>
      </div>
    </VignetteFrame>
  );
};
