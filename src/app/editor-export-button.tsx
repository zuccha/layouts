import { Button, HStack, Span, VStack } from "@chakra-ui/react";
import { type ReactNode, useState } from "react";
import { useDataListSize } from "../app-store";
import FormDialogButton from "../components/ui/form-dialog-button";
import Input from "../components/ui/input";
import NumberInput from "../components/ui/number-input";
import useExportDataList from "../hooks/use-export-data-list";
import {
  useStorePersistentNumber,
  useStorePersistentString,
} from "../utils/store-persistent";

export default function EditorExportButton() {
  const [downloadProgress, setDownloadProgress] = useState(-1);
  const [folder, setFolder] = useFolder();
  const [imageName, setImageName] = useImageName();
  const [dpi, setDpi] = useDpi();
  const [ppi, setPpi] = usePpi();

  const dataListSize = useDataListSize();

  const exportDataList = useExportDataList({
    dpi,
    folder: folder || "images",
    imageName,
    onProgress: setDownloadProgress,
    ppi,
  });

  const percentage = Math.round((100 * downloadProgress) / dataListSize);
  const disabled = downloadProgress >= 0;

  return (
    <FormDialogButton
      button={
        <Button size="xs" variant="outline">
          Export
        </Button>
      }
      confirmText={percentage < 0 ? "Download" : `${percentage}%`}
      disabled={disabled}
      onConfirm={() => {
        setDownloadProgress(0);
        exportDataList().finally(() => setDownloadProgress(-1));
      }}
      title="Export"
    >
      <VStack align="flex-start">
        <HStack>
          <Group label="Folder">
            <Input
              aria-label="Folder name"
              disabled={disabled}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="images"
              value={folder}
            />
          </Group>

          <Group label="Image name">
            <Input
              aria-label="Image name suffix"
              disabled={disabled}
              onChange={(e) => setImageName(e.target.value)}
              placeholder="<name>"
              value={imageName}
            />
          </Group>

          <Group label="DPI">
            <NumberInput
              aria-label="DPI"
              disabled={disabled}
              onValueChange={setDpi}
              value={dpi}
            />
          </Group>

          <Group label="PPI">
            <NumberInput
              aria-label="PPI"
              disabled={disabled}
              onValueChange={setPpi}
              value={ppi}
            />
          </Group>
        </HStack>
      </VStack>
    </FormDialogButton>
  );
}

function Group({ children, label }: { children: ReactNode; label: string }) {
  return (
    <VStack align="flex-start">
      <Span fontSize="sm" fontWeight="500">
        {label}
      </Span>
      {children}
    </VStack>
  );
}

const useFolder = () => useStorePersistentString("export.folder", "images");
const useImageName = () => useStorePersistentString("export.name", "");
const useDpi = () => useStorePersistentNumber("export.dpi", 800);
const usePpi = () => useStorePersistentNumber("export.ppi", 128);
