import { Group, Rect } from "react-konva";
import useActiveLayoutFrame from "../hooks/use-active-layout-frame";
import useDragItem from "../hooks/use-drag-item";
import type { LayoutItemLine } from "../models/layout";

export type CanvasSelectionLineProps = {
  item: LayoutItemLine;
  scale: number;
};

export default function CanvasSelectionLine({
  item,
  scale,
}: CanvasSelectionLineProps) {
  const move = useDragItem(item, scale, "move");
  const move0 = useDragItem(item, scale, "move-0");
  const move1 = useDragItem(item, scale, "move-1");

  const { bleedH, bleedW, frameX, frameY } = useActiveLayoutFrame();

  const strokeWidth = 2;

  const w = Math.abs(item.x1 - item.x0) + strokeWidth;
  const h = Math.abs(item.y1 - item.y0) + strokeWidth;

  const handleSize = 8;
  const handleOffset = -handleSize / 2;
  const offsetX =
    frameX + bleedW - strokeWidth / 2 + handleOffset + item.thickness / 2;
  const offsetY =
    frameY + bleedH - strokeWidth / 2 + handleOffset + item.thickness / 2;

  const x0 = item.x0 + offsetX;
  const y0 = item.y0 + offsetY;

  const x1 = item.x1 + offsetX;
  const y1 = item.y1 + offsetY;

  return (
    <Group>
      <Rect
        height={h}
        onClick={(e) => (e.cancelBubble = true)}
        onPointerDown={(e) => move(e.evt)}
        width={w}
        x={Math.min(x0, x1)}
        y={Math.min(y0, y1)}
      />

      <CanvasSelectionPoint onMove={move0} x={x0} y={y0} />
      <CanvasSelectionPoint onMove={move1} x={x1} y={y1} />
    </Group>
  );
}

function CanvasSelectionPoint({
  onMove,
  x,
  y,
}: {
  onMove: (e: PointerEvent) => void;
  x: number;
  y: number;
}) {
  const strokeWidth = 2;
  const handleSize = 8;

  return (
    <Rect
      cornerRadius={100}
      fill="white"
      height={handleSize}
      onClick={(e) => (e.cancelBubble = true)}
      onPointerDown={(e) => onMove(e.evt)}
      stroke={"#60a5fa"}
      strokeWidth={strokeWidth}
      width={handleSize}
      x={x}
      y={y}
    />
  );
}
