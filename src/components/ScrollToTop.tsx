"use client";

import { useParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

import { usePathname } from "@/i18n/navigation";

const RESTORE_WINDOW_MS = 2000;

export function ScrollToTop() {
  const pathname = usePathname();
  const params = useParams();
  const key = routeKey(pathname, params);
  const isFirstRender = useRef(true);
  const restoringPath = useRef<null | string>(null);

  useEffect(
    () =>
      watchTraversals((path) => {
        restoringPath.current = path;
      }),
    [],
  );

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const restoring = restoringPath.current === window.location.pathname;
    restoringPath.current = null;
    if (restoring || window.location.hash) return;

    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    return () => window.cancelAnimationFrame(frame);
  }, [key]);

  return null;
}

function hasSavedScrollPosition(state: unknown) {
  if (typeof state !== "object" || state === null) return false;
  return "__vinext_scrollY" in state || "__NA" in state;
}

function resetScroll() {
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;
  html.style.scrollBehavior = previous;
}

function routeKey(pathname: string, params: ReturnType<typeof useParams>) {
  const dynamic = Object.entries(params)
    .filter(([key]) => key !== "locale")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${String(value)}`);
  return [pathname, ...dynamic].join(":");
}

function watchTraversals(onTraversal: (restoringPath: null | string) => void) {
  const html = document.documentElement;
  let timer: number | undefined;

  function release() {
    window.clearTimeout(timer);
    timer = undefined;
    html.style.removeProperty("scroll-behavior");
  }

  function onPopState(event: PopStateEvent) {
    const saved = hasSavedScrollPosition(event.state);
    onTraversal(saved ? window.location.pathname : null);
    if (!saved) return;
    window.clearTimeout(timer);
    html.style.scrollBehavior = "auto";
    timer = window.setTimeout(release, RESTORE_WINDOW_MS);
  }

  window.addEventListener("popstate", onPopState, { capture: true });
  return () => {
    window.removeEventListener("popstate", onPopState, { capture: true });
    release();
  };
}
