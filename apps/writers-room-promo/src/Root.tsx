import React from "react";
import { Composition } from "remotion";
import { Video } from "./Video";

const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 30;
const DURATION = 900; // 30 seconds

export const Root: React.FC = () => {
  return (
    <Composition
      id="WritersRoomPromo"
      component={Video}
      width={WIDTH}
      height={HEIGHT}
      fps={FPS}
      durationInFrames={DURATION}
    />
  );
};
