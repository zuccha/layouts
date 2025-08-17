import { Box, Flex, HStack, Span, parseColor } from "@chakra-ui/react";
import { useMemo } from "react";
import {
  LuArrowDownToLine,
  LuArrowLeftToLine,
  LuArrowRightToLine,
  LuArrowUpToLine,
  LuBold,
  LuCaseLower,
  LuCaseSensitive,
  LuCaseUpper,
  LuFoldHorizontal,
  LuFoldVertical,
  LuItalic,
  LuMinus,
  LuPlus,
} from "react-icons/lu";
import { updateTextItemInActiveLayout } from "../app-store";
import ButtonRadio from "../components/ui/button-radio";
import ColorPicker from "../components/ui/color-picker";
import Combobox from "../components/ui/combo-box";
import IconButton from "../components/ui/icon-button";
import Input from "../components/ui/input";
import NumberInput from "../components/ui/number-input";
import ToggleIconButton from "../components/ui/toggle-icon-button";
import {
  type LayoutItemText as LayoutItemText,
  patternSchema,
} from "../models/layout";
import { listRemove, listReplace } from "../utils/array";
import EditorItemTabBox from "./editor-item-tab-box";
import EditorItemTabTextPatternEditButton from "./editor-item-tab-text-pattern-edit-button";
import Subsection from "./subsection";

export type EditorItemTabTextProps = {
  item: LayoutItemText;
};

