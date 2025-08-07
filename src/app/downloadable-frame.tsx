import { Box } from "@chakra-ui/react";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import {
  useActiveLayoutBleed,
  useActiveLayoutSize,
  useExportDpi,
} from "../app-store";
import type { Data } from "../models/data";
import DownloadableDiv, {
  type DownloadableDivRefObject,
} from "./downloadable-div";
import PreviewFrame from "./preview-frame";

export type DownloadableFrameRefObject = {
  downloadPng: () => Promise<string>;
  setData: (data: Data) => void;
};

export default forwardRef<DownloadableFrameRefObject>(
  function DownloadableFrame(_props, ref) {
    const downloadableDivRef = useRef<DownloadableDivRefObject>(null);

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
    const [ppi] = useExportDpi();

    const [data, setData] = useState<Data>({});

    useImperativeHandle(ref, () => ({
      downloadPng: () =>
        downloadableDivRef.current
          ? downloadableDivRef.current.downloadPng()
          : Promise.reject("DownloadableFrame.downloadPng: no ref"),
      setData,
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
            scale={1}
          />
        </DownloadableDiv>
      </Box>
    );
  },
);
