import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 6 seconds = 180 frames
// Three rapid-fire text slams. Staccato. No frills.

const SLAMS = [
  { text: "You can't pay to be cited.", delay: 0, size: 80 },
  { text: "You can't optimize your way in overnight.", delay: 45, size: 64 },
  { text: "You can only deserve it.", delay: 95, size: 96, accent: true },
];

export const CantBribe: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        background: "#06060e",
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "60px 100px",
        gap: 48,
        overflow: "hidden",
      }}
    >
      {/* Scan lines */}
      <AbsoluteFill
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(255,255,255,0.01) 3px,
            rgba(255,255,255,0.01) 4px
          )`,
          pointerEvents: "none",
        }}
      />

      {SLAMS.map(({ text, delay, size, accent }) => {
        const progress = spring({
          frame: frame - delay,
          fps,
          config: { damping: 15, stiffness: 280, mass: 0.7 },
          durationInFrames: 25,
        });

        const x = interpolate(progress, [0, 1], [-300, 0]);
        const opacity = interpolate(progress, [0, 0.25], [0, 1], {
          extrapolateRight: "clamp",
        });

        return (
          <div
            key={text}
            style={{
              transform: `translateX(${x}px)`,
              opacity,
              fontSize: size,
              fontWeight: 900,
              color: accent ? COLORS.orange : "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              textTransform: accent ? "none" : "none",
            }}
          >
            {text}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
