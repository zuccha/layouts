import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import {
  deselectActiveLayoutSelectedItem,
  useActiveData,
  useActiveLayoutBleed,
  useActiveLayoutSelectedItemId,
  useActiveLayoutSelectedItemSnapping,
  useActiveLayoutSize,
} from "../app-store";
import { useShowBleedGuide, useShowCardGuide } from "../hooks/use-settings";
import type { Data } from "../models/data";
import PreviewFrame from "./preview-frame";
import PreviewGuide, { PreviewGuideLine } from "./preview-guide";
import PreviewSelection from "./preview-selection";
import PreviewToolbox from "./preview-toolbox";

export default function Preview() {
  const data = useActiveData();

  const [scale, setScale] = useState(1);
  const [size, setSize] = useState<{ h: number; w: number } | undefined>();
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const updateStageSize = () => {
    if (!containerRef.current) return;
    const { offsetHeight, offsetWidth } = containerRef.current;
    setSize({ h: offsetHeight, w: offsetWidth });
  };

  const updateStageScale = (e: WheelEvent) => {
    e.preventDefault();

    if (e.ctrlKey) setScale((s) => Math.max(s + e.deltaY * -0.01, 0));
    else setOffset(({ x, y }) => ({ x: x + e.deltaX, y: y + e.deltaY }));
  };

  useEffect(() => {
    updateStageSize();
    window.addEventListener("resize", updateStageSize);
    return () => window.removeEventListener("resize", updateStageSize);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    container?.addEventListener("wheel", updateStageScale, { passive: false });
    return () => container?.removeEventListener("wheel", updateStageScale);
  }, []);

  return (
    <Flex
      bgColor="bg.subtle"
      cursor="default"
      flex={1}
      h="100%"
      overflow="hidden"
      position="relative"
      ref={containerRef}
      userSelect="none"
      w="100%"
    >
      {size && (
        <PreviewStage data={data} offset={offset} scale={scale} size={size} />
      )}
    </Flex>
  );
}

function PreviewStage({
  data,
  offset,
  scale,
  size,
}: {
  data: Data;
  offset: { x: number; y: number };
  scale: number;
  size: { h: number; w: number };
}) {
  const selectedItemId = useActiveLayoutSelectedItemId();

  const [showCardGuide] = useShowCardGuide();
  const [showBleedGuide] = useShowBleedGuide();
  const snapping = useActiveLayoutSelectedItemSnapping();

  const bleed = useActiveLayoutBleed();
  const bleedW = bleed.visible ? bleed.w : 0;
  const bleedH = bleed.visible ? bleed.h : 0;

  const layoutSize = useActiveLayoutSize();
  const layoutX = bleedW;
  const layoutY = bleedH;

  const frameX = size.w / 2 - layoutSize.w / 2 + offset.x - bleedW;
  const frameY = size.h / 2 - layoutSize.h / 2 + offset.y - bleedH;
  const frameH = layoutSize.h + 2 * bleedH;
  const frameW = layoutSize.w + 2 * bleedW;

  const bleedSize = { h: frameH, w: frameW };

  const scaledFrameX =
    size.w / 2 - (layoutSize.w / 2 + bleedW) * scale + offset.x;
  const scaledFrameY =
    size.h / 2 - (layoutSize.h / 2 + bleedH) * scale + offset.y;

  const bleedGuideOffset = { x: scaledFrameX, y: scaledFrameY };

  const layoutGuideOffset = {
    x: scaledFrameX + bleedW * scale,
    y: scaledFrameY + bleedH * scale,
  };

  const selectionOffset = {
    x: offset.x + bleedW * scale,
    y: offset.y + bleedH * scale,
  };

  const snappingBorder = 2;

  return (
    <Box h="full" onClick={() => deselectActiveLayoutSelectedItem()} w="full">
      <PreviewFrame
        bleedColor={bleed.color}
        bleedVisible={bleed.visible}
        data={data}
        frameH={frameH}
        frameW={frameW}
        frameX={frameX}
        frameY={frameY}
        layoutH={layoutSize.h}
        layoutW={layoutSize.w}
        layoutX={layoutX}
        layoutY={layoutY}
        scale={scale}
      />

      {showCardGuide && (
        <PreviewGuide
          color="red.400"
          offset={layoutGuideOffset}
          scale={scale}
          size={layoutSize}
        />
      )}

      {showBleedGuide && bleed.visible && (
        <PreviewGuide
          color="purple.400"
          offset={bleedGuideOffset}
          scale={scale}
          size={bleedSize}
        />
      )}

      {selectedItemId && (
        <PreviewSelection
          containerSize={size}
          frameSize={bleedSize}
          itemId={selectedItemId}
          offset={selectionOffset}
          scale={scale}
        />
      )}

      {snapping.x0 !== undefined && (
        <PreviewGuideLine
          border={snappingBorder}
          color="yellow.400"
          x={(bleedW + snapping.x0) * scale + scaledFrameX - snappingBorder}
        />
      )}

      {snapping.x1 !== undefined && (
        <PreviewGuideLine
          border={snappingBorder}
          color="yellow.400"
          x={(bleedW + snapping.x1) * scale + scaledFrameX}
        />
      )}

      {snapping.y0 !== undefined && (
        <PreviewGuideLine
          border={snappingBorder}
          color="yellow.400"
          y={(bleedH + snapping.y0) * scale + scaledFrameY - snappingBorder}
        />
      )}

      {snapping.y1 !== undefined && (
        <PreviewGuideLine
          border={snappingBorder}
          color="yellow.400"
          y={(bleedH + snapping.y1) * scale + scaledFrameY}
        />
      )}

      <PreviewToolbox
        bottom={10}
        left={size.w / 2}
        position="absolute"
        transform="translateX(-50%)"
      />
    </Box>
  );
}
