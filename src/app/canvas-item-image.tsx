import type { Data } from "@dnd-kit/core";
import type { LayoutItemImage } from "../models/layout";
import CanvasItemBox from "./canvas-item-box";

export type CanvasItemImageProps = {
  data: Data;
  item: LayoutItemImage;
};

export default function CanvasItemImage({ item }: CanvasItemImageProps) {
  return <CanvasItemBox item={item} />;
}
