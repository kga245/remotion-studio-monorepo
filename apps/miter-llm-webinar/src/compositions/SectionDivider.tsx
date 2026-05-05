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

// ─── Types ───────────────────────────────────────────────────────────────────

type SectionDividerProps = {
  partNumber: string; // "01", "02", etc.
  title: string; // "The Shift"
  tagline: string; // "How AI is reshaping search"
};

// ─── Base component ───────────────────────────────────────────────────────────

const SectionDivider: React.FC<SectionDividerProps> = ({
  partNumber,
  title,
  tagline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const partProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.2 * fps,
  });

  const lineProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.6 * fps,
  });

  const titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.9 * fps,
  });

  const taglineProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 1.3 * fps,
  });

  const lineWidth = interpolate(lineProgress, [0, 1], [0, 48]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.2}>
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 120,
              transform: "translateY(-50%)",
            }}
          >
            {/* PART 0N */}
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: TYPOGRAPHY.label,
                fontWeight: 600,
                color: COLORS.orange,
                letterSpacing: 5,
                textTransform: "uppercase",
                opacity: partProgress,
                marginBottom: 18,
              }}
            >
              Part {partNumber}
            </div>

            {/* Accent line grows left to right */}
            <div
              style={{
                width: lineWidth,
                height: 3,
                background: `linear-gradient(to right, ${COLORS.orange}, ${COLORS.cyan})`,
                borderRadius: 1.5,
                marginBottom: 24,
              }}
            />

            {/* Section title */}
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: TYPOGRAPHY.display,
                fontWeight: 700,
                color: COLORS.white,
                letterSpacing: -3,
                lineHeight: 1,
                opacity: titleProgress,
                marginBottom: 20,
              }}
            >
              {title}
            </div>

            {/* Tagline */}
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: TYPOGRAPHY.body,
                fontWeight: 300,
                color: COLORS.gray,
                letterSpacing: 0.5,
                opacity: taglineProgress,
              }}
            >
              {tagline}
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── Section exports ──────────────────────────────────────────────────────────

export const Section01: React.FC = () => (
  <SectionDivider
    partNumber="01"
    title="The Shift"
    tagline="How AI is reshaping search — and who gets found"
  />
);

export const Section02: React.FC = () => (
  <SectionDivider
    partNumber="02"
    title="The Audit"
    tagline="Where your brand stands in the LLM landscape"
  />
);

export const Section03: React.FC = () => (
  <SectionDivider
    partNumber="03"
    title="The Gap"
    tagline="What the data reveals about visibility and citation"
  />
);

export const Section04: React.FC = () => (
  <SectionDivider
    partNumber="04"
    title="The Path Forward"
    tagline="How to build a GEO strategy that compounds over time"
  />
);
