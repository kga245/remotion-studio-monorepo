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

// ─── Narrative Act Cards ───────────────────────────────────────────────────────
//
// Chapter-break cards for each act in the final narrative arc.
// Intentionally distinct from SectionDivider: near-black bg, large ghost
// act number, cinematic pacing. These are *transitions*, not content slides.
//
// Duration target: 8s (240 frames at 30fps)
//
// ─────────────────────────────────────────────────────────────────────────────

const CARD_BG = COLORS.dark; // Near-black — clearly distinct from graphite

type ActCardProps = {
  actLabel: string; // "OPEN" | "ACT 1" | "ACT 2" | ... | "CLOSE"
  ghostSymbol: string; // Ghost background text: "01", "02", or "◆" for OPEN/CLOSE
  title: string; // "THE WAKE-UP CALL"
  description: string; // Teaser sentence
  speakers: string; // "Eric Dome" | "Kelly Abbott → Catfish Comstock"
  accentColor?: string; // Defaults to COLORS.orange
};

// ─── Base component ───────────────────────────────────────────────────────────

const ActCard: React.FC<ActCardProps> = ({
  actLabel,
  ghostSymbol,
  title,
  description,
  speakers,
  accentColor = COLORS.orange,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Animation timing ───────────────────────────────────────────────────────

  // Ghost number: scale-punch entrance (Option B)
  // Starts at 1.15 scale and fades in over first ~0.8s
  const ghostP = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 20 },
    delay: 0,
  });
  const ghostOpacity = interpolate(ghostP, [0, 1], [0, 0.055]);
  const ghostScale = interpolate(ghostP, [0, 1], [1.18, 1.0]);

  // Act label + overline: arrives first
  const labelP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.25 * fps,
  });
  const labelX = interpolate(labelP, [0, 1], [-24, 0]);

  // Accent line grows from 0 to full width
  const lineP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.55 * fps,
  });
  const lineW = interpolate(lineP, [0, 1], [0, 56]);

  // Title: large and bold
  const titleP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.8 * fps,
  });

  // Description: settles after title
  const descP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 1.2 * fps,
  });

  // Speaker credit: last thing to arrive
  const speakerP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 1.6 * fps,
  });

  // ── Bottom separator line ─────────────────────────────────────────────────
  const sepP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 1.8 * fps,
  });
  const sepW = interpolate(sepP, [0, 1], [0, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: CARD_BG }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.2}>
        <AbsoluteFill>
          {/* ── Ghost act symbol (huge background number/character) ── */}
          <div
            style={{
              position: "absolute",
              right: -40,
              top: "50%",
              transform: `translateY(-50%) scale(${ghostScale})`,
              transformOrigin: "right center",
              opacity: ghostOpacity,
              fontFamily: fontFamily,
              fontSize: 680,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: -30,
              lineHeight: 1,
              userSelect: "none",
              pointerEvents: "none",
            }}
          >
            {ghostSymbol}
          </div>

          {/* ── Left content column ── */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 120,
              right: 120,
              transform: "translateY(-50%)",
            }}
          >
            {/* Act label */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
                opacity: labelP,
                transform: `translateX(${labelX}px)`,
              }}
            >
              <div
                style={{
                  width: 3,
                  height: 18,
                  background: accentColor,
                  borderRadius: 2,
                }}
              />
              <span
                style={{
                  fontFamily: fontFamily,
                  fontSize: TYPOGRAPHY.label,
                  fontWeight: 700,
                  color: accentColor,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                }}
              >
                {actLabel}
              </span>
            </div>

            {/* Orange/cyan gradient accent line */}
            <div
              style={{
                width: lineW,
                height: 3,
                background: `linear-gradient(to right, ${accentColor}, ${COLORS.cyan})`,
                borderRadius: 2,
                marginBottom: 28,
              }}
            />

            {/* Main title */}
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: TYPOGRAPHY.display,
                fontWeight: 800,
                color: COLORS.white,
                letterSpacing: -4,
                lineHeight: 0.95,
                marginBottom: 30,
                maxWidth: 1100,
                opacity: titleP,
              }}
            >
              {title}
            </div>

            {/* Description */}
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: TYPOGRAPHY.body,
                fontWeight: 300,
                color: "rgba(255,255,255,0.60)",
                letterSpacing: 0.2,
                lineHeight: 1.5,
                maxWidth: 820,
                opacity: descP,
              }}
            >
              {description}
            </div>
          </div>

          {/* ── Bottom rule + speaker credit ── */}
          <div
            style={{
              position: "absolute",
              bottom: 52,
              left: 120,
              right: 120,
            }}
          >
            {/* Full-width separator */}
            <div
              style={{
                height: 1,
                background: `rgba(255,255,255,${sepW * 0.1})`,
                marginBottom: 20,
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                opacity: speakerP,
              }}
            >
              <div>
                <div
                  style={{
                    fontFamily: fontFamily,
                    fontSize: TYPOGRAPHY.label,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.35)",
                    letterSpacing: 2.5,
                    textTransform: "uppercase",
                    marginBottom: 5,
                  }}
                >
                  Featuring
                </div>
                <div
                  style={{
                    fontFamily: fontFamily,
                    fontSize: TYPOGRAPHY.small,
                    fontWeight: 400,
                    color: "rgba(255,255,255,0.55)",
                    letterSpacing: 0.3,
                  }}
                >
                  {speakers}
                </div>
              </div>
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── Named act exports ────────────────────────────────────────────────────────

