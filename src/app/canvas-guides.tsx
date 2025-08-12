import { Group } from "react-konva";
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

  const { bleedVisible, frameX, frameY, layoutH, layoutW } =
    useActiveLayoutFrame();

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
    x0: x / scale + layoutW / 2 - guideStroke,
    x1: x / scale - layoutW / 2,
    y0: y / scale + layoutH / 2 - guideStroke,
    y1: y / scale - layoutH / 2,
  };

  return (
    <Group scale={{ x: scale, y: scale }}>
      {showBleedGuide && bleedVisible && (
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
