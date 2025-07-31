import { toPng } from "html-to-image";
import { useCallback, useMemo, useRef } from "react";

export default function useDownloadableDiv(
  width: number, // in inches
  height: number, // in inches
  dpi: number,
  ppi: number,
) {
  const ref = useRef<HTMLDivElement>(null);

  const downloadPng = useCallback(() => {
    try {
      if (!ref.current)
        return Promise.reject("useDownloadableDiv.downloadPng: no ref");

      const node = ref.current;

      const divHeight = node.offsetHeight;
      const divWidth = node.offsetWidth;

      const outputHeight = (height / ppi) * dpi;
      const outputWidth = (width / ppi) * dpi;

      const scale = outputWidth / divWidth;

      return toPng(node, {
        height: outputHeight,
        width: outputWidth,

        pixelRatio: window.devicePixelRatio,
        style: {
          height: `${divHeight}px`,
          width: `${divWidth}px`,

          transform: `scale(${scale})`,
          transformOrigin: "top left",
        },
      });
    } catch (err) {
      console.error(err);

      return Promise.reject("useDownloadableDiv.downloadPng: generic error");
    }
  }, [dpi, height, ppi, width]);

  return useMemo(() => ({ downloadPng, ref }), [ref, downloadPng]);
}
