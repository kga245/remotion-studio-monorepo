import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
} from "remotion";
import { fontFamily } from "../theme";
import { COLORS, SPRING_CONFIG, TYPOGRAPHY } from "../design";
import { FadeWrapper } from "../components/FadeWrapper";

// ─── MiterGEOAudit ────────────────────────────────────────────────────────────
//
// Section intro for the live GEO audit segment.
// 12s (360 frames): headline → cyan rule → presenter → three brands stagger in.

const BRANDS = [
  "Milgard GEO Performance",
  "PGT Windows GEO Performance",
  "MI Windows GEO Performance",
];

export const MiterGEOAudit: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = (delay: number, cfg = SPRING_CONFIG.snappy) =>
    spring({ frame, fps, config: cfg, delay: delay * fps });

  // Headline
  const titleP = s(0.2, { damping: 18, stiffness: 70 });
  const titleY = interpolate(titleP, [0, 1], [24, 0]);

  // Cyan rule draws across
  const lineP = s(1.0);
  const lineW = interpolate(lineP, [0, 1], [0, 560]);

  // Presenter credit
  const bylineP = s(1.4);

  // Brand items
  const b1P = s(2.2, { damping: 16, stiffness: 80 });
  const b1Y = interpolate(b1P, [0, 1], [18, 0]);
  const b2P = s(3.1, { damping: 16, stiffness: 80 });
  const b2Y = interpolate(b2P, [0, 1], [18, 0]);
  const b3P = s(4.0, { damping: 16, stiffness: 80 });
  const b3Y = interpolate(b3P, [0, 1], [18, 0]);

  const brandAnims = [
    { p: b1P, y: b1Y },
    { p: b2P, y: b2Y },
    { p: b3P, y: b3Y },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.dark }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.5}>
        <AbsoluteFill>
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 120,
              right: 120,
              transform: "translateY(-50%)",
            }}
          >
            {/* Headline */}
            <div
              style={{
                fontFamily,
                fontSize: 96,
                fontWeight: 900,
                color: COLORS.white,
                letterSpacing: -3,
                lineHeight: 1.0,
                opacity: titleP,
                transform: `translateY(${titleY}px)`,
                marginBottom: 44,
              }}
            >
              MITER GEO
              <br />
              <span style={{ color: COLORS.white, fontWeight: 900 }}>
                performance audit
              </span>
            </div>

            {/* Cyan rule */}
            <div
              style={{
                width: lineW,
                height: 3,
                background: COLORS.cyan,
                borderRadius: 2,
                marginBottom: 28,
              }}
            />

            {/* Presenter */}
            <div
              style={{
                fontFamily,
                fontSize: TYPOGRAPHY.body,
                fontWeight: 400,
                color: COLORS.cyan,
                letterSpacing: 0.5,
                marginBottom: 44,
                opacity: bylineP,
              }}
            >
              Catfish Comstock&nbsp;&nbsp;·&nbsp;&nbsp;BOL Agency
            </div>

            {/* Brand items */}
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {BRANDS.map((brand, i) => (
                <div
                  key={brand}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 20,
                    opacity: brandAnims[i].p,
                    transform: `translateY(${brandAnims[i].y}px)`,
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: COLORS.cyan,
                      flexShrink: 0,
                      opacity: 0.6,
                    }}
                  />
                  <span
                    style={{
                      fontFamily,
                      fontSize: TYPOGRAPHY.subhead,
                      fontWeight: 700,
                      color: COLORS.white,
                      letterSpacing: 1,
                      textTransform: "uppercase" as const,
                    }}
                  >
                    {brand}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};
