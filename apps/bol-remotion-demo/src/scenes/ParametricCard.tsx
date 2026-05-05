import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { zColor } from "@remotion/zod-types";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import {
  colors,
  semantic,
  typography,
  sizes,
  springs,
  beats,
} from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// Demonstrates Remotion's Zod-based schema → studio Props panel binding.
// Edit any of these in the right-side panel and the preview re-renders live.
// Render variants from the CLI with --props='{"headline":"...","accentColor":"#abc"}'.
export const ParametricCardSchema = z.object({
  headline: z.string().min(1).max(80),
  subtitle: z.string().max(80),
  accentColor: zColor(),
  textColor: zColor(),
  background: z.enum(["graphite", "white", "cyan"]),
  underlineWidthPx: z.number().min(80).max(900).step(10),
  showUnderline: z.boolean(),
});

export type ParametricCardProps = z.infer<typeof ParametricCardSchema>;

const BG_MAP: Record<ParametricCardProps["background"], string> = {
  graphite: semantic.bgDark,
  white: semantic.bgWhite,
  cyan: colors.cyan,
};

export const ParametricCard: React.FC<ParametricCardProps> = ({
  headline,
  subtitle,
  accentColor,
  textColor,
  background,
  underlineWidthPx,
  showUnderline,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const subIn = spring({ frame, fps, config: springs.smooth });
  const titleIn = spring({
    frame: frame - beats.enterShort,
    fps,
    config: springs.snappy,
  });
  const lineIn = spring({
    frame: frame - beats.enterMedium - 6,
    fps,
    config: springs.smooth,
  });

  return (
    <VignetteFrame
      beat="J · 01"
      capability="Parametric props (Zod schema)"
      api="z.object  ·  zColor()  ·  defaultProps"
      tone={background === "graphite" ? "dark" : "light"}
    >
      <AbsoluteFill
        style={{
          background: BG_MAP[background],
          color: textColor,
          fontFamily,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", padding: 80, maxWidth: 1500 }}>
          <div
            style={{
              ...typography.h2,
              fontSize: sizes.h2,
              color: accentColor,
              opacity: subIn,
              transform: `translateY(${(1 - subIn) * 12}px)`,
              marginBottom: 24,
            }}
          >
            {subtitle}
          </div>
          <div
            style={{
              ...typography.h1,
              fontSize: sizes.display,
              opacity: titleIn,
              transform: `translateY(${(1 - titleIn) * 24}px)`,
            }}
          >
            {headline}
          </div>
          {showUnderline && (
            <div
              style={{
                margin: "32px auto 0",
                height: 6,
                width: underlineWidthPx * lineIn,
                background: accentColor,
              }}
            />
          )}
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
