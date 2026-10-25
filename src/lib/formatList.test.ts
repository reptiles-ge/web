import { globSync, readFileSync } from "node:fs";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import { routing } from "@/i18n/routing";
import { formatList } from "@/lib/formatList";

const root = path.resolve(__dirname, "../..");

class EnglishOnlyListFormat extends Intl.ListFormat {
  constructor(_locale?: string | string[], options?: Intl.ListFormatOptions) {
    super("en", options);
  }
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("formatList", () => {
  it("joins Georgian lists with და", () => {
    expect(formatList(["ა"], "ka")).toBe("ა");
    expect(formatList(["ა", "ბ"], "ka")).toBe("ა და ბ");
    expect(formatList(["ა", "ბ", "გ"], "ka")).toBe("ა, ბ და გ");
  });

  it("joins the other locales with their own conjunction", () => {
    expect(formatList(["a", "b", "c"], "en")).toBe("a, b, and c");
    expect(formatList(["a", "b"], "en")).toBe("a and b");
    expect(formatList(["а", "б", "в"], "ru")).toBe("а, б и в");
    expect(formatList(["a", "b", "c"], "tr")).toBe("a, b ve c");
    expect(formatList([], "tr")).toBe("");
  });

  it.each(routing.locales)(
    "matches the CLDR conjunction pattern in %s",
    (locale) => {
      const cldr = new Intl.ListFormat(locale, { type: "conjunction" });
      for (const items of [["x"], ["x", "y"], ["x", "y", "z", "w"]]) {
        expect(formatList(items, locale)).toBe(cldr.format(items));
      }
    },
  );

  it("keeps Georgian when the runtime has no Georgian list data", () => {
    vi.stubGlobal("Intl", { ...Intl, ListFormat: EnglishOnlyListFormat });
    expect(formatList(["ა", "ბ", "გ"], "ka")).toBe("ა, ბ და გ");
    expect(formatList(["ა", "ბ", "გ"], "ka")).not.toMatch(/\band\b/);
  });

  it("is the only list formatter in src", () => {
    const users = globSync("src/**/*.{ts,tsx}", { cwd: root }).filter(
      (file) =>
        !file.endsWith(".test.ts") &&
        !file.endsWith(".test.tsx") &&
        readFileSync(path.join(root, file), "utf8").includes("Intl.ListFormat"),
    );
    expect(users).toEqual([]);
  });
});
