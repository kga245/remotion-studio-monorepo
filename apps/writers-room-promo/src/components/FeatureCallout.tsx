import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { COLORS } from "../colors";
import { sansFont, serifFont } from "../fonts";

type FeatureCalloutProps = {
  label: string;
  description?: string;
  x: number;
  y: number;
  delay?: number;
  anchor?: "left" | "right";
  exitAt?: number;
};

export const FeatureCallout: React.FC<FeatureCalloutProps> = ({
  label,
  description,
  x,
  y,
  delay = 0,
  anchor = "left",
  exitAt,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });

  let exitOpacity = 1;
  if (exitAt !== undefined) {
    const exitProgress = spring({
      frame,
      fps,
      delay: exitAt,
      config: { damping: 200 },
    });
    exitOpacity = 1 - exitProgress;
  }

  const opacity = enter * exitOpacity;
  const slideX = interpolate(enter, [0, 1], [anchor === "left" ? -20 : 20, 0]);

  // Dot scale
  const dotScale = spring({
    frame,
    fps,
    delay,
    config: { damping: 15, stiffness: 200 },
  });

  // Line width grows
  const lineWidth = interpolate(enter, [0, 1], [0, 40]);

  const isLeft = anchor === "left";

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 0,
        opacity,
        transform: `translateX(${slideX}px)`,
      }}
    >
      {/* Dot */}
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: COLORS.accent,
          transform: `scale(${dotScale})`,
          flexShrink: 0,
          order: isLeft ? 0 : 2,
        }}
      />

      {/* Connecting line */}
      <div
        style={{
          width: lineWidth,
          height: 1,
          backgroundColor: COLORS.accent,
          order: 1,
        }}
      />

      {/* Label card */}
      <div
        style={{
          backgroundColor: `${COLORS.bg}dd`,
          border: `1px solid ${COLORS.accentDim}44`,
          borderRadius: 6,
          padding: "10px 18px",
          order: isLeft ? 2 : 0,
          backdropFilter: "blur(4px)",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontFamily: serifFont,
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: -0.3,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </div>
        {description && (
          <div
            style={{
              fontSize: 14,
              fontFamily: sansFont,
              fontWeight: 300,
              color: COLORS.textMuted,
              letterSpacing: 0.5,
              marginTop: 4,
              whiteSpace: "nowrap",
            }}
          >
            {description}
          </div>
        )}
      </div>
    </div>
  );
};
