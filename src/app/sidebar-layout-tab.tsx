import { Flex, HStack, VStack, parseColor } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import {
  LuEye,
  LuEyeClosed,
  LuFolderOpen,
  LuPlus,
  LuRuler,
  LuSave,
} from "react-icons/lu";
import {
  createActiveLayout,
  openActiveLayout,
  renameActiveLayout,
  resizeActiveLayout,
  saveActiveLayout,
  updateBleedInActiveLayout,
  useActiveLayoutBleed,
  useActiveLayoutName,
  useActiveLayoutSize,
  useActiveLayoutUnsavedChanges,
} from "../app-store";
import ColorPicker from "../components/ui/color-picker";
import IconButton from "../components/ui/icon-button";
import Input from "../components/ui/input";
import SizeInput from "../components/ui/size-input";
import { toaster } from "../components/ui/toaster";
import { useShowBleedGuide, useShowCardGuide } from "../hooks/use-settings";
import SidebarLayoutTabItems from "./sidebar-layout-tab-items";
import Subsection from "./subsection";

export default function SidebarLayoutTab() {
  const name = useActiveLayoutName();
  const size = useActiveLayoutSize();
  const bleed = useActiveLayoutBleed();

  const [showCardGuide, setShowCardGuide] = useShowCardGuide();
  const [showBleedGuide, setShowBleedGuide] = useShowBleedGuide();

  return (
    <VStack gap={0} w="full">
      <Subsection actions={<SidebarLayoutTabActions />} label="Name">
        <Input
          onChange={(e) => renameActiveLayout(e.target.value)}
          placeholder="Layout name"
          size="xs"
          value={name}
        />
      </Subsection>

      <Subsection
        actions={
          <IconButton
            Icon={LuRuler}
            aria-label={showCardGuide ? "Hide guide" : "Show guide"}
            bgColor={showCardGuide ? "bg.muted" : undefined}
            mr={-2}
            onClick={() => setShowCardGuide((prev) => !prev)}
            size="xs"
            variant="ghost"
          />
        }
        label="Size"
      >
        <SizeInput onChange={resizeActiveLayout} size="xs" value={size} />
      </Subsection>

      <Subsection
        actions={
          <HStack gap={0}>
            <IconButton
              Icon={bleed.visible ? LuEye : LuEyeClosed}
              aria-label={bleed.visible ? "Hide" : "Show"}
              onClick={() =>
                updateBleedInActiveLayout({ visible: !bleed.visible })
              }
              size="xs"
              variant="ghost"
            />

            <IconButton
              Icon={LuRuler}
              aria-label={showBleedGuide ? "Hide guide" : "Show guide"}
              bgColor={showBleedGuide ? "bg.muted" : undefined}
              disabled={!bleed.visible}
              mr={-2}
              onClick={() => setShowBleedGuide((prev) => !prev)}
              size="xs"
              variant="ghost"
            />
          </HStack>
        }
        label="Bleed"
      >
        <SizeInput
          onChange={updateBleedInActiveLayout}
          size="xs"
          value={bleed}
        />

        <ColorPicker
          aria-label="Bleed color"
          onValueChange={(color) =>
            updateBleedInActiveLayout({ color: color.valueAsString })
          }
          size="xs"
          value={parseColor(bleed.color)}
          w="full"
        />
      </Subsection>

      <SidebarLayoutTabItems />
    </VStack>
  );
}

function SidebarLayoutTabActions() {
  const unsavedChanges = useActiveLayoutUnsavedChanges();
  const [loading, setLoading] = useState(false);

  const create = useCallback(async () => {
    setLoading(true);
    const message = "There are unsaved changes, do you want to continue?";
    if (unsavedChanges && !confirm(message)) return;
    await createActiveLayout();
    setLoading(false);
  }, [unsavedChanges]);

  const open = useCallback(async () => {
    setLoading(true);
    const message = "There are unsaved changes, do you want to continue?";
    if (unsavedChanges && !confirm(message)) return;
    const error = await openActiveLayout();
    if (error) toaster.create({ title: error, type: "error" });
    setLoading(false);
  }, [unsavedChanges]);

  const save = useCallback(async () => {
    setLoading(true);
    const error = await saveActiveLayout();
    if (error) toaster.create({ title: error, type: "error" });
    setLoading(false);
  }, []);

  return (
    <Flex mr={-2}>
      <IconButton
        Icon={LuSave}
        aria-label="Save layout"
        disabled={loading || !unsavedChanges}
        onClick={save}
        size="xs"
        variant="ghost"
      />

      <IconButton
        Icon={LuFolderOpen}
        aria-label="Open layout"
        disabled={loading}
        onClick={open}
        size="xs"
        variant="ghost"
      />

      <IconButton
        Icon={LuPlus}
        aria-label="New layout"
        disabled={loading}
        onClick={create}
        size="xs"
        variant="ghost"
      />
    </Flex>
  );
}
