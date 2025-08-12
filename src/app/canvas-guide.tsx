import { Group, Rect } from "react-konva";

export type CanvasGuideProps = {
  color: string;
  h: number;
  stroke: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  w: number;
};

export default function CanvasGuide({
  color,
  h,
  stroke,
  x0,
  x1,
  y0,
  y1,
  w,
}: CanvasGuideProps) {
  return (
    <Group>
      <Rect fill={color} height={h} width={stroke} x={x0} />
      <Rect fill={color} height={h} width={stroke} x={x1} />
      <Rect fill={color} height={stroke} width={w} y={y0} />
      <Rect fill={color} height={stroke} width={w} y={y1} />
    </Group>
  );
}
