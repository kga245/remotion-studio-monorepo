import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { fontFamily } from "../theme";
import { COLORS, SPRING_CONFIG, TYPOGRAPHY } from "../design";
import { FadeWrapper } from "../components/FadeWrapper";

// ─── GEOStatement ─────────────────────────────────────────────────────────────
//
// Three-beat statement card:
//   1. "GEO."                              — punches in, orange, massive
//   2. "Generative Engine Optimization"    — expands underneath, cyan definition
//   3. "is how you earn that authority."   — white payoff, bold
//
// Duration: 10s (300 frames @ 30fps)
//
// ─────────────────────────────────────────────────────────────────────────────

export const GEOStatement: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Beat 1 — "GEO." punches in with scale + opacity
  const geoP = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 180 },
    delay: 0.1 * fps,
  });
  const geoScale = interpolate(geoP, [0, 1], [1.18, 1.0]);

  // Beat 2 — definition line rises up
  const defP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.7 * fps,
  });
  const defY = interpolate(defP, [0, 1], [20, 0]);

  // Accent line draws between definition and payoff
  const lineP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 1.1 * fps,
  });
  const lineW = interpolate(lineP, [0, 1], [0, 72]);

  // Beat 3 — payoff drops in
  const payoffP = spring({
    frame,
    fps,
    config: { damping: 16, stiffness: 80 },
    delay: 1.4 * fps,
  });
  const payoffY = interpolate(payoffP, [0, 1], [-16, 0]);

  // Ghost "GEO" watermark behind everything
  const ghostP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 20 },
    delay: 0,
  });
  const ghostOpacity = interpolate(ghostP, [0, 1], [0, 0.035]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.5}>
        <AbsoluteFill>
          {/* Ghost watermark */}
          <div
            style={{
              position: "absolute",
              right: -80,
              top: "50%",
              transform: "translateY(-50%)",
              fontFamily,
              fontSize: 520,
              fontWeight: 900,
              color: COLORS.orange,
              lineHeight: 1,
              letterSpacing: -20,
              opacity: ghostOpacity,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            GEO
          </div>

          {/* Content — left-aligned, vertically centered */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 140,
              right: 140,
              transform: "translateY(-50%)",
            }}
          >
            {/* Beat 1 — GEO. */}
            <div
              style={{
                fontFamily,
                fontSize: 200,
                fontWeight: 900,
                color: COLORS.orange,
                letterSpacing: -8,
                lineHeight: 1,
                marginBottom: 8,
                opacity: geoP,
                transform: `scale(${geoScale})`,
                transformOrigin: "left center",
              }}
            >
              GEO.
            </div>

            {/* Beat 2 — Generative Engine Optimization */}
            <div
              style={{
                fontFamily,
                fontSize: TYPOGRAPHY.subhead,
                fontWeight: 300,
                color: COLORS.cyan,
                letterSpacing: 3,
                textTransform: "uppercase",
                marginBottom: 36,
                opacity: defP,
                transform: `translateY(${defY}px)`,
              }}
            >
              Generative Engine Optimization
            </div>

            {/* Accent line */}
            <div
              style={{
                width: lineW,
                height: 3,
                background: `linear-gradient(to right, ${COLORS.orange}, ${COLORS.cyan})`,
                borderRadius: 2,
                marginBottom: 36,
              }}
            />

            {/* Beat 3 — is how you earn that authority. */}
            <div
              style={{
                fontFamily,
                fontSize: TYPOGRAPHY.display,
                fontWeight: 700,
                color: COLORS.white,
                letterSpacing: -2,
                lineHeight: 1.1,
                maxWidth: 1100,
                opacity: payoffP,
                transform: `translateY(${payoffY}px)`,
              }}
            >
              is how you earn
              <br />
              that authority.
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};
