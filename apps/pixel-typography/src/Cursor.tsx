import React from "react";
import { interpolate } from "remotion";

interface CursorProps {
  x: number;
  y: number;
  size: number;
  opacity?: number;
}

export const Cursor: React.FC<CursorProps> = ({ x, y, size, opacity = 1 }) => {
  const armLen = size * 0.8;
  const thickness = 1.5;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 0,
        height: 0,
        opacity,
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {/* Vertical line */}
      <div
        style={{
          position: "absolute",
          left: -thickness / 2,
          top: -armLen,
          width: thickness,
          height: armLen * 2,
          backgroundColor: "#333",
        }}
      />
      {/* Horizontal line */}
      <div
        style={{
          position: "absolute",
          left: -armLen,
          top: -thickness / 2,
          width: armLen * 2,
          height: thickness,
          backgroundColor: "#333",
        }}
      />
    </div>
  );
};

// Smoothly interpolate cursor position between two points
export function interpolateCursorPos(
  frame: number,
  fromFrame: number,
  toFrame: number,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): { x: number; y: number } {
  const t = interpolate(frame, [fromFrame, toFrame], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Ease out for snappy cursor movement
  const eased = 1 - Math.pow(1 - t, 3);
  return {
    x: fromX + (toX - fromX) * eased,
    y: fromY + (toY - fromY) * eased,
  };
}
