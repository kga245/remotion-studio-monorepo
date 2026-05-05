import React from "react";
import { useCurrentFrame, interpolate } from "remotion";

type TypewriterProps = {
  text: string;
  delay?: number;
  charFrames?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  color?: string;
  letterSpacing?: number;
  showCursor?: boolean;
};

export const Typewriter: React.FC<TypewriterProps> = ({
  text,
  delay = 0,
  charFrames = 2,
  fontSize = 64,
  fontFamily,
  fontWeight = 400,
  color = "#f5f0eb",
  letterSpacing = 0,
  showCursor = true,
}) => {
  const frame = useCurrentFrame();

  const localFrame = Math.max(0, frame - delay);
  const typedCount = Math.min(text.length, Math.floor(localFrame / charFrames));
  const typedText = text.slice(0, typedCount);

  const cursorOpacity = showCursor
    ? interpolate(frame % 16, [0, 8, 16], [1, 0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      })
    : 0;

  return (
    <div
      style={{
        fontSize,
        fontFamily,
        fontWeight,
        color,
        letterSpacing,
        lineHeight: 1.4,
        whiteSpace: "pre-wrap",
      }}
    >
      <span>{typedText}</span>
      {showCursor && typedCount < text.length && (
        <span style={{ opacity: cursorOpacity, color }}>|</span>
      )}
    </div>
  );
};
