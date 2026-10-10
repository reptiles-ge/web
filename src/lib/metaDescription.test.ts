import { describe, expect, it } from "vitest";

import {
  sentenceMetaDescription,
  shortMetaDescription,
} from "@/lib/metaDescription";

describe("sentenceMetaDescription", () => {
  it("keeps short text unchanged", () => {
    expect(sentenceMetaDescription("One sentence.")).toBe("One sentence.");
  });

  it("keeps whole sentences that fit", () => {
    const text = `A${"a".repeat(70)}. B${"b".repeat(70)}. C${"c".repeat(70)}.`;
    expect(sentenceMetaDescription(text)).toBe(
      `A${"a".repeat(70)}. B${"b".repeat(70)}.`,
    );
  });

  it("splits Georgian sentences and sentences that start with a number", () => {
    const text = `${"ა".repeat(80)}. 2017 წლიდან ${"ბ".repeat(80)}. ${"გ".repeat(10)}.`;
    expect(sentenceMetaDescription(text)).toBe(`${"ა".repeat(80)}.`);
  });

  it("does not split before a lowercase word", () => {
    const text = `Studies frogs, e.g. tree frogs ${"x".repeat(140)}. Next.`;
    expect(sentenceMetaDescription(text)).toBe(
      `Studies frogs, e.g. tree frogs ${"x".repeat(140)}.`,
    );
  });

  it("returns a long first sentence whole instead of cutting it", () => {
    const text = `${"word ".repeat(40).trim()}. Second.`;
    const result = sentenceMetaDescription(text);
    expect(result).toBe(`${"word ".repeat(40).trim()}.`);
    expect(result).not.toMatch(/…$/);
  });

  it("differs from shortMetaDescription, which clips mid-sentence", () => {
    const text = `${"word ".repeat(40).trim()}. Second.`;
    expect(shortMetaDescription(text)).toMatch(/…$/);
  });
});
