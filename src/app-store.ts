import { useLayoutEffect, useState } from "react";
import z from "zod/v4";
import type { CanvasFrameRef } from "./app/canvas-frame";
import useMountedLayoutEffect from "./hooks/use-mounted-layout-effect";
import { type Data, type DataList, dataResponseSchema } from "./models/data";
import {
  type Layout,
  type LayoutItem,
  type LayoutItemBox,
  type LayoutItemImage,
  type LayoutItemRectangle,
  type LayoutItemText,
  layoutSchema,
} from "./models/layout";
import type { Updater } from "./models/updater";
import { ensurePermission } from "./utils/file-system-handles";
import { inferFontVariant } from "./utils/font";
import { createHistory } from "./utils/history";
import { createObservable } from "./utils/observable";
import { createObservableById } from "./utils/observable-by-id";
import { createStore } from "./utils/store";
import { createStoreDB, initializeStores } from "./utils/store-db";
import {
  useStorePersistentNumber,
  useStorePersistentString,
} from "./utils/store-persistent";

//------------------------------------------------------------------------------
// History
//------------------------------------------------------------------------------

export const history = createHistory(100);

//------------------------------------------------------------------------------
// State
//------------------------------------------------------------------------------

const defaultLayout = layoutSchema.parse({});

type State = {
  activeLayout: Layout;
  activeLayoutSelectedItem?: LayoutItem;
  activeLayoutSelectedItemSnapping: {
    x0?: number;
    x1?: number;
    y0?: number;
    y1?: number;
  };
  activeLayoutUnsavedChanges: boolean;
  dataIndex: number;
  dataList: DataList;
  dataUnsavedChanges: boolean;
  fontsDirectoryDirHandle: FileSystemDirectoryHandle | undefined;
  imagesDirectoryDirHandle: FileSystemDirectoryHandle | undefined;
};

const state: State = {
  activeLayout: defaultLayout,
  activeLayoutSelectedItem: undefined,
  activeLayoutSelectedItemSnapping: {},
  activeLayoutUnsavedChanges: false,
  dataIndex: 0,
  dataList: [{}],
  dataUnsavedChanges: false,
  fontsDirectoryDirHandle: undefined,
  imagesDirectoryDirHandle: undefined,
};

//------------------------------------------------------------------------------
// DB Store
//------------------------------------------------------------------------------

const fileHandlesStore = createStoreDB<FileSystemFileHandle>("file-handles");
const activeLayoutFileHandleKey = "active-layout-file-handle";
const dataFileHandleKey = "data-file-handle";

const dirHandlesStore = createStoreDB<FileSystemDirectoryHandle>("dir-handles");
const imagesDirectoryHandleKey = "images-directory-handle";
const fontsDirectoryHandleKey = "fonts-directory-handle";

initializeStores();

//------------------------------------------------------------------------------
// Observables
//------------------------------------------------------------------------------

export const {
  notify: notifyActiveLayoutName,
  subscribe: subscribeActiveLayoutName,
} = createObservable<string>();

export const {
  notify: notifyActiveLayoutSize,
  subscribe: subscribeActiveLayoutSize,
} = createObservable<Layout["size"]>();

export const {
  notify: notifyActiveLayoutBleed,
  subscribe: subscribeActiveLayoutBleed,
} = createObservable<Layout["bleed"]>();

export const {
  notify: notifyActiveLayoutItemIds,
  subscribe: subscribeActiveLayoutItemIds,
} = createObservable<string[]>();

export const {
  notify: notifyActiveLayoutItem,
  subscribe: subscribeActiveLayoutItem,
} = createObservableById<LayoutItem>();

export const {
  notify: notifyActiveLayoutSelectedItemId,
  subscribe: subscribeActiveLayoutSelectedItemId,
} = createObservable<string | undefined>();

export const {
  notify: notifyActiveLayoutSelectedItemSnapping,
  subscribe: subscribeActiveLayoutSelectedItemSnapping,
} = createObservable<State["activeLayoutSelectedItemSnapping"]>();

export const {
  notify: notifyActiveLayoutUnsavedChanges,
  subscribe: subscribeActiveLayoutUnsavedChanges,
} = createObservable<boolean>();

export const { notify: notifyData, subscribe: subscribeData } =
  createObservableById<Data>();

export const { notify: notifyDataList, subscribe: subscribeDataList } =
  createObservable<DataList>();

export const { notify: notifyDataIndex, subscribe: subscribeDataIndex } =
  createObservable<number>();

export const {
  notify: notifyDataUnsavedChanges,
  subscribe: subscribeDataUnsavedChanges,
} = createObservable<boolean>();

export const {
  notify: notifyImagesDirectoryHandle,
  subscribe: subscribeImagesDirectoryHandle,
} = createObservable<State["imagesDirectoryDirHandle"]>();

export const {
  notify: notifyFontsDirectoryHandle,
  subscribe: subscribeFontsDirectoryHandle,
} = createObservable<State["fontsDirectoryDirHandle"]>();

//------------------------------------------------------------------------------
// Check Permissions
//------------------------------------------------------------------------------

export async function shouldRequestPermissions(): Promise<boolean> {
  const handles = await Promise.all([
    fileHandlesStore.load(activeLayoutFileHandleKey),
    fileHandlesStore.load(dataFileHandleKey),
    dirHandlesStore.load(imagesDirectoryHandleKey),
    dirHandlesStore.load(fontsDirectoryHandleKey),
  ]);

  const statuses = await Promise.all(
    handles.map((handle) =>
      handle ?
        handle.queryPermission({ mode: "read" })
      : Promise.resolve("granted" as PermissionState),
    ),
  );

  return statuses.some((status) => status !== "granted");
}

