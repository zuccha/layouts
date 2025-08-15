import { Button, HStack, Span, VStack } from "@chakra-ui/react";
import { type ReactNode, useState } from "react";
import {
  useActiveLayoutBleed,
  useActiveLayoutSize,
  useDataListSize,
  useExportDpi,
  useExportPdfFilename,
  useExportPdfGap,
  useExportPdfMargin,
  useExportPpi,
} from "../app-store";
import FormDialogButton from "../components/ui/form-dialog-button";
import Input from "../components/ui/input";
import NumberInput from "../components/ui/number-input";
import useExportDataListAsPdf from "../hooks/use-export-data-list-as-pdf";

export default function EditorExportAsPdfButton() {
  const [downloadProgress, setDownloadProgress] = useState(-1);
  const [filename, setFilename] = useExportPdfFilename();
  const [gap, setGap] = useExportPdfGap();
  const [margin, setMargin] = useExportPdfMargin();
  const [dpi, setDpi] = useExportDpi();
  const [ppi, setPpi] = useExportPpi();
  const size = useActiveLayoutSize();
  const bleed = useActiveLayoutBleed();

  const dataListSize = useDataListSize();

  const exportDataList = useExportDataListAsPdf({
    filename,
    gap,
    h: (size.h + (bleed.visible ? bleed.h : 0)) / ppi,
    margin,
    onProgress: setDownloadProgress,
    w: (size.w + (bleed.visible ? bleed.w : 0)) / ppi,
  });

  const percentage = Math.round((100 * downloadProgress) / dataListSize);
  const disabled = downloadProgress >= 0;

  return (
    <FormDialogButton
      button={<Button size="xs">PDF</Button>}
      confirmText={percentage < 0 ? "Download" : `${percentage}%`}
      disabled={disabled}
      onConfirm={() => {
        setDownloadProgress(0);
        exportDataList().finally(() => setDownloadProgress(-1));
      }}
      title="Export as PDF"
    >
      <VStack align="flex-start">
        <HStack>
          <Group label="File name">
            <Input
              aria-label="File name"
              disabled={disabled}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="images"
              value={filename}
            />
          </Group>

          <Group label="Gap (in)">
            <NumberInput
              aria-label="Gap (in)"
              disabled={disabled}
              min={0}
              onValueChange={setGap}
              value={gap}
            />
          </Group>

          <Group label="Margin (in)">
            <NumberInput
              aria-label="Margin (in)"
              disabled={disabled}
              min={0}
              onValueChange={setMargin}
              value={margin}
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
