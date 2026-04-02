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
// Two diverging pathways: Training Data vs Agentic Search

export const TrainingVsAgentic: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title fades in
  const titleOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Fork point appears
  const forkOpacity = interpolate(frame, [20, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Left lane (Training Data) slides in
  const leftX = interpolate(frame, [40, 80], [80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const leftOpacity = interpolate(frame, [40, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Right lane (Agentic) slides in with delay
  const rightX = interpolate(frame, [65, 105], [-80, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.exp),
  });
  const rightOpacity = interpolate(frame, [65, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Lane details appear
  const detailsOpacity = interpolate(frame, [110, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Highlight agentic as dominant
  const agenticGlow = interpolate(frame, [120, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bottom insight
  const insightOpacity = interpolate(frame, [165, 195], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
        gap: 0,
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div
        style={{
          fontSize: 28,
          fontWeight: 400,
          color: COLORS.orange,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: titleOpacity,
          marginBottom: 56,
          textAlign: "center",
        }}
      >
        How LLMs Get Their Information
      </div>

      {/* Fork diagram */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: 0,
          position: "relative",
          alignItems: "flex-start",
        }}
      >
        {/* Left lane — Training Data (historical, faded) */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${leftX}px)`,
            opacity: leftOpacity,
            padding: "40px 48px",
            border: `1px solid ${COLORS.graphite}44`,
            borderRight: "none",
            borderRadius: "8px 0 0 8px",
            background: "#0e0e18",
            display: "flex",
            flexDirection: "column",
            gap: 20,
            filter: "grayscale(0.4)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 400,
              color: "#ffffff44",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Pathway A
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#ffffff66",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Training
            <br />
            Data
          </div>
          <div
            style={{
              width: 40,
              height: 3,
              background: COLORS.graphite,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              opacity: detailsOpacity,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {[
              "Static snapshot of the web",
              "Knowledge cutoff date",
              "Baked in at model training",
              "Hard to influence post-launch",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  fontSize: 20,
                  fontWeight: 300,
                  color: "#ffffff44",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ color: COLORS.graphite, fontSize: 16 }}>✗</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Fork divider */}
        <div
          style={{
            width: 4,
            alignSelf: "stretch",
            background: `linear-gradient(180deg, ${COLORS.orange}88, ${COLORS.orange}44)`,
            opacity: forkOpacity,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 16,
              height: 16,
              borderRadius: "50%",
              background: COLORS.orange,
              boxShadow: `0 0 20px ${COLORS.orange}`,
            }}
          />
        </div>

        {/* Right lane — Agentic Search (bold, glowing) */}
        <div
          style={{
            flex: 1,
            transform: `translateX(${rightX}px)`,
            opacity: rightOpacity,
            padding: "40px 48px",
            border: `2px solid ${COLORS.cyan}${Math.round(agenticGlow * 200)
              .toString(16)
              .padStart(2, "0")}`,
            borderLeft: "none",
            borderRadius: "0 8px 8px 0",
            background: `${COLORS.cyan}${Math.round(agenticGlow * 15)
              .toString(16)
              .padStart(2, "0")}`,
            display: "flex",
            flexDirection: "column",
            gap: 20,
            boxShadow: `inset 0 0 ${agenticGlow * 40}px ${COLORS.cyan}22`,
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 400,
              color: COLORS.cyan,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Pathway B — Active
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: "#ffffff",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Agentic
            <br />
            Search
          </div>
          <div
            style={{
              width: 40,
              height: 3,
              background: COLORS.cyan,
              borderRadius: 2,
            }}
          />
          <div
            style={{
              opacity: detailsOpacity,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {[
              "Live web crawling at query time",
              "Real-time retrieval",
              "Ranks by authority + extractability",
              "Optimizable right now",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  fontSize: 20,
                  fontWeight: 300,
                  color: "#ffffffcc",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <span style={{ color: COLORS.cyan, fontSize: 16 }}>✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom insight */}
      <div
        style={{
          marginTop: 40,
          fontSize: 26,
          fontWeight: 400,
          color: COLORS.cyan,
          textAlign: "center",
          opacity: insightOpacity,
          letterSpacing: "0.02em",
        }}
      >
        GEO targets Agentic Search — the path you can actually influence.
      </div>
    </AbsoluteFill>
  );
};
