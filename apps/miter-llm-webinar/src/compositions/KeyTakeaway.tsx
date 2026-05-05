import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { fontFamily } from "../theme";
import { COLORS, SPRING_CONFIG, TYPOGRAPHY } from "../design";
import { FadeWrapper } from "../components/FadeWrapper";

// ─── Types ───────────────────────────────────────────────────────────────────

type KeyTakeawayProps = {
  category: string; // "The Problem", "The Opportunity"
  bullets: [string, string, string];
};

// ─── Single bullet row ────────────────────────────────────────────────────────

const BulletRow: React.FC<{ text: string; delay: number }> = ({
  text,
  delay,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay,
  });

  const translateX = interpolate(progress, [0, 1], [-16, 0]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 20,
        opacity: progress,
        transform: `translateX(${translateX}px)`,
        marginBottom: 32, // increased from 28 for larger text
      }}
    >
      {/* Bullet accent */}
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: COLORS.orange,
          marginTop: 11,
          flexShrink: 0,
        }}
      />
      <div
        style={{
          fontFamily: fontFamily,
          fontSize: TYPOGRAPHY.subhead,
          fontWeight: 300,
          color: COLORS.white,
          letterSpacing: -0.2,
          lineHeight: 1.4,
        }}
      >
        {text}
      </div>
    </div>
  );
};

// ─── Base component ───────────────────────────────────────────────────────────

const KeyTakeaway: React.FC<KeyTakeawayProps> = ({ category, bullets }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.2 * fps,
  });

  const lineProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.5 * fps,
  });

  const lineWidth = interpolate(lineProgress, [0, 1], [0, 40]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.5}>
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 1000, // slightly wider to accommodate subhead text
            }}
          >
            {/* KEY TAKEAWAYS header */}
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: TYPOGRAPHY.label,
                fontWeight: 600,
                color: COLORS.orange,
                letterSpacing: 5,
                textTransform: "uppercase",
                opacity: headerProgress,
                marginBottom: 10,
              }}
            >
              Key Takeaways
            </div>

            {/* Category */}
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: TYPOGRAPHY.title,
                fontWeight: 700,
                color: COLORS.white,
                letterSpacing: -1.5,
                lineHeight: 1,
                opacity: headerProgress,
                marginBottom: 16,
              }}
            >
              {category}
            </div>

            {/* Orange rule */}
            <div
              style={{
                width: lineWidth,
                height: 2,
                background: COLORS.orange,
                borderRadius: 1,
                marginBottom: 40,
              }}
            />

            {/* Bullets — staggered */}
            {bullets.map((text, i) => (
              <Sequence
                key={i}
                from={(0.7 + i * 0.25) * fps}
                layout="none"
                premountFor={fps}
              >
                <BulletRow text={text} delay={(0.7 + i * 0.25) * fps} />
              </Sequence>
            ))}
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── Takeaway set exports ─────────────────────────────────────────────────────

export const KeyTakeaway01: React.FC = () => (
  <KeyTakeaway
    category="The Problem"
    bullets={[
      "AI assistants now shape more purchase decisions than search rankings",
      "Brand visibility in LLM responses is measurable — and most brands have none",
      "Every day without a GEO strategy is market share quietly lost to competitors",
    ]}
  />
);

export const KeyTakeaway02: React.FC = () => (
  <KeyTakeaway
    category="The Opportunity"
    bullets={[
      "A GEO audit shows exactly where your brand appears — and where it doesn't",
      "Targeted content changes can lift citation rates within 60–90 days",
      "First movers in GEO build compounding visibility that's hard to displace",
    ]}
  />
);

export const KeyTakeaway03: React.FC = () => (
  <KeyTakeaway
    category="Your Next Steps"
    bullets={[
      "Audit your brand's current LLM visibility across key buying prompts",
      "Identify the 3–5 competitor gaps where you're being left out of responses",
      "Build a content and citation strategy designed for how AI engines evaluate sources",
    ]}
  />
);
