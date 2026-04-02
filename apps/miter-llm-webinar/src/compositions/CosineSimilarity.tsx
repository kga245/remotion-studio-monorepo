import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 9 seconds = 270 frames
// Turkey (country) vs Turkey (animal) — cosine similarity in 2D vector space

export const CosineSimilarity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Title
  const titleOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  // Axes draw in
  const axesProgress = interpolate(frame, [15, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  // "Turkey (word)" label at origin
  const wordOpacity = interpolate(frame, [45, 70], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Country vector arrow springs out
  const countryArrow = spring({
    frame: frame - 70,
    fps,
    config: { damping: 18, stiffness: 150 },
    durationInFrames: 40,
  });

  // Animal vector arrow springs out
  const animalArrow = spring({
    frame: frame - 100,
    fps,
    config: { damping: 18, stiffness: 150 },
    durationInFrames: 40,
  });

  // Labels for vectors
  const countryLabelOpacity = interpolate(frame, [100, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const animalLabelOpacity = interpolate(frame, [120, 145], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Angle label
  const angleOpacity = interpolate(frame, [145, 175], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Bottom insight
  const insightOpacity = interpolate(frame, [190, 220], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cx = 960;
  const cy = 580;
  const GRID_SIZE = 320;

  // Country vector direction (upper right — geopolitics, culture)
  const countryAngle = -35; // degrees from positive x
  const countryLength = GRID_SIZE * countryArrow;
  const countryRad = (countryAngle * Math.PI) / 180;
  const cx2 = cx + Math.cos(countryRad) * countryLength;
  const cy2 = cy + Math.sin(countryRad) * countryLength;

  // Animal vector direction (lower right — food, nature)
  const animalAngle = 40;
  const animalLength = GRID_SIZE * animalArrow;
  const animalRad = (animalAngle * Math.PI) / 180;
  const ax2 = cx + Math.cos(animalRad) * animalLength;
  const ay2 = cy + Math.sin(animalRad) * animalLength;

  // Axis extents
  const axisLength = GRID_SIZE * 1.1 * axesProgress;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.dark,
        fontFamily,
        overflow: "hidden",
      }}
    >
      {/* Title */}
      <div
        style={{
          position: "absolute",
          top: 52,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 26,
          fontWeight: 400,
          color: COLORS.orange,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          opacity: titleOpacity,
        }}
      >
        Why Context Matters to LLMs — Vector Space
      </div>

      <svg
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        viewBox="0 0 1920 1080"
      >
        {/* Grid dots */}
        {axesProgress > 0.3 &&
          [-3, -2, -1, 1, 2, 3].flatMap((xi) =>
            [-3, -2, -1, 1, 2, 3].map((yi) => (
              <circle
                key={`${xi},${yi}`}
                cx={cx + xi * 90}
                cy={cy + yi * 90}
                r={2}
                fill={`${COLORS.graphite}66`}
              />
            )),
          )}

        {/* X axis */}
        <line
          x1={cx - axisLength}
          y1={cy}
          x2={cx + axisLength}
          y2={cy}
          stroke={`${COLORS.graphite}88`}
          strokeWidth={1}
        />
        {/* Y axis */}
        <line
          x1={cx}
          y1={cy - axisLength}
          x2={cx}
          y2={cy + axisLength}
          stroke={`${COLORS.graphite}88`}
          strokeWidth={1}
        />

        {/* Country vector (orange) */}
        {countryArrow > 0.05 && (
          <>
            <line
              x1={cx}
              y1={cy}
              x2={cx2}
              y2={cy2}
              stroke={COLORS.orange}
              strokeWidth={3}
            />
            <polygon
              points={`
                ${cx2},${cy2}
                ${cx2 - 14 * Math.cos(countryRad - 0.4)},${cy2 - 14 * Math.sin(countryRad - 0.4)}
                ${cx2 - 14 * Math.cos(countryRad + 0.4)},${cy2 - 14 * Math.sin(countryRad + 0.4)}
              `}
              fill={COLORS.orange}
            />
          </>
        )}

        {/* Animal vector (cyan) */}
        {animalArrow > 0.05 && (
          <>
            <line
              x1={cx}
              y1={cy}
              x2={ax2}
              y2={ay2}
              stroke={COLORS.cyan}
              strokeWidth={3}
            />
            <polygon
              points={`
                ${ax2},${ay2}
                ${ax2 - 14 * Math.cos(animalRad - 0.4)},${ay2 - 14 * Math.sin(animalRad - 0.4)}
                ${ax2 - 14 * Math.cos(animalRad + 0.4)},${ay2 - 14 * Math.sin(animalRad + 0.4)}
              `}
              fill={COLORS.cyan}
            />
          </>
        )}

        {/* Angle arc */}
        {angleOpacity > 0.1 && (
          <>
            <path
              d={`M ${cx + 60 * Math.cos(countryRad)} ${cy + 60 * Math.sin(countryRad)} A 60 60 0 0 1 ${cx + 60 * Math.cos(animalRad)} ${cy + 60 * Math.sin(animalRad)}`}
              stroke="#ffffff44"
              strokeWidth={1.5}
              fill="none"
              opacity={angleOpacity}
            />
            <text
              x={cx + 80}
              y={cy + 30}
              fill="#ffffff88"
              fontSize={20}
              fontFamily={fontFamily}
              opacity={angleOpacity}
            >
              {Math.round(animalAngle - countryAngle)}°
            </text>
          </>
        )}

        {/* Origin dot */}
        <circle cx={cx} cy={cy} r={8} fill={`${COLORS.graphite}`} opacity={axesProgress} />
      </svg>

      {/* Word origin label */}
      <div
        style={{
          position: "absolute",
          left: cx - 110,
          top: cy + 18,
          fontSize: 22,
          fontWeight: 700,
          color: "#ffffff88",
          opacity: wordOpacity,
          background: `${COLORS.dark}cc`,
          padding: "4px 12px",
          borderRadius: 4,
          border: `1px solid ${COLORS.graphite}44`,
        }}
      >
        "turkey"
      </div>

      {/* Country vector label */}
      <div
        style={{
          position: "absolute",
          left: cx + Math.cos(countryRad) * GRID_SIZE + 20,
          top: cy + Math.sin(countryRad) * GRID_SIZE - 40,
          opacity: countryLabelOpacity,
          background: `${COLORS.orange}22`,
          border: `1px solid ${COLORS.orange}`,
          borderRadius: 8,
          padding: "12px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div style={{ fontSize: 28, lineHeight: 1 }}>🇹🇷</div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.orange,
          }}
        >
          Turkey (Country)
        </div>
        <div
          style={{ fontSize: 16, fontWeight: 300, color: "#ffffff88" }}
        >
          Ankara · Bosphorus · Lira
        </div>
      </div>

      {/* Animal vector label */}
      <div
        style={{
          position: "absolute",
          left: cx + Math.cos(animalRad) * GRID_SIZE + 20,
          top: cy + Math.sin(animalRad) * GRID_SIZE - 20,
          opacity: animalLabelOpacity,
          background: `${COLORS.cyan}22`,
          border: `1px solid ${COLORS.cyan}`,
          borderRadius: 8,
          padding: "12px 20px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div style={{ fontSize: 28, lineHeight: 1 }}>🦃</div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: COLORS.cyan,
          }}
        >
          Turkey (Bird)
        </div>
        <div
          style={{ fontSize: 16, fontWeight: 300, color: "#ffffff88" }}
        >
          Thanksgiving · Feathers · Farm
        </div>
      </div>

      {/* Bottom insight */}
      <div
        style={{
          position: "absolute",
          bottom: 52,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 26,
          fontWeight: 300,
          color: "#ffffffaa",
          opacity: insightOpacity,
        }}
      >
        Same word, completely different vector neighborhoods — context determines meaning.
      </div>
    </AbsoluteFill>
  );
};
