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

// ─── AttributionPath ──────────────────────────────────────────────────────────
//
// Three compositions on why LLM attribution is hard to track:
//
//   AttributionIntro        — states the question (8s)
//   AttributionMemoryPath   — heard in LLM → brand search (12s)
//   AttributionArticlePath  — LLM cites article → article gets credit (12s)
//
// Each "path" card shows a left-to-right journey of step nodes:
//   cyan  = LLM-originated
//   white = user action
//   orange = what analytics actually records (the incomplete picture)
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── Shared sub-components ────────────────────────────────────────────────────

const StepNode: React.FC<{
  step: string;
  label: string;
  sub: string;
  accentColor: string;
  progress: number;
}> = ({ step, label, sub, accentColor, progress }) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 10,
      opacity: progress,
      transform: `translateY(${interpolate(progress, [0, 1], [18, 0])}px)`,
    }}
  >
    {/* Top accent bar */}
    <div style={{ height: 3, background: accentColor, borderRadius: 2 }} />

    {/* Step label (e.g. "Step 1") */}
    <div
      style={{
        fontFamily,
        fontSize: TYPOGRAPHY.label,
        fontWeight: 700,
        color: accentColor,
        letterSpacing: 3,
        textTransform: "uppercase" as const,
        marginTop: 8,
        opacity: 0.75,
      }}
    >
      {step}
    </div>

    {/* Main node label */}
    <div
      style={{
        fontFamily,
        fontSize: 40,
        fontWeight: 700,
        color: COLORS.white,
        letterSpacing: -1,
        lineHeight: 1.1,
      }}
    >
      {label}
    </div>

    {/* Sub-description */}
    <div
      style={{
        fontFamily,
        fontSize: TYPOGRAPHY.body,
        fontWeight: 300,
        color: "rgba(255,255,255,0.48)",
        lineHeight: 1.5,
        whiteSpace: "pre-line" as const,
      }}
    >
      {sub}
    </div>
  </div>
);

const FlowArrow: React.FC<{ progress: number }> = ({ progress }) => (
  <div
    style={{
      flexShrink: 0,
      width: 56,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: 24,
      opacity: progress,
    }}
  >
    <span
      style={{
        fontFamily,
        fontSize: 32,
        color: "rgba(255,255,255,0.18)",
        fontWeight: 300,
      }}
    >
      →
    </span>
  </div>
);

// ─── AttributionIntro ─────────────────────────────────────────────────────────
//
// Poses the attribution question before the two-path explainer.
// Duration: 8s (240 frames)

export const AttributionIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = (delay: number, cfg = SPRING_CONFIG.snappy) =>
    spring({ frame, fps, config: cfg, delay: delay * fps });

  const labelP = s(0.2);
  const lineP = s(0.4);
  const lineW = interpolate(lineP, [0, 1], [0, 64]);
  const headP = s(0.6, { damping: 18, stiffness: 70 });
  const headY = interpolate(headP, [0, 1], [20, 0]);
  const subP = s(1.5);
  const subY = interpolate(subP, [0, 1], [12, 0]);

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
                The Attribution Problem
              </span>
            </div>

            {/* Animated rule */}
            <div
              style={{
                width: lineW,
                height: 3,
                background: `linear-gradient(to right, ${COLORS.orange}, ${COLORS.cyan})`,
                borderRadius: 2,
                marginBottom: 36,
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
                lineHeight: 1.05,
                opacity: headP,
                transform: `translateY(${headY}px)`,
                marginBottom: 36,
              }}
            >
              Why is an LLM's
              <br />
              impact hard
              <br />
              to <span style={{ color: COLORS.orange }}>track?</span>
            </div>

            {/* Subtitle */}
            <div
              style={{
                fontFamily,
                fontSize: TYPOGRAPHY.subhead,
                fontWeight: 300,
                color: "rgba(255,255,255,0.42)",
                letterSpacing: -0.5,
                lineHeight: 1.45,
                opacity: subP,
                transform: `translateY(${subY}px)`,
              }}
            >
              LLMs influence decisions — but the path to your site
              <br />
              rarely shows that origin in your analytics.
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── AttributionMemoryPath ────────────────────────────────────────────────────
//
// Path 1: User hears brand in LLM → files it away → later searches brand name.
// Analytics credits: Direct / Brand Search. LLM: invisible.
// Duration: 12s (360 frames)

