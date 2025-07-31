import { Select as ChakraSelect } from "@chakra-ui/react";
import type { SelectRootProps as ChakraSelectRootProps } from "@chakra-ui/react";
import { Tooltip } from "./tooltip";

export type SelectProps = ChakraSelectRootProps & {
  placeholder?: string;
};

export default function Select(props: SelectProps) {
  return (
    <ChakraSelect.Root {...props} gap={0}>
      <ChakraSelect.HiddenSelect />
      <ChakraSelect.Label display="hidden" />

      <Tooltip content={props.placeholder} showArrow>
        <ChakraSelect.Control>
          <ChakraSelect.Trigger>
            <ChakraSelect.ValueText placeholder={props.placeholder} />
          </ChakraSelect.Trigger>
          <ChakraSelect.IndicatorGroup>
            <ChakraSelect.Indicator />
          </ChakraSelect.IndicatorGroup>
        </ChakraSelect.Control>
      </Tooltip>

      <ChakraSelect.Positioner>
        <ChakraSelect.Content>
          {props.collection.items.map((item) => (
            <ChakraSelect.Item item={item} key={item.value}>
              {item.label}
              <ChakraSelect.ItemIndicator />
            </ChakraSelect.Item>
          ))}
        </ChakraSelect.Content>
      </ChakraSelect.Positioner>
    </ChakraSelect.Root>
  );
}
