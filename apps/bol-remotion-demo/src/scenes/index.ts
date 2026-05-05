// Scene registry — grouped into folders that match the section letters in
// PRESENTATION.md (A. Foundations, B. Animation primitives, etc.). Each entry
// becomes its own composition in Root.tsx. The studio sidebar renders the
// folders as collapsible groups.
//
// To add a scene:
//   1. Create scenes/<Name>.tsx with a component that uses VignetteFrame.
//   2. Add it to the right folder below.
//
// To archive a scene without deleting code:
//   - Move its entry into the trailing `archive` folder. It still renders in
//     the studio (so it's recoverable), just under "Archive" rather than its
//     capability folder.

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
import { SequencedText } from "./SequencedText";
import { Typewriter } from "./Typewriter";
import { HighlightPen } from "./HighlightPen";
import { PathsAndShapes } from "./PathsAndShapes";
import { LightLeaks } from "./LightLeaks";
import { BarChart } from "./BarChart";
import { PieChart } from "./PieChart";
import { LineChartMarker } from "./LineChartMarker";
import { AudioCaptions } from "./AudioCaptions";
import { ThreeScene } from "./ThreeScene";
import { TransitionGallery } from "./TransitionGallery";
import { LottieScene } from "./LottieScene";
import { Outro } from "./Outro";

export type SceneEntry = {
  id: string;
  component: ComponentType;
  durationInFrames: number;
};

export type SceneFolder = {
  folder: string;
  scenes: SceneEntry[];
};

// Order matches PRESENTATION.md sections A → L. ParametricCard (section J) is
// registered separately in Root.tsx because it carries a Zod schema; that one
// folder is created alongside the rest there.
export const sceneFolders: SceneFolder[] = [
  {
    folder: "A-Foundations",
    scenes: [
      { id: "Title", component: Title, durationInFrames: 120 },
      { id: "FrameRuler", component: FrameRuler, durationInFrames: 180 },
    ],
  },
  {
    folder: "B-Animation-primitives",
    scenes: [
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
    ],
  },
  {
    folder: "C-Sequencing",
    scenes: [
      {
        id: "SequenceLadder",
        component: SequenceLadder,
        durationInFrames: 180,
      },
      {
        id: "SeriesSequence",
        component: SeriesSequence,
        durationInFrames: 180,
      },
      { id: "LoopFreeze", component: LoopFreeze, durationInFrames: 180 },
    ],
  },
  {
    folder: "D-Typography",
    scenes: [
      { id: "SequencedText", component: SequencedText, durationInFrames: 180 },
      { id: "Typewriter", component: Typewriter, durationInFrames: 240 },
      { id: "HighlightPen", component: HighlightPen, durationInFrames: 180 },
    ],
  },
  {
    folder: "E-Visual-effects",
    scenes: [
      {
        id: "PathsAndShapes",
        component: PathsAndShapes,
        durationInFrames: 180,
      },
      { id: "LightLeaks", component: LightLeaks, durationInFrames: 180 },
    ],
  },
  {
    folder: "F-Charts",
    scenes: [
      { id: "BarChart", component: BarChart, durationInFrames: 180 },
      { id: "PieChart", component: PieChart, durationInFrames: 180 },
      {
        id: "LineChartMarker",
        component: LineChartMarker,
        durationInFrames: 180,
      },
    ],
  },
  {
    folder: "G-Media",
    scenes: [
      { id: "AudioCaptions", component: AudioCaptions, durationInFrames: 240 },
    ],
  },
  {
    folder: "H-3D",
    scenes: [
      { id: "ThreeScene", component: ThreeScene, durationInFrames: 180 },
    ],
  },
  {
    folder: "I-Transitions",
    scenes: [
      {
        id: "TransitionGallery",
        component: TransitionGallery,
        durationInFrames: 234,
      },
    ],
  },
  // J · Parametric is rendered directly in Root.tsx (carries a Zod schema).
  {
    folder: "K-External",
    scenes: [
      { id: "LottieScene", component: LottieScene, durationInFrames: 180 },
    ],
  },
  {
    folder: "L-Closing",
    scenes: [{ id: "Outro", component: Outro, durationInFrames: 240 }],
  },
  // Archive — empty for now. Move any scene's entry here to retire it from the
  // capability folders without deleting the file.
  {
    folder: "Archive",
    scenes: [],
  },
];
