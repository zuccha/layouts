import {
  Box,
  type ColorPickerValueChangeDetails,
  HStack,
  parseColor,
} from "@chakra-ui/react";
import { type ReactNode, useCallback } from "react";
import { updateBoxItemInActiveLayout } from "../app-store";
import SquareRoundCorner from "../assets/icons/square-round-corner";
import ColorPicker from "../components/ui/color-picker";
import LinkIconButton from "../components/ui/link-icon-button";
import NumberInput from "../components/ui/number-input";
import type { LayoutItemBox } from "../models/layout";
import { createStore } from "../utils/store";
import EditorItemTabBase from "./editor-item-tab-base";
import Subsection from "./subsection";

export type EditorItemTabBoxProps = {
  children?: ReactNode;
  item: LayoutItemBox;
};

export default function EditorItemTabBox({
  children,
  item,
}: EditorItemTabBoxProps) {
  const [positionLinked, setPositionLinked] = positionLinkedStore.use();
  const [borderRadiusLinked, setBorderRadiusLinked] =
    borderRadiusLinkedStore.use();

  const dx = item.x1 - item.x0;
  const dy = item.y1 - item.y0;

  const updateItem = useCallback(
    (partialItem: Partial<LayoutItemBox>, source: string) =>
      updateBoxItemInActiveLayout(item.id, partialItem, item._type, source),
    [item._type, item.id],
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

  const updateW = useCallback(
    (w: number) => updateItem({ x1: item.x0 + w }, "w-editor"),
    [item.x0, updateItem],
  );

  const updateH = useCallback(
    (h: number) => updateItem({ y1: item.y0 + h }, "h-editor"),
    [item.y0, updateItem],
  );

  const updatePt = useCallback(
    (pt: number) => updateItem({ pt }, "pt-editor"),
    [updateItem],
  );

  const updatePb = useCallback(
    (pb: number) => updateItem({ pb }, "pb-editor"),
    [updateItem],
  );
  const updatePl = useCallback(
    (pl: number) => updateItem({ pl }, "pl-editor"),
    [updateItem],
  );
  const updatePr = useCallback(
    (pr: number) => updateItem({ pr }, "pr-editor"),
    [updateItem],
  );

  const updateBackgroundColor = useCallback(
    (c: ColorPickerValueChangeDetails) =>
      updateBoxItemInActiveLayout(
        item.id,
        { backgroundColor: c.valueAsString },
        item._type,
      ),
    [item._type, item.id],
  );

  const updateBorder = useCallback(
    (partialBorder: Partial<LayoutItemBox["border"]>, source: string) =>
      updateBoxItemInActiveLayout(
        item.id,
        { border: { ...item.border, ...partialBorder } },
        item._type,
        source,
      ),
    [item.border, item._type, item.id],
  );

  const updateBorderRadius = useCallback(
    (
      partialRadius: Partial<LayoutItemBox["border"]["radius"]>,
      source: string,
    ) =>
      updateBoxItemInActiveLayout(
        item.id,
        {
          border: {
            ...item.border,
            radius: { ...item.border.radius, ...partialRadius },
          },
        },
        item._type,
        source,
      ),
    [item.border, item._type, item.id],
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
            max={item.x1}
            onValueChange={updateX0}
            placeholder="Top-left X position"
            size="xs"
            value={item.x0}
          />

          <NumberInput
            label={<Label sub="0" text="Y" />}
            max={item.y1}
            onValueChange={updateY0}
            placeholder="Top-left Y position"
            size="xs"
            value={item.y0}
          />
        </HStack>

        <HStack>
          <NumberInput
            label={<Label sub="1" text="X" />}
            min={item.x0}
            onValueChange={updateX1}
            placeholder="Bottom-right X position"
            size="xs"
            value={item.x1}
          />

          <NumberInput
            label={<Label sub="1" text="Y" />}
            min={item.y0}
            onValueChange={updateY1}
            placeholder="Bottom-right Y position"
            size="xs"
            value={item.y1}
          />
        </HStack>

        <HStack>
          <NumberInput
            label="W"
            min={0}
            onValueChange={updateW}
            placeholder="Width"
            size="xs"
            value={Math.max(item.x1 - item.x0, 0)}
          />

          <NumberInput
            label="H"
            min={0}
            onValueChange={updateH}
            placeholder="Height"
            size="xs"
            value={Math.max(item.y1 - item.y0, 0)}
          />
        </HStack>
      </Subsection>

      <Subsection label="Padding">
        <HStack>
          <NumberInput
            label="T"
            onValueChange={updatePt}
            placeholder="Padding top"
            size="xs"
            value={item.pt}
          />

          <NumberInput
            label="B"
            onValueChange={updatePb}
            placeholder="Padding bottom"
            size="xs"
            value={item.pb}
          />
        </HStack>

        <HStack>
          <NumberInput
            label="L"
            onValueChange={updatePl}
            placeholder="Padding left"
            size="xs"
            value={item.pl}
          />

          <NumberInput
            label="R"
            onValueChange={updatePr}
            placeholder="Padding right"
            size="xs"
            value={item.pr}
          />
        </HStack>
      </Subsection>

      <Subsection label="Background Color">
        <HStack w="full">
          <ColorPicker
            aria-label="Background color"
            flex={1}
            onValueChange={updateBackgroundColor}
            size="xs"
            value={parseColor(item.backgroundColor)}
          />
          <Box flex={1} />
        </HStack>
      </Subsection>

      <Subsection
        actions={
          <LinkIconButton
            borderWidth={0}
            label="border radius"
            linked={borderRadiusLinked}
            mr={-2}
            onClick={setBorderRadiusLinked}
            size="xs"
          />
        }
        label="Border"
      >
        <HStack>
          <NumberInput
            flex={1}
            label="W"
            min={0}
            onValueChange={(width) =>
              updateBorder({ width }, "border-w-editor")
            }
            placeholder="Border width"
            size="xs"
            value={item.border.width}
          />

          <ColorPicker
            aria-label="Border color"
            flex={1}
            onValueChange={(e) =>
              updateBorder({ color: e.valueAsString }, "border-color-editor")
            }
            size="xs"
            value={parseColor(item.border.color)}
          />
        </HStack>

        <HStack>
          <NumberInput
            label={<SquareRoundCorner size="xs" transform="scaleX(-1)" />}
            min={0}
            onValueChange={(tl) =>
              updateBorderRadius(
                borderRadiusLinked ? { bl: tl, br: tl, tl, tr: tl } : { tl },
                "border-radius-tl-editor",
              )
            }
            placeholder="Border radius top-left"
            size="xs"
            value={item.border.radius.tl}
          />

          <NumberInput
            label={<SquareRoundCorner size="xs" />}
            min={0}
            onValueChange={(tr) =>
              updateBorderRadius(
                borderRadiusLinked ? { bl: tr, br: tr, tl: tr, tr } : { tr },
                "border-radius-tr-editor",
              )
            }
            placeholder="Border radius top-right"
            size="xs"
            value={item.border.radius.tr}
          />
        </HStack>

        <HStack>
          <NumberInput
            label={<SquareRoundCorner size="xs" transform="scale(-1, -1)" />}
            min={0}
            onValueChange={(bl) =>
              updateBorderRadius(
                borderRadiusLinked ? { bl, br: bl, tl: bl, tr: bl } : { bl },
                "border-radius-bl-editor",
              )
            }
            placeholder="Border radius down-left"
            size="xs"
            value={item.border.radius.bl}
          />

          <NumberInput
            label={<SquareRoundCorner size="xs" transform="scaleY(-1)" />}
            min={0}
            onValueChange={(br) =>
              updateBorderRadius(
                borderRadiusLinked ? { bl: br, br, tl: br, tr: br } : { br },
                "border-radius-br-editor",
              )
            }
            placeholder="Border radius down-right"
            size="xs"
            value={item.border.radius.br}
          />
        </HStack>
      </Subsection>

      {children}
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
const borderRadiusLinkedStore = createStore(false);
