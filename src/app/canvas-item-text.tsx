import type { Data } from "@dnd-kit/core";
import Konva from "konva";
import { useMemo } from "react";
import { Text } from "react-konva";
import useInterpolatedText from "../hooks/use-interpolated-text";
import type { LayoutItemText, Pattern } from "../models/layout";
import CanvasItemBox from "./canvas-item-box";

export type CanvasItemTextProps = {
  data: Data;
  item: LayoutItemText;
};

export default function CanvasItemText({ data, item }: CanvasItemTextProps) {
  return (
    <CanvasItemBox item={item}>
      {(w, h) => <CanvasItemTextAux data={data} h={h} item={item} w={w} />}
    </CanvasItemBox>
  );
}

function CanvasItemTextAux({
  data,
  h,
  item,
  w,
}: { h: number; w: number } & CanvasItemTextProps) {
  const text = useInterpolatedText(item.text, data);

  const fontStyle = useMemo(
    () => computeFontStyle(item.fontWeight, item.fontStyle),
    [item.fontStyle, item.fontWeight],
  );

  const [textChunkRects, fontSize] = useMemo(() => {
    const paragraphs = text.split("\n");
    let fontSize = item.fontSize;
    let textChunkRects: TextChunkRect[][][] = [];
    let lastChunkRect: TextChunkRect | undefined = undefined;

    do {
      textChunkRects = computeTextChunkRects(
        paragraphs,
        w,
        item.patterns,
        item.fontFamily,
        fontSize,
        item.lineHeight,
        item.paragraphGap,
        item.textTransform,
      );
      fontSize -= 0.1;
      lastChunkRect = last(last(last(textChunkRects)));
    } while (
      lastChunkRect &&
      lastChunkRect.y + fontSize + 0.1 > h &&
      fontSize > 1
    );

    return [
      alignTextChunkRects(
        textChunkRects,
        w,
        h,
        fontSize,
        item.alignH,
        item.alignV,
      ),
      fontSize,
    ];
  }, [
    h,
    item.alignH,
    item.alignV,
    item.fontFamily,
    item.fontSize,
    item.lineHeight,
    item.paragraphGap,
    item.patterns,
    item.textTransform,
    text,
    w,
  ]);

  return textChunkRects.map((textChunkRect, i) => (
    <Text
      fill={item.textColor}
      fontFamily={item.fontFamily}
      fontSize={fontSize}
      fontStyle={textChunkRect.fontStyle ?? fontStyle}
      height={textChunkRect.h}
      key={i}
      text={textChunkRect.text}
      width={textChunkRect.w}
      x={textChunkRect.x}
      y={textChunkRect.y}
    />
  ));
}

type TextChunk = {
  fontStyle?: "normal" | "bold" | "italic" | "bold italic";
  text: string;
  textTransform?: "none" | "capitalize" | "lowercase" | "uppercase";
};

type TextChunkRect = TextChunk & {
  h: number;
  w: number;
  x: number;
  y: number;
};

type TextChunkPattern = Pattern & {
  fontStyle: TextChunk["fontStyle"];
};

type TextChunkMatch = {
  end: number;
  pattern: TextChunkPattern;
  start: number;
};

function alignTextChunkRects(
  textChunkRects: TextChunkRect[][][],
  w: number,
  h: number,
  fontSize: number,
  alignH: LayoutItemText["alignH"],
  alignV: LayoutItemText["alignV"],
): TextChunkRect[] {
  const lastTextChunkRect = last(last(last(textChunkRects)))!;
  const offsetY = {
    bottom: h - (lastTextChunkRect.y + fontSize),
    middle: (h - (lastTextChunkRect.y + fontSize)) / 2,
    top: 0,
  }[alignV];

  return textChunkRects.flatMap((paragraphTextChunkRects) => {
    return paragraphTextChunkRects.flatMap((lineTextChunkRects) => {
      const lineW = lineTextChunkRects.reduce(
        (partialLineW, textChunkRect) => partialLineW + textChunkRect.w,
        0,
      );
      const offsetX = {
        center: (w - lineW) / 2,
        left: 0,
        right: w - lineW,
      }[alignH];

      return lineTextChunkRects.map((textChunkRect) => {
        return {
          ...textChunkRect,
          x: textChunkRect.x + offsetX,
          y: textChunkRect.y + offsetY,
        };
      });
    });
  });
}

function computeTextChunkRects(
  paragraphs: string[],
  w: number,
  patterns: LayoutItemText["patterns"],
  fontFamily: string,
  fontSize: number,
  lineHeight: number,
  paragraphGap: number,
  textTransform: LayoutItemText["textTransform"],
): TextChunkRect[][][] {
  let yOffset = 0;
  return paragraphs.map((paragraph) => {
    const paragraphTextChunks = computeParagraphTextChunks(
      paragraph,
      patterns,
    ).map((chunk) => ({
      ...chunk,
      text: transformText(chunk.text, chunk.textTransform ?? textTransform),
    }));
    const paragraphTextChunkRects = computeParagraphChunkRects(
      paragraphTextChunks,
      w,
      yOffset,
      fontFamily,
      fontSize,
      lineHeight,
    );
    yOffset =
      (last(last(paragraphTextChunkRects))?.y ?? 0) + fontSize + paragraphGap;
    return paragraphTextChunkRects;
  });
}

