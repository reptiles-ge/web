import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  clearSavedSpecies,
  getLastSavedId,
  getSavedEntries,
  isSaved,
  mergeSavedIds,
  parseSavedEntries,
  resetSavedSpeciesCache,
  restoreSavedEntries,
  SAVED_STORAGE_KEY,
  saveSpecies,
  toggleSavedSpecies,
  unsaveSpecies,
} from "@/lib/savedSpecies";

function stubStorage() {
  const store = new Map<string, string>();
  const storage = {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => store.set(key, value),
  };
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: { localStorage: storage },
  });
  return store;
}

describe("savedSpecies", () => {
  let store: Map<string, string>;

  beforeEach(() => {
    store = stubStorage();
    resetSavedSpeciesCache();
  });

  afterEach(() => {
    Reflect.deleteProperty(globalThis, "window");
    resetSavedSpeciesCache();
  });

  it("drops malformed, duplicate and unsafe entries and sorts newest first", () => {
    expect(parseSavedEntries("not json")).toEqual([]);
    expect(parseSavedEntries('{"id":"x"}')).toEqual([]);
    expect(
      parseSavedEntries(
        JSON.stringify([
          { id: "vipera-kaznakovi", savedAt: 1 },
          { id: "vipera-kaznakovi", savedAt: 5 },
          { id: "../evil", savedAt: 9 },
          { id: "natrix-natrix", savedAt: "2" },
          { id: "macrovipera-lebetina", savedAt: 3 },
          null,
        ]),
      ),
    ).toEqual([
      { id: "macrovipera-lebetina", savedAt: 3 },
      { id: "vipera-kaznakovi", savedAt: 1 },
    ]);
  });

  it("saves, toggles and persists to localStorage", () => {
    saveSpecies("natrix-natrix", 10);
    expect(toggleSavedSpecies("macrovipera-lebetina")).toBe(true);
    expect(getLastSavedId()).toBe("macrovipera-lebetina");
    expect(getSavedEntries().map((entry) => entry.id)).toEqual([
      "macrovipera-lebetina",
      "natrix-natrix",
    ]);
    expect(JSON.parse(store.get(SAVED_STORAGE_KEY) ?? "[]")).toHaveLength(2);

    expect(toggleSavedSpecies("macrovipera-lebetina")).toBe(false);
    expect(getLastSavedId()).toBeNull();
    expect(isSaved("macrovipera-lebetina")).toBe(false);
  });

  it("restores a removed entry at its old position", () => {
    saveSpecies("natrix-natrix", 10);
    saveSpecies("vipera-kaznakovi", 20);
    const [entry] = getSavedEntries();
    unsaveSpecies("vipera-kaznakovi");
    restoreSavedEntries([entry!]);
    expect(getSavedEntries()).toEqual([
      { id: "vipera-kaznakovi", savedAt: 20 },
      { id: "natrix-natrix", savedAt: 10 },
    ]);
  });

  it("merges shared ids without duplicates and keeps their order", () => {
    saveSpecies("natrix-natrix", 10);
    expect(
      mergeSavedIds(
        [
          "vipera-kaznakovi",
          "natrix-natrix",
          "bad id",
          "vipera-kaznakovi",
          "vipera-dinniki",
        ],
        100,
      ),
    ).toBe(2);
    expect(getSavedEntries().map((entry) => entry.id)).toEqual([
      "vipera-kaznakovi",
      "vipera-dinniki",
      "natrix-natrix",
    ]);
    clearSavedSpecies();
    expect(getSavedEntries()).toEqual([]);
  });

  it("reads the stored list on first use", () => {
    store.set(
      SAVED_STORAGE_KEY,
      JSON.stringify([{ id: "natrix-natrix", savedAt: 1 }]),
    );
    expect(isSaved("natrix-natrix")).toBe(true);
  });
});
