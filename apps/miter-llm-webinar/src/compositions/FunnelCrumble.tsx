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
// Classic marketing funnel cracks and crumbles, LLM chat interface rises

const FUNNEL_STAGES = [
  { label: "AWARENESS", width: 600, color: "#ffffff22" },
  { label: "CONSIDERATION", width: 460, color: "#ffffff1a" },
  { label: "DECISION", width: 320, color: "#ffffff14" },
  { label: "PURCHASE", width: 200, color: "#ffffff10" },
];

// Pseudo-random for fragment positions
const seededRandom = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// Crack fragments
const FRAGMENTS = Array.from({ length: 16 }, (_, i) => ({
  dx: (seededRandom(i * 5) - 0.5) * 800,
  dy: seededRandom(i * 5 + 1) * 400 + 200,
  rotation: (seededRandom(i * 5 + 2) - 0.5) * 720,
  size: seededRandom(i * 5 + 3) * 40 + 20,
  delay: seededRandom(i * 5 + 4) * 15,
}));

export const FunnelCrumble: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-70): Funnel builds up
  // Phase 2 (70-90): Funnel shakes
  // Phase 3 (90-140): Funnel crumbles apart
  // Phase 4 (140-210): LLM chat rises from below
  // Phase 5 (210+): Insight text

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Funnel stages stagger in
  const funnelBuildProgress = (stageIndex: number) =>
    interpolate(frame, [10 + stageIndex * 12, 30 + stageIndex * 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });

  // Shake phase
  const shakeAmount = interpolate(frame, [70, 90], [0, 8], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const shakeX =
    Math.sin(frame * 2.5) * shakeAmount * (frame >= 70 && frame <= 140 ? 1 : 0);
  const shakeY =
    Math.cos(frame * 3.1) *
    shakeAmount *
    0.5 *
    (frame >= 70 && frame <= 140 ? 1 : 0);

  // Crumble phase — funnel opacity drops, fragments fly
  const crumbleProgress = interpolate(frame, [90, 130], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  const funnelOpacity = interpolate(crumbleProgress, [0, 0.6], [1, 0], {
    extrapolateRight: "clamp",
  });

  // Flash on crumble
  const flashOpacity = interpolate(frame, [88, 92, 100], [0, 0.15, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // LLM chat interface rises
  const chatRiseY = interpolate(frame, [140, 200], [300, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const chatOpacity = interpolate(frame, [140, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Chat glow
  const chatGlow = spring({
    frame: frame - 180,
    fps,
    config: { damping: 20, stiffness: 80 },
    durationInFrames: 40,
  });

  const funnelCenterX = 960;
  const funnelTopY = 220;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.dark,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Flash */}
      <AbsoluteFill
        style={{
          background: "#ffffff",
          opacity: flashOpacity,
          pointerEvents: "none",
        }}
      />

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
        The Funnel Is Crumbling
      </div>

      {/* Funnel stages */}
      <div
        style={{
          position: "absolute",
          left: funnelCenterX,
          top: funnelTopY,
          transform: `translate(-50%, 0) translate(${shakeX}px, ${shakeY}px)`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
          opacity: funnelOpacity,
        }}
      >
        {FUNNEL_STAGES.map((stage, i) => {
          const buildOp = funnelBuildProgress(i);
          return (
            <div
              key={stage.label}
              style={{
                width: stage.width,
                height: 90,
                background: stage.color,
                border: `1px solid ${COLORS.graphite}88`,
                borderRadius: 6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: buildOp,
                transform: `scaleY(${buildOp})`,
                transformOrigin: "top center",
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#ffffff66",
                  letterSpacing: "0.15em",
                }}
              >
                {stage.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Crumble fragments */}
      {FRAGMENTS.map((frag, i) => {
        const fragProgress = interpolate(
          frame,
          [90 + frag.delay, 140 + frag.delay],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        );
        const fragOpacity = interpolate(fragProgress, [0.6, 1], [1, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: funnelCenterX + frag.dx * fragProgress,
              top: funnelTopY + 200 + frag.dy * fragProgress,
              width: frag.size,
              height: frag.size * 0.6,
              background: `${COLORS.graphite}44`,
              border: `1px solid ${COLORS.graphite}66`,
              borderRadius: 2,
              transform: `rotate(${frag.rotation * fragProgress}deg)`,
              opacity: fragOpacity * crumbleProgress,
            }}
          />
        );
      })}

      {/* LLM Chat interface rising */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) translateY(${chatRiseY}px)`,
          opacity: chatOpacity,
          width: 520,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Chat window */}
        <div
          style={{
            background: `${COLORS.cyan}08`,
            border: `2px solid ${COLORS.cyan}66`,
            borderRadius: 16,
            padding: "28px 36px",
            boxShadow: `0 0 ${chatGlow * 60}px ${COLORS.cyan}33`,
          }}
        >
          {/* User message */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 300,
              color: "#ffffff88",
              marginBottom: 20,
            }}
          >
            "Best windows for cold climates?"
          </div>
          {/* AI response */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              color: COLORS.cyan,
              lineHeight: 1.4,
            }}
          >
            Based on testing data, Milgard's triple-pane series leads in energy
            efficiency...
          </div>
        </div>

        {/* "LLM" label */}
        <div
          style={{
            textAlign: "center",
            fontSize: 30,
            fontWeight: 700,
            color: COLORS.orange,
            letterSpacing: "0.1em",
          }}
        >
          The New Buyer Journey
        </div>
      </div>
    </AbsoluteFill>
  );
};
