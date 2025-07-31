export function range(n: number): number[] {
  return Array.from({ length: n }, (_, i) => i);
}

export function listAppend<T>(list: T[], item: T): T[] {
  return [...list, item];
}

export function listReplace<T>(list: T[], item: T, index: number): T[] {
  return [...list.slice(0, index), item, ...list.slice(index + 1)];
}

export function listRemove<T>(list: T[], index: number): T[] {
  return [...list.slice(0, index), ...list.slice(index + 1)];
}
