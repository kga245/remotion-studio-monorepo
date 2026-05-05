import React from "react";
import { staticFile } from "remotion";
import { LottieRecoloredCard } from "../components/LottieRecoloredCard";

export const LottieRunDog: React.FC = () => (
  <LottieRecoloredCard
    src={staticFile("lottie/Run Dog Run.json")}
    title="Run dog, run"
    caption="Short-loop character · brand-tinted, plays back on a 6-second cycle"
    beat="K · 07"
  />
);
