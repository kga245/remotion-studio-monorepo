import React from "react";
import { Composition } from "remotion";
import { z } from "zod";
import { PixelTypography } from "./PixelTypography";
import { VIDEO, TOTAL_FRAMES } from "./design";

const pixelTypographySchema = z.object({
  text: z.string(),
  backgroundColor: z.string(),
  primaryColor: z.string(),
  letterboxColor: z.string(),
});

const sampleText = "THE FUTURE OF SEARCH IS HERE";

const letterboxColors = [
  { id: "Purple", color: "#ab4ff6" },
  { id: "Charcoal", color: "#202124" },
  { id: "Blue", color: "#3c78d8" },
  { id: "Coral", color: "#ff5f79" },
  { id: "DeepNavy", color: "#1a1a3e" },
  { id: "Forest", color: "#2d5a3d" },
] as const;

const quotes = [
  { id: "MediumMessage", text: "THE MEDIUM IS THE MESSAGE" },
  { id: "ThinkDifferent", text: "THINK DIFFERENT" },
  { id: "BeTheChange", text: "BE THE CHANGE YOU WISH TO SEE" },
  { id: "LessIsMore", text: "LESS IS MORE" },
  { id: "MoveFast", text: "MOVE FAST AND BREAK THINGS" },
  { id: "StayHungry", text: "STAY HUNGRY STAY FOOLISH" },
  { id: "FutureSearch", text: "THE FUTURE OF SEARCH IS HERE" },
  { id: "KnowledgeIsPower", text: "KNOWLEDGE IS POWER" },
  { id: "Imagination", text: "IMAGINATION IS MORE IMPORTANT THAN KNOWLEDGE" },
  { id: "WellDone", text: "WELL DONE IS BETTER THAN WELL SAID" },
] as const;

export const Root: React.FC = () => {
  return (
    <>
      {/* Color audition: same text, different letterbox colors */}
      {letterboxColors.map((lc) => (
        <Composition
          key={`Color-${lc.id}`}
          id={`Color-${lc.id}`}
          component={PixelTypography}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={TOTAL_FRAMES}
          schema={pixelTypographySchema}
          defaultProps={{
            text: sampleText,
            backgroundColor: "#e8e4de",
            primaryColor: "#ff6234",
            letterboxColor: lc.color,
          }}
        />
      ))}

      {/* Custom: Top 10 All-Time Bands */}
      <Composition
        id="Top10Bands"
        component={PixelTypography}
        width={VIDEO.width}
        height={VIDEO.height}
        fps={VIDEO.fps}
        durationInFrames={TOTAL_FRAMES}
        schema={pixelTypographySchema}
        defaultProps={{
          text: "TOP 10 ALL-TIME BANDS",
          backgroundColor: "#e8e4de",
          primaryColor: "#ff6234",
          letterboxColor: "#202124",
        }}
      />

      {/* Quote audition: all quotes with purple letterbox */}
      {quotes.map((q) => (
        <Composition
          key={`Quote-${q.id}`}
          id={`Quote-${q.id}`}
          component={PixelTypography}
          width={VIDEO.width}
          height={VIDEO.height}
          fps={VIDEO.fps}
          durationInFrames={TOTAL_FRAMES}
          schema={pixelTypographySchema}
          defaultProps={{
            text: q.text,
            backgroundColor: "#e8e4de",
            primaryColor: "#ff6234",
            letterboxColor: "#ab4ff6",
          }}
        />
      ))}
    </>
  );
};
