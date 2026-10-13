"use client";

import { useEffect } from "react";

const SCRIPT_ID = "_next-gtm";
const IDLE_TIMEOUT_MS = 2000;

let scheduled = false;

export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  useEffect(() => {
    scheduleGoogleTagManager(gtmId);
  }, [gtmId]);

  return null;
}

function scheduleGoogleTagManager(gtmId: string) {
  if (scheduled) return;
  scheduled = true;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: "gtm.js", "gtm.start": Date.now() });

  const inject = () => {
    if (document.getElementById(SCRIPT_ID)) return;
    const script = document.createElement("script");
    script.async = true;
    script.id = SCRIPT_ID;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
    document.body.appendChild(script);
  };

  const injectWhenIdle = () => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(inject, { timeout: IDLE_TIMEOUT_MS });
    } else {
      window.setTimeout(inject, 1);
    }
  };

  if (document.readyState === "complete") {
    injectWhenIdle();
  } else {
    window.addEventListener("load", injectWhenIdle, { once: true });
  }
}
