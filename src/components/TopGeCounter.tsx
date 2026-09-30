"use client";

import Script from "next/script";
import { useEffect } from "react";

const PATCHED = Symbol.for("reptiles.topGePush");

type PushState = History["pushState"] & { [PATCHED]?: boolean };

export function TopGeCounter() {
  useEffect(() => {
    const state = (
      window as unknown as Record<symbol, { originalPushState?: PushState }>
    )[Symbol.for("vinext.clientNavigationState")];
    const native = state?.originalPushState;
    if (!state || !native || native[PATCHED]) return;

    function topGePush(
      this: History,
      ...args: Parameters<History["pushState"]>
    ) {
      const result = native!.apply(this, args);
      const img = document.querySelector("#top-ge-counter-container img");
      if (!(img instanceof HTMLImageElement) || !img.src.includes("count222")) {
        return result;
      }
      const previous = decodeURIComponent(
        img.src.match(/JL:([^+]*)/)?.[1] ?? "",
      );
      img.src = img.src
        .replace(
          /RAND:[^+]*/,
          `RAND:${encodeURIComponent(String(10_000 * Math.random()))}`,
        )
        .replace(
          /REFERER:[^+]*/,
          `REFERER:${encodeURIComponent(previous.slice(0, 1000))}`,
        )
        .replace(
          /JL:[^+]*/,
          `JL:${encodeURIComponent(location.href.slice(0, 1000))}`,
        );
      return result;
    }

    topGePush[PATCHED] = true;
    state.originalPushState = topGePush;
  }, []);

  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none opacity-0"
        data-site-id="118888"
        id="top-ge-counter-container"
        inert
      />
      <Script
        src="https://counter.top.ge/counter.js"
        strategy="afterInteractive"
      />
    </>
  );
}
