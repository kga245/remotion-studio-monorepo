import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { Typewriter } from "../components/Typewriter";
import { TypewriterAudio } from "../components/TypewriterAudio";
import { HRule } from "../components/HRule";
import { FilmGrain } from "../components/FilmGrain";
import { COLORS } from "../colors";
import { serifFont } from "../fonts";

const HOOK_TEXT = "Five writers walk into a room.";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(
    spring({ frame, fps, config: { damping: 200 } }),
    [0, 1],
    [0, 1],
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        alignItems: "center",
        justifyContent: "center",
        opacity: bgOpacity,
      }}
    >
      {/* Subtle radial glow behind text */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${COLORS.ink}44 0%, transparent 70%)`,
          opacity: interpolate(frame, [0, 30], [0, 0.6], {
            extrapolateRight: "clamp",
          }),
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <Typewriter
          text={HOOK_TEXT}
          delay={8}
          charFrames={2}
          fontSize={68}
          fontFamily={serifFont}
          fontWeight={400}
          color={COLORS.text}
          letterSpacing={-0.5}
          showCursor={true}
        />

        <HRule delay={70} color={COLORS.accent} width={80} thickness={1} />
      </div>

      {/* Typewriter click audio */}
      <TypewriterAudio
        text={HOOK_TEXT}
        startFrame={8}
        charFrames={2}
        volume={0.12}
      />

      {/* Film grain overlay */}
      <FilmGrain opacity={0.05} />
    </AbsoluteFill>
  );
};
