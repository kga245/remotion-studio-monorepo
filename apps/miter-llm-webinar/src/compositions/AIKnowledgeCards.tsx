import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { fontFamily } from "../theme";
import { COLORS, TYPOGRAPHY } from "../design";
import { FadeWrapper } from "../components/FadeWrapper";

// ─── AI Knowledge Cards ────────────────────────────────────────────────────────
//
// Rapid-fire question cards for Eric's segment on whether AI truly knows
// MITER brands. Each card is short (75 frames = 2.5s) and snaps in fast.
//
// Pattern: small cyan "DOES AI KNOW" label → big white question → key terms orange.
// Final card flips to orange text as the "gotcha" payoff.
//
// ─────────────────────────────────────────────────────────────────────────────

type AIKnowsCardProps = {
  children: React.ReactNode; // question text — use <O> and <C> for colors
  label?: string; // top label, default "DOES AI KNOW"
  payoff?: boolean; // true = orange-tinted ending card
};

// Shorthand color wrappers for inline use in question text
export const O: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: COLORS.orange }}>{children}</span>
);
export const C: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span style={{ color: COLORS.cyan }}>{children}</span>
);

const AIKnowsCard: React.FC<AIKnowsCardProps> = ({
  children,
  label = "DOES AI KNOW",
  payoff = false,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Snappy label — arrives at frame 0, done by frame ~6
  const labelP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 400 },
    delay: 0,
  });

  // Question — slams in at frame 4, done by frame ~12
  const questionP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 400 },
    delay: 0.1 * fps,
  });
  const questionY = interpolate(questionP, [0, 1], [18, 0]);

  // Accent bar under label
  const lineP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 400 },
    delay: 0,
  });
  const lineW = interpolate(lineP, [0, 1], [0, 48]);

  const textColor = payoff ? COLORS.orange : COLORS.white;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={0.5}>
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
            {/* Label */}
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
                  flexShrink: 0,
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
                {label}
              </span>
            </div>

            {/* Accent line */}
            <div
              style={{
                width: lineW,
                height: 3,
                background: `linear-gradient(to right, ${COLORS.cyan}, ${COLORS.orange})`,
                borderRadius: 2,
                marginBottom: 32,
              }}
            />

            {/* Question text */}
            <div
              style={{
                fontFamily,
                fontSize: TYPOGRAPHY.display,
                fontWeight: 700,
                color: textColor,
                letterSpacing: -2,
                lineHeight: 1.12,
                maxWidth: 1480,
                opacity: questionP,
                transform: `translateY(${questionY}px)`,
              }}
            >
              {children}
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── Individual card exports ──────────────────────────────────────────────────
//
// Durations:
//   Intro card: 90 frames (3s) — gives time to read the setup
//   Question cards: 75 frames (2.5s) — rapid fire
//   Payoff card: 90 frames (3s) — let it breathe at the end

export const AIKnowsIntro: React.FC = () => (
  <AIKnowsCard label="FOR MITER BRANDS">
    Does AI actually know
    <br />
    <O>who you are?</O>
  </AIKnowsCard>
);

export const AIKnows1947: React.FC = () => (
  <AIKnowsCard>
    That <O>MI</O> has been manufacturing
    <br />
    windows since <O>1947?</O>
  </AIKnowsCard>
);

export const AIKnowsHistory: React.FC = () => (
  <AIKnowsCard>
    Your history of <O>innovation</O>
    <br />
    and product leadership?
  </AIKnowsCard>
);

export const AIKnowsMilgard: React.FC = () => (
  <AIKnowsCard>
    <O>Milgard</O> dominance
    <br />
    in the Western US market?
  </AIKnowsCard>
);

export const AIKnowsEnergy: React.FC = () => (
  <AIKnowsCard>
    Your <O>energy ratings?</O>
  </AIKnowsCard>
);

export const AIKnowsDealer: React.FC = () => (
  <AIKnowsCard>
    Your <O>dealer network?</O>
  </AIKnowsCard>
);

export const AIKnowsWarranty: React.FC = () => (
  <AIKnowsCard>
    Your <O>warranty story?</O>
  </AIKnowsCard>
);

export const AIDefaulting: React.FC = () => (
  <AIKnowsCard label="OR IS IT" payoff>
    defaulting to whatever
    <br />a <C>competitor</C> is saying about you?
  </AIKnowsCard>
);
