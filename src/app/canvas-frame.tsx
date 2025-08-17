import Konva from "konva";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Group, Rect } from "react-konva";
import {
  useActiveData,
  useActiveLayoutItemIds,
  useExportDpi,
  useExportPpi,
} from "../app-store";
import useActiveLayoutFrame from "../hooks/use-active-layout-frame";
import CanvasItem from "./canvas-item";

export type CanvasFrameRefObject = {
  toPng: () => string | undefined;
};

export type CanvasFrameRef = {
  current: CanvasFrameRefObject | null;
};

export type CanvasFrameProps = {
  scale: number;
  x: number;
  y: number;
};

export default forwardRef<CanvasFrameRefObject, CanvasFrameProps>(
  function CanvasFrame({ scale, x, y }, ref) {
    const groupRef = useRef<Konva.Group>(null);

    const data = useActiveData();
    const itemIds = useActiveLayoutItemIds();

    const [dpi] = useExportDpi();
    const [ppi] = useExportPpi();

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

    useImperativeHandle(ref, () => ({
      toPng: () =>
        groupRef.current?.toDataURL({
          height: frameH * scale,
          pixelRatio: dpi / ppi,
          width: frameW * scale,
          x: x + frameX * scale,
          y: y + frameY * scale,
        }),
    }));

    return (
      <Group
        height={frameH}
        ref={groupRef}
        width={frameW}
        x={frameX}
        y={frameY}
      >
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
  },
);
