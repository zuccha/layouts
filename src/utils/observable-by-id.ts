type Callback<T> = (value: T) => void;

export function createObservableById<T>() {
  const listeners = new Map<string, Set<Callback<T>>>();

  function notify(id: string, value: T): void {
    listeners.get(id)?.forEach((callback) => callback(value));
  }

  function subscribe(id: string, callback: Callback<T>): () => void {
    if (!listeners.has(id)) listeners.set(id, new Set());
    listeners.get(id)!.add(callback);

    return () => {
      listeners.get(id)?.delete(callback);
      if (listeners.get(id)?.size === 0) listeners.delete(id);
    };
  }

  return { notify, subscribe };
}
