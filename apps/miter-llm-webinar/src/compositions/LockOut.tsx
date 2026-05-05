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
// A vault door slowly closes with competitor names inside
// Once sealed, outside goes dark — urgency and finality

const COMPETITORS = ["Andersen", "Pella", "Marvin", "Renewal"];

export const LockOut: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1 (0-40): Door open, competitors visible inside glowing room
  // Phase 2 (40-120): Door slowly swings shut
  // Phase 3 (120-150): SLAM — door seals with impact
  // Phase 4 (150-200): "LOCKED OUT" text, darkness settles
  // Phase 5 (200+): Insight

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Door angle: 0 = open (90°), 1 = closed (0°)
  const doorCloseProgress = interpolate(frame, [40, 118], [0, 0.92], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.quad),
  });
  // Slam — quick snap to fully closed
  const slamProgress = interpolate(frame, [118, 125], [0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const doorProgress = Math.min(doorCloseProgress + (slamProgress - 0.92), 1);

  // Door visual width (perspective simulation)
  const doorWidth = interpolate(doorProgress, [0, 1], [380, 0]);
  const doorOpacity = interpolate(doorProgress, [0.8, 1], [1, 0.9], {
    extrapolateRight: "clamp",
  });

  // Room glow dims as door closes
  const roomGlow = interpolate(doorProgress, [0, 0.7, 1], [1, 0.4, 0], {
    extrapolateRight: "clamp",
  });

  // Competitor names stagger in
  const compOpacity = (i: number) =>
    interpolate(frame, [5 + i * 8, 20 + i * 8], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // Slam shake
  const shakeX =
    frame >= 120 && frame <= 135
      ? Math.sin((frame - 120) * 4) * interpolate(frame, [120, 135], [10, 0])
      : 0;

  // Flash on slam
  const slamFlash = interpolate(frame, [120, 123, 130], [0, 0.2, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "LOCKED OUT" text
  const lockedScale = spring({
    frame: frame - 140,
    fps,
    config: { damping: 10, stiffness: 200, mass: 1.1 },
    durationInFrames: 35,
  });
  const lockedOpacity = interpolate(frame, [140, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Outer darkness deepens
  const darknessOverlay = interpolate(frame, [100, 150], [0, 0.5], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bottom insight
  const insightOpacity = interpolate(frame, [195, 225], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const doorX = 960;
  const doorY = 480;

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
        Once You're Out, You're Out
      </div>

      {/* Scene container with shake */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: `translateX(${shakeX}px)`,
        }}
      >
        {/* Room interior (behind the door) — glowing warm */}
        <div
          style={{
            position: "absolute",
            left: doorX - 250,
            top: doorY - 200,
            width: 500,
            height: 400,
            background: `radial-gradient(ellipse, ${COLORS.orange}${Math.round(
              roomGlow * 30,
            )
              .toString(16)
              .padStart(2, "0")} 0%, transparent 70%)`,
            borderRadius: 12,
            border: `1px solid ${COLORS.orange}${Math.round(roomGlow * 60)
              .toString(16)
              .padStart(2, "0")}`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          {/* Room label */}
          <div
            style={{
              fontSize: 22,
              fontWeight: 400,
              color: `${COLORS.orange}${Math.round(roomGlow * 180)
                .toString(16)
                .padStart(2, "0")}`,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              marginBottom: 8,
            }}
          >
            The LLM's Recommendations
          </div>

          {/* Competitor names inside */}
          {COMPETITORS.map((name, i) => (
            <div
              key={name}
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: `#ffffff${Math.round(compOpacity(i) * roomGlow * 200)
                  .toString(16)
                  .padStart(2, "0")}`,
                letterSpacing: "0.05em",
              }}
            >
              {name}
            </div>
          ))}
        </div>

        {/* The vault door — swings from right edge */}
        <div
          style={{
            position: "absolute",
            left: doorX + 250 - doorWidth,
            top: doorY - 220,
            width: doorWidth,
            height: 440,
            background: `linear-gradient(90deg, ${COLORS.graphite}ee, ${COLORS.graphite}cc)`,
            borderRadius: "4px 0 0 4px",
            border: `2px solid #555`,
            opacity: doorOpacity,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Door handle */}
          {doorWidth > 40 && (
            <div
              style={{
                width: 20,
                height: 60,
                background: "#888",
                borderRadius: 4,
              }}
            />
          )}
        </div>

        {/* Left door frame */}
        <div
          style={{
            position: "absolute",
            left: doorX - 260,
            top: doorY - 225,
            width: 12,
            height: 450,
            background: COLORS.graphite,
            borderRadius: 2,
          }}
        />
        {/* Right door frame */}
        <div
          style={{
            position: "absolute",
            left: doorX + 248,
            top: doorY - 225,
            width: 12,
            height: 450,
            background: COLORS.graphite,
            borderRadius: 2,
          }}
        />
      </div>

      {/* Slam flash */}
      <AbsoluteFill
        style={{
          background: "#ffffff",
          opacity: slamFlash,
          pointerEvents: "none",
        }}
      />

      {/* Darkness overlay */}
      <AbsoluteFill
        style={{
          background: COLORS.dark,
          opacity: darknessOverlay,
          pointerEvents: "none",
        }}
      />

      {/* "LOCKED OUT" text */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "45%",
          transform: `translate(-50%, -50%) scale(${lockedScale})`,
          opacity: lockedOpacity,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontSize: 100,
            fontWeight: 900,
            color: "#ff3333",
            letterSpacing: "-0.03em",
            lineHeight: 1,
            textShadow: "0 0 40px #ff333366",
          }}
        >
          LOCKED OUT
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 300,
            color: "#ffffff88",
            marginTop: 20,
          }}
        >
          Your competitors own the conversation.
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
        Once an LLM learns to recommend competitors, you don't get to claw it
        back.
      </div>
    </AbsoluteFill>
  );
};
