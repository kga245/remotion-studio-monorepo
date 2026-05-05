import React from "react";
import { staticFile } from "remotion";
import { LottieRecoloredCard } from "../components/LottieRecoloredCard";

export const LottieConfetti: React.FC = () => (
  <LottieRecoloredCard
    src={staticFile("lottie/Confetti Lottie Animation.json")}
    title="Confetti, brand-tinted"
    caption="From a generic confetti Lottie · re-skinned to BOL via luminance map"
    beat="K · 03"
  />
);