export const AttributionMemoryPath: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = (delay: number, cfg = SPRING_CONFIG.snappy) =>
    spring({ frame, fps, config: cfg, delay: delay * fps });

  const titleP = s(0.15);

  // Step nodes and arrows
  const n1P = s(0.5);
  const a1P = s(0.9);
  const n2P = s(1.1);
  const a2P = s(1.5);
  const n3P = s(1.7);
  const a3P = s(2.1);
  const n4P = s(2.3);

  // Attribution callout
  const attrP = s(3.4);
  const attrY = interpolate(attrP, [0, 1], [14, 0]);

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
              padding: "56px 100px 48px",
            }}
          >
            {/* Card header */}
            <div style={{ marginBottom: 44, opacity: titleP }}>
              <div
                style={{
                  fontFamily,
                  fontSize: TYPOGRAPHY.label,
                  fontWeight: 700,
                  color: COLORS.orange,
                  letterSpacing: 4,
                  textTransform: "uppercase" as const,
                  marginBottom: 10,
                }}
              >
                Path 1 — The Memory Path
              </div>
              <div
                style={{
                  fontFamily,
                  fontSize: TYPOGRAPHY.subhead,
                  fontWeight: 700,
                  color: COLORS.white,
                  letterSpacing: -0.5,
                }}
              >
                Heard in LLM — searched for later
              </div>
            </div>

            {/* 4-step flow */}
            <div style={{ display: "flex", flex: 1, alignItems: "flex-start" }}>
              <StepNode
                step="Step 1"
                label="LLM Chat"
                sub={"Brand X mentioned as\na recommendation"}
                accentColor={COLORS.cyan}
                progress={n1P}
              />
              <FlowArrow progress={a1P} />
              <StepNode
                step="Step 2"
                label="Filed Away"
                sub={"User notes the brand,\nends the conversation"}
                accentColor={"rgba(255,255,255,0.30)"}
                progress={n2P}
              />
              <FlowArrow progress={a2P} />
              <StepNode
                step="Step 3"
                label="Browser Opens"
                sub={"Later, user types the\nbrand name in search"}
                accentColor={"rgba(255,255,255,0.30)"}
                progress={n3P}
              />
              <FlowArrow progress={a3P} />
              <StepNode
                step="Analytics Records"
                label="Brand Search"
                sub={"Direct or branded search\n— LLM gets no credit"}
                accentColor={COLORS.orange}
                progress={n4P}
              />
            </div>

            {/* Takeaway */}
            <div
              style={{
                marginTop: 28,
                paddingTop: 24,
                borderTop: "1px solid rgba(255,255,255,0.07)",
                opacity: attrP,
                transform: `translateY(${attrY}px)`,
                display: "flex",
                alignItems: "center",
                gap: 14,
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
                  fontSize: TYPOGRAPHY.body,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.4,
                }}
              >
                This brand search is a{" "}
                <span style={{ color: COLORS.orange, fontWeight: 600 }}>
                  proxy signal
                </span>{" "}
                — evidence of LLM influence, but no direct link in your
                analytics.
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── AttributionArticlePath ───────────────────────────────────────────────────
//
// Path 2: LLM cites an article → user visits article → finds site via article.
// Analytics credits: Referral from article. LLM origin: invisible.
// Duration: 12s (360 frames)

export const AttributionArticlePath: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = (delay: number, cfg = SPRING_CONFIG.snappy) =>
    spring({ frame, fps, config: cfg, delay: delay * fps });

  const titleP = s(0.15);

  const n1P = s(0.5);
  const a1P = s(0.9);
  const n2P = s(1.1);
  const a2P = s(1.5);
  const n3P = s(1.7);
  const a3P = s(2.1);
  const n4P = s(2.3);

  const attrP = s(3.4);
  const attrY = interpolate(attrP, [0, 1], [14, 0]);

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
              padding: "56px 100px 48px",
            }}
          >
            {/* Card header */}
            <div style={{ marginBottom: 44, opacity: titleP }}>
              <div
                style={{
                  fontFamily,
                  fontSize: TYPOGRAPHY.label,
                  fontWeight: 700,
                  color: COLORS.cyan,
                  letterSpacing: 4,
                  textTransform: "uppercase" as const,
                  marginBottom: 10,
                }}
              >
                Path 2 — The Article Path
              </div>
              <div
                style={{
                  fontFamily,
                  fontSize: TYPOGRAPHY.subhead,
                  fontWeight: 700,
                  color: COLORS.white,
                  letterSpacing: -0.5,
                }}
              >
                LLM cites article — article gets the credit
              </div>
            </div>

            {/* 4-step flow */}
            <div style={{ display: "flex", flex: 1, alignItems: "flex-start" }}>
              <StepNode
                step="Step 1"
                label="LLM Research"
                sub={"User asks LLM about\nproducts or solutions"}
                accentColor={COLORS.cyan}
                progress={n1P}
              />
              <FlowArrow progress={a1P} />
              <StepNode
                step="Step 2"
                label="Article Cited"
                sub={"LLM surfaces an article\nwhere your brand appears"}
                accentColor={COLORS.cyan}
                progress={n2P}
              />
              <FlowArrow progress={a2P} />
              <StepNode
                step="Step 3"
                label="Article Visited"
                sub={"User reads the article,\nthen clicks through to site"}
                accentColor={"rgba(255,255,255,0.30)"}
                progress={n3P}
              />
              <FlowArrow progress={a3P} />
              <StepNode
                step="Analytics Records"
                label="Article Referral"
                sub={"Traffic from article\n— LLM origin invisible"}
                accentColor={COLORS.orange}
                progress={n4P}
              />
            </div>

            {/* Takeaway */}
            <div
              style={{
                marginTop: 28,
                paddingTop: 24,
                borderTop: "1px solid rgba(255,255,255,0.07)",
                opacity: attrP,
                transform: `translateY(${attrY}px)`,
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 4,
                  height: 36,
                  background: COLORS.cyan,
                  borderRadius: 2,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  fontFamily,
                  fontSize: TYPOGRAPHY.body,
                  fontWeight: 400,
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.4,
                }}
              >
                Attribution points to the{" "}
                <span style={{ color: COLORS.cyan, fontWeight: 600 }}>
                  article
                </span>{" "}
                — but the original impetus was{" "}
                <span style={{ color: COLORS.cyan, fontWeight: 600 }}>
                  LLM research
                </span>
                . The article was the middle step, not the source.
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};
