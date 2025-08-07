import { Box } from "@chakra-ui/react";
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import { useActiveLayoutItem, useActiveLayoutItemIds } from "../app-store";
import type { Data } from "../models/data";
import { createObservable } from "../utils/observable";
import PreviewBox from "./preview-box";
import PreviewImage from "./preview-image";
import PreviewText from "./preview-text";

export type PreviewFrameRefObject = {
  subscribeReady: (callback: (ready: boolean) => void) => void;
  unsubscribeReady: (callback: (ready: boolean) => void) => void;
};

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
    const readyItems = useMemo(
      () => ({ count: itemIds.length, ids: new Set<string>() }),
      [itemIds],
    );

    const { notify, subscribe, unsubscribe } =
      useRef(createObservable<boolean>()).current;

    const onReady = useCallback(
      (itemId: string, ready: boolean) => {
        if (ready) readyItems.ids.add(itemId);
        else readyItems.ids.delete(itemId);
        notify(readyItems.ids.size === readyItems.count);
      },
      [notify, readyItems.count, readyItems.ids],
    );

    useImperativeHandle(ref, () => ({
      subscribeReady: (callback) => subscribe(callback),
      unsubscribeReady: (callback) => unsubscribe(callback),
    }));

    return (
      <Box
        height={`${frameH}px`}
        left={`${frameX}px`}
        position="absolute"
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
            <PreviewItem
              data={data}
              itemId={itemId}
              key={itemId}
              onReady={(ready) => onReady(itemId, ready)}
            />
          ))}
        </Box>
      </Box>
    );
  },
);

function PreviewItem({
  data,
  itemId,
  onReady,
}: {
  data: Data;
  itemId: string;
  onReady?: (ready: boolean) => void;
}) {
  const item = useActiveLayoutItem(itemId);
  return item._type === "image" ? (
    <PreviewImage data={data} item={item} onReady={onReady} />
  ) : item._type === "text" ? (
    <PreviewText data={data} item={item} onReady={onReady} />
  ) : (
    <PreviewBox item={item} onReady={onReady} />
  );
}
