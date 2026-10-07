"use client";

import { ProgressProvider } from "@bprogress/next/app";
import { useProgress } from "@bprogress/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const PROGRESS_OPTIONS = { showSpinner: false };
const STALLED_NAVIGATION_MS = 10_000;

export function NavigationProgress() {
  return (
    <ProgressProvider
      color="var(--primary)"
      disableAnchorClick
      height="3px"
      options={PROGRESS_OPTIONS}
    >
      <NavigationProgressTriggers />
    </ProgressProvider>
  );
}

function documentKey(location: { pathname: string; search: string }) {
  return `${location.pathname}${location.search}`;
}

function NavigationProgressTriggers() {
  const { start, stop } = useProgress();
  const pathname = usePathname();
  const currentDocument = useRef("");
  const timer = useRef<null | number>(null);

  useEffect(() => {
    currentDocument.current = documentKey(window.location);
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, [pathname]);

  useEffect(() => {
    function begin(nextDocument: string) {
      currentDocument.current = nextDocument;
      start();
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => stop(), STALLED_NAVIGATION_MS);
    }

    function onClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      const anchor =
        target instanceof Element ? target.closest("a[href]") : null;
      if (
        !(anchor instanceof HTMLAnchorElement) ||
        anchor.target ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

      const href = anchor.getAttribute("href");
      if (!href) return;

      const url = new URL(href, window.location.href);
      const nextDocument = documentKey(url);
      if (
        url.origin !== window.location.origin ||
        nextDocument === currentDocument.current
      ) {
        return;
      }

      begin(nextDocument);
    }

    function onPopState() {
      const nextDocument = documentKey(window.location);
      if (nextDocument === currentDocument.current) return;
      begin(nextDocument);
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [start, stop]);

  return null;
}
