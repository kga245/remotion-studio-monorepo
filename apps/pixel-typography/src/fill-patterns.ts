import { COLORS } from "./design";

export type FillType =
  | { kind: "solid"; color: string }
  | { kind: "hstripes"; color1: string; color2: string };

// Seeded pseudo-random number generator for deterministic fills
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Hierarchical refinement: sub-pixels INHERIT from their parent fill
// and only have a small chance of mutating to an accent.
// This keeps the overall letter color consistent while adding texture.

// Pick fill for a sub-pixel that INHERITS from its parent.
// parentFill is what the parent cell looks like. Most sub-cells keep it;
// a minority get a subtle variation.
export function pickRefinedFill(
  row: number,
  col: number,
  level: number,
  parentFill: FillType,
  primaryColor: string,
): FillType {
  const seed = row * 1000 + col * 7 + level * 31337;
  const rand = mulberry32(seed)();

  // At level 1: ~75% inherit parent, ~25% get an accent
  // At level 2: ~80% inherit parent, ~20% get an accent
  const inheritChance = level === 1 ? 0.75 : 0.8;

  if (rand < inheritChance) {
    // Keep the parent's fill — consistency preserved
    return parentFill;
  }

  // The remaining % get a subtle variation
  const accentRand = mulberry32(seed + 77777)();

  if (accentRand < 0.35) {
    // Shift to a related accent color (purple or blue)
    return { kind: "solid", color: COLORS.purple };
  } else if (accentRand < 0.6) {
    return { kind: "solid", color: COLORS.blue };
  } else if (accentRand < 0.8) {
    // Horizontal stripes using the parent's base color
    const baseColor =
      parentFill.kind === "solid" ? parentFill.color : primaryColor;
    return { kind: "hstripes", color1: baseColor, color2: COLORS.warmCream };
  } else if (accentRand < 0.92) {
    // Charcoal stripe accent
    return {
      kind: "hstripes",
      color1: COLORS.charcoal,
      color2: COLORS.warmCream,
    };
  } else {
    // Charcoal solid (small %)
    return { kind: "solid", color: COLORS.charcoal };
  }
}

// Initial fill for the coarse pixel (phase 1) — always the primary color
export function coarseFill(primaryColor: string): FillType {
  return { kind: "solid", color: primaryColor };
}

export function fillToCSS(fill: FillType): string {
  if (fill.kind === "solid") {
    return fill.color;
  }
  return `repeating-linear-gradient(0deg, ${fill.color1} 0px, ${fill.color1} 2px, ${fill.color2} 2px, ${fill.color2} 4px)`;
}
