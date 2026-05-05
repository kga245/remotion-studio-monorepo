// Scene registry — each entry becomes its own composition in Root.tsx so Kelly
// can preview them individually in the studio. The `Showcase` master composition
// composes a curated subset into a single timeline with transitions.
//
// To add a scene:
//   1. Create scenes/<Name>.tsx with a component that uses VignetteFrame.
//   2. Add a row here.
//   3. Optionally add a <TransitionSeries.Sequence> reference in Showcase.tsx
//      if it should be part of the master cut.

import type { ComponentType } from "react";
import { Title } from "./Title";
import { FrameRuler } from "./FrameRuler";
import { EasingZoo } from "./EasingZoo";
import { SpringTuning } from "./SpringTuning";
import { SpringVsInterpolate } from "./SpringVsInterpolate";
import { ColorInterpolation } from "./ColorInterpolation";
import { SequenceLadder } from "./SequenceLadder";
import { SeriesSequence } from "./SeriesSequence";
import { LoopFreeze } from "./LoopFreeze";
import { Typewriter } from "./Typewriter";
import { HighlightPen } from "./HighlightPen";
import { LightLeaks } from "./LightLeaks";
import { BarChart } from "./BarChart";
import { TransitionGallery } from "./TransitionGallery";
import { PieChart } from "./PieChart";
import { LineChartMarker } from "./LineChartMarker";
import { SequencedText } from "./SequencedText";
import { PathsAndShapes } from "./PathsAndShapes";
import { AudioCaptions } from "./AudioCaptions";
import { LottieScene } from "./LottieScene";
import { ThreeScene } from "./ThreeScene";
import { Outro } from "./Outro";

export type SceneEntry = {
  id: string;
  component: ComponentType;
  durationInFrames: number;
};

export const scenes: SceneEntry[] = [
  { id: "Title", component: Title, durationInFrames: 120 },
  { id: "FrameRuler", component: FrameRuler, durationInFrames: 180 },
  { id: "EasingZoo", component: EasingZoo, durationInFrames: 180 },
  { id: "SpringTuning", component: SpringTuning, durationInFrames: 180 },
  {
    id: "SpringVsInterpolate",
    component: SpringVsInterpolate,
    durationInFrames: 180,
  },
  {
    id: "ColorInterpolation",
    component: ColorInterpolation,
    durationInFrames: 180,
  },
  { id: "SequenceLadder", component: SequenceLadder, durationInFrames: 180 },
  { id: "SeriesSequence", component: SeriesSequence, durationInFrames: 180 },
  { id: "LoopFreeze", component: LoopFreeze, durationInFrames: 180 },
  { id: "Typewriter", component: Typewriter, durationInFrames: 240 },
  { id: "HighlightPen", component: HighlightPen, durationInFrames: 180 },
  { id: "LightLeaks", component: LightLeaks, durationInFrames: 180 },
  { id: "BarChart", component: BarChart, durationInFrames: 180 },
  {
    id: "TransitionGallery",
    component: TransitionGallery,
    durationInFrames: 234,
  },
  { id: "PieChart", component: PieChart, durationInFrames: 180 },
  { id: "LineChartMarker", component: LineChartMarker, durationInFrames: 180 },
  { id: "SequencedText", component: SequencedText, durationInFrames: 180 },
  { id: "PathsAndShapes", component: PathsAndShapes, durationInFrames: 180 },
  { id: "AudioCaptions", component: AudioCaptions, durationInFrames: 240 },
  { id: "LottieScene", component: LottieScene, durationInFrames: 180 },
  { id: "ThreeScene", component: ThreeScene, durationInFrames: 180 },
  { id: "Outro", component: Outro, durationInFrames: 240 },
];
