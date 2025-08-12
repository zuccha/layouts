import type { Data } from "@dnd-kit/core";
import { useMemo } from "react";
import { Text } from "react-konva";
import useInterpolatedText from "../hooks/use-interpolated-text";
import type { LayoutItemText } from "../models/layout";
import type { TextFont } from "../utils/text-chunk";
import { computeTextChunkRects } from "../utils/text-chunk-rect";
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

  const font = useMemo(
    () => ({
      family: item.fontFamily,
      size: item.fontSize,
      style: computeFontStyle(item.fontWeight, item.fontStyle),
      transform: item.textTransform,
    }),
    [
      item.fontFamily,
      item.fontSize,
      item.fontStyle,
      item.fontWeight,
      item.textTransform,
    ],
  );

  const patterns = useMemo(
    () =>
      item.patterns.map((pattern) => ({
        delimiter: pattern.delimiter,
        formatting: {
          style: computeFontStyle(
            pattern.styles.fontWeight,
            pattern.styles.fontStyle,
          ),
          transform: pattern.styles.textTransform,
        },
        includeDelimiter: pattern.delimiterMode === "include",
      })),
    [item.patterns],
  );

  const [textChunkRects, fontSize] = useMemo(() => {
    return computeTextChunkRects(
      text,
      font,
      patterns,
      w,
      h,
      item.lineHeight,
      item.paragraphGap,
      item.alignH,
      item.alignV,
    );
  }, [
    font,
    h,
    item.alignH,
    item.alignV,
    item.lineHeight,
    item.paragraphGap,
    patterns,
    text,
    w,
  ]);

  return textChunkRects.map((textChunkRect, i) => (
    <Text
      fill={item.textColor}
      fontFamily={item.fontFamily}
      fontSize={fontSize}
      fontStyle={textChunkRect.style ?? font.style}
      height={fontSize}
      key={i}
      text={textChunkRect.text}
      width={textChunkRect.w}
      x={textChunkRect.x}
      y={textChunkRect.y}
    />
  ));
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
    .trim() || "normal") as TextFont["style"];
}
