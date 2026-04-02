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
// 35% YoY growth + cascading companion stats

type CompanionStatProps = {
  value: string;
  label: string;
  startFrame: number;
  color?: string;
};

const CompanionStat: React.FC<CompanionStatProps> = ({
  value,
  label,
  startFrame,
  color = "#ffffff",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 22, stiffness: 180 },
    durationInFrames: 30,
  });

  return (
    <div
      style={{
        opacity: interpolate(progress, [0, 0.3], [0, 1], {
          extrapolateRight: "clamp",
        }),
        transform: `translateY(${interpolate(progress, [0, 1], [30, 0])}px)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        flex: 1,
        borderLeft: `2px solid ${COLORS.graphite}`,
        paddingLeft: 28,
      }}
    >
      <div
        style={{
          fontSize: 52,
          fontWeight: 900,
          color,
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 16,
          fontWeight: 400,
          color: "#ffffff66",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {label}
      </div>
    </div>
  );
};

export const Growth35: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Main 35% springs in
  const mainScale = spring({
    frame,
    fps,
    config: { damping: 10, stiffness: 150, mass: 1.3 },
    durationInFrames: 45,
  });

  // "YoY Growth" label
  const labelOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // Context header
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Divider line grows
  const lineWidth = interpolate(frame, [50, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
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
        padding: "60px 120px",
        gap: 0,
        overflow: "hidden",
      }}
    >
      {/* Context header */}
      <div
        style={{
          position: "absolute",
          top: 60,
          fontSize: 22,
          fontWeight: 400,
          color: COLORS.orange,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: headerOpacity,
        }}
      >
        GEO Market Growth
      </div>

      {/* Main hero stat */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0,
          marginBottom: 48,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            transform: `scale(${mainScale})`,
            lineHeight: 0.9,
          }}
        >
          <span
            style={{
              fontSize: 260,
              fontWeight: 900,
              color: COLORS.orange,
              letterSpacing: "-0.05em",
            }}
          >
            35
          </span>
          <span
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "#ffffff",
              marginTop: 20,
              letterSpacing: "-0.02em",
            }}
          >
            %
          </span>
        </div>

        <div
          style={{
            fontSize: 40,
            fontWeight: 300,
            color: "#ffffffbb",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            opacity: labelOpacity,
            marginTop: 8,
          }}
        >
          Year-over-Year Growth
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          width: `${lineWidth * 100}%`,
          height: 1,
          background: `linear-gradient(90deg, transparent, ${COLORS.graphite}, transparent)`,
          marginBottom: 48,
        }}
      />

      {/* Companion stats row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 0,
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <CompanionStat
          value="46%"
          label="ChatGPT"
          startFrame={90}
          color={COLORS.cyan}
        />
        <CompanionStat
          value="44%"
          label="Perplexity"
          startFrame={108}
          color={COLORS.cyan}
        />
        <CompanionStat
          value="42%"
          label="Google AI"
          startFrame={126}
          color={COLORS.cyan}
        />
        <CompanionStat
          value="50%"
          label="Claude"
          startFrame={144}
          color={COLORS.cyan}
        />
      </div>
    </AbsoluteFill>
  );
};
