import { useCurrentFrame, useVideoConfig } from "remotion";
import { secondsToFrames } from "@studio/timing";

/**
 * Delay mounting of a component until a specific frame
 * @param startFrame - Frame to start showing content
 * @returns True if content should be shown
 */
export function useDelayedMount(startFrame: number): boolean {
  const frame = useCurrentFrame();
  return frame >= startFrame;
}

/**
 * Show content only within a frame range
 * @param startFrame - Start frame
 * @param endFrame - End frame
 * @returns True if content should be shown
 */
export function useFrameRange(startFrame: number, endFrame: number): boolean {
  const frame = useCurrentFrame();
  return frame >= startFrame && frame < endFrame;
}

/**
 * Delay mounting based on time in seconds. `fps` is read from the current
 * Remotion video config, matching the style of `useTimeProgress`.
 * @param startSeconds - Time in seconds to start showing content
 * @returns True if content should be shown
 */
export function useDelayedMountByTime(startSeconds: number): boolean {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return frame >= secondsToFrames(startSeconds, fps);
}
