"use client";

import { useEffect } from "react";

import {
  isVisitBlocked,
  sanitizeVisitPath,
  VISIT_STORAGE_KEY,
  writeVisitSeenValue,
} from "@/lib/visitNotify";

let inFlight = false;

export function VisitPing() {
  useEffect(() => {
    if (inFlight) return;
    if (navigator.webdriver) return;
    if (readSeen()) return;

    inFlight = true;
    writeSeen();

    const path =
      sanitizeVisitPath(
        `${window.location.pathname}${window.location.search}`,
      ) ?? window.location.pathname;
    const referrer = document.referrer || undefined;

    void fetch("/api/visit", {
      body: JSON.stringify({ path, referrer }),
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      keepalive: true,
      method: "POST",
    })
      .then((response) => {
        if (response.status === 204) return;
        clearSeen();
        inFlight = false;
      })
      .catch(() => {
        clearSeen();
        inFlight = false;
      });
  }, []);

  return null;
}

function clearSeen() {
  try {
    window.localStorage.removeItem(VISIT_STORAGE_KEY);
  } catch {
    return;
  }
}

function readSeen() {
  try {
    return isVisitBlocked(window.localStorage.getItem(VISIT_STORAGE_KEY));
  } catch {
    return true;
  }
}

function writeSeen() {
  try {
    window.localStorage.setItem(VISIT_STORAGE_KEY, writeVisitSeenValue());
  } catch {
    return;
  }
}
