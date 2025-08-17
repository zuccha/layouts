import { Icon, type IconProps } from "@chakra-ui/react";
import { LuCheck, LuMinus } from "react-icons/lu";

export type CheckboxProps = {
  checked: boolean | "indeterminate";
  onToggle: (checked: boolean) => void;
} & Omit<IconProps, "onToggle">;

export default function Checkbox({
  checked,
  onToggle,
  ...rest
}: CheckboxProps) {
  return (
    <Icon
      bgColor={checked ? "fg" : "transparent"}
      borderColor={checked ? "fg" : "border"}
      borderRadius={2}
      borderWidth={1}
      color={checked ? "fg.inverted" : "fg"}
      cursor="pointer"
      onClick={(e) => {
        e.stopPropagation();
        onToggle(!checked);
      }}
      {...rest}
    >
      {checked === "indeterminate" ?
        <LuMinus />
      : checked ?
        <LuCheck />
      : <LuCheck color="transparent" />}
    </Icon>
  );
}
