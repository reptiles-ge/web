import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { PhotoCandidate } from "./photoCandidates";

import { readSavedCandidates, useSavedCandidates } from "./useSavedCandidates";

const KEY = "reptiles-admin:photo-shortlist:larus-genei";

function candidate(key: string) {
  return { key, observer: "ana" } as PhotoCandidate;
}

afterEach(() => {
  window.localStorage.clear();
  vi.restoreAllMocks();
});

describe("useSavedCandidates", () => {
  it("saves, ranks and unsaves photos and keeps them per species", () => {
    const { result, unmount } = renderHook(() =>
      useSavedCandidates("larus-genei"),
    );
    act(() => result.current.toggle(candidate("a")));
    act(() => result.current.toggle(candidate("b")));
    act(() => result.current.toggle(candidate("c")));
    act(() => result.current.move("c", 0));
    expect(result.current.saved.map((item) => item.key)).toStrictEqual([
      "c",
      "a",
      "b",
    ]);
    expect(result.current.isSaved("a")).toBe(true);
    unmount();
    const again = renderHook(() => useSavedCandidates("larus-genei"));
    expect(again.result.current.saved.map((item) => item.key)).toStrictEqual([
      "c",
      "a",
      "b",
    ]);
    expect(readSavedCandidates("bufo-viridis")).toStrictEqual([]);
    act(() => again.result.current.toggle(candidate("a")));
    act(() => again.result.current.toggle(candidate("b")));
    act(() => again.result.current.toggle(candidate("c")));
    expect(again.result.current.isSaved("a")).toBe(false);
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });

  it("starts empty on broken storage and still works when storage refuses writes", () => {
    window.localStorage.setItem(KEY, "{");
    expect(readSavedCandidates("larus-genei")).toStrictEqual([]);
    window.localStorage.setItem(KEY, '{"a":1}');
    expect(readSavedCandidates("larus-genei")).toStrictEqual([]);
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    const { result } = renderHook(() => useSavedCandidates("larus-genei"));
    act(() => result.current.toggle(candidate("a")));
    expect(result.current.saved).toHaveLength(1);
  });
});
