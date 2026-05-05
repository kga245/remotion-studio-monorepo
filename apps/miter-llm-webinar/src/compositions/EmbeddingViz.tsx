import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 9 seconds = 270 frames
// Text morphs into numbers, then numbers drift into a vector space
// Shows how LLMs convert text to embeddings

// Pseudo-random seeded positions for vector dots
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

const WORD = "Milgard";
const NUMBERS = [0.82, -0.14, 0.67, -0.39, 0.91, -0.55, 0.23];

// Vector space dots (background ambience)
const SPACE_DOTS = Array.from({ length: 40 }, (_, i) => ({
  x: seededRandom(i * 3) * 1600 + 160,
  y: seededRandom(i * 3 + 1) * 700 + 190,
  size: seededRandom(i * 3 + 2) * 4 + 2,
  delay: i * 2,
}));

export const EmbeddingViz: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-60): Word appears centered
  // Phase 2 (60-130): Letters morph into numbers
  // Phase 3 (130-200): Numbers scatter into vector space
  // Phase 4 (200+): Labels appear, bottom insight

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Word appears
  const wordScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
    durationInFrames: 30,
  });

  // Morph progress: word → numbers
  const morphProgress = interpolate(frame, [60, 110], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Scatter progress: numbers → vector positions
  const scatterProgress = interpolate(frame, [130, 200], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Word fades as morph happens
  const wordOpacity = interpolate(morphProgress, [0, 0.5], [1, 0], {
    extrapolateRight: "clamp",
  });
  const numbersOpacity = interpolate(morphProgress, [0.3, 0.8], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Vector space grid fades in
  const gridOpacity = interpolate(frame, [100, 150], [0, 0.15], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Space dots fade in
  const dotsOpacity = interpolate(frame, [140, 180], [0, 0.4], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Label for the landed point
  const labelOpacity = interpolate(frame, [210, 235], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bottom insight
  const insightOpacity = interpolate(frame, [230, 255], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final position for the number cluster
  const clusterX = 960;
  const clusterY = 500;

  // Scattered positions for each number
  const scatteredPositions = NUMBERS.map((_, i) => ({
    x: 500 + i * 140,
    y: 420 + Math.sin(i * 1.8) * 80,
  }));

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
          top: 44,
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
        How LLMs See Your Content
      </div>

      {/* Vector space grid (subtle) */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: gridOpacity,
        }}
        viewBox="0 0 1920 1080"
      >
        {/* Horizontal grid lines */}
        {Array.from({ length: 8 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={100}
            y1={200 + i * 100}
            x2={1820}
            y2={200 + i * 100}
            stroke={COLORS.cyan}
            strokeWidth={0.5}
          />
        ))}
        {/* Vertical grid lines */}
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={200 + i * 140}
            y1={150}
            x2={200 + i * 140}
            y2={950}
            stroke={COLORS.cyan}
            strokeWidth={0.5}
          />
        ))}
      </svg>

      {/* Ambient vector space dots */}
      {SPACE_DOTS.map((dot, i) => {
        const dotOp = interpolate(
          frame,
          [140 + dot.delay, 180 + dot.delay],
          [0, 0.3 + seededRandom(i * 7) * 0.3],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: dot.x,
              top: dot.y,
              width: dot.size,
              height: dot.size,
              borderRadius: "50%",
              background: `${COLORS.cyan}88`,
              opacity: dotOp * dotsOpacity,
            }}
          />
        );
      })}

      {/* The word "Milgard" — fades out during morph */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          transform: `translate(-50%, -50%) scale(${wordScale})`,
          opacity: wordOpacity,
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 900,
            color: "#ffffff",
            letterSpacing: "0.02em",
          }}
        >
          {WORD}
        </div>
      </div>

      {/* Numbers — fade in during morph, then scatter into space */}
      {NUMBERS.map((num, i) => {
        // Start position (clustered at center)
        const startX = 960 - ((NUMBERS.length - 1) * 60) / 2 + i * 60;
        const startY = 490;
        // End position (scattered)
        const endX = scatteredPositions[i].x;
        const endY = scatteredPositions[i].y;

        const x = interpolate(scatterProgress, [0, 1], [startX, endX]);
        const y = interpolate(scatterProgress, [0, 1], [startY, endY]);

        // Individual spring for each number appearing
        const numSpring = spring({
          frame: frame - (65 + i * 6),
          fps,
          config: { damping: 16, stiffness: 150 },
          durationInFrames: 25,
        });

        const numScale = interpolate(scatterProgress, [0, 1], [1, 0.85]);

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              transform: `translate(-50%, -50%) scale(${numSpring * numScale})`,
              opacity: numbersOpacity,
            }}
          >
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: COLORS.cyan,
                fontFamily: "monospace",
              }}
            >
              {num.toFixed(2)}
            </div>
          </div>
        );
      })}

      {/* "Milgard" label at the cluster landing point */}
      <div
        style={{
          position: "absolute",
          left: clusterX,
          top: clusterY + 100,
          transform: "translate(-50%, 0)",
          opacity: labelOpacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: COLORS.orange,
            marginBottom: 4,
          }}
        >
          "Milgard" → [0.82, -0.14, 0.67, ...]
        </div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 300,
            color: "#ffffff88",
          }}
        >
          Placed by meaning, not spelling
        </div>
      </div>

      {/* Bottom insight */}
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
          opacity: insightOpacity,
        }}
      >
        LLMs turn text into numbers — semantic meaning determines position.
      </div>
    </AbsoluteFill>
  );
};
