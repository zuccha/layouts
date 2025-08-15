import {
  Box,
  type ColorPickerValueChangeDetails,
  HStack,
  VStack,
  parseColor,
} from "@chakra-ui/react";
import { type ReactNode, useCallback, useState } from "react";
import { updateBoxItemInActiveLayout } from "../app-store";
import SquareRoundCorner from "../assets/icons/square-round-corner";
import ColorPicker from "../components/ui/color-picker";
import LinkIconButton from "../components/ui/link-icon-button";
import NumberInput from "../components/ui/number-input";
import type { LayoutItem, LayoutItemBox } from "../models/layout";
import Subsection from "./subsection";

export type EditorItemTabBoxProps = {
  children?: ReactNode;
  item: LayoutItemBox;
};

export default function EditorItemTabBox({
  children,
  item,
}: EditorItemTabBoxProps) {
  const [positionLinked, setPositionLinked] = useState(false);

  const dx = item.x1 - item.x0;
  const dy = item.y1 - item.y0;

  const updateX0 = useCallback(
    (x0: number) =>
      positionLinked ?
        updateBoxItemInActiveLayout(item.id, { x0, x1: x0 + dx }, "x0-editor")
      : updateBoxItemInActiveLayout(item.id, { x0 }, "x0-editor"),
    [dx, item.id, positionLinked],
  );

  const updateX1 = useCallback(
    (x1: number) =>
      positionLinked ?
        updateBoxItemInActiveLayout(item.id, { x0: x1 - dx, x1 }, "x1-editor")
      : updateBoxItemInActiveLayout(item.id, { x1 }, "x1-editor"),
    [dx, item.id, positionLinked],
  );

  const updateY0 = useCallback(
    (y0: number) =>
      positionLinked ?
        updateBoxItemInActiveLayout(item.id, { y0, y1: y0 + dy }, "y0-editor")
      : updateBoxItemInActiveLayout(item.id, { y0 }, "y0-editor"),
    [dy, item.id, positionLinked],
  );

  const updateY1 = useCallback(
    (y1: number) =>
      positionLinked ?
        updateBoxItemInActiveLayout(item.id, { y0: y1 - dy, y1 }, "y1-editor")
      : updateBoxItemInActiveLayout(item.id, { y1 }, "y1-editor"),
    [dy, item.id, positionLinked],
  );

  const updateW = useCallback(
    (w: number) =>
      updateBoxItemInActiveLayout(item.id, { x1: item.x0 + w }, "w-editor"),
    [item.id, item.x0],
  );

  const updateH = useCallback(
    (h: number) =>
      updateBoxItemInActiveLayout(item.id, { y1: item.y0 + h }, "h-editor"),
    [item.id, item.y0],
  );

  const updatePt = useCallback(
    (pt: number) => updateBoxItemInActiveLayout(item.id, { pt }, "pt-editor"),
    [item.id],
  );

  const updatePb = useCallback(
    (pb: number) => updateBoxItemInActiveLayout(item.id, { pb }, "pb-editor"),
    [item.id],
  );
  const updatePl = useCallback(
    (pl: number) => updateBoxItemInActiveLayout(item.id, { pl }, "pl-editor"),
    [item.id],
  );
  const updatePr = useCallback(
    (pr: number) => updateBoxItemInActiveLayout(item.id, { pr }, "pr-editor"),
    [item.id],
  );

  const updateBackgroundColor = useCallback(
    (c: ColorPickerValueChangeDetails) =>
      updateBoxItemInActiveLayout(item.id, {
        backgroundColor: c.valueAsString,
      }),
    [item.id],
  );

  const updateBorder = useCallback(
    (partialBorder: Partial<LayoutItem["border"]>, source: string) =>
      updateBoxItemInActiveLayout(
        item.id,
        { border: { ...item.border, ...partialBorder } },
        source,
      ),
    [item.border, item.id],
  );

  const updateBorderRadius = useCallback(
    (partialRadius: Partial<LayoutItem["border"]["radius"]>, source: string) =>
      updateBoxItemInActiveLayout(
        item.id,
        {
          border: {
            ...item.border,
            radius: { ...item.border.radius, ...partialRadius },
          },
        },
        source,
      ),
    [item.border, item.id],
  );

  return (
    <VStack align="start" gap={0} w="full">
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
            value={Math.abs(item.x1 - item.x0)}
          />

          <NumberInput
            label="H"
            min={0}
            onValueChange={updateH}
            placeholder="Height"
            size="xs"
            value={Math.abs(item.y1 - item.y0)}
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

      <Subsection label="Border">
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
              updateBorderRadius({ tl }, "border-radius-tl-editor")
            }
            placeholder="Border radius top-left"
            size="xs"
            value={item.border.radius.tl}
          />

          <NumberInput
            label={<SquareRoundCorner size="xs" />}
            min={0}
            onValueChange={(tr) =>
              updateBorderRadius({ tr }, "border-radius-tr-editor")
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
              updateBorderRadius({ bl }, "border-radius-bl-editor")
            }
            placeholder="Border radius down-left"
            size="xs"
            value={item.border.radius.bl}
          />

          <NumberInput
            label={<SquareRoundCorner size="xs" transform="scaleY(-1)" />}
            min={0}
            onValueChange={(br) =>
              updateBorderRadius({ br }, "border-radius-br-editor")
            }
            placeholder="Border radius down-right"
            size="xs"
            value={item.border.radius.br}
          />
        </HStack>
      </Subsection>

      {children}
    </VStack>
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
