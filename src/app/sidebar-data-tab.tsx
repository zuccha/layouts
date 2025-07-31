import { Field, Flex, Textarea } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { LuFolderOpen, LuRefreshCcw, LuSave } from "react-icons/lu";
import {
  initializeData,
  openData,
  saveData,
  updateActiveData,
  useActiveData,
  useDataUnsavedChanges,
} from "../app-store";
import IconButton from "../components/ui/icon-button";
import { toaster } from "../components/ui/toaster";
import useMountedLayoutEffect from "../hooks/use-mounted-layout-effect";
import Subsection from "./subsection";

export default function SidebarDataTab() {
  const data = useActiveData();
  const [dataString, setDataString] = useState(JSON.stringify(data, null, 2));
  const [valid, setValid] = useState(true);

  useMountedLayoutEffect(() => {
    const nextDataString = JSON.stringify(data, null, 2);
    if (dataString !== nextDataString) {
      setDataString(nextDataString);
      setValid(true);
    }
  }, [data]);

  const updateData = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const nextData = JSON.parse(e.target.value);
      updateActiveData(nextData);
      setDataString(e.target.value);
      setValid(true);
    } catch {
      setDataString(e.target.value);
      setValid(false);
    }
  };

  return (
    <Subsection actions={<SidebarDataTabActions />} label="Data">
      <Field.Root invalid={!valid}>
        <Textarea
          minH="20em"
          onChange={updateData}
          overflow="auto"
          size="xs"
          value={dataString}
          w="full"
          whiteSpace="pre"
        />
        <Field.ErrorText>Data is not valid</Field.ErrorText>
      </Field.Root>
    </Subsection>
  );
}

function SidebarDataTabActions() {
  const [loading, setLoading] = useState(false);
  const unsavedChanges = useDataUnsavedChanges();

  const open = useCallback(async () => {
    setLoading(true);
    const message = "There are unsaved changes, do you want to continue?";
    if (unsavedChanges && !confirm(message)) return;
    const error = await openData();
    if (error) toaster.create({ title: error, type: "error" });
    setLoading(false);
  }, [unsavedChanges]);

  const reload = useCallback(async () => {
    setLoading(true);
    const message = "There are unsaved changes, do you want to continue?";
    if (unsavedChanges && !confirm(message)) return;
    const error = await initializeData();
    if (error) toaster.create({ title: error, type: "error" });
    setLoading(false);
  }, [unsavedChanges]);

  const save = useCallback(async () => {
    setLoading(true);
    const error = await saveData();
    if (error) toaster.create({ title: error, type: "error" });
    setLoading(false);
  }, []);

  return (
    <Flex mr={-2}>
      <IconButton
        Icon={LuSave}
        aria-label="Save data"
        disabled={loading || !unsavedChanges}
        onClick={save}
        size="xs"
        variant="ghost"
      />

      <IconButton
        Icon={LuRefreshCcw}
        aria-label="Reload data"
        disabled={loading}
        onClick={reload}
        size="xs"
        variant="ghost"
      />

      <IconButton
        Icon={LuFolderOpen}
        aria-label="Load data"
        disabled={loading}
        onClick={open}
        size="xs"
        variant="ghost"
      />
    </Flex>
  );
}
