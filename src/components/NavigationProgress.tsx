"use client";

import { useParams } from "next/navigation";
import NProgress from "nprogress";
import { useEffect, useRef } from "react";

import { usePathname } from "@/i18n/navigation";

NProgress.configure({ showSpinner: false });

export function NavigationProgress() {
  const pathname = usePathname();
  const params = useParams();
  const key = routeKey(pathname, params);
  const timer = useRef<null | number>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
      NProgress.done();
    };
  }, []);

  useEffect(() => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
    NProgress.done();
  }, [key]);

  useEffect(() => {
    function start() {
      NProgress.start();
      if (timer.current) {
        window.clearTimeout(timer.current);
      }
      timer.current = window.setTimeout(() => NProgress.done(), 10_000);
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
      if (!href) {
        return;
      }

      const url = new URL(href, window.location.href);
      if (
        url.origin !== window.location.origin ||
        url.href === window.location.href ||
        (url.pathname === window.location.pathname &&
          url.search === window.location.search)
      ) {
        return;
      }

      start();
    }

    function onPopState() {
      start();
    }

    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", onPopState);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return null;
}

function routeKey(pathname: string, params: ReturnType<typeof useParams>) {
  const dynamic = Object.entries(params ?? {})
    .filter(([key]) => key !== "locale")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${String(value)}`);
  return [pathname, ...dynamic].join(":");
}
