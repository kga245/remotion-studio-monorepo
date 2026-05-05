import React from "react";
import { staticFile } from "remotion";
import { LottieRecoloredCard } from "../components/LottieRecoloredCard";

export const LottieLayer: React.FC = () => (
  <LottieRecoloredCard
    src={staticFile("lottie/layer Lottie Animation.json")}
    title="Layered shapes"
    caption="Geometric layers · stacked elements remap by luminance band"
    beat="K · 09"
  />
);
