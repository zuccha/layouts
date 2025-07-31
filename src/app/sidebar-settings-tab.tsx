import { Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import {
  LuCircleCheck,
  LuCircleX,
  LuFolderOpen,
  LuPlus,
  LuX,
} from "react-icons/lu";
import {
  clearImagesDirectory,
  openImagesDirectory,
  useImagesDirectoryHandle,
} from "../app-store";
import IconButton from "../components/ui/icon-button";
import { toaster } from "../components/ui/toaster";
import Subsection from "./subsection";

export default function SidebarSettingsTab() {
  const imagesDirectoryHandle = useImagesDirectoryHandle();

  return (
    <VStack gap={0}>
      <Subsection
        actions={
          <SidebarSettingsTabActions
            hasImagesDirectoryHandle={!!imagesDirectoryHandle}
          />
        }
        label="Images Folder"
      >
        {imagesDirectoryHandle ? (
          <HStack>
            <Icon color="fg.success" size="sm">
              <LuCircleCheck />
            </Icon>
            <Text fontSize="sm">{imagesDirectoryHandle.name}</Text>
          </HStack>
        ) : (
          <HStack>
            <Icon color="fg.error" size="sm">
              <LuCircleX />
            </Icon>
            <Text fontSize="sm">None</Text>
          </HStack>
        )}
      </Subsection>

      <Subsection
        actions={
          <IconButton
            Icon={LuPlus}
            aria-label="Add font"
            onClick={() => {}}
            size="xs"
            variant="ghost"
          />
        }
        label="Fonts"
        mr={-2}
      >
        <Text fontSize="sm">...</Text>
      </Subsection>
    </VStack>
  );
}

function SidebarSettingsTabActions({
  hasImagesDirectoryHandle,
}: {
  hasImagesDirectoryHandle: boolean;
}) {
  const [loading, setLoading] = useState(false);

  const remove = useCallback(async () => {
    setLoading(true);
    const error = await clearImagesDirectory();
    if (error) toaster.create({ title: error, type: "error" });
    setLoading(false);
  }, []);

  const open = useCallback(async () => {
    setLoading(true);
    const error = await openImagesDirectory();
    if (error) toaster.create({ title: error, type: "error" });
    setLoading(false);
  }, []);

  return (
    <Flex mr={-2}>
      <IconButton
        Icon={LuX}
        aria-label="Clear images folder"
        disabled={loading || !hasImagesDirectoryHandle}
        onClick={remove}
        size="xs"
        variant="ghost"
      />

      <IconButton
        Icon={LuFolderOpen}
        aria-label="Open images folder"
        disabled={loading}
        onClick={open}
        size="xs"
        variant="ghost"
      />
    </Flex>
  );
}
