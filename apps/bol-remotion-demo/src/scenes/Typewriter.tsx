import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// Inspired by .agents/skills/remotion-best-practices/rules/assets/text-animations-typewriter.tsx
// Demonstrates string-slicing typewriter (NOT per-character opacity).
const FULL_TEXT = "Animation, in code. Frame-perfect. Brand-perfect.";
const PAUSE_AFTER = "Animation, in code.";
const CHAR_FRAMES = 2;
const CURSOR_BLINK_FRAMES = 16;
const PAUSE_SECONDS = 0.7;

const getTypedText = ({
  frame,
  fullText,
  pauseAfter,
  charFrames,
  pauseFrames,
}: {
  frame: number;
  fullText: string;
  pauseAfter: string;
  charFrames: number;
  pauseFrames: number;
}): string => {
  const pauseIndex = fullText.indexOf(pauseAfter);
  const preLen =
    pauseIndex >= 0 ? pauseIndex + pauseAfter.length : fullText.length;

  let typedChars = 0;
  if (frame < preLen * charFrames) {
    typedChars = Math.floor(frame / charFrames);
  } else if (frame < preLen * charFrames + pauseFrames) {
    typedChars = preLen;
  } else {
    const post = frame - preLen * charFrames - pauseFrames;
    typedChars = Math.min(
      fullText.length,
      preLen + Math.floor(post / charFrames),
    );
  }
  return fullText.slice(0, typedChars);
};

const Cursor: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(
    frame % CURSOR_BLINK_FRAMES,
    [0, CURSOR_BLINK_FRAMES / 2, CURSOR_BLINK_FRAMES],
    [1, 0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  return (
    <span
      style={{
        display: "inline-block",
        width: "0.06em",
        height: "0.95em",
        background: colors.orange,
        marginLeft: "0.06em",
        verticalAlign: "text-bottom",
        opacity,
      }}
    />
  );
};

export const Typewriter: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pauseFrames = Math.round(fps * PAUSE_SECONDS);

  const typedText = getTypedText({
    frame,
    fullText: FULL_TEXT,
    pauseAfter: PAUSE_AFTER,
    charFrames: CHAR_FRAMES,
    pauseFrames,
  });

  return (
    <VignetteFrame
      beat="D · 02"
      capability="Typewriter (string slicing)"
      api="frame → text.slice(0, n)"
      tone="dark"
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
            fontSize: 88,
            fontWeight: 700,
            lineHeight: 1.18,
            letterSpacing: "-0.015em",
            textAlign: "left",
            maxWidth: 1500,
          }}
        >
          {typedText}
          <Cursor frame={frame} />
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
