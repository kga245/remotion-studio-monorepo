import React from "react";
import { Sequence, staticFile } from "remotion";
import { Audio } from "@remotion/media";

type TypewriterAudioProps = {
  text: string;
  startFrame?: number;
  charFrames?: number;
  volume?: number;
};

/**
 * Plays a click sound for each new character typed.
 * Requires a short click audio file at public/assets/audio/click.wav.
 * Each character gets its own <Audio> in a <Sequence> at the right frame.
 */
export const TypewriterAudio: React.FC<TypewriterAudioProps> = ({
  text,
  startFrame = 0,
  charFrames = 2,
  volume = 0.15,
}) => {
  return (
    <>
      {text.split("").map((char, i) => {
        if (char === " ") return null;
        const clickFrame = startFrame + i * charFrames;
        return (
          <Sequence
            key={i}
            from={clickFrame}
            durationInFrames={charFrames + 2}
            layout="none"
            premountFor={2}
          >
            <Audio src={staticFile("assets/audio/click.wav")} volume={volume} />
          </Sequence>
        );
      })}
    </>
  );
};
