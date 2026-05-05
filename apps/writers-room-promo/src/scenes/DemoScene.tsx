import React from "react";
import { AbsoluteFill, Sequence } from "remotion";
import { ScreenFrame } from "../components/ScreenFrame";
import { FeatureCallout } from "../components/FeatureCallout";
import { FadeText } from "../components/FadeText";
import { FilmGrain } from "../components/FilmGrain";
import { COLORS } from "../colors";
import { sansFont } from "../fonts";

// Timeline within this scene (480 frames = 16s at 30fps):
//   0-180:   Audio narration demo
//   180-360: Quality gates demo
//   360-480: Create your own writer

export const DemoScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      {/* ── Demo 1: Audio Book / Narration (frames 0-180) ── */}
      <Sequence from={0} durationInFrames={180} premountFor={10}>
        <AbsoluteFill>
          {/* Section label */}
          <div
            style={{
              position: "absolute",
              top: 36,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <FadeText
              text="Listen to your stories"
              delay={5}
              fontSize={32}
              fontFamily={sansFont}
              fontWeight={300}
              color={COLORS.textMuted}
              letterSpacing={2}
              slideDistance={10}
              exitAt={140}
            />
          </div>

          {/* Screen recording */}
          <ScreenFrame
            src="assets/video/generate audio_h264.mp4"
            delay={10}
            playbackRate={1.2}
          />

          {/* Callouts */}
          <FeatureCallout
            label="AI Narration"
            description="OpenAI TTS — one tap to listen"
            x={120}
            y={340}
            delay={40}
            anchor="left"
            exitAt={140}
          />
          <FeatureCallout
            label="Inline Player"
            description="Listen while you read"
            x={120}
            y={540}
            delay={65}
            anchor="left"
            exitAt={140}
          />
        </AbsoluteFill>
      </Sequence>

      {/* ── Demo 2: Quality Gates (frames 180-360) ── */}
      <Sequence from={180} durationInFrames={180} premountFor={10}>
        <AbsoluteFill>
          {/* Section label */}
          <div
            style={{
              position: "absolute",
              top: 36,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <FadeText
              text="Quality you can trust"
              delay={5}
              fontSize={32}
              fontFamily={sansFont}
              fontWeight={300}
              color={COLORS.textMuted}
              letterSpacing={2}
              slideDistance={10}
              exitAt={140}
            />
          </div>

          {/* Screen recording */}
          <ScreenFrame
            src="assets/video/prose quality_h264.mp4"
            delay={10}
            playbackRate={1.2}
          />

          {/* Callouts */}
          <FeatureCallout
            label="Story Critic"
            description="7 criteria — emotional truth to slop detection"
            x={1300}
            y={320}
            delay={40}
            anchor="right"
            exitAt={140}
          />
          <FeatureCallout
            label="Line Editor"
            description="Cuts clichés, tightens prose"
            x={1300}
            y={500}
            delay={65}
            anchor="right"
            exitAt={140}
          />
        </AbsoluteFill>
      </Sequence>

      {/* ── Demo 3: Create Your Own Writer (frames 360-480) ── */}
      <Sequence from={360} durationInFrames={120} premountFor={10}>
        <AbsoluteFill>
          {/* Section label */}
          <div
            style={{
              position: "absolute",
              top: 36,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <FadeText
              text="Make it yours"
              delay={5}
              fontSize={32}
              fontFamily={sansFont}
              fontWeight={300}
              color={COLORS.textMuted}
              letterSpacing={2}
              slideDistance={10}
              exitAt={90}
            />
          </div>

          {/* Screen recording */}
          <ScreenFrame
            src="assets/video/Creating a writer_h264.mp4"
            delay={10}
          />

          {/* Callout */}
          <FeatureCallout
            label="Custom Personas"
            description="Name, voice, strengths — your writer, your rules"
            x={120}
            y={400}
            delay={35}
            anchor="left"
            exitAt={90}
          />
        </AbsoluteFill>
      </Sequence>

      {/* Film grain across all demos */}
      <FilmGrain opacity={0.04} />
    </AbsoluteFill>
  );
};
