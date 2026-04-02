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
import type { BrandConfig, Page, PageToken } from "@studio/kinetic-captions";
import { splitToWords, groupIntoPhrases } from "@studio/kinetic-captions";

// --- Page renderer (same as Editorial) ---

const Page: React.FC<{ page: Page; brand: BrandConfig }> = ({
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
        {page.tokens.map((token: PageToken, i: number) => {
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
                    : interpolateColor(revealProgress, brand.secondary, brand.text),
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

// --- Segment renderer — filters and normalizes a time window of captions ---

const SegmentRenderer: React.FC<{
  captions: Caption[];
  startMs: number;
  endMs: number;
  brand: BrandConfig;
}> = ({ captions, startMs, endMs, brand }) => {
  const { fps } = useVideoConfig();

  // Filter to window and normalize timestamps to start from 0
  const normalizedCaptions = useMemo((): Caption[] => {
    return captions
      .filter((c) => c.startMs < endMs && c.endMs > startMs)
      .map((c) => ({
        ...c,
        startMs: Math.max(0, c.startMs - startMs),
        endMs: Math.max(0, c.endMs - startMs),
      }));
  }, [captions, startMs, endMs]);

  const pages = useMemo(() => {
    const wordCaptions = splitToWords(normalizedCaptions);
    return groupIntoPhrases(wordCaptions);
  }, [normalizedCaptions]);

  return (
    <AbsoluteFill>
      {pages.map((page: Page, index: number) => {
        const nextPage = pages[index + 1] ?? null;
        const startFrame = Math.round((page.startMs / 1000) * fps);
        const lastToken = page.tokens[page.tokens.length - 1];
        const endMs2 = nextPage ? nextPage.startMs : lastToken.toMs + 500;
        const endFrame = Math.round((endMs2 / 1000) * fps);
        const duration = Math.max(1, endFrame - startFrame);

        return (
          <Sequence
            key={index}
            from={startFrame}
            durationInFrames={duration}
            premountFor={Math.round(fps * 0.5)}
          >
            <Page page={page} brand={brand} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// --- Main export ---

export const SegmentedCaptions: React.FC<{
  brand: BrandConfig;
  srtFile: string;
  startMs: number;
  endMs: number;
}> = ({ brand, srtFile, startMs, endMs }) => {
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

  if (!captions) return null;

  return (
    <AbsoluteFill style={{ backgroundColor: brand.background }}>
      <SegmentRenderer
        captions={captions}
        startMs={startMs}
        endMs={endMs}
        brand={brand}
      />
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
