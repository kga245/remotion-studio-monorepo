import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCurrentFrame } from "remotion";
import { useSegment, useActiveSegment } from "../src/useSegment";

vi.mock("remotion", () => ({
  useCurrentFrame: vi.fn(),
  useVideoConfig: vi.fn(),
}));

const mockFrame = (f: number) => {
  vi.mocked(useCurrentFrame).mockReturnValue(f);
};

describe("useSegment", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useSegment", () => {
    const segment = { start: 10, duration: 20 }; // active frames [10, 30)

    it("is inactive before the segment starts, progress 0", () => {
      mockFrame(5);
      const state = useSegment(segment);
      expect(state.isActive).toBe(false);
      expect(state.localFrame).toBe(-1);
      expect(state.progress).toBe(0);
    });

    it("is active at the start with progress 0", () => {
      mockFrame(10);
      const state = useSegment(segment);
      expect(state.isActive).toBe(true);
      expect(state.localFrame).toBe(0);
      expect(state.progress).toBe(0);
    });

    it("is active mid-segment with fractional progress", () => {
      mockFrame(20);
      const state = useSegment(segment);
      expect(state.isActive).toBe(true);
      expect(state.localFrame).toBe(10);
      expect(state.progress).toBe(0.5);
    });

    it("is inactive past the segment, progress 1", () => {
      mockFrame(50);
      const state = useSegment(segment);
      expect(state.isActive).toBe(false);
      expect(state.localFrame).toBe(-1);
      expect(state.progress).toBe(1);
    });

    it("handles a zero-duration segment without NaN", () => {
      mockFrame(10);
      const state = useSegment({ start: 10, duration: 0 });
      expect(Number.isNaN(state.progress)).toBe(false);
    });
  });

  describe("useActiveSegment", () => {
    const segments = [
      { start: 0, duration: 10 },
      { start: 10, duration: 10 },
      { start: 20, duration: 10 },
    ];

    it("returns the index of the active segment", () => {
      mockFrame(5);
      expect(useActiveSegment(segments)).toBe(0);
      mockFrame(15);
      expect(useActiveSegment(segments)).toBe(1);
      mockFrame(25);
      expect(useActiveSegment(segments)).toBe(2);
    });

    it("returns -1 when no segment matches", () => {
      mockFrame(100);
      expect(useActiveSegment(segments)).toBe(-1);
    });
  });
});