function computeParagraphTextChunks(
  text: string,
  patterns: Pattern[],
): TextChunk[] {
  const chunks: TextChunk[] = [];
  let cursor = 0;

  if (!text) return [{ text: "" }];

  const textChunkPattern: TextChunkPattern[] = patterns
    .filter((pattern) => pattern.delimiter.close && pattern.delimiter.open)
    .map((pattern) => ({
      ...pattern,
      fontStyle: computeFontStyle(
        pattern.styles.fontWeight,
        pattern.styles.fontStyle,
      ),
    }));

  while (cursor < text.length) {
    let firstMatch: TextChunkMatch | undefined = undefined;

    for (const pattern of textChunkPattern) {
      const { open, close } = pattern.delimiter;

      const start = text.indexOf(open, cursor);
      if (start === -1) continue;
      const end = text.indexOf(close, start + open.length);
      if (end === -1) continue;

      if (!firstMatch || start < firstMatch.start)
        firstMatch = { end, pattern, start };
    }

    if (!firstMatch) {
      chunks.push({ text: text.slice(cursor) });
      break;
    }

    const { end, pattern, start } = firstMatch;
    const { close, open } = pattern.delimiter;

    if (start > cursor) chunks.push({ text: text.slice(cursor, start) });

    chunks.push({
      fontStyle: pattern.fontStyle,
      text:
        pattern.delimiterMode === "exclude"
          ? text.slice(start + open.length, end)
          : text.slice(start, end + close.length),
      textTransform: pattern.styles.textTransform,
    });

    cursor = end + close.length;
  }

  return chunks;
}

function computeParagraphChunkRects(
  textChunks: TextChunk[],
  w: number,
  yOffset: number,
  fontFamily: string,
  fontSize: number,
  lineHeight: number,
): TextChunkRect[][] {
  const textChunksQueue = [...textChunks];
  const textChunkRects: TextChunkRect[][] = [];
  let lineTextChunkRects: TextChunkRect[] = [];
  let x = 0;
  let y = yOffset;
  while (textChunksQueue.length) {
    const textChunk = textChunksQueue.shift()!;
    const size = measureTextChunk(textChunk, fontFamily, fontSize);
    if (size.w <= w - x) {
      lineTextChunkRects.push({ ...textChunk, ...size, x, y });
      x += size.w;
    } else if (textChunk.text.length <= 1) {
      x = size.w;
      y += fontSize * lineHeight;
      textChunkRects.push(lineTextChunkRects);
      lineTextChunkRects = [];
      lineTextChunkRects.push({ ...textChunk, ...size, x: 0, y });
    } else if (!/ +/.test(textChunk.text)) {
      if (size.w < w) {
        x = size.w;
        y += fontSize * lineHeight;
        textChunkRects.push(lineTextChunkRects);
        lineTextChunkRects = [];
        lineTextChunkRects.push({ ...textChunk, ...size, x: 0, y });
      } else {
        const middle = Math.floor(textChunk.text.length / 2);
        const left = textChunk.text.slice(0, middle);
        const right = textChunk.text.slice(middle);
        textChunksQueue.unshift({ ...textChunk, text: right });
        textChunksQueue.unshift({ ...textChunk, text: left });
      }
    } else {
      const [left, space, right] = splitInTwo(textChunk.text);
      textChunksQueue.unshift({ ...textChunk, text: right });
      textChunksQueue.unshift({ ...textChunk, text: space });
      textChunksQueue.unshift({ ...textChunk, text: left });
    }
  }
  textChunkRects.push(lineTextChunkRects);
  return textChunkRects;
}

function measureTextChunk(
  textChunk: TextChunk,
  fontFamily: string,
  fontSize: number,
): { h: number; w: number } {
  const textNode = new Konva.Text({
    fontFamily,
    fontSize,
    fontStyle: textChunk.fontStyle,
    text: textChunk.text,
  });
  return { h: textNode.height(), w: textNode.getTextWidth() };
}

function splitInTwo(input: string): [string, string, string] {
  const middle = Math.floor(input.length / 2);
  const spaceRegex = / +/g;

  let best = { dist: Infinity, end: -1, start: -1 };
  let lastMatch: RegExpExecArray | null;

  while ((lastMatch = spaceRegex.exec(input)) !== null) {
    const start = lastMatch.index;
    const end = start + lastMatch[0].length;
    const dist = Math.abs((start + end) / 2 - middle);
    if (dist < best.dist) best = { dist, end, start };
  }

  return best.start === -1
    ? [input.slice(0, middle), "", input.slice(middle)]
    : [
        input.slice(0, best.start),
        input.slice(best.start, best.end),
        input.slice(best.end),
      ];
}

function computeFontStyle(
  fontWeight: LayoutItemText["fontWeight"],
  fontStyle: LayoutItemText["fontStyle"],
) {
  return ([
    fontWeight === "bold" ? "bold" : "",
    fontStyle === "italic" ? "italic" : "",
  ]
    .join(" ")
    .trim() || "normal") as TextChunkPattern["fontStyle"];
}

function transformText(
  text: string,
  textTransform: LayoutItemText["textTransform"],
) {
  return (
    {
      lowercase: text.toLowerCase(),
      uppercase: text.toUpperCase(),
    }[textTransform as string] ?? text
  );
}

function last<T>(list: T[] | undefined): T | undefined {
  return list ? list[list.length - 1] : undefined;
}