export async function initialize() {
  await initializeActiveLayout();
  await initializeData();
  await initializeImagesDirectory();
  await initializeFontsDirectory();
  await loadFonts();
}

//------------------------------------------------------------------------------
// With Source
//------------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type WithSource<F extends (...args: any[]) => any> = (
  ...args: [...Parameters<F>, source?: string]
) => ReturnType<F>;

//------------------------------------------------------------------------------
// Set Active Layout
//------------------------------------------------------------------------------

function _setActiveLayout(layout: Layout, unsavedChanges: boolean) {
  state.activeLayout = layout;
  state.activeLayoutSelectedItem = undefined;
  state.activeLayoutUnsavedChanges = unsavedChanges;
  notifyActiveLayoutName(layout.name);
  notifyActiveLayoutSize(layout.size);
  notifyActiveLayoutBleed(layout.bleed);
  notifyActiveLayoutItemIds(layout.items.ids);
  notifyActiveLayoutSelectedItemId(undefined);
  notifyActiveLayoutUnsavedChanges(unsavedChanges);
}

export const setActiveLayout: WithSource<typeof _setActiveLayout> = (
  layout,
  unsavedChanges,
) => {
  history.clear();
  return _setActiveLayout(layout, unsavedChanges);
};

//------------------------------------------------------------------------------
// Initialize Active Layout
//------------------------------------------------------------------------------

async function _initializeActiveLayout() {
  try {
    const fileHandle = await fileHandlesStore.load(activeLayoutFileHandleKey);
    if (fileHandle) {
      if (await ensurePermission(fileHandle, "read")) {
        const file = await fileHandle.getFile();
        const content = await file.text();
        const json = JSON.parse(content);
        const layout = layoutSchema.parse(json);
        await fileHandlesStore.save(activeLayoutFileHandleKey, fileHandle);
        _setActiveLayout(layout, false);
      } else {
        await fileHandlesStore.remove(activeLayoutFileHandleKey);
        return "You don't have permission to load previously stored layout";
      }
    }
  } catch (err) {
    console.error("Layout initialization error:", err);
    await fileHandlesStore.remove(activeLayoutFileHandleKey);
  }
}

export const initializeActiveLayout: WithSource<
  typeof _initializeActiveLayout
> = () => {
  history.clear();
  return _initializeActiveLayout();
};

//------------------------------------------------------------------------------
// Create Active Layout
//------------------------------------------------------------------------------

async function _createActiveLayout() {
  const layout = layoutSchema.parse({});
  _setActiveLayout(layout, true);
  await fileHandlesStore.remove(activeLayoutFileHandleKey);
}

export const createActiveLayout: WithSource<
  typeof _createActiveLayout
> = () => {
  history.clear();
  return _createActiveLayout();
};

//------------------------------------------------------------------------------
// Open Active Layout
//------------------------------------------------------------------------------

async function _openActiveLayout(): Promise<string | undefined> {
  try {
    const [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    const content = await file.text();
    const json = JSON.parse(content);
    const layout = layoutSchema.parse(json);
    _setActiveLayout(layout, false);
    await fileHandlesStore.save(activeLayoutFileHandleKey, fileHandle);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return undefined;
    } else if (err instanceof SyntaxError) {
      return "The chosen file is not a valid JSON";
    } else if (err instanceof z.ZodError) {
      return "The chosen file is not a valid layout";
    } else {
      console.error("File open error:", err);
      return "An error occurred while opening the file";
    }
  }
  return undefined;
}

export const openActiveLayout: WithSource<typeof _openActiveLayout> = () => {
  history.clear();
  return _openActiveLayout();
};

//------------------------------------------------------------------------------
// Save Active Layout
//------------------------------------------------------------------------------

async function _saveActiveLayout(): Promise<string | undefined> {
  try {
    const fileHandle =
      (await fileHandlesStore.load(activeLayoutFileHandleKey)) ??
      (await window.showSaveFilePicker({ suggestedName: `layout.json` }));
    if (await ensurePermission(fileHandle, "readwrite")) {
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(state.activeLayout, null, 2));
      await writable.close();
      await fileHandlesStore.save(activeLayoutFileHandleKey, fileHandle);
      notifyActiveLayoutUnsavedChanges(false);
    } else {
      return "You don't have permission to write on the layout file";
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return undefined;
    } else {
      console.error("File open error:", err);
      return "An error occurred while saving the file";
    }
  }
  return undefined;
}

export const saveActiveLayout: WithSource<typeof _saveActiveLayout> = () => {
  // No history change.
  return _saveActiveLayout();
};

//------------------------------------------------------------------------------
// Rename Active Layout
//------------------------------------------------------------------------------

function _renameActiveLayout(name: string): void {
  state.activeLayout.name = name;
  notifyActiveLayoutName(name);
  notifyActiveLayoutUnsavedChanges(true);
}

export const renameActiveLayout: WithSource<typeof _renameActiveLayout> = (
  name,
  source,
) => {
  const prevName = state.activeLayout.name;
  history.add({
    id: source ? `renameActiveLayout/${source}` : undefined,
    redo: () => _renameActiveLayout(name),
    undo: () => _renameActiveLayout(prevName),
  });
  return _renameActiveLayout(name);
};

//------------------------------------------------------------------------------
// Resize Active Layout
//------------------------------------------------------------------------------

