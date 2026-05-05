import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
} from "remotion";
import { FadeText } from "../components/FadeText";
import { HRule } from "../components/HRule";
import { WriterAvatar } from "../components/WriterAvatar";
import { FilmGrain } from "../components/FilmGrain";
import { COLORS } from "../colors";
import { serifFont, sansFont } from "../fonts";

const PURPOSES = ["For TV.", "For Books.", "For Fun.", "For You."];

const WRITERS = [
  { name: "Maya", trait: "Heart" },
  { name: "Devon", trait: "Edge" },
  { name: "Sadie", trait: "Weird" },
  { name: "Marcus", trait: "Craft" },
  { name: "Eli", trait: "Funny" },
  { name: "Yours", trait: "Create", dotted: true },
];

export const ValueScene: React.FC = () => {
  const _frame = useCurrentFrame();
  const { fps: _fps } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: COLORS.bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Purposes cascade */}
      <div
        style={{
          position: "absolute",
          top: 260,
          display: "flex",
          gap: 48,
          alignItems: "baseline",
        }}
      >
        {PURPOSES.map((text, i) => (
          <FadeText
            key={text}
            text={text}
            delay={i * 8}
            fontSize={60}
            fontFamily={serifFont}
            fontWeight={700}
            color={COLORS.text}
            letterSpacing={-0.5}
            exitAt={80}
            slideDistance={20}
          />
        ))}
      </div>

      {/* Horizontal rule divider */}
      <Sequence from={40} layout="none" premountFor={10}>
        <div style={{ position: "absolute", top: 360 }}>
          <HRule delay={0} color={COLORS.accentDim} width={600} thickness={1} />
        </div>
      </Sequence>

      {/* Core thesis */}
      <Sequence from={50} layout="none" premountFor={10}>
        <div
          style={{
            position: "absolute",
            top: 400,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          <FadeText
            text="Good ideas come from"
            delay={0}
            fontSize={42}
            fontFamily={sansFont}
            fontWeight={300}
            color={COLORS.textMuted}
            letterSpacing={1}
            slideDistance={15}
          />
          <FadeText
            text="diversity of thought."
            delay={10}
            fontSize={56}
            fontFamily={serifFont}
            fontWeight={700}
            color={COLORS.accent}
            letterSpacing={-0.5}
            slideDistance={15}
          />
        </div>
      </Sequence>

      {/* Writer avatars with rings */}
      <Sequence from={90} layout="none" premountFor={10}>
        <div
          style={{
            position: "absolute",
            bottom: 180,
            display: "flex",
            gap: 56,
            alignItems: "flex-start",
          }}
        >
          {WRITERS.map((writer, i) => (
            <WriterAvatar
              key={writer.name}
              name={writer.name}
              trait={writer.trait}
              delay={i * 6}
              color={writer.dotted ? COLORS.textMuted : COLORS.accent}
              dotted={writer.dotted ?? false}
              size={80}
            />
          ))}
        </div>
      </Sequence>

      {/* Film grain */}
      <FilmGrain opacity={0.05} />
    </AbsoluteFill>
  );
};
