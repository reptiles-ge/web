import { describe, expect, it } from "vitest";

import {
  splitSpeciesInlineLinks,
  stripSpeciesInlineLinks,
} from "@/lib/speciesInlineLinks";

describe("splitSpeciesInlineLinks", () => {
  it("returns a single text part when there are no links", () => {
    expect(splitSpeciesInlineLinks("Plain text.")).toEqual([
      { key: "t:0", type: "text", value: "Plain text." },
    ]);
  });

  it("returns a text part even for an empty string", () => {
    expect(splitSpeciesInlineLinks("")).toEqual([
      { key: "t:0", type: "text", value: "" },
    ]);
  });

  it("splits text around a species link", () => {
    expect(
      splitSpeciesInlineLinks("See [the viper](macrovipera-lebetina) here."),
    ).toEqual([
      { key: "t:0", type: "text", value: "See " },
      {
        id: "macrovipera-lebetina",
        key: "s:4:macrovipera-lebetina",
        label: "the viper",
        type: "species",
      },
      { key: "t:37", type: "text", value: " here." },
    ]);
  });

  it("handles a link at the very start or end without empty text parts", () => {
    const parts = splitSpeciesInlineLinks("[a](id-a)[b](id-b)");
    expect(parts.map((part) => part.type)).toEqual(["species", "species"]);
  });

  it("is not stateful across calls", () => {
    const text = "x [a](id-a)";
    expect(splitSpeciesInlineLinks(text)).toEqual(
      splitSpeciesInlineLinks(text),
    );
  });

  it("ignores links whose target is not a species id", () => {
    const parts = splitSpeciesInlineLinks(
      "[x](https://example.com) and [y](A_B)",
    );
    expect(parts).toHaveLength(1);
    expect(parts[0].type).toBe("text");
  });
});

describe("stripSpeciesInlineLinks", () => {
  it("keeps the label and drops the target", () => {
    expect(
      stripSpeciesInlineLinks(
        "A [viper](vipera-berus) and [a toad](bufo-bufo).",
      ),
    ).toBe("A viper and a toad.");
  });

  it("leaves other text and non-species links alone", () => {
    expect(stripSpeciesInlineLinks("[x](https://example.com)")).toBe(
      "[x](https://example.com)",
    );
  });
});
