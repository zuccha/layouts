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
  const resizeT = useDragItem(item, scale, "resize-t");
  const resizeB = useDragItem(item, scale, "resize-b");
  const resizeL = useDragItem(item, scale, "resize-l");
  const resizeR = useDragItem(item, scale, "resize-r");
  const resizeTL = useDragItem(item, scale, "resize-tl");
  const resizeTR = useDragItem(item, scale, "resize-tr");
  const resizeBL = useDragItem(item, scale, "resize-bl");
  const resizeBR = useDragItem(item, scale, "resize-br");

  const { bleedH, bleedW, frameX, frameY } = useActiveLayoutFrame();

  const strokeWidth = 2;

  const w = Math.max(item.x1 - item.x0, 0) + strokeWidth;
  const h = Math.max(item.y1 - item.y0, 0) + strokeWidth;

  const x = item.x0 + frameX + bleedW - strokeWidth / 2;
  const y = item.y0 + frameY + bleedH - strokeWidth / 2;

  const handleSize = 8;
  const handleOffset = -handleSize / 2;

  return (
    <Group x={x} y={y}>
      <Rect
        height={h}
        onClick={(e) => (e.cancelBubble = true)}
        onPointerDown={(e) => move(e.evt)}
        stroke="#60a5fa"
        strokeWidth={strokeWidth}
        width={w}
      />

      <CanvasSelectionSide
        cursor="ns-resize"
        onResize={resizeT}
        w={w}
        y={handleOffset}
      />

      <CanvasSelectionSide
        cursor="ns-resize"
        onResize={resizeB}
        w={w}
        y={h + handleOffset}
      />

      <CanvasSelectionSide
        cursor="ew-resize"
        h={h}
        onResize={resizeL}
        x={handleOffset}
      />

      <CanvasSelectionSide
        cursor="ew-resize"
        h={h}
        onResize={resizeR}
        x={w + handleOffset}
      />

      <CanvasSelectionCorner
        cursor="nwse-resize"
        onResize={resizeTL}
        x={handleOffset}
        y={handleOffset}
      />

      <CanvasSelectionCorner
        cursor="nesw-resize"
        onResize={resizeTR}
        x={handleOffset + w}
        y={handleOffset}
      />

      <CanvasSelectionCorner
        cursor="nesw-resize"
        onResize={resizeBL}
        x={handleOffset}
        y={handleOffset + h}
      />

      <CanvasSelectionCorner
        cursor="nwse-resize"
        onResize={resizeBR}
        x={handleOffset + w}
        y={handleOffset + h}
      />
    </Group>
  );
}

function CanvasSelectionCorner({
  onResize,
  x,
  y,
}: {
  cursor: string;
  onResize: (e: PointerEvent) => void;
  x: number;
  y: number;
}) {
  const strokeWidth = 2;
  const handleSize = 8;

  return (
    <Rect
      fill="white"
      height={handleSize}
      onClick={(e) => (e.cancelBubble = true)}
      onPointerDown={(e) => onResize(e.evt)}
      stroke={"#60a5fa"}
      strokeWidth={strokeWidth}
      width={handleSize}
      x={x}
      y={y}
    />
  );
}

function CanvasSelectionSide({
  onResize,
  h,
  w,
  x = 0,
  y = 0,
}: {
  cursor: string;
  onResize: (e: PointerEvent) => void;
  h?: number;
  w?: number;
  x?: number;
  y?: number;
}) {
  const handleSize = 8;

  return (
    <Rect
      height={h ?? handleSize}
      onClick={(e) => (e.cancelBubble = true)}
      onPointerDown={(e) => onResize(e.evt)}
      width={w ?? handleSize}
      x={x}
      y={y}
    />
  );
}
