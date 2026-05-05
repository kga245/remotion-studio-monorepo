import React from "react";
import { Composition } from "remotion";
import { Showcase } from "./scenes/Showcase";
import { scenes } from "./scenes";
import { ParametricCard, ParametricCardSchema } from "./scenes/ParametricCard";
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

      {/* Prop-less scenes from the registry */}
      {scenes.map((scene) => (
        <Composition
          key={scene.id}
          id={scene.id}
          component={scene.component}
          width={projectConfig.width}
          height={projectConfig.height}
          fps={projectConfig.fps}
          durationInFrames={scene.durationInFrames}
        />
      ))}

      {/* Parametric scene — registered separately so it can carry a Zod schema
          and defaultProps. The studio's Props panel auto-renders editable
          controls per field. */}
      <Composition
        id="ParametricCard"
        component={ParametricCard}
        schema={ParametricCardSchema}
        defaultProps={{
          headline: "Brand book in motion",
          subtitle: "BOL Agency · Edit me on the right ➜",
          accentColor: "#F85E32",
          textColor: "#FFFFFF",
          background: "graphite" as const,
          underlineWidthPx: 480,
          showUnderline: true,
        }}
        width={projectConfig.width}
        height={projectConfig.height}
        fps={projectConfig.fps}
        durationInFrames={120}
      />
    </>
  );
};
