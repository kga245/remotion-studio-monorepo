import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { loadFont } from "@remotion/google-fonts/Roboto";
import { VignetteFrame } from "../components/VignetteFrame";
import { colors, typography } from "../styles/theme";

const { fontFamily } = loadFont("normal", { weights: ["300", "400", "700"] });

const LOOP_FRAMES = 90; // restart every 3s so staff sees comparison twice

type Track = {
  label: string;
  caption: string;
  ease: (n: number) => number;
};

const TRACKS: Track[] = [
  {
    label: "Linear",
    caption: "no curve — constant velocity",
    ease: Easing.linear,
  },
  {
    label: "In (quad)",
    caption: "slow start, fast end",
    ease: Easing.in(Easing.quad),
  },
  {
    label: "Out (quad)",
    caption: "fast start, slow end",
    ease: Easing.out(Easing.quad),
  },
  {
    label: "InOut (quad)",
    caption: "ease both ends",
    ease: Easing.inOut(Easing.quad),
  },
  {
    label: "Bezier",
    caption: "custom cubic curve (0.65, 0, 0.35, 1)",
    ease: Easing.bezier(0.65, 0, 0.35, 1),
  },
];

const Lane: React.FC<{ track: Track; localFrame: number }> = ({
  track,
  localFrame,
}) => {
  const t = interpolate(localFrame, [0, 60], [0, 1], {
    extrapolateRight: "clamp",
    easing: track.ease,
  });
  const x = interpolate(t, [0, 1], [0, 100]);

  return (
    <div
      style={{
        height: 88,
        display: "flex",
        alignItems: "center",
        gap: 28,
        padding: "0 24px",
      }}
    >
      <div
        style={{
          width: 200,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            ...typography.h2,
            fontSize: 22,
            color: colors.graphite,
          }}
        >
          {track.label}
        </div>
        <div
          style={{
            fontSize: 14,
            opacity: 0.6,
            marginTop: 4,
          }}
        >
          {track.caption}
        </div>
      </div>
      <div
        style={{
          position: "relative",
          flex: 1,
          height: 32,
        }}
      >
        {/* Track */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            height: 2,
            transform: "translateY(-50%)",
            background: "rgba(53,61,80,0.10)",
          }}
        />
        {/* Endpoint */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            width: 2,
            height: 24,
            transform: "translateY(-50%)",
            background: "rgba(53,61,80,0.30)",
          }}
        />
        {/* Dot */}
        <div
          style={{
            position: "absolute",
            left: `${x}%`,
            top: "50%",
            width: 28,
            height: 28,
            marginLeft: -14,
            marginTop: -14,
            borderRadius: 14,
            background: colors.orange,
            boxShadow: `0 4px 16px ${colors.orange}55`,
          }}
        />
      </div>
    </div>
  );
};

export const EasingZoo: React.FC = () => {
  const frame = useCurrentFrame();
  const localFrame = frame % LOOP_FRAMES;

  return (
    <VignetteFrame
      beat="B · 02"
      capability="Easing curves"
      api="interpolate({ easing: Easing.* })"
    >
      <AbsoluteFill
        style={{
          fontFamily,
          padding: "32px 60px",
          color: colors.graphite,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {TRACKS.map((track, i) => (
            <Lane key={i} track={track} localFrame={localFrame} />
          ))}
        </div>
      </AbsoluteFill>
    </VignetteFrame>
  );
};
