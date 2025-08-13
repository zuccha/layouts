"use client";

import {
  HStack,
  Icon,
  Input,
  InputGroup,
  type InputGroupProps,
  type InputProps,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { useLayoutEffect, useState } from "react";
import { LuCheck, LuChevronDown, LuCircleAlert } from "react-icons/lu";
import { Tooltip } from "./tooltip";

export type ComboboxProps = {
  onValueChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  showWarning?: boolean;
  size?: InputProps["size"];
  value: string;
} & Omit<InputGroupProps, "children" | "endElement">;

export default function Combobox({
  onValueChange,
  options,
  placeholder,
  showWarning,
  size,
  value,
  ...rest
}: ComboboxProps) {
  const [partialValue, setPartialValue] = useState(value);
  useLayoutEffect(() => setPartialValue(value), [value]);

  return (
    <Menu.Root>
      <InputGroup
        endElement={
          <HStack>
            {showWarning && !options.some((option) => option === value) && (
              <Icon color="fg.error">
                <LuCircleAlert />
              </Icon>
            )}
            <Menu.Trigger outline="none">
              <Icon>
                <LuChevronDown />
              </Icon>
            </Menu.Trigger>
          </HStack>
        }
        {...rest}
      >
        <Tooltip content={placeholder} showArrow>
          <Input
            onBlur={() => onValueChange(partialValue)}
            onChange={(e) => setPartialValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onValueChange(partialValue);
            }}
            placeholder={placeholder}
            size={size}
            value={partialValue}
          />
        </Tooltip>
      </InputGroup>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {options.map((option) => (
              <Menu.Item
                key={option}
                onClick={() => onValueChange(option)}
                value={option}
              >
                <HStack align="center" justify="space-between" w="full">
                  {option}
                  {value === option && (
                    <Icon>
                      <LuCheck />
                    </Icon>
                  )}
                </HStack>
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
