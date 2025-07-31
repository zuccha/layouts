type Callback<T> = (value: T) => void;

export function createObservable<T>() {
  const listeners = new Set<Callback<T>>();

  function notify(value: T): void {
    listeners.forEach((callback) => callback(value));
  }

  function subscribe(callback: Callback<T>): () => void {
    listeners.add(callback);
    return () => listeners.delete(callback);
  }

  return { notify, subscribe };
}
