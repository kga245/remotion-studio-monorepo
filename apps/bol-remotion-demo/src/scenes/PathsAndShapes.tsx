import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { evolvePath } from "@remotion/paths";
import { makeStar } from "@remotion/shapes";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

const SHAPE = makeStar({
  points: 5,
  innerRadius: 110,
  outerRadius: 220,
  edgeRoundness: 0.12,
});

// Two phases inside this 180-frame vignette:
//   0–90  — stroke draws around the star outline (evolvePath)
//   90–180 — fill spring-scales in over the stroke
const DRAW_FRAMES = 90;

export const PathsAndShapes: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const drawProgress = interpolate(frame, [0, DRAW_FRAMES], [0, 1], {
    extrapolateRight: "clamp",
  });
  const { strokeDasharray, strokeDashoffset } = evolvePath(
    drawProgress,
    SHAPE.path,
  );

  const fillIn = spring({
    frame: frame - DRAW_FRAMES,
    fps,
    config: { damping: 14, stiffness: 180, mass: 0.8 },
  });

  // Subtle rotation across the whole vignette for life.
  const rotate = interpolate(frame, [0, 180], [-6, 4]);

  return (
    <VignetteFrame
      beat="04 / 07"
      capability="Paths and shapes"
      api="@remotion/paths  ·  @remotion/shapes"
    >
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
        }}
      >
        <svg
          width={520}
          height={520}
          viewBox={`-${SHAPE.width / 2} -${SHAPE.height / 2} ${SHAPE.width} ${SHAPE.height}`}
          style={{
            transform: `rotate(${rotate}deg)`,
            overflow: "visible",
          }}
        >
          {/* Stroke phase: draws around the outline */}
          <path
            d={SHAPE.path}
            transform={`translate(${-SHAPE.width / 2}, ${-SHAPE.height / 2})`}
            fill="none"
            stroke={colors.graphite}
            strokeWidth={6}
            strokeLinejoin="round"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
          />
          {/* Fill phase: BOL orange springs in */}
          <path
            d={SHAPE.path}
            transform={`translate(${-SHAPE.width / 2}, ${-SHAPE.height / 2}) scale(${fillIn})`}
            style={{ transformOrigin: "center" }}
            fill={colors.orange}
            opacity={fillIn}
          />
        </svg>

        <div
          style={{
            position: "absolute",
            bottom: 96,
            fontSize: 22,
            opacity: 0.65,
            letterSpacing: "0.04em",
          }}
        >
          Generated geometry · stroke-on, then filled
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
