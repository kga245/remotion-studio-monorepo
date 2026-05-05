import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 8 seconds = 240 frames
// One query springs apart into sub-queries — radial burst from center

// Offsets from center (dx, dy) — hand-placed to fill the 1920×1080 canvas
// with safe margins for header (top ~100px) and footer (bottom ~100px)
const SUB_QUERIES = [
  { text: "Best window brands\nfor cold climates?", dx: -620, dy: -220 },
  { text: "U-factor ratings\ncompared by brand?", dx: 580, dy: -250 },
  { text: "Milgard vs Andersen\nenergy efficiency", dx: -560, dy: 250 },
  { text: "Vinyl or fiberglass —\nwhich insulates better?", dx: 620, dy: 220 },
  { text: "Replacement cost vs\nenergy savings ROI", dx: 0, dy: 340 },
];

const CX = 960;
const CY = 440;

type NodeProps = {
  text: string;
  dx: number;
  dy: number;
  delay: number;
};

const SpringNode: React.FC<NodeProps> = ({ text, dx, dy, delay }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Spring that overshoots — feels like it pops out
  const pop = spring({
    frame: frame - delay,
    fps,
    config: { damping: 11, stiffness: 120, mass: 0.8 },
    durationInFrames: 50,
  });

  const opacity = interpolate(pop, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  const tx = dx * pop;
  const ty = dy * pop;
  const scale = interpolate(pop, [0, 0.4, 0.7, 1], [0.3, 1.15, 0.95, 1], {
    extrapolateRight: "clamp",
  });

  // Glow pulse after landing
  const glowOpacity = interpolate(pop, [0.6, 0.8, 1], [0, 0.6, 0.25], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const lines = text.split("\n");

  return (
    <div
      style={{
        position: "absolute",
        left: CX + tx,
        top: CY + ty,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
      }}
    >
      {/* Glow ring */}
      <div
        style={{
          position: "absolute",
          inset: -14,
          borderRadius: 28,
          background: `radial-gradient(ellipse, ${COLORS.cyan}44 0%, transparent 70%)`,
          opacity: glowOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Pill */}
      <div
        style={{
          background: `linear-gradient(135deg, ${COLORS.cyan}22, ${COLORS.cyan}10)`,
          border: `2px solid ${COLORS.cyan}66`,
          borderRadius: 20,
          padding: "16px 28px",
          backdropFilter: "blur(4px)",
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{
              fontFamily,
              fontSize: 28,
              fontWeight: 400,
              color: "#ffffffdd",
              lineHeight: 1.35,
              textAlign: "center",
              whiteSpace: "nowrap",
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export const QueryFanOuts: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Root query pill scale
  const rootPop = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 160, mass: 0.7 },
    durationInFrames: 35,
  });

  // Header
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Root pill "cracks open" — shrinks slightly as nodes fly out
  const rootShrink = interpolate(frame, [55, 80], [1, 0.88], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Ring burst at moment of fan-out
  const burstProgress = spring({
    frame: frame - 55,
    fps,
    config: { damping: 20, stiffness: 100 },
    durationInFrames: 40,
  });
  const burstScale = interpolate(burstProgress, [0, 1], [0.5, 3.5], {
    extrapolateRight: "clamp",
  });
  const burstOpacity = interpolate(burstProgress, [0, 0.3, 1], [0, 0.5, 0], {
    extrapolateRight: "clamp",
  });

  // Bottom label
  const bottomOpacity = interpolate(frame, [170, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Staggered delays for each node
  const delays = [60, 66, 72, 78, 84];

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
          top: 40,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 44,
          fontWeight: 400,
          color: COLORS.orange,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: headerOpacity,
        }}
      >
        Query Fan-Out
      </div>

      {/* Burst ring */}
      <div
        style={{
          position: "absolute",
          left: CX,
          top: CY,
          width: 200,
          height: 200,
          transform: `translate(-50%, -50%) scale(${burstScale})`,
          borderRadius: "50%",
          border: `2px solid ${COLORS.orange}`,
          opacity: burstOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Sub-query nodes — spring outward */}
      {SUB_QUERIES.map((q, i) => (
        <SpringNode
          key={i}
          text={q.text}
          dx={q.dx}
          dy={q.dy}
          delay={delays[i]}
        />
      ))}

      {/* Root query pill — centered */}
      <div
        style={{
          position: "absolute",
          left: CX,
          top: CY,
          transform: `translate(-50%, -50%) scale(${rootPop * rootShrink})`,
          background: COLORS.orange,
          borderRadius: 50,
          padding: "22px 48px",
          boxShadow: `0 0 60px ${COLORS.orange}44`,
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.3,
            textAlign: "center",
            whiteSpace: "nowrap",
          }}
        >
          "Best window treatment for a bedroom?"
        </div>
      </div>

      {/* Bottom label */}
      <div
        style={{
          position: "absolute",
          bottom: 44,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 32,
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
