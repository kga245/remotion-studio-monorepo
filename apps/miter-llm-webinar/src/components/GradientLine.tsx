import { useCurrentFrame, useVideoConfig, interpolate, Easing } from "remotion";
import { COLORS, TIMING } from "../design";

export const GradientLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const width = interpolate(
    frame,
    [0, TIMING.lineDrawDuration * fps],
    [0, 80],
    { extrapolateRight: "clamp", easing: Easing.out(Easing.quad) },
  );

  return (
    <div
      style={{
        width,
        height: 3,
        background: `linear-gradient(to right, ${COLORS.orange}, ${COLORS.cyan})`,
        borderRadius: 2,
        margin: "0 auto",
      }}
    />
  );
};
