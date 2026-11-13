import { useSyncExternalStore } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function cycleTab(
  event: KeyboardEvent,
  roots: Array<null | ParentNode | undefined>,
) {
  if (event.key !== "Tab") return;
  const items = roots.flatMap((root) => focusableIn(root));
  const first = items[0];
  const last = items.at(-1);
  if (!first || !last) return;
  const active = document.activeElement;
  if (
    event.shiftKey &&
    (active === first || !items.includes(active as HTMLElement))
  ) {
    event.preventDefault();
    last.focus();
    return;
  }
  if (
    !event.shiftKey &&
    (active === last || !items.includes(active as HTMLElement))
  ) {
    event.preventDefault();
    first.focus();
  }
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    prefersReducedMotion,
    () => false,
  );
}

function focusableIn(root: null | ParentNode | undefined) {
  if (!root) return [];
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((node) => {
    if (node.closest("[inert]")) return false;
    if (node.getAttribute("aria-hidden") === "true") return false;
    return node.getClientRects().length > 0;
  });
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
