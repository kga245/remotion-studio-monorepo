import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  staticFile,
} from "remotion";
import { Video } from "@remotion/media";
import { COLORS } from "../colors";

type ScreenFrameProps = {
  src: string;
  delay?: number;
  trimBefore?: number;
  playbackRate?: number;
};

/**
 * A screen recording displayed in a floating device frame with
 * rounded corners, subtle shadow, and scale-in entrance.
 */
export const ScreenFrame: React.FC<ScreenFrameProps> = ({
  src,
  delay = 0,
  trimBefore = 0,
  playbackRate = 1,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    delay,
    config: { damping: 200 },
  });

  const scale = interpolate(enter, [0, 1], [0.92, 1]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: enter,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          width: 1600,
          height: 900,
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: `0 20px 60px ${COLORS.bg}cc, 0 0 0 1px ${COLORS.accentDim}33`,
          position: "relative",
        }}
      >
        <Video
          src={staticFile(src)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          muted
          trimBefore={trimBefore}
          playbackRate={playbackRate}
        />
      </div>
    </div>
  );
};
