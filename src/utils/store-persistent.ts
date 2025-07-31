import { useCallback, useEffect, useState } from "react";
import z from "zod";

type Callback<T> = (value: T) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const listeners = new Map<string, Set<Callback<any>>>();

const fullId = (id: string) => `layouts/${id}`;

export const StorePersistent = {
  clear: (): void => {
    localStorage.clear();
    window.location.reload();
  },

  load: <T>(id: string, defaultValue: T, parse: (maybeT: unknown) => T): T => {
    id = fullId(id);
    try {
      const stringOrNull = localStorage.getItem(id);
      return stringOrNull === null
        ? defaultValue
        : parse(JSON.parse(stringOrNull));
    } catch {
      localStorage.removeItem(id);
      return defaultValue;
    }
  },

  save: <T>(id: string, value: T): void => {
    id = fullId(id);
    localStorage.setItem(id, JSON.stringify(value));
    listeners.get(id)?.forEach((callback) => callback(value));
  },

  subscribe: <T>(id: string, callback: Callback<T>): (() => void) => {
    id = fullId(id);
    if (!listeners.has(id)) listeners.set(id, new Set());
    listeners.get(id)!.add(callback);
    return () => {
      listeners.get(id)?.delete(callback);
      if (listeners.get(id)?.size === 0) listeners.delete(id);
    };
  },
};

const isUpdater = <T>(
  maybeSettingUpdater: unknown,
): maybeSettingUpdater is (prevSetting: T) => void => {
  return typeof maybeSettingUpdater === "function";
};

export function useStorePersistent<T>(
  id: string,
  initialValue: T,
  parse: (maybeT: unknown) => T,
): [T, (nextValueOrUpdateValue: T | ((prevValue: T) => T)) => T] {
  const [value, setValue] = useState(() =>
    StorePersistent.load(id, initialValue, parse),
  );

  useEffect(() => {
    setValue(StorePersistent.load(id, initialValue, parse));
    const callback = (nextValue: T) => setValue(nextValue);
    return StorePersistent.subscribe(id, callback);
  }, [id, initialValue, parse]);

  const saveValue = useCallback(
    (nextValueOrUpdateValue: T | ((prevValue: T) => T)): T => {
      const nextValue = isUpdater<T>(nextValueOrUpdateValue)
        ? nextValueOrUpdateValue(StorePersistent.load(id, initialValue, parse))
        : nextValueOrUpdateValue;
      StorePersistent.save(id, nextValue);
      return nextValue;
    },
    [id, initialValue, parse],
  );

  return [value, saveValue];
}

const parseBoolean = z.boolean().parse;
export function useStorePersistentBoolean(
  id: string,
  initialValue: boolean,
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] {
  return useStorePersistent(id, initialValue, parseBoolean);
}

const parseNumber = z.number().parse;
export function useStorePersistentNumber(
  id: string,
  initialValue: number,
): [number, React.Dispatch<React.SetStateAction<number>>] {
  return useStorePersistent(id, initialValue, parseNumber);
}

const parseString = z.string().parse;
export function useStorePersistentString(
  id: string,
  initialValue: string,
): [string, React.Dispatch<React.SetStateAction<string>>] {
  return useStorePersistent(id, initialValue, parseString);
}
