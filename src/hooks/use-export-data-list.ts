import { BlobWriter, Data64URIReader, ZipWriter } from "@zip.js/zip.js";
import { useCallback } from "react";
import { useDataList, useDownloadableFrameRef } from "../app-store";
import type { Data } from "../models/data";
import { wait } from "../utils/promise";
import { interpolateText } from "./use-interpolated-text";

export default function useExportDataList({
  folder,
  imageName,
  onProgress,
}: {
  folder: string;
  imageName: string;
  onProgress: (count: number) => void;
}) {
  const dataList = useDataList();
  const digitsCount = getDigitsCount(dataList.length);

  const ref = useDownloadableFrameRef();

  return useCallback(async () => {
    const blobWriter = new BlobWriter("application/zip");
    const writer = new ZipWriter(blobWriter);

    const exportData = async (data: Data, index: number) => {
      if (!ref.current)
        return Promise.reject(`useExportDataList(${index}): no ref`);

      let callback: (ready: boolean) => void = () => {};
      const readyPromise = new Promise<void>((resolve) => {
        callback = (ready: boolean) => ready && resolve();
        ref.current?.subscribeReady(callback);
      });

      ref.current.setData(data);

      await wait(1);
      await readyPromise;
      await wait(1);

      ref.current.unsubscribeReady(callback);

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
  }, [dataList, digitsCount, folder, imageName, onProgress, ref]);
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
