import React from "react";
import { staticFile } from "remotion";
import { LottieRecoloredCard } from "../components/LottieRecoloredCard";

export const LottieGraph: React.FC = () => (
  <LottieRecoloredCard
    src={staticFile("lottie/Graph Animation.json")}
    title="Graph animation"
    caption="Designer-authored chart · same Lottie, BOL palette mapped at runtime"
    beat="K · 06"
  />
);
