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

// ─── Decorative: stacked orange squares (slides 1, 4) ────────────────────────

const DecorativeSquares: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const configs = [
    { top: 48, right: 60, size: 244, delay: 1.4 },
    { top: 232, right: 274, size: 178, delay: 1.7 },
    { top: 374, right: 80, size: 138, delay: 2.0 },
  ];

  return (
    <>
      {configs.map((cfg, i) => {
        const progress = spring({
          frame,
          fps,
          config: SPRING_CONFIG.smooth,
          delay: cfg.delay * fps,
        });
        const scale = interpolate(progress, [0, 1], [0.88, 1]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: cfg.top,
              right: cfg.right,
              width: cfg.size,
              height: cfg.size,
              background: "rgba(248, 94, 50, 0.21)",
              opacity: progress,
              transform: `scale(${scale})`,
              transformOrigin: "top right",
            }}
          />
        );
      })}
    </>
  );
};

// ─── Decorative: cyan horizontal measurement bars (slide 11) ─────────────────

const DecorativeBars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Stepped bar widths create an abstract "measurement" visual
  const configs = [
    { top: 122, left: 622, width: 332, height: 52, delay: 1.3 },
    { top: 194, left: 728, width: 195, height: 44, delay: 1.6 },
    { top: 258, left: 608, width: 368, height: 52, delay: 1.9 },
    { top: 330, left: 744, width: 168, height: 44, delay: 2.2 },
    { top: 394, left: 622, width: 298, height: 52, delay: 2.5 },
  ];

  return (
    <>
      {configs.map((cfg, i) => {
        const progress = spring({
          frame,
          fps,
          config: SPRING_CONFIG.snappy,
          delay: cfg.delay * fps,
        });
        const scaleX = interpolate(progress, [0, 1], [0, 1]);
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              top: cfg.top,
              left: cfg.left,
              width: cfg.width,
              height: cfg.height,
              background: "rgba(123, 237, 248, 0.18)",
              transformOrigin: "left center",
              transform: `scaleX(${scaleX})`,
              opacity: progress,
            }}
          />
        );
      })}
    </>
  );
};

// ─── Types ───────────────────────────────────────────────────────────────────

type SectionIntroSlideProps = {
  tag: string;
  title: string;
  presenter: string;
  company: string;
  bullets: string[];
  decorativeVariant?: "squares" | "bars";
};

// ─── Base component ───────────────────────────────────────────────────────────

const SectionIntroSlide: React.FC<SectionIntroSlideProps> = ({
  tag,
  title,
  presenter,
  company,
  bullets,
  decorativeVariant = "squares",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const tagProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.2 * fps,
  });
  const titleProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 65 },
    delay: 0.55 * fps,
  });
  const lineProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 3.1 * fps,
  });
  const presenterProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 3.4 * fps,
  });

  const lineWidth = interpolate(lineProgress, [0, 1], [0, 280]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.5}>
        <AbsoluteFill>
          {decorativeVariant === "squares" ? (
            <DecorativeSquares />
          ) : (
            <DecorativeBars />
          )}

          {/* Orange tag badge */}
          <div
            style={{
              position: "absolute",
              top: 80,
              left: 80,
              background: COLORS.orange,
              padding: "10px 20px",
              opacity: tagProgress,
            }}
          >
            <span
              style={{
                fontFamily: fontFamily,
                fontSize: TYPOGRAPHY.label,
                fontWeight: 700,
                color: COLORS.white,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              {tag}
            </span>
          </div>

          {/* Title */}
          <div
            style={{
              position: "absolute",
              top: 146,
              left: 80,
              maxWidth: 1100,
              opacity: titleProgress,
            }}
          >
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: TYPOGRAPHY.display,
                fontWeight: 700,
                color: COLORS.white,
                letterSpacing: -2.5,
                lineHeight: 1.08,
              }}
            >
              {title}
            </div>
          </div>

          {/* Cyan separator line */}
          <div
            style={{
              position: "absolute",
              top: 608,
              left: 80,
              width: lineWidth,
              height: 3,
              background: COLORS.cyan,
              borderRadius: 1.5,
            }}
          />

          {/* Presenter credit */}
          <div
            style={{
              position: "absolute",
              top: 638,
              left: 80,
              fontFamily: fontFamily,
              fontSize: TYPOGRAPHY.body,
              fontWeight: 400,
              color: COLORS.cyan,
              letterSpacing: 0.3,
              opacity: presenterProgress,
            }}
          >
            {presenter} · {company}
          </div>

          {/* Bullet points */}
          {bullets.map((text, i) => {
            const bProgress = spring({
              frame,
              fps,
              config: SPRING_CONFIG.snappy,
              delay: (3.9 + i * 0.35) * fps,
            });
            const bX = interpolate(bProgress, [0, 1], [-10, 0]);
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  top: 702 + i * 56, // increased from 46 for larger text
                  left: 80,
                  display: "flex",
                  alignItems: "center",
                  gap: 18,
                  opacity: bProgress,
                  transform: `translateX(${bX}px)`,
                }}
              >
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: COLORS.white,
                    opacity: 0.65,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: fontFamily,
                    fontSize: TYPOGRAPHY.small,
                    fontWeight: 300,
                    color: COLORS.white,
                    letterSpacing: 0.2,
                  }}
                >
                  {text}
                </span>
              </div>
            );
          })}
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── Named exports ────────────────────────────────────────────────────────────

export const GEOLevelSettingIntro: React.FC = () => (
  <SectionIntroSlide
    tag="II.  Level-Setting: The LLM Landscape"
    title="GEO is already showing up in your SEO data"
    presenter="Catfish Comstock"
    company="BOL Agency"
    bullets={[
      "AI Overviews are already reshaping Google SERP results",
      "Traffic attribution gap: LLM research doesn't always appear in analytics",
      "GEO is a motion, not a channel — it amplifies everything else",
    ]}
  />
);

export const WhatWeCanMeasureIntro: React.FC = () => (
  <SectionIntroSlide
    tag="GEO Services · Measurement"
    title="What we can measure"
    presenter="Catfish Comstock"
    company="BOL Agency"
    decorativeVariant="bars"
    bullets={[
      "Share of voice in LLM responses (brand mention tracking)",
      "Passage citation frequency across major LLMs",
      "Proxy signals: branded search lift, direct traffic trends",
    ]}
  />
);

export const MiterAuditIntro: React.FC = () => (
  <SectionIntroSlide
    tag="II.  Deep Dive: Content That Wins in LLMs"
    title="MITER GEO performance audit"
    presenter="Catfish Comstock"
    company="BOL Agency"
    bullets={[
      "Milgard GEO performance",
      "PGT Windows GEO performance",
      "MI Windows GEO performance",
    ]}
  />
);
