import React from "react";
import { TransitionSeries } from "@remotion/transitions";
import { LightLeak } from "@remotion/light-leaks";
import { HookScene } from "./scenes/HookScene";
import { ValueScene } from "./scenes/ValueScene";
import { DemoScene } from "./scenes/DemoScene";
import { CTAScene } from "./scenes/CTAScene";

// 30 seconds @ 30fps = 900 frames
// Light leak overlays do NOT shorten the timeline
//
// Act 1 - Hook:   120 frames  (4s)
// Act 2 - Value:  150 frames  (5s)
// Act 3 - Demo:   480 frames  (16s)
// Act 4 - CTA:    150 frames  (5s)
// Total:          900 frames  (30s)

const LEAK_DURATION = 24;

export const Video: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={120}>
        <HookScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Overlay durationInFrames={LEAK_DURATION}>
        <LightLeak seed={3} hueShift={30} />
      </TransitionSeries.Overlay>

      <TransitionSeries.Sequence durationInFrames={150}>
        <ValueScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Overlay durationInFrames={LEAK_DURATION}>
        <LightLeak seed={7} hueShift={20} />
      </TransitionSeries.Overlay>

      <TransitionSeries.Sequence durationInFrames={480}>
        <DemoScene />
      </TransitionSeries.Sequence>

      <TransitionSeries.Overlay durationInFrames={LEAK_DURATION}>
        <LightLeak seed={11} hueShift={25} />
      </TransitionSeries.Overlay>

      <TransitionSeries.Sequence durationInFrames={150}>
        <CTAScene />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
