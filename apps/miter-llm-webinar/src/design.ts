// BOL Brand Design System for Miter LLM Webinar Title Cards

// ─── Video Typography Scale ────────────────────────────────────────────────
//
// All values tuned for 1920×1080 @ typical screen/projection viewing distance.
// Rule of thumb: minimum readable in video is ~20px. Anything below 16px
// is decorative-only (uppercase tracking labels with high contrast).
//
// Usage:
//   import { TYPOGRAPHY } from "./design";
//   fontSize: TYPOGRAPHY.body
//
export const TYPOGRAPHY = {
  // Calibrated for 1920×1080 video viewed on mobile (scale factor ~0.20)
  // Rule: canvas px × 0.20 = approx rendered size on phone screen
  label: 24, // Uppercase tracking tags — readable on mobile at ~5px effective
  small: 30, // Captions, attribution, footnotes — ~6px effective on phone
  body: 36, // Bullets, descriptions, table data — ~7px effective on phone
  subhead: 48, // Card subtitles, presenter names — ~10px effective on phone
  title: 64, // Main slide titles, header bar text — ~13px effective on phone
  display: 90, // Act card titles, section headings — ~18px effective on phone
  stat: 140, // Large callout numbers — deliberately oversized
  // giant: leave inline (320, 680) — decorative background elements only
} as const;

export const COLORS = {
  dark: "#07070f",
  graphite: "#353D50",
  orange: "#F85E32",
  cyan: "#7BEDF8",
  gray: "#8B8586",
  lightGray: "#EEEEEE",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const VIDEO = {
  width: 1920,
  height: 1080,
  fps: 30,
} as const;

// Spring configs (from Remotion best practices)
export const SPRING_CONFIG = {
  snappy: { damping: 12, stiffness: 100 },
  smooth: { damping: 200 },
} as const;

// Timing helpers — all values in seconds, multiply by fps at call site
export const TIMING = {
  wordStagger: 0.2, // seconds between each word appearing
  nameStagger: 0.15, // seconds between each speaker name
  fadeInDuration: 0.5, // seconds for a simple fade
  lineDrawDuration: 0.4, // seconds for gradient line to draw
  fadeOutDuration: 1.0, // seconds for fade to black at end
} as const;
