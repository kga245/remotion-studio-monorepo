import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from "remotion";
import { fontFamily } from "../theme";
import { COLORS, SPRING_CONFIG, TIMING, TYPOGRAPHY } from "../design";
import { StaggeredWords } from "../components/StaggeredWords";
import { LogoLockup } from "../components/LogoLockup";
import { FadeWrapper } from "../components/FadeWrapper";

const SPEAKERS = [
  "Sarah Rockwood",
  "Eric Dome",
  "Kelly Abbott",
  "Thad Kahlow",
  "Catfish Comstock",
  "John Battistini",
];

const SpeakerNames: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "8px 24px",
      }}
    >
      {SPEAKERS.map((name, i) => {
        const delay = i * TIMING.nameStagger * fps;
        const progress = spring({
          frame,
          fps,
          config: SPRING_CONFIG.smooth,
          delay,
        });

        return (
          <span
            key={name}
            style={{
              fontFamily: fontFamily,
              fontSize: TYPOGRAPHY.body,
              fontWeight: 400,
              color: `rgba(255, 255, 255, ${0.5 * progress})`,
              letterSpacing: 0.5,
            }}
          >
            {name}
          </span>
        );
      })}
    </div>
  );
};

const SessionBadge: React.FC = () => {
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
        fontSize: TYPOGRAPHY.body,
        fontWeight: 600,
        color: COLORS.orange,
        textTransform: "uppercase",
        letterSpacing: 5,
        opacity,
      }}
    >
      SESSION 1
    </div>
  );
};

const Subtitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, TIMING.fadeInDuration * fps], [0, 1], {
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  return (
    <div style={{ opacity, textAlign: "center" }}>
      <div
        style={{
          fontFamily: fontFamily,
          fontSize: TYPOGRAPHY.body,
          fontWeight: 300,
          color: COLORS.gray,
          textTransform: "uppercase",
          letterSpacing: 4,
        }}
      >
        GENERATIVE ENGINE OPTIMIZATION
      </div>
      <div
        style={{
          fontFamily: fontFamily,
          fontSize: TYPOGRAPHY.body,
          fontWeight: 300,
          color: COLORS.gray,
          textTransform: "uppercase",
          letterSpacing: 4,
          marginTop: 6,
        }}
      >
        FOR WINDOWS & DOORS
      </div>
    </div>
  );
};

// All elements are absolutely positioned at their final resting place.
// Each Sequence only controls WHEN it fades in — no layout shift.
// Duration: 35 seconds = 1050 frames @ 30fps
export const Welcome: React.FC = () => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.5}>
        <AbsoluteFill>
          {/* SESSION 1 badge */}
          <div
            style={{
              position: "absolute",
              top: 310,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Sequence from={0.5 * fps} layout="none" premountFor={0.5 * fps}>
              <SessionBadge />
            </Sequence>
          </div>

          {/* Title */}
          <div
            style={{
              position: "absolute",
              top: 360,
              left: 80,
              right: 80,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Sequence from={1.5 * fps} layout="none" premountFor={0.5 * fps}>
              <StaggeredWords
                words={[
                  { text: "MITER" },
                  { text: "LLM", color: COLORS.cyan },
                  { text: "WEBINAR" },
                ]}
                fontSize={TYPOGRAPHY.display}
              />
            </Sequence>
          </div>

          {/* Subtitle */}
          <div
            style={{
              position: "absolute",
              top: 500,
              left: 80,
              right: 80,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Sequence from={4 * fps} layout="none" premountFor={0.5 * fps}>
              <Subtitle />
            </Sequence>
          </div>

          {/* Speaker names */}
          <div
            style={{
              position: "absolute",
              top: 660,
              left: 80,
              right: 80,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Sequence from={5.5 * fps} layout="none" premountFor={0.5 * fps}>
              <SpeakerNames />
            </Sequence>
          </div>

          {/* Logo lockup pinned to bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <Sequence from={7.5 * fps} layout="none" premountFor={0.5 * fps}>
              <LogoLockup />
            </Sequence>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};
