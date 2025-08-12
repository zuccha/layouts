import Konva from "konva";

//------------------------------------------------------------------------------
// Types
//------------------------------------------------------------------------------

export type TextFont = {
  family: string;
  size: number;
  style?: "normal" | "bold" | "italic" | "bold italic";
  transform?: "none" | "capitalize" | "lowercase" | "uppercase";
};

export type PatternFormatting = {
  style?: "normal" | "bold" | "italic" | "bold italic";
  transform?: "none" | "capitalize" | "lowercase" | "uppercase";
};

export type TextPattern = {
  delimiter: { close: string; open: string };
  includeDelimiter: boolean;
  formatting: PatternFormatting;
};

export type TextChunk = {
  style: PatternFormatting["style"];
  text: string;
  w: number;
};

export type TextLine = {
  chunks: TextChunk[];
  w: number;
};

export type TextParagraph = {
  lines: TextLine[];
};

export type Text = {
  paragraphs: TextParagraph[];
};

//------------------------------------------------------------------------------
// Measure Text Chunk
//------------------------------------------------------------------------------

function measureRawText(
  text: string,
  style: PatternFormatting["style"],
  font: TextFont,
): number {
  const textNode = new Konva.Text({
    fontFamily: font.family,
    fontSize: font.size,
    fontStyle: style,
    text,
  });
  return textNode.getTextWidth();
}

//------------------------------------------------------------------------------
// Format Raw Text
//------------------------------------------------------------------------------

function formatRawText(
  text: string,
  formatting: PatternFormatting,
  font: TextFont,
): TextChunk[] {
  const chunks: TextChunk[] = [];
  const transform = formatting.transform ?? font.transform;

  const formattedText =
    transform === "lowercase" ? text.toLowerCase()
    : transform === "uppercase" ? text.toUpperCase()
    : text;

  const parts = formattedText.match(/(\s+|[^\s]+)/g) || [];
  for (const part of parts) {
    const w = measureRawText(part, formatting.style, font);
    chunks.push({ style: formatting.style, text: part, w });
  }

  return chunks;
}

//------------------------------------------------------------------------------
// Break Text Chunk
//------------------------------------------------------------------------------

function breakTextChunk(
  chunk: TextChunk,
  maxW: number,
  font: TextFont,
): TextChunk[] {
  if (chunk.w < maxW || chunk.text.length <= 1) return [chunk];

  const style = chunk.style;
  const middle = Math.floor(chunk.text.length / 2);
  const left = chunk.text.slice(0, middle);
  const right = chunk.text.slice(middle);
  return [
    ...breakTextChunk(
      { ...chunk, text: left, w: measureRawText(left, style, font) },
      maxW,
      font,
    ),
    ...breakTextChunk(
      { ...chunk, text: right, w: measureRawText(right, style, font) },
      maxW,
      font,
    ),
  ];
}

//------------------------------------------------------------------------------
// Parse Raw Text Patterns
//------------------------------------------------------------------------------

function parseRawTextPatterns(
  rawParagraph: string,
  font: TextFont,
  patterns: TextPattern[],
): TextChunk[] {
  let cursor = 0;
  const chunks: TextChunk[] = [];

  while (cursor < rawParagraph.length) {
    let match:
      | { end: number; pattern: TextPattern; start: number }
      | undefined = undefined;

    for (const pattern of patterns) {
      const { close, open } = pattern.delimiter;

      const start = rawParagraph.indexOf(open, cursor);
      if (start === -1) continue;

      const end = rawParagraph.indexOf(close, start + open.length);
      if (end === -1) continue;

      if (!match || start < match.start) match = { end, pattern, start };
    }

    if (!match) {
      const text = rawParagraph.slice(cursor);
      chunks.push(...formatRawText(text, {}, font));
      break;
    }

    const { end, pattern, start } = match;
    const { close, open } = pattern.delimiter;

    if (start > cursor) {
      const text = rawParagraph.slice(cursor, start);
      chunks.push(...formatRawText(text, {}, font));
    }

    const text =
      pattern.includeDelimiter ?
        rawParagraph.slice(start, end + close.length)
      : rawParagraph.slice(start + open.length, end);

    chunks.push(...formatRawText(text, pattern.formatting, font));

    cursor = end + close.length;
  }

  return chunks;
}

//------------------------------------------------------------------------------
// Parse Raw Paragraph
//------------------------------------------------------------------------------

function parseRawParagraph(
  rawParagraph: string,
  font: TextFont,
  patterns: TextPattern[],
  maxW: number,
): TextParagraph {
  const chunksQueue = parseRawTextPatterns(rawParagraph, font, patterns);

  const lines: TextLine[] = [];
  let line: TextLine = { chunks: [], w: 0 };

  while (chunksQueue.length) {
    const chunk = chunksQueue.shift()!;

    if (!chunk.text.length) continue;
    if (!line.chunks.length && /^\s+$/.test(chunk.text)) continue;

    if (line.w + chunk.w < maxW) {
      line.chunks.push(chunk);
      line.w += chunk.w;
    } else {
      chunksQueue.unshift(...breakTextChunk(chunk, maxW, font));
      lines.push(line);
      line = { chunks: [], w: 0 };
    }
  }

  lines.push(line);

  return { lines };
}

//------------------------------------------------------------------------------
// Parse Raw Text
//------------------------------------------------------------------------------

export function parseRawText(
  rawText: string,
  font: TextFont,
  patterns: TextPattern[],
  maxW: number,
): Text {
  const paragraphs = rawText
    .split("\n")
    .map((paragraph) => parseRawParagraph(paragraph, font, patterns, maxW));
  return { paragraphs };
}
