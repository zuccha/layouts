import { IconButton, Menu, Portal, VStack } from "@chakra-ui/react";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useCallback } from "react";
import { LuPlus } from "react-icons/lu";
import {
  appendItemToActiveLayout,
  deselectActiveLayoutSelectedItem,
  reorderItemsInActiveLayout,
  useActiveLayoutItemIds,
  useActiveLayoutSize,
} from "../app-store";
import {
  layoutItemImageSchema,
  layoutItemLineSchema,
  layoutItemRectangleSchema,
  layoutItemTextSchema,
} from "../models/layout";
import SidebarLayoutTabItemsItem from "./sidebar-layout-tab-items-item";
import Subsection from "./subsection";

export default function SidebarLayoutTabItems() {
  const itemIds = useActiveLayoutItemIds();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      reorderItemsInActiveLayout((itemIds) => {
        const oldIndex = itemIds.indexOf(`${active.id}`);
        const newIndex = itemIds.indexOf(`${over.id}`);
        return arrayMove(itemIds, oldIndex, newIndex);
      });
    }
  }, []);

  return (
    <Subsection
      actions={<SidebarLayoutTabItemsActions />}
      flex={1}
      label="Items"
    >
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        sensors={sensors}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <VStack
            align="start"
            flex={1}
            gap={0}
            onClick={() => deselectActiveLayoutSelectedItem()}
            w="100%"
          >
            {itemIds.map((itemId) => (
              <SidebarLayoutTabItemsItem itemId={itemId} key={itemId} />
            ))}
          </VStack>
        </SortableContext>
      </DndContext>
    </Subsection>
  );
}

function SidebarLayoutTabItemsActions() {
  const size = useActiveLayoutSize();

  const addImage = useCallback(() => {
    const props = { name: "New image", ...size };
    const item = layoutItemImageSchema.parse(props);
    appendItemToActiveLayout(item.id, item);
  }, [size]);

  const addLine = useCallback(() => {
    const props = { name: "New line", ...size };
    const item = layoutItemLineSchema.parse(props);
    appendItemToActiveLayout(item.id, item);
  }, [size]);

  const addRectangle = useCallback(() => {
    const props = { name: "New rectangle", ...size };
    const item = layoutItemRectangleSchema.parse(props);
    appendItemToActiveLayout(item.id, item);
  }, [size]);

  const addText = useCallback(() => {
    const props = { name: "New text", ...size };
    const item = layoutItemTextSchema.parse(props);
    appendItemToActiveLayout(item.id, item);
  }, [size]);

  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <IconButton mr={-2} size="xs" variant="ghost">
          <LuPlus />
        </IconButton>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner>
          <Menu.Content>
            <Menu.Item onClick={addImage} value="add-image">
              New image
            </Menu.Item>
            <Menu.Item onClick={addLine} value="add-line">
              New line
            </Menu.Item>
            <Menu.Item onClick={addRectangle} value="add-rectangle">
              New rectangle
            </Menu.Item>
            <Menu.Item onClick={addText} value="add-text">
              New text
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  );
}
