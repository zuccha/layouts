import { Box } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Group, Layer, Stage } from "react-konva";
import {
  deselectActiveLayoutSelectedItem,
  useActiveLayoutSelectedItemId,
  useCanvasFrameRef,
  useCanvasOffset,
  useCanvasScale,
} from "../app-store";
import CanvasDataSelector from "./canvas-data-selector";
import CanvasFrame from "./canvas-frame";
import CanvasGuides from "./canvas-guides";
import CanvasSelection from "./canvas-selection";

export default function Canvas() {
  const canvasFrameRef = useCanvasFrameRef();

  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ h: 0, w: 0 });
  const [scale, setScale] = useCanvasScale();
  const [offset, setOffset] = useCanvasOffset();

  const selectedItemId = useActiveLayoutSelectedItemId();

  const resize = useCallback(() => {
    if (!containerRef.current) return;
    const { offsetHeight, offsetWidth } = containerRef.current;
    setSize({ h: offsetHeight, w: offsetWidth });
  }, []);

  const wheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (e.ctrlKey) setScale((s) => Math.max(s + e.deltaY * -0.01, 0));
      else setOffset(({ x, y }) => ({ x: x - e.deltaX, y: y - e.deltaY }));
    },
    [setOffset, setScale],
  );

  useEffect(() => {
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [resize]);

  useEffect(() => {
    const container = containerRef.current;
    container?.addEventListener("wheel", wheel, { passive: false });
    return () => container?.removeEventListener("wheel", wheel);
  }, [wheel]);

  const x = size.w / 2 + offset.x;
  const y = size.h / 2 + offset.y;

  return (
    <Box
      bgColor="bg.subtle"
      flex={1}
      h="full"
      position="relative"
      ref={containerRef}
    >
      {size.h > 0 && size.w > 0 && (
        <>
          <Stage
            height={size.h}
            onClick={() => deselectActiveLayoutSelectedItem()}
            width={size.w}
          >
            <Layer>
              <Group scale={{ x: scale, y: scale }} x={x} y={y}>
                <CanvasFrame ref={canvasFrameRef} />

                {selectedItemId && (
                  <CanvasSelection itemId={selectedItemId} scale={scale} />
                )}
              </Group>

              <CanvasGuides h={size.h} scale={scale} w={size.w} x={x} y={y} />
            </Layer>
          </Stage>

          <CanvasDataSelector
            bottom={10}
            left={size.w / 2}
            position="absolute"
            transform="translateX(-50%)"
          />
        </>
      )}
    </Box>
  );
}
