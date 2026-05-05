import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  staticFile,
  useDelayRender,
} from "remotion";
import { parseSrt } from "@remotion/captions";
import type { Caption } from "@remotion/captions";
import type { BrandConfig, Page } from "../types";
import { splitToWords, groupIntoPhrases } from "../grouper";

// --- Page renderer ---

const EditorialPage: React.FC<{ page: Page; brand: BrandConfig }> = ({
  page,
  brand,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const currentTimeMs = (frame / fps) * 1000 + page.startMs;

  const pageOpacity = interpolate(frame, [0, 10], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        justifyContent: "center",
        alignItems: "center",
        opacity: pageOpacity,
      }}
    >
      <div
        style={{
          fontFamily: brand.fontFamily,
          fontSize: 48,
          fontWeight: Number(brand.fontWeights.light),
          textAlign: "center",
          maxWidth: "75%",
          lineHeight: 1.5,
          whiteSpace: "pre-wrap",
          color: brand.secondary,
        }}
      >
        {page.tokens.map((token, i) => {
          const isActive =
            token.fromMs <= currentTimeMs && token.toMs > currentTimeMs;
          const isPast = token.toMs <= currentTimeMs;

          const revealProgress = interpolate(
            currentTimeMs,
            [token.fromMs - 100, token.fromMs + 50],
            [0, 1],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
          );

          const underlineWidth = isActive
            ? interpolate(
                currentTimeMs,
                [token.fromMs, token.fromMs + 200],
                [0, 100],
                { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
              )
            : 0;

          return (
            <span
              key={`${token.fromMs}-${i}`}
              style={{
                display: "inline",
                position: "relative",
                color:
                  isPast || isActive
                    ? brand.text
                    : interpolateColor(
                        revealProgress,
                        brand.secondary,
                        brand.text,
                      ),
                fontWeight: isActive
                  ? Number(brand.fontWeights.bold)
                  : Number(brand.fontWeights.light),
              }}
            >
              {token.text}
              {isActive && (
                <span
                  style={{
                    position: "absolute",
                    bottom: -2,
                    left: 0,
                    width: `${underlineWidth}%`,
                    height: 3,
                    backgroundColor: brand.accent,
                    borderRadius: 1.5,
                  }}
                />
              )}
            </span>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

// --- Caption renderer (pages → sequences) ---

const CaptionRenderer: React.FC<{
  captions: Caption[];
  brand: BrandConfig;
}> = ({ captions, brand }) => {
  const { fps } = useVideoConfig();

  const pages = useMemo(() => {
    const wordCaptions = splitToWords(captions);
    return groupIntoPhrases(wordCaptions);
  }, [captions]);

  return (
    <AbsoluteFill>
      {pages.map((page, index) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const lastToken = page.tokens[page.tokens.length - 1];
        const endMs = nextPage ? nextPage.startMs : lastToken.toMs + 500;
        const endFrame = Math.round((endMs / 1000) * fps);
        const duration = Math.max(1, endFrame - startFrame);

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={duration}
            premountFor={Math.round(fps * 0.5)}
          >
            <EditorialPage page={page} brand={brand} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Main composition (loads SRT + renders) ---

export const EditorialCaptions: React.FC<{
  brand: BrandConfig;
  srtFile: string;
}> = ({ brand, srtFile }) => {
  const [captions, setCaptions] = useState<Caption[] | null>(null);
  const { delayRender, continueRender, cancelRender } = useDelayRender();
  const [handle] = useState(() => delayRender());

  const fetchCaptions = useCallback(async () => {
    try {
      const response = await fetch(staticFile(srtFile));
      const text = await response.text();
      const { captions: parsed } = parseSrt({ input: text });
      setCaptions(parsed);
      continueRender(handle);
    } catch (e) {
      cancelRender(e);
    }
  }, [srtFile, continueRender, cancelRender, handle]);

  useEffect(() => {
    fetchCaptions();
  }, [fetchCaptions]);

  if (!captions) {
    return null;
  }

  return (
    <AbsoluteFill style={{ backgroundColor: brand.background }}>
      <CaptionRenderer captions={captions} brand={brand} />
    </AbsoluteFill>
  );
};

// --- Utilities ---

function interpolateColor(t: number, from: string, to: string): string {
  const f = hexToRgb(from);
  const toRgb = hexToRgb(to);
  const r = Math.round(f.r + (toRgb.r - f.r) * t);
  const g = Math.round(f.g + (toRgb.g - f.g) * t);
  const b = Math.round(f.b + (toRgb.b - f.b) * t);
  return `rgb(${r}, ${g}, ${b})`;
}

function hexToRgb(hex: string) {
  const val = parseInt(hex.slice(1), 16);
  return { r: (val >> 16) & 255, g: (val >> 8) & 255, b: val & 255 };
}
