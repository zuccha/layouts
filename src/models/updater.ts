type NotFunction = Exclude<unknown, (...args: unknown[]) => unknown>;

export type Updater<T extends NotFunction> = T | ((t: T) => T);

export type PartialUpdater<P extends NotFunction, R extends NotFunction> =
  | P
  | ((t: R) => P);
