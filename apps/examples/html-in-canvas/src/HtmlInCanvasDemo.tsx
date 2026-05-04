import React, { useCallback } from "react";
import {
  AbsoluteFill,
  HtmlInCanvas,
  interpolate,
  spring,
  type HtmlInCanvasOnPaint,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

type OnPaintArgs = Parameters<HtmlInCanvasOnPaint>[0];
type Canvas2DWithElementImage = OffscreenCanvasRenderingContext2D & {
  drawElementImage: (
    image: OnPaintArgs["elementImage"],
    dx: number,
    dy: number,
  ) => DOMMatrix;
};

const SCAN_LINES = [0, 1, 2, 3, 4, 5, 6];

export const HtmlInCanvasDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const supported = HtmlInCanvas.isSupported();

  const onPaint: HtmlInCanvasOnPaint = useCallback(
    ({ canvas, element, elementImage }) => {
      const ctx = canvas.getContext("2d") as Canvas2DWithElementImage | null;
      if (!ctx) {
        throw new Error("Failed to acquire 2D context");
      }

      const seconds = frame / fps;
      const pulse = 0.5 + 0.5 * Math.sin(seconds * Math.PI * 1.4);
      const blurPx = interpolate(pulse, [0, 1], [2, 18]);

      ctx.reset();
      ctx.filter = `blur(${blurPx}px) saturate(1.25) contrast(1.08)`;
      const transform = ctx.drawElementImage(elementImage, 0, 0);
      element.style.transform = transform.toString();
    },
    [fps, frame],
  );

  if (!supported) {
    return <DemoFrame state="fallback" />;
  }

  return (
    <HtmlInCanvas width={width} height={height} onPaint={onPaint}>
      <DemoFrame state="canvas" />
    </HtmlInCanvas>
  );
};

const DemoFrame: React.FC<{ state: "canvas" | "fallback" }> = ({ state }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({
    frame,
    fps,
    config: {
      damping: 120,
      stiffness: 180,
    },
  });
  const drift = Math.sin((frame / fps) * Math.PI * 2) * 22;
  const isCanvas = state === "canvas";

  return (
    <AbsoluteFill
      style={{
        background:
          "linear-gradient(135deg, #07111f 0%, #0f2a32 45%, #4a2f1a 100%)",
        color: "#f8fafc",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          transform: `scale(${interpolate(entrance, [0, 1], [0.92, 1])})`,
        }}
      >
        <div
          style={{
            width: 1180,
            height: 620,
            border: "1px solid rgba(248,250,252,0.22)",
            backgroundColor: "rgba(8,18,30,0.72)",
            boxShadow: "0 38px 130px rgba(0,0,0,0.42)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {SCAN_LINES.map((line) => (
            <div
              key={line}
              style={{
                position: "absolute",
                left: 88 + line * 130 + drift,
                top: 88 + line * 54,
                width: 280,
                height: 16,
                background:
                  line % 2 === 0
                    ? "rgba(134,239,172,0.32)"
                    : "rgba(251,191,36,0.24)",
                transform: "skewX(-18deg)",
              }}
            />
          ))}
          <div
            style={{
              position: "relative",
              width: 820,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 34,
                fontWeight: 700,
                color: isCanvas ? "#86efac" : "#fbbf24",
                marginBottom: 28,
                textTransform: "uppercase",
                letterSpacing: 0,
              }}
            >
              {isCanvas ? "HTML-in-canvas active" : "Studio fallback"}
            </div>
            <div
              style={{
                fontSize: 104,
                lineHeight: 1.02,
                fontWeight: 900,
                marginBottom: 30,
              }}
            >
              DOM painted into canvas
            </div>
            <div
              style={{
                fontSize: 34,
                lineHeight: 1.45,
                color: "rgba(248,250,252,0.78)",
              }}
            >
              {isCanvas
                ? "A live React layout is captured and post-processed with the Canvas 2D API."
                : "Use Chrome Canary 149+ with HTML-in-Canvas enabled to preview the effect in Studio."}
            </div>
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
