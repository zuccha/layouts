import { HStack, VStack } from "@chakra-ui/react";
import { useActiveLayoutSelectedItemId, useCanvasScale } from "../app-store";
import Combobox from "../components/ui/combo-box";
import { sidebarWidth } from "../theme/theme-constants";
import EditorExportAsPdfButton from "./editor-export-as-pdf-button";
import EditorExportAsZipButton from "./editor-export-as-zip-button";
import EditorItemTab from "./editor-item-tab";

export default function Editor() {
  const itemId = useActiveLayoutSelectedItemId();
  const [scale, setScale] = useCanvasScale();

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
        justify="space-between"
        minH="3em"
        px={4}
        w="100%"
      >
        <Combobox
          onValueChange={(scaleStr) => {
            const nextScale = parseFloat(scaleStr) / 100;
            setScale(isNaN(nextScale) ? 1 : nextScale);
          }}
          options={zoomOptions}
          placeholder="Zoom"
          size="xs"
          value={`${Math.round(scale * 100)}%`}
          w="4.5em"
        />

        <HStack>
          <EditorExportAsZipButton />
          <EditorExportAsPdfButton />
        </HStack>
      </HStack>

      {itemId && <EditorItemTab itemId={itemId} />}
    </VStack>
  );
}

const zoomOptions = ["50%", "75%", "100%", "150%", "200%"];
