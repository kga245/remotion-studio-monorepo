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
import { colors } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// Swap the file at public/lottie/animation.json with any brand Lottie to use it here.
// Remotion's delayRender holds rendering until the JSON is fetched, so this works
// the same in studio preview and in headless render.
const LOTTIE_SRC = staticFile("lottie/animation.json");

export const LottieScene: React.FC = () => {
  const [handle] = useState(() => delayRender("Loading Lottie animation"));
  const [animation, setAnimation] = useState<LottieAnimationData | null>(null);

  useEffect(() => {
    fetch(LOTTIE_SRC)
      .then((res) => res.json() as Promise<LottieAnimationData>)
      .then((data) => {
        setAnimation(data);
        continueRender(handle);
      })
      .catch((err) => {
        cancelRender(err);
      });
  }, [handle]);

  return (
    <VignetteFrame
      beat="06 / 07"
      capability="Lottie animations, dropped in"
      api="@remotion/lottie  ·  delayRender()"
    >
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          fontFamily,
        }}
      >
        {animation && (
          <div
            style={{
              width: 540,
              height: 540,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px dashed ${colors.lightGray}`,
              borderRadius: 24,
              padding: 24,
            }}
          >
            <Lottie
              animationData={animation}
              loop
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        )}

        <div
          style={{
            position: "absolute",
            bottom: 96,
            fontSize: 22,
            opacity: 0.65,
            letterSpacing: "0.04em",
          }}
        >
          Asset: <code>public/lottie/animation.json</code> — swap with any brand
          .json
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
