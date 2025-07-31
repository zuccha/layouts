import { HStack, VStack } from "@chakra-ui/react";
import { useActiveLayoutSelectedItemId } from "../app-store";
import { sidebarWidth } from "../theme/theme-constants";
import EditorExportButton from "./editor-export-button";
import EditorItemTab from "./editor-item-tab";

export default function Editor() {
  const itemId = useActiveLayoutSelectedItemId();

  return (
    <VStack
      align="start"
      borderLeftWidth={1}
      gap={0}
      h="calc(100vh - 3.25em)"
      overflow="auto"
      w={sidebarWidth}
    >
      <HStack
        align="center"
        borderBottomWidth={1}
        justify="flex-end"
        minH="3em"
        px={4}
        w="100%"
      >
        <EditorExportButton />
      </HStack>

      {itemId && <EditorItemTab itemId={itemId} />}
    </VStack>
  );
}
