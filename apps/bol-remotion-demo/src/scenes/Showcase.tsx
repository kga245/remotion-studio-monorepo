import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { loadFont } from "@remotion/google-fonts/Roboto";
import {
  colors,
  semantic,
  typography,
  sizes,
  springs,
  beats,
} from "../styles/theme";
import { SpringVsInterpolate } from "./SpringVsInterpolate";
import { SequencedText } from "./SequencedText";
import { PathsAndShapes } from "./PathsAndShapes";
import { AudioCaptions } from "./AudioCaptions";
import { LottieScene } from "./LottieScene";
import { ThreeScene } from "./ThreeScene";
import { Outro } from "./Outro";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// Per-vignette runtime in frames at 30fps. AudioCaptions runs longer to host
// the full VO line (~6s) plus a beat of held silence at the end.
const TITLE_LEN = 120;
const VIG_LEN = 180;
const AUDIO_LEN = 240;
const OUTRO_LEN = 240;

// Transition timings — short fades feel like cuts; longer ones feel cinematic.
const FADE = linearTiming({ durationInFrames: 15 });
const FADE_LONG = linearTiming({ durationInFrames: 30 });
const SLIDE = linearTiming({ durationInFrames: 24 });
const WIPE = linearTiming({ durationInFrames: 24 });

const TitleCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subtitleIn = spring({ frame, fps, config: springs.smooth });
  const titleIn = spring({
    frame: frame - beats.enterShort,
    fps,
    config: springs.snappy,
  });
  const underlineIn = spring({
    frame: frame - beats.enterMedium - 6,
    fps,
    config: springs.smooth,
  });

  return (
    <AbsoluteFill
      style={{
        background: semantic.bgDark,
        color: semantic.textOnDark,
        fontFamily,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", padding: 80 }}>
        <div
          style={{
            ...typography.h2,
            fontSize: sizes.h2,
            color: colors.cyan,
            opacity: subtitleIn,
            transform: `translateY(${(1 - subtitleIn) * 12}px)`,
            marginBottom: 24,
          }}
        >
          BOL Agency · Motion demo
        </div>
        <div
          style={{
            ...typography.h1,
            fontSize: sizes.display,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 24}px)`,
          }}
        >
          Remotion capabilities
        </div>
        <div
          style={{
            margin: "32px auto 0",
            height: 6,
            width: 480 * underlineIn,
            background: colors.orange,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};

export const Showcase: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={TITLE_LEN}>
        <TitleCard />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={FADE} />

      <TransitionSeries.Sequence durationInFrames={VIG_LEN}>
        <SpringVsInterpolate />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={slide({ direction: "from-right" })}
        timing={SLIDE}
      />

      <TransitionSeries.Sequence durationInFrames={VIG_LEN}>
        <SequencedText />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={FADE} />

      <TransitionSeries.Sequence durationInFrames={VIG_LEN}>
        <PathsAndShapes />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={FADE} />

      <TransitionSeries.Sequence durationInFrames={AUDIO_LEN}>
        <AudioCaptions />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition
        presentation={wipe({ direction: "from-left" })}
        timing={WIPE}
      />

      <TransitionSeries.Sequence durationInFrames={VIG_LEN}>
        <LottieScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={FADE} />

      <TransitionSeries.Sequence durationInFrames={VIG_LEN}>
        <ThreeScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Transition presentation={fade()} timing={FADE_LONG} />

      <TransitionSeries.Sequence durationInFrames={OUTRO_LEN}>
        <Outro />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
