import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  useFrameProgress,
  useTimeProgress,
  useVideoProgress,
} from "../src/useFrameProgress";

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
    durationInFrames: 100,
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

describe("useFrameProgress", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useFrameProgress", () => {
    it("returns 0 before the range", () => {
      mockFrame(-5);
      expect(useFrameProgress(0, 100)).toBe(0);
    });

    it("returns 0 at the start of the range", () => {
      mockFrame(0);
      expect(useFrameProgress(0, 100)).toBe(0);
    });

    it("returns 0.5 at the midpoint", () => {
      mockFrame(50);
      expect(useFrameProgress(0, 100)).toBe(0.5);
    });

    it("returns 1 at the end of the range", () => {
      mockFrame(100);
      expect(useFrameProgress(0, 100)).toBe(1);
    });

    it("returns 1 after the range", () => {
      mockFrame(150);
      expect(useFrameProgress(0, 100)).toBe(1);
    });
  });

  describe("useTimeProgress", () => {
    it("converts seconds to frames via fps and computes progress", () => {
      // fps=30, start=1s => frame 30, duration=2s => ends at frame 90
      mockFrame(60);
      mockConfig({ fps: 30 });
      expect(useTimeProgress(1, 2)).toBe(0.5);
    });

    it("returns 0 before the time range", () => {
      mockFrame(10);
      mockConfig({ fps: 30 });
      expect(useTimeProgress(1, 2)).toBe(0);
    });

    it("returns 1 after the time range", () => {
      mockFrame(200);
      mockConfig({ fps: 30 });
      expect(useTimeProgress(1, 2)).toBe(1);
    });
  });

  describe("useVideoProgress", () => {
    it("returns 0 at frame 0", () => {
      mockFrame(0);
      mockConfig({ durationInFrames: 100 });
      expect(useVideoProgress()).toBe(0);
    });

    it("returns 0.5 halfway through the video", () => {
      mockFrame(50);
      mockConfig({ durationInFrames: 100 });
      expect(useVideoProgress()).toBe(0.5);
    });

    it("returns 1 at the last frame", () => {
      mockFrame(100);
      mockConfig({ durationInFrames: 100 });
      expect(useVideoProgress()).toBe(1);
    });
  });
});
