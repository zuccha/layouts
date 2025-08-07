import { Center, HStack, Span, Text, VStack } from "@chakra-ui/react";
import { type ReactNode, useLayoutEffect, useState } from "react";
import DownloadableFrame from "./app/downloadable-frame";
import Editor from "./app/editor";
import Preview from "./app/preview";
import Sidebar from "./app/sidebar";
import {
  history,
  initialize,
  shouldRequestPermissions,
  useDownloadableFrameRef,
} from "./app-store";
import { Button } from "./components/ui/button";
import ThemeButton from "./theme/theme-button";

type AppState =
  | "loading"
  | "permissions"
  | "permissions-loading"
  | "success"
  | "failure";

function App() {
  const [state, setState] = useState<AppState>("loading");
  const downloadableFrameRef = useDownloadableFrameRef();

  useLayoutEffect(() => {
    const onLoad = async () => {
      try {
        const requestPermissions = await shouldRequestPermissions();
        if (requestPermissions) {
          setState("permissions");
        } else {
          setState("permissions-loading");
          await initialize();
          setState("success");
        }
      } catch {
        setState("failure");
      }
    };
    onLoad();
  }, []);

  useLayoutEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) history.redo();
        else history.undo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (state === "loading")
    return (
      <AppWrapper>
        <Center h="100vh">{/* <Spinner /> */}</Center>
      </AppWrapper>
    );

  if (state === "permissions")
    return (
      <AppWrapper>
        <Center h="100vh">
          <VStack>
            <Text>
              You need to grant access to the data and layout files and to the
              images folder before you can continue.
            </Text>
            <Text>
              This needs to be done every time you restart the browser, no way
              around it :(
            </Text>
            <Button
              onClick={() =>
                initialize()
                  .then(() => setState("success"))
                  .catch(() => setState("failure"))
              }
            >
              Request Permissions
            </Button>
          </VStack>
        </Center>
      </AppWrapper>
    );

  if (state === "failure") {
    return (
      <AppWrapper>
        <Center h="100vh">
          <Text>An error occurred, please reload the page.</Text>
        </Center>
      </AppWrapper>
    );
  }

  return (
    <AppWrapper>
      <HStack flex={1} gap={0} position="relative" w="full">
        <Sidebar />
        <Preview />
        <Editor />

        <DownloadableFrame ref={downloadableFrameRef} />
      </HStack>
    </AppWrapper>
  );
}

export default App;

function AppWrapper({ children }: { children: ReactNode }) {
  return (
    <VStack gap={0} h="100vh">
      <HStack
        h="3.25em"
        justify="space-between"
        px={4}
        py={2}
        shadow="sm"
        w="100%"
        zIndex={1}
      >
        <Span>
          <Span fontSize="lg" fontWeight={500}>
            Layouts
          </Span>
          <Span fontSize="sm"> v0.1.0</Span>
        </Span>
        <ThemeButton />
      </HStack>

      {children}
    </VStack>
  );
}
