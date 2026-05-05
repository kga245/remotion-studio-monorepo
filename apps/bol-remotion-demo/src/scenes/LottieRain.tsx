import React from "react";
import { staticFile } from "remotion";
import { LottieRecoloredCard } from "../components/LottieRecoloredCard";

export const LottieRain: React.FC = () => (
  <LottieRecoloredCard
    src={staticFile("lottie/Digital Clouds Rain.json")}
    title="Digital rain"
    caption="Atmospheric loop · grays remap to graphite, accents to BOL orange/cyan"
    beat="K · 04"
  />
);
