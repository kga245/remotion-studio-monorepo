import React, { useEffect, useState } from "react";
import {
  AbsoluteFill,
  cancelRender,
  continueRender,
  delayRender,
} from "remotion";
import { Lottie, type LottieAnimationData } from "@remotion/lottie";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "./VignetteFrame";
import { colors, typography } from "../styles/theme";
import { recolorLottieToBrand } from "../lib/recolorLottie";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

const BOL_PALETTE = [
  colors.graphite,
  colors.orange,
  colors.cyan,
  colors.lightGray,
];

// Reusable scene that loads any Lottie file, recolors it to the BOL palette
// at runtime via luminance-band mapping, and displays it inside a vignette
// frame. Each Lottie scene in scenes/ is a thin wrapper around this card.
export const LottieRecoloredCard: React.FC<{
  src: string;
  title: string;
  caption: string;
  beat: string;
}> = ({ src, title, caption, beat }) => {
  const [handle] = useState(() => delayRender(`Loading Lottie: ${title}`));
  const [animation, setAnimation] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(src)
      .then((res) => res.json() as Promise<LottieAnimationData>)
      .then((data) => {
        setAnimation(
          recolorLottieToBrand(data, BOL_PALETTE) as LottieAnimationData,
        );
        continueRender(handle);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [handle, src]);

  return (
    <VignetteFrame
      beat={beat}
      capability={title}
      api="recolorLottieToBrand · @remotion/lottie"
    >
      <AbsoluteFill
        style={{
          fontFamily,
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
        }}
      >
        <div
          style={{
            width: 720,
            height: 540,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px dashed ${colors.lightGray}`,
            borderRadius: 24,
            padding: 24,
          }}
        >
          {animation && (
            <Lottie
              animationData={animation}
              loop
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </div>

        <div
          style={{
            marginTop: 24,
            textAlign: "center",
          }}
        >
          <div
            style={{
              ...typography.h2,
              fontSize: 18,
              color: colors.gray,
            }}
          >
            {caption}
          </div>
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
