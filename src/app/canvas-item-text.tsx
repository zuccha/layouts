import type { Data } from "@dnd-kit/core";
import { useMemo } from "react";
import { Image, Text } from "react-konva";
import useImage from "use-image";
import useImageUrl from "../hooks/use-image-url";
import useInterpolatedText from "../hooks/use-interpolated-text";
import type { LayoutItemText } from "../models/layout";
import {
  type TextFont,
  parseRawTextAndAdjustHeight,
} from "../utils/text-chunk";
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
          color:
            pattern.styles.textColorCustom ?
              pattern.styles.textColor
            : undefined,
          style: computeFontStyle(
            pattern.styles.fontWeight,
            pattern.styles.fontStyle,
          ),
          transform: pattern.styles.textTransform,
        },
        includeDelimiter: pattern.delimiterMode === "include",
        symbol:
          pattern.type === "symbol" ?
            { path: pattern.symbolPath, shadow: pattern.symbolShadow }
          : undefined,
      })),
    [item.patterns],
  );

  const [textChunkRects, fontSize] = useMemo(() => {
    return parseRawTextAndAdjustHeight(
      text,
      font,
      patterns,
      w,
      h,
      item.lineHeight,
      item.paragraphGap,
      item.sectionGap,
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
    item.sectionGap,
    patterns,
    text,
    w,
  ]);

  return textChunkRects.map((rect, i) =>
    rect.symbol ?
      <Symbol
        key={i}
        shadow={rect.symbol.shadow}
        size={rect.w}
        source={`${rect.symbol.path}/${rect.text}.svg`}
        x={rect.x}
        y={rect.y}
      />
    : <Text
        fill={rect.color ?? item.textColor}
        fontFamily={item.fontFamily}
        fontSize={fontSize}
        fontStyle={rect.style ?? font.style}
        height={fontSize}
        key={i}
        text={rect.text}
        width={rect.w}
        x={rect.x}
        y={rect.y}
      />,
  );
}

function Symbol({
  shadow,
  size,
  source,
  x,
  y,
}: {
  shadow: boolean;
  size: number;
  source: string;
  x: number;
  y: number;
}) {
  const url = useImageUrl(source);
  const [image] = useImage(url ?? "");
  return (
    <Image
      cornerRadius={100}
      height={size}
      image={image}
      shadowColor={shadow ? "black" : undefined}
      shadowOffset={shadow ? { x: 1, y: 1 } : undefined}
      width={size}
      x={x}
      y={y}
    />
  );
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
