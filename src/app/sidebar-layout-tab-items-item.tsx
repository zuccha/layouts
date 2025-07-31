import { Editable, HStack, Icon } from "@chakra-ui/react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMemo } from "react";
import {
  LuEye,
  LuEyeClosed,
  LuImage,
  LuSquareDashed,
  LuType,
} from "react-icons/lu";
import {
  appendItemToActiveLayout,
  removeItemFromActiveLayout,
  selectActiveLayoutSelectedItem,
  updateBoxItemInActiveLayout,
  useActiveLayoutItem,
  useActiveLayoutSelectedItemId,
} from "../app-store";
import ContextMenu from "../components/ui/context-menu";

export type SidebarLayoutTabItemsItemProps = { itemId: string };

export default function SidebarLayoutTabItemsItem({
  itemId,
}: SidebarLayoutTabItemsItemProps) {
  const item = useActiveLayoutItem(itemId);
  const selectedItemId = useActiveLayoutSelectedItemId();

  const ItemIcon = itemIcons[item._type];

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: itemId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const contextMenuItems = useMemo(() => {
    return [
      {
        label: "Duplicate",
        onClick: () => {
          const id = crypto.randomUUID();
          appendItemToActiveLayout(id, { ...item, id });
        },
        value: "duplicate",
      },
      {
        label: "Remove",
        onClick: () => {
          removeItemFromActiveLayout(itemId);
        },
        value: "remove",
      },
    ];
  }, [item, itemId]);

  return (
    <ContextMenu
      contextTriggerProps={{ width: "full" }}
      items={contextMenuItems}
    >
      <HStack
        {...attributes}
        {...listeners}
        _hover={{ bgColor: "bg.muted" }}
        bgColor={selectedItemId === itemId ? "bg.emphasized" : undefined}
        borderRadius="md"
        className="group"
        color={item.visible ? undefined : "fg.subtle"}
        fontSize="xs"
        onClick={(e) => {
          selectActiveLayoutSelectedItem(itemId);
          e.stopPropagation();
        }}
        px={2}
        ref={setNodeRef}
        style={style}
        w="100%"
      >
        <ItemIcon />

        <Editable.Root
          activationMode="dblclick"
          flex={1}
          fontSize="xs"
          onValueChange={(e) => {
            const name = e.value.trim();
            if (name) updateBoxItemInActiveLayout(itemId, { name });
          }}
          overflow="hidden"
          size="sm"
          value={item.name}
          w="full"
        >
          <Editable.Preview
            _hover={{ bgColor: "transparent" }}
            cursor="default"
            flex={1}
            whiteSpace="nowrap"
          />
          <Editable.Input flex={1} textAlign="left" />
        </Editable.Root>

        <Icon
          _groupHover={{ display: "inline-block" }}
          color={item.visible ? undefined : "fg.subtle"}
          display="none"
          onClick={(e) => {
            updateBoxItemInActiveLayout(itemId, { visible: !item.visible });
            e.stopPropagation();
          }}
          size="sm"
        >
          {item.visible ? <LuEye /> : <LuEyeClosed />}
        </Icon>
      </HStack>
    </ContextMenu>
  );
}

const itemIcons = {
  image: LuImage,
  rectangle: LuSquareDashed,
  text: LuType,
} as const;