export const ActOpen: React.FC = () => (
  <ActCard
    actLabel="Open — The Stage Is Set"
    ghostSymbol="◆"
    title="Welcome"
    description="Purpose, expectations, and why the time to act on LLM content is now — not next quarter."
    speakers="Sarah Rockwood"
    accentColor={COLORS.cyan}
  />
);

export const Act1: React.FC = () => (
  <ActCard
    actLabel="Act 1"
    ghostSymbol="01"
    title="The Room You're Not In"
    description="LLMs are the new room. You're not in it. The bouncer only lets in brands with genuine authority."
    speakers="Eric Dome"
  />
);

export const Act2: React.FC = () => (
  <ActCard
    actLabel="Act 2"
    ghostSymbol="02"
    title="Industry Trends"
    description="How LLMs are changing the game for window and door manufacturers."
    speakers="Thad Kahlow"
  />
);

export const Act3: React.FC = () => (
  <ActCard
    actLabel="Act 3"
    ghostSymbol="03"
    title="The Landscape Shift"
    description="Two systems. Training data and agentic search. Meanwhile: CTR dropped 59%. 60% of searches produce zero clicks."
    speakers="Kelly Abbott → Catfish Comstock"
    accentColor={COLORS.cyan}
  />
);

export const Act4: React.FC = () => (
  <ActCard
    actLabel="Act 4"
    ghostSymbol="04"
    title="How to Win"
    description="Understanding how LLMs react to queries."
    speakers="Kelly Abbott → Eric Dome → Catfish Comstock"
  />
);

export const Act5: React.FC = () => (
  <ActCard
    actLabel="Act 5"
    ghostSymbol="05"
    title="Measure. Move. Win."
    description={
      "Attribution is hard — but brand mentions and citations are measurable. The urgency is real. This is a\u00A0tsunami."
    }
    speakers="Kelly Abbott → Catfish Comstock → John Battistini"
    accentColor={COLORS.cyan}
  />
);

export const ActClose: React.FC = () => (
  <ActCard
    actLabel="Close"
    ghostSymbol="◆"
    title="Let's Win Big."
    description={"The room is waiting. Make sure it says MITER."}
    speakers="Sarah Rockwood"
    accentColor={COLORS.cyan}
  />
);
