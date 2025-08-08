import { Group, Rect } from "react-konva";
import {
  useActiveData,
  useActiveLayoutBleed,
  useActiveLayoutItemIds,
  useActiveLayoutSize,
} from "../app-store";
import CanvasItem from "./canvas-item";

export default function CanvasFrame() {
  const data = useActiveData();
  const itemIds = useActiveLayoutItemIds();

  const bleed = useActiveLayoutBleed();
  const bleedW = bleed.visible ? bleed.w : 0;
  const bleedH = bleed.visible ? bleed.h : 0;

  const layoutSize = useActiveLayoutSize();

  const frameW = layoutSize.w + 2 * bleedW;
  const frameH = layoutSize.h + 2 * bleedH;

  return (
    <Group
      height={layoutSize.h}
      width={layoutSize.w}
      x={-frameW / 2}
      y={-frameH / 2}
    >
      {bleed.visible && (
        <Rect fill={bleed.color} height={frameH} width={frameW} />
      )}

      <Group height={layoutSize.h} width={layoutSize.w} x={bleedW} y={bleedH}>
        {itemIds.map((itemId) => (
          <CanvasItem data={data} itemId={itemId} key={itemId} />
        ))}
      </Group>
    </Group>
  );
}
