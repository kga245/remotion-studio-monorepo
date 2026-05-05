import React from "react";
import { staticFile } from "remotion";
import { LottieRecoloredCard } from "../components/LottieRecoloredCard";

export const LottieWFH: React.FC = () => (
  <LottieRecoloredCard
    src={staticFile("lottie/work from home.json")}
    title="Work from home"
    caption="Illustration loop · whole scene re-tinted to BOL palette in one pass"
    beat="K · 10"
  />
);
