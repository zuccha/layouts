import { Menu, type MenuContextTriggerProps, Portal } from "@chakra-ui/react";
import { type ReactNode } from "react";

export type ContextMenuProps = {
  children: ReactNode;
  contextTriggerProps?: MenuContextTriggerProps;
  items: { label: string; onClick: () => void; value: string }[];
};

export default function ContextMenu({
  children,
  contextTriggerProps,
  items,
}: ContextMenuProps) {
  return (
    <Menu.Root positioning={{ placement: "right-start" }} size="sm">
      <Menu.ContextTrigger {...contextTriggerProps}>
        {children}
      </Menu.ContextTrigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            {items.map((item) => (
              <Menu.Item
                key={item.value}
                onClick={item.onClick}
                value={item.value}
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
