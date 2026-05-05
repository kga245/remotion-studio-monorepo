import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS, fontFamily } from "../theme";

// 8 seconds = 240 frames
// Which LLMs prefer which content formats

const PAIRINGS = [
  {
    llm: "Gemini",
    llmColor: "#4285F4",
    content: "YouTube / Video",
    contentColor: "#FF0000",
    delay: 30,
    note: "Natively multimodal, trained on YouTube",
  },
  {
    llm: "ChatGPT",
    llmColor: "#10A37F",
    content: "Reddit / Forums",
    contentColor: "#FF4500",
    delay: 65,
    note: "Trained heavily on community discussions",
  },
  {
    llm: "Perplexity",
    llmColor: "#20B8CD",
    content: "News / Structured Data",
    contentColor: "#6B7280",
    delay: 100,
    note: "Real-time web focus, cites sources",
  },
  {
    llm: "Claude",
    llmColor: "#D97706",
    content: "Long-form / Technical Docs",
    contentColor: "#8B5CF6",
    delay: 135,
    note: "Strong on depth, nuance, reasoning",
  },
];

type PairingRowProps = (typeof PAIRINGS)[0];

const PairingRow: React.FC<PairingRowProps> = ({
  llm,
  llmColor,
  content,
  contentColor,
  delay,
  note,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const leftProgress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 20, stiffness: 160 },
    durationInFrames: 30,
  });

  const lineProgress = interpolate(frame, [delay + 20, delay + 45], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });

  const rightProgress = spring({
    frame: frame - (delay + 30),
    fps,
    config: { damping: 20, stiffness: 160 },
    durationInFrames: 30,
  });

  const noteOpacity = interpolate(frame, [delay + 45, delay + 65], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 0,
        width: "100%",
      }}
    >
      {/* LLM pill */}
      <div
        style={{
          width: 260,
          padding: "14px 24px",
          background: `${llmColor}22`,
          border: `2px solid ${llmColor}`,
          borderRadius: 8,
          fontSize: 26,
          fontWeight: 700,
          color: llmColor,
          textAlign: "center",
          transform: `translateX(${interpolate(leftProgress, [0, 1], [-60, 0])}px)`,
          opacity: interpolate(leftProgress, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          }),
          flexShrink: 0,
        }}
      >
        {llm}
      </div>

      {/* Connecting line */}
      <div
        style={{
          flex: 1,
          height: 2,
          background: `linear-gradient(90deg, ${llmColor}66, ${contentColor}66)`,
          transformOrigin: "left center",
          transform: `scaleX(${lineProgress})`,
          position: "relative",
        }}
      >
        {/* Arrow head */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 0,
            height: 0,
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderLeft: `10px solid ${contentColor}88`,
            opacity: lineProgress,
          }}
        />
      </div>

      {/* Content type pill */}
      <div
        style={{
          width: 300,
          padding: "14px 24px",
          background: `${contentColor}22`,
          border: `2px solid ${contentColor}66`,
          borderRadius: 8,
          fontSize: 26,
          fontWeight: 700,
          color: "#ffffffcc",
          textAlign: "center",
          transform: `translateX(${interpolate(rightProgress, [0, 1], [60, 0])}px)`,
          opacity: interpolate(rightProgress, [0, 0.3], [0, 1], {
            extrapolateRight: "clamp",
          }),
          flexShrink: 0,
        }}
      >
        {content}
      </div>

      {/* Note */}
      <div
        style={{
          width: 340,
          paddingLeft: 24,
          fontSize: 22,
          fontWeight: 300,
          color: "#ffffff55",
          lineHeight: 1.4,
          opacity: noteOpacity,
          flexShrink: 0,
        }}
      >
        {note}
      </div>
    </div>
  );
};

export const ContentPerLLM: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateRight: "clamp",
  });
  const bottomOpacity = interpolate(frame, [185, 215], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.dark,
        fontFamily,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "60px 100px",
        gap: 40,
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "absolute",
          top: 52,
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
        Content Affinity by LLM
      </div>

      {/* Pairings */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 32,
          width: "100%",
          marginTop: 20,
        }}
      >
        {PAIRINGS.map((p) => (
          <PairingRow key={p.llm} {...p} />
        ))}
      </div>

      {/* Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 52,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 30,
          fontWeight: 300,
          color: "#ffffffaa",
          opacity: bottomOpacity,
        }}
      >
        Different models. Different diets. Match your content to the model
        you're targeting.
      </div>
    </AbsoluteFill>
  );
};
