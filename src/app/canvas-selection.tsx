import { Group, Rect } from "react-konva";
import { useActiveLayoutItem } from "../app-store";
import useActiveLayoutFrame from "../hooks/use-active-layout-frame";

export type CanvasSelectionProps = {
  itemId: string;
};

export default function CanvasSelection({ itemId }: CanvasSelectionProps) {
  const item = useActiveLayoutItem(itemId);

  const { bleedH, bleedW, frameX, frameY } = useActiveLayoutFrame();

  const strokeWidth = 2;

  const w = item.x1 - item.x0 + strokeWidth;
  const h = item.y1 - item.y0 + strokeWidth;

  return (
    <Group>
      <Rect
        height={h}
        stroke="#60a5fa"
        strokeWidth={strokeWidth}
        width={w}
        x={item.x0 + frameX + bleedW - strokeWidth / 2}
        y={item.y0 + frameY + bleedH - strokeWidth / 2}
      />
    </Group>
  );
}
