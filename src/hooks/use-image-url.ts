import { useLayoutEffect, useState } from "react";
import { useImagesDirectoryHandle } from "../app-store";
import { toaster } from "../components/ui/toaster";

export default function useImageUrl(source: string): string | undefined {
  const dirHandle = useImagesDirectoryHandle();

  const [url, setUrl] = useState<string | undefined>(undefined);

  useLayoutEffect(() => {
    const loadSrc = async () => {
      // if (source.startsWith("http://") || source.startsWith("https://"))
      //   return setUrl(source);
      if (source.startsWith("http://") || source.startsWith("https://")) {
        const image = await fetch(source);
        const blob = await image.blob();
        const url = URL.createObjectURL(blob);
        return setUrl(url);
      }

      if (!dirHandle) return setUrl(undefined);

      const segments = source.split("/");
      const fileName = segments.pop()!;
      let currentDir = dirHandle;

      try {
        for (const segment of segments)
          currentDir = await currentDir.getDirectoryHandle(segment);
        const fileHandle = await currentDir.getFileHandle(fileName);
        const file = await fileHandle.getFile();
        setUrl(URL.createObjectURL(file));
      } catch {
        setUrl(undefined);
        toaster.error({
          title: `Cannot find image "${source}"`,
        });
      }
    };
    loadSrc();
  }, [dirHandle, source]);

  return url;
}
