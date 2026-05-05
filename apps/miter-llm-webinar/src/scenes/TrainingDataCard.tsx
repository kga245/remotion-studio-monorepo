/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
// Rescued from a stale Claude Code worktree (determined-burnell, 2026-04-19).
// Imports `COLORS, FONTS, TEXT` from "../theme", but the current theme.ts only
// exports `COLORS, fontFamily, brand` — and the COLORS palette differs (this
// file uses `bg`, `amber`, `amberDim`, `bgCard`, `muted`, none of which exist
// on the current theme). Not registered in Root.tsx; will not load in studio.
// To revive: replace these imports with the current theme tokens, drop the
// pragma above, and register the composition in Root.tsx.
import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { COLORS, FONTS, TEXT } from "../theme";

export const TrainingDataCard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame, fps, config: { damping: 18, stiffness: 160 } });
  const opacity = interpolate(s, [0, 1], [0, 1], { extrapolateLeft: "clamp" });
  const y = interpolate(s, [0, 1], [60, 0]);

  const defOpacity = interpolate(frame, [16, 36], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        fontFamily: FONTS.display,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${y}px)`,
          background: `linear-gradient(135deg, ${COLORS.amberDim}55, ${COLORS.bgCard})`,
          border: `2px solid ${COLORS.amber}55`,
          borderRadius: 32,
          padding: "64px 80px",
          maxWidth: 960,
          display: "flex",
          flexDirection: "column",
          gap: 28,
          boxShadow: `0 40px 100px ${COLORS.amberDim}66`,
        }}
      >
        <div
          style={{
            fontSize: TEXT.eyebrow,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: COLORS.amber,
            fontWeight: 700,
          }}
        >
          Concept
        </div>
        <div
          style={{
            fontSize: TEXT.title + 20,
            fontWeight: 900,
            color: COLORS.white,
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
          }}
        >
          TRAINING DATA
        </div>
        <div
          style={{
            opacity: defOpacity,
            width: 80,
            height: 4,
            background: COLORS.amber,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            opacity: defOpacity,
            fontSize: TEXT.sub - 4,
            color: COLORS.muted,
            lineHeight: 1.6,
          }}
        >
          The vast corpus of text the LLM was trained on. Billions of web pages,
          articles, books, and documents — baked in at training time. Content
          here is how the model "knows" things without looking them up.
        </div>
        <div
          style={{
            opacity: defOpacity,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {[
            "Static snapshot",
            "High-volume wins",
            "Authority signals",
            "No real-time updates",
          ].map((tag) => (
            <div
              key={tag}
              style={{
                padding: "8px 20px",
                background: `${COLORS.amber}22`,
                border: `1px solid ${COLORS.amber}44`,
                borderRadius: 10,
                fontSize: TEXT.body - 6,
                fontWeight: 700,
                color: COLORS.amber,
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
