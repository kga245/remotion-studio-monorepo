import {
  useCurrentFrame,
  useVideoConfig,
  spring,
  Img,
  staticFile,
} from "remotion";
import { SPRING_CONFIG } from "../design";

export const LogoLockup: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame,
    fps,
    config: SPRING_CONFIG.smooth,
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 48,
        padding: "32px 60px 52px",
        borderTop: `1px solid rgba(255, 255, 255, 0.06)`,
        opacity: progress,
      }}
    >
      <Img
        src={staticFile("BOLAgency_White.png")}
        style={{ height: 80, objectFit: "contain" }}
      />
      <div
        style={{
          fontFamily: "sans-serif",
          fontSize: 40,
          fontWeight: 400,
          color: "rgba(255, 255, 255, 0.90)",
          lineHeight: 1,
          userSelect: "none",
        }}
      >
        ×
      </div>
      <Img
        src={staticFile("miter-logo white.png")}
        style={{ height: 72, objectFit: "contain" }}
      />
    </div>
  );
};
