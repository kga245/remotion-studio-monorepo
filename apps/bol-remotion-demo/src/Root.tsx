import React from "react";
import { Composition, Folder } from "remotion";
import { Showcase } from "./scenes/Showcase";
import { sceneFolders } from "./scenes";
import { ParametricCard, ParametricCardSchema } from "./scenes/ParametricCard";
import { projectConfig } from "./project.config";

export const Root: React.FC = () => {
  return (
    <>
      {/* Master timeline at top level (no folder). */}
      <Composition
        id="Showcase"
        component={Showcase}
        width={projectConfig.width}
        height={projectConfig.height}
        fps={projectConfig.fps}
        durationInFrames={projectConfig.durationInFrames}
      />

      {/* Capability folders, in PRESENTATION.md order (A → L). */}
      {sceneFolders.map((sf) => {
        if (sf.scenes.length === 0) return null;
        return (
          <Folder key={sf.folder} name={sf.folder}>
            {sf.scenes.map((scene) => (
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
          </Folder>
        );
      })}

      {/* J · Parametric — registered separately so it can carry a Zod schema
          and defaultProps. The studio's Props panel auto-renders editable
          controls per field. */}
      <Folder name="J-Parametric">
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
      </Folder>
    </>
  );
};
