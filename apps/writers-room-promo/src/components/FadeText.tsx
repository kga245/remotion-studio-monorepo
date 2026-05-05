import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type FadeTextProps = {
  text: string;
  delay?: number;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  color?: string;
  letterSpacing?: number;
  exitAt?: number;
  slideDistance?: number;
};

export const FadeText: React.FC<FadeTextProps> = ({
  text,
  delay = 0,
  fontSize = 64,
  fontFamily,
  fontWeight = 700,
  color = "#f5f0eb",
  letterSpacing = 0,
  exitAt,
  slideDistance = 30,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entrance = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });

  const opacity = entrance;
  const translateY = interpolate(entrance, [0, 1], [slideDistance, 0]);

  let exitOpacity = 1;
  let exitTranslateY = 0;
  if (exitAt !== undefined) {
    const exitProgress = spring({
      frame,
      fps,
      delay: exitAt,
      config: { damping: 200 },
    });
    exitOpacity = 1 - exitProgress;
    exitTranslateY = interpolate(exitProgress, [0, 1], [0, -slideDistance]);
  }

  return (
    <div
      style={{
        fontSize,
        fontFamily,
        fontWeight,
        color,
        letterSpacing,
        opacity: opacity * exitOpacity,
        transform: `translateY(${translateY + exitTranslateY}px)`,
        lineHeight: 1.2,
      }}
    >
      {text}
    </div>
  );
};
