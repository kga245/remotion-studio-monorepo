import { AbsoluteFill, Sequence, useVideoConfig } from "remotion";
import { fontFamily } from "../theme";
import { COLORS, TYPOGRAPHY } from "../design";
import { StaggeredWords } from "../components/StaggeredWords";
import { GradientLine } from "../components/GradientLine";
import { FadeWrapper } from "../components/FadeWrapper";
import { useCurrentFrame, interpolate, Easing } from "remotion";
import { fontFamily } from "../theme";
import { TIMING } from "../design";

const SubLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, TIMING.fadeInDuration * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div
      style={{
        fontFamily: fontFamily,
        fontSize: TYPOGRAPHY.subhead,
        fontWeight: 300,
        color: COLORS.orange,
        textTransform: "uppercase",
        letterSpacing: 4,
        opacity,
        textAlign: "center",
      }}
    >
      Here's where MITER stands today
    </div>
  );
};

// All elements absolutely positioned — no layout shift.
// Duration: 12 seconds = 360 frames @ 30fps
export const Bridge: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={2.0}>
        <AbsoluteFill>
          {/* Main text */}
          <div
            style={{
              position: "absolute",
              top: 420,
              left: 120,
              right: 120,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Sequence from={0.5 * fps} layout="none" premountFor={0.5 * fps}>
              <StaggeredWords
                words={[
                  { text: "GEO" },
                  { text: "is already", fontWeight: 300, color: COLORS.gray },
                  { text: "reshaping", color: COLORS.cyan },
                  {
                    text: "search results",
                    fontWeight: 300,
                    color: COLORS.gray,
                  },
                ]}
                fontSize={TYPOGRAPHY.title}
              />
            </Sequence>
          </div>

          {/* Gradient line */}
          <div
            style={{
              position: "absolute",
              top: 510,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Sequence from={3 * fps} layout="none" premountFor={0.5 * fps}>
              <GradientLine />
            </Sequence>
          </div>

          {/* Sub-line */}
          <div
            style={{
              position: "absolute",
              top: 540,
              left: 120,
              right: 120,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Sequence from={4 * fps} layout="none" premountFor={0.5 * fps}>
              <SubLine />
            </Sequence>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};
