import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, fontFamily } from "../theme";

// 8 seconds = 240 frames
// Two diverging pathways: Training Data vs Agentic Search

export const TrainingVsAgentic: React.FC = () => {
  const frame = useCurrentFrame();

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

  // Bottom label
  const insightOpacity = interpolate(frame, [145, 175], [0, 1], {
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
          fontSize: 44,
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
            border: `1px solid ${COLORS.graphite}88`,
            borderRight: "none",
            borderRadius: "8px 0 0 8px",
            background: "#0e0e18",
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Mechanism A
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: COLORS.white,
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
              "Knowledge embedded during model training",
              "Reflects content as it existed at training time",
              "Present in every LLM response by default",
              "Updated only when the model is retrained",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  fontSize: 26,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.60)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    color: COLORS.graphite,
                    fontSize: 18,
                    marginTop: 4,
                    flexShrink: 0,
                  }}
                >
                  —
                </span>
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
            border: `1px solid ${COLORS.cyan}66`,
            borderLeft: "none",
            borderRadius: "0 8px 8px 0",
            background: `${COLORS.cyan}08`,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 400,
              color: COLORS.cyan,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            Mechanism B
          </div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 900,
              color: COLORS.white,
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Agentic
            <br />
            Retrieval
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
              "Content fetched live at the moment of the query",
              "Draws from current sources on the web",
              "Active in search-augmented models",
              "What the model retrieves, not what it knows",
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  fontSize: 26,
                  fontWeight: 300,
                  color: "rgba(255,255,255,0.60)",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <span
                  style={{
                    color: COLORS.cyan,
                    fontSize: 18,
                    marginTop: 4,
                    flexShrink: 0,
                  }}
                >
                  —
                </span>
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
          fontSize: 32,
          fontWeight: 400,
          color: COLORS.cyan,
          textAlign: "center",
          opacity: insightOpacity,
          letterSpacing: "0.02em",
        }}
      >
        Two distinct mechanisms — both active in modern AI responses.
      </div>
    </AbsoluteFill>
  );
};
