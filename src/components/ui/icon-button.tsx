import {
  IconButton as ChakraIconButton,
  type IconButtonProps as ChakraIconButtonProps,
} from "@chakra-ui/react";
import type { IconType } from "react-icons/lib";
import { Tooltip } from "./tooltip";

export type IconButtonProps = Omit<ChakraIconButtonProps, "children"> & {
  Icon: IconType;
};

export default function IconButton(props: IconButtonProps) {
  return (
    <Tooltip content={props["aria-label"]} showArrow>
      <ChakraIconButton {...props}>
        <props.Icon />
      </ChakraIconButton>
    </Tooltip>
  );
}
