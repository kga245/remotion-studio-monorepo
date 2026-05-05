import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type HRuleProps = {
  delay?: number;
  color?: string;
  width?: number;
  thickness?: number;
};

export const HRule: React.FC<HRuleProps> = ({
  delay = 0,
  color = "#c8a882",
  width = 120,
  thickness = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
    durationInFrames: 20,
  });

  const scaleX = interpolate(progress, [0, 1], [0, 1]);

  return (
    <div
      style={{
        width,
        height: thickness,
        backgroundColor: color,
        transform: `scaleX(${scaleX})`,
        transformOrigin: "center",
      }}
    />
  );
};
