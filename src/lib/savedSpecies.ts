import { useSyncExternalStore } from "react";

export type SavedEntry = {
  id: string;
  savedAt: number;
};

export const SAVED_STORAGE_KEY = "reptiles:saved-species";
export const SAVED_LIMIT = 200;
const SPECIES_ID_PATTERN = /^[a-z0-9][a-z0-9-]{0,80}$/;

const EMPTY: SavedEntry[] = [];
const listeners = new Set<() => void>();
let cache: null | SavedEntry[] = null;
let lastSavedId: null | string = null;

export function clearSavedSpecies() {
  writeEntries([]);
}

export function getLastSavedId() {
  return lastSavedId;
}

export function getSavedEntries(): SavedEntry[] {
  if (cache) return cache;
  cache = parseSavedEntries(readStorage());
  return cache;
}

export function isSaved(id: string) {
  return getSavedEntries().some((entry) => entry.id === id);
}

export function isSpeciesId(id: string) {
  return SPECIES_ID_PATTERN.test(id);
}

export function mergeSavedIds(ids: string[], now = Date.now()) {
  const current = getSavedEntries();
  const known = new Set(current.map((entry) => entry.id));
  const added = ids
    .filter((id) => isSpeciesId(id) && !known.has(id))
    .filter((id, index, list) => list.indexOf(id) === index)
    .map((id, index) => ({ id, savedAt: now - index }));
  if (added.length > 0) writeEntries([...added, ...current]);
  return added.length;
}

export function parseSavedEntries(raw: null | string): SavedEntry[] {
  if (!raw) return EMPTY;
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    return EMPTY;
  }
  if (!Array.isArray(value)) return EMPTY;
  const seen = new Set<string>();
  const entries: SavedEntry[] = [];
  for (const item of value) {
    if (!item || typeof item !== "object") continue;
    const { id, savedAt } = item as Partial<SavedEntry>;
    if (typeof id !== "string" || !isSpeciesId(id) || seen.has(id)) continue;
    if (typeof savedAt !== "number" || !Number.isFinite(savedAt)) continue;
    seen.add(id);
    entries.push({ id, savedAt });
  }
  return sortSaved(entries).slice(0, SAVED_LIMIT);
}

export function resetSavedSpeciesCache() {
  cache = null;
  lastSavedId = null;
}

export function restoreSavedEntries(restored: SavedEntry[]) {
  const ids = new Set(restored.map((entry) => entry.id));
  writeEntries([
    ...restored,
    ...getSavedEntries().filter((entry) => !ids.has(entry.id)),
  ]);
}

export function saveSpecies(id: string, savedAt = Date.now()) {
  if (!isSpeciesId(id)) return;
  writeEntries([
    { id, savedAt },
    ...getSavedEntries().filter((entry) => entry.id !== id),
  ]);
}

export function sortSaved(entries: SavedEntry[]) {
  return [...entries].sort((a, b) => b.savedAt - a.savedAt);
}

export function toggleSavedSpecies(id: string) {
  if (isSaved(id)) {
    if (lastSavedId === id) lastSavedId = null;
    unsaveSpecies(id);
    return false;
  }
  lastSavedId = id;
  saveSpecies(id);
  return true;
}

export function unsaveSpecies(id: string) {
  writeEntries(getSavedEntries().filter((entry) => entry.id !== id));
}

export function useIsSaved(id: string) {
  return useSyncExternalStore(
    subscribe,
    () => isSaved(id),
    () => false,
  );
}

export function useSavedEntries(): SavedEntry[] {
  return useSyncExternalStore(subscribe, getSavedEntries, () => EMPTY);
}

function emit() {
  for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
  if (event.key !== null && event.key !== SAVED_STORAGE_KEY) return;
  cache = null;
  emit();
}

function readStorage() {
  try {
    return window.localStorage.getItem(SAVED_STORAGE_KEY);
  } catch {
    return null;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1 && typeof window !== "undefined") {
    window.addEventListener("storage", onStorage);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && typeof window !== "undefined") {
      window.removeEventListener("storage", onStorage);
    }
  };
}

function writeEntries(entries: SavedEntry[]) {
  cache = sortSaved(entries).slice(0, SAVED_LIMIT);
  try {
    window.localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(cache));
  } catch {
    return emit();
  }
  emit();
}
