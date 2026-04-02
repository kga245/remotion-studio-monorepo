import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 8 seconds = 240 frames
// One capstone explodes into derivative formats

const DERIVATIVES = [
  { label: "Blog Post", emoji: "📝", angle: -80, color: COLORS.orange, delay: 60 },
  { label: "FAQ Page", emoji: "❓", angle: -40, color: "#a78bfa", delay: 72 },
  { label: "Social Thread", emoji: "🧵", angle: 0, color: COLORS.cyan, delay: 84 },
  { label: "Email Series", emoji: "📧", angle: 42, color: "#34d399", delay: 96 },
  { label: "Webinar Slide", emoji: "📊", angle: 85, color: "#fbbf24", delay: 108 },
  { label: "PR Pitch", emoji: "📣", angle: 130, color: "#f472b6", delay: 120 },
  { label: "Video Script", emoji: "🎥", angle: 175, color: "#60a5fa", delay: 132 },
  { label: "Podcast Ep.", emoji: "🎙️", angle: -130, color: "#fb923c", delay: 144 },
];

type DerivativeProps = {
  label: string;
  emoji: string;
  angle: number;
  color: string;
  delay: number;
  radius: number;
};

const Derivative: React.FC<DerivativeProps> = ({
  label,
  emoji,
  angle,
  color,
  delay,
  radius,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 140, mass: 0.9 },
    durationInFrames: 35,
  });

  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius * progress;
  const y = Math.sin(rad) * radius * progress;
  const opacity = interpolate(progress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Line from center
  const lineLength = radius * progress * 0.65;
  const lx = Math.cos(rad) * lineLength;
  const ly = Math.sin(rad) * lineLength;

  return (
    <>
      {/* Line */}
      <line
        x1={0}
        y1={0}
        x2={lx}
        y2={ly}
        stroke={`${color}44`}
        strokeWidth={1.5}
        opacity={opacity}
      />

      {/* Node */}
      <g transform={`translate(${x}, ${y})`} opacity={opacity}>
        <rect
          x={-70}
          y={-30}
          width={140}
          height={60}
          rx={8}
          fill={`${color}20`}
          stroke={color}
          strokeWidth={1.5}
        />
        <text
          x={-55}
          y={-4}
          fill={color}
          fontSize={18}
          fontFamily={fontFamily}
          fontWeight={700}
        >
          {emoji}
        </text>
        <text
          x={-30}
          y={8}
          fill="#ffffffcc"
          fontSize={16}
          fontFamily={fontFamily}
          fontWeight={400}
        >
          {label}
        </text>
      </g>
    </>
  );
};

export const CapstoneAtomization: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Header
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Center capstone springs in
  const centerScale = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 160, mass: 1.1 },
    durationInFrames: 40,
  });

  // Bottom insight
  const bottomOpacity = interpolate(frame, [185, 215], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cx = 960;
  const cy = 530;
  const RADIUS = 300;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.dark,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 26,
          fontWeight: 400,
          color: COLORS.orange,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: headerOpacity,
        }}
      >
        Capstone Atomization Strategy
      </div>

      {/* SVG for lines and nodes */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        viewBox="0 0 1920 1080"
      >
        <g transform={`translate(${cx}, ${cy})`}>
          {DERIVATIVES.map((d) => (
            <Derivative key={d.label} {...d} radius={RADIUS} />
          ))}
        </g>
      </svg>

      {/* Center capstone node */}
      <div
        style={{
          position: "absolute",
          left: cx,
          top: cy,
          transform: `translate(-50%, -50%) scale(${centerScale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 180,
          height: 100,
          background: `linear-gradient(135deg, ${COLORS.orange}33, ${COLORS.orange}11)`,
          border: `3px solid ${COLORS.orange}`,
          borderRadius: 12,
          boxShadow: `0 0 ${centerScale * 40}px ${COLORS.orange}44`,
          gap: 4,
        }}
      >
        <div
          style={{
            fontSize: 13,
            fontWeight: 400,
            color: COLORS.orange,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          Capstone
        </div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#ffffff",
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Window
          <br />
          Buying Guide
        </div>
      </div>

      {/* Bottom insight */}
      <div
        style={{
          position: "absolute",
          bottom: 52,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 24,
          fontWeight: 300,
          color: "#ffffffaa",
          opacity: bottomOpacity,
        }}
      >
        One authoritative piece of content. Infinite derivative formats.
      </div>
    </AbsoluteFill>
  );
};
