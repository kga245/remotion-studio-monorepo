import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { fontFamily } from "../theme";
import { COLORS, SPRING_CONFIG, TYPOGRAPHY } from "../design";
import { FadeWrapper } from "../components/FadeWrapper";

// ─── AuditMethodology ─────────────────────────────────────────────────────────
//
// Four cards covering the audit methodology VO:
//
//   AuditSetup        — "To understand MITER's GEO baseline, we ran an audit." (6s)
//   AuditByNumbers    — 500 prompts · 5 categories · 3 platforms  (8s)
//   AuditPlatforms    — Google AI Overviews / Google AI Mode / ChatGPT  (8s)
//   AuditDefinitions  — Mention vs. Citation defined side-by-side  (10s)
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── AuditSetup ───────────────────────────────────────────────────────────────

export const AuditSetup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = (delay: number, cfg = SPRING_CONFIG.snappy) =>
    spring({ frame, fps, config: cfg, delay: delay * fps });

  const labelP = s(0.2);
  const lineP = s(0.4);
  const lineW = interpolate(lineP, [0, 1], [0, 64]);
  const headP = s(0.6, { damping: 18, stiffness: 70 });
  const headY = interpolate(headP, [0, 1], [20, 0]);

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
                  textTransform: "uppercase" as const,
                }}
              >
                GEO Performance Audit
              </span>
            </div>

            <div
              style={{
                width: lineW,
                height: 3,
                background: `linear-gradient(to right, ${COLORS.orange}, ${COLORS.cyan})`,
                borderRadius: 2,
                marginBottom: 36,
              }}
            />

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
              }}
            >
              To understand MITER's
              <br />
              current GEO baseline,
              <br />
              we ran a{" "}
              <span style={{ color: COLORS.orange }}>performance audit.</span>
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── AuditByNumbers ───────────────────────────────────────────────────────────

