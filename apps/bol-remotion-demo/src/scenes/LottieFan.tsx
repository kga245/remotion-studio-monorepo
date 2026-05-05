import React from "react";
import { staticFile } from "remotion";
import { LottieRecoloredCard } from "../components/LottieRecoloredCard";

export const LottieFan: React.FC = () => (
  <LottieRecoloredCard
    src={staticFile(
      "lottie/Spinning Paper fan from wind _ Thanks page animation.json",
    )}
    title="Paper fan"
    caption="Origami paper fan loop · pastel source, BOL re-skin"
    beat="K · 08"
  />
);
