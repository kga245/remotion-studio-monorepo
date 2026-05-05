import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { LightLeak } from "@remotion/light-leaks";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors, semantic, typography, sizes } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// LightLeak comes from @remotion/light-leaks. It can be used standalone (as
// here) or, more commonly, inside <TransitionSeries.Overlay> to play over the
// cut between two scenes. seed/hueShift control look.
//
// hueShift 0 = yellow-orange (default), 30 = closer to BOL orange.
export const LightLeaks: React.FC = () => {
  return (
    <VignetteFrame
      beat="E · 02"
      capability="WebGL light leaks"
      api="<LightLeak seed hueShift>"
      tone="dark"
    >
      <AbsoluteFill
        style={{
          fontFamily,
          alignItems: "center",
          justifyContent: "center",
          color: semantic.textOnDark,
        }}
      >
        {/* Background card */}
        <div style={{ textAlign: "center", padding: 80 }}>
          <div
            style={{
              ...typography.h2,
              fontSize: sizes.h2,
              color: colors.cyan,
              marginBottom: 24,
            }}
          >
            Real WebGL · zero filters
          </div>
          <div
            style={{
              ...typography.h1,
              fontSize: sizes.h1,
              maxWidth: 1400,
            }}
          >
            Brand-tinted light leaks, parametric
          </div>
        </div>

        {/* Light leak only sweeps through the middle 90 frames so the title
            is readable before and after. */}
        <Sequence from={45} durationInFrames={90} layout="none">
          <LightLeak seed={3} hueShift={20} />
        </Sequence>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
