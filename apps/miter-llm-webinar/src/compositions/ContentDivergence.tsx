import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 9 seconds = 270 frames
// Different LLMs pull in different content types like magnets
// Shows why you need diverse content

const LLMS = [
  { name: "Gemini", color: "#4285f4", x: 260, favorites: ["YouTube", "Maps"] },
  { name: "ChatGPT", color: "#10a37f", x: 660, favorites: ["Reddit", "News"] },
  {
    name: "Perplexity",
    color: "#a78bfa",
    x: 1060,
    favorites: ["Scholarly", "Blogs"],
  },
  {
    name: "Claude",
    color: COLORS.orange,
    x: 1460,
    favorites: ["Docs", "Research"],
  },
];

type ContentOrbProps = {
  label: string;
  color: string;
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  delay: number;
};

const ContentOrb: React.FC<ContentOrbProps> = ({
  label,
  color,
  targetX,
  targetY,
  startX,
  startY,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pull = spring({
    frame: frame - delay,
    fps,
    config: { damping: 14, stiffness: 100, mass: 0.8 },
    durationInFrames: 50,
  });

  const x = interpolate(pull, [0, 1], [startX, targetX]);
  const y = interpolate(pull, [0, 1], [startY, targetY]);
  const opacity = interpolate(pull, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });
  const scale = interpolate(pull, [0, 0.5, 0.8, 1], [0.4, 1.1, 0.95, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
      }}
    >
      <div
        style={{
          background: `${color}22`,
          border: `2px solid ${color}88`,
          borderRadius: 30,
          padding: "10px 24px",
          fontSize: 26,
          fontWeight: 500,
          color: "#ffffffdd",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const ContentDivergence: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // LLM columns appear
  const llmAppear = (i: number) =>
    spring({
      frame: frame - (25 + i * 12),
      fps,
      config: { damping: 16, stiffness: 160 },
      durationInFrames: 30,
    });

  // "No single format wins" label
  const divergeOpacity = interpolate(frame, [180, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bottom insight
  const insightOpacity = interpolate(frame, [220, 250], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Magnetic field lines (subtle arcs)
  const fieldOpacity = interpolate(frame, [80, 120], [0, 0.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const llmY = 380;
  const orbStartY = 200;

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
        Every LLM Has Its Favorites
      </div>

      {/* Magnetic field arcs (SVG) */}
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: fieldOpacity,
        }}
        viewBox="0 0 1920 1080"
      >
        {LLMS.map((llm, i) =>
          llm.favorites.map((_, j) => (
            <ellipse
              key={`${i}-${j}`}
              cx={llm.x + 100}
              cy={llmY - 20}
              rx={80 + j * 40}
              ry={120 + j * 30}
              fill="none"
              stroke={`${llm.color}44`}
              strokeWidth={1}
              strokeDasharray="4 8"
            />
          )),
        )}
      </svg>

      {/* LLM columns */}
      {LLMS.map((llm, i) => {
        const appear = llmAppear(i);
        return (
          <div
            key={llm.name}
            style={{
              position: "absolute",
              left: llm.x + 100,
              top: llmY,
              transform: `translate(-50%, -50%) scale(${appear})`,
              textAlign: "center",
            }}
          >
            {/* LLM icon circle */}
            <div
              style={{
                width: 110,
                height: 110,
                borderRadius: "50%",
                background: `${llm.color}22`,
                border: `3px solid ${llm.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 12px",
                boxShadow: `0 0 ${appear * 30}px ${llm.color}33`,
              }}
            >
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: llm.color,
                }}
              >
                {llm.name}
              </div>
            </div>
          </div>
        );
      })}

      {/* Content orbs — pulled toward their LLM */}
      {LLMS.map((llm, i) =>
        llm.favorites.map((fav, j) => {
          // Start scattered near top
          const startX = 300 + i * 350 + (j - 0.5) * 200;
          return (
            <ContentOrb
              key={`${llm.name}-${fav}`}
              label={fav}
              color={llm.color}
              startX={startX}
              startY={orbStartY + j * 30}
              targetX={llm.x + 100 + (j === 0 ? -60 : 60)}
              targetY={llmY + 110 + j * 60}
              delay={80 + i * 15 + j * 8}
            />
          );
        }),
      )}

      {/* "No single format wins" callout */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 720,
          transform: "translate(-50%, 0)",
          opacity: divergeOpacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#ffffff",
            marginBottom: 8,
          }}
        >
          No single content format wins everywhere.
        </div>
        <div
          style={{
            fontSize: 28,
            fontWeight: 300,
            color: COLORS.cyan,
          }}
        >
          You need a diverse content portfolio.
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
        Each LLM favors different sources — diversify or miss entire audiences.
      </div>
    </AbsoluteFill>
  );
};
