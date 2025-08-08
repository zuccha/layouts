import type { ReactNode } from "react";
import { Group, Rect } from "react-konva";
import type { LayoutItemBox } from "../models/layout";

export type CanvasItemBoxProps = {
  children?: (w: number, h: number) => ReactNode;
  item: LayoutItemBox;
};

export default function CanvasItemBox({ children, item }: CanvasItemBoxProps) {
  const w = item.x1 - item.x0 - item.border.width;
  const h = item.y1 - item.y0 - item.border.width;

  const contentW = w - item.pl - item.pr;
  const contentH = h - item.pt - item.pb;

  return (
    <Group
      height={h}
      width={w}
      x={item.x0 + item.border.width / 2}
      y={item.y0 + item.border.width / 2}
    >
      <Rect
        cornerRadius={[
          item.border.radius.tl,
          item.border.radius.tr,
          item.border.radius.bl,
          item.border.radius.br,
        ]}
        fill={item.backgroundColor}
        height={h}
        stroke={item.border.color}
        strokeWidth={item.border.width}
        width={w}
      />

      <Group height={contentH} width={contentW} x={item.pl} y={item.pt}>
        {children?.(contentW, contentH)}
      </Group>
    </Group>
  );
}
