import { Button, HStack, Span, VStack } from "@chakra-ui/react";
import { type ReactNode, useState } from "react";
import {
  useDataListSize,
  useExportDpi,
  useExportPpi,
  useExportZipFolder,
  useExportZipImageName,
} from "../app-store";
import FormDialogButton from "../components/ui/form-dialog-button";
import Input from "../components/ui/input";
import NumberInput from "../components/ui/number-input";
import useExportDataListAsZip from "../hooks/use-export-data-list-as-zip";

export default function EditorExportAsZipButton() {
  const [downloadProgress, setDownloadProgress] = useState(-1);
  const [folder, setFolder] = useExportZipFolder();
  const [imageName, setImageName] = useExportZipImageName();
  const [dpi, setDpi] = useExportDpi();
  const [ppi, setPpi] = useExportPpi();

  const dataListSize = useDataListSize();

  const exportDataList = useExportDataListAsZip({
    folder,
    imageName,
    onProgress: setDownloadProgress,
  });

  const percentage = Math.round((100 * downloadProgress) / dataListSize);
  const disabled = downloadProgress >= 0;

  return (
    <FormDialogButton
      button={<Button size="xs">ZIP</Button>}
      confirmText={percentage < 0 ? "Download" : `${percentage}%`}
      disabled={disabled}
      onConfirm={() => {
        setDownloadProgress(0);
        exportDataList().finally(() => setDownloadProgress(-1));
      }}
      title="Export as ZIP"
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
              min={0}
              onValueChange={setDpi}
              value={dpi}
            />
          </Group>

          <Group label="PPI">
            <NumberInput
              aria-label="PPI"
              disabled={disabled}
              min={0}
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
