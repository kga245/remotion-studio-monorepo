import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
  staticFile,
} from "remotion";
import { Lottie, type LottieAnimationData } from "@remotion/lottie";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors, typography } from "../styles/theme";
import { recolorLottieToBrand } from "../lib/recolorLottie";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// Side-by-side: left shows the Lottie's original palette, right shows it
// recolored to the BOL palette via runtime JSON mutation. The recoloring is
// a luminance-band map: each source color is replaced by the BOL palette
// entry whose position matches the source color's relative luminance.
//
// Try this with any third-party Lottie — works without knowing the source
// palette in advance.
const LOTTIE_SRC = staticFile("lottie/animation.json");

const BOL_PALETTE = [
  colors.graphite, // Darkest source colors → graphite
  colors.orange, // Mid-low source colors → BOL orange
  colors.cyan, // Mid-high source colors → cyan
  colors.lightGray, // Lightest source colors → light gray
];

export const LottieRecolored: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading Lottie animation"));
  const [original, setOriginal] = useState<LottieAnimationData | null>(null);
  const [recolored, setRecolored] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(LOTTIE_SRC)
      .then((res) => res.json() as Promise<LottieAnimationData>)
      .then((data) => {
        setOriginal(data);
        setRecolored(
          recolorLottieToBrand(data, BOL_PALETTE) as LottieAnimationData,
        );
        continueRender(handle);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [handle]);

  return (
    <VignetteFrame
      beat="K · 02"
      capability="Lottie recoloring"
      api="recolorLottieToBrand(json, palette)"
    >
      <AbsoluteFill
        style={{
          fontFamily,
          padding: "24px 40px 40px",
          color: colors.graphite,
          flexDirection: "row",
          gap: 24,
        }}
      >
        {/* Original */}
        <Pane label="ORIGINAL" caption="As shipped from LottieFiles">
          {original && (
            <Lottie
              animationData={original}
              loop
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </Pane>

        {/* Recolored */}
        <Pane
          label="BOL PALETTE"
          caption="Same JSON, luminance-mapped to brand"
          accent={colors.orange}
        >
          {recolored && (
            <Lottie
              animationData={recolored}
              loop
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </Pane>
      </AbsoluteFill>
    </VignetteFrame>
  );
};

const Pane: React.FC<{
  label: string;
  caption: string;
  accent?: string;
  children: React.ReactNode;
}> = ({ label, caption, accent = colors.gray, children }) => (
  <div
    style={{
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: 16,
      padding: 24,
      borderRadius: 16,
      border: `2px dashed ${accent}55`,
    }}
  >
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          ...typography.h2,
          fontSize: 18,
          color: accent,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 14,
          opacity: 0.6,
          marginTop: 4,
        }}
      >
        {caption}
      </div>
    </div>
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(53,61,80,0.04)",
        borderRadius: 12,
        padding: 16,
      }}
    >
      {children}
    </div>
  </div>
);
