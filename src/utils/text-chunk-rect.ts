import type { LayoutItemText } from "../models/layout";
import {
  type Text,
  type TextChunk,
  type TextFont,
  type TextPattern,
  parseRawText,
} from "./text-chunk";

export type TextChunkRect = TextChunk & {
  x: number;
  y: number;
};

export function computeText(
  rawText: string,
  formatting: TextFont,
  patterns: TextPattern[],
  maxW: number,
  maxH: number,
  lineHeight: number,
  paragraphGap: number,
): [Text, number, number] {
  while (true) {
    const text = parseRawText(rawText, formatting, patterns, maxW);
    const h =
      text.paragraphs
        .map(
          (par) =>
            (par.lines.length - 1) * formatting.size * lineHeight +
            formatting.size,
        )
        .reduce((partialH, paragraphH) => partialH + paragraphH, 0) +
      Math.max(text.paragraphs.length - 1, 0) * paragraphGap;
    if (h <= maxH || formatting.size <= 1) return [text, formatting.size, h];
    formatting = { ...formatting, size: formatting.size - 0.1 };
  }
}

export function computeTextChunkRects(
  rawText: string,
  formatting: TextFont,
  patterns: TextPattern[],
  maxW: number,
  maxH: number,
  lineHeight: number,
  paragraphGap: number,
  alignH: LayoutItemText["alignH"],
  alignV: LayoutItemText["alignV"],
): [TextChunkRect[], number, number] {
  const [text, fontSize, h] = computeText(
    rawText,
    formatting,
    patterns,
    maxW,
    maxH,
    lineHeight,
    paragraphGap,
  );

  let y = {
    bottom: maxH - h,
    middle: (maxH - h) / 2,
    top: 0,
  }[alignV];

  const rects = text.paragraphs.flatMap((paragraph) => {
    const rects = paragraph.lines.flatMap((line, i) => {
      let x = {
        center: (maxW - line.w) / 2,
        left: 0,
        right: maxW - line.w,
      }[alignH];
      const rects = line.chunks.map((chunk) => {
        const rect = { ...chunk, x, y };
        x += chunk.w;
        return rect;
      });
      y += i === paragraph.lines.length - 1 ? fontSize : fontSize * lineHeight;
      return rects;
    });
    y += paragraphGap;
    return rects;
  });

  return [rects, fontSize, h];
}
