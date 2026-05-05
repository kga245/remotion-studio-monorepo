import React from "react";
import { Composition } from "remotion";
import { Showcase } from "./scenes/Showcase";
import { projectConfig } from "./project.config";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Showcase"
        component={Showcase}
        width={projectConfig.width}
        height={projectConfig.height}
        fps={projectConfig.fps}
        durationInFrames={projectConfig.durationInFrames}
      />
    </>
  );
};
