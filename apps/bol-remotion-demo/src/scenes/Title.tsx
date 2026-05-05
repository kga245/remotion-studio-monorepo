import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import {
  colors,
  semantic,
  typography,
  sizes,
  springs,
  beats,
} from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

export const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subtitleIn = spring({ frame, fps, config: springs.smooth });
  const titleIn = spring({
    frame: frame - beats.enterShort,
    fps,
    config: springs.snappy,
  });
  const underlineIn = spring({
    frame: frame - beats.enterMedium - 6,
    fps,
    config: springs.smooth,
  });

  return (
    <AbsoluteFill
      style={{
        background: semantic.bgDark,
        color: semantic.textOnDark,
        fontFamily,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ textAlign: "center", padding: 80 }}>
        <div
          style={{
            ...typography.h2,
            fontSize: sizes.h2,
            color: colors.cyan,
            opacity: subtitleIn,
            transform: `translateY(${(1 - subtitleIn) * 12}px)`,
            marginBottom: 24,
          }}
        >
          BOL Agency · Motion demo
        </div>
        <div
          style={{
            ...typography.h1,
            fontSize: sizes.display,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 24}px)`,
          }}
        >
          Remotion capabilities
        </div>
        <div
          style={{
            margin: "32px auto 0",
            height: 6,
            width: 480 * underlineIn,
            background: colors.orange,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
