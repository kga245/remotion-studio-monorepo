import React from "react";
import {
  AbsoluteFill,
  Audio,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useAudioData, visualizeAudio } from "@remotion/media-utils";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

// EDIT ME: word-level caption timestamps in *frames*. After watching playback,
// scrub frame-by-frame and adjust `from`/`to` on each word so the highlight
// snaps onto each syllable. Real production workflow would feed the audio
// through @remotion/install-whisper-cpp for automatic word timestamps.
type Caption = { word: string; from: number; to: number };

const CAPTIONS: Caption[] = [
  { word: "Every", from: 0, to: 18 },
  { word: "frame,", from: 18, to: 33 },
  { word: "on", from: 33, to: 45 },
  { word: "brand.", from: 45, to: 72 },
  // natural breath
  { word: "Every", from: 78, to: 93 },
  { word: "animation,", from: 93, to: 120 },
  { word: "generated", from: 120, to: 150 },
  { word: "from", from: 150, to: 162 },
  { word: "code.", from: 162, to: 192 },
];

const AUDIO_SRC = staticFile("audio/voiceover.mp3");

const Waveform: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const audioData = useAudioData(AUDIO_SRC);

  if (!audioData) return null;

  const bars = visualizeAudio({
    fps,
    frame,
    audioData,
    numberOfSamples: 32,
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 80,
        height: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
      }}
    >
      {bars.map((amplitude, i) => {
        const height = Math.max(4, amplitude * 280);
        return (
          <div
            key={i}
            style={{
              width: 12,
              height,
              borderRadius: 4,
              background: colors.orange,
              opacity: 0.85,
            }}
          />
        );
      })}
    </div>
  );
};

export const AudioCaptions: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <VignetteFrame
      beat="05 / 07"
      capability="Audio with frame-locked captions"
      api="<Audio>  ·  visualizeAudio()"
      tone="dark"
    >
      <Audio src={AUDIO_SRC} />

      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
          fontFamily,
        }}
      >
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1.15,
            letterSpacing: "-0.015em",
            textAlign: "center",
            maxWidth: 1500,
          }}
        >
          {CAPTIONS.map((cap, i) => {
            const hasStarted = frame >= cap.from;
            const isActive = frame >= cap.from && frame < cap.to;
            const opacity = hasStarted ? (isActive ? 1 : 0.35) : 0;
            const color = isActive ? colors.orange : "inherit";
            const scale = isActive ? 1.02 : 1;
            return (
              <span
                key={i}
                style={{
                  display: "inline-block",
                  opacity,
                  color,
                  transform: `scale(${scale})`,
                  marginRight: 22,
                  transition: "none",
                }}
              >
                {cap.word}
              </span>
            );
          })}
        </div>
      </AbsoluteFill>

      <Waveform />
    </VignetteFrame>
  );
};
