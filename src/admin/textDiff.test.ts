import { describe, expect, it } from "vitest";

import { diffWords } from "./textDiff";

describe("diffWords", () => {
  it("marks changed words and keeps the rest", () => {
    expect(
      diffWords(
        "გველი ცხოვრობს მშრალ ფერდობზე",
        "გველი ბინადრობს მშრალ ფერდობზე",
      ),
    ).toEqual([
      { kind: "same", text: "გველი " },
      { kind: "removed", text: "ცხოვრობს" },
      { kind: "added", text: "ბინადრობს" },
      { kind: "same", text: " მშრალ ფერდობზე" },
    ]);
  });

  it("handles text added at the end or removed from the start", () => {
    expect(diffWords("a b", "a b c")).toEqual([
      { kind: "same", text: "a b" },
      { kind: "added", text: " c" },
    ]);
    expect(diffWords("x a", "a")).toEqual([
      { kind: "removed", text: "x " },
      { kind: "same", text: "a" },
    ]);
  });

  it("falls back to a whole replacement for very long texts", () => {
    const before = Array.from({ length: 1200 }, (_, i) => `w${i}`).join(" ");
    const after = `${before} end`;
    expect(diffWords(before, after)).toEqual([
      { kind: "removed", text: before },
      { kind: "added", text: after },
    ]);
  });
});
