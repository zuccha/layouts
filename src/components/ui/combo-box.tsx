"use client";

import {
  HStack,
  Icon,
  Input,
  InputGroup,
  type InputProps,
  Menu,
  Portal,
} from "@chakra-ui/react";
import { LuCheck, LuChevronDown, LuCircleAlert } from "react-icons/lu";
import { Tooltip } from "./tooltip";

export type ComboboxProps = {
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
} & Omit<InputProps, "onChange">;

export default function Combobox({
  onValueChange,
  options,
  value,
  ...rest
}: ComboboxProps) {
  return (
    <Menu.Root>
      <InputGroup
        endElement={
          <HStack>
            {!options.some((option) => option.label === value) && (
              <Icon color="fg.error">
                <LuCircleAlert />
              </Icon>
            )}
            <Menu.Trigger>
              <Icon w="1.5em">
                <LuChevronDown />
              </Icon>
            </Menu.Trigger>
          </HStack>
        }
      >
        <Tooltip content={rest.placeholder} showArrow>
          <Input
            {...rest}
            onChange={(e) => onValueChange(e.target.value)}
            value={value}
          />
        </Tooltip>
      </InputGroup>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {options.map((option) => (
              <Menu.Item
                key={option.value}
                onClick={() => onValueChange(option.label)}
                value={option.value}
              >
                <HStack align="center" justify="space-between" w="full">
                  {option.label}
                  {value === option.value && (
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
