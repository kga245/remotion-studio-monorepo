import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { FadeText } from "../components/FadeText";
import { HRule } from "../components/HRule";
import { FilmGrain } from "../components/FilmGrain";
import { COLORS } from "../colors";
import { serifFont, sansFont } from "../fonts";

export const CTAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgBrightness = interpolate(
    spring({ frame, fps, config: { damping: 200 } }),
    [0, 1],
    [0.8, 1],
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        alignItems: "center",
        justifyContent: "center",
        filter: `brightness(${bgBrightness})`,
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.accent}15 0%, transparent 70%)`,
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateRight: "clamp",
          }),
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
        }}
      >
        <FadeText
          text="Let the room work it out."
          delay={5}
          fontSize={62}
          fontFamily={serifFont}
          fontWeight={400}
          color={COLORS.text}
          letterSpacing={-0.5}
          slideDistance={20}
        />

        <HRule delay={25} color={COLORS.accent} width={60} thickness={1} />

        {/* URL */}
        <div
          style={{
            opacity: spring({
              frame,
              fps,
              delay: 35,
              config: { damping: 200 },
            }),
            transform: `translateY(${interpolate(
              spring({ frame, fps, delay: 35, config: { damping: 200 } }),
              [0, 1],
              [10, 0],
            )}px)`,
          }}
        >
          <div
            style={{
              fontSize: 30,
              fontFamily: sansFont,
              fontWeight: 300,
              color: COLORS.accent,
              letterSpacing: 5,
              textTransform: "uppercase",
            }}
          >
            writersrooms.studio
          </div>
        </div>
      </div>

      {/* Film grain */}
      <FilmGrain opacity={0.04} />
    </AbsoluteFill>
  );
};
