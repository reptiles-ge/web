"use client";

import { useEffect } from "react";

import type { ContentViewInput } from "@/lib/contentViewInput";

import { createApiClient } from "@/lib/apiClient";

const STORAGE_PREFIX = "reptiles:viewed:";

export function ContentViewBeacon({ id, kind }: ContentViewInput) {
  useEffect(() => {
    if (navigator.webdriver) return;
    const key = `${STORAGE_PREFIX}${kind}:${id}`;
    const today = new Date().toISOString().slice(0, 10);
    if (readStored(key) === today) return;
    writeStored(key, today);
    void createApiClient()
      .v1.views.$post({ json: { id, kind } })
      .catch(() => undefined);
  }, [id, kind]);

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
