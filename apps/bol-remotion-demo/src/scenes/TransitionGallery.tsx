import React from "react";
import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { wipe } from "@remotion/transitions/wipe";
import { flip } from "@remotion/transitions/flip";
import { clockWipe } from "@remotion/transitions/clock-wipe";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors, semantic, typography } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// Cycles through five transition presentations from @remotion/transitions.
// Each card has a label naming the transition that preceded it.
const Card: React.FC<{
  label: string;
  caption: string;
  bg: string;
  fg: string;
}> = ({ label, caption, bg, fg }) => (
  <AbsoluteFill
    style={{
      background: bg,
      color: fg,
      fontFamily,
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          ...typography.h2,
          fontSize: 28,
          opacity: 0.7,
          marginBottom: 16,
        }}
      >
        Transition
      </div>
      <div
        style={{
          ...typography.h1,
          fontSize: 168,
          letterSpacing: "-0.04em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 24,
          marginTop: 32,
          opacity: 0.7,
          fontFamily: "monospace",
        }}
      >
        {caption}
      </div>
    </div>
  </AbsoluteFill>
);

const T = linearTiming({ durationInFrames: 18 });
const CARD_LEN = 54;

export const TransitionGallery: React.FC = () => {
  return (
    <VignetteFrame
      beat="I · 01"
      capability="Transition gallery"
      api="@remotion/transitions"
    >
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={CARD_LEN}>
          <Card
            label="fade()"
            caption='import { fade } from "@remotion/transitions/fade"'
            bg={semantic.bgDark}
            fg={colors.cyan}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition presentation={fade()} timing={T} />

        <TransitionSeries.Sequence durationInFrames={CARD_LEN}>
          <Card
            label="slide()"
            caption='slide({ direction: "from-right" })'
            bg={colors.orange}
            fg="white"
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={slide({ direction: "from-right" })}
          timing={T}
        />

        <TransitionSeries.Sequence durationInFrames={CARD_LEN}>
          <Card
            label="wipe()"
            caption='wipe({ direction: "from-left" })'
            bg={colors.cyan}
            fg={colors.graphite}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-left" })}
          timing={T}
        />

        <TransitionSeries.Sequence durationInFrames={CARD_LEN}>
          <Card
            label="flip()"
            caption='flip({ direction: "from-left" })'
            bg={semantic.bgDark}
            fg={colors.orange}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={flip({ direction: "from-left" })}
          timing={T}
        />

        <TransitionSeries.Sequence durationInFrames={CARD_LEN}>
          <Card
            label="clockWipe()"
            caption="clockWipe()"
            bg={colors.orange}
            fg={semantic.textOnDark}
          />
        </TransitionSeries.Sequence>

        <TransitionSeries.Transition
          presentation={clockWipe({ width: 1920, height: 1080 })}
          timing={T}
        />

        <TransitionSeries.Sequence durationInFrames={CARD_LEN}>
          <Card
            label="five styles"
            caption="all driven by frame, deterministic"
            bg={colors.graphite}
            fg="white"
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </VignetteFrame>
  );
};
