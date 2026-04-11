/**
 * Re-export of the canonical `TimingSegment` from `@studio/timing`.
 * The owning package is the single source of truth for this shape; this
 * re-export lets `@studio/core-types` consumers access it without taking a
 * direct dependency on `@studio/timing`.
 */
export type { TimingSegment } from "@studio/timing";
import type { TimingSegment } from "@studio/timing";

/**
 * Timeline configuration
 */
export interface TimelineConfig {
  segments: TimingSegment[];
  totalDuration: number;
}

/**
 * Frame range
 */
export interface FrameRange {
  from: number;
  to: number;
}

/**
 * Time range (in seconds)
 */
export interface TimeRange {
  from: number;
  to: number;
}
