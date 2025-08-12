import { Group, Rect } from "react-konva";
import { useActiveLayoutItem } from "../app-store";
import useActiveLayoutFrame from "../hooks/use-active-layout-frame";
import useDragItem from "../hooks/use-drag-item";

export type CanvasSelectionProps = {
  itemId: string;
  scale: number;
};

export default function CanvasSelection({
  itemId,
  scale,
}: CanvasSelectionProps) {
  const item = useActiveLayoutItem(itemId);

  const move = useDragItem(item, scale, "move");

  const { bleedH, bleedW, frameX, frameY } = useActiveLayoutFrame();

  const strokeWidth = 2;

  const w = item.x1 - item.x0 + strokeWidth;
  const h = item.y1 - item.y0 + strokeWidth;

  return (
    <Group>
      <Rect
        height={h}
        onClick={(e) => e.evt.stopPropagation()}
        onPointerDown={(e) => move(e.evt)}
        stroke="#60a5fa"
        strokeWidth={strokeWidth}
        width={w}
        x={item.x0 + frameX + bleedW - strokeWidth / 2}
        y={item.y0 + frameY + bleedH - strokeWidth / 2}
      />
    </Group>
  );
}
