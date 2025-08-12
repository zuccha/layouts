import { BlobWriter, Data64URIReader, ZipWriter } from "@zip.js/zip.js";
import { useCallback } from "react";
import {
  getActiveData,
  switchToNextData,
  useCanvasFrameRef,
  useDataList,
} from "../app-store";
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

  const ref = useCanvasFrameRef();

  return useCallback(async () => {
    const blobWriter = new BlobWriter("application/zip");
    const writer = new ZipWriter(blobWriter);

    const exportData = async () => {
      const [data, index] = getActiveData();

      if (!ref.current)
        return Promise.reject(`useExportDataList(${index}): no ref`);

      const url = ref.current.toPng();
      if (!url) return Promise.reject(`useExportDataList(${index}): no PNG`);

      const reader = new Data64URIReader(url);
      const suffix = interpolateText(imageName, data);
      const name =
        suffix ?
          padL(`${index}`, digitsCount, "0") + "-" + suffix
        : padL(`${index}`, digitsCount, "0");
      await writer.add(`${folder}/${name}.png`, reader);

      switchToNextData();
      await wait(10);
    };

    for (let i = 0; i < dataList.length; ++i) {
      await exportData();
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