function _resizeActiveLayout(partialSize: Partial<Layout["size"]>): void {
  const size = { ...state.activeLayout.size, ...partialSize };
  state.activeLayout.size = size;
  notifyActiveLayoutSize(size);
  notifyActiveLayoutUnsavedChanges(true);
}

export const resizeActiveLayout: WithSource<typeof _resizeActiveLayout> = (
  partialSize,
  source,
) => {
  const prevSize = state.activeLayout.size;
  history.add({
    id: source ? `resizeActiveLayout/${source}` : undefined,
    redo: () => _resizeActiveLayout(partialSize),
    undo: () => _resizeActiveLayout(prevSize),
  });
  return _resizeActiveLayout(partialSize);
};

//------------------------------------------------------------------------------
// Update Bleed In Active Layout
//------------------------------------------------------------------------------

function _updateBleedInActiveLayout(
  partialBleed: Partial<Layout["bleed"]>,
): void {
  const bleed = { ...state.activeLayout.bleed, ...partialBleed };
  state.activeLayout.bleed = bleed;
  notifyActiveLayoutBleed(bleed);
  notifyActiveLayoutUnsavedChanges(true);
}

export const updateBleedInActiveLayout: WithSource<
  typeof _updateBleedInActiveLayout
> = (partialBleed, source) => {
  const prevBleed = state.activeLayout.bleed;
  history.add({
    id: source ? `updateBleedInActiveLayout/${source}` : undefined,
    redo: () => _updateBleedInActiveLayout(partialBleed),
    undo: () => _updateBleedInActiveLayout(prevBleed),
  });
  return _updateBleedInActiveLayout(partialBleed);
};

//------------------------------------------------------------------------------
// Insert Item In Active Layout
//------------------------------------------------------------------------------

function _insertItemInActiveLayout(
  id: string,
  item: LayoutItem,
  index: number,
): void {
  const items = state.activeLayout.items;
  if (items.ids.includes(id)) return;
  items.ids = [...items.ids.slice(0, index), id, ...items.ids.slice(index)];
  items.byId[id] = item;
  notifyActiveLayoutItemIds(items.ids);
  state.activeLayoutSelectedItem = item;
  notifyActiveLayoutSelectedItemId(item.id);
  notifyActiveLayoutUnsavedChanges(true);
}

export const insertItemInActiveLayout: WithSource<
  typeof _insertItemInActiveLayout
> = (id, item, index, source) => {
  history.add({
    id: source ? `insertItemInActiveLayout/${source}` : undefined,
    redo: () => _insertItemInActiveLayout(id, item, index),
    undo: () => _removeItemFromActiveLayout(id),
  });
  return _insertItemInActiveLayout(id, item, index);
};

//------------------------------------------------------------------------------
// Append Item To Active Layout
//------------------------------------------------------------------------------

function _appendItemToActiveLayout(id: string, item: LayoutItem): void {
  const items = state.activeLayout.items;
  if (items.ids.includes(id)) return;
  items.ids = [...items.ids, id];
  items.byId[id] = item;
  notifyActiveLayoutItemIds(items.ids);
  state.activeLayoutSelectedItem = item;
  notifyActiveLayoutSelectedItemId(item.id);
  notifyActiveLayoutUnsavedChanges(true);
}

export const appendItemToActiveLayout: WithSource<
  typeof _appendItemToActiveLayout
> = (id, item, source) => {
  history.add({
    id: source ? `appendItemToActiveLayout/${source}` : undefined,
    redo: () => _appendItemToActiveLayout(id, item),
    undo: () => _removeItemFromActiveLayout(id),
  });
  return _appendItemToActiveLayout(id, item);
};

//------------------------------------------------------------------------------
// Remove Item From Active Layout
//------------------------------------------------------------------------------

function _removeItemFromActiveLayout(id: string): void {
  const items = state.activeLayout.items;
  if (!items.ids.includes(id)) return;
  items.ids = items.ids.filter((i) => i !== id);
  delete items.byId[id];
  notifyActiveLayoutItemIds(items.ids);
  if (state.activeLayoutSelectedItem?.id === id) {
    state.activeLayoutSelectedItem = undefined;
    notifyActiveLayoutSelectedItemId(undefined);
  }
  notifyActiveLayoutUnsavedChanges(true);
}

export const removeItemFromActiveLayout: WithSource<
  typeof _removeItemFromActiveLayout
> = (id, source) => {
  const prevItem = state.activeLayout.items.byId[id];
  const prevIndex = state.activeLayout.items.ids.indexOf(id);
  history.add({
    id: source ? `removeItemFromActiveLayout/${source}` : undefined,
    redo: () => _removeItemFromActiveLayout(id),
    undo: () => _insertItemInActiveLayout(id, prevItem, prevIndex),
  });
  return _removeItemFromActiveLayout(id);
};

//------------------------------------------------------------------------------
// Update Box Item In Active Layout
//------------------------------------------------------------------------------

function _updateBoxItemInActiveLayout(
  id: string,
  partialItem: Partial<LayoutItemBox>,
): void {
  if (!state.activeLayout.items.ids.includes(id)) return undefined;
  const prevItem = state.activeLayout.items.byId[id];
  const item = { ...prevItem, ...partialItem };
  state.activeLayout.items.byId[id] = item;
  notifyActiveLayoutItem(id, item);
  notifyActiveLayoutUnsavedChanges(true);
}

export const updateBoxItemInActiveLayout: WithSource<
  typeof _updateBoxItemInActiveLayout
