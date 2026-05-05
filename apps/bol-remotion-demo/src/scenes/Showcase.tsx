import React from "react";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { Title } from "./Title";
import { SpringVsInterpolate } from "./SpringVsInterpolate";
import { SequencedText } from "./SequencedText";
import { PathsAndShapes } from "./PathsAndShapes";
import { AudioCaptions } from "./AudioCaptions";
import { LottieScene } from "./LottieScene";
import { ThreeScene } from "./ThreeScene";
import { Outro } from "./Outro";

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

export const Showcase: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={TITLE_LEN}>
        <Title />
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
