import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCurrentFrame, useVideoConfig } from "remotion";
import {
  useDelayedMount,
  useFrameRange,
  useDelayedMountByTime,
} from "../src/useDelayedMount";

vi.mock("remotion", () => ({
  useCurrentFrame: vi.fn(),
  useVideoConfig: vi.fn(),
}));

const mockFrame = (f: number) => {
  vi.mocked(useCurrentFrame).mockReturnValue(f);
};

const mockFps = (fps: number) => {
  vi.mocked(useVideoConfig).mockReturnValue({
    fps,
    durationInFrames: 1000,
    width: 1920,
    height: 1080,
    id: "test",
    defaultProps: {},
    props: {},
    defaultCodec: "h264",
    defaultOutName: "out",
    defaultVideoImageFormat: "jpeg",
    defaultPixelFormat: "yuv420p",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any);
};

describe("useDelayedMount module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useDelayedMount", () => {
    it("is false before the start frame", () => {
      mockFrame(9);
      expect(useDelayedMount(10)).toBe(false);
    });

    it("is true at the start frame", () => {
      mockFrame(10);
      expect(useDelayedMount(10)).toBe(true);
    });

    it("is true after the start frame", () => {
      mockFrame(100);
      expect(useDelayedMount(10)).toBe(true);
    });
  });

  describe("useFrameRange", () => {
    it("is false before the range", () => {
      mockFrame(5);
      expect(useFrameRange(10, 20)).toBe(false);
    });

    it("is true inside the range", () => {
      mockFrame(15);
      expect(useFrameRange(10, 20)).toBe(true);
    });

    it("is false at the end frame (exclusive)", () => {
      mockFrame(20);
      expect(useFrameRange(10, 20)).toBe(false);
    });

    it("is false after the range", () => {
      mockFrame(25);
      expect(useFrameRange(10, 20)).toBe(false);
    });
  });

  describe("useDelayedMountByTime", () => {
    it("reads fps from useVideoConfig and converts seconds to frames", () => {
      mockFrame(29);
      mockFps(30);
      expect(useDelayedMountByTime(1)).toBe(false);

      mockFrame(30);
      mockFps(30);
      expect(useDelayedMountByTime(1)).toBe(true);
    });

    it("works with non-integer seconds", () => {
      mockFrame(45);
      mockFps(30);
      // 1.5s @ 30fps = frame 45
      expect(useDelayedMountByTime(1.5)).toBe(true);

      mockFrame(44);
      mockFps(30);
      expect(useDelayedMountByTime(1.5)).toBe(false);
    });
  });
});
