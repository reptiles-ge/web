export type PendingNavigation = {
  id: number;
  pathname: string;
};

let current: null | PendingNavigation = null;
let nextId = 0;
const listeners = new Set<() => void>();

export function beginPendingNavigation(pathname: string) {
  nextId += 1;
  current = { id: nextId, pathname };
  emit();
}

export function endPendingNavigation() {
  if (!current) return;
  current = null;
  emit();
}

export function getPendingNavigation(): null | PendingNavigation {
  return current;
}

export function getServerPendingNavigation(): null | PendingNavigation {
  return null;
}

export function subscribePendingNavigation(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function emit() {
  for (const listener of listeners) listener();
}
