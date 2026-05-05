import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { fontFamily } from "../theme";
import { COLORS, SPRING_CONFIG, TYPOGRAPHY } from "../design";

// ─── Types ───────────────────────────────────────────────────────────────────

type LowerThirdProps = {
  name: string;
  title: string;
  company?: string;
};

// ─── Base component ───────────────────────────────────────────────────────────

const LowerThird: React.FC<LowerThirdProps> = ({ name, title, company }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const slideProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.2 * fps,
  });

  const _titleProgress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.55 * fps,
  });

  const translateX = interpolate(slideProgress, [0, 1], [-32, 0]);

  const fadeOut = interpolate(
    frame,
    [durationInFrames - 1.5 * fps, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      {/*
        Single bottom-anchored container.
        The bar IS the container — no separate positioning layers.
        Height is explicit and generously sized; padding keeps text away from edges.
        All opacity applied once at this level so nothing can partially disappear.
      */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          paddingTop: 32,
          paddingBottom: 32,
          paddingLeft: 80,
          background: COLORS.dark,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          opacity: slideProgress * fadeOut,
          overflow: "visible",
        }}
      >
        {/* Orange left accent bar — stretches to match text height */}
        <div
          style={{
            width: 5,
            alignSelf: "stretch",
            background: COLORS.orange,
            marginRight: 24,
            borderRadius: 2,
            flexShrink: 0,
            opacity: slideProgress,
          }}
        />

        {/* Name + title stack */}
        <div style={{ transform: `translateX(${translateX}px)` }}>
          <div
            style={{
              fontFamily: fontFamily,
              fontSize: TYPOGRAPHY.title,
              fontWeight: 700,
              color: COLORS.white,
              letterSpacing: -0.5,
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              marginBottom: 8,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontFamily: fontFamily,
              fontSize: TYPOGRAPHY.body,
              fontWeight: 300,
              color: COLORS.gray,
              letterSpacing: 0.4,
              whiteSpace: "nowrap",
            }}
          >
            {company ? `${title} — ${company}` : title}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ─── Named speaker exports ─────────────────────────────────────────────────

export const KellyAbbottLowerThird: React.FC = () => (
  <LowerThird
    name="Kelly Abbott"
    title="Chief AI Officer"
    company="BOL Agency"
  />
);

export const ThadKahlowLowerThird: React.FC = () => (
  <LowerThird name="Thad Kahlow" title="CEO" company="BOL Agency" />
);

export const JohnBattistiniLowerThird: React.FC = () => (
  <LowerThird
    name="John Battistini"
    title="Chief Creative Officer"
    company="BOL Agency"
  />
);

export const EricDomeLowerThird: React.FC = () => (
  <LowerThird name="Eric Dome" title="Creative Director" company="BOL Agency" />
);

export const CatfishComstockLowerThird: React.FC = () => (
  <LowerThird
    name="Catfish Comstock"
    title="Sr. Director of SEO + AI Strategy"
    company="BOL Agency"
  />
);

export const SarahRockwoodLowerThird: React.FC = () => (
  <LowerThird
    name="Sarah Rockwood"
    title="Associate Account Director"
    company="BOL Agency"
  />
);

export const MiterSpeakerLowerThird: React.FC = () => (
  <LowerThird name="[Speaker Name]" title="Co-Founder & CEO" company="MITER" />
);

export const GuestSpeakerLowerThird: React.FC = () => (
  <LowerThird name="[Guest Name]" title="VP of Marketing" company="[Company]" />
);
