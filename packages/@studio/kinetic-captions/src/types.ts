export type BrandConfig = {
  /** Primary accent color — CTAs, highlights, active word */
  accent: string;
  /** Background color for the composition */
  background: string;
  /** Primary text color */
  text: string;
  /** Secondary/muted text color (unspoken words) */
  secondary: string;
  /** Secondary accent (optional glow, highlights) */
  highlight: string;
  /** CSS font-family string (must be loaded by the app) */
  fontFamily: string;
  /** Font weights for light and bold variants */
  fontWeights: { light: string; bold: string };
};

export type PageToken = {
  text: string;
  fromMs: number;
  toMs: number;
};

export type Page = {
  startMs: number;
  tokens: PageToken[];
};