> = (id, partialItem, source?) => {
  const prevItem = state.activeLayout.items.byId[id];
  history.add({
    id: source ? `updateItemInActiveLayout/${source}` : undefined,
    redo: () => _updateBoxItemInActiveLayout(id, partialItem),
    undo: () => _updateBoxItemInActiveLayout(id, prevItem),
  });
  return _updateBoxItemInActiveLayout(id, partialItem);
};

//------------------------------------------------------------------------------
// Update Item In Active Layout
//------------------------------------------------------------------------------

function _updateItemInActiveLayout<LI extends LayoutItem>(
  id: string,
  partialItem: Partial<LI>,
  type: LI["_type"],
): void {
  if (!state.activeLayout.items.ids.includes(id)) return undefined;
  const prevItem = state.activeLayout.items.byId[id];
  if (prevItem._type !== type) return;
  const item = { ...prevItem, ...partialItem };
  state.activeLayout.items.byId[id] = item;
  notifyActiveLayoutItem(id, item);
  notifyActiveLayoutUnsavedChanges(true);
}

export const updateItemInActiveLayout = <LI extends LayoutItem>(
  id: string,
  partialItem: Partial<LI>,
  type: LI["_type"],
  source?: string,
) => {
  const prevItem = state.activeLayout.items.byId[id];
  history.add({
    id: source ? `updateItemInActiveLayout/${source}` : undefined,
    redo: () => _updateItemInActiveLayout(id, partialItem, type),
    undo: () =>
      _updateItemInActiveLayout<typeof prevItem>(id, prevItem, prevItem._type),
  });
  return _updateItemInActiveLayout(id, partialItem, type);
};

//------------------------------------------------------------------------------
// Update Image Item In Active Layout
//------------------------------------------------------------------------------

export const updateImageItemInActiveLayout = (
  id: string,
  partialItem: Partial<LayoutItemImage>,
  source?: string,
) => updateItemInActiveLayout(id, partialItem, "image", source);

//------------------------------------------------------------------------------
// Update Rectangle Item In Active Layout
//------------------------------------------------------------------------------

export const updateRectangleItemInActiveLayout = (
  id: string,
  partialItem: Partial<LayoutItemRectangle>,
  source?: string,
) => updateItemInActiveLayout(id, partialItem, "rectangle", source);

//------------------------------------------------------------------------------
// Update Text Item In Active Layout
//------------------------------------------------------------------------------

export const updateTextItemInActiveLayout = (
  id: string,
  partialItem: Partial<LayoutItemText>,
  source?: string,
) => updateItemInActiveLayout(id, partialItem, "text", source);

//------------------------------------------------------------------------------
// Update Box Item Coords In Active Layout
//------------------------------------------------------------------------------

type Coords = { x0: number; x1: number; y0: number; y1: number };

export const updateBoxItemCoordsInActiveLayout = (
  id: string,
  partialItem: Partial<LayoutItem>,
  fixSize: boolean,
  range: number,
  source?: string,
) => {
  const item = state.activeLayout.items.byId[id];

  const delta = { ...partialItem };
  const size = { h: item.y1 - item.y0, w: item.x1 - item.x0 };

  state.activeLayoutSelectedItemSnapping = {
    x0: undefined,
    x1: undefined,
    y0: undefined,
    y1: undefined,
  };

  for (const otherId of state.activeLayout.items.ids) {
    if (otherId === id) continue;
    const other = state.activeLayout.items.byId[otherId];
    if (!other.visible) continue;
    snap(delta, size, other, fixSize, range);
  }

  const frameSize = state.activeLayout.size;
  const frame = { x0: 0, x1: frameSize.w, y0: 0, y1: frameSize.h };
  snap(delta, size, frame, fixSize, range);

  notifyActiveLayoutSelectedItemSnapping(
    state.activeLayoutSelectedItemSnapping,
  );

  return updateBoxItemInActiveLayout(id, delta, source);
};

function snap(
  delta: Partial<LayoutItem>,
  size: { h: number; w: number },
  target: Coords,
  fixSize: boolean,
  range: number,
) {
  if (delta.x0 !== undefined) {
    const prevX0 = delta.x0;
    delta.x0 = snapH(delta.x0, target, range);
    if (fixSize) delta.x1 = delta.x0 + size.w;
    if (prevX0 !== delta.x0)
      state.activeLayoutSelectedItemSnapping.x0 = delta.x0;
  }
  if (delta.x1 !== undefined) {
    const prevX1 = delta.x1;
    delta.x1 = snapH(delta.x1, target, range);
    if (fixSize) delta.x0 = delta.x1 - size.w;
    if (prevX1 !== delta.x1)
      state.activeLayoutSelectedItemSnapping.x1 = delta.x1;
  }
  if (delta.y0 !== undefined) {
    const prevY0 = delta.y0;
    delta.y0 = snapV(delta.y0, target, range);
    if (fixSize) delta.y1 = delta.y0 + size.h;
    if (prevY0 !== delta.y0)
      state.activeLayoutSelectedItemSnapping.y0 = delta.y0;
  }
  if (delta.y1 !== undefined) {
    const prevY1 = delta.y1;
    delta.y1 = snapV(delta.y1, target, range);
    if (fixSize) delta.y0 = delta.y1 - size.h;
    if (prevY1 !== delta.y1)
      state.activeLayoutSelectedItemSnapping.y1 = delta.y1;
  }
}

function snapH(value: number, target: Coords, range: number): number {
  if (near(value, target.x0, range)) return target.x0;
  if (near(value, target.x1, range)) return target.x1;
  if (near(value, target.x0 + Math.abs(target.x1 - target.x0) / 2, range))
    return target.x0 + Math.abs(target.x1 - target.x0) / 2;
  return value;
}

