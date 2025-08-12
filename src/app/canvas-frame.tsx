import { Group, Rect } from "react-konva";
import { useActiveData, useActiveLayoutItemIds } from "../app-store";
import useActiveLayoutFrame from "../hooks/use-active-layout-frame";
import CanvasItem from "./canvas-item";

export default function CanvasFrame() {
  const data = useActiveData();
  const itemIds = useActiveLayoutItemIds();

  const {
    bleedColor,
    bleedH,
    bleedVisible,
    bleedW,
    frameH,
    frameW,
    frameX,
    frameY,
    layoutH,
    layoutW,
  } = useActiveLayoutFrame();

  return (
    <Group height={layoutH} width={layoutW} x={frameX} y={frameY}>
      {bleedVisible && (
        <Rect fill={bleedColor} height={frameH} width={frameW} />
      )}

      <Group height={layoutH} width={layoutW} x={bleedW} y={bleedH}>
        {itemIds.map((itemId) => (
          <CanvasItem data={data} itemId={itemId} key={itemId} />
        ))}
      </Group>
    </Group>
  );
}
