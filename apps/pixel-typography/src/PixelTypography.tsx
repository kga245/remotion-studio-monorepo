import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { COLORS, TIMING } from "./design";
import {
  textToGrid,
  getActiveCells,
  getTypingOrder,
  getRefineOrder,
  layoutGrid,
} from "./grid-engine";
import {
  coarseFill,
  pickRefinedFill,
  fillToCSS,
  type FillType,
} from "./fill-patterns";
import { Cursor, interpolateCursorPos } from "./Cursor";

interface PixelTypographyProps {
  text: string;
  backgroundColor: string;
  primaryColor: string;
  letterboxColor: string;
}

export const PixelTypography: React.FC<PixelTypographyProps> = ({
  text,
  backgroundColor,
  primaryColor,
  letterboxColor,
}) => {
  const frame = useCurrentFrame();
  const { width, height, fps: _fps } = useVideoConfig();

  // Estimate a reasonable maxCols for word-wrapping based on viewport
  // Aim for cells that are at least 20px so text stays readable
  const maxCols = useMemo(() => {
    const minCellSize = 20;
    const availWidth = width * 0.85;
    return Math.floor(availWidth / minCellSize);
  }, [width]);

  // Build grid layout from text
  const grid = useMemo(() => textToGrid(text, maxCols), [text, maxCols]);
  const activeCells = useMemo(() => getActiveCells(grid), [grid]);
  const layout = useMemo(
    () => layoutGrid(grid.totalCols, grid.totalRows, width, height),
    [grid, width, height],
  );

  // Draw orders
  const typingOrder = useMemo(() => getTypingOrder(grid), [grid]);
  const refine1Order = useMemo(
    () => getRefineOrder(activeCells, 1, 42),
    [activeCells],
  );
  const refine2Order = useMemo(
    () => getRefineOrder(activeCells, 2, 7777),
    [activeCells],
  );

  // Phase 1: How many coarse cells are drawn so far?
  const typingProgress = interpolate(
    frame,
    [TIMING.typingStart, TIMING.typingEnd],
    [0, typingOrder.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const drawnCoarseCount = Math.floor(typingProgress);

  // Phase 2: How many sub-cells in refine pass 1?
  const refine1Progress = interpolate(
    frame,
    [TIMING.refine1Start, TIMING.refine1End],
    [0, refine1Order.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const drawnRefine1Count = Math.floor(refine1Progress);

  // Phase 3: How many sub-cells in refine pass 2?
  const refine2Progress = interpolate(
    frame,
    [TIMING.refine2Start, TIMING.refine2End],
    [0, refine2Order.length],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const drawnRefine2Count = Math.floor(refine2Progress);

  // Track which coarse cells are drawn (for rendering)
  const drawnCells = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < drawnCoarseCount && i < typingOrder.length; i++) {
      const c = typingOrder[i];
      set.add(`${c.row},${c.col}`);
    }
    return set;
  }, [drawnCoarseCount, typingOrder]);

  // Track which refine1 sub-cells are drawn
  const drawnRefine1 = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < drawnRefine1Count && i < refine1Order.length; i++) {
      const r = refine1Order[i];
      set.add(`${r.parentRow},${r.parentCol},${r.subRow},${r.subCol}`);
    }
    return set;
  }, [drawnRefine1Count, refine1Order]);

  // Track which refine2 sub-cells are drawn
  const drawnRefine2 = useMemo(() => {
    const set = new Set<string>();
    for (let i = 0; i < drawnRefine2Count && i < refine2Order.length; i++) {
      const r = refine2Order[i];
      set.add(`${r.parentRow},${r.parentCol},${r.subRow},${r.subCol}`);
    }
    return set;
  }, [drawnRefine2Count, refine2Order]);

  // Cursor position calculation
  const cursorPos = useMemo(() => {
    const { cellSize, offsetX, offsetY } = layout;

    if (frame < TIMING.typingEnd && drawnCoarseCount > 0) {
      const currentIdx = Math.min(drawnCoarseCount - 1, typingOrder.length - 1);
      const cell = typingOrder[currentIdx];
      const prevIdx = Math.max(0, currentIdx - 1);
      const prevCell = typingOrder[prevIdx];

      const framesPerCell =
        (TIMING.typingEnd - TIMING.typingStart) / typingOrder.length;
      const cellFrame = TIMING.typingStart + currentIdx * framesPerCell;

      return interpolateCursorPos(
        frame,
        cellFrame,
        cellFrame + framesPerCell,
        offsetX + prevCell.col * cellSize + cellSize / 2,
        offsetY + prevCell.row * cellSize + cellSize / 2,
        offsetX + cell.col * cellSize + cellSize / 2,
        offsetY + cell.row * cellSize + cellSize / 2,
      );
    }

    if (
      frame >= TIMING.refine1Start &&
      frame < TIMING.refine1End &&
      drawnRefine1Count > 0
    ) {
      const currentIdx = Math.min(
        drawnRefine1Count - 1,
        refine1Order.length - 1,
      );
      const item = refine1Order[currentIdx];
      const subCellSize = cellSize / 2;
      return {
        x:
          offsetX +
          item.parentCol * cellSize +
          item.subCol * subCellSize +
          subCellSize / 2,
        y:
          offsetY +
          item.parentRow * cellSize +
          item.subRow * subCellSize +
          subCellSize / 2,
      };
    }

    if (
      frame >= TIMING.refine2Start &&
      frame < TIMING.refine2End &&
      drawnRefine2Count > 0
    ) {
      const currentIdx = Math.min(
        drawnRefine2Count - 1,
        refine2Order.length - 1,
      );
      const item = refine2Order[currentIdx];
      const subCellSize = cellSize / 4;
      return {
        x:
          offsetX +
          item.parentCol * cellSize +
          item.subCol * subCellSize +
          subCellSize / 2,
        y:
          offsetY +
          item.parentRow * cellSize +
          item.subRow * subCellSize +
          subCellSize / 2,
      };
    }

    return { x: width / 2, y: height / 2 };
  }, [
    frame,
    layout,
    drawnCoarseCount,
    drawnRefine1Count,
    drawnRefine2Count,
    typingOrder,
    refine1Order,
    refine2Order,
    width,
    height,
  ]);

  // Cursor visibility
  const showCursor = frame < TIMING.finalHoldStart;
  const cursorOpacity =
    frame >= TIMING.refine2End - 15
      ? interpolate(
          frame,
          [TIMING.refine2End - 15, TIMING.refine2End],
          [1, 0],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        )
      : 1;

  const finalOpacity = 1;

  const {
    cellSize,
    offsetX,
    offsetY,
    gridAreaTop,
    gridAreaHeight,
    gridAreaLeft,
    gridAreaWidth,
  } = layout;

  // Are we in a refinement phase?
  const inRefine1 = frame >= TIMING.refine1Start;
  const inRefine2 = frame >= TIMING.refine2Start;

  // The base fill for all coarse pixels — primary color solid
  const baseFill = coarseFill(primaryColor);

  // Letterbox bar dimensions
  const letterboxTopH = gridAreaTop;
  const letterboxBottomH = height - (gridAreaTop + gridAreaHeight);

  return (
    <AbsoluteFill style={{ backgroundColor, opacity: finalOpacity }}>
      {/* Letterbox — top bar with sparse pixels */}
      {letterboxTopH > 0 && (
        <LetterboxBar
          x={0}
          y={0}
          barWidth={width}
          barHeight={letterboxTopH}
          baseColor={letterboxColor}
          accentColors={[
            primaryColor,
            COLORS.warmCream,
            COLORS.charcoal,
            COLORS.blue,
          ]}
          cellSize={cellSize}
          frame={frame}
          seed={111}
        />
      )}

      {/* Letterbox — bottom bar with sparse pixels */}
      {letterboxBottomH > 0 && (
        <LetterboxBar
          x={0}
          y={height - letterboxBottomH}
          barWidth={width}
          barHeight={letterboxBottomH}
          baseColor={letterboxColor}
          accentColors={[
            primaryColor,
            COLORS.warmCream,
            COLORS.charcoal,
            COLORS.blue,
          ]}
          cellSize={cellSize}
          frame={frame}
          seed={999}
        />
      )}

      {/* Expanded grid background lines (with padding around text) */}
      <GridBackground
        cellSize={cellSize}
        left={gridAreaLeft}
        top={gridAreaTop}
        areaWidth={gridAreaWidth}
        areaHeight={gridAreaHeight}
        gridColor={COLORS.gridLine}
        opacity={interpolate(frame, [0, TIMING.refine1End], [0.6, 0.15], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })}
      />

      {/* Render coarse cells */}
      {activeCells.map((cell) => {
        const key = `${cell.row},${cell.col}`;
        if (!drawnCells.has(key)) return null;

        if (inRefine2) {
          return (
            <CoarseCellWithRefine2
              key={key}
              cell={cell}
              cellSize={cellSize}
              offsetX={offsetX}
              offsetY={offsetY}
              primaryColor={primaryColor}
              baseFill={baseFill}
              drawnRefine1={drawnRefine1}
              drawnRefine2={drawnRefine2}
            />
          );
        }

        if (inRefine1) {
          return (
            <CoarseCellWithRefine1
              key={key}
              cell={cell}
              cellSize={cellSize}
              offsetX={offsetX}
              offsetY={offsetY}
              primaryColor={primaryColor}
              baseFill={baseFill}
              drawnRefine1={drawnRefine1}
            />
          );
        }

        // Plain coarse cell — solid primary color
        return (
          <div
            key={key}
            style={{
              position: "absolute",
              left: offsetX + cell.col * cellSize,
              top: offsetY + cell.row * cellSize,
              width: cellSize - 1,
              height: cellSize - 1,
              background: primaryColor,
            }}
          />
        );
      })}

      {/* Cursor */}
      {showCursor && (
        <Cursor
          x={cursorPos.x}
          y={cursorPos.y}
          size={cellSize}
          opacity={cursorOpacity}
        />
      )}
    </AbsoluteFill>
  );
};

