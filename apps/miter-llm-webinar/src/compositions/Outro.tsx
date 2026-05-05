import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from "remotion";
import { fontFamily } from "../theme";
import { COLORS, TIMING, TYPOGRAPHY } from "../design";
import { StaggeredWords } from "../components/StaggeredWords";
import { GradientLine } from "../components/GradientLine";
import { LogoLockup } from "../components/LogoLockup";
import { FadeWrapper } from "../components/FadeWrapper";

const ClosingLine: React.FC = () => {
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
        fontSize: TYPOGRAPHY.title,
        fontWeight: 300,
        color: COLORS.gray,
        textAlign: "center",
        whiteSpace: "nowrap",
        opacity,
      }}
    >
      Next session: let&apos;s win in GEO.
    </div>
  );
};

// All elements absolutely positioned — no layout shift.
// Duration: 25 seconds = 750 frames @ 30fps
export const Outro: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.5}>
        <AbsoluteFill>
          {/* Title */}
          <div
            style={{
              position: "absolute",
              top: 380,
              left: 120,
              right: 120,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Sequence from={0.5 * fps} layout="none" premountFor={0.5 * fps}>
              <StaggeredWords
                words={[
                  { text: "That's" },
                  { text: "the" },
                  { text: "landscape", color: COLORS.cyan },
                ]}
                fontSize={TYPOGRAPHY.display}
              />
            </Sequence>
          </div>

          {/* Gradient line */}
          <div
            style={{
              position: "absolute",
              top: 490,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Sequence from={1.5 * fps} layout="none" premountFor={0.5 * fps}>
              <GradientLine />
            </Sequence>
          </div>

          {/* Closing line — same time as gradient line */}
          <div
            style={{
              position: "absolute",
              top: 520,
              left: 120,
              right: 120,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Sequence from={1.5 * fps} layout="none" premountFor={0.5 * fps}>
              <ClosingLine />
            </Sequence>
          </div>

          {/* Logo lockup — 1.5s after subtitle (at 3s) */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Sequence from={3 * fps} layout="none" premountFor={0.5 * fps}>
              <LogoLockup />
            </Sequence>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};
