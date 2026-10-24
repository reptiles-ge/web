import type { MouseEvent } from "react";

import { useSyncExternalStore } from "react";

const NAVIGATE_EVENT = "admin:navigate";

export function followLink(event: MouseEvent, path: string) {
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  event.preventDefault();
  navigate(path);
}

export function navigate(path: string, { replace = false } = {}) {
  if (window.location.pathname === path) return;
  if (replace) window.history.replaceState(null, "", path);
  else window.history.pushState(null, "", path);
  window.dispatchEvent(new Event(NAVIGATE_EVENT));
}

export function usePathname() {
  return useSyncExternalStore(subscribe, readPathname);
}

function readPathname() {
  return window.location.pathname;
}

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(NAVIGATE_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(NAVIGATE_EVENT, onChange);
  };
}
