import type { Data } from "@dnd-kit/core";
import { Image } from "react-konva";
import useImage from "use-image";
import useImageUrl from "../hooks/use-image-url";
import useInterpolatedText from "../hooks/use-interpolated-text";
import type { LayoutItemImage } from "../models/layout";
import CanvasItemBox from "./canvas-item-box";

export type CanvasItemImageProps = {
  data: Data;
  item: LayoutItemImage;
};

export default function CanvasItemImage({ data, item }: CanvasItemImageProps) {
  const source = useInterpolatedText(item.source, data);
  const url = useImageUrl(source);
  const [image] = useImage(url ?? "");

  return (
    <CanvasItemBox item={item}>
      {(w, h) => <Image height={h} image={image} width={w} />}
    </CanvasItemBox>
  );
}
