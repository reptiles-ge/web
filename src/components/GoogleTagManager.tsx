"use client";

import { useEffect } from "react";

const SCRIPT_ID = "_next-gtm";
const IDLE_TIMEOUT_MS = 2000;
const FALLBACK_DELAY_MS = 5000;
const INTERACTION_EVENTS = [
  "pointerdown",
  "keydown",
  "scroll",
  "touchstart",
] as const;

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

  let fallback: number | undefined;

  const trigger = () => {
    window.clearTimeout(fallback);
    for (const type of INTERACTION_EVENTS) {
      window.removeEventListener(type, trigger);
    }
    injectWhenIdle();
  };

  const waitForInteraction = () => {
    for (const type of INTERACTION_EVENTS) {
      window.addEventListener(type, trigger, { once: true, passive: true });
    }
    fallback = window.setTimeout(trigger, FALLBACK_DELAY_MS);
  };

  if (document.readyState === "complete") {
    waitForInteraction();
  } else {
    window.addEventListener("load", waitForInteraction, { once: true });
  }
}