export default function EditorItemTabText({ item }: EditorItemTabTextProps) {
  const fonts = useMemo(() => {
    const families = new Set<string>();
    document.fonts.forEach((font) => families.add(font.family));
    return [...families, "Times New Roman", "Arial"].sort();
  }, []);

  return (
    <EditorItemTabBox item={item}>
      <Subsection label="Text">
        <Input
          onChange={(e) =>
            updateTextItemInActiveLayout(
              item.id,
              { text: e.target.value },
              "text-editor",
            )
          }
          placeholder="Text"
          size="xs"
          value={item.text}
        />
      </Subsection>

      <Subsection label="Alignment">
        <HStack justify="space-between" w="full">
          <ButtonRadio
            onChangeValue={(alignH) =>
              updateTextItemInActiveLayout(
                item.id,
                { alignH },
                "align-h-editor",
              )
            }
            options={alignHOptions}
            size="xs"
            value={item.alignH}
          />

          <ButtonRadio
            onChangeValue={(alignV) =>
              updateTextItemInActiveLayout(
                item.id,
                { alignV },
                "align-v-editor",
              )
            }
            options={alignVOptions}
            size="xs"
            value={item.alignV}
          />
        </HStack>
      </Subsection>

      <Subsection label="Font">
        <HStack w="100%">
          <Combobox
            flex={1}
            onValueChange={(fontFamily) =>
              updateTextItemInActiveLayout(
                item.id,
                { fontFamily },
                "font-family-editor",
              )
            }
            options={fonts}
            placeholder="Font family"
            showWarning
            size="xs"
            value={item.fontFamily}
          />
        </HStack>

        <HStack>
          <NumberInput
            min={0}
            onValueChange={(fontSize) =>
              updateTextItemInActiveLayout(
                item.id,
                { fontSize },
                "font-size-editor",
              )
            }
            placeholder="Font size"
            size="xs"
            value={item.fontSize}
          />

          <ButtonRadio
            onChangeValue={(textTransform) =>
              updateTextItemInActiveLayout(
                item.id,
                { textTransform },
                "text-transform-editor",
              )
            }
            options={textTransformOptions}
            size="xs"
            value={item.textTransform}
          />
        </HStack>

        <HStack w="full">
          <ColorPicker
            aria-label="Text color"
            flex={1}
            onValueChange={(e) =>
              updateTextItemInActiveLayout(
                item.id,
                { textColor: e.valueAsString },
                "text-color-editor",
              )
            }
            size="xs"
            value={parseColor(item.textColor)}
            w="100%"
          />

          <ToggleIconButton
            Icon={LuBold}
            active={item.fontWeight === "bold"}
            aria-label="Bold"
            onClick={() =>
              updateTextItemInActiveLayout(
                item.id,
                { fontWeight: item.fontWeight === "bold" ? "normal" : "bold" },
                "font-weight-editor",
              )
            }
            size="xs"
          />

          <ToggleIconButton
            Icon={LuItalic}
            active={item.fontStyle === "italic"}
            aria-label="Italic"
            onClick={() =>
              updateTextItemInActiveLayout(
                item.id,
                {
                  fontStyle: item.fontStyle === "italic" ? "normal" : "italic",
                },
                "font-style-editor",
              )
            }
            size="xs"
          />
        </HStack>

        <HStack w="full">
          <NumberInput
            min={0}
            onValueChange={(paragraphGap) =>
              updateTextItemInActiveLayout(
                item.id,
                { paragraphGap },
                "paragraph-gap-editor",
              )
            }
            placeholder="Paragraph gap (\n)"
            size="xs"
            value={item.paragraphGap}
          />

          <NumberInput
            min={0}
            onValueChange={(sectionGap) =>
              updateTextItemInActiveLayout(
                item.id,
                { sectionGap },
                "section-gap-editor",
              )
            }
            placeholder="Section gap (\r)"
            size="xs"
            value={item.sectionGap}
          />
        </HStack>

        <HStack w="full">
          <NumberInput
            flex={1}
            min={0}
            onValueChange={(lineHeight) =>
              updateTextItemInActiveLayout(
                item.id,
                { lineHeight },
                "line-height-editor",
              )
            }
            placeholder="Line height"
            size="xs"
            step={0.1}
            value={item.lineHeight}
          />

          <Flex flex={1} />
        </HStack>
      </Subsection>

      <Subsection
        actions={
          <IconButton
            Icon={LuPlus}
            aria-label="Add"
            mr={-2}
            onClick={() =>
              updateTextItemInActiveLayout(item.id, {
                patterns: [...item.patterns, patternSchema.parse({})],
              })
            }
            size="xs"
            variant="ghost"
          />
        }
        contentStyle={{ gap: 0 }}
        label="Patterns"
      >
        {item.patterns.map((pattern, i) => (
          <HStack className="group" key={i} w="full" whiteSpace="nowrap">
            <Box
              flex={1}
              fontSize="xs"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {pattern.type === "text" ?
                <Span {...pattern.styles}>
                  {`${pattern.delimiter.open}TEXT${pattern.delimiter.close}`}
                </Span>
              : <Span>
                  {`${pattern.symbolPath}/${pattern.delimiter.open}SYMBOL${pattern.delimiter.close}.svg`}
                </Span>
              }
            </Box>

            <Flex mr={-2}>
              <EditorItemTabTextPatternEditButton
                initialPattern={pattern}
                onSave={(nextPattern) =>
                  updateTextItemInActiveLayout(item.id, {
                    patterns: listReplace(item.patterns, nextPattern, i),
                  })
                }
              />

              <IconButton
                Icon={LuMinus}
                aria-label="Remove"
                onClick={() =>
                  updateTextItemInActiveLayout(item.id, {
                    patterns: listRemove(item.patterns, i),
                  })
                }
                size="xs"
                variant="ghost"
              />
            </Flex>
          </HStack>
        ))}
      </Subsection>
    </EditorItemTabBox>
  );
}

const alignHOptions = [
  { Icon: LuArrowLeftToLine, label: "Left", value: "left" },
  { Icon: LuFoldHorizontal, label: "Center", value: "center" },
  { Icon: LuArrowRightToLine, label: "Right", value: "right" },
] as const;

const alignVOptions = [
  { Icon: LuArrowUpToLine, label: "Top", value: "top" },
  { Icon: LuFoldVertical, label: "Middle", value: "middle" },
  { Icon: LuArrowDownToLine, label: "Bottom", value: "bottom" },
] as const;

const textTransformOptions = [
  { Icon: LuCaseSensitive, label: "Normal", value: "none" },
  { Icon: LuCaseUpper, label: "Uppercase", value: "uppercase" },
  { Icon: LuCaseLower, label: "Lowercase", value: "lowercase" },
] as const;
