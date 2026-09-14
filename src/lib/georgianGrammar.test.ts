import { describe, expect, it } from "vitest";

import { georgianTanPhrase } from "@/lib/georgianGrammar";

describe("georgianTanPhrase", () => {
  it("drops final ი before თან", () => {
    expect(georgianTanPhrase("მაჩვი")).toBe("მაჩვთან");
    expect(georgianTanPhrase("წყლის გველი")).toBe("წყლის გველთან");
  });

  it("adds სთან after vowel-final names", () => {
    expect(georgianTanPhrase("გიურზა")).toBe("გიურზასთან");
  });
});
