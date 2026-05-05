import { getCharBitmap } from "./font-bitmaps";
import { CHAR_GRID } from "./design";

export interface GridCell {
  row: number;
  col: number;
  on: boolean;
}

export interface TextGrid {
  cells: GridCell[];
  totalCols: number;
  totalRows: number;
}

// Split text into lines that fit within maxCols (word-wrap on spaces)
function wrapText(text: string, maxCols: number): string[] {
  const { charWidth, charGap } = CHAR_GRID;
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = "";

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testCols = testLine.length * (charWidth + charGap) - charGap;
    if (testCols > maxCols && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

// Build a multi-line grid from text, auto-wrapping to fit within maxCols.
// maxCols is computed from the viewport width at call site.
export function textToGrid(text: string, maxCols?: number): TextGrid {
  const { charWidth, charHeight, charGap } = CHAR_GRID;
  const lineGap = 2; // 2 coarse-pixel rows between text lines

  // If no maxCols given, use a reasonable default for a single line
  const effectiveMax = maxCols ?? 999;
  const lines = wrapText(text, effectiveMax);

  // Find the widest line to set totalCols
  let widestCols = 0;
  for (const line of lines) {
    const chars = line.length;
    const lineCols = chars * (charWidth + charGap) - charGap;
    widestCols = Math.max(widestCols, lineCols);
  }

  const totalCols = widestCols;
  const totalRows = lines.length * charHeight + (lines.length - 1) * lineGap;
  const cells: GridCell[] = [];

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const line = lines[lineIdx].toUpperCase();
    const chars = line.split("");
    const lineCols = chars.length * (charWidth + charGap) - charGap;
    // Center each line horizontally within the grid
    const lineOffsetCol = Math.floor((totalCols - lineCols) / 2);
    const lineOffsetRow = lineIdx * (charHeight + lineGap);

    for (let localRow = 0; localRow < charHeight; localRow++) {
      for (let localCol = 0; localCol < totalCols; localCol++) {
        const row = lineOffsetRow + localRow;
        const adjustedCol = localCol - lineOffsetCol;

        if (adjustedCol < 0 || adjustedCol >= lineCols) {
          cells.push({ row, col: localCol, on: false });
          continue;
        }

        const charIndex = Math.floor(adjustedCol / (charWidth + charGap));
        const pixelCol = adjustedCol % (charWidth + charGap);

        if (charIndex >= chars.length || pixelCol >= charWidth) {
          cells.push({ row, col: localCol, on: false });
          continue;
        }

        const bitmap = getCharBitmap(chars[charIndex]);
        const on = bitmap[localRow]?.[pixelCol] === 1;
        cells.push({ row, col: localCol, on });
      }
    }

    // Add gap rows (all off) between lines
    if (lineIdx < lines.length - 1) {
      for (let gapRow = 0; gapRow < lineGap; gapRow++) {
        const row = lineOffsetRow + charHeight + gapRow;
        for (let col = 0; col < totalCols; col++) {
          cells.push({ row, col, on: false });
        }
      }
    }
  }

  return { cells, totalCols, totalRows };
}

// Get only the "on" cells (pixels that form the letters)
export function getActiveCells(grid: TextGrid): GridCell[] {
  return grid.cells.filter((c) => c.on);
}

// Seeded shuffle for deterministic random draw order
function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  const next = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Generate the typing draw order: left-to-right, top-to-bottom within each letter
export function getTypingOrder(grid: TextGrid): GridCell[] {
  const active = getActiveCells(grid);
  const { charWidth, charGap } = CHAR_GRID;

  // Group by character index, then sort within each group L→R, T→B
  const grouped = new Map<number, GridCell[]>();
  for (const cell of active) {
    const charIdx = Math.floor(cell.col / (charWidth + charGap));
    if (!grouped.has(charIdx)) grouped.set(charIdx, []);
    grouped.get(charIdx)!.push(cell);
  }

  const result: GridCell[] = [];
  const sortedKeys = [...grouped.keys()].sort((a, b) => a - b);
  for (const key of sortedKeys) {
    const cells = grouped.get(key)!;
    // Sort top-to-bottom, left-to-right within each character
    cells.sort((a, b) => a.row - b.row || a.col - b.col);
    result.push(...cells);
  }
  return result;
}

// Generate randomized draw order for refinement passes
export function getRefineOrder(
  activeCells: GridCell[],
  subdivLevel: number,
  seed: number,
): { parentRow: number; parentCol: number; subRow: number; subCol: number }[] {
  const subSize = Math.pow(2, subdivLevel); // 2 for level 1, 4 for level 2
  const items: {
    parentRow: number;
    parentCol: number;
    subRow: number;
    subCol: number;
  }[] = [];

  for (const cell of activeCells) {
    for (let sr = 0; sr < subSize; sr++) {
      for (let sc = 0; sc < subSize; sc++) {
        items.push({
          parentRow: cell.row,
          parentCol: cell.col,
          subRow: sr,
          subCol: sc,
        });
      }
    }
  }

  return seededShuffle(items, seed + subdivLevel * 99991);
}

// Calculate pixel position for a cell in the viewport
export function cellToPixelPos(
  row: number,
  col: number,
  cellSize: number,
  offsetX: number,
  offsetY: number,
): { x: number; y: number } {
  return {
    x: offsetX + col * cellSize,
    y: offsetY + row * cellSize,
  };
}

// Calculate the coarse cell size and offsets to center the text in the viewport.
// Also returns the expanded grid area (with padding cells around the text)
// for the grid background and letterbox positioning.
export function layoutGrid(
  totalCols: number,
  totalRows: number,
  viewportWidth: number,
  viewportHeight: number,
): {
  cellSize: number;
  offsetX: number;
  offsetY: number;
  gridAreaTop: number;
  gridAreaHeight: number;
  gridAreaLeft: number;
  gridAreaWidth: number;
} {
  // Leave some padding (10% on each side)
  const availWidth = viewportWidth * 0.8;
  const availHeight = viewportHeight * 0.8;

  const cellByWidth = Math.floor(availWidth / totalCols);
  const cellByHeight = Math.floor(availHeight / totalRows);
  const cellSize = Math.min(cellByWidth, cellByHeight);

  const gridWidth = totalCols * cellSize;
  const gridHeight = totalRows * cellSize;

  const offsetX = Math.floor((viewportWidth - gridWidth) / 2);
  const offsetY = Math.floor((viewportHeight - gridHeight) / 2);

  // Expanded grid area: add ~2 cell-widths of padding around the text
  // but clamp to viewport edges
  const gridPad = cellSize * 2;
  const gridAreaLeft = Math.max(0, offsetX - gridPad);
  const gridAreaTop = Math.max(0, offsetY - gridPad);
  const gridAreaWidth = Math.min(viewportWidth, gridWidth + gridPad * 2);
  const gridAreaHeight = Math.min(
    viewportHeight - gridAreaTop,
    gridHeight + gridPad * 2,
  );

  return {
    cellSize,
    offsetX,
    offsetY,
    gridAreaTop,
    gridAreaHeight,
    gridAreaLeft,
    gridAreaWidth,
  };
}
