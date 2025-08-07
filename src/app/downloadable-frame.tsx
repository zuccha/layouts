import { Box } from "@chakra-ui/react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
  useActiveLayoutBleed,
  useActiveLayoutSize,
  useExportDpi,
  useExportPpi,
} from "../app-store";
import type { Data } from "../models/data";
import DownloadableDiv, {
  type DownloadableDivRefObject,
} from "./downloadable-div";
import PreviewFrame, { type PreviewFrameRefObject } from "./preview-frame";

export type DownloadableFrameRefObject = {
  downloadPng: () => Promise<string>;
  setData: (data: Data) => void;
  subscribeReady: (callback: (ready: boolean) => void) => void;
  unsubscribeReady: (callback: (ready: boolean) => void) => void;
};

export default forwardRef<DownloadableFrameRefObject>(
  function DownloadableFrame(_props, ref) {
    const downloadableDivRef = useRef<DownloadableDivRefObject>(null);
    const previewFrameRef = useRef<PreviewFrameRefObject>(null);

    const bleed = useActiveLayoutBleed();
    const bleedW = bleed.visible ? bleed.w : 0;
    const bleedH = bleed.visible ? bleed.h : 0;

    const layoutSize = useActiveLayoutSize();
    const layoutX = bleedW;
    const layoutY = bleedH;

    const frameX = 0;
    const frameY = 0;
    const frameH = layoutSize.h + 2 * bleedH;
    const frameW = layoutSize.w + 2 * bleedW;

    const [dpi] = useExportDpi();
    const [ppi] = useExportPpi();

    const [data, setData] = useState<Data>({});

    useImperativeHandle(ref, () => ({
      downloadPng: () =>
        downloadableDivRef.current
          ? downloadableDivRef.current.downloadPng()
          : Promise.reject("DownloadableFrame.downloadPng: no ref"),
      setData,
      subscribeReady: previewFrameRef.current?.subscribeReady ?? (() => {}),
      unsubscribeReady: previewFrameRef.current?.unsubscribeReady ?? (() => {}),
    }));

    return (
      <Box position="absolute" top="-10000px">
        <DownloadableDiv
          dpi={dpi}
          h={frameH}
          ppi={ppi}
          ref={downloadableDivRef}
          w={frameW}
        >
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
            ref={previewFrameRef}
            scale={1}
          />
        </DownloadableDiv>
      </Box>
    );
  },
);