// Grid background with faint lines — fills the expanded grid area
const GridBackground: React.FC<{
  cellSize: number;
  left: number;
  top: number;
  areaWidth: number;
  areaHeight: number;
  gridColor: string;
  opacity: number;
}> = ({ cellSize, left, top, areaWidth, areaHeight, gridColor, opacity }) => {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: areaWidth,
        height: areaHeight,
        opacity,
        backgroundImage: `
          linear-gradient(${gridColor} 1px, transparent 1px),
          linear-gradient(90deg, ${gridColor} 1px, transparent 1px)
        `,
        backgroundSize: `${cellSize}px ${cellSize}px`,
      }}
    />
  );
};

// Coarse cell with 2x2 subdivision (refine level 1)
// Sub-pixels INHERIT from the coarse fill — most stay the same,
// ~25% get a subtle accent variation.
const CoarseCellWithRefine1: React.FC<{
  cell: { row: number; col: number };
  cellSize: number;
  offsetX: number;
  offsetY: number;
  primaryColor: string;
  baseFill: FillType;
  drawnRefine1: Set<string>;
}> = ({
  cell,
  cellSize,
  offsetX,
  offsetY,
  primaryColor,
  baseFill,
  drawnRefine1,
}) => {
  const subSize = cellSize / 2;
  const subs: React.ReactNode[] = [];

  for (let sr = 0; sr < 2; sr++) {
    for (let sc = 0; sc < 2; sc++) {
      const subKey = `${cell.row},${cell.col},${sr},${sc}`;
      const isRefined = drawnRefine1.has(subKey);

      // If refined, derive from parent fill with small chance of variation
      // If not yet refined, show the parent fill unchanged
      const fill = isRefined
        ? pickRefinedFill(
            cell.row * 2 + sr,
            cell.col * 2 + sc,
            1,
            baseFill,
            primaryColor,
          )
        : baseFill;

      subs.push(
        <div
          key={`${sr}-${sc}`}
          style={{
            position: "absolute",
            left: sc * subSize,
            top: sr * subSize,
            width: subSize - 0.5,
            height: subSize - 0.5,
            background: fillToCSS(fill),
          }}
        />,
      );
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        left: offsetX + cell.col * cellSize,
        top: offsetY + cell.row * cellSize,
        width: cellSize,
        height: cellSize,
      }}
    >
      {subs}
    </div>
  );
};

