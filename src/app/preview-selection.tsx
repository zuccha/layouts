import { Box } from "@chakra-ui/react";
import { useActiveLayoutItem } from "../app-store";
import useDragItem from "../hooks/use-drag-item";

export type PreviewSelectionProps = {
  containerSize: { h: number; w: number };
  frameSize: { h: number; w: number };
  itemId: string;
  scale: number;
  offset: { x: number; y: number };
};

export default function PreviewSelection({
  containerSize,
  frameSize,
  itemId,
  scale,
  offset,
}: PreviewSelectionProps) {
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

  const border = 2;

  const itemOffsetX = (item.x0 - frameSize.w / 2) * scale;
  const x = offset.x + containerSize.w / 2 + itemOffsetX - border;
  const w = Math.abs(item.x1 - item.x0) * scale;

  const itemOffsetY = (item.y0 - frameSize.h / 2) * scale;
  const y = offset.y + containerSize.h / 2 + itemOffsetY - border;
  const h = Math.abs(item.y1 - item.y0) * scale;

  const cornerSize = 8;
  const cornerOffset = `${-border / 2 - border - cornerSize / 2}px`;
  const corner = { border, offset: cornerOffset, size: cornerSize };

  const sideSize = 2 * corner.border + corner.size;
  const side = { offset: cornerOffset };

  return (
    <Box
      borderColor="blue.400"
      borderWidth={`${border}px`}
      boxSizing="content-box"
      h={`${h}px`}
      left={`${x}px`}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={move}
      position="absolute"
      top={`${y}px`}
      w={`${w}px`}
    >
      <SideHandle {...side} h={sideSize} onResize={resizeT} pos="t" w={w} />
      <SideHandle {...side} h={sideSize} onResize={resizeB} pos="b" w={w} />
      <SideHandle {...side} h={h} onResize={resizeL} pos="l" w={sideSize} />
      <SideHandle {...side} h={h} onResize={resizeR} pos="r" w={sideSize} />

      <CornerHandle {...corner} onResize={resizeTL} pos="tl" />
      <CornerHandle {...corner} onResize={resizeTR} pos="tr" />
      <CornerHandle {...corner} onResize={resizeBL} pos="bl" />
      <CornerHandle {...corner} onResize={resizeBR} pos="br" />
    </Box>
  );
}

function CornerHandle({
  border,
  pos,
  offset,
  onResize,
  size,
}: {
  border: number;
  pos: "bl" | "br" | "tl" | "tr";
  offset: number | string;
  onResize: (e: React.PointerEvent) => void;
  size: number;
}) {
  const props = {
    bl: { bottom: offset, cursor: "nesw-resize", left: offset },
    br: { bottom: offset, cursor: "nwse-resize", right: offset },
    tl: { cursor: "nwse-resize", left: offset, top: offset },
    tr: { cursor: "nesw-resize", right: offset, top: offset },
  }[pos];

  return (
    <Box
      {...props}
      bgColor="white"
      borderColor="blue.400"
      borderWidth={`${border}px`}
      boxSizing="content-box"
      h={`${size}px`}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={onResize}
      position="absolute"
      w={`${size}px`}
    />
  );
}

function SideHandle({
  h,
  offset,
  onResize,
  pos,
  w,
}: {
  h: number;
  offset: number | string;
  onResize: (e: React.PointerEvent) => void;
  pos: "b" | "l" | "r" | "t";
  w: number;
}) {
  const props = {
    b: { bottom: offset, cursor: "ns-resize" },
    l: { cursor: "ew-resize", left: offset },
    r: { cursor: "ew-resize", right: offset },
    t: { cursor: "ns-resize", top: offset },
  }[pos];

  return (
    <Box
      {...props}
      h={`${h}px`}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={onResize}
      position="absolute"
      w={`${w}px`}
    />
  );
}
