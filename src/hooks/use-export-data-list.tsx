import { BlobWriter, Data64URIReader, ZipWriter } from "@zip.js/zip.js";
import { createRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import type { DownloadableDivRefObject } from "../app/downloadable-div";
import DownloadableDiv from "../app/downloadable-div";
import PreviewFrame from "../app/preview-frame";
import {
  useActiveLayoutBleed,
  useActiveLayoutSize,
  useDataList,
} from "../app-store";
import type { Data } from "../models/data";
import { ThemeProvider } from "../theme/theme-provider";
import { wait } from "../utils/promise";
import { interpolateText } from "./use-interpolated-text";

export default function useExportDataList({
  dpi,
  imageName,
  folder,
  onProgress,
  ppi,
}: {
  dpi: number;
  imageName: string;
  folder: string;
  onProgress: (count: number) => void;
  ppi: number;
}) {
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

  const dataList = useDataList();
  const digitsCount = getDigitsCount(dataList.length);

  return useCallback(async () => {
    const blobWriter = new BlobWriter("application/zip");
    const writer = new ZipWriter(blobWriter);

    const container = document.createElement("div");
    container.style.position = "absolute";
    container.style.top = "-10000px";
    document.body.appendChild(container);

    const root = createRoot(container);

    const exportData = async (data: Data, index: number) => {
      const ref = createRef<DownloadableDivRefObject>();

      root.render(
        <ThemeProvider>
          <DownloadableDiv dpi={dpi} h={frameH} ppi={ppi} ref={ref} w={frameW}>
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
        </ThemeProvider>,
      );

      await wait(100);

      if (!ref.current)
        return Promise.reject(`useExportDataList(${index}): no ref`);

      const url = await ref.current.downloadPng();
      const reader = new Data64URIReader(url);
      const suffix = interpolateText(imageName, data);
      const name = suffix
        ? padL(`${index}`, digitsCount, "0") + "-" + suffix
        : padL(`${index}`, digitsCount, "0");
      await writer.add(`${folder}/${name}.png`, reader);
    };

    for (let i = 0; i < dataList.length; ++i) {
      await exportData(dataList[i], i);
      onProgress(i);
    }

    await writer.close();
    const blob = await blobWriter.getData();

    const link = document.createElement("a");
    link.download = `${folder}.zip`;
    link.href = URL.createObjectURL(blob);
    link.click();

    root.unmount();
    container.remove();
  }, [
    bleed.color,
    bleed.visible,
    dataList,
    digitsCount,
    dpi,
    folder,
    frameH,
    frameW,
    imageName,
    layoutSize.h,
    layoutSize.w,
    layoutX,
    layoutY,
    onProgress,
    ppi,
  ]);
}

function getDigitsCount(n: number): number {
  let digitsCount = 1;
  while (n >= 10) {
    digitsCount++;
    n /= 10;
  }
  return digitsCount;
}

function padL(text: string, size: number, char: string): string {
  return `${char.repeat(size - text.length)}${text}`;
}
