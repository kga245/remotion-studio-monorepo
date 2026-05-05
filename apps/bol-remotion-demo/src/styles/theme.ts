// BOL Agency brand tokens.
// Source of truth: BOL brand guidelines (Graphite, Orange, Cyan core palette).
// When licensed Neue Haas Grotesk is hosted, swap the font import in scenes.

export const colors = {
  // Primary palette
  graphite: "#353D50",
  orange: "#F85E32",
  cyan: "#7BEDF8",
  gray: "#8B8586",
  lightGray: "#EEEEEE",
  white: "#FFFFFF",

  // Secondary palette — illustrations only, use sparingly
  yellow: "#EEFF41",
  lime: "#B0F436",
  green: "#319829",
  blue: "#0070E0",
  red: "#FF0000",
  purple: "#9900FF",
  magenta: "#DC2BDC",
  pink: "#FCC8DB",
} as const;

export const semantic = {
  textOnLight: colors.graphite,
  textOnDark: colors.white,
  textSecondary: colors.gray,
  accent: colors.orange,
  accentSecondary: colors.cyan,
  bgLight: colors.lightGray,
  bgDark: colors.graphite,
  bgWhite: colors.white,
} as const;

// Brand requires sentence case for headlines, ALL CAPS thin for subtitles, no italics.
export const typography = {
  h1: {
    fontWeight: 700,
    lineHeight: 1.05,
    letterSpacing: "-0.02em",
  },
  h2: {
    fontWeight: 300,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },
  body: {
    fontWeight: 400,
    lineHeight: 1.4,
  },
} as const;

// Base sizes assume 1080p. Scale per scene if you change canvas size.
export const sizes = {
  display: 144,
  h1: 96,
  h2: 36,
  body: 28,
  caption: 18,
} as const;

// Spring presets — pass directly to remotion's spring({ config }).
export const springs = {
  snappy: { damping: 200, stiffness: 200, mass: 0.6 },
  smooth: { damping: 200, stiffness: 100, mass: 1 },
  bouncy: { damping: 12, stiffness: 200, mass: 1 },
} as const;

// Common timing tokens in frames at 30fps.
export const beats = {
  enterShort: 12,
  enterMedium: 18,
  enterLong: 30,
  hold: 60,
} as const;
