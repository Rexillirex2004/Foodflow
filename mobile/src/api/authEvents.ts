type Listener = (payload?: unknown) => void;

const listeners: Record<string, Listener[]> = {};

export function on(event: string, listener: Listener) {
  listeners[event] = listeners[event] ?? [];
  listeners[event].push(listener);
  return () => {
    listeners[event] = (listeners[event] ?? []).filter((l) => l !== listener);
  };
}

export function emit(event: string, payload?: unknown) {
  (listeners[event] ?? []).forEach((listener) => listener(payload));
}