function snapV(value: number, target: Coords, range: number): number {
  if (near(value, target.y0, range)) return target.y0;
  if (near(value, target.y1, range)) return target.y1;
  if (near(value, target.y0 + Math.abs(target.y1 - target.y0) / 2, range))
    return target.y0 + Math.abs(target.y1 - target.y0) / 2;
  return value;
}

function near(value: number, target: number, range: number): boolean {
  return target - range <= value && value <= target + range;
}

//------------------------------------------------------------------------------
// Reorder Items In Active Layout
//------------------------------------------------------------------------------

function _reorderItemsInActiveLayout(idsOrUpdateIds: Updater<string[]>): void {
  const ids =
    typeof idsOrUpdateIds === "function" ?
      idsOrUpdateIds(state.activeLayout.items.ids)
    : idsOrUpdateIds;
  if (state.activeLayout.items.ids.length !== ids.length) return;
  if (ids.some((id) => !state.activeLayout.items.byId[id])) return;
  state.activeLayout.items.ids = ids;
  notifyActiveLayoutItemIds(ids);
  notifyActiveLayoutUnsavedChanges(true);
}

export const reorderItemsInActiveLayout: WithSource<
  typeof _reorderItemsInActiveLayout
> = (idsOrUpdateIds, source) => {
  const prevIds = [...state.activeLayout.items.ids];
  history.add({
    id: source ? `reorderItemsInActiveLayout/${source}` : undefined,
    redo: () => _reorderItemsInActiveLayout(idsOrUpdateIds),
    undo: () => _reorderItemsInActiveLayout(prevIds),
  });
  return _reorderItemsInActiveLayout(idsOrUpdateIds);
};

//------------------------------------------------------------------------------
// Select Active Layout Selected Item
//------------------------------------------------------------------------------

function _selectActiveLayoutSelectedItem(id: string): void {
  if (state.activeLayoutSelectedItem?.id === id) return;
  state.activeLayoutSelectedItem = state.activeLayout.items.byId[id];
  notifyActiveLayoutSelectedItemId(id);
}

export const selectActiveLayoutSelectedItem: WithSource<
  typeof _selectActiveLayoutSelectedItem
> = (id, source) => {
  const prevSelectedItemId = state.activeLayoutSelectedItem?.id;
  if (prevSelectedItemId === id) return;
  history.add({
    id: source ? `selectActiveLayoutSelectedItem/${source}` : undefined,
    redo: () => _selectActiveLayoutSelectedItem(id),
    undo: () =>
      prevSelectedItemId ?
        _selectActiveLayoutSelectedItem(prevSelectedItemId)
      : _deselectActiveLayoutSelectedItem(),
  });
  return _selectActiveLayoutSelectedItem(id);
};

//------------------------------------------------------------------------------
// Deselect Active Layout Selected Item
//------------------------------------------------------------------------------

function _deselectActiveLayoutSelectedItem(): void {
  if (state.activeLayoutSelectedItem === undefined) return;
  state.activeLayoutSelectedItem = undefined;
  notifyActiveLayoutSelectedItemId(undefined);
}

export const deselectActiveLayoutSelectedItem: WithSource<
  typeof _deselectActiveLayoutSelectedItem
> = (source) => {
  const prevSelectedItemId = state.activeLayoutSelectedItem?.id;
  if (!prevSelectedItemId) return;
  history.add({
    id: source ? `deselectActiveLayoutSelectedItem/${source}` : undefined,
    redo: () => _deselectActiveLayoutSelectedItem(),
    undo: () => _selectActiveLayoutSelectedItem(prevSelectedItemId),
  });
  return _deselectActiveLayoutSelectedItem();
};

//------------------------------------------------------------------------------
// Clear Active Layout Selected Item Snapping
//------------------------------------------------------------------------------

export const clearActiveLayoutSelectedItemSnapping = (): void => {
  state.activeLayoutSelectedItemSnapping = {};
  notifyActiveLayoutSelectedItemSnapping({});
};

//------------------------------------------------------------------------------
// Initialize Data
//------------------------------------------------------------------------------

async function _initializeData(): Promise<string | undefined> {
  try {
    const fileHandle = await fileHandlesStore.load(dataFileHandleKey);
    if (fileHandle) {
      if (await ensurePermission(fileHandle, "read")) {
        const file = await fileHandle.getFile();
        const content = await file.text();
        const json = JSON.parse(content);
        const dataResponse = dataResponseSchema.parse(json);
        await fileHandlesStore.save(dataFileHandleKey, fileHandle);
        state.dataList =
          Array.isArray(dataResponse) ?
            (dataResponse as DataList)
          : [dataResponse];
        notifyDataList(state.dataList);
        state.dataIndex = 0;
        notifyDataIndex(state.dataIndex);
        state.activeLayoutUnsavedChanges = false;
        notifyDataUnsavedChanges(false);
      } else {
        await fileHandlesStore.remove(dataFileHandleKey);
        return "You don't have permission to load previously stored data";
      }
    }
  } catch (err) {
    await fileHandlesStore.remove(dataFileHandleKey);
    if (err instanceof DOMException && err.name === "AbortError") {
      return undefined;
    } else if (err instanceof SyntaxError) {
      return "The file is not a valid JSON";
    } else if (err instanceof z.ZodError) {
      return "The file is not valid data";
    } else {
      console.error("File open error:", err);
      return "An error occurred while loading data";
    }
  }
  return undefined;
}

export const initializeData: WithSource<typeof _initializeData> = () => {
  history.clear();
  return _initializeData();
};

