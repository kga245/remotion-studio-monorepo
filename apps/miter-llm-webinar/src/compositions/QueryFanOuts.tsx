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
// One query branches into sub-queries — tree/neural visual

const SUB_QUERIES = [
  { text: "What are the best window brands for cold climates?", delay: 60, angle: -55 },
  { text: "How do U-factor ratings compare by brand?", delay: 75, angle: -30 },
  { text: "Milgard vs Andersen energy efficiency 2024", delay: 90, angle: -5 },
  { text: "Are vinyl or fiberglass windows better insulated?", delay: 105, angle: 22 },
  { text: "Window replacement cost vs energy savings ROI", delay: 120, angle: 48 },
];

type BranchProps = {
  text: string;
  angle: number;
  delay: number;
  length: number;
};

const Branch: React.FC<BranchProps> = ({ text, angle, delay, length }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 140 },
    durationInFrames: 40,
  });

  const lineLength = interpolate(progress, [0, 0.7], [0, length], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const textOpacity = interpolate(progress, [0.5, 1], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const rad = (angle * Math.PI) / 180;
  const endX = Math.cos(rad) * length;
  const endY = Math.sin(rad) * length;

  return (
    <g>
      {/* Branch line drawn progressively */}
      <line
        x1={0}
        y1={0}
        x2={(Math.cos(rad) * lineLength)}
        y2={(Math.sin(rad) * lineLength)}
        stroke={`${COLORS.cyan}88`}
        strokeWidth={1.5}
      />

      {/* Node dot */}
      <circle
        cx={endX}
        cy={endY}
        r={5}
        fill={COLORS.cyan}
        opacity={textOpacity}
      />

      {/* Sub-query text */}
      <foreignObject
        x={endX + (angle < 0 ? 14 : 14)}
        y={endY - 18}
        width={380}
        height={44}
        opacity={textOpacity}
      >
        <div
          style={{
            fontFamily,
            fontSize: 17,
            fontWeight: 400,
            color: "#ffffffcc",
            lineHeight: 1.3,
          }}
        >
          {text}
        </div>
      </foreignObject>
    </g>
  );
};

export const QueryFanOuts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Root query appears
  const rootScale = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 200 },
    durationInFrames: 30,
  });

  // Header
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Trunk line
  const trunkLength = interpolate(frame, [25, 55], [0, 80], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Bottom label
  const bottomOpacity = interpolate(frame, [170, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const BRANCH_LENGTH = 340;
  const centerX = 420;
  const centerY = 540;

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
        Query Fan-Out
      </div>

      {/* SVG for lines */}
      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        viewBox="0 0 1920 1080"
      >
        {/* Trunk */}
        <line
          x1={centerX}
          y1={centerY}
          x2={centerX + trunkLength}
          y2={centerY}
          stroke={`${COLORS.orange}88`}
          strokeWidth={2}
        />

        {/* Fork point dot */}
        <circle
          cx={centerX + trunkLength}
          cy={centerY}
          r={6}
          fill={COLORS.orange}
          opacity={trunkLength > 60 ? 1 : 0}
        />

        {/* Branches */}
        <g transform={`translate(${centerX + trunkLength}, ${centerY})`}>
          {SUB_QUERIES.map((q) => (
            <Branch
              key={q.text}
              text={q.text}
              angle={q.angle}
              delay={q.delay}
              length={BRANCH_LENGTH}
            />
          ))}
        </g>
      </svg>

      {/* Root query pill */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: centerY - 36,
          transform: `scale(${rootScale})`,
          transformOrigin: "left center",
          background: COLORS.orange,
          borderRadius: 40,
          padding: "16px 32px",
          maxWidth: 340,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.3,
            textAlign: "center",
          }}
        >
          "What's the best window treatment for a bedroom?"
        </div>
      </div>

      {/* Bottom label */}
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
        One user query becomes many simultaneous sub-queries.
      </div>
    </AbsoluteFill>
  );
};
