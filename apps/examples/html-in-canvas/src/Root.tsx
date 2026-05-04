import React from "react";
import { Composition } from "remotion";
import { HtmlInCanvasDemo } from "./HtmlInCanvasDemo";

export const Root: React.FC = () => {
  return (
    <Composition
      id="HtmlInCanvasDemo"
      component={HtmlInCanvasDemo}
      durationInFrames={180}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