// Coarse cell with 4x4 subdivision (refine level 2)
// Each 4x4 sub-pixel inherits from its 2x2 parent's fill,
// with another small chance of variation layered on top.
const CoarseCellWithRefine2: React.FC<{
  cell: { row: number; col: number };
  cellSize: number;
  offsetX: number;
  offsetY: number;
  primaryColor: string;
  baseFill: FillType;
  drawnRefine1: Set<string>;
  drawnRefine2: Set<string>;
}> = ({
  cell,
  cellSize,
  offsetX,
  offsetY,
  primaryColor,
  baseFill,
  drawnRefine1,
  drawnRefine2,
}) => {
  const subSize = cellSize / 4;
  const subs: React.ReactNode[] = [];

  // Pre-compute the level-1 fills for the 2x2 parents
  const l1Fills: FillType[][] = [];
  for (let psr = 0; psr < 2; psr++) {
    l1Fills[psr] = [];
    for (let psc = 0; psc < 2; psc++) {
      const r1Key = `${cell.row},${cell.col},${psr},${psc}`;
      const isRefined1 = drawnRefine1.has(r1Key);
      l1Fills[psr][psc] = isRefined1
        ? pickRefinedFill(
            cell.row * 2 + psr,
            cell.col * 2 + psc,
            1,
            baseFill,
            primaryColor,
          )
        : baseFill;
    }
  }

  for (let sr = 0; sr < 4; sr++) {
    for (let sc = 0; sc < 4; sc++) {
      const r2Key = `${cell.row},${cell.col},${sr},${sc}`;
      const isRefined2 = drawnRefine2.has(r2Key);

      // This sub-pixel's level-1 parent
      const parentSR = Math.floor(sr / 2);
      const parentSC = Math.floor(sc / 2);
      const parentFill = l1Fills[parentSR][parentSC];

      // If refined at level 2, derive from the level-1 parent fill
      // If not, just show the level-1 parent fill as-is
      const fill = isRefined2
        ? pickRefinedFill(
            cell.row * 4 + sr,
            cell.col * 4 + sc,
            2,
            parentFill,
            primaryColor,
          )
        : parentFill;

      subs.push(
        <div
          key={`${sr}-${sc}`}
          style={{
            position: "absolute",
            left: sc * subSize,
            top: sr * subSize,
            width: subSize - 0.25,
            height: subSize - 0.25,
            background: fillToCSS(fill),
          }}
        />,
      );
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        left: offsetX + cell.col * cellSize,
        top: offsetY + cell.row * cellSize,
        width: cellSize,
        height: cellSize,
      }}
    >
      {subs}
    </div>
  );
};

