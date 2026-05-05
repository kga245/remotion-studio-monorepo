import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { noise2D } from "@remotion/noise";

type FilmGrainProps = {
  opacity?: number;
};

/**
 * Lightweight film grain using a small noise grid rendered as an inline SVG.
 * Only 48x27 cells (one per ~40px) — enough for texture without killing FPS.
 */
export const FilmGrain: React.FC<FilmGrainProps> = ({ opacity = 0.06 }) => {
  const frame = useCurrentFrame();

  // Small grid — 48 columns × 27 rows = 1,296 cells (vs 65,000 before)
  const COLS = 48;
  const ROWS = 27;
  const CELL_W = 1920 / COLS;
  const CELL_H = 1080 / ROWS;

  // useMemo([frame]) would invalidate every frame anyway; compute inline.
  const rects: React.JSX.Element[] = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const n = noise2D(`g${frame}`, c * 0.5, r * 0.5);
      const alpha = (n + 1) / 2;
      rects.push(
        <rect
          key={r * COLS + c}
          x={c * CELL_W}
          y={r * CELL_H}
          width={CELL_W}
          height={CELL_H}
          fill={`rgba(255,255,255,${alpha.toFixed(2)})`}
        />,
      );
    }
  }

  return (
    <AbsoluteFill style={{ pointerEvents: "none", mixBlendMode: "overlay" }}>
      <svg width={1920} height={1080} style={{ opacity }}>
        {rects}
      </svg>
    </AbsoluteFill>
  );
};
