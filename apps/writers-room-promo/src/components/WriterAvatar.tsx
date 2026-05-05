import React from "react";
import { useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

type WriterAvatarProps = {
  name: string;
  trait: string;
  delay?: number;
  color?: string;
  dotted?: boolean;
  size?: number;
};

export const WriterAvatar: React.FC<WriterAvatarProps> = ({
  name,
  trait,
  delay = 0,
  color = "#c8a882",
  dotted = false,
  size = 64,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });

  // Ring draws in via stroke-dashoffset
  const circumference = Math.PI * (size - 4);
  const strokeDashoffset = interpolate(enter, [0, 1], [circumference, 0]);

  // Subtle scale bounce
  const scale = interpolate(
    spring({ frame, fps, delay, config: { damping: 15, stiffness: 200 } }),
    [0, 1],
    [0.6, 1],
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        opacity: enter,
        transform: `scale(${scale})`,
      }}
    >
      {/* Ring */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={(size - 4) / 2}
          fill="none"
          stroke={color}
          strokeWidth={dotted ? 2 : 2.5}
          strokeDasharray={dotted ? "4 4" : `${circumference}`}
          strokeDashoffset={dotted ? 0 : strokeDashoffset}
          strokeLinecap="round"
          opacity={dotted ? enter : 1}
        />
        {/* Inner initial letter */}
        {!dotted && (
          <text
            x={size / 2}
            y={size / 2 + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fill={color}
            fontSize={size * 0.32}
            fontFamily="'Playfair Display', serif"
            fontWeight={700}
            opacity={interpolate(enter, [0.5, 1], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}
          >
            {name.charAt(0)}
          </text>
        )}
        {/* Plus icon for "create your own" */}
        {dotted && (
          <>
            <line
              x1={size / 2 - 12}
              y1={size / 2}
              x2={size / 2 + 12}
              y2={size / 2}
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={interpolate(enter, [0.5, 1], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            />
            <line
              x1={size / 2}
              y1={size / 2 - 12}
              x2={size / 2}
              y2={size / 2 + 12}
              stroke={color}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={interpolate(enter, [0.5, 1], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              })}
            />
          </>
        )}
      </svg>

      {/* Name */}
      <div
        style={{
          fontSize: 28,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 700,
          color: "#f5f0eb",
          letterSpacing: 0.5,
          textAlign: "center",
        }}
      >
        {name}
      </div>
      {/* Trait */}
      <div
        style={{
          fontSize: 16,
          fontFamily: "'Inter', sans-serif",
          fontWeight: 300,
          color: "#8a7560",
          letterSpacing: 2,
          textTransform: "uppercase",
          textAlign: "center",
          marginTop: -4,
        }}
      >
        {trait}
      </div>
    </div>
  );
};
