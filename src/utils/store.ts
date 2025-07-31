import { useCallback, useLayoutEffect, useState } from "react";
import { createObservable } from "./observable";

export function createStore<T>(defaultValue: T) {
  const { notify, subscribe } = createObservable<T>();

  let store = defaultValue;

  function get(): T {
    return store;
  }

  function set(value: T): void {
    store = value;
    notify(value);
  }

  const isUpdater = (
    maybeSettingUpdater: unknown,
  ): maybeSettingUpdater is (prevSetting: T) => void => {
    return typeof maybeSettingUpdater === "function";
  };

  function use(): [
    T,
    (nextValueOrUpdateValue: T | ((prevValue: T) => T)) => T,
  ] {
    const [value, setValue] = useState(get);

    useLayoutEffect(() => subscribe(setValue), []);

    return [
      value,
      useCallback((nextValueOrUpdateValue: T | ((prevValue: T) => T)): T => {
        const nextValue = isUpdater(nextValueOrUpdateValue)
          ? nextValueOrUpdateValue(get())
          : nextValueOrUpdateValue;
        set(nextValue);
        return nextValue;
      }, []),
    ];
  }

  function useValue(): T {
    const [value, setValue] = useState(get);
    useLayoutEffect(() => subscribe(setValue), []);
    return value;
  }

  function useSetValue(): React.Dispatch<React.SetStateAction<T>> {
    return useCallback((nextValueOrUpdateValue: T | ((prevValue: T) => T)) => {
      set(
        isUpdater(nextValueOrUpdateValue)
          ? nextValueOrUpdateValue(get())
          : nextValueOrUpdateValue,
      );
    }, []);
  }

  return { get, set, subscribe, use, useSetValue, useValue };
}
