"use client";

import {
  Combobox as ChakraCombobox,
  type ComboboxRootProps as ChakraComboboxRootProps,
  Portal,
  useListCollection,
} from "@chakra-ui/react";
import { Tooltip } from "./tooltip";

export type ComboboxProps = {
  options: { label: string; value: string }[];
} & Omit<
  ChakraComboboxRootProps,
  "collection" | "onInputValueChange" | "defaultInputValue" | "inputValue"
>;

export default function Combobox({ options, ...rest }: ComboboxProps) {
  const { collection } = useListCollection({ initialItems: options });

  return (
    <ChakraCombobox.Root
      {...rest}
      collection={collection}
      defaultInputValue={rest.value ? rest.value[0] : undefined}
      onInputValueChange={(e) => e.inputValue}
    >
      <ChakraCombobox.Control>
        <Tooltip content={rest.placeholder} showArrow>
          <ChakraCombobox.Input placeholder="Type to search" />
        </Tooltip>
        <ChakraCombobox.IndicatorGroup>
          <ChakraCombobox.ClearTrigger />
          <ChakraCombobox.Trigger />
        </ChakraCombobox.IndicatorGroup>
      </ChakraCombobox.Control>

      <Portal>
        <ChakraCombobox.Positioner>
          <ChakraCombobox.Content>
            <ChakraCombobox.Empty>No items found</ChakraCombobox.Empty>
            {collection.items.map((item) => (
              <ChakraCombobox.Item item={item} key={item.value}>
                {item.label}
                <ChakraCombobox.ItemIndicator />
              </ChakraCombobox.Item>
            ))}
          </ChakraCombobox.Content>
        </ChakraCombobox.Positioner>
      </Portal>
    </ChakraCombobox.Root>
  );
}
