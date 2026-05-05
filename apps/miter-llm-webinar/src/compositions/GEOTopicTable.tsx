import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from "remotion";
import { fontFamily } from "../theme";
import { COLORS, SPRING_CONFIG } from "../design";
import { FadeWrapper } from "../components/FadeWrapper";

// ─── Design tokens ────────────────────────────────────────────────────────────

const BG = COLORS.dark;
const PLATFORM_COLORS = {
  chatgpt: "#22C55E",
  aio: "#6366F1",
  aim: COLORS.orange,
};

// ─── Local font sizes — data-dense table, intentionally smaller than global TYPOGRAPHY ───
const TBL = {
  headerTitle: 42, // orange header title (was TYPOGRAPHY.subhead=48)
  headerBadge: 14, // right-side badge
  subtitle: 16, // "200 prompts · 5 topics..." line
  legend: 14, // ChatGPT / AI Overviews / AI Mode labels
  colHeader: 14, // GPT M%, AIO C% etc
  topicName: 20, // topic names in col 0 (was TYPOGRAPHY.small=30)
  dataCell: 24, // % data values (was TYPOGRAPHY.body=36)
  statNum: 38, // stat pill numbers (was TYPOGRAPHY.subhead=48)
  statLabel: 13, // stat pill labels
  note: 17, // analysis note text
  bol: 22,
};

// ─── Column layout ────────────────────────────────────────────────────────────

const COL_LEFT = 60;
const ROW_HEIGHT = 68; // data-dense layout
const TABLE_TOP = 212; // data-dense layout

const COLS = [
  { label: "Topic", key: "topic", w: 240, align: "left" as const },
  { label: "Prompts", key: "prompts", w: 90, align: "center" as const },
  { label: "GPT M%", key: "gptM", w: 110, align: "center" as const },
  { label: "GPT C%", key: "gptC", w: 110, align: "center" as const },
  { label: "AIO M%", key: "aioM", w: 110, align: "center" as const },
  { label: "AIO C%", key: "aioC", w: 110, align: "center" as const },
  { label: "AIM M%", key: "aimM", w: 110, align: "center" as const },
  { label: "AIM C%", key: "aimC", w: 110, align: "center" as const },
  { label: "Mention%", key: "mention", w: 125, align: "center" as const },
];

function colLeft(i: number): number {
  let x = COL_LEFT;
  for (let j = 0; j < i; j++) x += COLS[j].w;
  return x;
}

// ─── Platform column-color helper ─────────────────────────────────────────────

function metricColor(key: string): string {
  if (key.startsWith("gpt")) return PLATFORM_COLORS.chatgpt;
  if (key.startsWith("aio")) return PLATFORM_COLORS.aio;
  if (key.startsWith("aim")) return PLATFORM_COLORS.aim;
  return COLORS.cyan;
}

// ─── Row types ────────────────────────────────────────────────────────────────

type TopicRow = {
  topic: string;
  prompts: number;
  gptM: number;
  gptC: number;
  aioM: number;
  aioC: number;
  aimM: number;
  aimC: number;
  mention: number;
  isHeader?: boolean;
};

