import {
  Flex,
  GridItem,
  HStack,
  SimpleGrid,
  Span,
  Switch,
  VStack,
  createListCollection,
  parseColor,
} from "@chakra-ui/react";
import { type ReactNode, useRef, useState } from "react";
import {
  LuBold,
  LuCaseLower,
  LuCaseSensitive,
  LuCaseUpper,
  LuItalic,
  LuPencil,
} from "react-icons/lu";
import ButtonRadio from "../components/ui/button-radio";
import Checkbox from "../components/ui/checkbox";
import ColorPicker from "../components/ui/color-picker";
import FormDialogButton from "../components/ui/form-dialog-button";
import IconButton from "../components/ui/icon-button";
import Input from "../components/ui/input";
import Select from "../components/ui/select";
import ToggleIconButton from "../components/ui/toggle-icon-button";
import { type Pattern } from "../models/layout";

export type EditorItemTabTextPatternEditButtonProps = {
  initialPattern: Pattern;
  onSave: (pattern: Pattern) => void;
};

export default function EditorItemTabTextPatternEditButton({
  initialPattern,
  onSave,
}: EditorItemTabTextPatternEditButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pattern, setPattern] = useState(initialPattern);

  const update = (partial: Partial<Pattern>) =>
    setPattern((prev) => ({ ...prev, ...partial }));

  const updateDelimiter = (partial: Partial<Pattern["delimiter"]>) =>
    setPattern((prev) => ({
      ...prev,
      delimiter: { ...prev.delimiter, ...partial },
    }));

  const updateStyles = (partial: Partial<Pattern["styles"]>) =>
    setPattern((prev) => ({
      ...prev,
      styles: { ...prev.styles, ...partial },
    }));

  const isBold = pattern.styles.fontWeight === "bold";
  const isItalic = pattern.styles.fontStyle === "italic";

  const disabled = !pattern.delimiter.close || !pattern.delimiter.open;

  return (
    <FormDialogButton
      button={
        <IconButton
          Icon={LuPencil}
          aria-label="Edit"
          size="xs"
          variant="ghost"
        />
      }
      confirmText="Save"
      contentRef={containerRef}
      disabled={disabled}
      onConfirm={() => {
        onSave(pattern);
        return true;
      }}
      title="Pattern"
    >
      <SimpleGrid columns={3} gap={3}>
        <Group label="Opening delimiter">
          <Input
            aria-label="Opening delimiter"
            onChange={(e) => updateDelimiter({ open: e.target.value })}
            placeholder="{"
            value={pattern.delimiter.open}
          />
        </Group>

        <Group label="Closing delimiter">
          <Input
            aria-label="Closing delimiter"
            onChange={(e) => updateDelimiter({ close: e.target.value })}
            placeholder="}"
            value={pattern.delimiter.close}
          />
        </Group>

        <Group label="Include delimiter">
          <Select
            collection={delimiterVisibilityCollection}
            onValueChange={(e) =>
              update({
                delimiterMode: e.value[0] as Pattern["delimiterMode"],
              })
            }
            placeholder="Include delimiter"
            value={[pattern.delimiterMode]}
          />
        </Group>

        <Group label="Type">
          <Select
            collection={typeCollection}
            onValueChange={(e) =>
              update({ type: e.value[0] as Pattern["type"] })
            }
            placeholder="Type"
            value={[pattern.type]}
          />
        </Group>

        {pattern.type === "text" ?
          <>
            <GridItem colSpan={2}>
              <Group label="Style">
                <HStack w="full">
                  <ButtonRadio
                    onChangeValue={(textTransform) =>
                      updateStyles({ textTransform })
                    }
                    options={textTransformOptions}
                    value={pattern.styles.textTransform}
                  />

                  <ToggleIconButton
                    Icon={LuBold}
                    active={isBold}
                    aria-label="Bold"
                    onClick={() =>
                      updateStyles({
                        fontWeight: isBold ? "normal" : "bold",
                      })
                    }
                  />

                  <ToggleIconButton
                    Icon={LuItalic}
                    active={isItalic}
                    aria-label="Italic"
                    onClick={() =>
                      updateStyles({
                        fontStyle: isItalic ? "normal" : "italic",
                      })
                    }
                  />
                </HStack>
              </Group>
            </GridItem>

            <GridItem />

            <GridItem colSpan={2}>
              <Group label="Color">
                <HStack>
                  <Checkbox
                    checked={pattern.styles.textColorCustom}
                    onToggle={(textColorCustom) =>
                      updateStyles({ textColorCustom })
                    }
                  />
                  <ColorPicker
                    container={containerRef}
                    disabled={!pattern.styles.textColorCustom}
                    onValueChange={(e) =>
                      updateStyles({ textColor: e.valueAsString })
                    }
                    value={parseColor(pattern.styles.textColor)}
                  />
                </HStack>
              </Group>
            </GridItem>
          </>
        : <GridItem colSpan={2}>
            <HStack>
              <Group label="Symbol path">
                <Input
                  aria-label="Symbol path"
                  onChange={(e) => update({ symbolPath: e.target.value })}
                  placeholder="images/symbols"
                  value={pattern.symbolPath}
                />
              </Group>
              <Group label="Shadow">
                <Flex h="2.5rem">
                  <Switch.Root
                    checked={pattern.symbolShadow}
                    onClick={() =>
                      update({ symbolShadow: !pattern.symbolShadow })
                    }
                    size="lg"
                  >
                    <Switch.Control></Switch.Control>
                  </Switch.Root>
                </Flex>
              </Group>
            </HStack>
          </GridItem>
        }
      </SimpleGrid>
    </FormDialogButton>
  );
}

function Group({ children, label }: { children: ReactNode; label: string }) {
  return (
    <VStack align="flex-start">
      <Span fontSize="sm" fontWeight="500">
        {label}
      </Span>
      {children}
    </VStack>
  );
}

const delimiterVisibilityCollection = createListCollection({
  items: [
    { label: "Include", value: "include" },
    { label: "Exclude", value: "exclude" },
  ],
});

const typeCollection = createListCollection({
  items: [
    { label: "Symbol", value: "symbol" },
    { label: "Text", value: "text" },
  ],
});

const textTransformOptions = [
  { Icon: LuCaseSensitive, label: "Normal", value: "none" },
  { Icon: LuCaseUpper, label: "Uppercase", value: "uppercase" },
  { Icon: LuCaseLower, label: "Lowercase", value: "lowercase" },
] as const;
