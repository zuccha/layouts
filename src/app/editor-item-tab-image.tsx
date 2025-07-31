import { updateImageItemInActiveLayout } from "../app-store";
import Input from "../components/ui/input";
import type { LayoutItemImage } from "../models/layout";
import EditorItemTabBox from "./editor-item-tab-box";
import Subsection from "./subsection";

export type EditorItemTabImageProps = {
  item: LayoutItemImage;
};

export default function EditorItemTabImage({ item }: EditorItemTabImageProps) {
  return (
    <EditorItemTabBox item={item}>
      <Subsection label="Image Source">
        <Input
          onChange={(e) =>
            updateImageItemInActiveLayout(
              item.id,
              { source: e.target.value },
              "source-editor",
            )
          }
          placeholder="Source"
          size="xs"
          value={item.source}
        />
      </Subsection>
    </EditorItemTabBox>
  );
}
