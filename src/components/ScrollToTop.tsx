"use client";

import { usePathname } from "@/i18n/navigation";
import { useParams } from "next/navigation";
import { useLayoutEffect, useRef } from "react";

function resetScroll() {
  const html = document.documentElement;
  const previous = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, 0);
  html.scrollTop = 0;
  document.body.scrollTop = 0;
  html.style.scrollBehavior = previous;
}

function routeKey(
  pathname: string,
  params: ReturnType<typeof useParams>,
) {
  const dynamic = Object.entries(params ?? {})
    .filter(([key]) => key !== "locale")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${String(value)}`);
  return [pathname, ...dynamic].join(":");
}

export function ScrollToTop() {
  const pathname = usePathname();
  const params = useParams();
  const key = routeKey(pathname, params);
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (window.location.hash) return;

    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    return () => window.cancelAnimationFrame(frame);
  }, [key]);

  return null;
}
