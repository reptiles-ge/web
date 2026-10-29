"use client";

import { useEffect } from "react";

import type { ContentViewInput } from "@/lib/contentViewInput";

const STORAGE_PREFIX = "reptiles:viewed:";

type ContentViewBeaconProps = ContentViewInput & { apiOrigin: string };

export function ContentViewBeacon({
  apiOrigin,
  id,
  kind,
}: ContentViewBeaconProps) {
  useEffect(() => {
    if (navigator.webdriver) return;
    const key = `${STORAGE_PREFIX}${kind}:${id}`;
    const today = new Date().toISOString().slice(0, 10);
    if (readStored(key) === today) return;
    writeStored(key, today);
    void fetch(`${apiOrigin}/v1/views`, {
      body: JSON.stringify({ id, kind }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    }).catch(() => undefined);
  }, [apiOrigin, id, kind]);

  return null;
}

function readStored(key: string) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStored(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    return;
  }
}