//------------------------------------------------------------------------------
// Open Data
//------------------------------------------------------------------------------

async function _openData(): Promise<string | undefined> {
  try {
    const [fileHandle] = await window.showOpenFilePicker();
    const file = await fileHandle.getFile();
    const content = await file.text();
    const json = JSON.parse(content);
    const dataResponse = dataResponseSchema.parse(json);
    await fileHandlesStore.save(dataFileHandleKey, fileHandle);
    state.dataList =
      Array.isArray(dataResponse) ? (dataResponse as DataList) : [dataResponse];
    notifyDataList(state.dataList);
    state.dataIndex = 0;
    notifyDataIndex(state.dataIndex);
    state.activeLayoutUnsavedChanges = false;
    notifyDataUnsavedChanges(false);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return undefined;
    } else if (err instanceof SyntaxError) {
      return "The chosen file is not a valid JSON";
    } else if (err instanceof z.ZodError) {
      return "The chosen file is not valid data";
    } else {
      console.error("File open error:", err);
      return "An error occurred while loading data";
    }
  }
  return undefined;
}

export const openData: WithSource<typeof _openData> = () => {
  history.clear();
  return _openData();
};

//------------------------------------------------------------------------------
// Save Data
//------------------------------------------------------------------------------

export async function saveData(): Promise<string | undefined> {
  try {
    const fileHandle =
      (await fileHandlesStore.load(dataFileHandleKey)) ??
      (await window.showSaveFilePicker({ suggestedName: `data.json` }));
    if (await ensurePermission(fileHandle, "readwrite")) {
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(state.dataList, null, 2));
      await writable.close();
      await fileHandlesStore.save(dataFileHandleKey, fileHandle);
      notifyDataUnsavedChanges(false);
    } else {
      return "You don't have permission to write on the data file";
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return undefined;
    } else {
      console.error("File open error:", err);
      return "An error occurred while saving the data file";
    }
  }
  return undefined;
}

//------------------------------------------------------------------------------
// Get Active Data
//------------------------------------------------------------------------------

export function getActiveData(): [Data, number] {
  return [state.dataList[state.dataIndex], state.dataIndex];
}

//------------------------------------------------------------------------------
// Switch To Next Data
//------------------------------------------------------------------------------

function _switchToNextData(): void {
  state.dataIndex = (state.dataIndex + 1) % state.dataList.length;
  notifyDataIndex(state.dataIndex);
}

export const switchToNextData: WithSource<typeof _switchToNextData> = (
  source,
) => {
  if (state.dataList.length < 2) return;
  history.add({
    id: source ? `switchToNextData/${source}` : undefined,
    redo: () => _switchToNextData(),
    undo: () => _switchToPrevData(),
  });
  return _switchToNextData();
};

//------------------------------------------------------------------------------
// Switch To Prev Data
//------------------------------------------------------------------------------

function _switchToPrevData(): void {
  state.dataIndex =
    state.dataIndex - 1 < 0 ? state.dataList.length - 1 : state.dataIndex - 1;
  notifyDataIndex(state.dataIndex);
}

export const switchToPrevData: WithSource<typeof _switchToPrevData> = (
  source,
) => {
  if (state.dataList.length < 2) return;
  history.add({
    id: source ? `switchToPrevData/${source}` : undefined,
    redo: () => _switchToPrevData(),
    undo: () => _switchToNextData(),
  });
  return _switchToPrevData();
};

//------------------------------------------------------------------------------
// Update Data
//------------------------------------------------------------------------------

function _updateActiveData(data: Data): void {
  const index = state.dataIndex;
  state.dataList[index] = data;
  state.dataUnsavedChanges = true;
  notifyData(`${index}`, data);
  notifyDataList(state.dataList);
  notifyDataUnsavedChanges(true);
}

export const updateActiveData: WithSource<typeof _updateActiveData> = (
  data: Data,
  source?: string,
) => {
  const prevData = state.dataList[state.dataIndex];
  history.add({
    id: source ? `updateActiveData/${source}` : undefined,
    redo: () => _updateActiveData(data),
    undo: () => _updateActiveData(prevData),
  });
  return _updateActiveData(data);
};

//------------------------------------------------------------------------------
// Initialize Images Directory
//------------------------------------------------------------------------------

async function _initializeImagesDirectory(): Promise<string | undefined> {
  try {
    const dirHandle = await dirHandlesStore.load(imagesDirectoryHandleKey);
    if (dirHandle) {
      if (await ensurePermission(dirHandle, "read")) {
        await dirHandlesStore.save(imagesDirectoryHandleKey, dirHandle);
        state.imagesDirectoryDirHandle = dirHandle;
        notifyImagesDirectoryHandle(dirHandle);
      } else {
        await dirHandlesStore.remove(imagesDirectoryHandleKey);
        return "You don't have the permissions to access the saved images folder";
      }
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return undefined;
    } else {
      console.error("Directory open error:", err);
      return "An error occurred while initializing the images folder";
    }
  }
  return undefined;
}

export const initializeImagesDirectory: WithSource<
  typeof _initializeImagesDirectory
> = () => {
  history.clear();
  return _initializeImagesDirectory();
};

//------------------------------------------------------------------------------
// Open Images Directory
//------------------------------------------------------------------------------

async function _openImagesDirectory(): Promise<string | undefined> {
  try {
    const dirHandle = await window.showDirectoryPicker();
    await dirHandlesStore.save(imagesDirectoryHandleKey, dirHandle);
    state.imagesDirectoryDirHandle = dirHandle;
    notifyImagesDirectoryHandle(dirHandle);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return undefined;
    } else {
      console.error("Directory open error:", err);
      return "An error occurred while choosing the images folder";
    }
  }
  return undefined;
}

