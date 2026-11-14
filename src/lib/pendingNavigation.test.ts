import { afterEach, describe, expect, it, vi } from "vitest";

import {
  beginPendingNavigation,
  endPendingNavigation,
  getPendingNavigation,
  getServerPendingNavigation,
  subscribePendingNavigation,
} from "@/lib/pendingNavigation";

afterEach(() => {
  endPendingNavigation();
});

describe("pendingNavigation", () => {
  it("tracks the latest navigation with a new id each time", () => {
    beginPendingNavigation("/gvelebi/giurza");
    const first = getPendingNavigation();
    beginPendingNavigation("/gvelebi/giurza");
    const second = getPendingNavigation();

    expect(first?.pathname).toBe("/gvelebi/giurza");
    expect(second?.pathname).toBe("/gvelebi/giurza");
    expect(second?.id).not.toBe(first?.id);
  });

  it("notifies listeners on begin and end, and not after unsubscribe", () => {
    const listener = vi.fn();
    const unsubscribe = subscribePendingNavigation(listener);

    beginPendingNavigation("/en/snakes/vipera-dinniki");
    endPendingNavigation();
    endPendingNavigation();
    expect(listener).toHaveBeenCalledTimes(2);
    expect(getPendingNavigation()).toBeNull();

    unsubscribe();
    beginPendingNavigation("/en/snakes/vipera-dinniki");
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it("is always idle on the server", () => {
    beginPendingNavigation("/gvelebi/giurza");
    expect(getServerPendingNavigation()).toBeNull();
  });
});
