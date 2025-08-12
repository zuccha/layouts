import { Group } from "react-konva";
import { useActiveLayoutBleed, useActiveLayoutSize } from "../app-store";
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

  const bleed = useActiveLayoutBleed();
  const bleedW = bleed.visible ? bleed.w : 0;
  const bleedH = bleed.visible ? bleed.h : 0;

  const layoutSize = useActiveLayoutSize();

  const frameW = layoutSize.w + 2 * bleedW;
  const frameH = layoutSize.h + 2 * bleedH;

  const frameX = -frameW / 2;
  const frameY = -frameH / 2;

  const guideStroke = 2;
  const guideW = w / scale;
  const guideH = h / scale;

  const bleedGuide = {
    x0: x / scale + frameX - guideStroke,
    x1: x / scale - frameX,
    y0: y / scale + frameY - guideStroke,
    y1: y / scale - frameY,
  };

  const layoutGuide = {
    x0: x / scale + layoutSize.w / 2 - guideStroke,
    x1: x / scale - layoutSize.w / 2,
    y0: y / scale + layoutSize.h / 2 - guideStroke,
    y1: y / scale - layoutSize.h / 2,
  };

  return (
    <Group scale={{ x: scale, y: scale }}>
      {showBleedGuide && bleed.visible && (
        <CanvasGuide
          color="#c084fc"
          h={guideH}
          stroke={guideStroke}
          w={guideW}
          {...bleedGuide}
        />
      )}

      {showCardGuide && (
        <CanvasGuide
          color="#f87171"
          h={guideH}
          stroke={guideStroke}
          w={guideW}
          {...layoutGuide}
        />
      )}
    </Group>
  );
}
