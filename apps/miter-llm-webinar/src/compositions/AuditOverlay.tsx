import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from "remotion";
import { fontFamily } from "../theme";
import { COLORS, SPRING_CONFIG, TYPOGRAPHY } from "../design";
import { FadeWrapper } from "../components/FadeWrapper";

// ─── Types ───────────────────────────────────────────────────────────────────

type MetricRow = {
  label: string;
  value: number; // 0–100, percentage
  highlight?: boolean; // orange accent
};

type AuditOverlayProps = {
  brand: string;
  tagline: string;
  metrics: MetricRow[];
  verdict: string;
  verdictColor?: string;
};

// ─── Animated bar row ────────────────────────────────────────────────────────

const BarRow: React.FC<{ row: MetricRow; delay: number }> = ({
  row,
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

  const barWidth = interpolate(progress, [0, 1], [0, row.value]);
  const labelOpacity = interpolate(
    frame,
    [delay / fps, delay / fps + 0.3],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const displayValue = Math.round(
    interpolate(progress, [0, 1], [0, row.value]),
  );

  return (
    <div style={{ marginBottom: 24 }}>
      {/* Label + value */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 8,
          opacity: labelOpacity,
        }}
      >
        <span
          style={{
            fontFamily: fontFamily,
            fontSize: TYPOGRAPHY.body,
            fontWeight: 400,
            color: row.highlight ? COLORS.orange : COLORS.white,
            letterSpacing: 0.5,
          }}
        >
          {row.label}
        </span>
        <span
          style={{
            fontFamily: fontFamily,
            fontSize: TYPOGRAPHY.subhead,
            fontWeight: 700,
            color: row.highlight ? COLORS.orange : COLORS.cyan,
            letterSpacing: -0.5,
          }}
        >
          {displayValue}%
        </span>
      </div>
      {/* Bar track */}
      <div
        style={{
          width: "100%",
          height: 6,
          background: "rgba(255,255,255,0.08)",
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: "100%",
            background: row.highlight
              ? COLORS.orange
              : `linear-gradient(to right, ${COLORS.orange}, ${COLORS.cyan})`,
            borderRadius: 3,
          }}
        />
      </div>
    </div>
  );
};

// ─── Verdict badge ────────────────────────────────────────────────────────────

const Verdict: React.FC<{ text: string; color: string }> = ({
  text,
  color,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        opacity,
        marginTop: 8,
      }}
    >
      <div
        style={{ width: 4, height: 24, background: color, borderRadius: 2 }}
      />
      <span
        style={{
          fontFamily: fontFamily,
          fontSize: TYPOGRAPHY.body,
          fontWeight: 300,
          color: COLORS.gray,
          letterSpacing: 0.5,
          fontStyle: "normal",
        }}
      >
        {text}
      </span>
    </div>
  );
};

// ─── Main composition ─────────────────────────────────────────────────────────

export const AuditOverlay: React.FC<AuditOverlayProps> = ({
  brand,
  tagline,
  metrics,
  verdict,
  verdictColor = COLORS.cyan,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.5}>
        <AbsoluteFill>
          {/* Card panel — centered */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 900, // slightly wider to accommodate larger text
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "52px 60px",
            }}
          >
            {/* Brand header */}
            <Sequence from={0} layout="none" premountFor={fps}>
              <div style={{ marginBottom: 36 }}>
                <div
                  style={{
                    fontFamily: fontFamily,
                    fontSize: TYPOGRAPHY.label,
                    fontWeight: 600,
                    color: COLORS.orange,
                    textTransform: "uppercase",
                    letterSpacing: 4,
                    marginBottom: 8,
                  }}
                >
                  GEO PERFORMANCE AUDIT
                </div>
                <div
                  style={{
                    fontFamily: fontFamily,
                    fontSize: TYPOGRAPHY.title,
                    fontWeight: 700,
                    color: COLORS.white,
                    letterSpacing: -1,
                    lineHeight: 1,
                    marginBottom: 10,
                  }}
                >
                  {brand}
                </div>
                <div
                  style={{
                    fontFamily: fontFamily,
                    fontSize: TYPOGRAPHY.small,
                    fontWeight: 300,
                    color: COLORS.gray,
                    letterSpacing: 0.5,
                  }}
                >
                  {tagline}
                </div>
                <div
                  style={{
                    width: 40,
                    height: 2,
                    background: COLORS.orange,
                    borderRadius: 1,
                    marginTop: 20,
                  }}
                />
              </div>
            </Sequence>

            {/* Metric bars — staggered */}
            {metrics.map((row, i) => (
              <Sequence
                key={row.label}
                from={(0.3 + i * 0.2) * fps}
                layout="none"
                premountFor={fps}
              >
                <BarRow row={row} delay={(0.3 + i * 0.2) * fps} />
              </Sequence>
            ))}

            {/* Verdict */}
            <div
              style={{
                marginTop: 28,
                borderTop: "1px solid rgba(255,255,255,0.06)",
                paddingTop: 24,
              }}
            >
              <Sequence
                from={(0.3 + metrics.length * 0.2 + 0.3) * fps}
                layout="none"
                premountFor={fps}
              >
                <Verdict text={verdict} color={verdictColor} />
              </Sequence>
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── Brand-specific compositions ──────────────────────────────────────────────

export const MilgardAudit: React.FC = () => (
  <AuditOverlay
    brand="Milgard"
    tagline="Windows & Doors — GEO visibility snapshot"
    metrics={[
      { label: "Brand evaluation prompts", value: 74 },
      { label: "Product comparison prompts", value: 48 },
      { label: "Regional awareness prompts", value: 61 },
      { label: "Citation rate (LLM responses)", value: 52 },
    ]}
    verdict="Strong brand recognition — citation rate has room to grow"
    verdictColor={COLORS.cyan}
  />
);

export const PGTAudit: React.FC = () => (
  <AuditOverlay
    brand="PGT"
    tagline="Windows & Doors — GEO visibility snapshot"
    metrics={[
      { label: "Brand evaluation prompts", value: 31 },
      { label: "Product comparison prompts", value: 22, highlight: true },
      { label: "Regional awareness prompts", value: 28 },
      { label: "Citation rate (LLM responses)", value: 18, highlight: true },
    ]}
    verdict="Significant gap vs. Anderson Windows — largest opportunity"
    verdictColor={COLORS.orange}
  />
);

export const MIWindowsAudit: React.FC = () => (
  <AuditOverlay
    brand="MI Windows"
    tagline="& Doors — GEO visibility snapshot"
    metrics={[
      { label: "Brand evaluation prompts", value: 55 },
      { label: "Product comparison prompts", value: 38 },
      { label: "Regional awareness prompts", value: 44 },
      { label: "Citation rate (LLM responses)", value: 33 },
    ]}
    verdict="Mid-tier visibility — strong foundation to build on"
    verdictColor={COLORS.cyan}
  />
);

export const AndersonWindowsAudit: React.FC = () => (
  <AuditOverlay
    brand="Andersen Windows"
    tagline="& Doors — GEO visibility snapshot"
    metrics={[
      { label: "Brand evaluation prompts", value: 91 },
      { label: "Product comparison prompts", value: 82 },
      { label: "Regional awareness prompts", value: 88 },
      { label: "Citation rate (LLM responses)", value: 76 },
    ]}
    verdict="Category benchmark — dominant GEO presence across all prompt types"
    verdictColor={COLORS.cyan}
  />
);
