// K-State Side Car brand palette adapted for pixel typography
export const COLORS = {
  orange: "#ff6234",
  purple: "#ab4ff6",
  blue: "#3c78d8",
  charcoal: "#202124",
  warmCream: "#e8e4de",
  gridLine: "#d5d0ca",
  white: "#ffffff",
  coral: "#ff5f79",
} as const;

export const VIDEO = {
  width: 1080,
  height: 1350,
  fps: 30,
} as const;

// Timing in frames (at 30fps) — total ~9 seconds / 270 frames
export const TIMING = {
  // Phase 1: Cursor draws coarse pixels letter by letter
  typingStart: 0,
  typingEnd: 90, // 3 seconds

  // Brief hold after typing completes
  holdStart: 90,
  holdEnd: 100, // ~0.3 seconds

  // Phase 2: First refinement pass (2x2 subdivision)
  refine1Start: 100,
  refine1End: 175, // 2.5 seconds

  // Phase 3: Second refinement pass (4x4 subdivision)
  refine2Start: 175,
  refine2End: 240, // ~2.2 seconds

  // Final hold
  finalHoldStart: 240,
  finalEnd: 270, // 1 second hold
} as const;

export const TOTAL_FRAMES = TIMING.finalEnd;

// Character grid dimensions (each letter is 5 wide x 7 tall in coarse pixels)
export const CHAR_GRID = {
  charWidth: 5,
  charHeight: 7,
  charGap: 1, // 1 coarse pixel gap between letters
} as const;