export const AuditByNumbers: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = (delay: number, cfg = SPRING_CONFIG.snappy) =>
    spring({ frame, fps, config: cfg, delay: delay * fps });

  const labelP = s(0.2);

  const stats = [
    { value: "500+", label: "Prompts tested", color: COLORS.orange },
    { value: "5", label: "Topic categories", color: COLORS.cyan },
    { value: "3", label: "Platforms queried", color: COLORS.orange },
  ];

  const statAnims = [
    s(0.7, { damping: 14, stiffness: 80 }),
    s(1.4, { damping: 14, stiffness: 80 }),
    s(2.1, { damping: 14, stiffness: 80 }),
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
            <div style={{ opacity: labelP, marginBottom: 56 }}>
              <span
                style={{
                  fontFamily,
                  fontSize: TYPOGRAPHY.label,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: 4,
                  textTransform: "uppercase" as const,
                }}
              >
                By the Numbers
              </span>
            </div>

            <div style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>
              {stats.map(({ value, label, color }, i) => {
                const p = statAnims[i];
                const y = interpolate(p, [0, 1], [28, 0]);
                return (
                  <div
                    key={label}
                    style={{
                      opacity: p,
                      transform: `translateY(${y}px)`,
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                    }}
                  >
                    <div
                      style={{
                        fontFamily,
                        fontSize: 140,
                        fontWeight: 900,
                        color,
                        letterSpacing: -5,
                        lineHeight: 0.9,
                      }}
                    >
                      {value}
                    </div>
                    <div
                      style={{
                        fontFamily,
                        fontSize: TYPOGRAPHY.subhead,
                        fontWeight: 300,
                        color: "rgba(255,255,255,0.55)",
                        letterSpacing: 0.5,
                        paddingTop: 12,
                      }}
                    >
                      {label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── AuditPlatforms ───────────────────────────────────────────────────────────

export const AuditPlatforms: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = (delay: number, cfg = SPRING_CONFIG.snappy) =>
    spring({ frame, fps, config: cfg, delay: delay * fps });

  const labelP = s(0.2);

  const platforms = [
    { name: "Google AI Overviews", color: COLORS.cyan },
    { name: "Google AI Mode", color: COLORS.cyan },
    { name: "ChatGPT", color: COLORS.orange },
  ];

  const platAnims = [
    s(0.6, { damping: 16, stiffness: 80 }),
    s(1.4, { damping: 16, stiffness: 80 }),
    s(2.2, { damping: 16, stiffness: 80 }),
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
            <div style={{ opacity: labelP, marginBottom: 52 }}>
              <span
                style={{
                  fontFamily,
                  fontSize: TYPOGRAPHY.label,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: 4,
                  textTransform: "uppercase" as const,
                }}
              >
                Platforms Tested
              </span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {platforms.map(({ name, color }, i) => {
                const p = platAnims[i];
                const x = interpolate(p, [0, 1], [-40, 0]);
                return (
                  <div
                    key={name}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 24,
                      opacity: p,
                      transform: `translateX(${x}px)`,
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily,
                        fontSize: 72,
                        fontWeight: 700,
                        color: COLORS.white,
                        letterSpacing: -2,
                      }}
                    >
                      {name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── AuditDefinitions ─────────────────────────────────────────────────────────

export const AuditDefinitions: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = (delay: number, cfg = SPRING_CONFIG.snappy) =>
    spring({ frame, fps, config: cfg, delay: delay * fps });

  const labelP = s(0.2);
  const col1P = s(0.6, { damping: 16, stiffness: 80 });
  const col1Y = interpolate(col1P, [0, 1], [24, 0]);
  const col2P = s(1.4, { damping: 16, stiffness: 80 });
  const col2Y = interpolate(col2P, [0, 1], [24, 0]);

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
            <div style={{ opacity: labelP, marginBottom: 52 }}>
              <span
                style={{
                  fontFamily,
                  fontSize: TYPOGRAPHY.label,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: 4,
                  textTransform: "uppercase" as const,
                }}
              >
                What We Measured
              </span>
            </div>

            <div style={{ display: "flex", gap: 80, alignItems: "flex-start" }}>
              {/* Mention */}
              <div
                style={{
                  flex: 1,
                  opacity: col1P,
                  transform: `translateY(${col1Y}px)`,
                }}
              >
                <div
                  style={{
                    height: 4,
                    background: "rgba(255,255,255,0.25)",
                    borderRadius: 2,
                    marginBottom: 28,
                  }}
                />
                <div
                  style={{
                    fontFamily,
                    fontSize: TYPOGRAPHY.label,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.45)",
                    letterSpacing: 5,
                    textTransform: "uppercase" as const,
                    marginBottom: 16,
                  }}
                >
                  Mention
                </div>
                <div
                  style={{
                    fontFamily,
                    fontSize: 60,
                    fontWeight: 800,
                    color: COLORS.white,
                    letterSpacing: -1.5,
                    lineHeight: 1.1,
                    marginBottom: 20,
                  }}
                >
                  Your brand named
                  <br />
                  in the response.
                </div>
                <div
                  style={{
                    fontFamily,
                    fontSize: TYPOGRAPHY.body,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.5,
                  }}
                >
                  The LLM referenced MITER by name — no link required.
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  width: 1,
                  alignSelf: "stretch",
                  background: "rgba(255,255,255,0.08)",
                  flexShrink: 0,
                }}
              />

              {/* Citation */}
              <div
                style={{
                  flex: 1,
                  opacity: col2P,
                  transform: `translateY(${col2Y}px)`,
                }}
              >
                <div
                  style={{
                    height: 4,
                    background: COLORS.cyan,
                    borderRadius: 2,
                    marginBottom: 28,
                  }}
                />
                <div
                  style={{
                    fontFamily,
                    fontSize: TYPOGRAPHY.label,
                    fontWeight: 700,
                    color: COLORS.cyan,
                    letterSpacing: 5,
                    textTransform: "uppercase" as const,
                    marginBottom: 16,
                  }}
                >
                  Citation
                </div>
                <div
                  style={{
                    fontFamily,
                    fontSize: 60,
                    fontWeight: 800,
                    color: COLORS.white,
                    letterSpacing: -1.5,
                    lineHeight: 1.1,
                    marginBottom: 20,
                  }}
                >
                  A link to your site
                  <br />
                  in the results.
                </div>
                <div
                  style={{
                    fontFamily,
                    fontSize: TYPOGRAPHY.body,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.45)",
                    lineHeight: 1.5,
                  }}
                >
                  The LLM surfaced a direct link to MITER's website — the
                  stronger signal.
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};
