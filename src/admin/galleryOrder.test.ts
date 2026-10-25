import { describe, expect, it } from "vitest";

import { movePhoto, sameOrder } from "./galleryOrder";

const SRCS = ["a", "b", "c", "d"];

describe("movePhoto", () => {
  it("puts the photo at the target position in either direction", () => {
    expect(movePhoto(SRCS, "d", 0)).toStrictEqual(["d", "a", "b", "c"]);
    expect(movePhoto(SRCS, "a", 2)).toStrictEqual(["b", "c", "a", "d"]);
    expect(movePhoto(SRCS, "b", 1)).toBe(SRCS);
  });

  it("clamps the target and ignores an unknown photo", () => {
    expect(movePhoto(SRCS, "b", -3)).toStrictEqual(["b", "a", "c", "d"]);
    expect(movePhoto(SRCS, "b", 99)).toStrictEqual(["a", "c", "d", "b"]);
    expect(movePhoto(SRCS, "x", 0)).toBe(SRCS);
  });
});

describe("sameOrder", () => {
  it("compares order, not just members", () => {
    expect(sameOrder(SRCS, [...SRCS])).toBe(true);
    expect(sameOrder(SRCS, ["b", "a", "c", "d"])).toBe(false);
    expect(sameOrder(SRCS, SRCS.slice(1))).toBe(false);
  });
});
