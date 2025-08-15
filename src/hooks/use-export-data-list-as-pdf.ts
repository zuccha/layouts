import { useCallback } from "react";
import {
  getActiveData,
  switchToNextData,
  useCanvasFrameRef,
  useDataList,
} from "../app-store";
import { pngsToPdf } from "../utils/pdf";
import { wait } from "../utils/promise";

export default function useExportDataListAsPdf({
  filename,
  gap,
  h,
  margin,
  onProgress,
  w,
}: {
  filename: string;
  gap: number;
  h: number;
  margin: number;
  onProgress: (count: number) => void;
  w: number;
}) {
  const dataList = useDataList();

  const ref = useCanvasFrameRef();

  return useCallback(async () => {
    const urls: string[] = [];

    const exportData = async () => {
      const [, index] = getActiveData();

      if (!ref.current)
        return Promise.reject(`useExportDataListAsPdf(${index}): no ref`);

      const url = ref.current.toPng();
      if (!url)
        return Promise.reject(`useExportDataListAsPdf(${index}): no PNG`);

      urls.push(url);

      switchToNextData();
      await wait(100);
    };

    for (let i = 0; i < dataList.length; ++i) {
      await exportData();
      onProgress(i);
    }

    const pdf = await pngsToPdf(urls, w, h, gap, margin);
    pdf.save(filename);
  }, [dataList.length, filename, gap, h, margin, onProgress, ref, w]);
}
