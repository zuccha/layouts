import { Box } from "@chakra-ui/react";
import { forwardRef } from "react";
import { useActiveLayoutItem, useActiveLayoutItemIds } from "../app-store";
import type { Data } from "../models/data";
import PreviewBox from "./preview-box";
import PreviewImage from "./preview-image";
import PreviewText from "./preview-text";

export type PreviewFrameRefObject = HTMLDivElement;

export type PreviewFrameProps = {
  bleedColor: string;
  bleedVisible: boolean;
  data: Data;
  frameH: number;
  frameW: number;
  frameX: number;
  frameY: number;
  layoutH: number;
  layoutX: number;
  layoutY: number;
  layoutW: number;
  scale: number;
};

export default forwardRef<PreviewFrameRefObject, PreviewFrameProps>(
  function PreviewFrame(
    {
      bleedColor,
      bleedVisible,
      data,
      frameW,
      frameH,
      frameX,
      frameY,
      layoutH,
      layoutX,
      layoutY,
      layoutW,
      scale,
    },
    ref,
  ) {
    const itemIds = useActiveLayoutItemIds();

    return (
      <Box
        height={`${frameH}px`}
        left={`${frameX}px`}
        position="absolute"
        ref={ref}
        top={`${frameY}px`}
        transform={`scale(${scale})`}
        transformOrigin="center"
        width={`${frameW}px`}
      >
        {bleedVisible && (
          <Box
            bgColor={bleedColor}
            height="full"
            position="absolute"
            width="full"
          />
        )}

        <Box
          height={`${layoutH}px`}
          left={`${layoutX}px`}
          position="absolute"
          top={`${layoutY}px`}
          width={`${layoutW}px`}
        >
          {itemIds.map((itemId) => (
            <PreviewItem data={data} itemId={itemId} key={itemId} />
          ))}
        </Box>
      </Box>
    );
  },
);

function PreviewItem({ data, itemId }: { data: Data; itemId: string }) {
  const item = useActiveLayoutItem(itemId);
  return item._type === "image" ? (
    <PreviewImage data={data} item={item} />
  ) : item._type === "text" ? (
    <PreviewText data={data} item={item} />
  ) : (
    <PreviewBox item={item} />
  );
}