type AnalysisStat = {
  label: string;
  value: string;
  color: string;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const TableHeader: React.FC<{ progress: number }> = ({ progress }) => {
  const translateY = interpolate(progress, [0, 1], [-10, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: TABLE_TOP - 50,
        left: COL_LEFT,
        right: COL_LEFT,
        height: 50,
        background: "rgba(255,255,255,0.06)",
        borderBottom: `2px solid ${COLORS.orange}`,
        opacity: progress,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {COLS.map((col, i) => (
        <div
          key={col.key}
          style={{
            position: "absolute",
            left: colLeft(i) - COL_LEFT,
            width: col.w,
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: col.align === "center" ? "center" : "flex-start",
            paddingLeft: col.align === "left" ? 14 : 0,
          }}
        >
          <span
            style={{
              fontFamily: fontFamily,
              fontSize: TBL.colHeader,
              fontWeight: 700,
              color:
                metricColor(col.key) === COLORS.cyan
                  ? COLORS.white
                  : metricColor(col.key),
              letterSpacing: 1.8,
              textTransform: "uppercase",
              opacity:
                col.key.startsWith("gpt") ||
                col.key.startsWith("aio") ||
                col.key.startsWith("aim")
                  ? 1
                  : 0.65,
            }}
          >
            {col.label}
          </span>
        </div>
      ))}
    </div>
  );
};

const DataRow: React.FC<{
  row: TopicRow;
  rowIndex: number;
  progress: number;
}> = ({ row, rowIndex, progress }) => {
  const isAll = row.topic === "All Topics";
  const translateY = interpolate(progress, [0, 1], [8, 0]);
  const bg = isAll
    ? "rgba(248, 94, 50, 0.10)"
    : rowIndex % 2 === 0
      ? "rgba(255,255,255,0.02)"
      : "transparent";

  return (
    <div
      style={{
        position: "absolute",
        top: TABLE_TOP + rowIndex * ROW_HEIGHT,
        left: COL_LEFT,
        right: COL_LEFT,
        height: ROW_HEIGHT,
        background: bg,
        borderBottom: `1px solid rgba(255,255,255,0.05)`,
        borderLeft: isAll ? `3px solid ${COLORS.orange}` : "none",
        opacity: progress,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {COLS.map((col, ci) => {
        const val = row[col.key as keyof TopicRow] as string | number;
        const isNumeric =
          typeof val === "number" ||
          (typeof val === "string" && !isNaN(Number(val)));
        const color =
          ci === 0
            ? isAll
              ? COLORS.orange
              : COLORS.white
            : metricColor(col.key) !== COLORS.cyan
              ? metricColor(col.key)
              : COLORS.white;

        return (
          <div
            key={col.key}
            style={{
              position: "absolute",
              left: colLeft(ci) - COL_LEFT,
              width: col.w,
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: col.align === "center" ? "center" : "flex-start",
              paddingLeft: col.align === "left" ? (isAll ? 11 : 14) : 0,
            }}
          >
            <span
              style={{
                fontFamily: fontFamily,
                fontSize: ci === 0 ? TBL.topicName : TBL.dataCell,
                fontWeight: ci === 0 ? (isAll ? 700 : 400) : 600,
                color,
                letterSpacing: ci === 0 ? 0.2 : -0.3,
                opacity: ci === 0 ? 1 : 0.9,
              }}
            >
              {ci === 0 ? String(val) : isNumeric ? `${val}%` : String(val)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const AnalysisSection: React.FC<{
  stats: AnalysisStat[];
  note: string;
  progress: number;
  rowCount: number;
}> = ({ stats, note, progress, rowCount }) => {
  const top = TABLE_TOP + rowCount * ROW_HEIGHT + 32;
  const translateY = interpolate(progress, [0, 1], [12, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top,
        left: COL_LEFT,
        right: COL_LEFT,
        opacity: progress,
        transform: `translateY(${translateY}px)`,
      }}
    >
      {/* Stat pills */}
      <div style={{ display: "flex", gap: 20, marginBottom: 18 }}>
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.05)",
              borderTop: `3px solid ${s.color}`,
              padding: "12px 20px",
              minWidth: 200,
            }}
          >
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: TBL.statNum,
                fontWeight: 700,
                color: s.color,
                letterSpacing: -1,
                marginBottom: 4,
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: fontFamily,
                fontSize: TBL.statLabel,
                fontWeight: 600,
                color: COLORS.gray,
                letterSpacing: 1.5,
                textTransform: "uppercase",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
      {/* Note */}
      <div
        style={{
          background: "rgba(0,0,0,0.25)",
          borderLeft: `4px solid ${COLORS.cyan}`,
          padding: "14px 22px",
        }}
      >
        <span
          style={{
            fontFamily: fontFamily,
            fontSize: TBL.note,
            fontWeight: 300,
            color: "rgba(255,255,255,0.78)",
            lineHeight: 1.6,
          }}
        >
          {note}
        </span>
      </div>
    </div>
  );
};

// ─── Base composition ─────────────────────────────────────────────────────────

type GEOTopicTableProps = {
  brand: string;
  subtitle: string;
  rows: TopicRow[];
  analysisStat: AnalysisStat[];
  analysisNote: string;
};

const GEOTopicTable: React.FC<GEOTopicTableProps> = ({
  brand,
  subtitle,
  rows,
  analysisStat,
  analysisNote,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.1 * fps,
  });
  const titleP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.4 * fps,
  });
  const colHeadP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: 0.9 * fps,
  });
  const analysisP = spring({
    frame,
    fps,
    config: SPRING_CONFIG.snappy,
    delay: (1.2 + rows.length * 0.14 + 0.3) * fps,
  });

  const headerY = interpolate(headerP, [0, 1], [-30, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <FadeWrapper fadeInStart={0} fadeOutBeforeEnd={1.5}>
        <AbsoluteFill>
          {/* ── Orange header bar ── */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 90,
              background: COLORS.orange,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 60px",
              opacity: headerP,
              transform: `translateY(${headerY}px)`,
            }}
          >
            <span
              style={{
                fontFamily: fontFamily,
                fontSize: TBL.headerTitle,
                fontWeight: 700,
                color: COLORS.white,
                letterSpacing: -0.5,
              }}
            >
              {brand} — Topic Performance Breakdown
            </span>
            <span
              style={{
                fontFamily: fontFamily,
                fontSize: TBL.headerBadge,
                fontWeight: 600,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: 2.5,
                textTransform: "uppercase",
              }}
            >
              GEO Services · LLM Audit
            </span>
          </div>

          {/* ── Subtitle / context line ── */}
          <div
            style={{
              position: "absolute",
              top: 106,
              left: COL_LEFT,
              opacity: titleP,
            }}
          >
            <span
              style={{
                fontFamily: fontFamily,
                fontSize: TBL.subtitle,
                fontWeight: 300,
                color: COLORS.gray,
                letterSpacing: 0.3,
              }}
            >
              {subtitle}
            </span>

            {/* Platform color legend */}
            <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
              {[
                { label: "ChatGPT", color: PLATFORM_COLORS.chatgpt },
                { label: "AI Overviews", color: PLATFORM_COLORS.aio },
                { label: "AI Mode", color: PLATFORM_COLORS.aim },
              ].map((p) => (
                <div
                  key={p.label}
                  style={{ display: "flex", alignItems: "center", gap: 7 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 2,
                      background: p.color,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: fontFamily,
                      fontSize: TBL.legend,
                      fontWeight: 400,
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {p.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Column headers ── */}
          <TableHeader progress={colHeadP} />

          {/* ── Data rows ── */}
          {rows.map((row, i) => {
            const p = spring({
              frame,
              fps,
              config: SPRING_CONFIG.snappy,
              delay: (1.2 + i * 0.14) * fps,
            });
            return <DataRow key={i} row={row} rowIndex={i} progress={p} />;
          })}

          {/* ── Analysis section ── */}
          <AnalysisSection
            stats={analysisStat}
            note={analysisNote}
            progress={analysisP}
            rowCount={rows.length}
          />

          {/* BOL */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              right: 60,
              fontFamily: fontFamily,
              fontSize: TBL.bol,
              fontWeight: 700,
              color: COLORS.orange,
              opacity: headerP,
            }}
          >
            BOL
          </div>
        </AbsoluteFill>
      </FadeWrapper>
    </AbsoluteFill>
  );
};

// ─── Named exports ─────────────────────────────────────────────────────────────

export const MilgardTopicTable: React.FC = () => (
  <GEOTopicTable
    brand="Milgard Windows"
    subtitle="200 prompts · 5 topics · 3 platforms  |  M% = mention rate, C% = citation rate"
    rows={[
      {
        topic: "All Topics",
        prompts: 200,
        gptM: 32,
        gptC: 10,
        aioM: 20,
        aioC: 12,
        aimM: 19,
        aimC: 10,
        mention: 44,
      },
      {
        topic: "Product Comparison",
        prompts: 40,
        gptM: 28,
        gptC: 8,
        aioM: 28,
        aioC: 12,
        aimM: 28,
        aimC: 10,
        mention: 45,
      },
      {
        topic: "Cost & ROI",
        prompts: 40,
        gptM: 15,
        gptC: 8,
        aioM: 8,
        aioC: 0,
        aimM: 5,
        aimC: 0,
        mention: 18,
      },
      {
        topic: "Brand Evaluation",
        prompts: 40,
        gptM: 48,
        gptC: 15,
        aioM: 42,
        aioC: 18,
        aimM: 40,
        aimC: 15,
        mention: 65,
      },
      {
        topic: "Code Compliance",
        prompts: 40,
        gptM: 30,
        gptC: 0,
        aioM: 8,
        aioC: 10,
        aimM: 8,
        aimC: 2,
        mention: 38,
      },
      {
        topic: "Design Aesthetics",
        prompts: 40,
        gptM: 40,
        gptC: 20,
        aioM: 12,
        aioC: 20,
        aimM: 15,
        aimC: 22,
        mention: 55,
      },
    ]}
    analysisStat={[
      { label: "Overall Mention Rate", value: "44%", color: COLORS.orange },
      {
        label: "Strongest Topic",
        value: "Brand Eval (65%)",
        color: PLATFORM_COLORS.chatgpt,
      },
      { label: "Weakest Topic", value: "Cost & ROI (18%)", color: COLORS.gray },
      {
        label: "Best Platform",
        value: "ChatGPT (32%)",
        color: PLATFORM_COLORS.chatgpt,
      },
    ]}
    analysisNote="Milgard shows strong brand recognition on Brand Evaluation queries (65%) but almost no presence on Cost & ROI topics (18%). ChatGPT is the strongest platform overall — prioritize schema-rich cost/value content to close the gap."
  />
);

export const PGTTopicTable: React.FC = () => (
  <GEOTopicTable
    brand="PGT Windows"
    subtitle="200 prompts · 5 topics · 3 platforms  |  M% = mention rate, C% = citation rate"
    rows={[
      {
        topic: "All Topics",
        prompts: 200,
        gptM: 16,
        gptC: 2,
        aioM: 9,
        aioC: 4,
        aimM: 8,
        aimC: 6,
        mention: 26,
      },
      {
        topic: "Product Comparison",
        prompts: 40,
        gptM: 20,
        gptC: 0,
        aioM: 12,
        aioC: 5,
        aimM: 15,
        aimC: 8,
        mention: 28,
      },
      {
        topic: "Cost & ROI",
        prompts: 40,
        gptM: 2,
        gptC: 0,
        aioM: 8,
        aioC: 2,
        aimM: 2,
        aimC: 5,
        mention: 20,
      },
      {
        topic: "Brand Evaluation",
        prompts: 40,
        gptM: 22,
        gptC: 2,
        aioM: 12,
        aioC: 2,
        aimM: 10,
        aimC: 2,
        mention: 32,
      },
      {
        topic: "Code Compliance",
        prompts: 40,
        gptM: 25,
        gptC: 5,
        aioM: 8,
        aioC: 8,
        aimM: 10,
        aimC: 12,
        mention: 35,
      },
      {
        topic: "Design Aesthetics",
        prompts: 40,
        gptM: 12,
        gptC: 0,
        aioM: 5,
        aioC: 2,
        aimM: 2,
        aimC: 2,
        mention: 15,
      },
    ]}
    analysisStat={[
      { label: "Overall Mention Rate", value: "26%", color: COLORS.orange },
      {
        label: "Strongest Topic",
        value: "Product Comp (28%)",
        color: PLATFORM_COLORS.chatgpt,
      },
      { label: "Weakest Topic", value: "Cost & ROI (4%)", color: COLORS.gray },
      {
        label: "Best Platform",
        value: "ChatGPT (16%)",
        color: PLATFORM_COLORS.chatgpt,
      },
    ]}
    analysisNote="PGT Windows has a 26% overall mention rate — solid but with major opportunity. Code Compliance performs best (35%), suggesting technical authority is a content strength. Cost & ROI at only 4% represents the biggest gap to close."
  />
);

export const MIWindowsTopicTable: React.FC = () => (
  <GEOTopicTable
    brand="MI Windows"
    subtitle="200 prompts · 5 topics · 3 platforms  |  M% = mention rate, C% = citation rate"
    rows={[
      {
        topic: "All Topics",
        prompts: 200,
        gptM: 27,
        gptC: 4,
        aioM: 12,
        aioC: 4,
        aimM: 15,
        aimC: 4,
        mention: 32,
      },
      {
        topic: "Product Comparison",
        prompts: 40,
        gptM: 30,
        gptC: 5,
        aioM: 22,
        aioC: 12,
        aimM: 25,
        aimC: 8,
        mention: 38,
      },
      {
        topic: "Cost & ROI",
        prompts: 40,
        gptM: 15,
        gptC: 2,
        aioM: 2,
        aioC: 8,
        aimM: 8,
        aimC: 5,
        mention: 18,
      },
      {
        topic: "Brand Evaluation",
        prompts: 40,
        gptM: 45,
        gptC: 5,
        aioM: 30,
        aioC: 0,
        aimM: 32,
        aimC: 5,
        mention: 55,
      },
      {
        topic: "Code Compliance",
        prompts: 40,
        gptM: 22,
        gptC: 2,
        aioM: 8,
        aioC: 0,
        aimM: 8,
        aimC: 0,
        mention: 28,
      },
      {
        topic: "Design Aesthetics",
        prompts: 40,
        gptM: 22,
        gptC: 8,
        aioM: 0,
        aioC: 2,
        aimM: 2,
        aimC: 0,
        mention: 25,
      },
    ]}
    analysisStat={[
      { label: "Overall Mention Rate", value: "32%", color: COLORS.orange },
      {
        label: "Strongest Topic",
        value: "Brand Eval (55%)",
        color: PLATFORM_COLORS.chatgpt,
      },
      { label: "Weakest Topic", value: "Cost & ROI (8%)", color: COLORS.gray },
      {
        label: "Best Platform",
        value: "ChatGPT (27%)",
        color: PLATFORM_COLORS.chatgpt,
      },
    ]}
    analysisNote="MI Windows achieves 32% overall, with Brand Evaluation the standout at 55%. AI Overviews is the weakest platform at just 12% — indicating limited structured content indexed for SGE. Cost & ROI (8%) is near-zero across all platforms."
  />
);
