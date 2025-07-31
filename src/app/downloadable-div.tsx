import { type ReactNode, forwardRef, useImperativeHandle } from "react";
import useDownloadableDiv from "../hooks/use-downloadable-div";

export type DownloadableDivRefObject = {
  downloadPng: () => Promise<string>;
};

export type DownloadableDivProps = {
  children: ReactNode;
  dpi: number;
  h: number;
  ppi: number;
  w: number;
};

const DownloadableDiv = forwardRef<
  DownloadableDivRefObject,
  DownloadableDivProps
>(function ({ children, dpi, h, ppi, w }, ref) {
  const downloadableDiv = useDownloadableDiv(w, h, dpi, ppi);

  useImperativeHandle(ref, () => ({
    downloadPng: downloadableDiv.downloadPng,
  }));

  const style = { height: h, width: w };

  return (
    <div ref={downloadableDiv.ref} style={style}>
      {children}
    </div>
  );
});

export default DownloadableDiv;
