import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 7 seconds = 210 frames
// LLM as nightclub bouncer: three staccato text slams

type SlamLineProps = {
  text: string;
  startFrame: number;
  fromLeft?: boolean;
  accent?: boolean;
};

const SlamLine: React.FC<SlamLineProps> = ({
  text,
  startFrame,
  fromLeft = true,
  accent = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 18, stiffness: 300, mass: 0.8 },
    durationInFrames: 30,
  });

  const x = interpolate(progress, [0, 1], [fromLeft ? -200 : 200, 0]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Shake on impact
  const shake = interpolate(
    frame,
    [startFrame, startFrame + 3, startFrame + 6, startFrame + 9, startFrame + 12],
    [0, -8, 5, -3, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        transform: `translateX(${x + shake}px)`,
        opacity,
        fontSize: accent ? 72 : 64,
        fontWeight: 900,
        color: accent ? COLORS.orange : "#ffffff",
        letterSpacing: "-0.02em",
        textTransform: "uppercase",
        lineHeight: 1.1,
        padding: "0 80px",
        borderLeft: accent ? `6px solid ${COLORS.orange}` : `6px solid ${COLORS.graphite}`,
        paddingLeft: 32,
      }}
    >
      {text}
    </div>
  );
};

export const Studio54Bouncer: React.FC = () => {
  const frame = useCurrentFrame();

  // Vignette pulsing
  const vignetteOpacity = interpolate(frame, [0, 30], [0.8, 0.5], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "#0a080e",
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        gap: 40,
      }}
    >
      {/* Radial vignette overlay */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse at center, transparent 30%, #000000 100%)`,
          opacity: vignetteOpacity,
          pointerEvents: "none",
        }}
      />

      {/* Subtle noise texture via repeating gradient */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(255,255,255,0.015) 2px,
            rgba(255,255,255,0.015) 4px
          )`,
          pointerEvents: "none",
        }}
      />

      {/* Context label */}
      <div
        style={{
          position: "absolute",
          top: 60,
          left: 80,
          fontSize: 20,
          fontWeight: 400,
          color: COLORS.graphite,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        LLM Gatekeeping Logic
      </div>

      {/* The three slams */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 48,
          paddingLeft: 80,
        }}
      >
        <SlamLine text="Can't bribe the bouncer." startFrame={0} fromLeft />
        <SlamLine text="Can't sneak in." startFrame={50} fromLeft={false} />
        <SlamLine
          text="The bouncer knows who belongs."
          startFrame={105}
          fromLeft
          accent
        />
      </div>

      {/* Bottom rule line */}
      <div
        style={{
          position: "absolute",
          bottom: 60,
          left: 80,
          right: 80,
          height: 1,
          background: `linear-gradient(90deg, ${COLORS.orange}88, transparent)`,
        }}
      />
    </AbsoluteFill>
  );
};
