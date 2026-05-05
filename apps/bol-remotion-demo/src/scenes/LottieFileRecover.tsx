import React from "react";
import { staticFile } from "remotion";
import { LottieRecoloredCard } from "../components/LottieRecoloredCard";

export const LottieFileRecover: React.FC = () => (
  <LottieRecoloredCard
    src={staticFile("lottie/File recover.json")}
    title="File recover"
    caption="Document/recovery icon · brand-tinted for status indicators"
    beat="K · 05"
  />
);
