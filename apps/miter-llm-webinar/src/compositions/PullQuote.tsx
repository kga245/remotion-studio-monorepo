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

type PullQuoteProps = {
  quote: string;
  attribution: string; // "Name, Title"
};

// ─── Base component ───────────────────────────────────────────────────────────

const PullQuote: React.FC<PullQuoteProps> = ({ quote, attribution }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.2 * fps,
  });

  const quoteProgress = spring({
    frame,
    fps,
    config: { damping: 20, stiffness: 60 }, // slower, more weight
    delay: 0.6 * fps,
  });

  const attrProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 1.4 * fps,
  });

  const lineProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 1.2 * fps,
  });

  const lineWidth = interpolate(lineProgress, [0, 1], [0, 40]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={2.0}>
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 1100,
              textAlign: "center",
            }}
          >
            {/* Decorative opening mark — 120 is in the 101–160 range → TYPOGRAPHY.stat */}
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: TYPOGRAPHY.stat,
                fontWeight: 700,
                color: COLORS.orange,
                lineHeight: 0.5,
                opacity: markProgress,
                marginBottom: 32,
                display: "block",
              }}
            >
              "
            </div>

            {/* Quote text */}
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: TYPOGRAPHY.title,
                fontWeight: 300,
                color: COLORS.white,
                letterSpacing: -0.5,
                lineHeight: 1.45,
                opacity: quoteProgress,
                marginBottom: 40,
              }}
            >
              {quote}
            </div>

            {/* Attribution line */}
            <div
              style={{
                width: lineWidth,
                height: 2,
                background: COLORS.orange,
                borderRadius: 1,
                margin: "0 auto 20px",
              }}
            />
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: TYPOGRAPHY.small,
                fontWeight: 400,
                color: COLORS.gray,
                letterSpacing: 2,
                textTransform: "uppercase",
                opacity: attrProgress,
              }}
            >
              {attribution}
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── Quote exports ────────────────────────────────────────────────────────────

export const PullQuote01: React.FC = () => (
  <PullQuote
    quote="The brands that win in GEO aren't the ones spending the most — they're the ones telling the clearest story."
    attribution="Eric Dome, Creative Director, BOL Agency"
  />
);

export const PullQuote02: React.FC = () => (
  <PullQuote
    quote="LLMs don't rank pages. They cite sources. That changes everything about how you compete for visibility."
    attribution="Kelly Abbott, Chief AI Officer, BOL Agency"
  />
);

export const PullQuote03: React.FC = () => (
  <PullQuote
    quote="If your brand isn't showing up in AI responses, you're invisible to a growing share of buyers — before they ever reach your website."
    attribution="Catfish Comstock, Sr. Director of SEO + AI Strategy, BOL Agency"
  />
);

export const PullQuote04: React.FC = () => (
  <PullQuote
    quote="We've structured today's content to be for anyone — from those newer to AI and GEO strategies, to those on weekly calls with the BOL team discussing these topics."
    attribution="Sarah Rockwood"
  />
);
