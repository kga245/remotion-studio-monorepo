import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// Inspired by .agents/skills/remotion-best-practices/rules/assets/text-animations-word-highlight.tsx
// A spring-driven scaleX wipe paints the highlight from left to right behind the word.
const FULL_TEXT = "It's not a brand book — it's a Remotion project.";
const HIGHLIGHTS: Array<{ word: string; color: string; delay: number }> = [
  { word: "brand book", color: colors.cyan, delay: 24 },
  { word: "Remotion project", color: colors.orange, delay: 60 },
];

const Highlight: React.FC<{
  word: string;
  color: string;
  delay: number;
  durationInFrames: number;
}> = ({ word, color, delay, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    fps,
    frame,
    config: { damping: 200 },
    delay,
    durationInFrames,
  });
  const scaleX = Math.max(0, Math.min(1, progress));

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "50%",
          height: "1.05em",
          transform: `translateY(-50%) scaleX(${scaleX})`,
          transformOrigin: "left center",
          backgroundColor: color,
          borderRadius: "0.18em",
          zIndex: 0,
        }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{word}</span>
    </span>
  );
};

// Build a render array by splitting on every highlight word, in order.
const renderWithHighlights = () => {
  let remaining = FULL_TEXT;
  const segments: React.ReactNode[] = [];
  let key = 0;

  for (const h of HIGHLIGHTS) {
    const idx = remaining.indexOf(h.word);
    if (idx < 0) continue;
    if (idx > 0) {
      segments.push(<span key={key++}>{remaining.slice(0, idx)}</span>);
    }
    segments.push(
      <Highlight
        key={key++}
        word={h.word}
        color={h.color}
        delay={h.delay}
        durationInFrames={18}
      />,
    );
    remaining = remaining.slice(idx + h.word.length);
  }
  if (remaining.length > 0) {
    segments.push(<span key={key++}>{remaining}</span>);
  }
  return segments;
};

export const HighlightPen: React.FC = () => {
  return (
    <VignetteFrame
      beat="D · 03"
      capability="Highlight pen"
      api="spring → scaleX wipe"
    >
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
          fontFamily,
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            lineHeight: 1.25,
            letterSpacing: "-0.015em",
            textAlign: "center",
            maxWidth: 1500,
            color: colors.graphite,
          }}
        >
          {renderWithHighlights()}
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