// Seeded PRNG for letterbox pixel generation
function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

// Letterbox bar with sparse animated pixel blocks scattered across it.
// Pixels fade in/out over the animation timeline to give it life.
const LetterboxBar: React.FC<{
  x: number;
  y: number;
  barWidth: number;
  barHeight: number;
  baseColor: string;
  accentColors: string[];
  cellSize: number;
  frame: number;
  seed: number;
}> = ({
  x,
  y,
  barWidth,
  barHeight,
  baseColor,
  accentColors,
  cellSize,
  frame,
  seed,
}) => {
  const pixels = useMemo(() => {
    const rand = lcg(seed);
    const pixelSize = Math.max(8, cellSize / 3);
    const cols = Math.floor(barWidth / pixelSize);
    const rows = Math.floor(barHeight / pixelSize);
    const totalSlots = cols * rows;

    // ~2% density — very sparse, just a hint of texture
    const count = Math.max(2, Math.floor(totalSlots * 0.02));
    const result: {
      px: number;
      py: number;
      w: number;
      h: number;
      color: string;
      fadeIn: number;
      fadeOut: number;
    }[] = [];

    for (let i = 0; i < count; i++) {
      const col = Math.floor(rand() * cols);
      const row = Math.floor(rand() * rows);
      // Keep pixels small — only 1x1, occasionally 1x2
      const wMul = rand() < 0.15 ? 2 : 1;
      const hMul = 1;
      const colorIdx = Math.floor(rand() * accentColors.length);

      // Each pixel fades in at a random point, stays visible, then fades out
      const fadeIn = Math.floor(rand() * 200);
      const duration = 40 + Math.floor(rand() * 120);
      const fadeOut = Math.min(fadeIn + duration, 270);

      result.push({
        px: col * pixelSize,
        py: row * pixelSize,
        w: pixelSize * wMul,
        h: pixelSize * hMul,
        color: accentColors[colorIdx],
        fadeIn,
        fadeOut,
      });
    }
    return result;
  }, [seed, barWidth, barHeight, cellSize, accentColors]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: barWidth,
        height: barHeight,
        background: baseColor,
        overflow: "hidden",
      }}
    >
      {pixels.map((p, i) => {
        let opacity = 0;
        if (frame >= p.fadeIn && frame <= p.fadeOut) {
          const fadeInEnd = p.fadeIn + 10;
          const fadeOutStart = p.fadeOut - 10;
          if (frame < fadeInEnd) {
            opacity = interpolate(frame, [p.fadeIn, fadeInEnd], [0, 0.35], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
          } else if (frame > fadeOutStart) {
            opacity = interpolate(frame, [fadeOutStart, p.fadeOut], [0.35, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
          } else {
            opacity = 0.35;
          }
        }
        if (opacity <= 0) return null;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: p.px,
              top: p.py,
              width: p.w,
              height: p.h,
              background: p.color,
              opacity,
            }}
          />
        );
      })}
    </div>
  );
};
