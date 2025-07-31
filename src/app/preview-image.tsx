import { Image } from "@chakra-ui/react";
import useImageUrl from "../hooks/use-image-url";
import useInterpolatedText from "../hooks/use-interpolated-text";
import type { Data } from "../models/data";
import type { LayoutItemImage } from "../models/layout";
import PreviewBox from "./preview-box";

export type PreviewImageProps = {
  data: Data;
  item: LayoutItemImage;
};

export default function PreviewImage({ data, item }: PreviewImageProps) {
  const source = useInterpolatedText(item.source, data);
  const url = useImageUrl(source);

  return (
    <PreviewBox item={item}>
      <Image height="full" position="absolute" src={url} width="full" />
    </PreviewBox>
  );
}
