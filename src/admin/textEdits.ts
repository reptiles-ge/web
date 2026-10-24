import { useEffect } from "react";

import type { AppLocale } from "@/i18n/routing";

import { AdminSaveError, SessionExpiredError } from "./adminResponse";

export const EDIT_LOCALES: ReadonlyArray<{ label: string; value: AppLocale }> =
  [
    { label: "ქართული", value: "ka" },
    { label: "English", value: "en" },
    { label: "Русский", value: "ru" },
    { label: "Türkçe", value: "tr" },
  ];

export type SaveFailure = { details: string[]; message: string };

export async function runSave(
  save: () => Promise<void>,
  {
    onFailure,
    onSessionExpired,
    setSaving,
  }: {
    onFailure: (failure: null | SaveFailure) => void;
    onSessionExpired: () => void;
    setSaving: (saving: boolean) => void;
  },
) {
  setSaving(true);
  onFailure(null);
  try {
    await save();
    return true;
  } catch (error) {
    if (error instanceof SessionExpiredError) onSessionExpired();
    else onFailure(saveFailure(error));
    return false;
  } finally {
    setSaving(false);
  }
}

export function sameValue(left: unknown, right: unknown) {
  return stableJson(left) === stableJson(right);
}

export function useLeaveWarning(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
}

function saveFailure(error: unknown): SaveFailure {
  if (error instanceof AdminSaveError) {
    return { details: error.details, message: error.message };
  }
  return { details: [], message: "Saving failed. Try again in a minute." };
}

function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .filter(([, entry]) => entry !== undefined)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, entry]) => `${JSON.stringify(key)}:${stableJson(entry)}`)
      .join(",")}}`;
  }
  return JSON.stringify(value);
}
