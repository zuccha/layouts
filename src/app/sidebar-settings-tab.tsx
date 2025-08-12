import { Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { LuCircleCheck, LuCircleX, LuFolderOpen, LuX } from "react-icons/lu";
import {
  clearFontsDirectory,
  clearImagesDirectory,
  openFontsDirectory,
  openImagesDirectory,
  useFontsDirectoryHandle,
  useImagesDirectoryHandle,
} from "../app-store";
import IconButton from "../components/ui/icon-button";
import { toaster } from "../components/ui/toaster";
import Subsection from "./subsection";

export default function SidebarSettingsTab() {
  const imagesDirectoryHandle = useImagesDirectoryHandle();
  const fontsDirectoryHandle = useFontsDirectoryHandle();

  return (
    <VStack gap={0}>
      <DirectorySetting
        directoryHandle={imagesDirectoryHandle}
        label="Images"
        onClearDirectory={clearImagesDirectory}
        onOpenDirectory={openImagesDirectory}
      />

      <DirectorySetting
        directoryHandle={fontsDirectoryHandle}
        label="Fonts"
        onClearDirectory={clearFontsDirectory}
        onOpenDirectory={openFontsDirectory}
      />
    </VStack>
  );
}

function DirectorySetting({
  directoryHandle,
  label,
  onClearDirectory,
  onOpenDirectory,
}: {
  directoryHandle: FileSystemDirectoryHandle | undefined;
  label: string;
  onClearDirectory: () => Promise<string | undefined>;
  onOpenDirectory: () => Promise<string | undefined>;
}) {
  return (
    <Subsection
      actions={
        <DirectorySettingActions
          hasDirectoryHandle={!!directoryHandle}
          label={label.toLowerCase()}
          onClearDirectory={onClearDirectory}
          onOpenDirectory={onOpenDirectory}
        />
      }
      label={`${label} Folder`}
    >
      {directoryHandle ?
        <HStack>
          <Icon color="fg.success" size="sm">
            <LuCircleCheck />
          </Icon>
          <Text fontSize="sm">{directoryHandle.name}</Text>
        </HStack>
      : <HStack>
          <Icon color="fg.error" size="sm">
            <LuCircleX />
          </Icon>
          <Text fontSize="sm">None</Text>
        </HStack>
      }
    </Subsection>
  );
}

function DirectorySettingActions({
  hasDirectoryHandle,
  label,
  onClearDirectory,
  onOpenDirectory,
}: {
  hasDirectoryHandle: boolean;
  label: string;
  onClearDirectory: () => Promise<string | undefined>;
  onOpenDirectory: () => Promise<string | undefined>;
}) {
  const [loading, setLoading] = useState(false);

  const remove = useCallback(async () => {
    setLoading(true);
    const error = await onClearDirectory();
    if (error) toaster.create({ title: error, type: "error" });
    setLoading(false);
  }, [onClearDirectory]);

  const open = useCallback(async () => {
    setLoading(true);
    const error = await onOpenDirectory();
    if (error) toaster.create({ title: error, type: "error" });
    setLoading(false);
  }, [onOpenDirectory]);

  return (
    <Flex mr={-2}>
      <IconButton
        Icon={LuX}
        aria-label={`Clear ${label} folder`}
        disabled={loading || !hasDirectoryHandle}
        onClick={remove}
        size="xs"
        variant="ghost"
      />

      <IconButton
        Icon={LuFolderOpen}
        aria-label={`Open ${label} folder`}
        disabled={loading}
        onClick={open}
        size="xs"
        variant="ghost"
      />
    </Flex>
  );
}
