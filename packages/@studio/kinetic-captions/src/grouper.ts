import type { Caption } from "@remotion/captions";
import type { Page, PageToken } from "./types";

// --- Tuning knobs ---
const MIN_WORDS = 5;
const MAX_WORDS = 10;

/**
 * Split SRT entries (multi-word phrases) into individual word-level
 * Captions with evenly distributed timing.
 */
export function splitToWords(captions: Caption[]): Caption[] {
  const result: Caption[] = [];
  for (const cap of captions) {
    const raw = cap.text.replace(/\n/g, " ");
    const words = raw.split(/\s+/).filter((w) => w.length > 0);
    if (words.length === 0) continue;
    const dur = cap.endMs - cap.startMs;
    const perWord = dur / words.length;
    for (let j = 0; j < words.length; j++) {
      const start = Math.round(cap.startMs + j * perWord);
      const end = Math.round(cap.startMs + (j + 1) * perWord);
      result.push({
        text: result.length > 0 ? ` ${words[j]}` : words[j],
        startMs: start,
        endMs: end,
        timestampMs: start,
        confidence: cap.confidence,
      });
    }
  }
  return result;
}

/**
 * Punctuation-aware phrase grouper.
 *
 * Rules:
 *   1. Break at sentence endings (. ! ?) once we have >= 3 words
 *   2. Break at clause boundaries (, ; : —) once we have >= MIN_WORDS
 *   3. If at MIN_WORDS with no punctuation, look ahead 3 words —
 *      if punctuation is coming, wait for it; otherwise break
 *   4. Force break at MAX_WORDS regardless
 */
export function groupIntoPhrases(wordCaptions: Caption[]): Page[] {
  const SENTENCE_END = /[.!?]["'\u2019\u201D)]*$/;
  const CLAUSE_BREAK = /[,;:\u2014\u2013-]["'\u2019\u201D)]*$/;

  const pages: Page[] = [];
  let tokens: PageToken[] = [];
  let pageStartMs = 0;

  function flush() {
    if (tokens.length === 0) return;
    pages.push({ startMs: pageStartMs, tokens: [...tokens] });
    tokens = [];
  }

  function punctuationAhead(from: number, range: number): boolean {
    for (let k = 1; k <= range && from + k < wordCaptions.length; k++) {
      const t = wordCaptions[from + k].text.trim();
      if (SENTENCE_END.test(t) || CLAUSE_BREAK.test(t)) return true;
    }
    return false;
  }

  for (let i = 0; i < wordCaptions.length; i++) {
    const word = wordCaptions[i];
    const trimmed = word.text.trim();

    tokens.push({ text: word.text, fromMs: word.startMs, toMs: word.endMs });
    if (tokens.length === 1) pageStartMs = word.startMs;

    const count = tokens.length;
    const isSentenceEnd = SENTENCE_END.test(trimmed);
    const isClauseBreak = CLAUSE_BREAK.test(trimmed);
    const isLast = i === wordCaptions.length - 1;

    let shouldBreak = false;

    if (isSentenceEnd && count >= 3) {
      shouldBreak = true;
    } else if (isClauseBreak && count >= MIN_WORDS) {
      shouldBreak = true;
    } else if (count >= MAX_WORDS) {
      shouldBreak = true;
    } else if (count >= MIN_WORDS && !punctuationAhead(i, 3)) {
      shouldBreak = true;
    }

    if (shouldBreak || isLast) {
      flush();
    }
  }

  return pages;
}
