import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { useVideoMetadata, useVideoEdges } from "../src/useVideoMetadata";

vi.mock("remotion", () => ({
  useCurrentFrame: vi.fn(),
  useVideoConfig: vi.fn(),
}));

const mockFrame = (f: number) => {
  vi.mocked(useCurrentFrame).mockReturnValue(f);
};

const mockConfig = (config: {
  fps?: number;
  durationInFrames?: number;
  width?: number;
  height?: number;
}) => {
  vi.mocked(useVideoConfig).mockReturnValue({
    fps: 30,
    durationInFrames: 300,
    width: 1920,
    height: 1080,
    id: "test",
    defaultProps: {},
    props: {},
    defaultCodec: "h264",
    defaultOutName: "out",
    defaultVideoImageFormat: "jpeg",
    defaultPixelFormat: "yuv420p",
    ...config,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
};

describe("useVideoMetadata module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useVideoMetadata", () => {
    it("returns the derived metadata for the current frame", () => {
      mockFrame(150);
      mockConfig({
        fps: 30,
        durationInFrames: 300,
        width: 1920,
        height: 1080,
      });

      const meta = useVideoMetadata();
      expect(meta.currentFrame).toBe(150);
      expect(meta.currentTime).toBe(5);
      expect(meta.totalFrames).toBe(300);
      expect(meta.totalDuration).toBe(10);
      expect(meta.fps).toBe(30);
      expect(meta.width).toBe(1920);
      expect(meta.height).toBe(1080);
      expect(meta.progress).toBe(0.5);
    });

    it("clamps progress to 1 at the end of the video", () => {
      mockFrame(300);
      mockConfig({ durationInFrames: 300 });
      expect(useVideoMetadata().progress).toBe(1);
    });
  });

  describe("useVideoEdges", () => {
    it("detects the start edge", () => {
      mockFrame(5);
      mockConfig({ durationInFrames: 300 });
      const edges = useVideoEdges(10);
      expect(edges.isStart).toBe(true);
      expect(edges.isEnd).toBe(false);
    });

    it("detects the end edge", () => {
      mockFrame(295);
      mockConfig({ durationInFrames: 300 });
      const edges = useVideoEdges(10);
      expect(edges.isStart).toBe(false);
      expect(edges.isEnd).toBe(true);
    });

    it("reports neither edge in the middle of the video", () => {
      mockFrame(150);
      mockConfig({ durationInFrames: 300 });
      const edges = useVideoEdges(10);
      expect(edges.isStart).toBe(false);
      expect(edges.isEnd).toBe(false);
    });
  });
});
