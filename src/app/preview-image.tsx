import { Image } from "@chakra-ui/react";
import { useEffect, useLayoutEffect } from "react";
import useImageUrl from "../hooks/use-image-url";
import useInterpolatedText from "../hooks/use-interpolated-text";
import type { Data } from "../models/data";
import type { LayoutItemImage } from "../models/layout";
import PreviewBox from "./preview-box";

export type PreviewImageProps = {
  data: Data;
  item: LayoutItemImage;
  onReady?: (ready: boolean) => void;
};

export default function PreviewImage({
  data,
  item,
  onReady = () => {},
}: PreviewImageProps) {
  const source = useInterpolatedText(item.source, data);
  const url = useImageUrl(source);

  useLayoutEffect(() => onReady(false), [onReady]);
  useEffect(() => onReady(true), [onReady]);

  return (
    <PreviewBox item={item}>
      <Image height="full" position="absolute" src={url} width="full" />
    </PreviewBox>
  );
}