export const openImagesDirectory: WithSource<
  typeof _openImagesDirectory
> = () => {
  history.clear();
  return _openImagesDirectory();
};

//------------------------------------------------------------------------------
// Clear Images Directory
//------------------------------------------------------------------------------

async function _clearImagesDirectory(): Promise<string | undefined> {
  try {
    await dirHandlesStore.remove(imagesDirectoryHandleKey);
    state.imagesDirectoryDirHandle = undefined;
    notifyImagesDirectoryHandle(undefined);
  } catch (err) {
    console.error("Images directory removal error:", err);
    return "An error occurred while removing images folder";
  }
  return undefined;
}

export const clearImagesDirectory: WithSource<
  typeof _clearImagesDirectory
> = () => {
  history.clear();
  return _clearImagesDirectory();
};

//------------------------------------------------------------------------------
// Initialize Fonts Directory
//------------------------------------------------------------------------------

async function _initializeFontsDirectory(): Promise<string | undefined> {
  try {
    const dirHandle = await dirHandlesStore.load(fontsDirectoryHandleKey);
    if (dirHandle) {
      if (await ensurePermission(dirHandle, "read")) {
        await dirHandlesStore.save(fontsDirectoryHandleKey, dirHandle);
        state.fontsDirectoryDirHandle = dirHandle;
        notifyFontsDirectoryHandle(dirHandle);
      } else {
        await dirHandlesStore.remove(fontsDirectoryHandleKey);
        return "You don't have the permissions to access the saved fonts folder";
      }
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return undefined;
    } else {
      console.error("Directory open error:", err);
      return "An error occurred while initializing the fonts folder";
    }
  }
  return undefined;
}

export const initializeFontsDirectory: WithSource<
  typeof _initializeFontsDirectory
> = () => {
  history.clear();
  return _initializeFontsDirectory();
};

//------------------------------------------------------------------------------
// Open Fonts Directory
//------------------------------------------------------------------------------

async function _openFontsDirectory(): Promise<string | undefined> {
  try {
    const dirHandle = await window.showDirectoryPicker();
    await dirHandlesStore.save(fontsDirectoryHandleKey, dirHandle);
    state.fontsDirectoryDirHandle = dirHandle;
    notifyFontsDirectoryHandle(dirHandle);
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return undefined;
    } else {
      console.error("Directory open error:", err);
      return "An error occurred while choosing the fonts folder";
    }
  }
  return undefined;
}

export const openFontsDirectory: WithSource<
  typeof _openFontsDirectory
> = () => {
  history.clear();
  return _openFontsDirectory();
};

//------------------------------------------------------------------------------
// Clear Fonts Directory
//------------------------------------------------------------------------------

async function _clearFontsDirectory(): Promise<string | undefined> {
  try {
    await dirHandlesStore.remove(fontsDirectoryHandleKey);
    state.fontsDirectoryDirHandle = undefined;
    notifyFontsDirectoryHandle(undefined);
  } catch (err) {
    console.error("Fonts directory removal error:", err);
    return "An error occurred while removing fonts folder";
  }
  return undefined;
}

export const clearFontsDirectory: WithSource<
  typeof _clearFontsDirectory
> = () => {
  history.clear();
  return _clearFontsDirectory();
};

//------------------------------------------------------------------------------
// Load Fonts
//------------------------------------------------------------------------------

export async function loadFonts(): Promise<void> {
  const exts = new Set([".ttf", ".otf", ".woff", ".woff2"]);
  const families = new Set<string>();

  if (state.fontsDirectoryDirHandle) {
    const files = state.fontsDirectoryDirHandle.entries();
    for await (const [filename, fileHandle] of files) {
      const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
      if (fileHandle.kind === "file" && exts.has(ext)) {
        const name = filename.replace(new RegExp(`${ext}$`), "");
        const { family, style, weight } = inferFontVariant(name);
        const data = await (await fileHandle.getFile()).arrayBuffer();
        const face = new FontFace(family, data, { style, weight });
        await face.load();
        document.fonts.add(face);
        await document.fonts.load(`16px "${family}"`);
        families.add(family);
      }
    }
    for (const family of families) await document.fonts.load(`16px ${family}`);
  }

  await document.fonts.ready;
}

//------------------------------------------------------------------------------
// Use Active Layout Name
//------------------------------------------------------------------------------

export function useActiveLayoutName(): string {
  const [name, setName] = useState(state.activeLayout.name);
  useLayoutEffect(() => subscribeActiveLayoutName(setName), []);
  return name;
}

//------------------------------------------------------------------------------
// Use Active Layout Size
//------------------------------------------------------------------------------

export function useActiveLayoutSize(): Layout["size"] {
  const [size, setSize] = useState(state.activeLayout.size);
  useLayoutEffect(() => subscribeActiveLayoutSize(setSize), []);
  return size;
}

//------------------------------------------------------------------------------
// Use Active Layout Bleed
//------------------------------------------------------------------------------

export function useActiveLayoutBleed(): Layout["bleed"] {
  const [bleed, setBleed] = useState(state.activeLayout.bleed);
  useLayoutEffect(() => subscribeActiveLayoutBleed(setBleed), []);
  return bleed;
}

//------------------------------------------------------------------------------
// Use Active Layout ItemIds
//------------------------------------------------------------------------------

