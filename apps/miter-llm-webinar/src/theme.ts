import { loadFont } from "@remotion/google-fonts/Roboto";
import type { BrandConfig } from "@studio/kinetic-captions";
import { bolBrand } from "@studio/kinetic-captions";

export const { fontFamily } = loadFont("normal", {
  weights: ["300", "400", "700", "900"],
  subsets: ["latin"],
});

export const COLORS = {
  orange: "#F85E32",
  cyan: "#7BEDF8",
  teal: "#7BEDF8",
  dark: "#07070f",
  graphite: "#353D50",
} as const;

export const brand: BrandConfig = {
  ...bolBrand,
  fontFamily,
};
