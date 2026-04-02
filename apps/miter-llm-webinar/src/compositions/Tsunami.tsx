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
// "A slow burn gives you time. A big wave don't care if you're ready."

export const Tsunami: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Phase 1: "slow burn" text + gentle wave
  // Phase 2: wave grows dramatically
  // Phase 3: "big wave" quote slams in

  // Background gradient shift (calm → danger)
  const bgHue = interpolate(frame, [0, 120, 180], [220, 210, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Wave height grows
  const waveHeight = interpolate(frame, [0, 180], [80, 520], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  // Wave opacity
  const waveOpacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Wave turbulence increases
  const turbulence = interpolate(frame, [60, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "A slow burn" line
  const line1Opacity = interpolate(frame, [15, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line1Y = interpolate(frame, [15, 40], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // "gives you time." fades out as danger approaches
  const line1FadeOut = interpolate(frame, [120, 160], [1, 0.3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "A big wave" slams in
  const line2Scale = spring({
    frame: frame - 150,
    fps,
    config: { damping: 10, stiffness: 200, mass: 1.1 },
    durationInFrames: 35,
  });
  const line2Opacity = interpolate(frame, [150, 165], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "don't care if you're ready" appears
  const line3Opacity = interpolate(frame, [185, 210], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line3Y = interpolate(frame, [185, 210], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Wave crest path — animated sine curve
  const amplitude = 20 + turbulence * 40;
  const period = 400 - turbulence * 150;
  const points = Array.from({ length: 40 }, (_, i) => {
    const x = (i / 39) * 1920;
    const y = 1080 - waveHeight + Math.sin((x / period + frame / 15) * Math.PI * 2) * amplitude;
    return `${x},${y}`;
  }).join(" L ");

  const wavePath = `M 0,1080 L ${points} L 1920,1080 Z`;

  // Secondary smaller wave
  const wave2Points = Array.from({ length: 40 }, (_, i) => {
    const x = (i / 39) * 1920;
    const y =
      1080 -
      waveHeight * 0.85 +
      Math.sin((x / (period * 0.7) + frame / 12 + 1.5) * Math.PI * 2) * amplitude * 0.6;
    return `${x},${y}`;
  }).join(" L ");
  const wave2Path = `M 0,1080 L ${wave2Points} L 1920,1080 Z`;

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(180deg, #07070f 0%, #0a1525 100%)`,
        fontFamily,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* Wave SVG */}
      <svg
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: waveOpacity,
        }}
        viewBox="0 0 1920 1080"
        preserveAspectRatio="none"
      >
        {/* Back wave */}
        <path
          d={wave2Path}
          fill={`${COLORS.cyan}22`}
        />
        {/* Front wave */}
        <path
          d={wavePath}
          fill={`${COLORS.cyan}44`}
        />
        {/* Wave crest highlight */}
        <polyline
          points={points}
          fill="none"
          stroke={`${COLORS.cyan}99`}
          strokeWidth={2}
        />
      </svg>

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
          padding: "0 120px",
          textAlign: "center",
        }}
      >
        {/* Line 1 */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 300,
            color: "#ffffffcc",
            opacity: line1Opacity * line1FadeOut,
            transform: `translateY(${line1Y}px)`,
          }}
        >
          A slow burn gives you time.
        </div>

        {/* Line 2 */}
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: COLORS.orange,
            opacity: line2Opacity,
            transform: `scale(${line2Scale})`,
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            textShadow: `0 0 60px ${COLORS.orange}66`,
          }}
        >
          A big wave
          <br />
          don't care
        </div>

        {/* Line 3 */}
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            opacity: line3Opacity,
            transform: `translateY(${line3Y}px)`,
            letterSpacing: "-0.01em",
          }}
        >
          if you're ready.
        </div>
      </div>
    </AbsoluteFill>
  );
};
