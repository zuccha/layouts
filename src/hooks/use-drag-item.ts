import { useCallback, useRef } from "react";
import {
  clearActiveLayoutSelectedItemSnapping,
  updateItemCoordsInActiveLayout,
} from "../app-store";
import type { LayoutItem } from "../models/layout";
import useDrag from "./use-drag";

export type UpdateType =
  | "move"
  | "move-0"
  | "move-1"
  | "resize-t"
  | "resize-b"
  | "resize-l"
  | "resize-r"
  | "resize-tl"
  | "resize-tr"
  | "resize-bl"
  | "resize-br";

export default function useDragItem(
  item: LayoutItem,
  scale: number,
  updateType: UpdateType,
) {
  const prevItemRef = useRef(item);
  const dragIdRef = useRef("");

  const id = item.id;

  const onDrag = useCallback(
    (dx: number, dy: number) => {
      const prevItem = prevItemRef.current;
      const coords = update[updateType](prevItem, dx / scale, dy / scale);
      const fixSize = updateType === "move";
      const source = dragIdRef.current;
      updateItemCoordsInActiveLayout(id, coords, fixSize, 5 / scale, source);
    },
    [id, scale, updateType],
  );

  const onDragStart = useDrag(onDrag, clearActiveLayoutSelectedItemSnapping);

  return useCallback(
    (e: PointerEvent) => {
      prevItemRef.current = item;
      dragIdRef.current = `drag-${crypto.randomUUID()}`;
      onDragStart(e);
    },
    [item, onDragStart],
  );
}

const update = {
  "move": (item: LayoutItem, dx: number, dy: number) => {
    return {
      x0: item.x0 + dx,
      x1: item.x1 + dx,
      y0: item.y0 + dy,
      y1: item.y1 + dy,
    };
  },

  "move-0": (item: LayoutItem, dx: number, dy: number) => {
    return {
      x0: item.x0 + dx,
      y0: item.y0 + dy,
    };
  },

  "move-1": (item: LayoutItem, dx: number, dy: number) => {
    return {
      x1: item.x1 + dx,
      y1: item.y1 + dy,
    };
  },

  "resize-t": (item: LayoutItem, _dx: number, dy: number) => {
    return {
      y0: Math.min(item.y0 + dy, item.y1),
    };
  },

  "resize-b": (item: LayoutItem, _dx: number, dy: number) => {
    return {
      y1: Math.max(item.y1 + dy, item.y0),
    };
  },

  "resize-l": (item: LayoutItem, dx: number, _dy: number) => {
    return {
      x0: Math.min(item.x0 + dx, item.x1),
    };
  },

  "resize-r": (item: LayoutItem, dx: number, _dy: number) => {
    return {
      x1: Math.max(item.x1 + dx, item.x0),
    };
  },

  "resize-tl": (item: LayoutItem, dx: number, dy: number) => {
    // TODO: Check if shift is pressed.
    // const delta = Math.max(dx, dy);
    // dx = delta;
    // dy = delta;
    return {
      x0: Math.min(item.x0 + dx, item.x1),
      y0: Math.min(item.y0 + dy, item.y1),
    };
  },

  "resize-tr": (item: LayoutItem, dx: number, dy: number) => {
    // TODO: Check if shift is pressed.
    // const delta = Math.max(-dx, dy);
    // dx = -delta;
    // dy = delta;
    return {
      x1: Math.max(item.x1 + dx, item.x0),
      y0: Math.min(item.y0 + dy, item.y1),
    };
  },

  "resize-bl": (item: LayoutItem, dx: number, dy: number) => {
    // TODO: Check if shift is pressed.
    // const delta = Math.max(dx, -dy);
    // dx = delta;
    // dy = -delta;
    return {
      x0: Math.min(item.x0 + dx, item.x1),
      y1: Math.max(item.y1 + dy, item.y0),
    };
  },

  "resize-br": (item: LayoutItem, dx: number, dy: number) => {
    // TODO: Check if shift is pressed.
    // const delta = Math.max(-dx, -dy);
    // dx = -delta;
    // dy = -delta;
    return {
      x1: Math.max(item.x1 + dx, item.x0),
      y1: Math.max(item.y1 + dy, item.y0),
    };
  },
} as const;
