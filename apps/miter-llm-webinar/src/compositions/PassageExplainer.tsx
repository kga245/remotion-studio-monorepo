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

// ─── PassageExplainer ─────────────────────────────────────────────────────────
//
// Two compositions:
//
//   EvaluationQuestion   — Setup card: "How do LLMs evaluate and cite content?"
//   PageVsPassage        — Side-by-side concept: Page (narrative) vs Passage (answer)
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── LLMEvalRoadmap ───────────────────────────────────────────────────────────
//
// 16s (480 frames) agenda card:
//   "How do LLMs evaluate and cite content?"
//   Three concepts stagger in — Passage vs. Page, Query Fan-Outs, Cosine Similarity.
//   Closes with the speaker's reassurance line.

export const LLMEvalRoadmap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = (delay: number, cfg = SPRING_CONFIG.snappy) =>
    spring({ frame, fps, config: cfg, delay: delay * fps });

  const labelP = s(0.2);
  const lineP = s(0.4);
  const lineW = interpolate(lineP, [0, 1], [0, 64]);
  const headP = s(0.6, { damping: 18, stiffness: 70 });
  const headY = interpolate(headP, [0, 1], [20, 0]);
  const preP = s(1.4);

  const item1P = s(2.0, { damping: 16, stiffness: 80 });
  const item1Y = interpolate(item1P, [0, 1], [20, 0]);
  const item2P = s(3.0, { damping: 16, stiffness: 80 });
  const item2Y = interpolate(item2P, [0, 1], [20, 0]);
  const item3P = s(4.0, { damping: 16, stiffness: 80 });
  const item3Y = interpolate(item3P, [0, 1], [20, 0]);

  const reassP = s(5.4);
  const reassY = interpolate(reassP, [0, 1], [12, 0]);

  const items = [
    { num: "01", term: "Passage vs. Page", color: COLORS.cyan },
    { num: "02", term: "Query Fan-Outs", color: COLORS.orange },
    { num: "03", term: "Cosine Similarity", color: COLORS.cyan },
  ];
  const itemAnims = [
    { p: item1P, y: item1Y },
    { p: item2P, y: item2Y },
    { p: item3P, y: item3Y },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.5}>
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 140,
              right: 140,
              transform: "translateY(-50%)",
            }}
          >
            {/* Section label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 20,
                opacity: labelP,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 16,
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
                  textTransform: "uppercase" as const,
                }}
              >
                The Core Question
              </span>
            </div>

            {/* Animated rule */}
            <div
              style={{
                width: lineW,
                height: 3,
                background: `linear-gradient(to right, ${COLORS.cyan}, ${COLORS.orange})`,
                borderRadius: 2,
                marginBottom: 36,
              }}
            />

            {/* Question headline */}
            <div
              style={{
                fontFamily,
                fontSize: 80,
                fontWeight: 800,
                color: COLORS.white,
                letterSpacing: -2.5,
                lineHeight: 1.08,
                opacity: headP,
                transform: `translateY(${headY}px)`,
                marginBottom: 44,
              }}
            >
              How do LLMs evaluate
              <br />
              and <span style={{ color: COLORS.cyan }}>cite content?</span>
            </div>

            {/* "Three concepts" intro */}
            <div
              style={{
                fontFamily,
                fontSize: 28,
                fontWeight: 300,
                color: "rgba(255,255,255,0.40)",
                letterSpacing: 0.3,
                marginBottom: 28,
                opacity: preP,
              }}
            >
              Three concepts, made plain:
            </div>

            {/* Numbered items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {items.map(({ num, term, color }, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    opacity: itemAnims[i].p,
                    transform: `translateY(${itemAnims[i].y}px)`,
                  }}
                >
                  <span
                    style={{
                      fontFamily,
                      fontSize: 18,
                      fontWeight: 800,
                      color,
                      letterSpacing: 3,
                      opacity: 0.7,
                      minWidth: 36,
                    }}
                  >
                    {num}
                  </span>
                  <div
                    style={{
                      width: 1,
                      height: 44,
                      background: "rgba(255,255,255,0.10)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily,
                      fontSize: 52,
                      fontWeight: 700,
                      color: COLORS.white,
                      letterSpacing: -1.5,
                    }}
                  >
                    {term}
                  </span>
                </div>
              ))}
            </div>

            {/* Reassurance */}
            <div
              style={{
                marginTop: 36,
                paddingTop: 24,
                borderTop: "1px solid rgba(255,255,255,0.07)",
                opacity: reassP,
                transform: `translateY(${reassY}px)`,
                fontFamily,
                fontSize: 26,
                fontWeight: 300,
                fontStyle: "italic",
                color: "rgba(255,255,255,0.40)",
              }}
            >
              Don't worry — I'll make each of these plain and clear.
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── EvaluationQuestion ───────────────────────────────────────────────────────
//
// Poses the question as a visual moment before the explainer.
// Duration: 6s (180 frames)

