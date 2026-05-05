import { useCurrentFrame, useVideoConfig, spring } from "remotion";
import { SPRING_CONFIG, TIMING } from "../design";

type WordStyle = {
  text: string;
  color?: string;
  fontWeight?: number;
};

type StaggeredWordsProps = {
  words: WordStyle[];
  fontSize?: number;
  defaultColor?: string;
};

export const StaggeredWords: React.FC<StaggeredWordsProps> = ({
  words,
  fontSize = 72,
  defaultColor = "#FFFFFF",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "baseline",
        flexWrap: "wrap",
        gap: `0 ${fontSize * 0.2}px`,
      }}
    >
      {words.map((word, i) => {
        const delay = i * TIMING.wordStagger * fps;
        const progress = spring({
          frame,
          fps,
          config: SPRING_CONFIG.snappy,
          delay,
        });

        return (
          <span
            key={i}
            style={{
              fontFamily:
                "'Neue Haas Grotesk Display', 'Helvetica Neue', system-ui, sans-serif",
              fontSize,
              fontWeight: word.fontWeight ?? 700,
              color: word.color ?? defaultColor,
              letterSpacing: -1,
              opacity: progress,
            }}
          >
            {word.text}
          </span>
        );
      })}
    </div>
  );
};
