import { describe, expect, it } from "vitest";

import { topLevelRangeFrom } from "@/lib/frontmatterRange";

describe("topLevelRangeFrom", () => {
  it("returns null when the key was not found", () => {
    expect(topLevelRangeFrom(["id: a"], -1)).toBeNull();
  });

  it("ends at the next top-level key", () => {
    const lines = ["gallery:", "  - src: a", "  - src: b", "image: x"];
    expect(topLevelRangeFrom(lines, 0)).toEqual({ end: 3, start: 0 });
  });

  it("ends at the closing frontmatter fence", () => {
    const lines = ["---", "gallery:", "  - src: a", "---", "body"];
    expect(topLevelRangeFrom(lines, 1)).toEqual({ end: 3, start: 1 });
  });

  it("keeps blank lines inside the range", () => {
    const lines = ["gallery:", "  - src: a", "", "", "image: x"];
    expect(topLevelRangeFrom(lines, 0)).toEqual({ end: 4, start: 0 });
  });

  it("runs to the end of the file when nothing follows", () => {
    const lines = ["gallery:", "  - src: a"];
    expect(topLevelRangeFrom(lines, 0)).toEqual({ end: 2, start: 0 });
  });

  it("does not treat indented keys as top-level", () => {
    const lines = ["gallery:", "  src: a", "  credit: b", "image: x"];
    expect(topLevelRangeFrom(lines, 0)).toEqual({ end: 3, start: 0 });
  });
});
