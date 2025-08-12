import { Group, Rect } from "react-konva";
import { useActiveLayoutSelectedItemSnapping } from "../app-store";
import useActiveLayoutFrame from "../hooks/use-active-layout-frame";
import { useShowBleedGuide, useShowCardGuide } from "../hooks/use-settings";
import CanvasGuide from "./canvas-guide";

export type CanvasGuidesProps = {
  h: number;
  scale: number;
  w: number;
  x: number;
  y: number;
};

export default function CanvasGuides({ h, scale, w, x, y }: CanvasGuidesProps) {
  const [showCardGuide] = useShowCardGuide();
  const [showBleedGuide] = useShowBleedGuide();
  const snapping = useActiveLayoutSelectedItemSnapping();

  const { bleedVisible, frameX, frameY, layoutH, layoutW } =
    useActiveLayoutFrame();

  const guideStrokeWidth = 2;
  const guideW = w / scale;
  const guideH = h / scale;

  const bleedGuide = {
    color: "#c084fc",
    x0: x / scale + frameX - guideStrokeWidth,
    x1: x / scale - frameX,
    y0: y / scale + frameY - guideStrokeWidth,
    y1: y / scale - frameY,
  };

  const layoutGuide = {
    color: "#f87171",
    x0: x / scale + layoutW / 2 - guideStrokeWidth,
    x1: x / scale - layoutW / 2,
    y0: y / scale + layoutH / 2 - guideStrokeWidth,
    y1: y / scale - layoutH / 2,
  };

  const snappingGuideColor = "#facc15";
  const snappingX = x / scale - layoutW / 2;
  const snappingY = y / scale - layoutH / 2;

  return (
    <Group scale={{ x: scale, y: scale }}>
      {showBleedGuide && bleedVisible && (
        <CanvasGuide
          h={guideH}
          stroke={guideStrokeWidth}
          w={guideW}
          {...bleedGuide}
        />
      )}

      {showCardGuide && (
        <CanvasGuide
          h={guideH}
          stroke={guideStrokeWidth}
          w={guideW}
          {...layoutGuide}
        />
      )}

      {snapping.x0 !== undefined && (
        <Rect
          fill={snappingGuideColor}
          height={guideH}
          width={guideStrokeWidth}
          x={snappingX + snapping.x0 - guideStrokeWidth}
        />
      )}

      {snapping.x1 !== undefined && (
        <Rect
          fill={snappingGuideColor}
          height={guideH}
          width={guideStrokeWidth}
          x={snappingX + snapping.x1}
        />
      )}

      {snapping.y0 !== undefined && (
        <Rect
          fill={snappingGuideColor}
          height={guideStrokeWidth}
          width={guideW}
          y={snappingY + snapping.y0 - guideStrokeWidth}
        />
      )}

      {snapping.y1 !== undefined && (
        <Rect
          fill={snappingGuideColor}
          height={guideStrokeWidth}
          width={guideW}
          y={snappingY + snapping.y1}
        />
      )}
    </Group>
  );
}
