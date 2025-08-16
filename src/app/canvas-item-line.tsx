import { Line } from "react-konva";
import { selectActiveLayoutSelectedItem } from "../app-store";
import type { LayoutItemLine } from "../models/layout";

export type CanvasItemLineProps = {
  item: LayoutItemLine;
};

export default function CanvasItemLine({ item }: CanvasItemLineProps) {
  return (
    <Line
      onClick={(e) => {
        e.cancelBubble = true;
        selectActiveLayoutSelectedItem(item.id);
      }}
      points={[item.x0, item.y0, item.x1, item.y1]}
      stroke={item.color}
      strokeWidth={item.thickness}
    />
  );
}
