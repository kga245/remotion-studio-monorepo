import { useCurrentFrame } from "remotion";
import {
  getLocalFrame,
  getSegmentEnd,
  isInSegment,
  type TimingSegment,
} from "@studio/timing";

/**
 * Back-compat alias for the canonical `TimingSegment` type from
 * `@studio/timing`. Existing consumers can keep referring to `SegmentConfig`.
 */
export type SegmentConfig = TimingSegment;

export interface SegmentState {
  isActive: boolean;
  localFrame: number;
  progress: number;
}

/**
 * Track state within a timing segment
 * @param segment - Segment configuration
 * @returns Segment state
 */
export function useSegment(segment: SegmentConfig): SegmentState {
  const frame = useCurrentFrame();
  const isActive = isInSegment(frame, segment);
  const localFrame = getLocalFrame(frame, segment);

  // Progress is 0 before the segment starts, 1 after it ends, and a linear
  // ramp while active. Guard against a zero-duration segment to avoid NaN.
  let progress: number;
  if (isActive) {
    progress = segment.duration > 0 ? localFrame / segment.duration : 1;
  } else if (frame >= getSegmentEnd(segment)) {
    progress = 1;
  } else {
    progress = 0;
  }

  return {
    isActive,
    localFrame,
    progress,
  };
}

/**
 * Check if current frame is within multiple segments
 * @param segments - Array of segment configurations
 * @returns Index of active segment or -1 if none
 */
export function useActiveSegment(segments: SegmentConfig[]): number {
  const frame = useCurrentFrame();
  return segments.findIndex((segment) => isInSegment(frame, segment));
}
