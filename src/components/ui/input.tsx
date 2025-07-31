import {
  Input as ChakraInput,
  type InputProps as ChakraInputProps,
} from "@chakra-ui/react";
import { Tooltip } from "./tooltip";

export type InputProps = Omit<ChakraInputProps, "children">;

export default function Input(props: InputProps) {
  return (
    <Tooltip content={props["aria-label"] ?? props.placeholder} showArrow>
      <ChakraInput {...props} />
    </Tooltip>
  );
}
