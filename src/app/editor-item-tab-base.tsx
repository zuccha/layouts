import { VStack } from "@chakra-ui/react";
import { type ReactNode } from "react";
import type { BaseLayoutItem } from "../models/layout";

export type EditorItemTabBaseProps = {
  children?: ReactNode;
  item: BaseLayoutItem;
};

export default function EditorItemTabBase({
  children,
}: EditorItemTabBaseProps) {
  return (
    <VStack align="start" gap={0} w="full">
      {children}
    </VStack>
  );
}