export const EvaluationQuestion: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const labelP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.15 * fps,
  });
  const lineP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.35 * fps,
  });
  const lineW = interpolate(lineP, [0, 1], [0, 56]);
  const headP = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 70 },
    delay: 0.55 * fps,
  });
  const headY = interpolate(headP, [0, 1], [16, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.2}>
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 140,
              right: 140,
              transform: "translateY(-50%)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 20,
                opacity: labelP,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 16,
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
                The Core Question
              </span>
            </div>

            <div
              style={{
                width: lineW,
                height: 3,
                background: `linear-gradient(to right, ${COLORS.cyan}, ${COLORS.orange})`,
                borderRadius: 2,
                marginBottom: 32,
              }}
            />

            <div
              style={{
                fontFamily,
                fontSize: 96,
                fontWeight: 800,
                color: COLORS.white,
                letterSpacing: -3,
                lineHeight: 1.05,
                opacity: headP,
                transform: `translateY(${headY}px)`,
              }}
            >
              How do LLMs
              <br />
              evaluate and
              <br />
              <span style={{ color: COLORS.cyan }}>cite content?</span>
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── PageVsPassage ────────────────────────────────────────────────────────────
//
// Side-by-side: left = Page (narrative), right = Passage (direct answer).
// Each column shows an example of the format, not just a description.
// Duration: 14s (420 frames)

export const PageVsPassage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = (delay: number, cfg = SPRING_CONFIG.snappy) =>
    spring({ frame, fps, config: cfg, delay: delay * fps });

  const titleP = s(0.1);
  const col1P = s(0.3, { damping: 16, stiffness: 80 });
  const col1Y = interpolate(col1P, [0, 1], [24, 0]);
  const dividerP = s(0.7);
  const col2P = s(0.8, { damping: 16, stiffness: 80 });
  const col2Y = interpolate(col2P, [0, 1], [24, 0]);

  // Passage Q&A stagger
  const qLabelP = s(1.4);
  const qTextP = s(1.7);
  const aLabelP = s(2.4);
  const aTextP = s(2.7);
  const citeP = s(3.6);

  // Bottom takeaway
  const takeawayP = s(4.0);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.5}>
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              flexDirection: "column",
              padding: "52px 100px 52px",
            }}
          >
            {/* Top label */}
            <div
              style={{
                fontFamily,
                fontSize: TYPOGRAPHY.label,
                fontWeight: 700,
                color: "rgba(255,255,255,0.30)",
                letterSpacing: 4,
                textTransform: "uppercase",
                marginBottom: 28,
                opacity: titleP,
              }}
            >
              How LLMs evaluate content
            </div>

            {/* Two columns */}
            <div style={{ display: "flex", flex: 1, gap: 0, minHeight: 0 }}>
              {/* ── LEFT: The Page ── */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  paddingRight: 56,
                  opacity: col1P,
                  transform: `translateY(${col1Y}px)`,
                }}
              >
                {/* Column header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 20,
                      background: COLORS.orange,
                      borderRadius: 2,
                    }}
                  />
                  <div
                    style={{
                      fontFamily,
                      fontSize: TYPOGRAPHY.subhead,
                      fontWeight: 700,
                      color: COLORS.orange,
                      letterSpacing: -0.5,
                    }}
                  >
                    A Page
                  </div>
                  <div
                    style={{
                      fontFamily,
                      fontSize: TYPOGRAPHY.small,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.35)",
                      marginLeft: 4,
                    }}
                  >
                    — narrative content
                  </div>
                </div>

                {/* Page document mockup */}
                <div
                  style={{
                    flex: 1,
                    position: "relative",
                    background: "#111118",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 12,
                    padding: "32px 36px",
                    overflow: "hidden",
                  }}
                >
                  {/* Doc title */}
                  <div
                    style={{
                      fontFamily,
                      fontSize: 26,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.65)",
                      marginBottom: 20,
                      paddingBottom: 16,
                      borderBottom: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    Understanding Window Energy Efficiency
                  </div>

                  {/* Paragraph 1 */}
                  <div
                    style={{
                      fontFamily,
                      fontSize: 24,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.40)",
                      lineHeight: 1.65,
                      marginBottom: 20,
                    }}
                  >
                    The story of energy-efficient windows begins in the 1970s,
                    when the oil crisis forced homeowners and manufacturers
                    alike to rethink how buildings managed heat. What had once
                    been a simple pane of glass became the subject of serious
                    engineering.
                  </div>

                  {/* Paragraph 2 */}
                  <div
                    style={{
                      fontFamily,
                      fontSize: 24,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.40)",
                      lineHeight: 1.65,
                    }}
                  >
                    Frame materials evolved from aluminum — a conductor of heat
                    — toward vinyl and eventually fiberglass. Each generation
                    brought new trade-offs between cost, durability, and thermal
                    performance...
                  </div>

                  {/* Bottom fade — document continues */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 100,
                      background: "linear-gradient(transparent, #111118)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  width: 1,
                  background: "rgba(255,255,255,0.08)",
                  flexShrink: 0,
                  opacity: dividerP,
                }}
              />

              {/* ── RIGHT: The Passage ── */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  paddingLeft: 56,
                  opacity: col2P,
                  transform: `translateY(${col2Y}px)`,
                }}
              >
                {/* Column header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      width: 3,
                      height: 20,
                      background: COLORS.cyan,
                      borderRadius: 2,
                    }}
                  />
                  <div
                    style={{
                      fontFamily,
                      fontSize: TYPOGRAPHY.subhead,
                      fontWeight: 700,
                      color: COLORS.cyan,
                      letterSpacing: -0.5,
                    }}
                  >
                    A Passage
                  </div>
                  <div
                    style={{
                      fontFamily,
                      fontSize: TYPOGRAPHY.small,
                      fontWeight: 300,
                      color: "rgba(255,255,255,0.35)",
                      marginLeft: 4,
                    }}
                  >
                    — a direct answer
                  </div>
                </div>

                {/* Passage Q&A mockup */}
                <div
                  style={{
                    flex: 1,
                    background: "#0c0c18",
                    border: `1px solid ${COLORS.cyan}28`,
                    borderRadius: 12,
                    padding: "32px 36px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Q */}
                  <div style={{ marginBottom: 28, opacity: qLabelP }}>
                    <div
                      style={{
                        fontFamily,
                        fontSize: TYPOGRAPHY.label,
                        fontWeight: 700,
                        color: COLORS.cyan,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        marginBottom: 12,
                      }}
                    >
                      Question
                    </div>
                    <div
                      style={{
                        fontFamily,
                        fontSize: 28,
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.85)",
                        lineHeight: 1.45,
                        opacity: qTextP,
                      }}
                    >
                      What window type performs best in high-humidity climates?
                    </div>
                  </div>

                  <div
                    style={{
                      height: 1,
                      background: "rgba(255,255,255,0.07)",
                      marginBottom: 28,
                    }}
                  />

                  {/* A */}
                  <div style={{ flex: 1, opacity: aLabelP }}>
                    <div
                      style={{
                        fontFamily,
                        fontSize: TYPOGRAPHY.label,
                        fontWeight: 700,
                        color: COLORS.orange,
                        letterSpacing: 3,
                        textTransform: "uppercase",
                        marginBottom: 12,
                      }}
                    >
                      Answer
                    </div>
                    <div
                      style={{
                        fontFamily,
                        fontSize: 26,
                        fontWeight: 300,
                        color: "rgba(255,255,255,0.75)",
                        lineHeight: 1.6,
                        opacity: aTextP,
                      }}
                    >
                      Fiberglass-framed windows perform best in high-humidity
                      environments. Unlike vinyl, fiberglass maintains a
                      consistent seal regardless of temperature swings. Look for
                      fusion-welded corners and a U-factor below 0.30.
                    </div>
                  </div>

                  {/* Citation tag */}
                  <div
                    style={{
                      marginTop: 28,
                      paddingTop: 20,
                      borderTop: `1px solid ${COLORS.cyan}18`,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      opacity: citeP,
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: COLORS.cyan,
                        opacity: 0.6,
                      }}
                    />
                    <div
                      style={{
                        fontFamily,
                        fontSize: TYPOGRAPHY.small,
                        color: COLORS.cyan,
                        opacity: 0.55,
                        letterSpacing: 0.5,
                      }}
                    >
                      This is what an LLM can extract and cite
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom takeaway */}
            <div
              style={{
                marginTop: 28,
                paddingTop: 24,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                opacity: takeawayP,
                display: "flex",
                alignItems: "center",
                gap: 20,
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 36,
                  background: COLORS.orange,
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontFamily,
                  fontSize: TYPOGRAPHY.subhead,
                  fontWeight: 700,
                  color: COLORS.white,
                  letterSpacing: -0.5,
                }}
              >
                Be the best solution to a problem.{" "}
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};