export function useActiveLayoutItemIds(): string[] {
  const [itemIds, setItemIds] = useState(state.activeLayout.items.ids);
  useLayoutEffect(() => subscribeActiveLayoutItemIds(setItemIds), []);
  return itemIds;
}

//------------------------------------------------------------------------------
// Use Active Layout Item
//------------------------------------------------------------------------------

export function useActiveLayoutItem(id: string): LayoutItem {
  const layouts = state.activeLayout.items.byId;
  const [item, setItem] = useState(layouts[id]);
  useMountedLayoutEffect(() => setItem(layouts[id]), [id]);
  useLayoutEffect(() => subscribeActiveLayoutItem(id, setItem), [id]);
  return item;
}

//------------------------------------------------------------------------------
// Use Active Layout Selected Item
//------------------------------------------------------------------------------

export function useActiveLayoutSelectedItemId(): string | undefined {
  const [id, setId] = useState(state.activeLayoutSelectedItem?.id);
  useLayoutEffect(() => subscribeActiveLayoutSelectedItemId(setId), []);
  return id;
}

//------------------------------------------------------------------------------
// Use Active Layout Selected Item Snapping
//------------------------------------------------------------------------------

export function useActiveLayoutSelectedItemSnapping(): State["activeLayoutSelectedItemSnapping"] {
  const [snapping, setSnapping] = useState(
    state.activeLayoutSelectedItemSnapping,
  );
  useLayoutEffect(
    () => subscribeActiveLayoutSelectedItemSnapping(setSnapping),
    [],
  );
  return snapping;
}

//------------------------------------------------------------------------------
// Use Active Layout Unsaved Changes
//------------------------------------------------------------------------------

export function useActiveLayoutUnsavedChanges(): boolean {
  const [unsavedChanges, setUnsavedChanges] = useState(
    state.activeLayoutUnsavedChanges,
  );
  useLayoutEffect(
    () => subscribeActiveLayoutUnsavedChanges(setUnsavedChanges),
    [],
  );
  return unsavedChanges;
}

//------------------------------------------------------------------------------
// Use Active Data
//------------------------------------------------------------------------------

export function useActiveData(): Data {
  const [data, setData] = useState(state.dataList[state.dataIndex]);
  useMountedLayoutEffect(() => setData(state.dataList[state.dataIndex]), []);
  useLayoutEffect(
    () => subscribeDataIndex((i) => setData(state.dataList[i])),
    [],
  );
  useLayoutEffect(
    () => subscribeDataList(() => setData(state.dataList[state.dataIndex])),
    [],
  );
  return data;
}

//------------------------------------------------------------------------------
// Use Active Data Index
//------------------------------------------------------------------------------

export function useActiveDataIndex(): number {
  const [index, setIndex] = useState(state.dataIndex);
  useLayoutEffect(() => subscribeDataIndex(setIndex), []);
  return index;
}

//------------------------------------------------------------------------------
// Use Data List Size
//------------------------------------------------------------------------------

export function useDataListSize(): number {
  const [size, setSize] = useState(state.dataList.length);
  useLayoutEffect(() => subscribeDataList((dl) => setSize(dl.length)), []);
  return size;
}

//------------------------------------------------------------------------------
// Use Data List
//------------------------------------------------------------------------------

export function useDataList(): Data[] {
  const [dataList, setDataList] = useState(state.dataList);
  useLayoutEffect(() => subscribeDataList((dl) => setDataList(dl)), []);
  return dataList;
}

//------------------------------------------------------------------------------
// Use Data Unsaved Changes
//------------------------------------------------------------------------------

export function useDataUnsavedChanges(): boolean {
  const [unsavedChanges, setUnsavedChanges] = useState(
    state.dataUnsavedChanges,
  );
  useLayoutEffect(() => subscribeDataUnsavedChanges(setUnsavedChanges), []);
  return unsavedChanges;
}

//------------------------------------------------------------------------------
// Use Images Directory Handle
//------------------------------------------------------------------------------

export function useImagesDirectoryHandle(): State["imagesDirectoryDirHandle"] {
  const [dirHandle, setDirHandle] = useState(state.imagesDirectoryDirHandle);
  useLayoutEffect(() => subscribeImagesDirectoryHandle(setDirHandle), []);
  return dirHandle;
}

//------------------------------------------------------------------------------
// Use Fonts Directory Handle
//------------------------------------------------------------------------------

export function useFontsDirectoryHandle(): State["fontsDirectoryDirHandle"] {
  const [dirHandle, setDirHandle] = useState(state.fontsDirectoryDirHandle);
  useLayoutEffect(() => subscribeFontsDirectoryHandle(setDirHandle), []);
  return dirHandle;
}

//------------------------------------------------------------------------------
// Use Export Folder
//------------------------------------------------------------------------------

export const useExportFolder = () =>
  useStorePersistentString("export.folder", "images");

//------------------------------------------------------------------------------
// Use Export Image Name
//------------------------------------------------------------------------------

export const useExportImageName = () =>
  useStorePersistentString("export.name", "");

//------------------------------------------------------------------------------
// Use Export Dpi
//------------------------------------------------------------------------------

export const useExportDpi = () => useStorePersistentNumber("export.dpi", 800);

//------------------------------------------------------------------------------
// Use Export Ppi
//------------------------------------------------------------------------------

export const useExportPpi = () => useStorePersistentNumber("export.ppi", 128);

//------------------------------------------------------------------------------
// Use Canvas Frame Ref
//------------------------------------------------------------------------------

const canvasRefRefStore = createStore<CanvasFrameRef>({ current: null });

export const useCanvasFrameRef = canvasRefRefStore.useValue;
