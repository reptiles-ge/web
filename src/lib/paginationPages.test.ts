import { describe, expect, it } from "vitest";

import { paginationPages } from "@/lib/paginationPages";

describe("pagination window", () => {
  it("shows every page when there are few", () => {
    expect(paginationPages(1, 3)).toEqual([1, 2, 3]);
  });

  it("collapses distant pages into gaps", () => {
    expect(paginationPages(1, 9)).toEqual([1, 2, null, 9]);
    expect(paginationPages(5, 9)).toEqual([1, null, 4, 5, 6, null, 9]);
    expect(paginationPages(9, 9)).toEqual([1, null, 8, 9]);
  });
});
