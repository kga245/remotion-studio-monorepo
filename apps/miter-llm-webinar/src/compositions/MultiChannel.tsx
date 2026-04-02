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
// Hub-and-spoke: GEO at center, 6 channels around it

const CHANNELS = [
  { label: "SEO", color: COLORS.orange, delay: 40 },
  { label: "Content", color: COLORS.cyan, delay: 55 },
  { label: "PR", color: "#a78bfa", delay: 70 },
  { label: "Paid", color: "#34d399", delay: 85 },
  { label: "Technical", color: "#fbbf24", delay: 100 },
  { label: "Brand", color: "#f472b6", delay: 115 },
];

type SpokeProps = {
  label: string;
  color: string;
  angle: number;
  delay: number;
  radius: number;
};

const Spoke: React.FC<SpokeProps> = ({ label, color, angle, delay, radius }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 160 },
    durationInFrames: 35,
  });

  const rad = (angle * Math.PI) / 180;
  const x = Math.cos(rad) * radius;
  const y = Math.sin(rad) * radius;

  const nodeOpacity = interpolate(progress, [0, 0.4], [0, 1], {
    extrapolateRight: "clamp",
  });
  const nodeScale = interpolate(progress, [0, 1], [0.3, 1]);

  // Line length grows with progress
  const lineLength = interpolate(progress, [0, 1], [0, radius - 56]);

  return (
    <>
      {/* Spoke line */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: lineLength,
          height: 1,
          background: `linear-gradient(90deg, ${color}66, ${color}22)`,
          transformOrigin: "left center",
          transform: `rotate(${angle}deg)`,
          opacity: nodeOpacity,
        }}
      />

      {/* Node */}
      <div
        style={{
          position: "absolute",
          left: `calc(50% + ${x}px)`,
          top: `calc(50% + ${y}px)`,
          transform: `translate(-50%, -50%) scale(${nodeScale})`,
          opacity: nodeOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: 110,
          height: 110,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          background: `${color}15`,
          gap: 0,
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color,
            letterSpacing: "0.05em",
            textAlign: "center",
          }}
        >
          {label}
        </div>
      </div>
    </>
  );
};

export const MultiChannel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Center hub springs in
  const hubScale = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
    durationInFrames: 35,
  });

  // Title
  const titleOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Bottom label
  const bottomOpacity = interpolate(frame, [160, 190], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Hub glow pulse
  const hubGlow = interpolate(
    frame,
    [35, 70, 105, 140],
    [0, 1, 0.5, 0.8],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const RADIUS = 280;
  const angleStep = 360 / CHANNELS.length;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.dark,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Title */}
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
          opacity: titleOpacity,
        }}
      >
        GEO Integrates Every Channel
      </div>

      {/* Hub + spokes centered */}
      <AbsoluteFill>
        {/* Spokes */}
        {CHANNELS.map(({ label, color, delay }, i) => (
          <Spoke
            key={label}
            label={label}
            color={color}
            angle={i * angleStep - 90}
            delay={delay}
            radius={RADIUS}
          />
        ))}

        {/* Center hub */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${hubScale})`,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${COLORS.orange}44, ${COLORS.orange}11)`,
            border: `3px solid ${COLORS.orange}`,
            boxShadow: `0 0 ${hubGlow * 60}px ${COLORS.orange}66`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 900,
              color: COLORS.orange,
              letterSpacing: "0.05em",
            }}
          >
            GEO
          </div>
        </div>
      </AbsoluteFill>

      {/* Bottom label */}
      <div
        style={{
          position: "absolute",
          bottom: 52,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 26,
          fontWeight: 300,
          color: "#ffffffaa",
          opacity: bottomOpacity,
          letterSpacing: "0.04em",
        }}
      >
        Not a new channel — an optimization layer across all of them.
      </div>
    </AbsoluteFill>
  );
};
