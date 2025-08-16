import {
  Box,
  type ColorPickerValueChangeDetails,
  HStack,
  parseColor,
} from "@chakra-ui/react";
import { useCallback } from "react";
import { updateLineItemInActiveLayout } from "../app-store";
import ColorPicker from "../components/ui/color-picker";
import LinkIconButton from "../components/ui/link-icon-button";
import NumberInput from "../components/ui/number-input";
import type { LayoutItemLine } from "../models/layout";
import { createStore } from "../utils/store";
import EditorItemTabBase from "./editor-item-tab-base";
import Subsection from "./subsection";

export type EditorItemTabLineProps = {
  item: LayoutItemLine;
};

export default function EditorItemTabLine({ item }: EditorItemTabLineProps) {
  const [positionLinked, setPositionLinked] = positionLinkedStore.use();

  const dx = item.x1 - item.x0;
  const dy = item.y1 - item.y0;

  const updateItem = useCallback(
    (partialItem: Partial<LayoutItemLine>, source?: string) =>
      updateLineItemInActiveLayout(item.id, partialItem, source),
    [item.id],
  );

  const updateX0 = useCallback(
    (x0: number) =>
      updateItem(positionLinked ? { x0, x1: x0 + dx } : { x0 }, "x0-editor"),
    [dx, positionLinked, updateItem],
  );

  const updateX1 = useCallback(
    (x1: number) =>
      updateItem(positionLinked ? { x0: x1 - dx, x1 } : { x1 }, "x1-editor"),
    [dx, positionLinked, updateItem],
  );

  const updateY0 = useCallback(
    (y0: number) =>
      updateItem(positionLinked ? { y0, y1: y0 + dy } : { y0 }, "y0-editor"),
    [dy, positionLinked, updateItem],
  );

  const updateY1 = useCallback(
    (y1: number) =>
      updateItem(positionLinked ? { y0: y1 - dy, y1 } : { y1 }, "y1-editor"),
    [dy, positionLinked, updateItem],
  );

  const updateThickness = useCallback(
    (thickness: number) => updateItem({ thickness }),
    [updateItem],
  );

  const updateColor = useCallback(
    (c: ColorPickerValueChangeDetails) =>
      updateItem({ color: c.valueAsString }),
    [updateItem],
  );

  return (
    <EditorItemTabBase item={item}>
      <Subsection
        actions={
          <LinkIconButton
            borderWidth={0}
            label="position"
            linked={positionLinked}
            mr={-2}
            onClick={setPositionLinked}
            size="xs"
          />
        }
        label="Position"
      >
        <HStack>
          <NumberInput
            label={<Label sub="0" text="X" />}
            onValueChange={updateX0}
            placeholder="Top-left X position"
            size="xs"
            value={item.x0}
          />

          <NumberInput
            label={<Label sub="0" text="Y" />}
            onValueChange={updateY0}
            placeholder="Top-left Y position"
            size="xs"
            value={item.y0}
          />
        </HStack>

        <HStack>
          <NumberInput
            label={<Label sub="1" text="X" />}
            onValueChange={updateX1}
            placeholder="Bottom-right X position"
            size="xs"
            value={item.x1}
          />

          <NumberInput
            label={<Label sub="1" text="Y" />}
            onValueChange={updateY1}
            placeholder="Bottom-right Y position"
            size="xs"
            value={item.y1}
          />
        </HStack>
      </Subsection>
      <Subsection label="Color">
        <HStack w="full">
          <ColorPicker
            aria-label="Background color"
            flex={1}
            onValueChange={updateColor}
            size="xs"
            value={parseColor(item.color)}
          />
          <Box flex={1} />
        </HStack>
      </Subsection>

      <Subsection label="Thickness">
        <HStack w="full">
          <NumberInput
            min={0}
            onValueChange={updateThickness}
            placeholder="Thickness"
            size="xs"
            value={item.thickness}
          />
          <Box flex={1} />
        </HStack>
      </Subsection>
    </EditorItemTabBase>
  );
}

function Label({ sub, text }: { sub: string; text: string }) {
  return (
    <span>
      {text}
      <sub>{sub}</sub>
    </span>
  );
}

const positionLinkedStore = createStore(false);
