import { useActiveLayoutItem } from "../app-store";
import EditorItemTabBox from "./editor-item-tab-box";
import EditorItemTabImage from "./editor-item-tab-image";
import EditorItemTabText from "./editor-item-tab-text";

export type EditorItemTabProps = { itemId: string };

export default function EditorItemTab({ itemId }: EditorItemTabProps) {
  const item = useActiveLayoutItem(itemId);

  if (item._type === "text") return <EditorItemTabText item={item} />;
  if (item._type === "image") return <EditorItemTabImage item={item} />;
  return <EditorItemTabBox item={item} />;
}
