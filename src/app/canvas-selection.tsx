import { useActiveLayoutItem } from "../app-store";
import CanvasSelectionBox from "./canvas-selection-box";
import CanvasSelectionLine from "./canvas-selection-line";

export type CanvasSelectionProps = {
  itemId: string;
  scale: number;
};

export default function CanvasSelection({
  itemId,
  scale,
}: CanvasSelectionProps) {
  const item = useActiveLayoutItem(itemId);

  return item._type === "line" ?
      <CanvasSelectionLine item={item} scale={scale} />
    : <CanvasSelectionBox item={item} scale={scale} />;
}
