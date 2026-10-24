import { describe, expect, it } from "vitest";

import { pageOffset, toPage } from "./pagination";

describe("pagination", () => {
  it("turns a page into a row offset", () => {
    expect(pageOffset({ limit: 50, page: 1 })).toBe(0);
    expect(pageOffset({ limit: 20, page: 3 })).toBe(40);
  });

  it("builds the page response with a page count of at least one", () => {
    expect(toPage(["a"], 101, { limit: 50, page: 3 })).toEqual({
      data: ["a"],
      limit: 50,
      page: 3,
      pageCount: 3,
      total: 101,
    });
    expect(toPage([], 0, { limit: 50, page: 1 }).pageCount).toBe(1);
  });
});
