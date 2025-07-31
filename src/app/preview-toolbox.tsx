import { Center, HStack, type StackProps } from "@chakra-ui/react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import {
  switchToNextData,
  switchToPrevData,
  useActiveDataIndex,
  useDataListSize,
} from "../app-store";
import IconButton from "../components/ui/icon-button";

export type PreviewToolboxProps = StackProps;

export default function PreviewToolbox(props: PreviewToolboxProps) {
  const index = useActiveDataIndex();
  const size = useDataListSize();

  if (!size) return null;

  return (
    <HStack gap={0} {...props}>
      <IconButton
        Icon={LuChevronLeft}
        aria-label="Previous"
        borderRightRadius={0}
        onClick={(e) => {
          e.stopPropagation();
          switchToPrevData();
        }}
        size="xs"
      />

      <Center
        alignSelf="stretch"
        bgColor="gray.solid"
        color="fg.inverted"
        fontSize="sm"
        minW="5em"
        px={2}
      >{`${index + 1} / ${size}`}</Center>

      <IconButton
        Icon={LuChevronRight}
        aria-label="Next"
        borderLeftRadius={0}
        onClick={(e) => {
          e.stopPropagation();
          switchToNextData();
        }}
        size="xs"
      />
    </HStack>
  );
}
