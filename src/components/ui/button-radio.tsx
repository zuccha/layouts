import { ButtonGroup, type ButtonGroupProps } from "@chakra-ui/react";
import type { IconType } from "react-icons/lib";
import IconButton from "./icon-button";

export type ButtonRadioOption<T extends string> = {
  readonly Icon: IconType;
  readonly label: string;
  readonly value: T;
};

export type ButtonRadioProps<T extends string> = {
  onChangeValue: (value: T) => void;
  options: readonly ButtonRadioOption<T>[];
  size?: ButtonGroupProps["size"];
  value: string;
};

export default function ButtonRadio<T extends string>({
  options,
  onChangeValue,
  size,
  value,
}: ButtonRadioProps<T>) {
  return (
    <ButtonGroup attached size={size} variant="outline">
      {options.map((option) => (
        <IconButton
          Icon={option.Icon}
          aria-label={option.label}
          aria-selected={option.value === value}
          borderColor={option.value === value ? "border" : undefined}
          key={option.value}
          onClick={() => onChangeValue(option.value)}
          variant={option.value === value ? "subtle" : undefined}
        />
      ))}
    </ButtonGroup>
  );
}
