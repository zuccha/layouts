import { Tabs, type TabsRootProps } from "@chakra-ui/react";
import { sidebarWidth } from "../theme/theme-constants";
import SidebarDataTab from "./sidebar-data-tab";
import SidebarLayoutTab from "./sidebar-layout-tab";
import SidebarSettingsTab from "./sidebar-settings-tab";

export type SidebarProps = TabsRootProps;

export default function Sidebar(props: SidebarProps) {
  return (
    <Tabs.Root
      borderRightWidth={1}
      defaultValue="layout"
      display="flex"
      flexDirection="column"
      h="100%"
      variant="enclosed"
      w={sidebarWidth}
      {...props}
    >
      <Tabs.List
        borderBottomWidth={1}
        borderRadius={0}
        h="3.5em"
        p={2}
        w="full"
      >
        <Tabs.Trigger value="layout">Layout</Tabs.Trigger>
        <Tabs.Trigger value="data">Data</Tabs.Trigger>
        <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content {...tabsContentProps} value="layout">
        <SidebarLayoutTab />
      </Tabs.Content>

      <Tabs.Content {...tabsContentProps} value="data">
        <SidebarDataTab />
      </Tabs.Content>

      <Tabs.Content {...tabsContentProps} value="settings">
        <SidebarSettingsTab />
      </Tabs.Content>
    </Tabs.Root>
  );
}

const tabsContentProps = {
  h: "calc(100vh - 6.75em)", // 100vh - tabs height - app header height
  overflow: "auto",
  pt: 0,
};
