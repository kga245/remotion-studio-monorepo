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

// ─── Session Series Cards ──────────────────────────────────────────────────────
//
// Two compositions for the end-of-webinar / series framing:
//
//   PartTwoCard   — positions this as Session 1 of 2; teases what's next
//   NextSessionTeaser — full forward-looking card on what Part 2 will cover
//
// Duration target: 10s (300 frames at 30fps)
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── PartTwoCard ─────────────────────────────────────────────────────────────
//
// Split-panel layout: left = what we covered, right = what's coming.
// Ghost "2" in background signals the series continues.

export const PartTwoCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const ghostP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 20 },
    delay: 0,
  });
  const ghostOpacity = interpolate(ghostP, [0, 1], [0, 0.05]);
  const ghostScale = interpolate(ghostP, [0, 1], [1.15, 1.0]);

  const eyebrowP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.25 * fps,
  });
  const eyebrowX = interpolate(eyebrowP, [0, 1], [-24, 0]);

  const lineP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.5 * fps,
  });
  const lineW = interpolate(lineP, [0, 1], [0, 56]);

  const headP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.75 * fps,
  });
  const divP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 1.1 * fps,
  });
  const col1P = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 1.3 * fps,
  });
  const col2P = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 1.7 * fps,
  });
  const col2X = interpolate(col2P, [0, 1], [24, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.5}>
        <AbsoluteFill>
          {/* Ghost "2" */}
          <div
            style={{
              position: "absolute",
              right: -60,
              top: "50%",
              transform: `translateY(-50%) scale(${ghostScale})`,
              transformOrigin: "right center",
              opacity: ghostOpacity,
              fontFamily,
              fontSize: 700,
              fontWeight: 900,
              color: "#FFFFFF",
              lineHeight: 1,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            2
          </div>

          {/* Main content */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 120,
              right: 120,
              transform: "translateY(-50%)",
            }}
          >
            {/* Eyebrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
                opacity: eyebrowP,
                transform: `translateX(${eyebrowX}px)`,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 18,
                  background: COLORS.cyan,
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  fontFamily,
                  fontSize: TYPOGRAPHY.label,
                  fontWeight: 700,
                  color: COLORS.cyan,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                }}
              >
                MITER LLM Webinar · Two-Part Series
              </span>
            </div>

            {/* Accent line */}
            <div
              style={{
                width: lineW,
                height: 3,
                background: `linear-gradient(to right, ${COLORS.cyan}, ${COLORS.orange})`,
                borderRadius: 2,
                marginBottom: 28,
              }}
            />

            {/* Headline */}
            <div
              style={{
                fontFamily,
                fontSize: TYPOGRAPHY.display,
                fontWeight: 800,
                color: COLORS.white,
                letterSpacing: -4,
                lineHeight: 0.95,
                marginBottom: 52,
                opacity: headP,
              }}
            >
              Part Two
              <br />
              <span style={{ color: COLORS.cyan }}>Is Coming</span>
            </div>

            {/* Two-column split */}
            <div
              style={{
                display: "flex",
                gap: 0,
                alignItems: "stretch",
                opacity: Math.min(col1P, divP),
              }}
            >
              {/* Column 1 — This Session */}
              <div
                style={{
                  flex: 1,
                  paddingRight: 48,
                  borderRight: `1px solid rgba(255,255,255,0.1)`,
                }}
              >
                <div
                  style={{
                    fontFamily,
                    fontSize: TYPOGRAPHY.label,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  Session 1 · Today
                </div>
                <div
                  style={{
                    fontFamily,
                    fontSize: TYPOGRAPHY.title,
                    fontWeight: 700,
                    color: COLORS.white,
                    marginBottom: 12,
                    lineHeight: 1.15,
                  }}
                >
                  The Foundation
                </div>
                <div
                  style={{
                    fontFamily,
                    fontSize: TYPOGRAPHY.body,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.55,
                  }}
                >
                  What GEO is, why it matters now, and how to think about it
                  strategically — the education layer.
                </div>
              </div>

              {/* Column 2 — Next Session */}
              <div
                style={{
                  flex: 1,
                  paddingLeft: 48,
                  opacity: col2P,
                  transform: `translateX(${col2X}px)`,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontFamily,
                      fontSize: TYPOGRAPHY.label,
                      fontWeight: 700,
                      color: COLORS.orange,
                      letterSpacing: 3,
                      textTransform: "uppercase",
                    }}
                  >
                    Session 2 · Coming Soon
                  </div>
                </div>
                <div
                  style={{
                    fontFamily,
                    fontSize: TYPOGRAPHY.title,
                    fontWeight: 700,
                    color: COLORS.white,
                    marginBottom: 12,
                    lineHeight: 1.15,
                  }}
                >
                  The Execution
                </div>
                <div
                  style={{
                    fontFamily,
                    fontSize: TYPOGRAPHY.body,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1.55,
                  }}
                >
                  Hands-on with MITER — tactical implementation, content
                  frameworks, and building your GEO action plan together.
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── NextSessionTeaser ────────────────────────────────────────────────────────
//
// Forward-looking card. Big bold question to create anticipation,
// followed by three concrete things attendees will do in Part 2.

export const NextSessionTeaser: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.2 * fps,
  });
  const lineP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.45 * fps,
  });
  const lineW = interpolate(lineP, [0, 1], [0, 56]);
  const headP = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 60 },
    delay: 0.65 * fps,
  });

  const item1P = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 1.4 * fps,
  });
  const item2P = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 1.7 * fps,
  });
  const item3P = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 2.0 * fps,
  });

  const items = [
    {
      label: "Tactical content creation",
      sub: "Building GEO-optimized content with your actual MITER use cases.",
    },
    {
      label: "Implementation frameworks",
      sub: "Templates and workflows your team can use immediately.",
    },
    {
      label: "Live strategy sessions",
      sub: "Collaborative working sessions with the BOL team to build your plan.",
    },
  ];

  const progresses = [item1P, item2P, item3P];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.5}>
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 120,
              right: 120,
              transform: "translateY(-50%)",
            }}
          >
            {/* Eyebrow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
                opacity: eyebrowP,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 18,
                  background: COLORS.orange,
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  fontFamily,
                  fontSize: TYPOGRAPHY.label,
                  fontWeight: 700,
                  color: COLORS.orange,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                }}
              >
                Next Session
              </span>
            </div>

            {/* Accent line */}
            <div
              style={{
                width: lineW,
                height: 3,
                background: `linear-gradient(to right, ${COLORS.orange}, ${COLORS.cyan})`,
                borderRadius: 2,
                marginBottom: 28,
              }}
            />

            {/* Headline */}
            <div
              style={{
                fontFamily,
                fontSize: 88,
                fontWeight: 800,
                color: COLORS.white,
                letterSpacing: -3,
                lineHeight: 1.0,
                marginBottom: 56,
                maxWidth: 1200,
                opacity: headP,
              }}
            >
              Now let's build it
              <br />
              <span style={{ color: COLORS.cyan }}>together.</span>
            </div>

            {/* Item list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 24,
                    opacity: progresses[i],
                    transform: `translateX(${interpolate(progresses[i], [0, 1], [-20, 0])}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: COLORS.orange,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 2,
                      fontFamily,
                      fontSize: TYPOGRAPHY.label,
                      fontWeight: 700,
                      color: COLORS.dark,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <div
                      style={{
                        fontFamily,
                        fontSize: TYPOGRAPHY.body,
                        fontWeight: 700,
                        color: COLORS.white,
                        marginBottom: 4,
                      }}
                    >
                      {item.label}
                    </div>
                    <div
                      style={{
                        fontFamily,
                        fontSize: TYPOGRAPHY.small,
                        fontWeight: 300,
                        color: "rgba(255,255,255,0.50)",
                        lineHeight: 1.5,
                      }}
                    >
                      {item.sub}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── GettingTechnicallyCreative ───────────────────────────────────────────────
//
// Lightweight interstitial — not a section break, just a moment marker.
// Brief, confident, no heavy decoration. Sets the stage for the Lowe's example.
//
// Duration: 5s (150 frames @ 30fps)
//
// ─────────────────────────────────────────────────────────────────────────────

export const GettingTechnicallyCreative: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const lineP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.1 * fps,
  });
  const lineW = interpolate(lineP, [0, 1], [0, 40]);

  const word1P = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.2 * fps,
  });
  const word2P = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.45 * fps,
  });
  const word3P = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.7 * fps,
  });

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.0}>
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 140,
              transform: "translateY(-50%)",
            }}
          >
            {/* Accent line */}
            <div
              style={{
                width: lineW,
                height: 3,
                background: COLORS.orange,
                borderRadius: 2,
                marginBottom: 28,
              }}
            />

            {/* Three words stagger in */}
            <div
              style={{
                fontFamily,
                fontSize: TYPOGRAPHY.display,
                fontWeight: 700,
                letterSpacing: -2,
                lineHeight: 1.05,
              }}
            >
              <span
                style={{
                  color: COLORS.white,
                  opacity: word1P,
                  display: "block",
                }}
              >
                Getting
              </span>
              <span
                style={{
                  color: COLORS.white,
                  opacity: word2P,
                  display: "block",
                }}
              >
                Technically
              </span>
              <span
                style={{
                  color: COLORS.orange,
                  opacity: word3P,
                  display: "block",
                }}
              >
                Creative.
              </span>
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};
