import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { TIMING } from "../design";

type FadeWrapperProps = {
  children: React.ReactNode;
  fadeInStart?: number; // seconds
  fadeOutBeforeEnd?: number; // seconds before composition end
};

export const FadeWrapper: React.FC<FadeWrapperProps> = ({
  children,
  fadeInStart = 0,
  fadeOutBeforeEnd = TIMING.fadeOutDuration,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const fadeInStartFrame = fadeInStart * fps;
  const fadeInEndFrame = fadeInStartFrame + TIMING.fadeInDuration * fps;
  const fadeOutStartFrame = durationInFrames - fadeOutBeforeEnd * fps;

  const fadeIn = interpolate(
    frame,
    [fadeInStartFrame, fadeInEndFrame],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    },
  );

  const fadeOut = interpolate(
    frame,
    [fadeOutStartFrame, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.in(Easing.quad),
    },
  );

  return (
    <div style={{ opacity: fadeIn * fadeOut, width: "100%", height: "100%" }}>
      {children}
    </div>
  );
};
