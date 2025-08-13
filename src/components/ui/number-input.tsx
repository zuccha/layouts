import {
  InputGroup,
  NumberInput as ChakraNumberInput,
  type NumberInputRootProps as ChakraNumberInputRootProps,
  Text,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { Tooltip } from "./tooltip";

export type NumberInputProps = Omit<
  ChakraNumberInputRootProps,
  "defaultValue" | "onValueChange" | "value"
> & {
  defaultValue?: number;
  label?: ReactNode;
  onValueChange?: (value: number) => void;
  placeholder?: string;
  value?: number;
};

export default function NumberInput({
  defaultValue,
  label,
  onValueChange,
  value,
  ...props
}: NumberInputProps) {
  return (
    <ChakraNumberInput.Root
      defaultValue={defaultValue ? `${defaultValue}` : undefined}
      onValueChange={
        onValueChange ? (e) => onValueChange(e.valueAsNumber) : undefined
      }
      value={
        value === undefined ? undefined
        : isNaN(value) ?
          ""
        : `${value}`
      }
      {...props}
    >
      <ChakraNumberInput.Control />
      <Tooltip content={props.placeholder || props["aria-label"]} showArrow>
        <InputGroup
          startElement={
            label ? <Text fontSize={props.size}>{label}</Text> : undefined
          }
        >
          <ChakraNumberInput.Input pr={"1.5em"} />
        </InputGroup>
      </Tooltip>
    </ChakraNumberInput.Root>
  );
}
