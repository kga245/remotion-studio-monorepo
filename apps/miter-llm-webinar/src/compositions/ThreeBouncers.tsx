import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 9 seconds = 270 frames
// Three sequential barrier reveals: Fetchability, Authority, Extractability

type BarrierCardProps = {
  number: string;
  title: string;
  question: string;
  startFrame: number;
  color: string;
};

const BarrierCard: React.FC<BarrierCardProps> = ({
  number,
  title,
  question,
  startFrame,
  color,
}) => {
  const frame = useCurrentFrame();

  const cardProgress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 150 },
    durationInFrames: 35,
  });

  const numberY = interpolate(cardProgress, [0, 1], [-80, 0]);
  const contentOpacity = interpolate(
    frame,
    [startFrame + 15, startFrame + 35],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const contentY = interpolate(
    frame,
    [startFrame + 15, startFrame + 35],
    [30, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    },
  );
  const cardOpacity = interpolate(cardProgress, [0, 0.2], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        opacity: cardOpacity,
        padding: "40px 32px",
        border: `1px solid ${color}44`,
        borderTop: `4px solid ${color}`,
        background: `${color}08`,
        borderRadius: 4,
      }}
    >
      {/* Number */}
      <div
        style={{
          fontSize: 96,
          fontWeight: 900,
          color,
          lineHeight: 1,
          transform: `translateY(${numberY}px)`,
          letterSpacing: "-0.05em",
        }}
      >
        {number}
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: 38,
          fontWeight: 900,
          color: "#ffffff",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          textAlign: "center",
          opacity: contentOpacity,
          transform: `translateY(${contentY}px)`,
        }}
      >
        {title}
      </div>

      {/* Divider */}
      <div
        style={{
          width: 60,
          height: 2,
          background: color,
          opacity: contentOpacity,
        }}
      />

      {/* Question */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 300,
          color: "#ffffffaa",
          textAlign: "center",
          lineHeight: 1.5,
          opacity: contentOpacity,
          transform: `translateY(${contentY}px)`,
        }}
      >
        {question}
      </div>
    </div>
  );
};

export const ThreeBouncers: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const headerY = interpolate(frame, [0, 20], [-30, 0], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.dark,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 80px",
        gap: 48,
      }}
    >
      {/* Header */}
      <div
        style={{
          fontSize: 44,
          fontWeight: 400,
          color: COLORS.orange,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          textAlign: "center",
        }}
      >
        Three Barriers to LLM Visibility
      </div>

      {/* Cards row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 32,
          width: "100%",
        }}
      >
        <BarrierCard
          number="01"
          title="Fetchability"
          question="Is your content easy for LLMs to find and access?"
          startFrame={20}
          color={COLORS.orange}
        />
        <BarrierCard
          number="02"
          title="Authority"
          question="Is your content worth citing and trusting?"
          startFrame={70}
          color={COLORS.cyan}
        />
        <BarrierCard
          number="03"
          title="Extractability"
          question="Is your content usable as a direct answer?"
          startFrame={120}
          color="#a78bfa"
        />
      </div>
    </AbsoluteFill>
  );
};
