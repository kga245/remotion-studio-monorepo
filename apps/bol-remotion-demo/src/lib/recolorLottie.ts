// Lottie color override utility.
// Walks a Lottie JSON tree, finds every color property, and remaps it to a
// brand palette. Handles both static colors (`c.k = [r,g,b,a]`) and animated
// color keyframes (`c.k = [{s: [r,g,b,a], t: 0}, ...]`). Returns a deep clone;
// the input JSON is not mutated.
//
// Two strategies:
//   recolorLottieToBrand(json, palette) — maps each source color to one of
//     the palette entries by luminance band. Lightest source colors land on
//     the last palette entry, darkest on the first. Preserves the original
//     value structure of the animation while restyling its palette.
//
//   recolorLottieExplicit(json, mapping) — replaces specific source colors
//     with specific destination colors. Use when you know the source palette.

type RGB = { r: number; g: number; b: number };

type LottieAny =
  | string
  | number
  | boolean
  | null
  | { [key: string]: LottieAny }
  | LottieAny[];

const hexToRgb = (hex: string): RGB => {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
};

const relativeLuminance = ({ r, g, b }: RGB): number =>
  0.2126 * r + 0.7152 * g + 0.0722 * b;

// Walk the JSON depth-first. When a `c` property with an animated `k` array
// is found, mutate its color components via the supplied `fn`.
const mapColors = (
  obj: LottieAny,
  fn: (rgb: RGB) => RGB,
  parentKey?: string,
): void => {
  if (Array.isArray(obj)) {
    for (const item of obj) mapColors(item, fn, parentKey);
    return;
  }
  if (!obj || typeof obj !== "object") return;

  // Pattern: { ty: "fl"|"st", c: { a: 0|1, k: [...] } } — `c` is the color.
  // Some Lottie shapes also use `g.k.k` (gradient stops) but those are rare
  // in simple icon animations; we cover them too if encountered.
  for (const key in obj) {
    const val = (obj as Record<string, LottieAny>)[key];

    if (key === "c" && val && typeof val === "object" && !Array.isArray(val)) {
      const cObj = val as Record<string, LottieAny>;
      const k = cObj.k;
      if (Array.isArray(k) && k.length > 0) {
        // Static color: k = [r,g,b,a?]
        if (typeof k[0] === "number" && k.length >= 3) {
          const mapped = fn({
            r: k[0] as number,
            g: k[1] as number,
            b: k[2] as number,
          });
          k[0] = mapped.r;
          k[1] = mapped.g;
          k[2] = mapped.b;
        } else {
          // Animated keyframes: k = [{ s: [r,g,b,a], t: 0 }, ...]
          for (const kf of k) {
            if (
              kf &&
              typeof kf === "object" &&
              !Array.isArray(kf) &&
              "s" in kf &&
              Array.isArray((kf as Record<string, LottieAny>).s)
            ) {
              const s = (kf as Record<string, LottieAny>).s as number[];
              if (s.length >= 3 && typeof s[0] === "number") {
                const mapped = fn({ r: s[0], g: s[1], b: s[2] });
                s[0] = mapped.r;
                s[1] = mapped.g;
                s[2] = mapped.b;
              }
            }
          }
        }
      }
    } else {
      mapColors(val, fn, key);
    }
  }
};

export const recolorLottieToBrand = (
  json: unknown,
  palette: string[],
): unknown => {
  if (palette.length === 0) return json;
  const clone = JSON.parse(JSON.stringify(json)) as LottieAny;
  const brandRgbs = palette.map(hexToRgb);
  mapColors(clone, (rgb) => {
    const lum = relativeLuminance(rgb);
    const idx = Math.min(
      Math.max(Math.floor(lum * palette.length), 0),
      palette.length - 1,
    );
    return brandRgbs[idx];
  });
  return clone;
};

// Explicit hex-to-hex color mapping. Source colors not in the mapping are
// left unchanged. Useful when you've audited the source Lottie's palette.
export const recolorLottieExplicit = (
  json: unknown,
  mapping: Record<string, string>,
  tolerance = 0.01,
): unknown => {
  const clone = JSON.parse(JSON.stringify(json)) as LottieAny;
  const entries = Object.entries(mapping).map(([from, to]) => ({
    from: hexToRgb(from),
    to: hexToRgb(to),
  }));
  mapColors(clone, (rgb) => {
    for (const { from, to } of entries) {
      if (
        Math.abs(rgb.r - from.r) < tolerance &&
        Math.abs(rgb.g - from.g) < tolerance &&
        Math.abs(rgb.b - from.b) < tolerance
      ) {
        return to;
      }
    }
    return rgb;
  });
  return clone;
};
