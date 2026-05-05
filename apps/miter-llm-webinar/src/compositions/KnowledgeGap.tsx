import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 9 seconds = 270 frames
// An LLM "brain" scan: some knowledge areas lit, many dark with "?"
// Shows gaps in what AI knows about MITER, then gaps fill in

const KNOWLEDGE_ITEMS = [
  { label: "Manufacturing since 1947", known: true, x: 280, y: 300, delay: 30 },
  {
    label: "Energy efficiency ratings",
    known: false,
    x: 700,
    y: 260,
    delay: 42,
  },
  { label: "Innovation leadership", known: false, x: 1180, y: 290, delay: 54 },
  { label: "Western US dominance", known: true, x: 1550, y: 320, delay: 66 },
  { label: "Dealer network", known: false, x: 360, y: 540, delay: 78 },
  { label: "Warranty story", known: false, x: 820, y: 580, delay: 90 },
  { label: "Product leadership", known: true, x: 1280, y: 550, delay: 102 },
  {
    label: "Triple-pane testing data",
    known: false,
    x: 1500,
    y: 570,
    delay: 114,
  },
];

export const KnowledgeGap: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Phase 1 (0-130): Items appear, known=green, unknown=red with "?"
  // Phase 2 (140-220): Unknown items flash and turn green (GEO fills gaps)
  // Phase 3 (220+): Bottom insight

  // GEO activation wave
  const geoWaveStart = 150;

  // Bottom insight
  const insightOpacity = interpolate(frame, [230, 255], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // "Before GEO" / "After GEO" labels
  const beforeOpacity = interpolate(frame, [70, 90], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const afterOpacity = interpolate(frame, [160, 180], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.dark,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 44,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 44,
          fontWeight: 400,
          color: COLORS.orange,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: headerOpacity,
        }}
      >
        Does AI Even Know You?
      </div>

      {/* Center brain label */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 170,
          transform: "translate(-50%, 0)",
          textAlign: "center",
          opacity: beforeOpacity,
        }}
      >
        <div
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "#ffffff",
          }}
        >
          MITER's AI Knowledge Map
        </div>
      </div>

      {/* Knowledge nodes */}
      {KNOWLEDGE_ITEMS.map((item, i) => {
        // Appear animation
        const appear = spring({
          frame: frame - item.delay,
          fps,
          config: { damping: 16, stiffness: 150 },
          durationInFrames: 30,
        });

        // If unknown, it starts red/dark and transitions to green during GEO wave
        const isKnown = item.known;
        const geoFill = isKnown
          ? 1
          : interpolate(
              frame,
              [geoWaveStart + i * 6, geoWaveStart + i * 6 + 30],
              [0, 1],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            );

        // Flash when transitioning
        const flashOpacity = !isKnown
          ? interpolate(
              frame,
              [
                geoWaveStart + i * 6,
                geoWaveStart + i * 6 + 8,
                geoWaveStart + i * 6 + 20,
              ],
              [0, 0.8, 0],
              { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
            )
          : 0;

        const nodeColor = interpolate(geoFill, [0, 1], [0, 1]);
        const greenHex = Math.round(nodeColor * 200 + 55)
          .toString(16)
          .padStart(2, "0");
        const redHex = Math.round((1 - nodeColor) * 200 + 55)
          .toString(16)
          .padStart(2, "0");
        const color = `#${redHex}${greenHex}44`;
        const borderColor = geoFill > 0.5 ? "#34d399" : "#ff4444";
        const statusIcon = geoFill > 0.5 ? "✓" : "?";
        const statusColor = geoFill > 0.5 ? "#34d399" : "#ff4444";

        return (
          <div
            key={item.label}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y,
              transform: `translate(-50%, -50%) scale(${appear})`,
            }}
          >
            {/* Flash ring */}
            <div
              style={{
                position: "absolute",
                inset: -8,
                borderRadius: 20,
                background: `radial-gradient(ellipse, #34d39944 0%, transparent 70%)`,
                opacity: flashOpacity,
              }}
            />

            {/* Node */}
            <div
              style={{
                background: color,
                border: `2px solid ${borderColor}88`,
                borderRadius: 14,
                padding: "14px 24px",
                display: "flex",
                alignItems: "center",
                gap: 14,
                minWidth: 180,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  color: statusColor,
                  width: 30,
                  textAlign: "center",
                }}
              >
                {statusIcon}
              </div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 400,
                  color: "#ffffffcc",
                  whiteSpace: "nowrap",
                }}
              >
                {item.label}
              </div>
            </div>
          </div>
        );
      })}

      {/* "After GEO" label */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 700,
          transform: "translate(-50%, 0)",
          textAlign: "center",
          opacity: afterOpacity,
        }}
      >
        <div
          style={{
            fontSize: 34,
            fontWeight: 700,
            color: "#34d399",
          }}
        >
          After GEO → Full Coverage
        </div>
        <div
          style={{
            fontSize: 26,
            fontWeight: 300,
            color: "#ffffff88",
            marginTop: 8,
          }}
        >
          Every gap becomes an opportunity to own
        </div>
      </div>

      {/* Bottom insight */}
      <div
        style={{
          position: "absolute",
          bottom: 44,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 32,
          fontWeight: 300,
          color: "#ffffffaa",
          opacity: insightOpacity,
        }}
      >
        GEO fills the gaps in what AI knows about your brand.
      </div>
    </AbsoluteFill>
  );
};
