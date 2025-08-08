import type { Data } from "@dnd-kit/core";
import { useActiveLayoutItem } from "../app-store";
import CanvasItemBox from "./canvas-item-box";
import CanvasItemImage from "./canvas-item-image";
import CanvasItemText from "./canvas-item-text";

export type CanvasItemProps = {
  data: Data;
  itemId: string;
};

export default function CanvasItem({ data, itemId }: CanvasItemProps) {
  const item = useActiveLayoutItem(itemId);
  if (!item.visible) return null;

  const type = item._type;
  if (type === "image") return <CanvasItemImage data={data} item={item} />;
  if (type === "text") return <CanvasItemText data={data} item={item} />;
  return <CanvasItemBox item={item} />;
}
