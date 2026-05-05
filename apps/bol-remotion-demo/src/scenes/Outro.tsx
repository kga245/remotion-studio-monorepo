import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { colors, semantic, typography, sizes, springs } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleIn = spring({ frame, fps, config: springs.smooth });
  const subIn = spring({
    frame: frame - 12,
    fps,
    config: springs.smooth,
  });
  const lineIn = spring({
    frame: frame - 24,
    fps,
    config: springs.snappy,
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
            ...typography.h1,
            fontSize: sizes.h1,
            opacity: titleIn,
            transform: `translateY(${(1 - titleIn) * 24}px)`,
          }}
        >
          Made with Remotion
        </div>
        <div
          style={{
            ...typography.h2,
            fontSize: sizes.h2,
            color: colors.cyan,
            opacity: subIn,
            transform: `translateY(${(1 - subIn) * 12}px)`,
            marginTop: 24,
          }}
        >
          BOL Agency · brand book in motion
        </div>
        <div
          style={{
            margin: "40px auto 0",
            height: 6,
            width: 360 * lineIn,
            background: colors.orange,
          }}
        />
      </div>
    </AbsoluteFill>
  );
};
